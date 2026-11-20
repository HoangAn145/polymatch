import type {
  AssessmentResult,
  SolutionMatch,
  LogisticsBranch,
  EnterpriseProfile,
} from "../types";
import { DBI_QUESTIONS, LDMI_QUESTIONS } from "../data/assessmentQuestions";
import {
  diagnose,
  type DiagnosticInput,
  type DiagnosticResult,
  solutionRejections,
} from "../lib/diagnostic";
import { legacyAssessment } from "../lib/legacyCompatibility";
import { demoMode, api, requireSupabase } from "../lib/supabase";
import { featureStore } from "../lib/featureStore";
import { dbService } from "./mockDatabase";
export function budgetFor(enterprise: EnterpriseProfile): number {
  return (
    enterprise.ngan_sach_toi_da_trieu ??
    { duoi_20: 20, "20_100": 100, "100_300": 300, tren_300: 500 }[
      enterprise.ngan_sach_12_thang || ""
    ] ??
    100
  );
}
export function diagnosticInput(
  enterprise: EnterpriseProfile,
  answers: Record<string, number>,
  baseline: DiagnosticInput["baseline"],
): DiagnosticInput {
  return {
    branch: enterprise.nhanh,
    scale: enterprise.quy_mo,
    budget: budgetFor(enterprise),
    people: enterprise.san_sang_nhan_su ?? 3,
    data: enterprise.san_sang_du_lieu ?? 3,
    leadership: enterprise.cam_ket_lanh_dao ?? 3,
    answers,
    baseline,
    operationalKpis:enterprise.operational_kpis,
  };
}
export class AssessmentService {
  public getQuestionsForBranch(
    branch: LogisticsBranch,
    _services3PL: string[] = [],
  ) {
    return {
      dbi: DBI_QUESTIONS,
      ldmi: LDMI_QUESTIONS.filter((q) => q.nhanh_ap_dung.includes(branch)),
    };
  }
  public calculateAssessment(
    userId: string,
    enterprise: EnterpriseProfile,
    answers: Record<string, number>,
    baseline: DiagnosticInput["baseline"],
  ): AssessmentResult {
    const result = diagnose(diagnosticInput(enterprise, answers, baseline));
    return legacyAssessment(
      result,
      crypto.randomUUID(),
      userId,
      new Date().toISOString(),
      dbService.getAssessments().filter((a) => a.userId === userId).length + 1,
    );
  }
  public async submit(
    userId: string,
    enterprise: EnterpriseProfile,
    answers: Record<string, number>,
    baseline: DiagnosticInput["baseline"],
  ): Promise<AssessmentResult> {
    const input = diagnosticInput(enterprise, answers, baseline);
    // Validate locally before any server request, using the exact server rules.
    diagnose(input);
    let assessment: AssessmentResult;
    if (demoMode) {
      assessment = this.calculateAssessment(
        userId,
        enterprise,
        answers,
        baseline,
      );
      const { error } = await featureStore()
        .from("assessments")
        .insert({
          id: assessment.id,
          user_id: userId,
          result: assessment.diagnostic,
          created_at: assessment.ngay_tao,
        });
      if (error) throw error;
    } else {
      const { error } = await requireSupabase()
        .from("enterprises")
        .upsert({
          user_id: userId,
          data: { ...input, legacyProfile: enterprise },
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      const saved = await api<{
        id: string;
        created_at: string;
        result: DiagnosticResult;
      }>("diagnostic", input);
      assessment = legacyAssessment(
        saved.result,
        saved.id,
        userId,
        saved.created_at,
        dbService.getAssessments().filter((a) => a.userId === userId).length +
          1,
      );
    }
    dbService.addAssessment(assessment);
    return assessment;
  }
  public getExcludedSolutions(
    assessment: AssessmentResult,
    enterprise: EnterpriseProfile,
  ) {
    const levels = {
      "Thủ công": 1,
      "Số hóa": 2,
      "Tích hợp": 3,
      "Hiển thị": 4,
      "Thông minh": 5,
    };
    return dbService.getSolutions().flatMap((solution) => {
      const reasons = solutionRejections(
        solution,
        enterprise.nhanh,
        enterprise.quy_mo,
        budgetFor(enterprise),
        levels[assessment.ldmi_muc],
      );
      return reasons.length ? [{ solution, reasons }] : [];
    });
  }
  public matchSolutions(
    assessment: AssessmentResult,
    enterprise: EnterpriseProfile,
  ): SolutionMatch[] {
    if (!assessment) return [];
    const levels = {
      "Thủ công": 1,
      "Số hóa": 2,
      "Tích hợp": 3,
      "Hiển thị": 4,
      "Thông minh": 5,
    };
    const gaps = assessment.top_khoang_trong.map((g) => g.ma);
    return dbService
      .getSolutions()
      .filter(
        (sol) =>
          !solutionRejections(
            sol,
            enterprise.nhanh,
            enterprise.quy_mo,
            budgetFor(enterprise),
            levels[assessment.ldmi_muc],
          ).length,
      )
      .map((sol) => {
        const gap = sol.khoang_trong_giai_quyet.includes(gaps[0])
          ? 1
          : sol.khoang_trong_giai_quyet.includes(gaps[1])
            ? 0.75
            : sol.khoang_trong_giai_quyet.includes(gaps[2])
              ? 0.55
              : 0;
        const readiness =
          ((enterprise.san_sang_nhan_su ?? 3) +
            (enterprise.san_sang_du_lieu ?? 3) +
            (enterprise.cam_ket_lanh_dao ?? 3)) /
          15;
        const breakdown = {
          khoang_trong: gap,
          uu_tien: sol.hoat_dong_logistics.includes(enterprise.nhanh) ? 1 : 0,
          loai_hinh_quy_mo: 1,
          ngan_sach: sol.gia_min_trieu === undefined ? 0 : 1,
          san_sang: readiness,
          he_thong: 0,
          kiem_chung: 0,
        };
        const matchScore = Math.round(
          30 * gap +
            15 * breakdown.uu_tien +
            15 +
            15 * breakdown.ngan_sach +
            10 * readiness,
        );
        return {
          solution: sol,
          matchScore,
          breakdown,
          ly_do: [
            ...(gap
              ? ["Giải quyết khoảng trống ưu tiên của doanh nghiệp."]
              : []),
            "Đáp ứng bộ lọc loại hình, quy mô và mức LDMI.",
            ...(sol.gia_min_trieu === undefined
              ? []
              : ["Giá tối thiểu tham khảo nằm trong ngân sách 12 tháng."]),
          ],
          han_che: [
            "Cần xác minh khả năng tích hợp, nguồn giá và case study trước khi quyết định.",
            ...(sol.gia_min_trieu === undefined
              ? ["Chưa có giá; cần báo giá để xác nhận phù hợp ngân sách."]
              : []),
          ],
        };
      })
      .sort(
        (a, b) =>
          b.matchScore - a.matchScore ||
          a.solution.id.localeCompare(b.solution.id),
      );
  }
}
export const assessmentService = new AssessmentService();
