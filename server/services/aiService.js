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
  let systemRole = "You are a technical interviewer.";

  if (trackType === "behavioral") {
    systemRole = "You are an HR interviewer asking behavioral questions.";
  }

  if (trackType === "combo") {
    systemRole =
      "You are an interviewer mixing technical and behavioral questions.";
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

    Domain: ${niche}
    Tech Stack: ${techStack?.join(", ") || "General"}
    Difficulty Level: ${difficultyLabel}
    Interview Type: ${trackType}
    Question Number: ${questionNumber} of 10 (make it ${questionProgressLabel})

    ${avoidBlock}

    Return ONLY the question text. No numbering, no labels, no extra text.
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
    Evaluate this interview answer.

    Question:
    ${question}

    Answer:
    ${answer}

    Return JSON ONLY in this format, no extra text:
    {
      "score": number (0-10),
      "feedback": "short feedback"
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