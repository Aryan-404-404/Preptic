const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_API_MODEL;

async function callGroq(messages) {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
      }),
    });

    // #1 HTTP status check
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Groq API error ${res.status}: ${errorData?.error?.message || res.statusText}`
      );
    }

    const data = await res.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid Groq response structure");
    }

    return data.choices[0].message.content;
  } catch (err) {
    throw new Error(`AI service failed: ${err.message}`);
  }
}

// #3 strip common LLM formatting artifacts
function cleanQuestionOutput(text) {
  return text
    .replace(/^(question\s*\d*\s*[:.-]?\s*)/i, "")
    .replace(/^(here'?s?\s+(your\s+)?question\s*[:.-]?\s*)/i, "")
    .replace(/^(interview\s+question\s*[:.-]?\s*)/i, "")
    .trim();
}

/*
  Generate interview question
*/
export async function generateQuestion({
  niche,
  techStack,
  level,
  trackType,
  questionNumber = 1,
  previousQuestions = [],
}) {
  let systemRole = "You are a senior technical interviewer at a top tech startup. You ask short, sharp, real-world questions.";

  if (trackType === "behavioral") {
    systemRole = "You are an experienced HR interviewer at a top tech startup. You ask concise behavioral questions using STAR method scenarios.";
  }

  if (trackType === "combo") {
    systemRole = "You are a senior interviewer mixing short technical and behavioral questions relevant to the candidate's domain.";
  }

  const difficultyMap = { 1: "basic", 2: "intermediate", 3: "advanced" };
  const difficultyLabel = difficultyMap[level] || "basic";

  const questionProgressLabel =
    questionNumber <= 3 ? "easy" : questionNumber <= 7 ? "moderate" : "challenging";

  const avoidBlock =
    previousQuestions.length > 0
      ? `Do NOT repeat or rephrase any of these questions:\n${previousQuestions
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n")}`
      : "";

  const prompt = `
    Generate ONE interview question.

    Candidate Profile:
    - Domain: ${niche}
    - Tech Stack: ${techStack?.join(", ") || "General"}
    - Interview Type: ${trackType}
    - Difficulty: ${difficultyLabel}
    - Question ${questionNumber} of 10 (progression: ${questionProgressLabel})

    ${avoidBlock}

    Difficulty Guidelines:
    - basic: fresher-level, definition or concept questions, things you'd find in a beginner tutorial
    - intermediate: someone with 1-2 years experience, practical usage, common gotchas
    - advanced: senior-level, architecture decisions, performance, edge cases

    Strict Rules:
    - Maximum 1 sentence, 2 sentences only if absolutely necessary
    - Ask about ONE thing only — no compound or multi-part questions
    - For technical: ask about a specific concept, tool, or real scenario
    - For behavioral: ask a single situation-based question
    - Sound like a real interviewer, not a textbook
    - Do NOT use "how would you implement", "what strategies would you employ", "considering factors such as"
    - For basic difficulty, keep it genuinely simple — definitions, basic syntax, fundamental concepts only

    Good examples for basic:
    - "What is the difference between let, const and var?"
    - "What is a REST API?"
    - "What does useState do in React?"
    - "What is the box model in CSS?"
    - "Tell me about yourself and your experience so far."

    Good examples for intermediate:
    - "What's the difference between useEffect and useLayoutEffect?"
    - "How does CSS specificity work?"
    - "How do you handle disagreements with teammates?"

    Good examples for advanced:
    - "What happens when you type a URL in the browser?"
    - "How would you optimize a slow React app?"
    - "Tell me about a time you had to debug a production issue under pressure."

    Return ONLY the question. No numbering, no labels, no extra text.
  `;

  const response = await callGroq([
    { role: "system", content: systemRole },
    { role: "user", content: prompt },
  ]);

  // #3 clean output before returning
  return cleanQuestionOutput(response);
}

/*
  Evaluate answer
*/
export async function evaluateAnswer({ question, answer }) {
  const prompt = `
    Evaluate this interview answer fairly, like a supportive senior developer doing a mock interview.

    Question:
    ${question}

    Answer:
    ${answer}

    Scoring Guide:
    - 8-10: Good answer, covers the main points, minor gaps are fine
    - 6-7: Decent answer, gets the concept but missing some details
    - 4-5: Partial answer, shows some understanding but significant gaps
    - 2-3: Very weak, mostly wrong or off-topic
    - 0-1: No answer or completely irrelevant

    Rules:
    - Be encouraging, not harsh
    - If the candidate gets the core concept right, score generously (7+)
    - Don't penalize for not mentioning every edge case
    - Feedback should be 1-2 sentences max, mention what was good first then what was missing
    - For behavioral questions, score based on structure and relevance not perfection

    Return JSON ONLY in this format, no extra text:
    {
      "score": number (0-10),
      "feedback": "short encouraging feedback"
    }
  `;

  const response = await callGroq([
    { role: "system", content: "You are a strict interview evaluator." },
    { role: "user", content: prompt },
  ]);

  try {
    const cleaned = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 5,
      feedback: "Evaluation failed. Default score applied.",
    };
  }
}