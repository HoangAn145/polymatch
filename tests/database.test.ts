import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
const file = (name: string) =>
  readFile(new URL('../' + name, import.meta.url), 'utf8');
test('PostgreSQL: migrations, atomic writes, tenant RLS, quotas, workbook drafts, approval search and idempotency', async () => {
  const db = new PGlite(),
    alice = '00000000-0000-4000-8000-000000000001',
    bob = '00000000-0000-4000-8000-000000000002',
    admin = '00000000-0000-4000-8000-000000000003';
  try {
    await db.exec(
      `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}');create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
    );
    for (const name of [
      '202611160001_pm_platform.sql',
      '202611160002_pm_search.sql',
      '202611160003_pm_atomic_assessment.sql',
    ])
      await db.exec(await file('supabase/migrations/' + name));
    const imports = await file('data/chatbot/import-drafts.sql');
    await db.exec(imports);
    await db.exec(imports);
    await db.exec(await file('supabase/seed-solutions.sql'));
    assert.equal(
      (
        await db.query<{ n: number }>(
          'select count(*)::int n from pm_knowledge',
        )
      ).rows[0].n,
      131,
    );
    assert.equal(
      (
        await db.query<{ n: number }>(
          'select count(*)::int n from pm_reference',
        )
      ).rows[0].n,
      23,
    );
    await db.query(
      `insert into auth.users(id,raw_user_meta_data) values($1,'{"role":"ADMIN"}'),($2,'{"role":"SELLER"}'),($3,'{}')`,
      [alice, bob, admin],
    );
    assert.equal(
      (
        await db.query<{ role: string }>(
          'select role from pm_profiles where id=$1',
          [alice],
        )
      ).rows[0].role,
      'BUYER',
    );
    await db.query("update pm_profiles set role='ADMIN' where id=$1", [admin]);
    const asUser = async (id: string) => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec('set role authenticated');
    };
    await asUser(alice);
    assert.equal((await db.query('select * from pm_knowledge')).rows.length, 0);
    assert.equal((await db.query('select * from pm_reference')).rows.length, 0);
    assert.equal(
      (await db.query("select * from pm_search_knowledge('TMS')")).rows.length,
      0,
    );
    await assert.rejects(
      db.query(
        "insert into pm_records(user_id,kind,input,result) values($1,'roi','{}','{}')",
        [bob],
      ),
    );
    await db.query("update pm_profiles set role='ADMIN' where id=$1", [alice]);
    assert.equal(
      (await db.query<{ role: string }>('select role from pm_profiles')).rows[0]
        .role,
      'BUYER',
    );
    await assert.rejects(db.exec('select * from pm_api_quota'));
    const kpis = [
      {
        code: 'otif',
        value: 80,
        target: 95,
        period: '2026-11',
        source: 'Report',
      },
    ];
    await db.query("select pm_save_assessment('{}','{}',$1::jsonb)", [
      JSON.stringify(kpis),
    ]);
    assert.equal((await db.query('select * from pm_records')).rows.length, 1);
    assert.equal((await db.query('select * from pm_kpis')).rows.length, 1);
    await assert.rejects(
      db.query("select pm_save_assessment('{}','{}',$1::jsonb)", [
        JSON.stringify([{ ...kpis[0], value: 101 }]),
      ]),
    );
    assert.equal((await db.query('select * from pm_records')).rows.length, 1);
    await db.query(
      "insert into pm_tickets(user_id,request_id,subject) values($1,gen_random_uuid(),'Help')",
      [alice],
    );
    await assert.rejects(
      db.query(
        "insert into pm_tickets(user_id,request_id,subject,status) values($1,gen_random_uuid(),'Fake','resolved')",
        [alice],
      ),
    );
    for (let i = 0; i < 30; i++)
      assert.equal(
        (await db.query<{ v: boolean }>('select pm_consume_quota() v')).rows[0]
          .v,
        true,
      );
    assert.equal(
      (await db.query<{ v: boolean }>('select pm_consume_quota() v')).rows[0].v,
      false,
    );
    await asUser(bob);
    assert.equal((await db.query('select * from pm_records')).rows.length, 0);
    assert.equal((await db.query('select * from pm_tickets')).rows.length, 0);
    await assert.rejects(
      db.query(
        "insert into pm_records(user_id,kind,input,result) values($1,'assessment','{}','{}')",
        [bob],
      ),
    );
    await asUser(admin);
    await db.exec(
      "update pm_knowledge set published=true where external_id in ('LOG001','TEC034')",
    );
    await asUser(alice);
    assert.ok(
      (
        await db.query<{ external_id: string }>(
          "select * from pm_search_knowledge('tms la gi')",
        )
      ).rows.some((r) => r.external_id === 'LOG001'),
    );
    assert.ok(
      (
        await db.query<{ external_id: string }>(
          "select * from pm_search_knowledge('bao mat du lieu')",
        )
      ).rows.some((r) => r.external_id === 'TEC034'),
    );
    await asUser(admin);
    await db.exec(
      "update pm_knowledge set published=false where external_id='LOG001'",
    );
    await db.query("update pm_profiles set status='locked' where id=$1", [
      alice,
    ]);
    await asUser(alice);
    assert.equal((await db.query('select * from pm_records')).rows.length, 0);
    assert.equal(
      (await db.query("select * from pm_search_knowledge('bao mat')")).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query<{ v: boolean }>('select pm_consume_quota() v')).rows[0].v,
      false,
    );
  } finally {
    await db.close();
  }
});
test('workbook preserves 168 identities and provenance; evaluation/SLA instructions are not runtime knowledge', async () => {
  const manifest = JSON.parse(await file('data/chatbot/manifest.json')),
    docs = JSON.parse(await file('data/chatbot/knowledge-drafts.json')) as {
      external_id: string;
      published: boolean;
      metadata: { origin: { sha256: string } };
    }[],
    refs = JSON.parse(await file('data/chatbot/reference-data.json')) as {
      external_id: string;
      approved: boolean;
    }[],
    cases = JSON.parse(await file('data/chatbot/evaluation-cases.json')) as {
      external_id: string;
    }[];
  assert.equal(docs.length, 131);
  assert.equal(refs.length, 23);
  assert.equal(cases.length, 14);
  assert.equal(
    new Set([...docs, ...refs, ...cases].map((r) => r.external_id)).size,
    168,
  );
  assert.ok(
    docs.every(
      (d) =>
        !d.published &&
        !/^(CS|TEST|SRC)/.test(d.external_id) &&
        d.metadata.origin.sha256 === manifest.sha256,
    ),
  );
  assert.ok(refs.every((r) => !r.approved));
  const bytes = await readFile(
    new URL('../data/chatbot/Mau_data_chatbot_POLYMATCH.xlsx', import.meta.url),
  );
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    manifest.sha256,
  );
});
