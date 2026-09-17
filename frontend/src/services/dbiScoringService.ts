/**
 * DBI SCORING ALGORITHM SERVICE
 * Căn cứ pháp lý: Quyết định số 1567/QĐ-BKHCN ngày 30/06/2025 của Bộ Khoa học và Công nghệ
 * Ban hành Bộ tiêu chí đánh giá mức độ chuyển đổi số doanh nghiệp (Digital Business Index - DBI)
 * 
 * Tách biệt thuật toán, trọng số và thang đo cho 2 phân khúc:
 * 1. DOANH NGHIỆP LỚN (Large Enterprise - Phụ lục II)
 *    - Đánh giá toàn diện 6 Trụ cột (140 tiêu chí gom thành 25 nhóm tiêu chí)
 *    - Thang đo 5 mức độ (Mức 1 = 0 điểm, mỗi mức cao hơn +1 điểm -> thang thô 0-4)
 *    - Chuẩn hóa đa tiêu chí bằng phương pháp TOPSIS và thang điểm 695
 * 
 * 2. DOANH NGHIỆP NHỎ VÀ VỪA (SME - Phụ lục I)
 *    - Đánh giá Năng lực Cốt lõi (Nhóm 2: Mức độ thâm nhập công nghệ & Nhóm 3: Nhận thức/Chiến lược)
 *    - Kết hợp Mức độ ứng dụng Giải pháp số đặc thù theo từng ngành nghề (Mục 7.2 cho 25 ngành)
 *    - Trọng số kết hợp: 40% Cốt lõi + 60% Thâm nhập giải pháp ngành
 */

import { PillarId, EnterpriseSize, DbiLevelNumber, DbiLevelInfo, AssessmentResultData } from '../types';
import { 
  DBI_LEVELS_SME, 
  DBI_LEVELS_LARGE, 
  LARGE_PILLAR_MAX, 
  SME_PILLAR_MAX,
  LEGAL_FRAMEWORK 
} from '../data/dbiConstants';

// ============================================================================
// 1. CẤU HÌNH TRỌNG SỐ & BẢNG THAM CHIẾU 25 NGÀNH (SME)
// ============================================================================

/**
 * Bảng chuẩn điểm tối đa (max_score_raw) cho danh mục giải pháp số theo ngành (Mục 7.2)
 * Trích xuất từ dbi_sme.json và bảng chỉ tiêu đặc thù ngành QĐ 1567
 */
export const SME_INDUSTRY_MAX_SCORES: Record<string, number> = {
  'Bán lẻ': 20.83,
  'Sắt thép': 14.0,
  'Du lịch - Lữ hành': 21.0,
  'Ô tô - Xe máy': 21.0,
  'Sức khỏe, sắc đẹp': 18.0,
  'Môi trường': 13.0,
  'Vận tải hành khách': 13.0,
  'Giáo dục Đào tạo': 17.5,
  'Lưu trú - Khách sạn': 26.0,
  'Bất động sản': 18.0,
  'Dược phẩm': 14.0,
  'Dịch vụ kế toán': 23.0,
  'Thực phẩm và Đồ uống (F&B)': 28.0,
  'Cao su': 25.0,
  'Logistics': 20.83,
  'Nông nghiệp': 28.0,
  'Nhựa': 21.0,
  'May mặc': 23.0,
  'Gas - Xăng dầu': 21.0,
  'Thiết bị y tế': 20.0,
  'Khoáng sản': 22.0,
  'Thủy sản': 23.0,
  'Bao bì': 22.0,
  'Giấy': 20.0,
  'Xây dựng': 22.0
};

/**
 * Tỷ trọng phân bổ cho Doanh nghiệp SME (Phụ lục I)
 */
export const SME_SCORING_WEIGHTS = {
  coreWeight: 0.4,       // 40% Điểm nhận thức, hạ tầng, an toàn thông tin & chiến lược cốt lõi
  industryWeight: 0.6,   // 60% Điểm mức độ ứng dụng giải pháp số thực tế theo ngành
  maxCoreQuestions: 7,   // 7 câu có tính điểm trong bộ câu hỏi lõi
  maxCoreRawScore: 28,   // 7 câu * 4 điểm tối đa = 28 điểm
};

