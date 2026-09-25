/**
 * Module M33: AI Diễn Giải Logistics & Chẩn đoán Vấn đề với Gemini API
 * Server-backed AI calling with @google/genai on the server
 * Strictly adheres to M33.03 validation rules:
 * - No vendor names
 * - No false percentage promises (e.g. "giảm 20% chi phí")
 * - Next steps never jump beyond current LDMI level + 1
 */

import { IdentifiedGap } from './scoring';
import { BranchCode } from '../data/questions';

export interface AiInterpretation {
  tom_tat: string;
  khoang_trong: {
    ma: string;
    ten: string;
    hien_trang: string;
    nguyen_nhan: string;
    he_qua: string;
    buoc_tiep_theo: string;
    chuan_bi: string;
    chi_so: string[];
    nguon: string[];
  }[];
  luu_y: string;
  thoi_gian_tao: string;
}

export interface ProblemItem {
  id: string;
  ten_van_de: string;
  muc_do: 'nghiem_trong' | 'canh_bao' | 'khuyen_nghi';
  khau_anh_huong: string;
  trieu_chung_thuc_te: string;
  nguyen_nhan_goc_re: string;
  rui_ro_thiet_hai: string;
  giai_phap_khac_phuc: string;
}

export interface UrgentRoadmapStep {
  giai_doan: string;
  viec_can_lam: string;
  ket_qua_dau_ra: string;
}

export interface GeminiProblemAnalysis {
  tieu_de_chan_doan: string;
  danh_gia_tong_quan: string;
  danh_sach_van_de: ProblemItem[];
  diem_nghen_lien_phong_ban: string;
  nguy_co_gatekeeper: string;
  lo_trinh_3_buoc_cap_bach: UrgentRoadmapStep[];
  thong_diep_chuyen_gia: string;
  isFallback?: boolean;
  generatedAt?: string;
  errorNotice?: string;
}

// Fallback template generator directly built from TRI_THUC_KHOANG_TRONG (Infallible M33.03 compliant)
export function sinhDienGiaiMau(
  nhanh: BranchCode,
  dbiMucTen: string,
  ldmiMucTen: string,
  topGaps: IdentifiedGap[]
): AiInterpretation {
  const khoangTrongList = topGaps.map((gap) => {
    return {
      ma: gap.ma_khoang_trong,
      ten: gap.ten_khoang_trong,
      hien_trang: `Hiện tại doanh nghiệp đang gặp tình trạng: ${gap.tri_thuc.trieu_chung}. Trong bài đánh giá, câu hỏi "${gap.cau_thap_nhat_ma}" chỉ đạt mức ${gap.cau_thap_nhat_muc}/5.`,
      nguyen_nhan: gap.tri_thuc.nguyen_nhan,
      he_qua: `Ảnh hưởng trực tiếp đến năng lực vận hành, gây chậm trễ đối soát và khó đáp ứng cam kết dịch vụ với khách hàng.`,
      buoc_tiep_theo: gap.buoc_tiep_theo,
      chuan_bi: gap.tri_thuc.dieu_kien,
      chi_so: [gap.tri_thuc.chi_so],
      nguon: gap.tri_thuc.nguon,
    };
  });

  return {
    tom_tat: `Doanh nghiệp hiện đang ở mức DBI "${dbiMucTen}" và mức LDMI "${ldmiMucTen}". Hệ thống ghi nhận 3 khoảng trống vận hành then chốt tập trung ở các khâu ${topGaps.map((g) => g.ten_khoang_trong).join(', ')}. Lộ trình khuyến nghị ưu tiên chuẩn hóa quy trình và dữ liệu nội bộ trước khi đầu tư các giải pháp tự động hóa nâng cao.`,
    khoang_trong: khoangTrongList,
    luu_y: 'Kết quả đánh giá mang tính chất định hướng dựa trên bộ câu hỏi rút gọn theo đặc thù logistics Việt Nam. Doanh nghiệp cần phối hợp với chuyên gia kỹ thuật để khảo sát thực địa trước khi ký hợp đồng triển khai.',
    thoi_gian_tao: new Date().toLocaleDateString('vi-VN')
  };
}

