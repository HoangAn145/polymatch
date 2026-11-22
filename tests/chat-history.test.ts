import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("chat metadata migration is atomic, owner-scoped, immutable to direct client writes, and never accepts article body", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`,
    );
    for (const file of [
      "001_platform.sql",
      "002_admin_audit.sql",
      "003_chat_history.sql",
    ])
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + file, import.meta.url),
          "utf8",
        ),
      );
    const a = "00000000-0000-0000-0000-000000000001",
      b = "00000000-0000-0000-0000-000000000002";
    await db.query(
      "insert into auth.users values($1,'a@example.test','{}'),($2,'b@example.test','{}')",
      [a, b],
    );
    async function user(id: string) {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec("set role authenticated");
    }
    const response = {
      intent: "news_policy",
      strategy: "live_search",
      answer: "Tóm tắt do hệ thống tạo.",
      claims: [],
      sources: [],
      warnings: [],
      retrievedAt: "2026-11-21T00:00:00Z",
    };
    const sources = [
      {
        title: "Synthetic official source",
        url: "https://customs.gov.vn/example",
        summary: "Tóm tắt do hệ thống tạo.",
        published_on: "2026-11-20",
        adopted_on: "2026-11-10",
        issued_on: "2026-11-15",
        effective_on: "2027-01-01",
        source_type: "official",
        retrieved_at: "2026-11-21T00:00:00Z",
      },
    ];
    await user(a);
    const row = await db.query<{ id: string }>(
      "select record_chat_response($1,$2,$3,$4,$5) id",
      [
        "Câu hỏi thử nghiệm",
        "news_policy",
        "live_search",
        JSON.stringify(response),
        JSON.stringify(sources),
      ],
    );
    const queryId = row.rows[0].id;
    assert.equal((await db.query("select * from chat_queries")).rows.length, 1);
    const news = await db.query<any>(
      "select *, effective_on::text as effective_on, published_on::text as published_on from chat_news_items",
    );
    assert.equal(news.rows[0].effective_on, "2027-01-01");
    assert.equal(news.rows[0].published_on, "2026-11-20");
    assert.equal(news.rows[0].content_kind, "generated_summary");
    await assert.rejects(
      () =>
        db.query(
          "insert into chat_queries(user_id,question,intent,strategy,response) values($1,'spoof','news_policy','live_search','{}')",
          [a],
        ),
      /permission denied/,
    );
    await assert.rejects(
      () =>
        db.query("update chat_queries set question='edited' where id=$1", [
          queryId,
        ]),
      /permission denied/,
    );
    await assert.rejects(
      () =>
        db.query("select record_chat_response($1,$2,$3,$4,$5)", [
          "Câu hỏi",
          "news_policy",
          "live_search",
          JSON.stringify(response),
          JSON.stringify([
            { ...sources[0], article_body: "Full publisher text" },
          ]),
        ]),
      /Only source metadata/,
    );
    assert.equal((await db.query("select * from chat_queries")).rows.length, 1);
    await user(b);
    assert.equal((await db.query("select * from chat_queries")).rows.length, 0);
    assert.equal(
      (await db.query("select * from chat_news_items")).rows.length,
      0,
    );
    await db.query("delete from chat_queries where id=$1", [queryId]);
    await user(a);
    assert.equal((await db.query("select * from chat_queries")).rows.length, 1);
    await db.query("delete from chat_queries where id=$1", [queryId]);
    assert.equal(
      (await db.query("select * from chat_news_items")).rows.length,
      0,
    );
    await db.exec("reset role");
    await db.query("update profiles set status='locked' where id=$1", [a]);
    await user(a);
    await assert.rejects(
      () =>
        db.query("select record_chat_response($1,$2,$3,$4,$5)", [
          "Question",
          "news_policy",
          "live_search",
          JSON.stringify(response),
          "[]",
        ]),
      /Not authorized/,
    );
  } finally {
    await db.close();
  }
});
