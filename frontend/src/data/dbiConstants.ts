import { PillarId, DbiLevelInfo } from '../types';

// Căn cứ pháp lý chính thức ban hành Bộ tiêu chí đánh giá mức độ CĐS
export const LEGAL_FRAMEWORK = {
  decisionNumber: '',
  issueDate: '30/06/2025',
  promulgator: 'Bộ trưởng Bộ Khoa học và Công nghệ',
  title: 'Bộ tiêu chí đánh giá mức độ chuyển đổi số doanh nghiệp',
  replacedDecision: 'Quyết định số 2158/QĐ-BTTTT ngày 07/11/2023 của Bộ Thông tin và Truyền thông',
  smeAppendix: {
    name: 'Phụ lục I - Bộ tiêu chí đánh giá mức độ chuyển đổi số SME',
    scaleMax: 100,
    unit: 'Điểm',
    description: 'Đánh giá việc vận dụng các nền tảng và công cụ số trong các hoạt động vận hành, quản trị và phân tích kinh doanh của doanh nghiệp nhỏ và vừa.'
  },
  largeAppendix: {
    name: 'Phụ lục II - Bộ chỉ số chuyển đổi số Doanh nghiệp lớn (DNL)',
    scaleMax: 695,
    unit: 'Điểm',
    description: 'Bộ tiêu chí chuyên sâu 6 trụ cột với tổng điểm 695, đánh giá toàn diện ở quy mô tập đoàn/doanh nghiệp lớn, khả năng dẫn dắt hệ sinh thái số.'
  }
};

// Phân bổ điểm tối đa 6 trụ cột cho Doanh nghiệp Lớn (Phụ lục II: Tổng 695 điểm)
export const LARGE_PILLAR_MAX: Record<PillarId, number> = {
  CUSTOMER_EXPERIENCE: 125, // Trụ cột Khách hàng: 125 điểm
  STRATEGY: 120,            // Trụ cột Chiến lược: 120 điểm
  INFRASTRUCTURE_TECH: 145, // Trụ cột Hạ tầng & Công nghệ: 145 điểm
  OPERATIONS: 110,          // Trụ cột Vận hành: 110 điểm
  PEOPLE_CULTURE: 110,      // Trụ cột Văn hóa & Con người: 110 điểm
  DATA_SECURITY: 85         // Trụ cột Dữ liệu & An toàn thông tin: 85 điểm
};

// Phân bổ điểm tối đa 6 trụ cột cho Doanh nghiệp SME (Phụ lục I: Tổng 100 điểm)
export const SME_PILLAR_MAX: Record<PillarId, number> = {
  CUSTOMER_EXPERIENCE: 18,
  STRATEGY: 16,
  INFRASTRUCTURE_TECH: 16,
  OPERATIONS: 18,
  DATA_SECURITY: 18,
  PEOPLE_CULTURE: 14
};

// 6 Cấp độ chuyển đổi số chuẩn cho Doanh nghiệp Nhỏ và Vừa (Phụ lục I - Thang điểm 100)
export const DBI_LEVELS_SME: DbiLevelInfo[] = [
  {
    level: 0,
    title: 'Chưa chuyển đổi số',
    minScore: 0,
    maxScore: 9,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    bgColor: 'from-slate-50 to-gray-100',
    textColor: 'text-slate-700',
    description: 'Doanh nghiệp gần như chưa có hoạt động hoặc có nhưng không đáng kể các hoạt động chuyển đổi số. Đa phần các nghiệp vụ còn thực hiện thủ công.',
    advice: 'Ưu tiên nâng cao nhận thức số, trang bị máy tính kết nối mạng, số hóa chứng từ cơ bản, áp dụng hóa đơn điện tử và chữ ký số theo luật định.'
  },
  {
    level: 1,
    title: 'Khởi động',
    minScore: 10,
    maxScore: 24,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    bgColor: 'from-rose-50 to-orange-50',
    textColor: 'text-rose-700',
    description: 'Doanh nghiệp đã có một số hoạt động ban đầu trong việc ứng dụng công nghệ số rời rạc vào một số nghiệp vụ kế toán, quản lý hóa đơn, bán hàng.',
    advice: 'Chuẩn hóa quy trình làm việc trên văn bản số, sử dụng phần mềm bán hàng đa kênh và đào tạo phổ cập kỹ năng số căn bản cho nhân viên.'
  },
  {
    level: 2,
    title: 'Bắt đầu',
    minScore: 25,
    maxScore: 49,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgColor: 'from-amber-50 to-yellow-50',
    textColor: 'text-amber-700',
    description: 'Doanh nghiệp đã đạt được những bước tiến nhất định, triển khai các phần mềm nghiệp vụ cốt lõi nhưng chưa có sự liên thông dữ liệu hoàn chỉnh.',
    advice: 'Tập trung kết nối dữ liệu liên thông giữa bán hàng, kho và kế toán tài chính; xây dựng cơ sở dữ liệu khách hàng CRM tập trung.'
  },
  {
    level: 3,
    title: 'Hình thành',
    minScore: 50,
    maxScore: 74,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'from-blue-50 to-cyan-50',
    textColor: 'text-blue-700',
    description: 'Doanh nghiệp đã hình thành các yếu tố chuyển đổi số quan trọng, quy trình số hóa từ 50% - 75%, vận hành trên nền tảng ERP/CRM thống nhất.',
    advice: 'Đầu tư nâng cấp hệ thống an toàn thông tin, tích hợp báo cáo thông minh trực quan (Dashboard BI) và tự động hóa quy trình nghiệp vụ (RPA).'
  },
  {
    level: 4,
    title: 'Nâng cao',
    minScore: 75,
    maxScore: 89,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    bgColor: 'from-teal-50 to-emerald-50',
    textColor: 'text-teal-700',
    description: 'Doanh nghiệp đã triển khai và đạt mức độ chuyển đổi số cao, hoạt động kinh doanh vận hành tự động, ra quyết định dựa trên dữ liệu thời gian thực.',
    advice: 'Ứng dụng Trí tuệ nhân tạo (AI/ML) phân tích dự báo nhu cầu, tối ưu hóa chi phí vận hành và xây dựng trải nghiệm khách hàng cá nhân hóa.'
  },
  {
    level: 5,
    title: 'Dẫn dắt',
    minScore: 90,
    maxScore: 100,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgColor: 'from-indigo-50 to-violet-50',
    textColor: 'text-indigo-700',
    description: 'Chuyển đổi số đạt mức hoàn thiện, doanh nghiệp thực sự là một doanh nghiệp số, phương thức kinh doanh dựa trên nền tảng số và dữ liệu số.',
    advice: 'Mở rộng nền tảng hệ sinh thái kết nối đối tác mở (Open API), xuất khẩu sản phẩm số và định hình chuẩn mực đổi mới sáng tạo trong ngành.'
  }
];

