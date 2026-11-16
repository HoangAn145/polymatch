import { DBI_QUESTIONS, LDMI_QUESTIONS } from '../data/assessmentQuestions';
import { KNOWLEDGE_GAPS } from '../data/knowledgeGaps';
import type { Solution } from '../types';
export const BRANCHES = ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'];
export const SCALES = ['sieu_nho', 'nho', 'vua', 'lon'];
export const KPIS = {
  otif: { label: 'OTIF', direction: 'up', unit: '%' },
  emptyKm: { label: 'Km xe chạy rỗng', direction: 'down', unit: '%' },
  inventoryAccuracy: { label: 'Chính xác tồn kho', direction: 'up', unit: '%' },
} as const;
export type KpiCode = keyof typeof KPIS;
export type Measurement = {
  code: KpiCode;
  value: number;
  target: number;
  period: string;
  source: string;
};
export type AssessmentInput = {
  branch: string;
  scale: string;
  budget: number;
  readiness: number;
  answers: Record<string, number>;
  kpis: Measurement[];
};
export type CatalogRow = {
  id: string;
  data: Solution;
  published: boolean;
  approved: boolean;
};
export function object(value: unknown): Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Dữ liệu phải là một object.');
  return value as Record<string, any>;
}
export function number(
  value: unknown,
  min: number,
  max: number,
  label: string,
  integer = false,
): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    throw Error(`${label}: giá trị hợp lệ từ ${min} đến ${max}.`);
  return value;
}
export function text(value: unknown, max: number, label: string) {
  if (typeof value !== 'string' || !value.trim() || value.length > max)
    throw Error(`${label}: cần 1–${max} ký tự.`);
  return value.trim();
}
export function applicable(branch: string): KpiCode[] {
  return [
    'otif',
    ...(['VT', 'LM', '3PL'].includes(branch) ? ['emptyKm'] : []),
    ...(['KB', '3PL'].includes(branch) ? ['inventoryAccuracy'] : []),
  ] as KpiCode[];
}
export function questions(branch: string) {
  return [
    ...DBI_QUESTIONS,
    ...LDMI_QUESTIONS.filter((q) => q.nhanh_ap_dung.includes(branch)),
  ];
}
export function measurement(raw: unknown): Measurement {
  const v = object(raw);
  if (!Object.hasOwn(KPIS, v.code)) throw Error('Mã KPI không hợp lệ.');
  const period = text(v.period, 7, 'Kỳ đo');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))
    throw Error('Kỳ đo phải có định dạng YYYY-MM.');
  return {
    code: v.code,
    value: number(v.value, 0, 100, 'KPI'),
    target: number(v.target, 0, 100, 'Mục tiêu'),
    period,
    source: text(v.source, 300, 'Nguồn số liệu'),
  };
}
export function assessmentInput(raw: unknown): AssessmentInput {
  const v = object(raw);
  if (!BRANCHES.includes(v.branch) || !SCALES.includes(v.scale))
    throw Error('Ngành hoặc quy mô không hợp lệ.');
  const answers = object(v.answers);
  const checked: Record<string, number> = {};
  for (const q of questions(v.branch))
    checked[q.id] = number(answers[q.id], 1, 5, q.ma, true);
  if (!Array.isArray(v.kpis) || v.kpis.length > 3)
    throw Error('Thiếu KPI đầu vào.');
  const kpis = v.kpis.map(measurement);
  if (
    new Set(kpis.map((k) => k.code)).size !== kpis.length ||
    applicable(v.branch).some((code) => !kpis.some((k) => k.code === code))
  )
    throw Error(
      'Nhập đầy đủ KPI áp dụng cho ngành, không dùng số 0 thay cho dữ liệu thiếu.',
    );
  return {
    branch: v.branch,
    scale: v.scale,
    budget: number(v.budget, 0.01, 100000, 'Ngân sách năm (triệu VNĐ)'),
    readiness: number(v.readiness, 1, 5, 'Sẵn sàng', true),
    answers: checked,
    kpis,
  };
}
const avg = (a: number[]) =>
  a.length ? Math.round(a.reduce((s, n) => s + n, 0) / a.length) : 0;
