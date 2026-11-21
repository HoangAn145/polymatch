import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { diagnose, questionsFor } from "../src/lib/diagnostic";
import { legacyAssessment } from "../src/lib/legacyCompatibility";
test("every original route is preserved and no production router replaces the application", () => {
  const paths = JSON.parse(
    readFileSync(
      new URL("./fixtures/original-routes.json", import.meta.url),
      "utf8",
    ),
  ) as string[];
  const current = readFileSync(
    new URL("../src/App.tsx", import.meta.url),
    "utf8",
  );
  for (const path of paths)
    assert(
      current.includes(`path="${path}"`),
      `Missing original route ${path}`,
    );
  assert(!current.includes("return <ProductionApp"));
});
test("enhanced result fills the original charts, zero scores, history IDs and explanations", () => {
  const result = diagnose({
    branch: "VT",
    scale: "nho",
    budget: 100,
    people: 3,
    data: 3,
    leadership: 3,
    answers: Object.fromEntries(questionsFor("VT").map((q) => [q.id, 1])),
    baseline: { name: "Đúng hạn", value: 0, unit: "%" },
  });
  const legacy = legacyAssessment(
    result,
    "record-1",
    "user-1",
    "2026-11-16T12:00:00Z",
    2,
  );
  assert.equal(legacy.id, "record-1");
  assert.equal(legacy.userId, "user-1");
  assert.equal(legacy.lan_thu, 2);
  assert.equal(legacy.dbi_diem, 0);
  assert.equal(legacy.ldmi_diem, 0);
  assert.equal(legacy.dbi_tru_cot.length, 7);
  assert.equal(legacy.top_khoang_trong[0].diem_gap, 100);
  assert.equal(legacy.ai_dien_giai.tom_tat, result.interpretation);
});
