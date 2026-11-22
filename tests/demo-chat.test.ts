import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/demo-chat";
test("Seller/Admin demo chat retrieves approved knowledge with a dedicated Buyer JWT, never service-role query privileges", async () => {
  const keys = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
    "DEMO_LOGIN_ENABLED",
  ];
  const before = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  const original = globalThis.fetch;
  process.env.SUPABASE_URL = "https://unit.supabase.co";
  process.env.SUPABASE_ANON_KEY = "public-unit";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "private-service-unit";
  delete process.env.GEMINI_API_KEY;
  delete process.env.DEMO_LOGIN_ENABLED;
  const id = "00000000-0000-0000-0000-000000000099";
  const user = {
    id,
    email: "demo-buyer@polymatch.example",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { public_demo: true },
  };
  const profile = { id, role: "BUYER", status: "active" };
  const queries: { url: URL; headers: Headers }[] = [];
  globalThis.fetch = async (input: any, options: any = {}) => {
    const request = typeof input === "string" ? null : input;
    const url = new URL(
      typeof input === "string" ? input : (input.url ?? String(input)),
    );
    const headers = new Headers(options.headers || request?.headers);
    let data: any;
    if (url.pathname === "/rest/v1/profiles")
      data = url.searchParams.has("email") ? [profile] : profile;
    else if (url.pathname === `/auth/v1/admin/users/${id}`) data = user;
    else if (url.pathname === "/auth/v1/admin/generate_link")
      data = {
        ...user,
        hashed_token: "one-time-hash",
        action_link: "https://unit.example/link",
        verification_type: "magiclink",
      };
    else if (url.pathname === "/auth/v1/verify")
      data = {
        access_token: "dedicated-demo-token",
        refresh_token: "demo-refresh",
        expires_in: 3600,
        token_type: "bearer",
        user,
      };
    else if (url.pathname === "/auth/v1/user") data = user;
    else if (url.pathname === "/rest/v1/rpc/consume_api_quota") data = true;
    else if (url.pathname === "/rest/v1/knowledge_documents") {
      queries.push({ url, headers });
      data = [
        {
          id: "TECH-DEMO",
          title: "TMS",
          category: "Cong_nghe_CDS",
          content: "TMS giúp điều phối vận tải.",
          source: "Synthetic approved knowledge",
        },
      ];
    } else if (url.pathname === "/rest/v1/rpc/record_chat_response") data = id;
    else if (url.pathname === "/rest/v1/chat_queries") data = [];
    else throw new Error("Unexpected mocked endpoint " + url.pathname);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  async function call(body: any) {
    let status = 200,
      payload: any;
    const res: any = {
      setHeader() {},
      status(n: number) {
        status = n;
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
        body,
        headers: { authorization: "Bearer arbitrary-client-token" },
      } as any,
      res,
    );
    return { status, payload };
  }
  try {
    const result = await call({ question: "TMS là gì?", mode: "auto" });
    assert.equal(result.status, 200, JSON.stringify(result.payload));
    assert.equal(result.payload.sources[0].title, "TMS");
    assert.equal(result.payload.access_token, undefined);
    assert(queries.length > 0);
    for (const q of queries) {
      assert.equal(q.url.searchParams.get("status"), "eq.approved");
      assert.equal(
        q.headers.get("authorization"),
        "Bearer dedicated-demo-token",
      );
      assert(!JSON.stringify(result.payload).includes("private-service-unit"));
    }
    assert.deepEqual((await call({ action: "history" })).payload.history, []);
    assert.equal((await call({ question: "TMS", role: "ADMIN" })).status, 400);
  } finally {
    globalThis.fetch = original;
    for (const k of keys)
      if (before[k] === undefined) delete process.env[k];
      else process.env[k] = before[k];
  }
});
