export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN' | 'GUEST';

export type EnterpriseSize = 'SME' | 'LARGE';

export type DbiLevelNumber = 0 | 1 | 2 | 3 | 4 | 5;

export interface DbiLevelInfo {
  level: DbiLevelNumber;
  title: string;
  minScore: number;
  maxScore: number;
  badgeColor: string;
  bgColor: string;
  textColor: string;
  description: string;
  advice: string;
}

export type PillarId = 
  | 'CUSTOMER_EXPERIENCE' 
  | 'STRATEGY' 
  | 'INFRASTRUCTURE_TECH' 
  | 'OPERATIONS' 
  | 'DATA_SECURITY' 
  | 'PEOPLE_CULTURE';

export interface PillarInfo {
  id: PillarId;
  name: string;
  shortName: string;
  iconName: string;
  weight: number; // default weight (e.g. 0.166)
  description: string;
}

export interface QuestionOption {
  text: string;
  score: number; // 1 to 5 points
  description?: string;
}

export interface AssessmentQuestion {
  id: string;
  pillarId: PillarId;
  questionNumber: number;
  title: string;
  context?: string;
  options: QuestionOption[];
  weight: number;
  targetSize: EnterpriseSize | 'ALL';
  isConditional?: boolean;
  conditionalTrigger?: {
    dependsOnQuestionId: string;
    minScoreRequired: number;
  };
}

export interface CompanyProfile {
  companyName: string;
  mst: string; // Tax ID
  industry: string;
  employeeCount: number;
  size: EnterpriseSize;
  province: string;
  address?: string;
  website?: string;
  representative?: string;
  phone?: string;
  email?: string;
  licenseFile?: string; // GPKD
  intellectualPropertyFile?: string; // Giấy Đăng ký quyền sở hữu trí tuệ (Cục Bản quyền tác giả / Cục SHTT)
  verifiedTax?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  company: CompanyProfile;
  createdAt: string;
  isLocked?: boolean;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  score: number;
}

export interface AssessmentResultData {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  date: string;
  totalScore: number;
  level: DbiLevelNumber;
  levelTitle: string;
  pillarScores: Record<PillarId, number>; // 0 to 100 for charts
  industryAvgScores: Record<PillarId, number>; // 0 to 100
  industryAvgTotal: number;
  answers: AssessmentAnswer[];
  gaps: {
    pillar: string;
    score: number;
    issue: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  aiSummary: string;
  assessmentType?: 'SME' | 'LARGE';
  scaleMax?: number; // 100 for SME, 695 for Large
  rawTotalScore?: number; // Raw points (e.g. 480/695)
  percentageScore?: number; // 0 to 100%
  pillarRawScores?: Record<PillarId, number>; // Raw score per pillar
  pillarMaxScores?: Record<PillarId, number>; // Max score per pillar (e.g. 125, 120, 145, 110, 110, 85)
  legalBasis?: string; // Quyết định 1567/QĐ-BKHCN
}

export interface InvestmentPreferences {
  budgetTier: 'LOW' | 'MEDIUM' | 'HIGH'; // Low < 100M, Medium 100M-500M, High > 500M (SME) or 500M-2B, 2B-5B, >5B (Large)
  budgetText: string;
  hrReadiness: number; // 1 to 5
  infraReadiness: number; // 1 to 5
  leadershipCommitment: number; // 1 to 5
  priorityPillars: PillarId[];
  timeline: string;
  isLargeEnterprise?: boolean;
  industrySector?: string; // Nhóm ngành chuyên biệt lựa chọn cho Doanh nghiệp Lớn
  largeBudgetTier?: 'TIER_1' | 'TIER_2' | 'TIER_3';
}

export interface TechTaxonomyItem {
  id_tech: string;
  name?: string;
  standardName?: string;
  pillarId: PillarId;
  category?: string;
  standardCode?: string;
  description: string;
  defaultPriceRange?: string;
}

export type TaxonomyItem = TechTaxonomyItem;

export interface TechListing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorMst: string;
  id_tech: string; // Must match closed taxonomy
  techName: string;
  pillarId: PillarId;
  summary: string;
  description?: string;
  priceMin: number;
  priceMax: number;
  priceUnit: string; // e.g. "VND/năm", "VND/tháng", "Trọn gói"
  targetSizes: EnterpriseSize[];
  targetDbiLevels: DbiLevelNumber[] | number[];
  industry?: string;
  targetIndustries?: string[];
  vsicCode?: string; // Mã ngành kinh tế Việt Nam (VSIC) cấp 4 / cấp 5
  vsicName?: string; // Tên ngành VSIC chuẩn theo QĐ 27/2018/QĐ-TTg
  thumbnailUrl: string;
  brochurePdfName?: string;
  ipCertificateFile?: string; // Giấy chứng nhận Đăng ký Quyền sở hữu trí tuệ phần mềm/giải pháp
  features: string[];
  deploymentTime?: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  views?: number;
  interestCount?: number;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  matchPercentage?: number;
}

