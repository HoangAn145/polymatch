import {
  AssessmentResult,
  Solution,
  SolutionMatch,
  LogisticsBranch,
  EnterpriseProfile
} from '../types';
import { DBI_QUESTIONS, LDMI_QUESTIONS } from '../data/assessmentQuestions';
import { KNOWLEDGE_GAPS } from '../data/knowledgeGaps';
import { dbService } from './mockDatabase';

export class AssessmentService {
  /**
   * Filter LDMI questions applicable to the enterprise branch
   */
  public getQuestionsForBranch(branch: LogisticsBranch, services3PL: string[] = []) {
    const dbi = DBI_QUESTIONS;
    const ldmi = LDMI_QUESTIONS.filter(q => {
      if (branch === '3PL') {
        // If 3PL, check selected services
        if (q.nhom_nang_luc === 'VT' && !services3PL.includes('Vận tải đường bộ')) return false;
        if (q.nhom_nang_luc === 'KB' && !services3PL.includes('Kho bãi')) return false;
        if (q.nhom_nang_luc === 'GN' && !services3PL.includes('Giao nhận')) return false;
      }
      return q.nhanh_ap_dung.includes(branch);
    });

    return { dbi, ldmi };
  }

  /**
   * Calculate full assessment results
   */
  public calculateAssessment(
    userId: string,
    enterprise: EnterpriseProfile,
    answers: Record<string, number>
  ): AssessmentResult {
    // 1. Calculate DBI Pillars (7 pillars x 2 questions)
    const pillarMap: Record<string, number[]> = {
      "Định hướng chiến lược": [],
      "Trải nghiệm khách hàng": [],
      "Chuỗi cung ứng": [],
      "Hệ thống thông tin & Quản trị dữ liệu": [],
      "An toàn thông tin": [],
      "Quản lý vận hành": [],
      "Con người & Văn hóa số": []
    };

    DBI_QUESTIONS.forEach(q => {
      const ans = answers[q.id] || 2; // Default to level 2 if not answered
      const score = ((ans - 1) / 4) * 100;
      if (q.tru_cot_dbi && pillarMap[q.tru_cot_dbi]) {
        pillarMap[q.tru_cot_dbi].push(score);
      }
    });

    const dbi_tru_cot = Object.entries(pillarMap).map(([ten, scores]) => {
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { ten, diem: Math.round(avg * 10) / 10 };
    });

    const dbi_diem = Math.round(
      (dbi_tru_cot.reduce((sum, p) => sum + p.diem, 0) / (dbi_tru_cot.length || 1)) * 10
    ) / 10;

    let dbi_muc: AssessmentResult['dbi_muc'] = 'Khởi động';
    if (dbi_diem >= 80) dbi_muc = 'Dẫn dắt';
    else if (dbi_diem >= 60) dbi_muc = 'Nâng cao';
    else if (dbi_diem >= 40) dbi_muc = 'Hình thành';
    else if (dbi_diem >= 20) dbi_muc = 'Bắt đầu';

    // 2. Calculate LDMI Groups
    const groupNames: Record<string, string> = {
      VT: "Vận tải",
      KB: "Kho bãi",
      GN: "Giao nhận quốc tế",
      DH: "Đơn hàng & Giao nhận",
      HT: "Hiển thị & Tích hợp",
      CT: "Chứng từ & Hải quan",
      CP: "Chi phí & Hiệu suất",
      XA: "Logistics Xanh"
    };

    const groupScoresMap: Record<string, number[]> = {};
    Object.keys(groupNames).forEach(k => (groupScoresMap[k] = []));

    LDMI_QUESTIONS.forEach(q => {
      if (answers[q.id] !== undefined) {
        const score = ((answers[q.id] - 1) / 4) * 100;
        if (q.nhom_nang_luc) {
          groupScoresMap[q.nhom_nang_luc].push(score);
        }
      }
    });

    const ldmi_nhom = Object.entries(groupScoresMap)
      .filter(([, scores]) => scores.length > 0)
      .map(([ma, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return {
          ma,
          ten: groupNames[ma] || ma,
          diem: Math.round(avg * 10) / 10
        };
      });

    const ldmi_diem = ldmi_nhom.length
      ? Math.round((ldmi_nhom.reduce((s, g) => s + g.diem, 0) / ldmi_nhom.length) * 10) / 10
      : 30;

    let ldmi_muc: AssessmentResult['ldmi_muc'] = 'Thủ công';
    if (ldmi_diem >= 80) ldmi_muc = 'Thông minh';
    else if (ldmi_diem >= 60) ldmi_muc = 'Hiển thị';
    else if (ldmi_diem >= 40) ldmi_muc = 'Tích hợp';
    else if (ldmi_diem >= 20) ldmi_muc = 'Số hóa';

    // 3. Find Top 3 Bottlenecks (Gaps)
    // Sort groups ascending by score
    const sortedGroups = [...ldmi_nhom].sort((a, b) => a.diem - b.diem);
    const topGapsCodes: string[] = [];

    // Map the lowest groups to available Knowledge Gaps
    sortedGroups.slice(0, 3).forEach(g => {
      const matchGap = KNOWLEDGE_GAPS.find(kg => kg.nhom_nang_luc === g.ma);
      if (matchGap && !topGapsCodes.includes(matchGap.ma)) {
        topGapsCodes.push(matchGap.ma);
      }
    });

    // Fallback if needed
    if (topGapsCodes.length < 3) {
      KNOWLEDGE_GAPS.forEach(kg => {
        if (topGapsCodes.length < 3 && !topGapsCodes.includes(kg.ma)) {
          topGapsCodes.push(kg.ma);
        }
      });
    }

    const top_khoang_trong = topGapsCodes.slice(0, 3).map((code, idx) => {
      const kg = KNOWLEDGE_GAPS.find(k => k.ma === code)!;
      const groupScore = ldmi_nhom.find(g => g.ma === kg.nhom_nang_luc)?.diem || 25;
      return {
        thu_hang: idx + 1,
        ma: kg.ma,
        ten: kg.ten,
        nhom: `${kg.nhom_nang_luc} - ${groupNames[kg.nhom_nang_luc] || kg.nhom_nang_luc}`,
        diem_gap: Math.round((100 - groupScore) * 10) / 10,
        trieu_chung: kg.trieu_chung,
        nguyen_nhan: kg.nguyen_nhan,
        buoc_tiep_theo: kg.buoc_tiep.muc_2 || kg.buoc_tiep.muc_1,
        chi_so_khuyen_nghi: kg.chi_so
      };
    });

    // 4. Generate Rule-based AI Interpretation (Strictly aligned with 06_PROMPT_AI_DIEN_GIAI.md)
    const ai_dien_giai = {
      tom_tat: `Doanh nghiệp ${enterprise.ten} đang đạt mức ${dbi_muc} về chỉ số chuyển đổi số DBI (${dbi_diem}/100) và mức ${ldmi_muc} về chỉ số năng lực logistics LDMI (${ldmi_diem}/100). Doanh nghiệp sở hữu nền tảng tổ chức vững vàng nhưng quy trình vận hành chuỗi cung ứng còn tồn tại điểm nghẽn về phối hợp thời gian thực.`,
      diem_manh: [
        "Sự cam kết cao độ và đồng thuận từ ban lãnh đạo đối với đổi mới quy trình.",
        "Bộ phận tài chính và kế toán đã thiết lập quy trình kiểm soát tương đối ổn định.",
        "Quy mô hoạt động có tiềm năng mở rộng lớn khi chuẩn hóa các luồng dữ liệu tự động."
      ],
      diem_nghen: top_khoang_trong.map(kg => ({
        ma: kg.ma,
        hien_trang: kg.trieu_chung,
        nguyen_nhan_co_the: kg.nguyen_nhan,
        tac_dong: "Làm gia tăng chi phí vận hành biến đổi và kéo dài thời gian đối soát xử lý đơn.",
        buoc_chuan_bi: kg.buoc_tiep_theo,
        kpi: [kg.chi_so_khuyen_nghi],
        nguon: ["ASCM SCOR-DS", "Nghiên cứu Logistics Thực tiễn"]
      })),
      gioi_han: "Bản diễn giải này được tổng hợp từ dữ liệu tự khai của doanh nghiệp tại thời điểm đánh giá, không thay thế kiểm toán vận hành hoặc tư vấn kỹ thuật trực tiếp."
    };

    const newResult: AssessmentResult = {
      id: `asm-${Date.now()}`,
      userId,
      doanh_nghiep_id: enterprise.id,
      lan_thu: (dbService.getAssessments().filter(a => a.userId === userId).length || 0) + 1,
      ngay_tao: new Date().toISOString(),
      trang_thai: "hoan_thanh",
      dbi_diem,
      dbi_muc,
      dbi_tru_cot,
      ldmi_diem,
      ldmi_muc,
      ldmi_nhom,
      top_khoang_trong,
      ai_dien_giai,
      tra_loi: answers
    };

    dbService.addAssessment(newResult);
    return newResult;
  }

  /**
   * 7-Factor Matching Engine (Rule R08 & R09 from Master Spec)
   */
  public matchSolutions(
    assessment: AssessmentResult,
    enterprise: EnterpriseProfile
  ): SolutionMatch[] {
    const allSolutions = dbService.getSolutions();
    const userGaps = assessment.top_khoang_trong.map(k => k.ma);
    
    // LDMI Level numeric: Thu cong=1, So hoa=2, Tich hop=3, Hien thi=4, Thong minh=5
    const ldmiLevels = { 'Thủ công': 1, 'Số hóa': 2, 'Tích hợp': 3, 'Hiển thị': 4, 'Thông minh': 5 };
    const currentLdmiNum = ldmiLevels[assessment.ldmi_muc] || 2;

    const matches: SolutionMatch[] = [];

    allSolutions.forEach(sol => {
      // Rule R19: Hard filter - Solution target LDMI must not exceed current level + 1
      if (sol.muc_ldmi_phu_hop > currentLdmiNum + 1) {
        return;
      }

      // 1. Khoảng trống (30%)
      let score_gap = 0;
      if (sol.khoang_trong_giai_quyet.includes(userGaps[0])) {
        score_gap = 1.0;
      } else if (userGaps[1] && sol.khoang_trong_giai_quyet.includes(userGaps[1])) {
        score_gap = 0.75;
      } else if (userGaps[2] && sol.khoang_trong_giai_quyet.includes(userGaps[2])) {
        score_gap = 0.55;
      } else {
        score_gap = 0.2;
      }

      // 2. Ưu tiên (15%)
      const score_priority = sol.hoat_dong_logistics.includes(enterprise.nhanh) ? 1.0 : 0.6;

      // 3. Loại hình & Quy mô (15%)
      const matchBranch = sol.phan_khuc.includes(enterprise.nhanh) || sol.phan_khuc.includes('KH') ? 1.0 : 0.5;
      const matchScale = sol.quy_mo_phu_hop.includes(enterprise.quy_mo) ? 1.0 : 0.6;
      const score_scale = (matchBranch + matchScale) / 2;

      // 4. Ngân sách (15%)
      let score_budget = 0.8;
      if (sol.gia_min_trieu !== undefined) {
        if (enterprise.ngan_sach_12_thang === 'duoi_20' && sol.gia_min_trieu <= 20) score_budget = 1.0;
        else if (enterprise.ngan_sach_12_thang === '20_100' && sol.gia_min_trieu <= 100) score_budget = 1.0;
        else if (enterprise.ngan_sach_12_thang === '100_300' && sol.gia_min_trieu <= 300) score_budget = 1.0;
        else if (enterprise.ngan_sach_12_thang === 'tren_300') score_budget = 1.0;
        else score_budget = 0.5;
      }

      // 5. Mức sẵn sàng (10%)
      const readinessAvg = ((enterprise.san_sang_nhan_su || 3) + (enterprise.san_sang_du_lieu || 3) + (enterprise.cam_ket_lanh_dao || 4)) / 15;
      const score_readiness = readinessAvg;

      // 6. Hệ thống hiện tại (10%)
      let score_legacy = 0.85;
      if (sol.tich_hop.some(t => enterprise.phan_mem_dang_dung.includes(t))) {
        score_legacy = 1.0;
      }

      // 7. Kiểm chứng & Case study (5%)
      const score_proven = sol.case_study ? 1.0 : 0.6;

      // Total Match Score
      const totalScore = (
        0.30 * score_gap +
        0.15 * score_priority +
        0.15 * score_scale +
        0.15 * score_budget +
        0.10 * score_readiness +
        0.10 * score_legacy +
        0.05 * score_proven
      );

      const percent = Math.round(totalScore * 100);

      const reasons: string[] = [];
      const caveats: string[] = [];

      if (score_gap >= 0.75) reasons.push("Khắc phục trực tiếp điểm nghẽn nghiêm trọng nhất của doanh nghiệp.");
      if (score_scale >= 0.9) reasons.push(`Được thiết kế chuyên biệt cho doanh nghiệp quy mô ${enterprise.quy_mo} ngành ${enterprise.nhanh}.`);
      if (score_budget >= 0.9) reasons.push("Chi phí nằm hoàn toàn trong hạn mức ngân sách dự kiến.");
      if (sol.case_study) reasons.push("Đã có kết quả thực tiễn kiểm chứng tại thị trường Việt Nam.");

      if (sol.muc_ldmi_phu_hop > currentLdmiNum) caveats.push("Đòi hỏi nâng cấp chuẩn hóa quy trình dữ liệu đầu vào.");
      if (score_budget < 0.7) caveats.push("Cần đàm phán phương án thanh toán linh hoạt theo tháng để tối ưu ngân sách.");

      matches.push({
        solution: sol,
        matchScore: percent,
        breakdown: {
          khoang_trong: Math.round(score_gap * 100) / 100,
          uu_tien: Math.round(score_priority * 100) / 100,
          loai_hinh_quy_mo: Math.round(score_scale * 100) / 100,
          ngan_sach: Math.round(score_budget * 100) / 100,
          san_sang: Math.round(score_readiness * 100) / 100,
          he_thong: Math.round(score_legacy * 100) / 100,
          kiem_chung: Math.round(score_proven * 100) / 100
        },
        ly_do: reasons,
        han_che: caveats
      });
    });

    // Sort descending by match score
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}

export const assessmentService = new AssessmentService();