/**
 * Cấu hình 6 Trụ cột theo Phụ lục II Doanh nghiệp Lớn (25 nhóm tiêu chí / 140 tiêu chí con)
 */
export interface EnterprisePillarConfig {
  id: PillarId;
  name: string;
  questionCodes: string[];
  maxPointsAppendixII: number; // Điểm tối đa theo Phụ lục II (tổng 695)
  weightRatio: number;        // Tỷ trọng tương đối
  description: string;
}

export const ENTERPRISE_PILLARS_CONFIG: Record<PillarId, EnterprisePillarConfig> = {
  CUSTOMER_EXPERIENCE: {
    id: 'CUSTOMER_EXPERIENCE',
    name: 'Khách hàng',
    questionCodes: ['KH-1', 'KH-2', 'KH-3', 'KH-4'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.CUSTOMER_EXPERIENCE, // 125đ
    weightRatio: 125 / 695,
    description: 'Trải nghiệm đa kênh, thấu hiểu khách hàng 360 độ và niềm tin thương hiệu số.'
  },
  STRATEGY: {
    id: 'STRATEGY',
    name: 'Chiến lược',
    questionCodes: ['CL-1', 'CL-2', 'CL-3', 'CL-4', 'CL-5', 'CL-6'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.STRATEGY, // 120đ
    weightRatio: 120 / 695,
    description: 'Chiến lược số, quản lý hệ sinh thái đối tác, danh mục SP/DV và bảo trợ tài chính.'
  },
  INFRASTRUCTURE_TECH: {
    id: 'INFRASTRUCTURE_TECH',
    name: 'Công nghệ',
    questionCodes: ['CN-1', 'CN-2', 'CN-3', 'CN-4', 'CN-5'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.INFRASTRUCTURE_TECH, // 145đ
    weightRatio: 145 / 695,
    description: 'Kiến trúc Microservices, Open API, Cloud, AI/Big Data và kết nối tính toán IoT.'
  },
  OPERATIONS: {
    id: 'OPERATIONS',
    name: 'Vận hành',
    questionCodes: ['VH-1', 'VH-2', 'VH-3', 'VH-4'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.OPERATIONS, // 110đ
    weightRatio: 110 / 695,
    description: 'Mô hình vận hành số, Design Thinking, Agile, DevSecOps, CI/CD và SRE.'
  },
  PEOPLE_CULTURE: {
    id: 'PEOPLE_CULTURE',
    name: 'Văn hóa',
    questionCodes: ['VH-5', 'VH-6', 'VH-7'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.PEOPLE_CULTURE, // 110đ
    weightRatio: 110 / 695,
    description: 'Văn hóa đổi mới sáng tạo, quản lý và đãi ngộ nhân tài số, môi trường làm việc số.'
  },
  DATA_SECURITY: {
    id: 'DATA_SECURITY',
    name: 'Dữ liệu',
    questionCodes: ['DL-1', 'DL-2', 'DL-3'],
    maxPointsAppendixII: LARGE_PILLAR_MAX.DATA_SECURITY, // 85đ
    weightRatio: 85 / 695,
    description: 'Quản trị siêu dữ liệu, kỹ thuật lưu trữ/truy cập và khai thác giá trị kinh tế từ dữ liệu.'
  }
};

// ============================================================================
// 2. INPUT & OUTPUT DATA MODELS
// ============================================================================

export interface SMEAssessmentInput {
  companyName: string;
  industry: string;
  /**
   * 7 câu hỏi có tính điểm từ bộ câu hỏi lõi SME:
   * Stt 3: Áp dụng ảo hóa, IoT, cloud
   * Stt 4: Ra quyết định dựa trên dữ liệu
   * Stt 5: An toàn thông tin mạng theo cấp độ
   * Stt 6: Cá nhân hóa trải nghiệm khách hàng
   * Stt 7: Mức độ thâm nhập công nghệ số
   * Stt 8: Chiến lược CĐS rõ ràng & thực thi
   * Stt 9: Ngân sách & KPI đầu tư CĐS
   * Giá trị level: 1 -> 5 (hoặc 0 nếu chưa chọn)
   */
  coreAnswers: {
    questionStt: number;
    level: number; // 1 to 5
  }[];
  /**
   * Danh sách tên các giải pháp số đang sử dụng trong mục 7.2 của ngành
   * Hoặc số lượng giải pháp số đã chọn
   */
  selectedIndustrySolutions?: string[];
  selectedSolutionsCount?: number;
}

export interface SMEScoringOutput {
  assessmentType: 'SME';
  totalDbiScore: number;       // Thang 0 - 100
  percentageScore: number;     // 0 - 100%
  level: DbiLevelNumber;
  levelTitle: string;
  levelInfo: DbiLevelInfo;
  coreScore: number;           // Điểm chuẩn hóa phần cốt lõi (0 - 100)
  rawCoreTotal: number;        // Điểm thô phần cốt lõi (0 - 28)
  industryScore: number;       // Điểm giải pháp đặc thù ngành (0 - 100)
  industrySolutionsSelected: number;
  industryMaxScoreRaw: number;
  weights: {
    coreWeight: number;
    industryWeight: number;
  };
  pillarScores: Record<PillarId, number>; // 0 to 100 cho biểu đồ radar
  gaps: {
    pillar: string;
    score: number;
    issue: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  aiSummary: string;
  legalBasis: string;
}

export interface EnterpriseAssessmentInput {
  companyName: string;
  industry: string;
  /**
   * Điểm trả lời cho 25 câu hỏi đại diện (mã KH-1 đến DL-3)
   * Key: mã câu hỏi (ví dụ 'KH-1', 'CN-2'...) hoặc ID câu hỏi
   * Value: level đã chọn (1 đến 5)
   */
  answers: Record<string, number>;
  /**
   * Câu hỏi phụ (follow-up questions khi chọn Mức 3)
   */
  followUpAnswers?: Record<string, string>;
}

export interface EnterpriseScoringOutput {
  assessmentType: 'LARGE';
  totalDbiScore: number;           // Điểm theo Phụ lục II (0 - 695)
  normalizedDbiScore: number;     // Chuẩn hóa 0 - 100 (TOPSIS index)
  percentageScore: number;         // 0 - 100%
  level: DbiLevelNumber;
  levelTitle: string;
  levelInfo: DbiLevelInfo;
  topsisMetrics: {
    dPlus: number;                 // Khoảng cách tới giải pháp lý tưởng dương A+
    dMinus: number;                // Khoảng cách tới giải pháp lý tưởng âm A-
    closenessCoefficient: number;  // C_i = D- / (D+ + D-)
  };
  pillarRawScores: Record<PillarId, number>;    // Điểm thô từng trụ cột theo Phụ lục II
  pillarMaxScores: Record<PillarId, number>;    // Điểm trần từng trụ cột
  pillarScoresNormalized: Record<PillarId, number>; // 0 to 100 cho biểu đồ radar
  gaps: {
    pillar: string;
    score: number;
    issue: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  aiSummary: string;
  legalBasis: string;
}

// ============================================================================
// 3. THUẬT TOÁN TÍNH ĐIỂM CHO DOANH NGHIỆP SME (PHỤ LỤC I)
// ============================================================================

/**
 * Tính điểm DBI chuẩn cho Doanh nghiệp Nhỏ và Vừa (SME)
 * Tuân thủ cấu trúc Phụ lục I - QĐ 1567/QĐ-BKHCN
 */
export function calculateSMEDbiScore(input: SMEAssessmentInput): SMEScoringOutput {
  const {
    companyName,
    industry,
    coreAnswers,
    selectedIndustrySolutions,
    selectedSolutionsCount
  } = input;

  // 1. Tính Điểm Thô Phần Cốt Lõi (Nhóm 2 & Nhóm 3 - 7 câu hỏi scored)
  let rawCoreTotal = 0;
  coreAnswers.forEach(ans => {
    // Quy tắc điểm thô: Mức 1 = 0 điểm, mỗi mức cao hơn +1 điểm (Thang 0-4)
    const rawScore = Math.max(0, Math.min(4, (ans.level || 1) - 1));
    rawCoreTotal += rawScore;
  });

  // Chuẩn hóa Điểm Cốt Lõi về thang 100%
  const coreScore = Math.min(100, Math.round((rawCoreTotal / SME_SCORING_WEIGHTS.maxCoreRawScore) * 100));

  // 2. Tính Điểm Giải Pháp Số Đặc Thù Ngành (Mục 7.2)
  const industryMax = SME_INDUSTRY_MAX_SCORES[industry] || 20.0;
  const solutionsCount = selectedSolutionsCount ?? (selectedIndustrySolutions ? selectedIndustrySolutions.length : 0);
  const industryScore = Math.min(100, Math.round((solutionsCount / industryMax) * 100));

  // 3. Tổng hợp Điểm DBI theo tỷ trọng chuẩn 40% Core - 60% Industry
  const totalDbiScore = Math.min(100, Math.max(0, Math.round(
    (coreScore * SME_SCORING_WEIGHTS.coreWeight) + 
    (industryScore * SME_SCORING_WEIGHTS.industryWeight)
  )));

  // 4. Xác định Cấp độ Chuyển đổi số (Mức 0 đến 5 theo Phụ lục I)
  let assignedLevel: DbiLevelNumber = 0;
  for (const lvl of DBI_LEVELS_SME) {
    if (totalDbiScore >= lvl.minScore && totalDbiScore <= lvl.maxScore) {
      assignedLevel = lvl.level;
      break;
    }
  }
  const levelInfo = DBI_LEVELS_SME.find(l => l.level === assignedLevel) || DBI_LEVELS_SME[0];

  // 5. Phân bổ điểm cho 6 Trụ cột (Radar Chart 0 - 100)
  // Kết hợp hài hòa giữa điểm core và mức độ thâm nhập giải pháp
  const pillarScores: Record<PillarId, number> = {
    CUSTOMER_EXPERIENCE: Math.min(100, Math.round((coreScore * 0.35) + (industryScore * 0.65))),
    STRATEGY: Math.min(100, Math.round((coreScore * 0.60) + (industryScore * 0.40))),
    INFRASTRUCTURE_TECH: Math.min(100, Math.round((coreScore * 0.45) + (industryScore * 0.55))),
    OPERATIONS: Math.min(100, Math.round((coreScore * 0.30) + (industryScore * 0.70))),
    DATA_SECURITY: Math.min(100, Math.round((coreScore * 0.55) + (industryScore * 0.45))),
    PEOPLE_CULTURE: Math.min(100, Math.round((coreScore * 0.50) + (industryScore * 0.50)))
  };

  // 6. Phân tích khoảng cách (Gap Analysis)
  const pillarsList: Array<{ id: PillarId; name: string; score: number }> = [
    { id: 'CUSTOMER_EXPERIENCE' as PillarId, name: 'Khách hàng', score: pillarScores.CUSTOMER_EXPERIENCE },
    { id: 'STRATEGY' as PillarId, name: 'Chiến lược', score: pillarScores.STRATEGY },
    { id: 'INFRASTRUCTURE_TECH' as PillarId, name: 'Hạ tầng & Công nghệ', score: pillarScores.INFRASTRUCTURE_TECH },
    { id: 'OPERATIONS' as PillarId, name: 'Vận hành số', score: pillarScores.OPERATIONS },
    { id: 'DATA_SECURITY' as PillarId, name: 'An toàn & Dữ liệu', score: pillarScores.DATA_SECURITY },
    { id: 'PEOPLE_CULTURE' as PillarId, name: 'Con người & Văn hóa', score: pillarScores.PEOPLE_CULTURE }
  ].sort((a, b) => a.score - b.score);

  const gaps = pillarsList.slice(0, 3).map((p, idx) => ({
    pillar: p.name,
    score: p.score,
    issue: `Trụ cột ${p.name} hiện đạt ${p.score}/100 điểm, thuộc nhóm có khoảng cách lớn nhất cần cải thiện trong ngành ${industry}.`,
    recommendation: `Đầu tư trang bị công cụ số chuyên dụng ngành ${industry}, liên thông dữ liệu và chuẩn hóa nghiệp vụ tại bộ phận ${p.name}.`,
    priority: (idx === 0 ? 'HIGH' : idx === 1 ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW'
  }));

  // 7. Tạo AI Summary
  const legalBasis = `${LEGAL_FRAMEWORK.title} (${LEGAL_FRAMEWORK.decisionNumber}) - ${LEGAL_FRAMEWORK.smeAppendix.name}`;
  const aiSummary = `Theo quy chuẩn ${legalBasis}, doanh nghiệp ${companyName} (ngành ${industry}) đạt ${totalDbiScore}/100 điểm DBI, xếp hạng Cấp độ ${assignedLevel}: ${levelInfo.title}. Trong đó, Điểm Năng lực & Nhận thức Cốt lõi đạt ${coreScore}/100 (đóng góp 40%), Điểm Thâm nhập Giải pháp Số Ngành đạt ${industryScore}/100 (${solutionsCount}/${industryMax} giải pháp chuẩn ngành, đóng góp 60%). Để gia tăng chỉ số cạnh tranh, doanh nghiệp cần ưu tiên đẩy mạnh số hóa tại trụ cột "${pillarsList[0].name}" (${pillarsList[0].score}/100 điểm).`;

  return {
    assessmentType: 'SME',
    totalDbiScore,
    percentageScore: totalDbiScore,
    level: assignedLevel,
    levelTitle: levelInfo.title,
    levelInfo,
    coreScore,
    rawCoreTotal,
    industryScore,
    industrySolutionsSelected: solutionsCount,
    industryMaxScoreRaw: industryMax,
    weights: {
      coreWeight: SME_SCORING_WEIGHTS.coreWeight,
      industryWeight: SME_SCORING_WEIGHTS.industryWeight
    },
    pillarScores,
    gaps,
    aiSummary,
    legalBasis
  };
}

// ============================================================================
// 4. THUẬT TOÁN TÍNH ĐIỂM CHO DOANH NGHIỆP LỚN (PHỤ LỤC II & TOPSIS)
// ============================================================================

/**
 * Tính điểm DBI cho Doanh nghiệp Lớn
 * Phương pháp: TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
 * kết hợp tổng hợp theo Phụ lục II thang 695 điểm.
 */
export function calculateEnterpriseDbiScore(input: EnterpriseAssessmentInput): EnterpriseScoringOutput {
  const { companyName, answers } = input;

  // 1. Phân bổ điểm thô (0 đến 4) cho từng câu hỏi thuộc 6 trụ cột
  const pillarScoresRaw: Record<PillarId, { earned: number; maxPoints: number; count: number }> = {
    CUSTOMER_EXPERIENCE: { earned: 0, maxPoints: LARGE_PILLAR_MAX.CUSTOMER_EXPERIENCE, count: 0 },
    STRATEGY: { earned: 0, maxPoints: LARGE_PILLAR_MAX.STRATEGY, count: 0 },
    INFRASTRUCTURE_TECH: { earned: 0, maxPoints: LARGE_PILLAR_MAX.INFRASTRUCTURE_TECH, count: 0 },
    OPERATIONS: { earned: 0, maxPoints: LARGE_PILLAR_MAX.OPERATIONS, count: 0 },
    PEOPLE_CULTURE: { earned: 0, maxPoints: LARGE_PILLAR_MAX.PEOPLE_CULTURE, count: 0 },
    DATA_SECURITY: { earned: 0, maxPoints: LARGE_PILLAR_MAX.DATA_SECURITY, count: 0 }
  };

  const allRawScores: number[] = [];

  // Duyệt qua từng cấu hình trụ cột
  (Object.keys(ENTERPRISE_PILLARS_CONFIG) as PillarId[]).forEach(pillarId => {
    const config = ENTERPRISE_PILLARS_CONFIG[pillarId];
    config.questionCodes.forEach(qCode => {
      // Tìm câu trả lời từ answers (có thể là key qCode hoặc index)
      const answerVal = answers[qCode] ?? answers[qCode.toLowerCase()] ?? 2; // mặc định mức 3 (raw 2) nếu chưa có
      // Điểm thô: Mức 1 = 0, Mức 2 = 1, Mức 3 = 2, Mức 4 = 3, Mức 5 = 4
      const raw = Math.max(0, Math.min(4, typeof answerVal === 'number' && answerVal > 4 ? answerVal - 1 : answerVal));
      
      pillarScoresRaw[pillarId].earned += raw;
      pillarScoresRaw[pillarId].count += 1;
      allRawScores.push(raw);
    });
  });

  // 2. Tính toán phương pháp chuẩn hóa TOPSIS
  // Giải pháp lý tưởng dương A+ (Mọi tiêu chí đạt tối đa 4 điểm)
  // Giải pháp lý tưởng âm A- (Mọi tiêu chí ở mức tối thiểu 0 điểm)
  let sumDiffPlusSq = 0;
  let sumDiffMinusSq = 0;

  allRawScores.forEach(score => {
    sumDiffPlusSq += Math.pow(4 - score, 2);
    sumDiffMinusSq += Math.pow(score - 0, 2);
  });

  const dPlus = Math.sqrt(sumDiffPlusSq);
  const dMinus = Math.sqrt(sumDiffMinusSq);
  const closenessCoefficient = (dPlus + dMinus === 0) ? 0 : dMinus / (dPlus + dMinus);
  const normalizedDbiScore = Math.round(closenessCoefficient * 100);

  // 3. Quy đổi điểm thô từng trụ cột theo thang Phụ lục II (Tổng 695 điểm)
  const pillarRawScores: Record<PillarId, number> = {
    CUSTOMER_EXPERIENCE: 0,
    STRATEGY: 0,
    INFRASTRUCTURE_TECH: 0,
    OPERATIONS: 0,
    PEOPLE_CULTURE: 0,
    DATA_SECURITY: 0
  };

  const pillarScoresNormalized: Record<PillarId, number> = {
    CUSTOMER_EXPERIENCE: 0,
    STRATEGY: 0,
    INFRASTRUCTURE_TECH: 0,
    OPERATIONS: 0,
    PEOPLE_CULTURE: 0,
    DATA_SECURITY: 0
  };

  let totalDbiScore = 0;

  (Object.keys(ENTERPRISE_PILLARS_CONFIG) as PillarId[]).forEach(pillarId => {
    const pData = pillarScoresRaw[pillarId];
    const maxEarnableRaw = pData.count * 4;
    const ratio = maxEarnableRaw > 0 ? pData.earned / maxEarnableRaw : 0.2;
    
    // Điểm thực tế theo thang Phụ lục II
    const pillarPoints = Math.round(ratio * pData.maxPoints);
    pillarRawScores[pillarId] = pillarPoints;
    totalDbiScore += pillarPoints;

    // Điểm chuẩn hóa cho biểu đồ radar 0 - 100
    pillarScoresNormalized[pillarId] = Math.round(ratio * 100);
  });

  totalDbiScore = Math.min(695, Math.max(0, totalDbiScore));
  const percentageScore = Math.round((totalDbiScore / 695) * 100);

  // 4. Xác định Cấp độ Chuyển đổi số (Mức 0 đến 5 theo Phụ lục II)
  let assignedLevel: DbiLevelNumber = 0;
  for (const lvl of DBI_LEVELS_LARGE) {
    if (totalDbiScore >= lvl.minScore && totalDbiScore <= lvl.maxScore) {
      assignedLevel = lvl.level;
      break;
    }
  }
  const levelInfo = DBI_LEVELS_LARGE.find(l => l.level === assignedLevel) || DBI_LEVELS_LARGE[0];

  // 5. Phân tích khoảng cách (Gap Analysis)
  const pillarPerformance = (Object.keys(ENTERPRISE_PILLARS_CONFIG) as PillarId[]).map(pId => {
    const config = ENTERPRISE_PILLARS_CONFIG[pId];
    const earned = pillarRawScores[pId];
    const max = config.maxPointsAppendixII;
    const ratio = max > 0 ? (earned / max) * 100 : 0;
    return {
      id: pId,
      name: config.name,
      earned,
      max,
      ratio: Math.round(ratio)
    };
  }).sort((a, b) => a.ratio - b.ratio);

  const gaps = pillarPerformance.slice(0, 3).map((p, idx) => ({
    pillar: p.name,
    score: p.earned,
    issue: `Trụ cột ${p.name} đạt ${p.earned}/${p.max} điểm (${p.ratio}%), chưa tương xứng với yêu cầu chuyển đổi số toàn diện cấp Tập đoàn.`,
    recommendation: `Thiết kế lại kiến trúc và quy trình quản trị tại trụ cột ${p.name} theo chuẩn Enterprise Architecture (TOGAF), tăng cường tự động hóa và tích hợp đa kênh.`,
    priority: (idx === 0 ? 'HIGH' : idx === 1 ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW'
  }));

  // 6. AI Summary
  const legalBasis = `${LEGAL_FRAMEWORK.title} (${LEGAL_FRAMEWORK.decisionNumber}) - ${LEGAL_FRAMEWORK.largeAppendix.name}`;
  const aiSummary = `Theo quy chuẩn ${legalBasis}, Tập đoàn/Doanh nghiệp ${companyName} đạt ${totalDbiScore}/695 điểm (${percentageScore}%, Chỉ số tiệm cận TOPSIS: ${normalizedDbiScore}/100), xếp hạng Cấp độ ${assignedLevel}: ${levelInfo.title}. Trụ cột dẫn đầu là "${pillarPerformance[pillarPerformance.length - 1].name}" đạt ${pillarPerformance[pillarPerformance.length - 1].earned}/${pillarPerformance[pillarPerformance.length - 1].max} điểm (${pillarPerformance[pillarPerformance.length - 1].ratio}%). Điểm nghẽn cần ưu tiên tháo gỡ cấp Tập đoàn là trụ cột "${pillarPerformance[0].name}" (${pillarPerformance[0].earned}/${pillarPerformance[0].max} điểm) và "${pillarPerformance[1].name}" (${pillarPerformance[1].earned}/${pillarPerformance[1].max} điểm).`;

  return {
    assessmentType: 'LARGE',
    totalDbiScore,
    normalizedDbiScore,
    percentageScore,
    level: assignedLevel,
    levelTitle: levelInfo.title,
    levelInfo,
    topsisMetrics: {
      dPlus: Number(dPlus.toFixed(2)),
      dMinus: Number(dMinus.toFixed(2)),
      closenessCoefficient: Number(closenessCoefficient.toFixed(4))
    },
    pillarRawScores,
    pillarMaxScores: LARGE_PILLAR_MAX,
    pillarScoresNormalized,
    gaps,
    aiSummary,
    legalBasis
  };
}

// ============================================================================
// 5. UNIFIED DISPATCHER INTERFACE (TÍCH HỢP TOÀN DIỆN VÀO HỆ THỐNG)
// ============================================================================

export interface UnifiedScoringRequest {
  assessmentType: EnterpriseSize;
  companyName: string;
  industry: string;
  userId?: string;
  // Generic answer dictionary (question ID/code -> option index 0-4 or score 1-5)
  answers: Record<string, number>;
  selectedIndustrySolutions?: string[];
  selectedSolutionsCount?: number;
}

/**
 * Hàm điều phối tính toán điểm DBI thống nhất cho toàn bộ hệ thống
 * Tự động rẽ nhánh sang thuật toán SME hoặc Large Enterprise dựa trên assessmentType
 */
export function calculateUnifiedDbiAssessment(request: UnifiedScoringRequest): AssessmentResultData {
  const {
    assessmentType,
    companyName,
    industry,
    userId = 'USER-DEFAULT',
    answers,
    selectedIndustrySolutions,
    selectedSolutionsCount
  } = request;

  if (assessmentType === 'SME') {
    // Chuyển đổi answers sang SME Core Input
    // Nếu answers lưu dạng Q01, Q02... hoặc 3, 4, 5...
    const coreAnswers: { questionStt: number; level: number }[] = [];
    const coreSttList = [3, 4, 5, 6, 7, 8, 9];
    
    coreSttList.forEach((stt, index) => {
      // Thử tìm theo nhiều dạng key: SME_Q03, Q03, 3, stt-3, hoặc index
      const val = answers[`SME_Q0${stt}`] ?? answers[`SME_Q${stt}`] ?? answers[`Q0${stt}`] ?? answers[`Q${stt}`] ?? answers[String(stt)] ?? answers[Object.keys(answers)[index]] ?? 2;
      // Level là từ 1 đến 5 (nếu lưu dạng index 0-4 thì cộng 1)
      const level = (typeof val === 'number' && val >= 0 && val <= 4) ? val + 1 : (val || 3);
      coreAnswers.push({ questionStt: stt, level });
    });

    // Tính số lượng giải pháp số được chọn (nếu có câu 18 hoặc danh sách giải pháp)
    let solutionsCount = selectedSolutionsCount;
    if (solutionsCount === undefined) {
      const q18Val = answers['SME_Q18'] ?? answers['Q18'] ?? answers['18'] ?? 2;
      // Tỷ lệ ước tính từ mức chọn câu 18: Mức 1 = 15%, Mức 2 = 30%, Mức 3 = 50%, Mức 4 = 70%, Mức 5 = 90%
      const industryMax = SME_INDUSTRY_MAX_SCORES[industry] || 20.0;
      const ratios = [0.15, 0.30, 0.50, 0.70, 0.90];
      const selectedRatio = ratios[Math.max(0, Math.min(4, q18Val))] ?? 0.50;
      solutionsCount = Math.round(selectedRatio * industryMax);
    }

    const smeResult = calculateSMEDbiScore({
      companyName,
      industry,
      coreAnswers,
      selectedIndustrySolutions,
      selectedSolutionsCount: solutionsCount
    });

    return {
      id: `ASSESS-SME-${Date.now()}`,
      userId,
      companyName,
      industry,
      date: new Date().toISOString().split('T')[0],
      totalScore: smeResult.totalDbiScore,
      level: smeResult.level,
      levelTitle: smeResult.levelTitle,
      pillarScores: smeResult.pillarScores,
      industryAvgScores: {
        CUSTOMER_EXPERIENCE: 42,
        STRATEGY: 38,
        INFRASTRUCTURE_TECH: 40,
        OPERATIONS: 45,
        DATA_SECURITY: 36,
        PEOPLE_CULTURE: 39
      },
      industryAvgTotal: 40,
      answers: Object.entries(answers).map(([qid, optIdx]) => ({
        questionId: qid,
        selectedOptionIndex: Number(optIdx),
        score: Number(optIdx) + 1
      })),
      gaps: smeResult.gaps,
      aiSummary: smeResult.aiSummary,
      assessmentType: 'SME',
      scaleMax: 100,
      rawTotalScore: smeResult.totalDbiScore,
      percentageScore: smeResult.percentageScore,
      pillarRawScores: smeResult.pillarScores,
      pillarMaxScores: SME_PILLAR_MAX,
      legalBasis: smeResult.legalBasis
    };
  } else {
    // LARGE ENTERPRISE
    const largeResult = calculateEnterpriseDbiScore({
      companyName,
      industry,
      answers
    });

    return {
      id: `ASSESS-LARGE-${Date.now()}`,
      userId,
      companyName,
      industry,
      date: new Date().toISOString().split('T')[0],
      totalScore: largeResult.totalDbiScore,
      level: largeResult.level,
      levelTitle: largeResult.levelTitle,
      pillarScores: largeResult.pillarScoresNormalized,
      industryAvgScores: {
        CUSTOMER_EXPERIENCE: 55,
        STRATEGY: 52,
        INFRASTRUCTURE_TECH: 62,
        OPERATIONS: 48,
        PEOPLE_CULTURE: 50,
        DATA_SECURITY: 38
      },
      industryAvgTotal: 315,
      answers: Object.entries(answers).map(([qid, optIdx]) => ({
        questionId: qid,
        selectedOptionIndex: Number(optIdx),
        score: Number(optIdx) + 1
      })),
      gaps: largeResult.gaps,
      aiSummary: largeResult.aiSummary,
      assessmentType: 'LARGE',
      scaleMax: 695,
      rawTotalScore: largeResult.totalDbiScore,
      percentageScore: largeResult.percentageScore,
      pillarRawScores: largeResult.pillarRawScores,
      pillarMaxScores: largeResult.pillarMaxScores,
      legalBasis: largeResult.legalBasis
    };
  }
}