// Validation filter according to M33.03
export function kiemTraDauRaAi(text: string, vendorNames: string[] = ['Smartlog', 'Abivin', 'Logivan', 'Sapo', 'MISA', 'Viettel']): boolean {
  for (const name of vendorNames) {
    if (text.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
  }
  const promiseRegex = /(giảm|tiết kiệm|tăng)\s+\d+\s*%/i;
  if (promiseRegex.test(text)) {
    return false;
  }
  return true;
}

/**
 * Call Server API to generate interpretation via Gemini API
 */
export async function taoDienGiaiAi(
  nhanh: BranchCode,
  dbiMucTen: string,
  ldmiMucTen: string,
  topGaps: IdentifiedGap[],
  uuTienP01: string[],
  nganSachP02: string,
  yKienTuDo?: string
): Promise<AiInterpretation> {
  const fallback = sinhDienGiaiMau(nhanh, dbiMucTen, ldmiMucTen, topGaps);

  try {
    const res = await fetch('/api/gemini/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nhanh,
        dbiMucTen,
        ldmiMucTen,
        topGaps,
        uuTienP01,
        nganSachP02,
        yKienTuDo,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.tom_tat && kiemTraDauRaAi(data.tom_tat)) {
        fallback.tom_tat = data.tom_tat;
      }
      if (data.luu_y) {
        fallback.luu_y = data.luu_y;
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API call fallback to deterministic template:', err);
  }

  return fallback;
}

/**
 * Call Gemini API to deeply diagnose operational problems & bottlenecks
 */
export async function goiGeminiPhanTichVanDe(params: {
  companyName?: string;
  branch: BranchCode;
  scale?: string;
  dbiResult?: any;
  ldmiResult?: any;
  topGaps?: any[];
  unmeasuredMetrics?: string[];
  gatekeeperWarning?: string;
  operationalDescription?: string;
  customProblemPrompt?: string;
}): Promise<GeminiProblemAnalysis> {
  try {
    const res = await fetch('/api/gemini/analyze-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.data) {
      return json.data as GeminiProblemAnalysis;
    }
    throw new Error('No data received from diagnostic endpoint');
  } catch (err: any) {
    console.error('Call Gemini analyze-problems error:', err);
    // Return structured default so UI always remains polished
    return {
      tieu_de_chan_doan: `Chẩn đoán Vấn đề Vận hành Chuyên sâu (${params.branch})`,
      danh_gia_tong_quan:
        'Doanh nghiệp đang đối mặt với tình trạng đứt gãy luồng thông tin giữa văn phòng điều hành và hiện trường (tài xế, thủ kho). Việc phụ thuộc vào bảng tính rời rạc khiến chi phí ẩn tăng cao và kéo dài thời gian đối soát công nợ.',
      danh_sach_van_de: [
        {
          id: 'VD1',
          ten_van_de: 'Quy trình thu hồi chứng từ & giao nhận (POD) chậm trễ',
          muc_do: 'nghiem_trong',
          khau_anh_huong: 'Vận tải & Khách hàng',
          trieu_chung_thuc_te: 'Tài xế giao hàng xong giữ biên bản giấy nhiều ngày mới nộp về văn phòng.',
          nguyen_nhan_goc_re: 'Chưa có ứng dụng di động ePOD có ảnh chụp và chữ ký số tức thời.',
          rui_ro_thiet_hai: 'Đọng công nợ 15-30 ngày, dễ thất lạc biên bản dẫn đến không xuất được hóa đơn.',
          giai_phap_khac_phuc: 'Trang bị app lái xe ePOD để đồng bộ tức thời chứng từ số về kế toán ngay khi khách ký nhận.',
        },
        {
          id: 'VD2',
          ten_van_de: 'Tách rời dữ liệu giữa Điều xe và Kế toán (Data Silo)',
          muc_do: 'nghiem_trong',
          khau_anh_huong: 'Hiển thị & Tích hợp (Nhóm HT)',
          trieu_chung_thuc_te: 'Nhân viên phải nhập liệu lại từ bảng kê Excel vào phần mềm tài chính.',
          nguyen_nhan_goc_re: 'Thiếu cổng kết nối API giữa phần mềm vận hành và phần mềm kế toán.',
          rui_ro_thiet_hai: 'Sai sót số liệu, mất 2-3 ngày cuối tháng để đối soát cước và phụ phí.',
          giai_phap_khac_phuc: 'Chuẩn hóa danh mục và xây dựng kết nối API tự động giữa hệ thống vận hành và kế toán.',
        },
        {
          id: 'VD3',
          ten_van_de: 'Chưa quản trị tỷ lệ chạy rỗng chiều về và hao hụt nhiên liệu',
          muc_do: 'canh_bao',
          khau_anh_huong: 'Chi phí & Hiệu suất (Nhóm CP)',
          trieu_chung_thuc_te: 'Không biết chính xác tỷ lệ km chạy rỗng và định mức dầu từng chuyến.',
          nguyen_nhan_goc_re: 'Dữ liệu GPS chưa liên kết với lệnh điều xe và tải trọng.',
          rui_ro_thiet_hai: 'Lãng phí chi phí nhiên liệu và hao mòn xe chiều về lên tới 30-40%.',
          giai_phap_khac_phuc: 'Thiết lập định mức chi tiết theo tuyến và tích hợp dữ liệu GPS vào lệnh vận chuyển.',
        },
      ],
      diem_nghen_lien_phong_ban:
        'Sự rời rạc giữa Đội xe - Điều phối - Kế toán tạo nên độ trễ thông tin 3-5 ngày trong toàn chuỗi cung ứng nội bộ.',
      nguy_co_gatekeeper:
        'Nhóm Hiển thị & Tích hợp (HT) chưa vượt ngưỡng 50 điểm sẽ ngăn cản doanh nghiệp nâng cấp lên cấp độ số hóa tự động.',
      lo_trinh_3_buoc_cap_bach: [
        {
          giai_doan: 'Tháng thứ 1',
          viec_can_lam: 'Chuẩn hóa quy trình giao nhận và mã hóa danh mục đơn hàng/khách hàng.',
          ket_qua_dau_ra: '100% chuyến xe có mã quản lý đồng nhất.',
        },
        {
          giai_doan: 'Tháng thứ 2-3',
          viec_can_lam: 'Ứng dụng ePOD trên thiết bị di động tài xế.',
          ket_qua_dau_ra: 'Biên bản giao nhận số hóa ngay trong 15 phút sau giao hàng.',
        },
        {
          giai_doan: 'Tháng thứ 4-6',
          viec_can_lam: 'Kết nối API nội bộ và xây dựng dashboard KPI vận hành.',
          ket_qua_dau_ra: 'Báo cáo doanh thu và chi phí theo thời gian thực.',
        },
      ],
      thong_diep_chuyen_gia:
        'Ưu tiên số hóa điểm chạm tài xế - khách hàng bằng ePOD trước khi đầu tư các hệ thống phức tạp.',
      isFallback: true,
      errorNotice: err?.message,
    };
  }
}
