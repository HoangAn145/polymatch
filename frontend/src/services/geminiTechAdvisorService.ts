import { GEMINI_TECH_KNOWLEDGE_BASE, TechCatalogItem, QUY_TAC_SUA_GIA } from '../data/geminiTechKnowledgeBase';
import { PillarId } from '../types';

export interface HarvestedAssessmentInput {
  assessmentId?: string;
  companyName: string;
  mst?: string;
  industry: string;
  employeeCount: number;
  companySize?: 'Siêu nhỏ' | 'Nhỏ' | 'Vừa' | 'Lớn';
  enterpriseType?: 'SME' | 'LARGE';
  totalScore: number;
  scaleMax?: number;
  percentageScore?: number;
  currentDbiLevel: number;
  levelTitle?: string;
  pillarScores?: Record<PillarId, number>;
  weakestPillars?: { pillarId: PillarId; pillarName: string; score: number }[];
  diagnosedGaps?: {
    pillar: string;
    issue: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  appliedIndustrySolutions?: string[];
  missingIndustrySolutions?: string[];
  budgetRange?: string;
  timeline?: string;
  industrySector?: string;
  isLargeEnterprise?: boolean;
  notes?: string;
}

export type AdvisorRequest = HarvestedAssessmentInput;

export interface RecommendedTechSolution {
  techName: string;
  vendorName: string;
  industry: string;
  suitableSize: string[];
  dbiLevel: string;
  suggestedPrice: string;
  costModel: string;
  pillarId: PillarId;
  priority: 'CAO' | 'TRUNG BÌNH' | 'DÀI HẠN';
  whyMatched: string;
  pricingRuleNote: string;
  // Deep DBI Assessment Linkage
  diagnosticEvidence: string;
  targetObjective: 'KHAC_PHUC_DIEM_NGHEN' | 'NANG_CAP_DBI' | 'CHUAN_HOA_NGANH';
  targetObjectiveTitle: string;
  expectedDbiImpact: string;
}

export interface GeminiAdvisorResponse {
  summary: string;
  strategicRoadmap: string[];
  recommendedSolutions: RecommendedTechSolution[];
  pricingGovernanceNotice: string;
  isAiGenerated: boolean;
  harvestedProfile?: {
    companyName: string;
    industry: string;
    employeeCount: number;
    companySize: string;
    totalScore: number;
    scaleMax: number;
    currentDbiLevel: number;
    levelTitle: string;
    weakestPillarSummary: string;
  };
}

export function matchTechSolutionsLocally(request: AdvisorRequest): GeminiAdvisorResponse {
  const industry = request.industry || 'Bán lẻ';
  const companySize = request.companySize || (
    request.employeeCount < 10 ? 'Siêu nhỏ' :
    request.employeeCount <= 50 ? 'Nhỏ' :
    request.employeeCount <= 200 ? 'Vừa' : 'Lớn'
  );
  const currentDbiLevel = request.currentDbiLevel || 2;
  const weakestPillars = request.weakestPillars || [];

  // Determine which pillars are weak based on assessment scores
  const weakPillarIds = new Set<PillarId>(weakestPillars.map(w => w.pillarId));
  if (weakPillarIds.size === 0 && request.pillarScores) {
    // Find lowest 2 pillar scores
    const sorted = (Object.entries(request.pillarScores) as [PillarId, number][])
      .sort((a, b) => a[1] - b[1]);
    sorted.slice(0, 2).forEach(([pid]) => weakPillarIds.add(pid));
  }
  if (weakPillarIds.size === 0) {
    weakPillarIds.add('OPERATIONS');
    weakPillarIds.add('DATA_SECURITY');
  }

  // Filter solutions for this industry or general
  let matched = GEMINI_TECH_KNOWLEDGE_BASE.filter(item => {
    const matchIndustry = item.loai_nganh.toLowerCase().includes(industry.toLowerCase()) ||
                          industry.toLowerCase().includes(item.loai_nganh.toLowerCase());
    if (!matchIndustry) return false;

    const matchSize = item.loai_doanh_nghiep.some(s => 
      s.toLowerCase().includes(companySize.toLowerCase()) || 
      companySize.toLowerCase().includes(s.toLowerCase())
    );
    return matchSize;
  });

  // If no direct industry match, take the closest match
  if (matched.length === 0) {
    matched = GEMINI_TECH_KNOWLEDGE_BASE.filter(item => 
      item.loai_doanh_nghiep.some(s => s.toLowerCase().includes(companySize.toLowerCase()))
    ).slice(0, 10);
  }

  // Map to RecommendedTechSolution with deep diagnostic linkage
  const solutions: RecommendedTechSolution[] = matched.map((item) => {
    const itemLevelNum = item.muc_do_chuyen_doi_so.includes('Mức 1') ? 1 :
                         item.muc_do_chuyen_doi_so.includes('Mức 2') ? 2 :
                         item.muc_do_chuyen_doi_so.includes('Mức 3') ? 3 :
                         item.muc_do_chuyen_doi_so.includes('Mức 4') ? 4 : 5;

    const pillar: PillarId = item.tru_cot_de_xuat || 'OPERATIONS';
    const isWeakPillar = weakPillarIds.has(pillar);

    let targetObjective: 'KHAC_PHUC_DIEM_NGHEN' | 'NANG_CAP_DBI' | 'CHUAN_HOA_NGANH' = 'CHUAN_HOA_NGANH';
    let targetObjectiveTitle = `Chuẩn hóa Công nghệ Ngành ${industry}`;
    let priority: 'CAO' | 'TRUNG BÌNH' | 'DÀI HẠN' = 'TRUNG BÌNH';
    let diagnosticEvidence = `Thu thập từ bài đánh giá DBI ngành ${industry}: Cần trang bị các giải pháp số vận hành nghiệp vụ nền tảng.`;
    let expectedDbiImpact = `Kiện toàn quy trình nghiệp vụ số theo`;

    if (isWeakPillar) {
      targetObjective = 'KHAC_PHUC_DIEM_NGHEN';
      targetObjectiveTitle = 'Khắc phục Điểm nghẽn Trọng yếu';
      priority = 'CAO';
      const weakObj = weakestPillars.find(w => w.pillarId === pillar);
      const scoreNote = weakObj ? `đạt ${weakObj.score}%` : (request.pillarScores ? `đạt ${request.pillarScores[pillar]}%` : 'mức thấp');
      diagnosticEvidence = `Bài đánh giá DBI chỉ ra trụ cột ${pillar} ${scoreNote}, là điểm nghẽn lớn kìm hãm mức độ số hóa của doanh nghiệp.`;
      expectedDbiImpact = `Tháo gỡ điểm nghẽn cốt lõi, nâng điểm trụ cột ${pillar} và giảm thiểu sai sót thủ công.`;
    } else if (itemLevelNum === currentDbiLevel + 1) {
      targetObjective = 'NANG_CAP_DBI';
      targetObjectiveTitle = `Bứt phá lên Cấp độ ${currentDbiLevel + 1}`;
      priority = currentDbiLevel <= 2 ? 'CAO' : 'TRUNG BÌNH';
      diagnosticEvidence = `Doanh nghiệp hiện xếp Cấp ${currentDbiLevel} (${request.totalScore}đ). Đây là giải pháp tiêu chuẩn để bứt phá lên Cấp ${currentDbiLevel + 1}.`;
      expectedDbiImpact = `Mở rộng khả năng tích hợp dữ liệu đa kênh và tự động hóa điều hành.`;
    } else if (itemLevelNum > currentDbiLevel + 1) {
      priority = 'DÀI HẠN';
    }

    // Check pricing rule
    let pricingNote = "Đơn giá tham chiếu đã được thẩm định theo chuẩn ngành.";
    if (item.ten_cong_nghe.toLowerCase().includes("thanh toán")) {
      pricingNote = "Quy tắc: Không chốt % cố định, tính theo biểu phí cổng thanh toán hợp đồng (0.8% - 1.8%).";
    } else if (item.ten_cong_nghe.toLowerCase().includes("ai") || item.ten_cong_nghe.toLowerCase().includes("cloud")) {
      pricingNote = "Quy tắc: Chi phí usage-based (theo lượng dùng thực tế) + chi phí triển khai POC ban đầu.";
    } else if (item.mo_hinh_chi_phi.includes("SaaS")) {
      pricingNote = "Quy tắc SaaS: Chuẩn hóa theo số lượng người dùng (user/tháng) hoặc gói thuê bao.";
    } else if (item.mo_hinh_chi_phi.includes("CAPEX")) {
      pricingNote = "Quy tắc CAPEX: Giá thiết bị/phần cứng tham chiếu, cần khảo sát thực tế và báo giá chi tiết.";
    }

    return {
      techName: item.ten_cong_nghe,
      vendorName: item.nha_cung_cap,
      industry: item.loai_nganh,
      suitableSize: item.loai_doanh_nghiep,
      dbiLevel: item.muc_do_chuyen_doi_so,
      suggestedPrice: item.gia_de_xuat,
      costModel: item.mo_hinh_chi_phi,
      pillarId: pillar,
      priority,
      whyMatched: `Khớp nối với quy mô ${companySize}, giải quyết nhu cầu số hóa cấp độ ${item.muc_do_chuyen_doi_so} ngành ${item.loai_nganh}.`,
      pricingRuleNote: pricingNote,
      diagnosticEvidence,
      targetObjective,
      targetObjectiveTitle,
      expectedDbiImpact
    };
  });

  // Sort: KHAC_PHUC_DIEM_NGHEN first, then NANG_CAP_DBI, then CHUAN_HOA_NGANH
  solutions.sort((a, b) => {
    const objWeight = { 'KHAC_PHUC_DIEM_NGHEN': 1, 'NANG_CAP_DBI': 2, 'CHUAN_HOA_NGANH': 3 };
    if (objWeight[a.targetObjective] !== objWeight[b.targetObjective]) {
      return objWeight[a.targetObjective] - objWeight[b.targetObjective];
    }
    const pWeight = { 'CAO': 1, 'TRUNG BÌNH': 2, 'DÀI HẠN': 3 };
    return pWeight[a.priority] - pWeight[b.priority];
  });

  const nextLevel = Math.min(5, currentDbiLevel + 1);
  const weakestPillarNameList = weakestPillars.map(w => w.pillarName || w.pillarId).join(', ') || 'Vận hành, An toàn bảo mật';

  return {
    summary: `AI đã tự động thu thập và xử lý toàn bộ dữ liệu từ bài đánh giá DBI của ${request.companyName || 'Doanh nghiệp'} (Ngành ${industry}, ${request.employeeCount} nhân sự, đạt ${request.totalScore}/${request.scaleMax || 100} điểm - Cấp độ ${currentDbiLevel}). Điểm nghẽn cốt lõi cần tháo gỡ cấp thiết tập trung ở trụ cột: ${weakestPillarNameList}. Hệ thống đã tự động kê đơn ${solutions.length} giải pháp số hóa phù hợp nhất để tháo gỡ điểm nghẽn và đưa doanh nghiệp thăng hạng lên Cấp độ ${nextLevel}.`,
    strategicRoadmap: [
      `Giai đoạn 1 (0-3 tháng): Tập trung xử lý ngay các lỗ hổng ở trụ cột điểm yếu (${weakestPillarNameList}) bằng các phần mềm SaaS nghiệp vụ gọn nhẹ để chuẩn hóa dữ liệu đầu vào.`,
      `Giai đoạn 2 (3-6 tháng): Liên thông dòng chảy thông tin giữa các bộ phận, loại bỏ hoàn toàn các bảng tính Excel rời rạc và đồng bộ hóa báo cáo điều hành.`,
      `Giai đoạn 3 (6-12 tháng): Triển khai công nghệ Cấp độ ${nextLevel} (AI phân tích, Dashboard thời gian thực) để sẵn sàng tái đánh giá nâng hạng DBI.`
    ],
    recommendedSolutions: solutions,
    pricingGovernanceNotice: "Toàn bộ mức giá đề xuất đã tuân thủ Bộ quy tắc chuẩn hóa: Tách riêng ngân sách quảng cáo, phí thanh toán tính theo hợp đồng thực tế, dịch vụ AI/Cloud tính theo lưu lượng sử dụng.",
    isAiGenerated: true,
    harvestedProfile: {
      companyName: request.companyName || 'Doanh nghiệp',
      industry,
      employeeCount: request.employeeCount,
      companySize,
      totalScore: request.totalScore,
      scaleMax: request.scaleMax || 100,
      currentDbiLevel,
      levelTitle: request.levelTitle || `Cấp độ ${currentDbiLevel}`,
      weakestPillarSummary: weakestPillarNameList
    }
  };
}

export async function getGeminiTechRecommendations(request: AdvisorRequest): Promise<GeminiAdvisorResponse> {
  try {
    const res = await fetch('/api/gemini/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.recommendedSolutions && data.recommendedSolutions.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Fallback to local precision matching
  }
  return matchTechSolutionsLocally(request);
}