export interface LeadGapItem {
  pillarId: PillarId;
  pillarName: string;
  score: number; // 0 - 100
  weaknessSummary: string; // Tóm tắt điểm yếu
  assessmentAnswerSnippet?: string; // Câu trả lời thực tế trong khảo sát (assessment_answers)
}

export interface LeadReadinessProfile {
  personnelScore: number; // 1 - 5 (Nhân sự & năng lực số)
  infrastructureScore: number; // 1 - 5 (Hạ tầng thiết bị & mạng)
  leadershipCommitmentScore: number; // 1 - 5 (Cam kết ban lãnh đạo & ngân sách)
  notes?: string;
}

export interface LeadInquiry {
  id: string;
  buyerId: string;
  // Nhận dạng (company_profiles)
  buyerName: string;
  buyerCompany?: string;
  buyerMst?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  buyerIndustry?: string;
  buyerProvince?: string; // Tỉnh / Thành phố
  buyerEmployeeCount?: number;
  buyerSize?: EnterpriseSize; // 'SME' | 'LARGE'

  // Hiện trạng số (assessments, pillar_scores)
  buyerDbiScore: number; // Điểm tổng 0 - 100
  buyerDbiLevel: DbiLevelNumber | number; // Mức 1 - 5
  pillarScores?: Record<PillarId, number>; // Điểm 6 trụ cột

  // Khoảng trống (3 trụ cột yếu nhất kèm câu trả lời)
  topGaps?: LeadGapItem[];

  // Nhu cầu (investment_profiles, rfq)
  interestedTechCategories?: string[]; // Công nghệ quan tâm (ERP, CRM, WMS, MES, HRM, etc.)
  buyerBudget?: string;
  budgetRange?: string;
  timeline?: string; // Thời điểm triển khai
  notes?: string;

  // Mức sẵn sàng (investment_profiles: 1-5)
  readiness?: LeadReadinessProfile;

  // Độ tươi (assessments)
  assessmentDate?: string; // Ngày làm bài đánh giá (YYYY-MM-DD)
  daysSinceAssessment?: number; // Số ngày đã trôi qua

  techListingId?: string;
  listingId?: string;
  techName: string;
  vendorId: string;
  vendorName: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED' | 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  createdAt: string;
  lastMessageAt?: string;
  messages?: {
    id: string;
    sender?: 'BUYER' | 'VENDOR' | 'SYSTEM';
    senderName: string;
    senderRole?: UserRole;
    text: string;
    timestamp: string;
  }[];
  // Thu phí Nền tảng: Phí mở Lead / RFQ (Pay-per-Lead)
  isUnlocked?: boolean;
  unlockFee?: number; // VND, ví dụ: 99.000đ hoặc 199.000đ
  unlockedAt?: string;
  rfqDetails?: {
    scopeSummary: string;
    targetPillars: PillarId[];
    expectedDeliveryMonths?: number;
    decisionMakerRole?: string;
    urgency: 'HIGH' | 'MEDIUM' | 'EXPLORATORY';
  };
}

export interface WalletTransaction {
  id: string;
  leadId?: string;
  leadTitle?: string;
  amount: number; // âm nếu trừ phí mở lead, dương nếu nạp tiền
  type: 'LEAD_UNLOCK' | 'TOPUP' | 'REFUND';
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface PlatformPricingConfig {
  smeLeadUnlockFee: number; // e.g. 99,000 VND
  largeLeadUnlockFee: number; // e.g. 199,000 VND
  allowOffPlatformTrading: boolean; // true: chấp nhận giao dịch ngoài
  listingFee: number; // 0đ (miễn phí đăng tin)
  commissionRate: number; // 0% (không thu % hoa hồng thành công)
}

export interface MatchingWeights {
  dbiGapWeight: number; // e.g. 0.40
  budgetWeight: number; // e.g. 0.30
  industryWeight: number; // e.g. 0.15
  sizeWeight: number; // e.g. 0.15
  industryFitWeight?: number;
  budgetFitWeight?: number;
  companySizeFitWeight?: number;
  vendorReputationWeight?: number;
  readinessWeight?: number;
}
