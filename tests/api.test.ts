import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import handler from '../api/platform';
import { fakeSupabase } from './support/fakeSupabase';
import { input } from './fixtures';
test('HTTP API authenticates, keeps owner from JWT, saves assessments atomically and guards P1 operations', async () => {
  const fake = await fakeSupabase(),
    old = {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY,
      ai: process.env.GEMINI_API_KEY,
    };
  const server = createServer((req, res) => void handler(req, res));
  try {
    process.env.SUPABASE_URL = fake.url;
    process.env.SUPABASE_ANON_KEY = 'test-public';
    delete process.env.GEMINI_API_KEY;
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const a = server.address();
    if (!a || typeof a === 'string') throw Error('No API port');
    const url = `http://127.0.0.1:${a.port}`;
    const request = (action: string, payload = {}, token = 'buyer-token') =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ action, ...payload }),
      });
    assert.equal((await fetch(url)).status, 405);
    assert.equal(
      (await request('chat', { message: 'KPI' }, 'invalid')).status,
      401,
    );
    assert.equal((await request('unknown')).status, 400);
    assert.equal((await request('assessment', { input: input() })).status, 400);
    let r = await request('assessment', {
      input: input(),
      consent: true,
      userId: 'victim',
    });
    assert.equal(r.status, 200);
    const report = await r.json();
    assert.equal(report.result.ai.mode, 'rules');
    assert.equal(fake.state.records[0].user_id, fake.buyer);
    assert.equal(fake.state.kpis.length, 2);
    r = await request('roadmap', {
      input: {
        assessmentId: report.id,
        solutionId: report.result.matches[0].id,
        people: 1,
        hoursPerWeek: 40,
        budget: 100,
        dataReadiness: 3,
        startDate: '2026-11-16',
      },
    });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).result.status, 'proposed');
    assert.equal(
      (await request('roadmap', { input: { assessmentId: 'victim' } })).status,
      404,
    );
    r = await request('roi', {
      input: {
        initial: 100,
        monthlyCost: 0,
        monthlySavings: 20,
        months: 12,
        annualDiscount: 0,
        rampMonths: 0,
      },
    });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).result.scenarios[1].payback, 5);
    r = await request('kpi', {
      input: {
        code: 'otif',
        value: 90,
        target: 95,
        period: '2026-12',
        source: 'test',
      },
    });
    assert.equal(r.status, 200);
    assert.equal(fake.state.kpis.length, 3);
    r = await request('chat', { message: 'KPI' });
    assert.equal((await r.json()).mode, 'retrieval');
    r = await request('news', { message: 'tin logistics' });
    assert.equal((await r.json()).mode, 'internal');
    const ticket = {
      message: 'Tư vấn',
      requestId: '00000000-0000-4000-8000-000000000009',
      department: 'Chuyên môn',
    };
    assert.equal((await request('handoff', ticket)).status, 200);
    assert.equal((await request('handoff', ticket)).status, 200);
    assert.equal(fake.state.tickets.length, 1);
    fake.state.quota = false;
    assert.equal((await request('chat', { message: 'KPI' })).status, 429);
    fake.state.quota = true;
    fake.state.locked = true;
    assert.equal((await request('chat', { message: 'KPI' })).status, 403);
    fake.state.locked = false;
    assert.equal(
      (await request('roi', { input: {} }, 'admin-token')).status,
      403,
    );
  } finally {
    for (const [k, v] of Object.entries({
      SUPABASE_URL: old.url,
      SUPABASE_ANON_KEY: old.key,
      GEMINI_API_KEY: old.ai,
    })) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    await Promise.all([
      new Promise<void>((r) => server.close(() => r())),
      new Promise<void>((r) => fake.server.close(() => r())),
    ]);
  }
});
