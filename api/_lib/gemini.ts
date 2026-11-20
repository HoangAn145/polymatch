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

export async function generateStructuredAnalysis(
  instruction: string,
  contents: string,
  schema: Record<string, unknown>,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new HttpError(503, "Chưa cấu hình Gemini.");
  const response = await new GoogleGenAI({
    apiKey: key,
  }).models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: instruction,
      temperature: 0.1,
      maxOutputTokens: 6500,
      responseMimeType: "application/json",
      responseJsonSchema: schema,
      httpOptions: { timeout: 30000 },
    },
  });
  if (!response.text) throw new Error("Gemini không trả dữ liệu phân tích.");
  return response.text;
}
