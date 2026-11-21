import { test } from "node:test";
import assert from "node:assert/strict";
import { withDeadline } from "../server/chat/deadline";
import { routeQuestion } from "../server/chat/router";
import { generateInteraction } from "../server/chat/interactions";
test("deadline returns promptly and aborts even an SDK that never settles", async () => {
  let signal: AbortSignal;
  await assert.rejects(
    withDeadline(15, async (s) => {
      signal = s;
      return new Promise(() => {});
    }),
    (e) => (e as Error).name === "TimeoutError",
  );
  assert.equal(signal!.aborted, true);
  assert.equal(await withDeadline(1000, async () => "ok"), "ok");
});
test("TMS questions skip the remote intent call and use only synthesis", async () => {
  let called = false;
  const route = await routeQuestion("TMS là gì?", "auto", async () => {
    called = true;
    throw new Error();
  });
  assert.equal(called, false);
  assert.equal(route.intent, "technology");
});
test("Interactions disables retries and enforces the synthesis deadline", async () => {
  let options: any;
  const ai: any = {
    interactions: {
      create: async (_body: any, o: any) => {
        options = o;
        return new Promise(() => {});
      },
    },
  };
  await assert.rejects(
    generateInteraction(ai, {
      model: "gemini-4-hydrogen",
      contents: "TMS",
      config: { httpOptions: { timeout: 15 } },
    }),
    (e) => (e as Error).name === "TimeoutError",
  );
  assert.equal(options.signal.aborted, true);
  assert.equal(options.retries.strategy, "none");
});
