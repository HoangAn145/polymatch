import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateInteraction,
  interactionResponse,
} from "../server/chat/interactions";
import { createModelSession } from "../server/chat/modelSession";
test("Hydrogen uses Interactions with structured grounding, bounded output and no remote history storage", async () => {
  let body: any, options: any;
  const ai: any = {
    interactions: {
      async create(b: any, o: any) {
        body = b;
        options = o;
        return { output_text: '{"intent":"technology"}' };
      },
    },
  };
  const run = createModelSession(ai, "models/gemini-4-hydrogen");
  const result = await run((model) => ({
    model,
    contents: "TMS?",
    config: {
      systemInstruction: "system",
      responseJsonSchema: { type: "object" },
      maxOutputTokens: 500,
      httpOptions: { timeout: 4000 },
    },
  }));
  assert.equal(result.text, '{"intent":"technology"}');
  assert.equal(body.model, "models/gemini-4-hydrogen");
  assert.equal(body.store, false);
  assert.equal(body.automatic_continuation, false);
  assert.equal(body.generation_config.thinking_level, "low");
  assert.equal(body.generation_config.max_output_tokens, 500);
  assert.equal(body.response_format.mime_type, "application/json");
  assert.equal(options.timeout_ms, 4000);
});
test("Interactions Search retains only byte-attributed final output", async () => {
  const text = "Phát thải được theo dõi.";
  const response = interactionResponse({
    output_text: text,
    steps: [
      {
        type: "model_output",
        content: [
          {
            type: "text",
            text,
            annotations: [
              {
                type: "url_citation",
                url: "https://example.org/report",
                start_index: 0,
                end_index: new TextEncoder().encode(text).length,
              },
            ],
          },
        ],
      },
    ],
  });
  assert.equal(
    response.candidates![0].groundingMetadata!.groundingSupports![0].segment!
      .text,
    text,
  );
  const empty = interactionResponse({
    output_text: text,
    steps: [
      {
        type: "google_search_result",
        content: [{ type: "text", text: "uncited result" }],
      },
    ],
  });
  assert.equal(
    empty.candidates![0].groundingMetadata!.groundingChunks!.length,
    0,
  );
  let body: any;
  await generateInteraction(
    {
      interactions: {
        create: async (b: any) => {
          body = b;
          return { output_text: text };
        },
      },
    } as any,
    {
      model: "gemini-4-hydrogen",
      contents: "query",
      config: { tools: [{ googleSearch: {} }] },
    },
  );
  assert.equal(body.tools[0].type, "google_search");
  assert(!body.response_format);
});

test("Interactions SDK statusCode errors retain safe quota diagnostics", async () => {
  const { geminiFailure } = await import("../server/chat/providerError");
  assert.equal(
    geminiFailure({ statusCode: 429, message: "private" }).code,
    "GEMINI_QUOTA",
  );
});
