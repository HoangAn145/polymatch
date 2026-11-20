import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/chat";
test("chat endpoint authenticates, records routed history, returns history, and keeps policy out of RAG without a live provider", async () => {
  const oldFetch = globalThis.fetch;
  const keys = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "GEMINI_API_KEY"];
  const before = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  process.env.SUPABASE_URL = "https://unit.supabase.co";
  process.env.SUPABASE_ANON_KEY = "synthetic-public";
  delete process.env.GEMINI_API_KEY;
  const id = "00000000-0000-0000-0000-000000000001";
  const calls: { path: string; body: any }[] = [];
  globalThis.fetch = async (url: any, options: any = {}) => {
    const path = new URL(
      typeof url === "string" ? url : (url.url ?? String(url)),
    ).pathname;
    calls.push({ path, body: options.body ? JSON.parse(options.body) : null });
    let data: any;
    if (path === "/auth/v1/user")
      data = { id, aud: "authenticated", role: "authenticated" };
    else if (path === "/rest/v1/profiles")
      data = { id, role: "BUYER", status: "active" };
    else if (path === "/rest/v1/rpc/consume_api_quota") data = true;
    else if (path === "/rest/v1/rpc/record_chat_response")
      data = "00000000-0000-0000-0000-000000000010";
    else if (path === "/rest/v1/chat_queries") data = [];
    else throw new Error("Unexpected path " + path);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  async function call(body: any, auth = true) {
    let status = 200,
      payload: any;
    const res = {
      setHeader() {},
      status(s: number) {
        status = s;
        return this;
      },
      json(p: any) {
        payload = p;
        return this;
      },
    };
    await handler(
      {
        method: "POST",
        headers: auth ? { authorization: "Bearer synthetic-token" } : {},
        body,
      } as any,
      res as any,
    );
    return { status, payload };
  }
  try {
    const answer = await call({
      question: "Chính sách thuế quan Mỹ mới nhất?",
      mode: "faq",
    });
    assert.equal(answer.status, 200);
    assert.equal(answer.payload.strategy, "live_search");
    assert.equal(answer.payload.historySaved, true);
    assert.equal(answer.payload.handoff, true);
    assert(!calls.some((c) => c.path === "/rest/v1/knowledge_documents"));
    const saved = calls.find((c) =>
      c.path.endsWith("record_chat_response"),
    )!.body;
    assert.equal(saved.p_intent, "news_policy");
    assert.deepEqual(saved.p_sources, []);
    const history = await call({ action: "history" });
    assert.equal(history.status, 200);
    assert.deepEqual(history.payload.history, []);
    const noAuth = await call({ question: "Hello" }, false);
    assert.equal(noAuth.status, 401);
  } finally {
    globalThis.fetch = oldFetch;
    for (const k of keys)
      if (before[k] === undefined) delete process.env[k];
      else process.env[k] = before[k];
  }
});
