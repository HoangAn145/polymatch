import type { Session } from "@supabase/supabase-js";
import type {
  User,
  EnterpriseProfile,
  SellerProfile,
  AssessmentResult,
} from "../types";
import { DBI_QUESTIONS } from "../data/assessmentQuestions";
import { KNOWLEDGE_GAPS } from "../data/knowledgeGaps";
import type { DiagnosticResult } from "./diagnostic";
export type CloudProfile = {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  role: User["role"];
  status: User["status"];
  created_at: string;
};
export function profileUser(profile: CloudProfile, session: Session): User {
  const m = session.user.user_metadata;
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    companyName: profile.company_name,
    role: profile.role,
    status: profile.status,
    createdAt: profile.created_at,
    phone: m.phone || "",
    taxId: m.taxId || "",
    vendorApproved: profile.role === "SELLER" && profile.status === "active",
  };
}
export function enterpriseFor(
  user: User,
  metadata: Record<string, unknown>,
): EnterpriseProfile {
  const branch = ["VT", "FF", "KB", "3PL", "LM", "KH"].includes(
    String(metadata.branch),
  )
    ? (metadata.branch as EnterpriseProfile["nhanh"])
    : "VT";
  const scale = ["sieu_nho", "nho", "vua", "lon"].includes(
    String(metadata.scale),
  )
    ? (metadata.scale as EnterpriseProfile["quy_mo"])
    : "nho";
  return {
    id: `ent-${user.id}`,
    userId: user.id,
    ten: user.companyName,
    ma_so_thue: user.taxId || "",
    tinh_thanh: String(metadata.city || ""),
    dia_chi: String(metadata.address || ""),
    nguoi_lien_he: user.fullName,
    so_dien_thoai: user.phone || "",
    email_lien_he: user.email,
    so_lao_dong_bhxh: 0,
    doanh_thu_nam_truoc: "",
    tong_nguon_von: "",
    quy_mo: scale,
    nhanh: branch,
    quy_mo_dac_thu: {},
    phan_mem_dang_dung: [],
    updatedAt: new Date().toISOString(),
  };
}
export function sellerFor(
  user: User,
  metadata: Record<string, unknown>,
): SellerProfile {
  return {
    id: `vendor-${user.id}`,
    userId: user.id,
    ten: user.companyName,
    ma_so_thue: user.taxId || "",
    nguoi_lien_he: user.fullName,
    so_dien_thoai: user.phone || "",
    email_lien_he: user.email,
    dia_chi: String(metadata.address || ""),
    website: String(metadata.website || ""),
    nhom_cong_nghe: Array.isArray(metadata.techGroups)
      ? metadata.techGroups
      : [],
    nganh_phuc_vu: Array.isArray(metadata.servedBranches)
      ? metadata.servedBranches
      : [],
    quy_mo_khach_hang: [],
    trang_thai: user.vendorApproved ? "da_duyet" : "cho_duyet",
    goi_tham_gia: {
      ten_goi: "Chưa đăng ký",
      phi_nam: 0,
      ngay_bat_dau: "",
      ngay_het_han: "",
      trang_thai_phi: "chua_thanh_toan",
    },
    updatedAt: new Date().toISOString(),
  };
}
const groupNames: Record<string, string> = {
  VT: "Vận tải",
  KB: "Kho bãi",
  GN: "Giao nhận quốc tế",
  DH: "Đơn hàng & Giao nhận",
  HT: "Hiển thị & Tích hợp",
  CT: "Chứng từ & Hải quan",
  CP: "Chi phí & Hiệu suất",
  XA: "Logistics Xanh",
};
export function legacyAssessment(
  result: DiagnosticResult,
  id: string,
  userId: string,
  createdAt: string,
  attempt = 1,
): AssessmentResult {
  const dbiNames: AssessmentResult["dbi_muc"][] = [
    "Khởi động",
    "Bắt đầu",
    "Hình thành",
    "Nâng cao",
    "Dẫn dắt",
  ];
  const ldmiNames: AssessmentResult["ldmi_muc"][] = [
    "Thủ công",
    "Số hóa",
    "Tích hợp",
    "Hiển thị",
    "Thông minh",
  ];
  const pillars = [...new Set(DBI_QUESTIONS.map((q) => q.tru_cot_dbi!))].map(
    (ten) => {
      const qs = DBI_QUESTIONS.filter((q) => q.tru_cot_dbi === ten);
      return {
        ten,
        diem:
          Math.round(
            (qs.reduce(
              (sum, q) => sum + (result.input.answers[q.id] - 1) * 25,
              0,
            ) /
              qs.length) *
              10,
          ) / 10,
      };
    },
  );
  const gaps = result.gaps.map((g, i) => {
    const k = KNOWLEDGE_GAPS.find((x) => x.ma === g.id)!;
    return {
      thu_hang: i + 1,
      ma: g.id,
      ten: g.title,
      nhom: `${k.nhom_nang_luc} - ${groupNames[k.nhom_nang_luc] || k.nhom_nang_luc}`,
      diem_gap:
        100 -
        (result.groups.find((x) => x.code === k.nhom_nang_luc)?.score ?? 0),
      trieu_chung: k.trieu_chung,
      nguyen_nhan: k.nguyen_nhan,
      buoc_tiep_theo: g.next,
      chi_so_khuyen_nghi: g.kpi,
    };
  });
  return {
    id,
    userId,
    doanh_nghiep_id: `ent-${userId}`,
    lan_thu: attempt,
    ngay_tao: createdAt,
    trang_thai: "hoan_thanh",
    dbi_diem: result.dbi,
    dbi_muc: dbiNames[Math.min(4, Math.floor(result.dbi / 20))],
    dbi_tru_cot: pillars,
    ldmi_diem: result.ldmi,
    ldmi_muc: ldmiNames[Math.min(4, Math.floor(result.ldmi / 20))],
    ldmi_nhom: result.groups.map((g) => ({
      ma: g.code,
      ten: groupNames[g.code] || g.code,
      diem: g.score,
    })),
    top_khoang_trong: gaps,
    ai_dien_giai: {
      tom_tat: result.analysis?.generatedBy === "gemini" ? `${result.interpretation}\n\n${result.analysis.summary}` : result.interpretation,
      diem_manh: pillars
        .filter((p) => p.diem >= 60)
        .map((p) => `${p.ten}: ${p.diem}/100`),
      diem_nghen: gaps.map((g) => ({
        ma: g.ma,
        hien_trang: g.trieu_chung,
        nguyen_nhan_co_the: g.nguyen_nhan,
        tac_dong: "Cần đối chiếu với KPI thực tế.",
        buoc_chuan_bi: g.buoc_tiep_theo,
        kpi: [g.chi_so_khuyen_nghi],
        nguon: result.gaps.find((x) => x.id === g.ma)?.source || [],
      })),
      gioi_han:
        "Kết quả dựa trên dữ liệu tự khai; cần kiểm chứng nguồn giá và năng lực nhà cung cấp trước khi quyết định.",
    },
    tra_loi: result.input.answers,
    diagnostic: result,
  };
}
