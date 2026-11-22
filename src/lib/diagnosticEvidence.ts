/** Operational evidence is self-reported until independently verified. */
export const KPI_DEFINITIONS = {
  empty_running_rate: {
    name: "Tỷ lệ xe chạy rỗng",
    unit: "%",
    direction: "lower",
    definition: "Km chạy rỗng / tổng km vận hành × 100",
    causes: [
      "Luồng hàng hai chiều có thể mất cân đối.",
      "Ghép chuyến hoặc lập kế hoạch điều phối có thể chưa phù hợp.",
    ],
    checks: [
      "Nhật ký GPS và km có tải/rỗng theo chuyến.",
      "Đơn hàng, điểm lấy/giao, tải trọng và lịch điều phối theo tuyến.",
    ],
  },
  on_time_delivery_rate: {
    name: "Tỷ lệ giao hàng đúng hạn",
    unit: "%",
    direction: "higher",
    definition: "Số đơn giao đúng cam kết / tổng đơn đủ điều kiện × 100",
    causes: [
      "Kế hoạch tuyến, năng lực vận chuyển hoặc khung giờ cam kết có thể chưa phù hợp.",
      "Thời gian chờ tại điểm lấy/giao hoặc độ trễ cập nhật trạng thái có thể ảnh hưởng kết quả.",
    ],
    checks: [
      "Thời điểm cam kết, giao thực tế và quy tắc loại đơn hủy/ngoại lệ.",
      "Mốc thời gian lấy hàng, chờ, vận chuyển và bàn giao theo đơn.",
    ],
  },
  inventory_accuracy_rate: {
    name: "Độ chính xác tồn kho",
    unit: "%",
    direction: "higher",
    definition:
      "SKU-vị trí khớp kiểm đếm / tổng SKU-vị trí được kiểm đếm × 100",
    causes: [
      "Giao dịch nhập/xuất hoặc chuẩn hóa mã hàng/vị trí có thể chưa nhất quán.",
    ],
    checks: ["Biên bản kiểm kê, giao dịch nhập/xuất và quy ước SKU-vị trí."],
  },
  order_error_rate: {
    name: "Tỷ lệ đơn sai sót",
    unit: "%",
    direction: "lower",
    definition: "Đơn có sai sót / tổng đơn đủ điều kiện × 100",
    causes: [
      "Khâu nhập đơn, picking hoặc bàn giao có thể còn thiếu bước kiểm soát.",
    ],
    checks: ["Danh sách đơn sai, loại lỗi và nhật ký thao tác từng công đoạn."],
  },
  order_cycle_time: {
    name: "Thời gian xử lý đơn",
    unit: "giờ",
    direction: "lower",
    definition:
      "Thời gian từ mốc nhận đơn đến mốc hoàn thành được doanh nghiệp định nghĩa",
    causes: [
      "Thời gian chờ giữa các công đoạn hoặc phân bổ nguồn lực có thể làm kéo dài chu kỳ.",
    ],
    checks: ["Mốc thời gian từng công đoạn và cách tính trung bình/ngoại lệ."],
  },
  cost_per_order: {
    name: "Chi phí trên mỗi đơn",
    unit: "VND/đơn",
    direction: "lower",
    definition: "Tổng chi phí trong phạm vi / số đơn cùng phạm vi và kỳ đo",
    causes: [
      "Cơ cấu chi phí, hệ số sử dụng năng lực hoặc sản lượng có thể ảnh hưởng chi phí đơn vị.",
    ],
    checks: ["Sổ chi phí, cách phân bổ và sản lượng đơn cùng kỳ/phạm vi."],
  },
} as const;
export type OperationalKpiCode = keyof typeof KPI_DEFINITIONS;
export interface OperationalKpiInput {
  code: OperationalKpiCode;
  value?: number;
  numerator?: number;
  denominator?: number;
  target?: number;
  period?: { start: string; end: string };
  scope?: string;
  source?: string;
  definition?: string;
  sampleSize?: number;
}
export type ConfidenceLevel = "low" | "medium";
export interface EvidenceConfidence {
  level: ConfidenceLevel;
  basis: string;
  calibrated: false;
}
export interface VerificationRequest {
  question: string;
  requiredData: string;
  method: string;
}
export interface DiagnosticEvidence {
  id: string;
  kind: "operational_kpi" | "assessment_context";
  label: string;
  value: number;
  unit: string;
  provenance: "self_reported" | "calculated_from_self_reported";
  verified: false;
  source: string | null;
  period: { start: string; end: string } | null;
  scope: string | null;
  definition: string;
  numerator?: number;
  denominator?: number;
  sampleSize?: number;
}
export interface DiagnosticHypothesis {
  id: string;
  statement: string;
  supportingEvidenceIds: string[];
  confidence: EvidenceConfidence;
  status: "unverified";
  counterEvidenceToCheck: string[];
  verificationRequests: VerificationRequest[];
}
export interface DiagnosticIssue {
  id: string;
  metricCode: OperationalKpiCode;
  title: string;
  evidence: DiagnosticEvidence[];
  comparison: {
    status: "no_target" | "meets_target" | "outside_target";
    observed: number;
    target: number | null;
    gap: number | null;
    unit: string;
    direction: "higher" | "lower";
  };
  confidence: EvidenceConfidence;
  hypotheses: DiagnosticHypothesis[];
  missingData: string[];
  verificationRequests: VerificationRequest[];
}
export interface DiagnosticAnalysis {
  version: 1;
  generatedBy: "rules" | "gemini";
  status: "operational_data_available" | "insufficient_operational_data";
  summary: string;
  issues: DiagnosticIssue[];
  dataLimitations: string[];
}
function number(value: unknown, label: string, maximum = 1e15): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > maximum
  )
    throw new Error(`${label} không hợp lệ.`);
  return value;
}
function shortText(
  value: unknown,
  label: string,
  max: number,
): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.trim().length > max)
    throw new Error(`${label} không hợp lệ.`);
  return value.trim() || undefined;
}
function date(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function normalizeOperationalKpis(
  value: unknown,
): OperationalKpiInput[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 12)
    throw new Error("Danh sách KPI vận hành cần có tối đa 12 chỉ số.");
  const seen = new Set<string>();
  return value.map((raw, index) => {
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw) ||
      typeof raw.code !== "string" ||
      !Object.hasOwn(KPI_DEFINITIONS, raw.code)
    )
      throw new Error(`Mã KPI vận hành ${index + 1} không hợp lệ.`);
    const code = raw.code as OperationalKpiCode,
      def = KPI_DEFINITIONS[code],
      percent = def.unit === "%";
    let measured =
      raw.value === undefined
        ? undefined
        : number(raw.value, `Giá trị ${def.name}`, percent ? 100 : 1e15);
    const result: OperationalKpiInput = { code };
    if (raw.numerator !== undefined || raw.denominator !== undefined) {
      if (!percent) throw new Error("Tử số/mẫu số chỉ áp dụng cho KPI tỷ lệ.");
      const numerator = number(raw.numerator, "Tử số"),
        denominator = number(raw.denominator, "Mẫu số");
      if (denominator <= 0 || numerator > denominator)
        throw new Error("Mẫu số phải dương và tử số không vượt mẫu số.");
      const computed = Math.round((numerator / denominator) * 10000) / 100;
      if (measured !== undefined && Math.abs(measured - computed) > 0.05 + 1e-8)
        throw new Error(`${def.name}: giá trị không khớp tử số/mẫu số.`);
      measured = computed;
      result.numerator = numerator;
      result.denominator = denominator;
    }
    if (measured === undefined)
      throw new Error(`Cần giá trị hoặc tử số/mẫu số cho ${def.name}.`);
    result.value = measured;
    if (raw.target !== undefined)
      result.target = number(raw.target, "Mục tiêu KPI", percent ? 100 : 1e15);
    if (raw.period !== undefined) {
      if (
        !raw.period ||
        !date(raw.period.start) ||
        !date(raw.period.end) ||
        raw.period.start > raw.period.end
      )
        throw new Error("Kỳ đo KPI cần ngày bắt đầu/kết thúc hợp lệ.");
      result.period = { start: raw.period.start, end: raw.period.end };
    }
    result.scope = shortText(raw.scope, "Phạm vi KPI", 300);
    result.source = shortText(raw.source, "Nguồn KPI", 500);
    result.definition = shortText(raw.definition, "Định nghĩa KPI", 700);
    if (raw.sampleSize !== undefined) {
      const size = number(raw.sampleSize, "Cỡ mẫu");
      if (!Number.isInteger(size) || size < 1)
        throw new Error("Cỡ mẫu phải là số nguyên dương.");
      result.sampleSize = size;
    }
    const identity = JSON.stringify([
      code,
      result.period ?? null,
      result.scope ?? null,
    ]);
    if (seen.has(identity)) throw new Error("KPI trùng mã, kỳ đo và phạm vi.");
    seen.add(identity);
    return result;
  });
}
export interface DiagnosticContext {
  dbi: number;
  ldmi: number;
  people: number;
  data: number;
  leadership: number;
  groups?: { code: string; score: number }[];
}
export function buildDiagnosticAnalysis(
  kpis: OperationalKpiInput[],
  context: DiagnosticContext,
): DiagnosticAnalysis {
  const issues = kpis.map((kpi, index): DiagnosticIssue => {
    const def = KPI_DEFINITIONS[kpi.code],
      id = `issue:${index + 1}:${kpi.code}`,
      evidenceId = `kpi:${index + 1}:${kpi.code}`;
    const missingData = [
      ...(!kpi.period ? ["Chưa có kỳ đo."] : []),
      ...(!kpi.scope ? ["Chưa có phạm vi đo."] : []),
      ...(!kpi.source ? ["Chưa có nguồn dữ liệu."] : []),
      ...(!kpi.definition ? ["Chưa xác nhận định nghĩa và ngoại lệ KPI."] : []),
      ...(kpi.sampleSize === undefined ? ["Chưa có cỡ mẫu."] : []),
      ...(kpi.target === undefined
        ? [
            "Chưa có mục tiêu cùng kỳ/phạm vi; chưa kết luận chỉ số cao hay thấp.",
          ]
        : []),
      ...(def.unit === "%" && kpi.denominator === undefined
        ? ["Chưa có tử số/mẫu số để đối chiếu tỷ lệ."]
        : []),
    ];
    const evidence: DiagnosticEvidence = {
      id: evidenceId,
      kind: "operational_kpi",
      label: def.name,
      value: kpi.value!,
      unit: def.unit,
      provenance:
        kpi.denominator === undefined
          ? "self_reported"
          : "calculated_from_self_reported",
      verified: false,
      source: kpi.source ?? null,
      period: kpi.period ?? null,
      scope: kpi.scope ?? null,
      definition:
        kpi.definition ??
        `${def.definition} (định nghĩa gợi ý, chưa được doanh nghiệp xác nhận)`,
      ...(kpi.numerator === undefined
        ? {}
        : { numerator: kpi.numerator, denominator: kpi.denominator }),
      ...(kpi.sampleSize === undefined ? {} : { sampleSize: kpi.sampleSize }),
    };
    const confidence: EvidenceConfidence = {
      level:
        kpi.period &&
        kpi.scope &&
        kpi.source &&
        kpi.definition &&
        kpi.sampleSize !== undefined &&
        (def.unit !== "%" || kpi.denominator !== undefined)
          ? "medium"
          : "low",
      basis:
        "Đánh giá mức đầy đủ của bằng chứng, không phải xác suất đúng. Số liệu vẫn do doanh nghiệp tự khai và chưa được xác minh độc lập.",
      calibrated: false,
    };
    const verificationRequests: VerificationRequest[] = [
      {
        question:
          "KPI có dùng cùng kỳ, phạm vi, định nghĩa và tập ngoại lệ với mục tiêu không?",
        requiredData:
          "Định nghĩa KPI, kỳ đo, phạm vi, cỡ mẫu và mục tiêu do doanh nghiệp xác nhận.",
        method: "Đối chiếu mẫu dữ liệu gốc và tính lại KPI trước khi kết luận.",
      },
      {
        question: "Số liệu gốc có tái lập được tỷ lệ/giá trị đã khai không?",
        requiredData: def.checks.join(" "),
        method:
          "Kiểm tra dữ liệu theo từng chuyến/đơn/giao dịch và phân tách theo tuyến, ca hoặc địa điểm.",
      },
    ];
    const relatedGroups: Record<OperationalKpiCode, string[]> = {
      empty_running_rate: ["VT"],
      on_time_delivery_rate: ["VT", "DH"],
      inventory_accuracy_rate: ["KB"],
      order_error_rate: ["KB", "DH"],
      order_cycle_time: ["DH"],
      cost_per_order: ["CP"],
    };
    const contextualEvidence: DiagnosticEvidence[] = (context.groups || [])
      .filter((g) => relatedGroups[kpi.code].includes(g.code))
      .map((g) => ({
        id: `context:ldmi:${g.code}`,
        kind: "assessment_context",
        label: `Điểm LDMI nhóm ${g.code}`,
        value: g.score,
        unit: "/100",
        provenance: "calculated_from_self_reported",
        verified: false,
        source: "Câu trả lời khảo sát LDMI",
        period: null,
        scope: null,
        definition:
          "Điểm năng lực tính từ câu trả lời tự khai; không phải KPI vận hành và không chứng minh nguyên nhân.",
      }));
    return {
      id,
      metricCode: kpi.code,
      title: def.name,
      evidence: [
        evidence,
        {
          id: "context:data_readiness",
          kind: "assessment_context",
          label: "Mức sẵn sàng dữ liệu",
          value: context.data,
          unit: "/5",
          provenance: "self_reported",
          verified: false,
          source: "Hồ sơ tự khai",
          period: null,
          scope: null,
          definition:
            "Mức sẵn sàng do doanh nghiệp tự đánh giá; không chứng minh nguyên nhân.",
        },
        ...contextualEvidence,
      ],
      comparison: {
        status:
          kpi.target === undefined
            ? "no_target"
            : (
                  def.direction === "lower"
                    ? kpi.value! <= kpi.target
                    : kpi.value! >= kpi.target
                )
              ? "meets_target"
              : "outside_target",
        observed: kpi.value!,
        target: kpi.target ?? null,
        gap:
          kpi.target === undefined
            ? null
            : Math.round((kpi.value! - kpi.target) * 100) / 100,
        unit: def.unit === "%" ? "điểm phần trăm" : def.unit,
        direction: def.direction,
      },
      confidence,
      hypotheses: (kpi.target !== undefined &&
      (def.direction === "lower"
        ? kpi.value! <= kpi.target
        : kpi.value! >= kpi.target)
        ? []
        : def.causes
      ).map((statement, i) => ({
        id: `${id}:hypothesis:${i + 1}`,
        statement,
        supportingEvidenceIds: [evidenceId],
        confidence: {
          level: "low",
          basis:
            "KPI chỉ cho thấy hiện trạng; chưa đủ bằng chứng xác nhận quan hệ nhân quả.",
          calibrated: false,
        },
        status: "unverified",
        counterEvidenceToCheck: [
          "Kiểm tra sai lệch ghi nhận, định nghĩa và các yếu tố bên ngoài trước khi quy nguyên nhân.",
        ],
        verificationRequests: [
          verificationRequests[Math.min(i, verificationRequests.length - 1)],
        ],
      })),
      missingData,
      verificationRequests,
    };
  });
  return {
    version: 1,
    generatedBy: "rules",
    status: issues.length
      ? "operational_data_available"
      : "insufficient_operational_data",
    summary: issues.length
      ? `Đã ghi nhận ${issues.length} KPI vận hành. So sánh chỉ dùng mục tiêu do doanh nghiệp khai; các nguyên nhân là giả thuyết cần xác minh.`
      : "Chưa có KPI vận hành có cấu trúc. Điểm DBI/LDMI và KPI gốc chưa đủ để kết luận nguyên nhân vận hành.",
    issues,
    dataLimitations: [
      "Số liệu đầu vào là dữ liệu tự khai; chưa được đối chiếu dữ liệu gốc.",
      "Mức tin cậy là nhãn định tính, không phải xác suất đã hiệu chuẩn.",
      "Đạt hoặc lệch mục tiêu không tự chứng minh nguyên nhân; không dùng benchmark ngành chưa được cung cấp.",
    ],
  };
}