export function diagnose(raw: unknown, catalog: CatalogRow[]) {
  const input = assessmentInput(raw),
    qs = questions(input.branch);
  const score = (ids: string[]) =>
    avg(ids.map((id) => (input.answers[id] - 1) * 25));
  const dbi = score(DBI_QUESTIONS.map((q) => q.id)),
    ldmiQs = qs.filter((q) => q.phan === 'ldmi'),
    ldmi = score(ldmiQs.map((q) => q.id)),
    level = Math.min(5, Math.floor(ldmi / 20) + 1);
  const groups = [...new Set(ldmiQs.map((q) => q.nhom_nang_luc))]
    .map((group) => ({
      group,
      score: score(
        ldmiQs.filter((q) => q.nhom_nang_luc === group).map((q) => q.id),
      ),
    }))
    .sort((a, b) => a.score - b.score);
  const gaps = groups
    .filter((g) => g.score < 80)
    .flatMap((g) =>
      KNOWLEDGE_GAPS.filter((k) => k.nhom_nang_luc === g.group).map((k) => ({
        code: k.ma,
        title: k.ten,
        score: g.score,
        action: k.buoc_tiep.muc_1,
        sources: k.nguon,
      })),
    )
    .slice(0, 3);
  const rejected: { id: string; name: string; reasons: string[] }[] = [];
  const matches = catalog
    .flatMap((row) => {
      const s = row.data;
      if (
        !s ||
        typeof s.ten !== 'string' ||
        !Array.isArray(s.phan_khuc) ||
        !Array.isArray(s.quy_mo_phu_hop) ||
        !Array.isArray(s.khoang_trong_giai_quyet) ||
        !Number.isInteger(s.muc_ldmi_phu_hop) ||
        s.muc_ldmi_phu_hop < 1 ||
        s.muc_ldmi_phu_hop > 5
      ) {
        rejected.push({
          id: row.id,
          name: s?.ten || row.id,
          reasons: ['Dữ liệu danh mục chưa đủ hoặc không hợp lệ'],
        });
        return [];
      }
      const reasons: string[] = [];
      if (
        !row.published ||
        !row.approved ||
        s.trang_thai_nguon !== 'da_xac_thuc'
      )
        reasons.push('Chưa xác thực/xuất bản');
      if (!s.phan_khuc.includes(input.branch)) reasons.push('Sai ngành');
      if (
        !s.quy_mo_phu_hop.includes(
          input.scale as (typeof s.quy_mo_phu_hop)[number],
        )
      )
        reasons.push('Sai quy mô');
      if (s.muc_ldmi_phu_hop > level + 1) reasons.push('Vượt LDMI hiện tại +1');
      if (
        !Number.isFinite(s.gia_min_trieu) ||
        s.gia_min_trieu! < 0 ||
        s.gia_min_trieu! > input.budget
      )
        reasons.push('Chưa có giá hoặc vượt ngân sách tối thiểu');
      const covered = gaps.filter((g) =>
        s.khoang_trong_giai_quyet.includes(g.code),
      );
      if (!covered.length) reasons.push('Không giải quyết điểm nghẽn đã đo');
      if (reasons.length) {
        rejected.push({ id: row.id, name: s.ten, reasons });
        return [];
      }
      const breakdown = {
        gap: Math.round((40 * covered.length) / Math.max(1, gaps.length)),
        readiness: input.readiness * 4,
        budget: 20,
        maturity: s.muc_ldmi_phu_hop <= level ? 20 : 10,
      };
      return [
        {
          id: row.id,
          name: s.ten,
          provider: s.nha_cung_cap_ten,
          minAnnualCost: s.gia_min_trieu!,
          price: s.khoang_gia_text,
          score: Object.values(breakdown).reduce((a, b) => a + b, 0),
          breakdown,
          reasons: covered.map((g) => g.title),
          limitations: [
            'Giá tối thiểu chưa bao gồm mọi chi phí tích hợp; cần báo giá chính thức.',
          ],
        },
      ];
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    version: 1,
    input,
    dbi,
    ldmi,
    level,
    groups,
    gaps,
    matches,
    rejected,
    summary: `DBI ${dbi}/100; LDMI ${ldmi}/100. ${gaps.length} điểm nghẽn từ tự khai; ${matches.length} giải pháp qua bộ lọc. KPI là đường cơ sở, chưa có benchmark để suy luận nhân quả.`,
    ai: { mode: 'rules', text: 'Diễn giải theo quy tắc, chưa dùng Gemini.' },
  };
}
export type Assessment = ReturnType<typeof diagnose>;
export type RoiInput = {
  initial: number;
  monthlyCost: number;
  monthlySavings: number;
  months: number;
  annualDiscount: number;
  rampMonths: number;
};
export function roiInput(raw: unknown): RoiInput {
  const v = object(raw);
  return {
    initial: number(v.initial, 0.01, 1000000, 'Đầu tư ban đầu'),
    monthlyCost: number(v.monthlyCost, 0, 1000000, 'Chi phí tháng'),
    monthlySavings: number(v.monthlySavings, 0, 1000000, 'Tiết kiệm tháng'),
    months: number(v.months, 1, 120, 'Số tháng', true),
    annualDiscount: number(v.annualDiscount, 0, 100, 'Chiết khấu năm'),
    rampMonths: number(v.rampMonths, 0, 24, 'Số tháng làm quen', true),
  };
}
export function simulate(raw: unknown) {
  const input = roiInput(raw);
  const monthlyRate = Math.pow(1 + input.annualDiscount / 100, 1 / 12) - 1;
  const scenarios = [
    { name: 'Thận trọng', factor: 0.8 },
    { name: 'Cơ sở', factor: 1 },
    { name: 'Thuận lợi', factor: 1.2 },
  ].map((s) => {
    let npv = -input.initial,
      cumulative = -input.initial,
      net = -input.initial,
      payback: number | null = null;
    const flows = [{ month: 0, net: -input.initial, cumulative }];
    for (let month = 1; month <= input.months; month++) {
      const benefit =
          input.monthlySavings *
          s.factor *
          Math.min(1, month / (input.rampMonths + 1)),
        flow = benefit - input.monthlyCost;
      const previous = cumulative;
      cumulative += flow;
      net += flow;
      npv += flow / Math.pow(1 + monthlyRate, month);
      if (payback === null && previous < 0 && cumulative >= 0 && flow > 0)
        payback = month - 1 + -previous / flow;
      flows.push({ month, net: flow, cumulative });
    }
    return { ...s, npv, net, roi: (net / input.initial) * 100, payback, flows };
  });
  return {
    input,
    unit: 'triệu VNĐ',
    scenarios,
    limitations:
      'Mô phỏng theo giả định tự nhập; kịch bản thay đổi lợi ích ±20%, chưa bao gồm thuế, vay và lạm phát. Không phải cam kết lợi nhuận.',
  };
}
export type RoadmapInput = {
  assessmentId: string;
  solutionId: string;
  people: number;
  hoursPerWeek: number;
  budget: number;
  dataReadiness: number;
  startDate: string;
};
export function roadmap(raw: unknown, assessment: Assessment) {
  const v = object(raw),
    solution = assessment.matches.find((s) => s.id === v.solutionId);
  const people = number(v.people, 0, 100, 'Nhân sự', true),
    hours = number(v.hoursPerWeek, 0, 60, 'Giờ/tuần/người'),
    budget = number(v.budget, 0, 100000, 'Ngân sách'),
    data = number(v.dataReadiness, 1, 5, 'Sẵn sàng dữ liệu', true);
  const startDate = text(v.startDate, 10, 'Ngày bắt đầu');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    new Date(startDate + 'T00:00:00Z').toISOString().slice(0, 10) !== startDate
  )
    throw Error('Ngày bắt đầu không hợp lệ.');
  const blockers: string[] = [];
  if (!solution)
    blockers.push(
      'Chưa chọn giải pháp đủ điều kiện; cần chuyên viên xác minh/báo giá.',
    );
  if (!people || !hours)
    blockers.push('Chưa bố trí nhân sự hoặc giờ triển khai.');
  if (solution && budget < solution.minAnnualCost)
    blockers.push('Ngân sách thấp hơn giá tối thiểu năm.');
  if (data < 3) blockers.push('Cần chuẩn hóa dữ liệu trước khi triển khai.');
  let week = 0;
  const capacity = people * hours,
    factor = capacity ? Math.max(1, 40 / capacity) : 1;
  const phases = [
    {
      title: 'Chuẩn hóa dữ liệu và trách nhiệm',
      weeks: 2,
      goal:
        assessment.gaps.map((g) => g.action).join(' ') ||
        'Đối soát số liệu đầu vào.',
    },
    {
      title: 'Thiết kế và triển khai thử',
      weeks: 4,
      goal: 'Chốt phạm vi, hợp đồng, tích hợp và thử nghiệm một nhóm nhỏ.',
    },
    {
      title: 'Đào tạo và vận hành thử',
      weeks: 4,
      goal: 'Kiểm tra dữ liệu, phân quyền và nghiệm thu nghiệp vụ.',
    },
    {
      title: 'Đối soát KPI và quyết định mở rộng',
      weeks: 2,
      goal: 'So sánh KPI cùng định nghĩa, kỳ đo và nguồn; chỉ mở rộng sau khi nghiệm thu.',
    },
  ].map((p) => {
    const begin = week;
    week += Math.ceil(p.weeks * factor);
    const date = (w: number) =>
      new Date(Date.parse(startDate + 'T00:00:00Z') + w * 7 * 86400000)
        .toISOString()
        .slice(0, 10);
    return {
      ...p,
      weeks: week - begin,
      start: date(begin),
      end: date(week),
      owner: 'Cần phân công',
    };
  });
  return {
    input: {
      assessmentId: text(v.assessmentId, 100, 'Mã đánh giá'),
      solutionId: v.solutionId || '',
      people,
      hoursPerWeek: hours,
      budget,
      dataReadiness: data,
      startDate,
    },
    status: blockers.length ? 'needs_preparation' : 'proposed',
    blockers,
    phases,
    totalWeeks: week,
    minAnnualCost: solution?.minAnnualCost ?? null,
    capacity,
    limitations:
      'Lộ trình dự kiến theo năng lực tự khai và tối thiểu 40 giờ nhóm/tuần, không phải cam kết nhà cung cấp. Giá tối thiểu cần đối chiếu báo giá.',
  };
}
export function alerts(history: Measurement[]) {
  return (Object.keys(KPIS) as KpiCode[]).flatMap((code) => {
    const records = history
      .filter((h) => h.code === code)
      .sort((a, b) => b.period.localeCompare(a.period));
    if (!records.length) return [];
    const latest = records[0],
      previous = records[1],
      up = KPIS[code].direction === 'up';
    return [
      {
        code,
        label: KPIS[code].label,
        latest,
        missed: up
          ? latest.value < latest.target
          : latest.value > latest.target,
        delta: previous ? latest.value - previous.value : null,
        worsening: previous
          ? up
            ? latest.value < previous.value
            : latest.value > previous.value
          : false,
      },
    ];
  });
}
export const FAQ = [
  {
    id: 'faq-kpi',
    title: 'KPI và đánh giá',
    content:
      'OTIF đo giao đúng hạn và đủ hàng. Nhập số đo, mục tiêu, kỳ đo và nguồn đối soát. DBI/LDMI dựa trên câu trả lời tự khai; không thay thế kiểm toán.',
    url: '/platform',
  },
  {
    id: 'faq-matching',
    title: 'Matching giải pháp',
    content:
      'Chỉ xếp hạng giải pháp xác thực, đã duyệt/xuất bản, đúng ngành, quy mô, phù hợp LDMI, ngân sách tối thiểu và giải quyết điểm nghẽn đã đo. Cần báo giá tổng chi phí.',
    url: '/platform',
  },
  {
    id: 'faq-support',
    title: 'Hỗ trợ và chuyển chuyên viên',
    content:
      'Nút Chuyển chuyên viên tạo yêu cầu trong hàng đợi hỗ trợ. Có mã và trạng thái, chưa có live chat hoặc SLA phản hồi được cam kết.',
    url: '/platform',
  },
];
export function retrieve<T extends { title: string; content: string }>(
  query: string,
  docs: T[],
  limit = 4,
) {
  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLowerCase();
  const words = [
    ...new Set(
      normalize(query)
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 2),
    ),
  ];
  return docs
    .map((doc) => ({
      doc,
      score: words.reduce(
        (s, w) =>
          s + (normalize(doc.title + ' ' + doc.content).includes(w) ? 1 : 0),
        0,
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc);
}
