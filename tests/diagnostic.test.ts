import { test } from "node:test";
import assert from "node:assert/strict";
import {
  diagnose,
  questionsFor,
  makeRoadmap,
  simulateRoi,
  type DiagnosticInput,
} from "../src/lib/diagnostic";
const input = (overrides: Partial<DiagnosticInput> = {}): DiagnosticInput => ({
  branch: "VT",
  scale: "nho",
  budget: 100,
  people: 3,
  data: 3,
  leadership: 3,
  answers: Object.fromEntries(questionsFor("VT").map((q) => [q.id, 3])),
  baseline: { name: "Đúng hạn", value: 80, unit: "%" },
  ...overrides,
});
test("incomplete assessment is rejected; zero and out-of-range answers are rejected", () => {
  assert.throws(() => diagnose(input({ answers: {} })), /Chưa trả lời/);
  for (const v of [0, 6, NaN, 2.5])
    assert.throws(() =>
      diagnose(input({ answers: { ...input().answers, "dbi-01": v } })),
    );
});
test("scores have endpoints 0 and 100, including observed zero groups", () => {
  for (const [v, expected] of [
    [1, 0],
    [5, 100],
  ]) {
    const r = diagnose(
      input({
        answers: Object.fromEntries(questionsFor("VT").map((q) => [q.id, v])),
      }),
    );
    assert.equal(r.dbi, expected);
    assert.equal(r.ldmi, expected);
    assert(r.gaps.length > 0);
  }
});
test("filter never returns wrong branch, scale, budget or advanced maturity", () => {
  const r = diagnose(input({ budget: 1 }));
  assert(r.excluded.length > 0);
  for (const m of r.matches) assert(m.cost === null || m.cost <= 1);
  const normal = diagnose(input());
  assert(normal.matches.length > 0);
  assert(
    normal.excluded.some((x) => x.reasons.includes("Không phù hợp loại hình.")),
  );
  assert.deepEqual(normal, diagnose(input()));
});
test("roadmap blocks trial when people and data are not ready", () => {
  const p = makeRoadmap(diagnose(input({ people: 1, data: 1 })));
  assert.equal(p.ready, false);
  assert.equal(p.blockers.length, 2);
});
test("ROI uses initial cash at month zero, annual discount, and no false payback", () => {
  const base = simulateRoi(100, 5, 15, 12, 0)[1];
  assert.equal(base.npv, 20);
  assert.equal(base.payback, 10);
  assert.equal(base.cashflows[0].cash, -100);
  assert.equal(base.roi, 12.5);
  assert.equal(simulateRoi(100, 15, 5, 12, 10)[1].payback, null);
  assert.equal(simulateRoi(100, 5, 6, 12, 10)[1].payback, null);
  assert.equal(simulateRoi(0, 0, 0, 12, 0)[1].roi, null);
  assert.throws(() => simulateRoi(0, 0, 0, 0, 0));
  assert.throws(() => simulateRoi(-1, 0, 0, 12, 0));
  assert(simulateRoi(100, 5, 15, 12, 10)[1].npv < 20);
});
