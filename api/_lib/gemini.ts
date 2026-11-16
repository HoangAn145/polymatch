import { GoogleGenAI } from "@google/genai";
import { HttpError } from "./http.js";
export async function generate(system: string, contents: string, news = false) {
  const key = process.env.GEMINI_API_KEY;
  if (!key)
    throw new HttpError(
      503,
      "Chưa cấu hình Gemini. Bạn vẫn có thể tra cứu FAQ đã duyệt.",
    );
  const ai = new GoogleGenAI({ apiKey: key });
  return ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: system,
      temperature: 0.2,
      maxOutputTokens: 1800,
      httpOptions: { timeout: 30000 },
      ...(news ? { tools: [{ googleSearch: {} }] } : {}),
    },
  });
}
