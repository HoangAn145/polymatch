import { DBI_QUESTIONS, LDMI_QUESTIONS } from "../data/assessmentQuestions";
import { KNOWLEDGE_GAPS } from "../data/knowledgeGaps";
import { SOLUTIONS_DATA } from "../data/solutionsData";
import type { LogisticsBranch, EnterpriseScale, Solution } from "../types";
export interface DiagnosticInput {
  branch: LogisticsBranch;
  scale: EnterpriseScale;
  budget: number;
  people: number;
  data: number;
  leadership: number;
  answers: Record<string, number>;
  baseline: { name: string; value: number; unit: string };
}
export function questionsFor(branch: string) {
  return [
    ...DBI_QUESTIONS,
    ...LDMI_QUESTIONS.filter((q) => q.nhanh_ap_dung.includes(branch)),
  ];
}
export function validateInput(input: DiagnosticInput) {
  if (
    !input ||
    !["VT", "FF", "KB", "3PL", "LM", "KH"].includes(input.branch) ||
    !["sieu_nho", "nho", "vua", "lon"].includes(input.scale)
  )
    throw new Error("Loại hình hoặc quy mô không hợp lệ.");
  if (!Number.isFinite(input.budget) || input.budget <= 0 || input.budget > 1e9)
    throw new Error("Nhập ngân sách 12 tháng dương (triệu đồng).");
  for (const v of [input.people, input.data, input.leadership])
    if (!Number.isInteger(v) || v < 1 || v > 5)
      throw new Error("Mức sẵn sàng phải từ 1 đến 5.");
  if (
    !input.answers ||
    !input.baseline?.name?.trim() ||
    input.baseline.name.length > 200 ||
    !input.baseline.unit?.trim() ||
    input.baseline.unit.length > 30 ||
    !Number.isFinite(input.baseline.value) ||
    input.baseline.value < 0 ||
    input.baseline.value > 1e15
  )
    throw new Error("Nhập KPI đầu vào hợp lệ.");
  for (const q of questionsFor(input.branch)) {
    const v = input.answers[q.id];
    if (!Number.isInteger(v) || !q.phuong_an.some((o) => o.muc === v))
      throw new Error(`Chưa trả lời hợp lệ câu ${q.ma}.`);
  }
}
const mean = (a: number[]) =>
  a.length
    ? Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 10) / 10
    : 0;
