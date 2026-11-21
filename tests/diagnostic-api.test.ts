import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/diagnostic";
import { questionsFor } from "../src/lib/diagnostic";
test("authenticated endpoint persists the full evidence/hypothesis snapshot and rejects invalid KPI before insert", async () => {
  const originalFetch = globalThis.fetch;
  const keys = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ];
  const previous = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  process.env.SUPABASE_URL = "https://unit.supabase.co";
  process.env.SUPABASE_ANON_KEY = "synthetic-public-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "synthetic-server-key";
  delete process.env.GEMINI_API_KEY;
  const userId = "00000000-0000-0000-0000-000000000001";
  const writes: any[] = [];
  globalThis.fetch = async (url: any, options: any = {}) => {
    const path = new URL(
      typeof url === "string" ? url : (url.url ?? String(url)),
    ).pathname;
    let data: unknown;
    if (path === "/auth/v1/user")
      data = {
        id: userId,
        aud: "authenticated",
        role: "authenticated",
        email: "test@example.test",
      };
    else if (path === "/rest/v1/profiles")
      data = { id: userId, role: "BUYER", status: "active" };
    else if (path === "/rest/v1/rpc/consume_api_quota") data = true;
    else if (path === "/rest/v1/assessments") {
      writes.push(JSON.parse(options.body));
      data = {
        id: "00000000-0000-0000-0000-000000000010",
        created_at: "2026-11-20T00:00:00Z",
      };
    } else throw new Error(`Unexpected request ${path}`);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  async function call(body: any, authorized = true) {
    let status = 200,
      payload: any;
    const res = {
      setHeader() {},
      status(value: number) {
        status = value;
        return this;
      },
      json(value: any) {
        payload = value;
        return this;
      },
    };
    await handler(
      {
        method: "POST",
        headers: authorized
          ? { authorization: "Bearer synthetic-user-token" }
          : {},
        body,
      } as any,
      res as any,
    );
    return { status, payload };
  }
  try {
    const body = {
      branch: "VT",
      scale: "nho",
      budget: 100,
      people: 3,
      data: 3,
      leadership: 3,
      answers: Object.fromEntries(questionsFor("VT").map((q) => [q.id, 3])),
      baseline: { name: "Đúng hạn", value: 82, unit: "%" },
      operationalKpis: [{ code: "empty_running_rate", value: 32, target: 15 }],
    };
    const good = await call(body);
    assert.equal(good.status, 200);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].user_id, userId);
    assert.equal(writes[0].result.analysis.issues[0].comparison.observed, 32);
    assert(
      writes[0].result.analysis.issues[0].hypotheses[0].verificationRequests
        .length,
    );
    const bad = await call({
      ...body,
      operationalKpis: [{ code: "empty_running_rate", value: 999 }],
    });
    assert.equal(bad.status, 400);
    assert.equal(writes.length, 1);
    const unauthenticated = await call(body, false);
    assert.equal(unauthenticated.status, 401);
    assert.equal(writes.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
