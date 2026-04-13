import asyncHandler from "express-async-handler";
import InterviewSession from "../models/InterviewSession.js";
import User from "../models/User.js";
import { generateQuestion, evaluateAnswer } from "../services/aiService.js";
import { transcribeAudio } from "../services/whisperService.js";

const isBlank = (str) => !str || str.trim().length === 0;
const VALID_TRACKS = ["niche", "behavioral", "combo"];

/*
  START INTERVIEW
*/
const startInterview = asyncHandler(async (req, res) => {
  const { trackType, level, techStack } = req.body;

  // trackType validation
  if (!VALID_TRACKS.includes(trackType)) {
    res.status(400);
    throw new Error("Invalid trackType");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (level > user.progress[trackType]) {
    res.status(403);
    throw new Error("Level is locked");
  }

  // block multiple active sessions
  const existing = await InterviewSession.findOne({
    user: user._id,
    status: "in-progress",
  });

  if (existing) {
    res.status(400);
    throw new Error("You have an active session. Finish it first.");
  }

  const finalTechStack = techStack && techStack.length > 0 ? techStack : user.techStack;

  // AI error handling
  let firstQuestion;
  try {
    firstQuestion = await generateQuestion({
      niche: user.chosenNiche,
      techStack: finalTechStack,
      level,
      trackType,
      questionNumber: 1,
      previousQuestions: [],
    });
  } catch (err) {
    res.status(502);
    throw new Error(`Failed to generate question: ${err.message}`);
  }

  const session = await InterviewSession.create({
    user: user._id,
    trackType,
    level,
    niche: user.chosenNiche,
    techStack: finalTechStack,
    questions: [{ question: firstQuestion }],
    status: "in-progress",
  });

  res.status(201).json({
    sessionId: session._id,
    question: firstQuestion,
    questionNumber: 1,
  });
});

/*
  SUBMIT ANSWER
*/
const submitAnswer = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("MIMETYPE:", req.file?.mimetype);
  const { sessionId } = req.body;
  let answer = req.body.answer;
  if (req.file) {
    try {
      answer = await transcribeAudio(req.file.buffer, req.file.mimetype);
    } catch (err) {
      res.status(502);
      throw new Error(`Transcription failed: ${err.message}`);
    }
  }

  // empty answer guard
  if (isBlank(answer)) {
    res.status(400);
    throw new Error("Answer cannot be empty");
  }

  const session = await InterviewSession.findById(sessionId);

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // session ownership check
  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this session");
  }

  if (session.status === "completed") {
    res.status(400);
    throw new Error("Interview already completed");
  }

  const currentIndex = session.questions.length - 1;
  const currentQuestion = session.questions[currentIndex];

  if (!currentQuestion) {
    res.status(400);
    throw new Error("No active question found");
  }

  // evaluate answer
  let score, feedback;
  try {
    ({ score, feedback } = await evaluateAnswer({
      question: currentQuestion.question,
      answer,
    }));
  } catch (err) {
    res.status(502);
    throw new Error(`Failed to evaluate answer: ${err.message}`);
  }

  currentQuestion.answer = answer;
  currentQuestion.score = score;
  currentQuestion.feedback = feedback;
  session.markModified("questions");

  const isLastQuestion = session.questions.length >= 3;

  // auto finish on last question
  if (isLastQuestion) {
    const answered = session.questions.filter((q) => q.answer);
    const totalScore = answered.reduce((acc, q) => acc + q.score, 0);
    const avgScore = totalScore / answered.length;

    session.finalScore = parseFloat(avgScore.toFixed(2));
    session.passed = avgScore >= 6;
    session.status = "completed";

    await session.save();

    const user = await User.findById(session.user);
    if (
      session.passed &&
      user.progress[session.trackType] === session.level &&
      session.level < 3
    ) {
      user.progress[session.trackType] = session.level + 1;
      await user.save();
    }

    return res.json({
      score,
      feedback,
      done: true,
      finalScore: session.finalScore,
      passed: session.passed,
      breakdown: session.questions.map((q) => ({
        question: q.question,
        score: q.score,
        feedback: q.feedback,
      })),
    });
  }

  // generate next question
  const previousQuestions = session.questions.map((q) => q.question);
  const nextQuestionNumber = session.questions.length + 1;

  let nextQuestion;
  try {
    nextQuestion = await generateQuestion({
      niche: session.niche,
      techStack: session.techStack,
      level: session.level,
      trackType: session.trackType,
      questionNumber: nextQuestionNumber,
      previousQuestions,
    });
  } catch (err) {
    res.status(502);
    throw new Error(`Failed to generate next question: ${err.message}`);
  }

  session.questions.push({ question: nextQuestion });
  await session.save();

  res.json({
    score,
    feedback,
    done: false,
    nextQuestion,
    questionNumber: nextQuestionNumber,
  });
});

/*
  FINISH INTERVIEW
  Kept for manual calls / edge cases
*/
const finishInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  const session = await InterviewSession.findById(sessionId);

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this session");
  }

  if (session.questions.length === 0) {
    res.status(400);
    throw new Error("No questions answered");
  }

  const answered = session.questions.filter((q) => q.answer);

  if (answered.length === 0) {
    res.status(400);
    throw new Error("No answered questions found");
  }

  const totalScore = answered.reduce((acc, q) => acc + q.score, 0);
  const avgScore = totalScore / answered.length;

  session.finalScore = parseFloat(avgScore.toFixed(2));
  session.passed = avgScore >= 6;
  session.status = "completed";

  await session.save();

  if (session.passed) {
    const user = await User.findById(session.user);
    if (
      user.progress[session.trackType] === session.level &&
      session.level < 3
    ) {
      user.progress[session.trackType] = session.level + 1;
      await user.save();
    }
  }

  res.json({
    finalScore: session.finalScore,
    passed: session.passed,
    totalQuestions: answered.length,
    breakdown: answered.map((q) => ({
      question: q.question,
      score: q.score,
      feedback: q.feedback,
    })),
  });
});

/*
  GET INTERVIEW HISTORY
*/
const getInterviewHistory = asyncHandler(async (req, res) => {
  const history = await InterviewSession.find({
    user: req.user._id,
    status: "completed",
  }).sort({ createdAt: -1 });

  res.json(history);
});

export { startInterview, submitAnswer, finishInterview, getInterviewHistory };