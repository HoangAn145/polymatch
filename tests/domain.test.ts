import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  diagnose,
  assessmentInput,
  simulate,
  roadmap,
  alerts,
  measurement,
  retrieve,
  FAQ,
} from '../src/platform/domain';
import { input, catalog } from './fixtures';
test('diagnostic requires complete branch answers, finite budgets and real KPI evidence', () => {
  for (const v of [
    { ...input(), answers: {} },
    { ...input(), budget: NaN },
    { ...input(), readiness: 9 },
    { ...input(), branch: 'INVALID' },
    { ...input(), kpis: [] },
    { ...input(), kpis: [{ ...input().kpis[0], value: 101 }] },
    { ...input(), kpis: input().kpis.map((k) => ({ ...k, source: '' })) },
  ])
    assert.throws(() => assessmentInput(v));
  assert.doesNotThrow(() => assessmentInput(input()));
});
test('hard filters precede ranking and explain each exclusion', () => {
  const base = catalog.find((s) => s.id === 'sol-02')!;
  const variants = [
    base,
    { ...base, id: 'hidden', published: false },
    { ...base, id: 'unchecked', approved: false },
    {
      ...base,
      id: 'unverified',
      data: { ...base.data, trang_thai_nguon: 'tham_khao' as const },
    },
    { ...base, id: 'branch', data: { ...base.data, phan_khuc: ['KB'] } },
    { ...base, id: 'budget', data: { ...base.data, gia_min_trieu: 101 } },
    {
      ...base,
      id: 'unknown',
      data: { ...base.data, gia_min_trieu: undefined },
    },
    { ...base, id: 'maturity', data: { ...base.data, muc_ldmi_phu_hop: 5 } },
    { ...base, id: 'gap', data: { ...base.data, khoang_trong_giai_quyet: [] } },
  ];
  const r = diagnose(input(), variants);
  assert.deepEqual(
    r.matches.map((s) => s.id),
    ['sol-02'],
  );
  assert.equal(r.rejected.length, 8);
  assert.ok(r.rejected.every((s) => s.reasons.length));
  assert.equal(
    r.matches[0].score,
    Object.values(r.matches[0].breakdown).reduce((a, b) => a + b, 0),
  );
});
test('perfect answers do not invent gaps or savings', () => {
  const v = input();
  Object.keys(v.answers).forEach((k) => (v.answers[k] = 5));
  const r = diagnose(v, catalog);
  assert.equal(r.dbi, 100);
  assert.equal(r.ldmi, 100);
  assert.equal(r.level, 5);
  assert.equal(r.gaps.length, 0);
  assert.equal(r.matches.length, 0);
});
test('ROI computes effective discount, cash flows and fractional payback; loss is not zero-month payback', () => {
  const r = simulate({
    initial: 100,
    monthlyCost: 0,
    monthlySavings: 20,
    months: 12,
    annualDiscount: 0,
    rampMonths: 0,
  });
  const s = r.scenarios[1];
  assert.equal(s.net, 140);
  assert.equal(s.npv, 140);
  assert.equal(s.roi, 140);
  assert.equal(s.payback, 5);
  assert.equal(s.flows.length, 13);
  assert.ok(r.scenarios[0].npv < s.npv);
  assert.ok(r.scenarios[2].npv > s.npv);
  const loss = simulate({ ...r.input, monthlyCost: 25 });
  assert.equal(loss.scenarios[1].payback, null);
  assert.ok(loss.scenarios[1].roi < 0);
  const discounted = simulate({ ...r.input, annualDiscount: 12 });
  assert.ok(discounted.scenarios[1].npv < s.npv);
  const ramp = simulate({ ...r.input, rampMonths: 3 });
  assert.ok(ramp.scenarios[1].net < s.net);
  assert.throws(() => simulate({ ...r.input, initial: 0 }));
  assert.throws(() => simulate({ ...r.input, months: Infinity }));
});
test('roadmap checks capacity, data and budget; stale or ineligible solutions cannot be selected', () => {
  const assessment = diagnose(input(), catalog);
  const solution = assessment.matches[0];
  assert.ok(solution);
  const base = {
    assessmentId: 'assessment-1',
    solutionId: solution.id,
    people: 1,
    hoursPerWeek: 40,
    budget: 100,
    dataReadiness: 3,
    startDate: '2026-11-16',
  };
  const ready = roadmap(base, assessment);
  assert.equal(ready.status, 'proposed');
  assert.equal(ready.totalWeeks, 12);
  assert.equal(ready.phases[0].start, base.startDate);
  const slower = roadmap({ ...base, hoursPerWeek: 20 }, assessment);
  assert.equal(slower.totalWeeks, 24);
  const blocked = roadmap(
    { ...base, people: 0, budget: 0, dataReadiness: 1 },
    assessment,
  );
  assert.equal(blocked.status, 'needs_preparation');
  assert.equal(blocked.blockers.length, 3);
  assert.equal(
    roadmap({ ...base, solutionId: 'fake' }, assessment).status,
    'needs_preparation',
  );
  assert.throws(() =>
    roadmap({ ...base, startDate: '2026-02-30' }, assessment),
  );
});
test('KPI history respects directions and missing prior data; invalid periods rejected', () => {
  const records = [
    {
      code: 'otif' as const,
      value: 80,
      target: 95,
      period: '2026-11',
      source: 'test',
    },
    {
      code: 'otif' as const,
      value: 85,
      target: 95,
      period: '2026-10',
      source: 'test',
    },
    {
      code: 'emptyKm' as const,
      value: 10,
      target: 15,
      period: '2026-11',
      source: 'test',
    },
    {
      code: 'emptyKm' as const,
      value: 20,
      target: 15,
      period: '2026-10',
      source: 'test',
    },
  ];
  const a = alerts(records);
  assert.equal(a[0].missed, true);
  assert.equal(a[0].worsening, true);
  assert.equal(a[0].delta, -5);
  assert.equal(a[1].missed, false);
  assert.equal(a[1].worsening, false);
  assert.equal(alerts([records[0]])[0].delta, null);
  assert.throws(() => measurement({ ...records[0], period: '2026-13' }));
});
test('retrieval normalizes Vietnamese and does not invent unrelated sources', () => {
  assert.ok(retrieve('matching ngan sach', FAQ).length);
  assert.deepEqual(retrieve('xyzzy qwerty', FAQ), []);
});
