import { test } from "node:test";
import assert from "node:assert/strict";
import { createModelSession } from "../server/chat/modelSession";
test("404 discovers actual text models and shares the replacement across chat calls", async () => {
  const calls: string[] = [];
  let lists = 0;
  const ai: any = {
    models: {
      async generateContent(p: any) {
        calls.push(p.model);
        if (p.model === "missing") throw { status: 404 };
        return { text: "OK" };
      },
      async list() {
        lists++;
        return (async function* () {
          yield {
            name: "models/gemini-9-flash-image",
            supportedActions: ["generateContent"],
          };
          yield {
            name: "models/gemini-9-flash",
            supportedActions: ["generateContent"],
          };
          yield {
            name: "models/gemini-9-embedding",
            supportedActions: ["embedContent"],
          };
        })();
      },
    },
  };
  const run = createModelSession(ai, "models/missing");
  assert.equal(
    (await run((model) => ({ model, contents: "hello" }))).text,
    "OK",
  );
  await run((model) => ({
    model,
    contents: "search",
    config: { tools: [{ googleSearch: {} }] },
  }));
  assert.deepEqual(calls, ["missing", "gemini-9-flash", "gemini-9-flash"]);
  assert.equal(lists, 1);
});
test("quota and permission failures do not trigger model discovery", async () => {
  for (const status of [400, 401, 403, 429, 500]) {
    let listed = false;
    const run = createModelSession(
      {
        models: {
          generateContent: async () => {
            throw { status };
          },
          list: async () => {
            listed = true;
          },
        },
      } as any,
      "configured",
    );
    await assert.rejects(run((model) => ({ model, contents: "hi" })));
    assert.equal(listed, false);
  }
});
test("no valid replacement preserves an explicit 404", async () => {
  const run = createModelSession(
    {
      models: {
        generateContent: async () => {
          throw { status: 404 };
        },
        list: async () =>
          (async function* () {
            yield {
              name: "models/image-only",
              supportedActions: ["generateContent"],
            };
          })(),
      },
    } as any,
    "missing",
  );
  await assert.rejects(
    run((model) => ({ model, contents: "hi" })),
    (e) => (e as any).status === 404,
  );
});
