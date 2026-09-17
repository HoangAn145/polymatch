import { 
  AssessmentQuestion, 
  AssessmentResultData, 
  EnterpriseSize 
} from '../types';
import { DBI_PILLARS, SME_ASSESSMENT_QUESTIONS } from './mockData';
import { ENTERPRISE_ASSESSMENT_QUESTIONS, ENTERPRISE_DBI_QUESTIONS } from './dbiEnterpriseQuestions';
import { SME_ASSESSMENT_QUESTIONS_1567, SME_CORE_QUESTIONS, SME_INDUSTRIES_SOLUTIONS } from './dbiSmeQuestions';
import { calculateUnifiedDbiAssessment } from '../services/dbiScoringService';
import { 
  LEGAL_FRAMEWORK,
  LARGE_PILLAR_MAX,
  SME_PILLAR_MAX,
  DBI_LEVELS_SME,
  DBI_LEVELS_LARGE
} from './dbiConstants';

// Căn cứ pháp lý & Cấu hình mức điểm (Re-export từ dbiConstants)
export {
  LEGAL_FRAMEWORK,
  LARGE_PILLAR_MAX,
  SME_PILLAR_MAX,
  DBI_LEVELS_SME,
  DBI_LEVELS_LARGE
};

// Bộ câu hỏi khảo sát chuẩn cho DOANH NGHIỆP LỚN (Phụ lục II - 25 nhóm tiêu chí gộp, 6 trụ cột)
export const LARGE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = ENTERPRISE_ASSESSMENT_QUESTIONS;
export { ENTERPRISE_DBI_QUESTIONS, SME_ASSESSMENT_QUESTIONS_1567, SME_CORE_QUESTIONS, SME_INDUSTRIES_SOLUTIONS };

// Hàm tính toán kết quả đánh giá theo đúng Quyết định 1567/QĐ-BKHCN
export function calculateDbiAssessment({
  answers,
  assessmentType,
  companyName,
  industry,
  userId = 'BUYER-01',
  selectedIndustrySolutions,
  selectedSolutionsCount
}: {
  answers: Record<string, number>;
  assessmentType: EnterpriseSize;
  companyName: string;
  industry: string;
  userId?: string;
  selectedIndustrySolutions?: string[];
  selectedSolutionsCount?: number;
}): AssessmentResultData {
  return calculateUnifiedDbiAssessment({
    answers,
    assessmentType,
    companyName,
    industry,
    userId,
    selectedIndustrySolutions,
    selectedSolutionsCount
  });
}