export function solutionRejections(
  sol: Solution,
  branch: LogisticsBranch,
  scale: EnterpriseScale,
  budget: number,
  level: number,
): string[] {
  const reasons: string[] = [];
  if (!sol.phan_khuc.includes(branch)) reasons.push("Không phù hợp loại hình.");
  if (!sol.quy_mo_phu_hop.includes(scale))
    reasons.push("Không phù hợp quy mô.");
  if (sol.muc_ldmi_phu_hop > level + 1)
    reasons.push("Vượt quá mức trưởng thành hiện tại + 1.");
  // Catalog minimum prices are already annualized.
  if (sol.gia_min_trieu !== undefined && sol.gia_min_trieu > budget)
    reasons.push("Chi phí tối thiểu 12 tháng vượt ngân sách.");
  return reasons;
}
export function diagnose(input: DiagnosticInput) {
  validateInput(input);
  const questions = questionsFor(input.branch);
  const score = (ids: string[]) =>
    mean(ids.map((id) => (input.answers[id] - 1) * 25));
  const dbi = score(DBI_QUESTIONS.map((q) => q.id));
  const groups = [
    ...new Set(
      questions.filter((q) => q.phan === "ldmi").map((q) => q.nhom_nang_luc!),
    ),
  ]
    .map((code) => ({
      code,
      score: score(
        questions.filter((q) => q.nhom_nang_luc === code).map((q) => q.id),
      ),
    }))
    .sort((a, b) => a.score - b.score);
  const ldmi = mean(groups.map((g) => g.score));
  const level = Math.min(5, 1 + Math.floor(ldmi / 20));
  const gaps = groups
    .slice(0, 3)
    .flatMap((g) =>
      KNOWLEDGE_GAPS.filter((k) => k.nhom_nang_luc === g.code).slice(0, 1),
    )
    .map((g) => ({
      id: g.ma,
      title: g.ten,
      kpi: g.chi_so,
      next: g.buoc_tiep.muc_1,
      source: g.nguon,
    }));
  const excluded: { id: string; title: string; reasons: string[] }[] = [];
  const matches = SOLUTIONS_DATA.flatMap((sol) => {
    const reasons = solutionRejections(
      sol,
      input.branch,
      input.scale,
      input.budget,
      level,
    );
    if (reasons.length) {
      excluded.push({ id: sol.id, title: sol.ten, reasons });
      return [];
    }
    const gap = gaps.some((g) => sol.khoang_trong_giai_quyet.includes(g.id));
    const readiness = (input.people + input.data + input.leadership) / 15;
    const breakdown = {
      gap: gap ? 30 : 0,
      branch: 15,
      scale: 15,
      budget: sol.gia_min_trieu === undefined ? 0 : 15,
      readiness: Math.round(readiness * 10),
      integration: 0,
      evidence: 0,
    };
    return [
      {
        id: sol.id,
        title: sol.ten,
        score: Object.values(breakdown).reduce((a, b) => a + b, 0),
        breakdown,
        reasons: [
          gap
            ? "Giải quyết khoảng trống ưu tiên."
            : "Chưa chứng minh giải quyết khoảng trống ưu tiên.",
          "Phù hợp loại hình, quy mô và giới hạn LDMI.",
        ],
        caveats: [
          "Danh mục kế thừa chưa được xác minh lại nguồn giá và case study.",
          "Chưa chấm điểm tích hợp và bằng chứng vì thiếu xác minh.",
          ...(sol.gia_min_trieu === undefined
            ? ["Chưa biết giá; cần báo giá trước khi quyết định."]
            : []),
        ],
        resources: sol.nguon_luc_can,
        cost: sol.gia_min_trieu ?? null,
      },
    ];
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    version: 1,
    input,
    dbi,
    ldmi,
    level,
    groups,
    gaps,
    matches,
    excluded,
    interpretation: `DBI ${dbi}/100; LDMI ${ldmi}/100. ${gaps.length ? `Ưu tiên kiểm tra: ${gaps.map((g) => g.title).join(", ")}.` : "Chưa đủ dữ liệu xác định điểm nghẽn."} Kết quả dựa trên thông tin tự khai; điểm matching chỉ dùng so sánh trong danh mục.`,
  };
}
export type DiagnosticResult = ReturnType<typeof diagnose>;
export function makeRoadmap(result: DiagnosticResult) {
  const ready =
    result.input.people >= 3 &&
    result.input.data >= 3 &&
    result.input.leadership >= 3;
  return {
    ready,
    blockers: [
      ...(result.input.people < 3 ? ["Cần người phụ trách triển khai."] : []),
      ...(result.input.data < 3
        ? ["Cần chuẩn hóa dữ liệu và kiểm tra chất lượng."]
        : []),
      ...(result.input.leadership < 3
        ? ["Cần xác nhận chủ dự án và ngân sách từ lãnh đạo."]
        : []),
    ],
    phases: [
      {
        weeks: "1–2",
        title: "Chuẩn hóa dữ liệu & nguồn lực",
        tasks: [
          "Xác nhận chủ dự án, dữ liệu, ngân sách.",
          ...result.gaps.map((g) => g.next),
        ],
      },
      {
        weeks: "3–6",
        title: "Thử nghiệm giới hạn",
        tasks: [
          "Đối chiếu báo giá và khả năng tích hợp.",
          ...result.matches.slice(0, 1).flatMap((m) => m.resources),
          "Chốt KPI gốc và tiêu chí nghiệm thu.",
        ],
      },
      {
        weeks: "7–12",
        title: "Đánh giá & mở rộng",
        tasks: [
          "Đo KPI trước/sau cùng phạm vi.",
          "Đối chiếu dòng tiền thực tế với mô phỏng ROI.",
          "Chỉ mở rộng sau nghiệm thu thử nghiệm.",
        ],
      },
    ],
  };
}
export function simulateRoi(
  initial: number,
  monthlyCost: number,
  monthlyBenefit: number,
  months: number,
  discount: number,
) {
  if (
    [initial, monthlyCost, monthlyBenefit, discount].some(
      (v) => !Number.isFinite(v) || v < 0 || v > 1e15,
    ) ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 120 ||
    discount > 100
  )
    throw new Error("Thông số tài chính không hợp lệ.");
  const monthlyRate = Math.pow(1 + discount / 100, 1 / 12) - 1;
  const scenarios = [
    { name: "Thận trọng", factor: 0.7 },
    { name: "Cơ sở", factor: 1 },
    { name: "Tích cực", factor: 1.3 },
  ].map((s) => {
    const net = monthlyBenefit * s.factor - monthlyCost,
      cost = initial + monthlyCost * months;
    const cashflows = Array.from({ length: months + 1 }, (_, m) => ({
      month: m,
      cash: m === 0 ? -initial : net,
      cumulative: -initial + net * m,
    }));
    return {
      name: s.name,
      net,
      roi: cost === 0 ? null : ((net * months - initial) / cost) * 100,
      npv: cashflows.reduce(
        (sum, c) => sum + c.cash / Math.pow(1 + monthlyRate, c.month),
        0,
      ),
      payback:
        initial === 0
          ? net >= 0
            ? 0
            : null
          : net > 0 && initial / net <= months
            ? Math.ceil(initial / net)
            : null,
      cashflows,
    };
  });
  return scenarios;
}