// 6 Cấp độ chuyển đổi số chuẩn cho Doanh nghiệp Lớn (Phụ lục II - Thang điểm 695)
export const DBI_LEVELS_LARGE: DbiLevelInfo[] = [
  {
    level: 0,
    title: 'Chưa chuyển đổi số',
    minScore: 0,
    maxScore: 69,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    bgColor: 'from-slate-50 to-gray-100',
    textColor: 'text-slate-700',
    description: 'Doanh nghiệp lớn gần như chưa có chiến lược chuyển đổi số chính thức cấp Tập đoàn, các hệ thống công nghệ thông tin vận hành rời rạc (Dưới 10% điểm tối đa).',
    advice: 'Xây dựng Chiến lược Chuyển đổi số tổng thể (Enterprise Digital Strategy), thành lập Ủy ban CĐS do Lãnh đạo cấp cao nhất (HĐQT/Tổng Giám đốc) đứng đầu.'
  },
  {
    level: 1,
    title: 'Khởi động',
    minScore: 70,
    maxScore: 173,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    bgColor: 'from-rose-50 to-orange-50',
    textColor: 'text-rose-700',
    description: 'Doanh nghiệp đã ban hành định hướng chiến lược ban đầu, triển khai thử nghiệm một số chương trình thí điểm chuyển đổi số ở cấp đơn vị thành viên (Từ 10% đến dưới 25%).',
    advice: 'Thiết kế Kiến trúc Doanh nghiệp tổng thể (Enterprise Architecture: TOGAF), chuẩn hóa danh mục dữ liệu dùng chung (Master Data) và rà soát ATTT.'
  },
  {
    level: 2,
    title: 'Bắt đầu',
    minScore: 174,
    maxScore: 347,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgColor: 'from-amber-50 to-yellow-50',
    textColor: 'text-amber-700',
    description: 'Doanh nghiệp đã đạt những bước tiến vững chắc, triển khai hệ thống lõi (Tier-1 ERP, CRM, Core Banking/MES), dịch chuyển hạ tầng lên đám mây (Từ 25% đến dưới 50%).',
    advice: 'Hợp nhất dữ liệu về Kho dữ liệu tập trung (Data Lakehouse), xây dựng Trung tâm giám sát An toàn thông tin (SOC 24/7) và ban hành khung năng lực số nhân sự.'
  },
  {
    level: 3,
    title: 'Hình thành',
    minScore: 348,
    maxScore: 520,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'from-blue-50 to-cyan-50',
    textColor: 'text-blue-700',
    description: 'Chuyển đổi số đã hình thành đồng bộ trên cả 6 trụ cột cốt lõi. Tích hợp xuyên suốt chuỗi giá trị và quy trình nghiệp vụ, quản trị bằng Dashboard chỉ số thời gian thực (Từ 50% đến dưới 75%).',
    advice: 'Phát triển văn hóa ra quyết định dựa trên dữ liệu (Data-driven Culture), đẩy mạnh tự động hóa quy trình thông minh (IPA/RPA) và tích hợp chuỗi cung ứng số.'
  },
  {
    level: 4,
    title: 'Nâng cao',
    minScore: 521,
    maxScore: 625,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    bgColor: 'from-teal-50 to-emerald-50',
    textColor: 'text-teal-700',
    description: 'Doanh nghiệp đạt mức độ chuyển đổi số cao, làm chủ công nghệ đám mây lai (Hybrid Cloud), AI/Big Data và DevSecOps; quy trình tự động thích ứng linh hoạt (Từ 75% đến dưới 90%).',
    advice: 'Thương mại hóa dữ liệu và dịch vụ số, triển khai ứng dụng Trí tuệ nhân tạo tạo sinh (GenAI) chuyên biệt vào vận hành và đào tạo thế hệ lãnh đạo số.'
  },
  {
    level: 5,
    title: 'Dẫn dắt',
    minScore: 626,
    maxScore: 695,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgColor: 'from-indigo-50 to-violet-50',
    textColor: 'text-indigo-700',
    description: 'Doanh nghiệp chuyển đổi số đạt mức độ tiệm cận hoàn thiện, thực sự trở thành doanh nghiệp số, có năng lực dẫn dắt hệ sinh thái doanh nghiệp vệ tinh (Từ 90% trở lên).',
    advice: 'Kiến tạo và phát triển nền tảng hệ sinh thái số mở, chia sẻ dữ liệu chiến lược trong chuỗi giá trị quốc gia và quốc tế, định hình tiêu chuẩn công nghệ ngành.'
  }
];
