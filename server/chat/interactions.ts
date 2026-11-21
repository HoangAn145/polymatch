import { withDeadline } from "./deadline.js";
import type {
  GenerateContentParameters,
  GenerateContentResponse,
  GoogleGenAI,
} from "@google/genai";
/** Preserve only attributed final output; never promote search results/thinking to evidence. */
export function interactionResponse(result: any): GenerateContentResponse {
  const outputs = (result.steps || []).filter(
    (s: any) => s.type === "model_output",
  );
  const parts = (outputs.at(-1)?.content || []).filter(
    (p: any) => p.type === "text" && typeof p.text === "string",
  );
  const text =
    typeof result.output_text === "string"
      ? result.output_text
      : parts.map((p: any) => p.text).join("");
  const groundingChunks: any[] = [],
    groundingSupports: any[] = [];
  for (const part of parts) {
    for (const citation of part.annotations || []) {
      if (citation.type !== "url_citation" || typeof citation.url !== "string")
        continue;
      const bytes = new TextEncoder().encode(part.text);
      const start = citation.start_index,
        end = citation.end_index;
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 0 ||
        end <= start ||
        end > bytes.length
      )
        continue;
      let segment: string;
      try {
        segment = new TextDecoder("utf-8", { fatal: true }).decode(
          bytes.slice(start, end),
        );
      } catch {
        continue;
      }
      if (!segment || !text.includes(segment)) continue;
      groundingSupports.push({
        segment: { text: segment },
        groundingChunkIndices: [groundingChunks.length],
      });
      groundingChunks.push({
        web: { uri: citation.url, title: citation.title || citation.url },
      });
    }
  }
  return {
    text,
    candidates: [{ groundingMetadata: { groundingChunks, groundingSupports } }],
  } as GenerateContentResponse;
}
export async function generateInteraction(
  ai: GoogleGenAI,
  request: GenerateContentParameters,
) {
  const config = request.config || {};
  const timeout = config.httpOptions?.timeout || 25000;
  const result = await withDeadline(timeout, (signal) =>
    ai.interactions.create(
      {
        model: `models/${request.model.replace(/^models\//, "")}`,
        input:
          typeof request.contents === "string"
            ? request.contents
            : JSON.stringify(request.contents),
        system_instruction:
          typeof config.systemInstruction === "string"
            ? config.systemInstruction
            : undefined,
        store: false,
        stream: false,
        background: false,
        automatic_continuation: false,
        generation_config: {
          max_output_tokens: config.maxOutputTokens || 4000,
          thinking_level: "low",
        },
        ...(config.responseJsonSchema
          ? {
              response_format: {
                type: "text" as const,
                mime_type: "application/json",
                schema: config.responseJsonSchema as Record<string, any>,
              },
            }
          : {}),
        ...(config.tools?.some((t) => "googleSearch" in t)
          ? { tools: [{ type: "google_search" as const }] }
          : {}),
      },
      { timeout_ms: timeout, signal, retries: { strategy: "none" } },
    ),
  );
  return interactionResponse(result);
}
