import { test } from "node:test";
import assert from "node:assert/strict";
import { demoSession } from "../server/demo/session";
function fake(
  options: { existing?: boolean; role?: string; marker?: boolean } = {},
) {
  let exists = options.existing ?? true;
  const calls: any[] = [];
  const profile = {
    id: "demo-id",
    role: options.role || "BUYER",
    status: "active",
  };
  const admin: any = {
    from: (table: string) => ({
      select() {
        return this;
      },
      eq(key: string, value: string) {
        calls.push(["lookup", table, key, value]);
        return this;
      },
      async maybeSingle() {
        return { data: exists ? profile : null, error: null };
      },
    }),
    auth: {
      admin: {
        createUser: async (body: any) => {
          calls.push(["create", body]);
          exists = true;
          return { data: { user: { id: "demo-id" } }, error: null };
        },
        getUserById: async (id: string) => ({
          data: {
            user: {
              id,
              email: "demo-buyer@polymatch.example",
              app_metadata: { public_demo: options.marker ?? true },
            },
          },
          error: null,
        }),
        generateLink: async (body: any) => {
          calls.push(["link", body]);
          return {
            data: { properties: { hashed_token: "one-time-demo-token" } },
            error: null,
          };
        },
      },
    },
  };
  const publicClient: any = {
    auth: {
      verifyOtp: async (body: any) => {
        calls.push(["verify", body]);
        return {
          data: {
            session: {
              access_token: "demo-access",
              refresh_token: "demo-refresh",
            },
          },
          error: null,
        };
      },
    },
  };
  return { admin, publicClient, calls };
}
test("demo provisions one confirmed BUYER and uses a one-time session without passwords", async () => {
  const f = fake({ existing: false });
  const session = await demoSession(f.admin, f.publicClient);
  assert.deepEqual(session, {
    access_token: "demo-access",
    refresh_token: "demo-refresh",
  });
  const created = f.calls.find((c) => c[0] === "create")[1];
  assert.equal(created.user_metadata.role, "BUYER");
  assert.equal(created.app_metadata.public_demo, true);
  assert.equal(created.email_confirm, true);
  assert(!created.password);
  await demoSession(f.admin, f.publicClient);
  assert.equal(f.calls.filter((c) => c[0] === "create").length, 1);
  assert.equal(
    f.calls.find((c) => c[0] === "verify")[1].token_hash,
    "one-time-demo-token",
  );
});
test("demo cannot mint an Admin session or take over an unmarked existing account", async () => {
  for (const options of [{ role: "ADMIN" }, { marker: false }]) {
    const f = fake(options);
    await assert.rejects(demoSession(f.admin, f.publicClient));
    assert(!f.calls.some((c) => c[0] === "link"));
  }
});

test("public demo endpoint rejects arbitrary identity input and unsupported methods", async () => {
  const { default: handler } = await import("../api/demo-session");
  for (const [method, body, want] of [
    ["GET", {}, 405],
    ["POST", { email: "admin@example.org", role: "ADMIN" }, 400],
  ] as const) {
    let status = 200;
    let payload: any;
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
    await handler({ method, body } as any, res);
    assert.equal(status, want);
    assert.equal(typeof payload.error, "string");
  }
});
