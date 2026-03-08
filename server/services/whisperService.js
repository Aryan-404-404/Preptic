import FormData from "form-data";
import fetch from "node-fetch";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const transcribeAudio = async (fileBuffer, mimetype) => {
  const form = new FormData();
  
  form.append("file", fileBuffer, {
    filename: "answer.mp3",
    contentType: mimetype,
  });
  form.append("model", "whisper-large-v3");
  form.append("response_format", "text");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      ...form.getHeaders(),
    },
    body: form,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Whisper transcription failed: ${err}`);
  }

  return (await response.text()).trim();
};