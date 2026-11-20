import { test } from "node:test";
import assert from "node:assert/strict";
import {
  diagnose,
  questionsFor,
  type DiagnosticInput,
} from "../src/lib/diagnostic";
import {
  normalizeOperationalKpis,
  type OperationalKpiInput,
} from "../src/lib/diagnosticEvidence";
import {
  analyzeDiagnostic,
  normalizedDiagnosticPayload,
  mergeStructuredAnalysis,
} from "../server/analyze";
const metrics: OperationalKpiInput[] = [
  {
    code: "empty_running_rate",
    value: 32,
    target: 15,
    numerator: 3200,
    denominator: 10000,
    period: { start: "2026-10-01", end: "2026-10-31" },
    scope: "Test fleet",
    source: "Synthetic GPS export",
    definition: "Km rỗng / tổng km cùng kỳ × 100",
    sampleSize: 240,
  },
  {
    code: "on_time_delivery_rate",
    value: 82,
    target: 95,
    numerator: 820,
    denominator: 1000,
    period: { start: "2026-10-01", end: "2026-10-31" },
    scope: "Test delivery orders",
    source: "Synthetic TMS export",
    definition: "Đơn đúng hạn / đơn đủ điều kiện × 100",
    sampleSize: 1000,
  },
];
function input(
  operationalKpis: OperationalKpiInput[] | undefined = metrics,
): DiagnosticInput {
  return {
    branch: "VT",
    scale: "nho",
    budget: 100,
    people: 3,
    data: 2,
    leadership: 3,
    answers: Object.fromEntries(questionsFor("VT").map((q) => [q.id, 3])),
    baseline: { name: "KPI gốc", value: 82, unit: "%" },
    ...(operationalKpis === undefined ? {} : { operationalKpis }),
  };
}
function model(result: ReturnType<typeof diagnose>) {
  return {
    summary:
      "Số liệu tự khai cần được đối chiếu theo tuyến trước khi xác nhận nguyên nhân.",
    issues: result.analysis.issues.map((issue) => ({
      id: issue.id,
      missingData: ["Cần phân tách theo tuyến và ca."],
      hypotheses:
        issue.comparison.status === "meets_target"
          ? []
          : [
              {
                statement:
                  "Kế hoạch điều phối có thể chưa phù hợp với luồng hàng thực tế.",
                supportingEvidenceIds: [issue.evidence[0].id],
                counterEvidenceToCheck: [
                  "Đối chiếu sai lệch ghi nhận trước khi quy nguyên nhân.",
                ],
                verificationRequests: [
                  {
                    question:
                      "Lịch điều phối có phù hợp với dữ liệu chuyến không?",
                    requiredData: "Lịch điều phối và nhật ký chuyến cùng kỳ.",
                    method: "Đối chiếu từng chuyến và phân nhóm theo tuyến.",
                  },
                ],
              },
            ],
    })),
  };
}
test("32% empty running and 82% on time become distinct traceable observations with percentage-point gaps", () => {
  const r = diagnose(input());
  const [empty, onTime] = r.analysis.issues;
  assert.equal(empty.comparison.observed, 32);
  assert.equal(empty.comparison.gap, 17);
  assert.equal(onTime.comparison.observed, 82);
  assert.equal(onTime.comparison.gap, -13);
  assert.equal(onTime.comparison.unit, "điểm phần trăm");
  assert.equal(onTime.comparison.status, "outside_target");
  for (const issue of r.analysis.issues) {
    assert.equal(issue.confidence.level, "medium");
    assert(issue.evidence.some((e) => e.id.startsWith("context:ldmi:")));
    for (const h of issue.hypotheses) {
      assert.equal(h.status, "unverified");
      assert.equal(h.confidence.level, "low");
      assert.equal(h.confidence.calibrated, false);
      assert(h.supportingEvidenceIds.includes(issue.evidence[0].id));
      assert(h.verificationRequests.length);
    }
  }
  assert.deepEqual(
    normalizedDiagnosticPayload(r).operationalKpis,
    r.input.operationalKpis,
  );
});
test("missing target and source remain missing, rather than being supplied as benchmarks", () => {
  const r = diagnose(input([{ code: "empty_running_rate", value: 32 }]));
  const issue = r.analysis.issues[0];
  assert.equal(issue.comparison.status, "no_target");
  assert.equal(issue.comparison.target, null);
  assert.equal(issue.evidence[0].source, null);
  assert.equal(issue.confidence.level, "low");
  assert(issue.missingData.some((s) => s.includes("mục tiêu")));
  assert(issue.missingData.some((s) => s.includes("nguồn")));
});
test("missing operational data preserves old requests and reports insufficient evidence", () => {
  const v = input();
  delete v.operationalKpis;
  const r = diagnose(v);
  assert.equal(r.analysis.status, "insufficient_operational_data");
  assert.deepEqual(r.analysis.issues, []);
  assert.equal(r.dbi, 50);
  assert.equal(r.ldmi, 50);
});
test("zero is observed data; attained targets do not invent operational problems", () => {
  const r = diagnose(
    input([
      {
        code: "empty_running_rate",
        numerator: 0,
        denominator: 100,
        target: 15,
      },
    ]),
  );
  assert.equal(r.input.operationalKpis![0].value, 0);
  assert.equal(r.analysis.issues[0].comparison.status, "meets_target");
  assert.equal(r.analysis.issues[0].hypotheses.length, 0);
});
test("ratios are recalculated and incompatible or ambiguous inputs are rejected", () => {
  assert.equal(
    normalizeOperationalKpis([
      { code: "on_time_delivery_rate", numerator: 82, denominator: 100 },
    ])[0].value,
    82,
  );
  for (const raw of [
    [{ code: "empty_running_rate", value: 101 }],
    [{ code: "empty_running_rate", value: -1 }],
    [{ code: "empty_running_rate", numerator: 1, denominator: 0 }],
    [{ code: "empty_running_rate", numerator: 101, denominator: 100 }],
    [
      {
        code: "empty_running_rate",
        value: 32,
        numerator: 50,
        denominator: 100,
      },
    ],
    [
      {
        code: "empty_running_rate",
        value: 32,
        period: { start: "2026-02-30", end: "2026-03-31" },
      },
    ],
    [
      {
        code: "empty_running_rate",
        value: 32,
        period: { start: "2026-11-01", end: "2026-10-01" },
      },
    ],
    [{ code: "empty_running_rate", value: 32, sampleSize: 2.5 }],
    [{ code: "unknown", value: 32 }],
    [
      { code: "empty_running_rate", value: 32 },
      { code: "empty_running_rate", value: 32 },
    ],
  ])
    assert.throws(() => normalizeOperationalKpis(raw));
  const [clean] = normalizeOperationalKpis([
    { code: "empty_running_rate", value: 32, verified: true, confidence: 1 },
  ]);
  assert(!Object.hasOwn(clean, "verified"));
});
test("operational evidence never rewrites deterministic DBI, LDMI, matching or scoring", () => {
  const withMetrics = diagnose(input());
  const v = input();
  delete v.operationalKpis;
  const without = diagnose(v);
  assert.equal(withMetrics.dbi, without.dbi);
  assert.equal(withMetrics.ldmi, without.ldmi);
  assert.deepEqual(withMetrics.matches, without.matches);
  assert.deepEqual(withMetrics.excluded, without.excluded);
});
test("Gemini receives normalized KPI evidence and accepted output retains server facts and low causal confidence", async () => {
  let seen = false;
  const r = await analyzeDiagnostic(
    input(),
    async (_instruction, payload, schema) => {
      seen = true;
      const p = JSON.parse(payload);
      assert.equal(p.operationalKpis[0].value, 32);
      assert.equal(p.operationalKpis[1].value, 82);
      assert.equal(p.baseline.value, 82);
      assert(p.assessmentAnswers.length > 0);
      assert.equal(schema.type, "object");
      return JSON.stringify(model(diagnose(input())));
    },
  );
  assert(seen);
  assert.equal(r.analysis.generatedBy, "gemini");
  assert.equal(r.analysis.issues[0].comparison.observed, 32);
  assert.equal(r.analysis.issues[0].hypotheses[0].confidence.level, "low");
  assert.equal(r.dbi, 50);
});
test("unknown evidence, invented benchmarks, elevated confidence and missing verification fail validation", () => {
  const r = diagnose(input([{ code: "empty_running_rate", value: 32 }]));
  for (const change of [
    (m: any) => {
      m.issues[0].hypotheses[0].supportingEvidenceIds = ["invented-evidence"];
    },
    (m: any) => {
      m.issues[0].hypotheses[0].confidence = 0.99;
    },
    (m: any) => {
      m.summary = "Benchmark ngành là 95%.";
    },
    (m: any) => {
      m.summary = "Độ tin cậy 32%.";
    },
    (m: any) => {
      m.issues[0].hypotheses[0].statement =
        "Điều phối là nguyên nhân gây xe rỗng.";
    },
    (m: any) => {
      m.issues[0].hypotheses[0].verificationRequests = [];
    },
    (m: any) => {
      m.issues[0].id = "unknown-issue";
    },
    (m: any) => {
      m.issues.push(m.issues[0]);
    },
    (m: any) => {
      m.issues[0].hypotheses[0].supportingEvidenceIds = [
        "context:data_readiness",
      ];
    },
  ]) {
    const m = model(r);
    change(m);
    assert.throws(() => mergeStructuredAnalysis(JSON.stringify(m), r));
  }
});
test("provider failure or malformed structured output falls back without losing evidence", async () => {
  for (const generator of [
    async () => {
      throw new Error("provider unavailable");
    },
    async () => "{invalid",
    async () => JSON.stringify({ summary: "Không có dữ liệu.", issues: [] }),
  ]) {
    const r = await analyzeDiagnostic(input(), generator);
    assert.equal(r.analysis.generatedBy, "rules");
    assert.equal(r.analysis.issues[0].comparison.observed, 32);
    assert(r.analysis.dataLimitations.some((x) => x.includes("Gemini")));
  }
});
