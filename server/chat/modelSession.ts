import { generateInteraction } from "./interactions.js";
import type {
  GoogleGenAI,
  GenerateContentParameters,
  GenerateContentResponse,
} from "@google/genai";
export function createModelSession(
  ai: GoogleGenAI,
  configured: string,
  mode: "auto" | "generate_content" | "interactions" = "auto",
) {
  let current = configured.replace(/^models\//, "").trim();
  let discovery: Promise<string> | undefined;
  async function discover(): Promise<string> {
    const models = await ai.models.list({
      config: { pageSize: 100, httpOptions: { timeout: 4000 } },
    });
    const candidates: string[] = [];
    let count = 0;
    for await (const model of models) {
      const name = model.name?.replace(/^models\//, "");
      if (
        name &&
        /^gemini-[a-z0-9.-]+$/i.test(name) &&
        name !== current &&
        model.supportedActions?.includes("generateContent") &&
        !/image|audio|tts|live|native|robotics|computer|embedding/i.test(name)
      )
        candidates.push(name);
      if (++count >= 100) break;
    }
    const score = (name: string) =>
      (name.includes("flash") ? 10 : 0) -
      (/preview|experimental|exp-/.test(name) ? 3 : 0) -
      (name.includes("lite") ? 1 : 0);
    candidates.sort(
      (a, b) =>
        score(b) - score(a) || b.localeCompare(a, undefined, { numeric: true }),
    );
    if (!candidates.length)
      throw Object.assign(new Error("No available text model"), {
        status: 404,
      });
    return candidates[0];
  }
  const generate = (request: GenerateContentParameters) =>
    mode === "interactions" ||
    (mode === "auto" && /^gemini-4(?:-|\.)/.test(request.model))
      ? generateInteraction(ai, request)
      : ai.models.generateContent(request);
  return async (
    request: (model: string) => GenerateContentParameters,
  ): Promise<GenerateContentResponse> => {
    try {
      return await generate(request(current));
    } catch (error) {
      if (
        Number(
          (error as { status?: number; statusCode?: number })?.status ??
            (error as { statusCode?: number })?.statusCode,
        ) !== 404
      )
        throw error;
      // Share discovery across router, synthesis and Search; never retry auth/quota errors.
      discovery ??= discover();
      current = await discovery;
      console.info("[chat:model]", current);
      return generate(request(current));
    }
  };
}
