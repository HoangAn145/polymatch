import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("migrations, signup privilege isolation, ownership, approval, quota and audit", async () => {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
  await db.exec(
    await readFile(
      new URL("../supabase/migrations/001_platform.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(
    "insert into knowledge_documents(id,category,title,content,source) values('TEST-FAQ','FAQ','Synthetic test question','Synthetic test answer','https://example.test')",
  );
  await db.exec(
    await readFile(
      new URL("../supabase/migrations/002_admin_audit.sql", import.meta.url),
      "utf8",
    ),
  );
  const a = "00000000-0000-0000-0000-000000000001",
    b = "00000000-0000-0000-0000-000000000002",
    admin = "00000000-0000-0000-0000-000000000003";
  await db.query(
    `insert into auth.users values($1,'a@test.test','{"role":"ADMIN"}'),($2,'b@test.test','{"role":"SELLER"}'),($3,'admin@test.test','{}')`,
    [a, b, admin],
  );
  const signup = await db.query<{ role: string }>(
    "select role from profiles where id=$1",
    [a],
  );
  assert.equal(signup.rows[0].role, "BUYER");
  await db.query("update profiles set role='ADMIN' where id=$1", [admin]);
  const asUser = async (id: string) => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
    await db.exec("set role authenticated");
  };
  await asUser(a);
  await db.query("insert into enterprises(user_id,data) values($1,'{}')", [a]);
  await assert.rejects(
    () =>
      db.query("insert into enterprises(user_id,data) values($1,'{}')", [b]),
    /row-level security/,
  );
  await db.query("update profiles set role='ADMIN' where id=$1", [a]);
  assert.equal(
    (
      await db.query<{ role: string }>(
        "select role from profiles where id=$1",
        [a],
      )
    ).rows[0].role,
    "BUYER",
  );
  assert.equal(
    (await db.query("select * from knowledge_documents")).rows.length,
    0,
  );
  await db.query(
    "insert into support_tickets(user_id,question) values($1,'Cần hỗ trợ')",
    [a],
  );
  await assert.rejects(
    () =>
      db.query(
        "insert into support_tickets(user_id,question,status) values($1,'Giả mạo','resolved')",
        [a],
      ),
    /row-level security/,
  );
  await assert.rejects(
    () =>
      db.query("insert into assessments(user_id,result) values($1,'{}')", [a]),
    /permission denied/,
  );
  for (let i = 0; i < 20; i++)
    assert.equal(
      (
        await db.query<{ consume_api_quota: boolean }>(
          "select consume_api_quota()",
        )
      ).rows[0].consume_api_quota,
      true,
    );
  assert.equal(
    (
      await db.query<{ consume_api_quota: boolean }>(
        "select consume_api_quota()",
      )
    ).rows[0].consume_api_quota,
    false,
  );
  await asUser(b);
  assert.equal((await db.query("select * from enterprises")).rows.length, 0);
  assert.equal(
    (await db.query("select * from support_tickets")).rows.length,
    0,
  );
  await asUser(admin);
  assert.equal(
    (await db.query("select * from knowledge_documents")).rows.length,
    1,
  );
  await db.query(
    "update knowledge_documents set status='approved',reviewed_by=$1,reviewed_at=now() where id='TEST-FAQ'",
    [admin],
  );
  assert.equal(
    (
      await db.query(
        "select * from admin_audit where table_name='knowledge_documents'",
      )
    ).rows.length,
    1,
  );
  await asUser(a);
  assert.equal(
    (await db.query("select * from knowledge_documents")).rows.length,
    1,
  );
  assert.equal((await db.query("select * from admin_audit")).rows.length, 0);
  await asUser(admin);
  await db.query("update profiles set status='locked' where id=$1", [a]);
  await asUser(a);
  assert.equal(
    (await db.query("select * from knowledge_documents")).rows.length,
    0,
  );
  assert.equal((await db.query("select * from enterprises")).rows.length, 0);
  await db.close();
});
