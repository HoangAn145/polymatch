import { 
  PillarInfo, 
  DbiLevelInfo, 
  AssessmentQuestion, 
  TechTaxonomyItem, 
  TechListing, 
  UserAccount, 
  LeadInquiry, 
  MatchingWeights,
  AssessmentResultData,
  PlatformPricingConfig,
  WalletTransaction
} from '../types';

export const DBI_PILLARS: PillarInfo[] = [
  {
    id: 'CUSTOMER_EXPERIENCE',
    name: 'Trải nghiệm khách hàng',
    shortName: 'Khách hàng',
    iconName: 'Users',
    weight: 0.18,
    description: 'Số hóa các điểm chạm, tương tác đa kênh, cá nhân hóa trải nghiệm và chăm sóc khách hàng tự động.'
  },
  {
    id: 'STRATEGY',
    name: 'Chiến lược',
    shortName: 'Chiến lược',
    iconName: 'Target',
    weight: 0.16,
    description: 'Tầm nhìn chuyển đổi số của ban lãnh đạo, lộ trình đầu tư công nghệ và văn hóa đổi mới sáng tạo.'
  },
  {
    id: 'INFRASTRUCTURE_TECH',
    name: 'Hạ tầng & Công nghệ',
    shortName: 'Hạ tầng',
    iconName: 'Server',
    weight: 0.16,
    description: 'Hạ tầng mạng, điện toán đám mây, an ninh thông tin, khả năng tích hợp và mở rộng hệ thống.'
  },
  {
    id: 'OPERATIONS',
    name: 'Vận hành',
    shortName: 'Vận hành',
    iconName: 'Cpu',
    weight: 0.18,
    description: 'Tự động hóa quy trình nghiệp vụ nội bộ, quản trị chuỗi cung ứng, sản xuất và số hóa giấy tờ.'
  },
  {
    id: 'DATA_SECURITY',
    name: 'Dữ liệu & Bảo mật',
    shortName: 'Dữ liệu & ATTT',
    iconName: 'ShieldCheck',
    weight: 0.18,
    description: 'Thu thập, quản trị, khai thác dữ liệu kinh doanh (BI/AI) và tuân thủ an toàn an ninh mạng quốc gia.'
  },
  {
    id: 'PEOPLE_CULTURE',
    name: 'Con người & Văn hóa',
    shortName: 'Con người',
    iconName: 'Award',
    weight: 0.14,
    description: 'Kỹ năng số của nhân viên, đào tạo nội bộ, mức độ sẵn sàng thích ứng thay đổi và chính sách đãi ngộ.'
  }
];

export const DBI_LEVELS: DbiLevelInfo[] = [
  {
    level: 1,
    title: 'Khởi động',
    minScore: 0,
    maxScore: 20,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    bgColor: 'from-rose-50 to-orange-50',
    textColor: 'text-rose-700',
    description: 'Doanh nghiệp hầu như vận hành thủ công, ứng dụng công nghệ rời rạc, chưa có chiến lược chuyển đổi số cụ thể.',
    advice: 'Tập trung số hóa các tài liệu cơ bản, sử dụng email doanh nghiệp, phần mềm kế toán và chuẩn hóa quy trình giấy tờ.'
  },
  {
    level: 2,
    title: 'Bắt đầu',
    minScore: 21,
    maxScore: 40,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgColor: 'from-amber-50 to-yellow-50',
    textColor: 'text-amber-700',
    description: 'Đã triển khai thử nghiệm một số phần mềm đơn lẻ (bán hàng, kế toán, nhân sự), nhưng chưa có sự liên thông dữ liệu.',
    advice: 'Kết nối các phần mềm rời rạc, xây dựng cổng thanh toán trực tuyến, chuẩn hóa cơ sở dữ liệu khách hàng CRM.'
  },
  {
    level: 3,
    title: 'Hình thành',
    minScore: 41,
    maxScore: 60,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'from-blue-50 to-cyan-50',
    textColor: 'text-blue-700',
    description: 'Các phòng ban đã kết nối trên hệ thống quản trị chung (ERP/CRM), quy trình làm việc được số hóa từ 50-70%.',
    advice: 'Nâng cao chất lượng bảo mật dữ liệu, tích hợp báo cáo thông minh BI và mở rộng tự động hóa quy trình nghiệp vụ (RPA).'
  },
  {
    level: 4,
    title: 'Nâng cao',
    minScore: 61,
    maxScore: 80,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    bgColor: 'from-teal-50 to-emerald-50',
    textColor: 'text-teal-700',
    description: 'Quy trình hoạt động được tự động hóa xuyên suốt, dữ liệu thời gian thực hỗ trợ ra quyết định kinh doanh linh hoạt.',
    advice: 'Ứng dụng Trí tuệ nhân tạo (AI/ML) phân tích dự báo, tối ưu hóa chuỗi cung ứng và kiến tạo trải nghiệm khách hàng siêu cá nhân hóa.'
  },
  {
    level: 5,
    title: 'Dẫn dắt',
    minScore: 81,
    maxScore: 100,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgColor: 'from-indigo-50 to-violet-50',
    textColor: 'text-indigo-700',
    description: 'Chuyển đổi số trở thành DNA của tổ chức. Doanh nghiệp làm chủ mô hình kinh doanh số, dẫn dắt đổi mới ngành.',
    advice: 'Mở rộng nền tảng hệ sinh thái mở (Open API), xuất khẩu giải pháp số và thiết lập chuẩn mực đổi mới sáng tạo liên tục.'
  }
];

export const VIETNAM_INDUSTRIES: string[] = [
  'Sản xuất & Chế biến chế tạo',
  'Bán lẻ & Thương mại điện tử',
  'Logistics, Vận tải & Kho bãi',
  'Nông, Lâm nghiệp & Thủy sản công nghệ cao',
  'Tài chính, Ngân hàng & Bảo hiểm',
  'Y tế, Dược phẩm & Chăm sóc sức khỏe',
  'Giáo dục, Đào tạo & EdTech',
  'Xây dựng & Vật liệu xây dựng',
  'Bất động sản & Quản lý tòa nhà',
  'Dệt may, Da giày & Thời trang',
  'Nhà hàng, Khách sạn & Du lịch (F&B / Hospitality)',
  'Công nghệ thông tin & Viễn thông',
  'Dịch vụ Chuyên nghiệp & Tư vấn doanh nghiệp',
  'Năng lượng, Điện & Năng lượng tái tạo',
  'Hóa chất, Nhựa & Bao bì',
  'Thực phẩm & Đồ uống đóng gói',
  'Cơ khí chính xác & Chế tạo máy',
  'Ô tô, Xe máy & Phụ tùng',
  'Truyền thông, Quảng cáo & Giải trí',
  'Khai khoáng & Luyện kim',
  'Cấp thoát nước & Xử lý môi trường',
  'Dịch vụ An ninh & Bảo vệ',
  'Thương mại XNK & Phân phối tổng hợp',
  'Thủ công mỹ nghệ & Làng nghề',
  'Khác'
];

export const VIETNAM_PROVINCES: string[] = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Bắc Ninh', 'Bà Rịa - Vũng Tàu', 'Quảng Ninh',
  'Thái Nguyên', 'Vĩnh Phúc', 'Bắc Giang', 'Hưng Yên', 'Hải Dương',
  'Thừa Thiên Huế', 'Khánh Hòa', 'Lâm Đồng', 'Nghệ An', 'Thanh Hóa',
  'Bình Định', 'Long An', 'Tiền Giang', 'Kiên Giang', 'Khác'
];

// Closed Taxonomy of standard Tech Solutions
export const TECH_TAXONOMY: TechTaxonomyItem[] = [
  {
    id_tech: 'TECH-ERP-01',
    name: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    pillarId: 'OPERATIONS',
    category: 'Vận hành & Sản xuất',
    standardCode: 'ISO/IEC-ERP-01',
    description: 'Hợp nhất toàn bộ quy trình kế toán, mua bán hàng, quản lý kho, tài chính và sản xuất trên một cơ sở dữ liệu duy nhất.',
    defaultPriceRange: '50 - 300 triệu VND'
  },
  {
    id_tech: 'TECH-CRM-02',
    name: 'Nền tảng Quản trị Quan hệ Khách hàng (CRM Omnichannel)',
    pillarId: 'CUSTOMER_EXPERIENCE',
    category: 'Bán hàng & Chăm sóc khách hàng',
    standardCode: 'ISO/IEC-CRM-02',
    description: 'Quản lý phễu bán hàng, lịch sử tiếp xúc khách hàng đa kênh (Web, Facebook, Zalo, Hotline, Email) và tự động hóa marketing.',
    defaultPriceRange: '15 - 80 triệu VND'
  },
  {
    id_tech: 'TECH-HRM-03',
    name: 'Phần mềm Quản lý Nhân sự & e-HRM',
    pillarId: 'PEOPLE_CULTURE',
    category: 'Nhân sự & Văn hóa doanh nghiệp',
    standardCode: 'ISO/IEC-HRM-03',
    description: 'Số hóa chấm công GPS/khuôn mặt, bảng lương tự động, đánh giá KPI/OKR và cổng thông tin nhân viên tự phục vụ.',
    defaultPriceRange: '12 - 60 triệu VND'
  },
  {
    id_tech: 'TECH-WMS-04',
    name: 'Hệ thống Quản lý Kho thông minh (Smart WMS & Barcode/RFID)',
    pillarId: 'OPERATIONS',
    category: 'Vận hành & Chuỗi cung ứng',
    standardCode: 'ISO/IEC-WMS-04',
    description: 'Kiểm soát tồn kho theo thời gian thực, quản lý vị trí bin/kệ, quét mã QR/mã vạch và điều phối xuất nhập tồn thông minh.',
    defaultPriceRange: '30 - 150 triệu VND'
  },
  {
    id_tech: 'TECH-MES-05',
    name: 'Hệ thống Điều hành Sản xuất Nhà máy (MES / SCADA)',
    pillarId: 'OPERATIONS',
    category: 'Sản xuất thông minh',
    standardCode: 'ISO/IEC-MES-05',
    description: 'Giám sát tiến độ dây chuyền sản xuất trực tiếp, đo lường chỉ số hiệu suất OEE máy móc và quản lý định mức BOM nguyên vật liệu.',
    defaultPriceRange: '100 - 600 triệu VND'
  },
  {
    id_tech: 'TECH-SEC-06',
    name: 'Giải pháp An toàn Thông tin & Phòng chống Ransomware (EDR/SIEM)',
    pillarId: 'DATA_SECURITY',
    category: 'Bảo mật & Dữ liệu',
    standardCode: 'TCVN-ATTT-06',
    description: 'Bảo vệ thiết bị đầu cuối, phát hiện mã độc mã hóa dữ liệu, tường lửa thế hệ mới (NGFW) và sao lưu dữ liệu chống ransomware tự động.',
    defaultPriceRange: '25 - 120 triệu VND'
  },
  {
    id_tech: 'TECH-BI-07',
    name: 'Nền tảng Báo cáo Dữ liệu Thông minh (Business Intelligence - BI)',
    pillarId: 'DATA_SECURITY',
    category: 'Dữ liệu & Ra quyết định',
    standardCode: 'ISO/IEC-BI-07',
    description: 'Trực quan hóa chỉ số tài chính, doanh thu, dòng tiền theo thời gian thực trên dashboard di động giúp ban lãnh đạo ra quyết định nhanh.',
    defaultPriceRange: '20 - 90 triệu VND'
  },
  {
    id_tech: 'TECH-EOFFICE-08',
    name: 'Văn phòng số & Ký số Hợp đồng Điện tử (e-Office / Paperless)',
    pillarId: 'STRATEGY',
    category: 'Số hóa quản trị',
    standardCode: 'TCVN-EOFFICE-08',
    description: 'Phê duyệt tờ trình, quy trình ký số hợp đồng thương mại có giá trị pháp lý, quản lý công văn và giao việc không dùng giấy tờ.',
    defaultPriceRange: '10 - 45 triệu VND'
  },
  {
    id_tech: 'TECH-CLOUD-09',
    name: 'Hạ tầng Điện toán Đám mây & Di trú Server (Cloud IaaS/PaaS)',
    pillarId: 'INFRASTRUCTURE_TECH',
    category: 'Hạ tầng số',
    standardCode: 'ISO/IEC-CLOUD-09',
    description: 'Dịch vụ máy chủ ảo đám mây chuẩn Tier 3 tại Việt Nam, cân bằng tải tự động, đảm bảo tính sẵn sàng 99.99% và bảo toàn dữ liệu.',
    defaultPriceRange: '30 - 200 triệu VND'
  },
  {
    id_tech: 'TECH-RPA-10',
    name: 'Tự động hóa Quy trình Bằng Robot Ảo (RPA Bots)',
    pillarId: 'OPERATIONS',
    category: 'Tự động hóa',
    standardCode: 'ISO/IEC-RPA-10',
    description: 'Robot phần mềm tự động đọc hóa đơn VAT, đối soát chứng từ ngân hàng, trích xuất dữ liệu Excel và nhập liệu tự động vào hệ thống.',
    defaultPriceRange: '40 - 180 triệu VND'
  },
  {
    id_tech: 'TECH-AICARE-11',
    name: 'Trợ lý AI CSKH & Tổng đài Thông minh (AI Chatbot/Voicebot)',
    pillarId: 'CUSTOMER_EXPERIENCE',
    category: 'Chăm sóc khách hàng',
    standardCode: 'ISO/IEC-AI-11',
    description: 'Trợ lý ảo AI tự động trả lời tư vấn khách hàng 24/7 trên Fanpage, Zalo OA, Website và tự động gọi nhắc nợ / xác nhận đơn hàng.',
    defaultPriceRange: '15 - 75 triệu VND'
  },
  {
    id_tech: 'TECH-IOT-12',
    name: 'Giải pháp Giám sát IoT Cảm biến & Năng lượng',
    pillarId: 'INFRASTRUCTURE_TECH',
    category: 'Công nghệ kết nối',
    standardCode: 'ISO/IEC-IOT-12',
    description: 'Thu thập dữ liệu cảm biến nhiệt độ, độ ẩm kho hàng, cảnh báo rủi ro chập cháy và đo đạc tiết kiệm điện năng tiêu thụ.',
    defaultPriceRange: '50 - 250 triệu VND'
  }
];

export const TAXONOMY_CATALOG: TechTaxonomyItem[] = TECH_TAXONOMY;

// 25 Assessment Questions for SME
export const SME_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Pillar 1: Trải nghiệm khách hàng (4 questions)
  {
    id: 'Q01',
    pillarId: 'CUSTOMER_EXPERIENCE',
    questionNumber: 1,
    title: 'Kênh tiếp cận và tương tác với khách hàng hiện tại của doanh nghiệp?',
    context: 'Đánh giá mức độ số hóa các điểm chạm khách hàng từ truyền thống đến đa kênh tích hợp.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Chủ yếu gặp trực tiếp, gọi điện thoại thoại hoặc gửi tài liệu giấy.', score: 1 },
      { text: 'Có lập trang web giới thiệu đơn giản hoặc fanpage nhưng phản hồi thủ công.', score: 2 },
      { text: 'Tương tác qua nhiều kênh (Web, Facebook, Zalo OA) và có phân công nhân sự trực thường xuyên.', score: 3 },
      { text: 'Sử dụng hệ thống phần mềm Omnichannel tập trung tất cả tin nhắn, bình luận về một nơi.', score: 4 },
      { text: 'Tích hợp AI Chatbot trả lời tự động 24/7 và hệ thống tự động cá nhân hóa ưu đãi theo hành vi khách hàng.', score: 5 }
    ]
  },
  {
    id: 'Q02',
    pillarId: 'CUSTOMER_EXPERIENCE',
    questionNumber: 2,
    title: 'Phương thức quản lý thông tin và lịch sử giao dịch khách hàng?',
    context: 'Đo lường năng lực lưu trữ và thấu hiểu khách hàng qua dữ liệu.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Lưu trong sổ tay hoặc mỗi nhân viên kinh doanh tự lưu danh bạ cá nhân.', score: 1 },
      { text: 'Lưu bằng các file Excel/Google Sheets phân tán ở các phòng ban.', score: 2 },
      { text: 'Sử dụng phần mềm CRM tập trung để quản lý liên hệ và lịch sử mua bán.', score: 3 },
      { text: 'CRM đồng bộ dữ liệu thời gian thực với hệ thống bán hàng, kho và kế toán.', score: 4 },
      { text: 'Dữ liệu khách hàng 360 độ kết hợp thuật toán phân tích hành vi, dự đoán nhu cầu tái mua hàng.', score: 5 }
    ]
  },
  {
    id: 'Q03',
    pillarId: 'CUSTOMER_EXPERIENCE',
    questionNumber: 3,
    title: 'Quy trình tiếp nhận và xử lý khiếu nại, phản hồi của khách hàng?',
    context: 'Mức độ tự động hóa trong theo dõi sự hài lòng của khách hàng.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Khách gọi điện hoặc phàn nàn thì xử lý sự vụ, không ghi nhận thành dữ liệu.', score: 1 },
      { text: 'Ghi nhận vào sổ theo dõi hoặc bảng tính Excel định kỳ cuối tuần/tháng.', score: 2 },
      { text: 'Có quy trình phản hồi qua email hoặc form khảo sát trực tuyến tiêu chuẩn.', score: 3 },
      { text: 'Sử dụng hệ thống Helpdesk/Ticketing có mã theo dõi và đo lường thời gian SLA xử lý.', score: 4 },
      { text: 'Đo lường chỉ số CSAT/NPS tự động ngay sau giao dịch, kích hoạt quy trình khắc phục tức thời khi có cảnh báo xấu.', score: 5 }
    ]
  },
  {
    id: 'Q04',
    pillarId: 'CUSTOMER_EXPERIENCE',
    questionNumber: 4,
    title: 'Khả năng thanh toán trực tuyến và giao dịch không tiền mặt?',
    context: 'Đánh giá việc ứng dụng các cổng thanh toán số.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Chỉ chấp nhận tiền mặt hoặc chuyển khoản thủ công kiểm tra từng giao dịch.', score: 1 },
      { text: 'Có in mã QR tài khoản ngân hàng để khách tự chuyển khoản.', score: 2 },
      { text: 'Tích hợp mã QR động sinh theo từng hóa đơn, nhận thông báo biến động số dư tự động.', score: 3 },
      { text: 'Kết nối cổng thanh toán trực tuyến (VNPAY, MoMo, Visa/Mastercard) trên website/ứng dụng.', score: 4 },
      { text: 'Hệ thống đối soát tài chính và gạch nợ tự động hoàn toàn với cổng ngân hàng Open Banking.', score: 5 }
    ]
  },

  // Pillar 2: Chiến lược (4 questions)
  {
    id: 'Q05',
    pillarId: 'STRATEGY',
    questionNumber: 5,
    title: 'Mức độ cam kết và kế hoạch chuyển đổi số của Ban Lãnh đạo?',
    context: 'Đánh giá tầm nhìn và định hướng chiến lược từ cấp điều hành.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Lãnh đạo chưa quan tâm hoặc xem chuyển đổi số là việc của bộ phận kỹ thuật.', score: 1 },
      { text: 'Lãnh đạo ủng hộ nhưng chưa có kế hoạch hoặc ngân sách cụ thể.', score: 2 },
      { text: 'Đã có lộ trình chuyển đổi số 1-3 năm và phân bổ ngân sách thử nghiệm hàng năm.', score: 3 },
      { text: 'Chuyển đổi số gắn liền với mục tiêu kinh doanh chính (KPI), có người phụ trách chuyên trách.', score: 4 },
      { text: 'Mô hình kinh doanh số là động lực tăng trưởng cốt lõi, đổi mới công nghệ liên tục.', score: 5 }
    ]
  },
  {
    id: 'Q06',
    pillarId: 'STRATEGY',
    questionNumber: 6,
    title: 'Tỷ lệ ngân sách hàng năm dành cho ứng dụng công nghệ và chuyển đổi số?',
    context: 'Đo lường mức độ ưu tiên tài chính cho CĐS.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Dưới 1% doanh thu hoặc chỉ phát sinh khi máy móc/phần mềm bị hỏng.', score: 1 },
      { text: 'Khoảng 1% - 2% doanh thu, chủ yếu cho chi phí bản quyền phần mềm văn phòng cơ bản.', score: 2 },
      { text: 'Khoảng 2% - 5% doanh thu, có danh mục đầu tư phần mềm quản trị rõ ràng.', score: 3 },
      { text: 'Từ 5% - 8% doanh thu, đầu tư bài bản cho nâng cấp hệ thống và an ninh mạng.', score: 4 },
      { text: 'Trên 8% doanh thu, ưu tiên đầu tư đổi mới sáng tạo, dữ liệu lớn và AI.', score: 5 }
    ]
  },
  {
    id: 'Q07',
    pillarId: 'STRATEGY',
    questionNumber: 7,
    title: 'Mức độ số hóa văn bản, tài liệu và quy trình phê duyệt nội bộ?',
    context: 'Chuyển đổi văn phòng không giấy tờ.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: '100% tài liệu in giấy, trình ký tay trực tiếp.', score: 1 },
      { text: 'Gửi file qua Zalo/Email nhưng vẫn in ra ký đóng dấu lưu trữ.', score: 2 },
      { text: 'Có hệ thống e-Office duyệt văn bản nội bộ, sử dụng chữ ký số USB token.', score: 3 },
      { text: '90% quy trình ký duyệt qua ứng dụng di động, áp dụng ký số từ xa (Cloud HSM) cho hợp đồng điện tử.', score: 4 },
      { text: 'Văn phòng hoàn toàn không giấy tờ (Paperless), quy trình số hóa và lưu trữ đám mây mã hóa bảo mật.', score: 5 }
    ]
  },
  {
    id: 'Q08',
    pillarId: 'STRATEGY',
    questionNumber: 8,
    title: 'Khả năng thích ứng và điều chỉnh chiến lược kinh doanh dựa trên thị trường số?',
    context: 'Đánh giá tính linh hoạt của mô hình doanh nghiệp.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Bảo thủ theo thói quen cũ, chậm thay đổi khi đối thủ ứng dụng công nghệ.', score: 1 },
      { text: 'Quan sát thị trường nhưng chỉ thử nghiệm dè dặt khi có yêu cầu bắt buộc từ đối tác.', score: 2 },
      { text: 'Chủ động thử nghiệm các kênh bán hàng số và công cụ quản trị mới trong năm.', score: 3 },
      { text: 'Nhanh chóng ra mắt các gói sản phẩm/dịch vụ số mới thích ứng xu thế chỉ trong vài tuần.', score: 4 },
      { text: 'Liên tục kiến tạo mô hình dịch vụ số đột phá, đi trước và định hình xu hướng thị trường.', score: 5 }
    ]
  },

  // Pillar 3: Hạ tầng & Công nghệ (4 questions)
  {
    id: 'Q09',
    pillarId: 'INFRASTRUCTURE_TECH',
    questionNumber: 9,
    title: 'Hạ tầng máy chủ và hệ thống lưu trữ dữ liệu của doanh nghiệp?',
    context: 'Mức độ hiện đại hóa hạ tầng phần cứng và đám mây.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Lưu trên từng máy tính cá nhân của nhân viên, không có máy chủ tập trung.', score: 1 },
      { text: 'Dùng một máy tính văn phòng làm máy chủ nội bộ (File server cục bộ) không có điều hòa chuyên dụng.', score: 2 },
      { text: 'Sử dụng dịch vụ máy chủ đám mây (Cloud Server / VPS) hoặc lưu trữ Google Workspace/Microsoft 365.', score: 3 },
      { text: 'Kiến trúc Hybrid Cloud linh hoạt, có cơ chế cân bằng tải và giám sát tài nguyên 24/7.', score: 4 },
      { text: 'Hạ tầng điện toán đám mây hiện đại, tự động mở rộng (Auto-scaling), chuẩn an toàn ISO 27001.', score: 5 }
    ]
  },
  {
    id: 'Q10',
    pillarId: 'INFRASTRUCTURE_TECH',
    questionNumber: 10,
    title: 'Khả năng tích hợp và liên thông giữa các ứng dụng phần mềm?',
    context: 'Đo lường mức độ đồng bộ (Silo vs Integrated System). Điểm cao kích hoạt nhánh khảo sát chuyên sâu.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Các phần mềm hoàn toàn độc lập, nhân viên phải xuất Excel từ phần mềm này gõ lại vào phần mềm khác.', score: 1 },
      { text: 'Nhập xuất dữ liệu bán thủ công bằng file CSV/Excel giữa các phòng ban.', score: 2 },
      { text: 'Một số phần mềm cốt lõi (như Bán hàng - Kho - Kế toán) đã có kết nối tự động đồng bộ số liệu.', score: 3 },
      { text: 'Toàn bộ hệ sinh thái phần mềm kết nối qua API chuẩn hóa, cập nhật tức thời không có độ trễ.', score: 4 },
      { text: 'Hệ thống nền tảng mở (Open Architecture), sẵn sàng kết nối API tức thời với ngân hàng, sàn TMĐT và đối tác logistics.', score: 5 }
    ]
  },
  {
    id: 'Q11',
    pillarId: 'INFRASTRUCTURE_TECH',
    questionNumber: 11,
    title: 'Tình trạng an ninh mạng và trang bị thiết bị đầu cuối cho nhân sự?',
    context: 'Đánh giá mức độ an toàn của thiết bị làm việc.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Nhân viên dùng máy tính cá nhân tự do cài đặt phần mềm không có bản quyền.', score: 1 },
      { text: 'Có cài phần mềm diệt virus miễn phí nhưng không có tường lửa hoặc chính sách kiểm soát.', score: 2 },
      { text: 'Máy tính công ty được cài đặt phần mềm bảo mật có bản quyền, có phân quyền truy cập mạng Wifi nội bộ.', score: 3 },
      { text: 'Quản lý tập trung thiết bị (MDM), xác thực 2 lớp (2FA/MFA) cho toàn bộ tài khoản doanh nghiệp.', score: 4 },
      { text: 'Kiến trúc Zero Trust, giám sát an ninh mạng SIEM/SOC thời gian thực và diễn tập ứng cứu sự cố định kỳ.', score: 5 }
    ]
  },
  {
    id: 'Q12',
    pillarId: 'INFRASTRUCTURE_TECH',
    questionNumber: 12,
    title: 'Chính sách sao lưu (Backup) và phục hồi thảm họa dữ liệu?',
    context: 'Khả năng đảm bảo tính liên tục trong hoạt động kinh doanh khi gặp sự cố.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Không có cơ chế sao lưu, mất máy là mất toàn bộ dữ liệu.', score: 1 },
      { text: 'Thỉnh thoảng nhân viên tự copy dữ liệu ra ổ cứng di động cắm ngoài.', score: 2 },
      { text: 'Có lịch sao lưu tự động hàng tuần lên dịch vụ đám mây an toàn.', score: 3 },
      { text: 'Sao lưu tự động hàng ngày theo nguyên tắc 3-2-1 (3 bản sao, 2 loại lưu trữ, 1 bản ngoài vị trí).', score: 4 },
      { text: 'Hệ thống dự phòng nóng thời gian thực (Hot standby), cam kết thời gian khôi phục sự cố dưới 15 phút (RPO/RTO chuẩn cao).', score: 5 }
    ]
  },

  // Pillar 4: Vận hành (4 questions)
  {
    id: 'Q13',
    pillarId: 'OPERATIONS',
    questionNumber: 13,
    title: 'Mức độ chuẩn hóa và tự động hóa quy trình nghiệp vụ nội bộ?',
    context: 'Đo lường việc loại bỏ các công việc lặp lại thủ công.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Quy trình truyền miệng, làm theo kinh nghiệm cá nhân, không có văn bản hướng dẫn.', score: 1 },
      { text: 'Có quy trình bằng văn bản (SOP) nhưng thực tế nhân viên vẫn xử lý linh hoạt không theo chuẩn.', score: 2 },
      { text: 'Quy trình nghiệp vụ chính được đưa lên phần mềm quản lý công việc (Trello, Jira, Base, v.v.).', score: 3 },
      { text: 'Tự động hóa luồng phê duyệt và thông báo giữa các bộ phận, giảm thiểu tối đa sự can thiệp của con người.', score: 4 },
      { text: 'Áp dụng công nghệ tự động hóa RPA và AI trong việc xử lý chứng từ, đối soát tài chính và xuất nhập kho.', score: 5 }
    ]
  },
  {
    id: 'Q14',
    pillarId: 'OPERATIONS',
    questionNumber: 14,
    title: 'Quy trình quản lý hàng tồn kho và chuỗi cung ứng?',
    context: 'Tối ưu hóa vòng quay vốn và kiểm soát thất thoát.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Kiểm kho thủ công bằng sổ sách, thường xuyên sai lệch hoặc mất mát không rõ nguyên nhân.', score: 1 },
      { text: 'Quản lý kho bằng Excel, chỉ kiểm kê định kỳ cuối quý hoặc cuối năm.', score: 2 },
      { text: 'Sử dụng phần mềm quản lý kho chuyên dụng có cảnh báo mức tồn kho an toàn.', score: 3 },
      { text: 'Áp dụng mã vạch QR/Barcode quét xuất nhập kho tức thì, đồng bộ với bộ phận bán hàng và mua hàng.', score: 4 },
      { text: 'Hệ thống Smart WMS dự báo nhu cầu đặt hàng tự động với nhà cung cấp dựa trên dữ liệu tiêu thụ lịch sử.', score: 5 }
    ]
  },
  {
    id: 'Q15',
    pillarId: 'OPERATIONS',
    questionNumber: 15,
    title: 'Quản lý tiến độ sản xuất hoặc cung ứng dịch vụ tới khách hàng?',
    context: 'Minh bạch tiến độ thực thi đơn hàng.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Hỏi trực tiếp người phụ trách qua điện thoại/miệng mới biết được đơn hàng đang ở đâu.', score: 1 },
      { text: 'Cập nhật tiến độ vào nhóm chat (Zalo/Viber) hoặc bảng tin tại văn phòng/xưởng.', score: 2 },
      { text: 'Theo dõi tiến độ trên bảng Kanban hoặc phần mềm quản lý dự án nội bộ.', score: 3 },
      { text: 'Khách hàng có thể tra cứu mã vận đơn hoặc tình trạng xử lý dịch vụ trực tuyến theo thời gian thực.', score: 4 },
      { text: 'Tự động điều phối công việc bằng thuật toán tối ưu nguồn lực, cảnh báo nghẽn cổ chai trước khi xảy ra chậm trễ.', score: 5 }
    ]
  },
  {
    id: 'Q16',
    pillarId: 'OPERATIONS',
    questionNumber: 16,
    title: 'Kiểm soát chi phí vận hành và định mức nguyên vật liệu / hao phí?',
    context: 'Năng lực quản trị chi phí tinh gọn.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Không kiểm soát chi tiết định mức, chỉ biết lỗ lãi tổng thể vào cuối năm.', score: 1 },
      { text: 'Tính toán định mức bằng các bảng tính Excel riêng lẻ khi làm báo giá.', score: 2 },
      { text: 'Hệ thống phần mềm hỗ trợ kiểm soát định mức BOM cơ bản và cảnh báo khi chi phí vượt hạn mức.', score: 3 },
      { text: 'Phân tích chi phí theo thời gian thực từng đơn hàng/sản phẩm, minh bạch nguyên nhân phát sinh lãng phí.', score: 4 },
      { text: 'Tối ưu hóa chi phí liên tục bằng mô hình Lean/Kaizen được hỗ trợ bởi hệ thống phân tích dữ liệu tự động.', score: 5 }
    ]
  },

  // Pillar 5: Dữ liệu & Bảo mật (5 questions)
  {
    id: 'Q17',
    pillarId: 'DATA_SECURITY',
    questionNumber: 17,
    title: 'Phương thức lưu trữ và quản trị cơ sở dữ liệu doanh nghiệp?',
    context: 'Đánh giá mức độ tập trung và chuẩn hóa dữ liệu tài sản số.',
    weight: 0.2,
    targetSize: 'ALL',
    options: [
      { text: 'Dữ liệu nằm phân tán trên máy tính cá nhân, USB và hộp thư điện tử riêng.', score: 1 },
      { text: 'Lưu trên thư mục dùng chung (Shared Folder) nhưng không có cấu trúc thư mục và quy tắc đặt tên.', score: 2 },
      { text: 'Dữ liệu kinh doanh cốt lõi được lưu trữ trên hệ quản trị cơ sở dữ liệu có sao lưu định kỳ.', score: 3 },
      { text: 'Xây dựng kho dữ liệu tập trung (Data Lake / Data Warehouse), làm sạch và chuẩn hóa danh mục dùng chung.', score: 4 },
      { text: 'Dữ liệu được coi là tài sản chiến lược cao nhất, có kiến trúc dữ liệu hoàn chỉnh và kiểm toán chất lượng dữ liệu tự động.', score: 5 }
    ]
  },
  {
    id: 'Q18',
    pillarId: 'DATA_SECURITY',
    questionNumber: 18,
    title: 'Khả năng lập báo cáo quản trị và khai thác dữ liệu hỗ trợ ra quyết định?',
    context: 'Mức độ phụ thuộc vào báo cáo thủ công vs Dashboard BI.',
    weight: 0.2,
    targetSize: 'ALL',
    options: [
      { text: 'Chờ kế toán hoặc các phòng ban tổng hợp mất từ 5 đến 15 ngày sau khi kết thúc tháng.', score: 1 },
      { text: 'Có báo cáo tuần nhưng phải xuất thủ công từ nhiều nguồn rồi ghép lại bằng Excel.', score: 2 },
      { text: 'Có các báo cáo chuẩn trên phần mềm quản lý, xem được doanh thu và công nợ theo ngày.', score: 3 },
      { text: 'Sử dụng Dashboard trực quan (PowerBI, Tableau, Looker) xem chỉ số tài chính - kinh doanh tức thời trên điện thoại.', score: 4 },
      { text: 'Mô hình phân tích dự báo (Predictive Analytics) dự đoán xu hướng thị trường, tồn kho và cảnh báo rủi ro tự động.', score: 5 }
    ]
  },
  {
    id: 'Q19',
    pillarId: 'DATA_SECURITY',
    questionNumber: 19,
    title: 'Phân quyền truy cập và bảo vệ thông tin mật của công ty?',
    context: 'Kiểm soát rủi ro thất thoát dữ liệu bí mật kinh doanh.',
    weight: 0.2,
    targetSize: 'ALL',
    options: [
      { text: 'Tất cả nhân viên dùng chung một mật khẩu hoặc ai cũng xem được toàn bộ dữ liệu.', score: 1 },
      { text: 'Chỉ cài mật khẩu cho file Excel quan trọng, không có phân quyền theo vai trò.', score: 2 },
      { text: 'Có phân quyền chi tiết theo vai trò/vị trí công việc (Role-based Access Control) trên các phần mềm.', score: 3 },
      { text: 'Có nhật ký ghi nhận vết truy cập (Audit log), ngăn chặn tải tài liệu mật ra ngoài thiết bị cá nhân.', score: 4 },
      { text: 'Mã hóa dữ liệu đầu - cuối (End-to-End Encryption), hệ thống DLP chống rò rỉ dữ liệu và kiểm toán bảo mật độc lập hàng năm.', score: 5 }
    ]
  },
  {
    id: 'Q20',
    pillarId: 'DATA_SECURITY',
    questionNumber: 20,
    title: 'Tuân thủ các quy định pháp luật về bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP)?',
    context: 'Mức độ tuân thủ pháp lý về an toàn dữ liệu khách hàng tại Việt Nam.',
    weight: 0.2,
    targetSize: 'ALL',
    options: [
      { text: 'Chưa biết hoặc chưa nắm rõ quy định về bảo vệ dữ liệu cá nhân.', score: 1 },
      { text: 'Có nghe thông tin nhưng chưa rà soát hệ thống và chưa có chính sách quyền riêng tư.', score: 2 },
      { text: 'Đã ban hành điều khoản thỏa thuận bảo mật dữ liệu với khách hàng và nhân viên trên giấy tờ/web.', score: 3 },
      { text: 'Đã bổ nhiệm cán bộ phụ trách bảo vệ dữ liệu (DPO) và nộp hồ sơ đánh giá tác động xử lý dữ liệu theo quy định.', score: 4 },
      { text: 'Tuân thủ toàn diện các tiêu chuẩn bảo mật quốc tế và quốc gia, quy trình xử lý dữ liệu được tự động hóa kiểm tra tính hợp chuẩn.', score: 5 }
    ]
  },
  {
    id: 'Q21',
    pillarId: 'DATA_SECURITY',
    questionNumber: 21,
    title: 'Chính sách ứng phó và xử lý sự cố an toàn thông tin mạng?',
    context: 'Năng lực phục hồi và phòng vệ trước các cuộc tấn công mạng.',
    weight: 0.2,
    targetSize: 'ALL',
    options: [
      { text: 'Chưa từng nghĩ tới hoặc khi bị virus tấn công thì format cài lại máy tính.', score: 1 },
      { text: 'Nhờ thợ máy tính bên ngoài đến hỗ trợ khi phát sinh sự cố nghiêm trọng.', score: 2 },
      { text: 'Có quy trình hướng dẫn nhân viên cách xử lý khi nhận email lừa đảo hoặc nghi nhiễm mã độc.', score: 3 },
      { text: 'Hợp tác với đơn vị chuyên trách an ninh mạng có cam kết thời gian phản ứng hỗ trợ 24/7 khi có sự cố.', score: 4 },
      { text: 'Trung tâm giám sát an toàn thông tin (SOC) giám sát liên tục, cô lập và vô hiệu hóa tấn công tự động trong vài giây.', score: 5 }
    ]
  },

  // Pillar 6: Con người & Văn hóa (4 questions)
  {
    id: 'Q22',
    pillarId: 'PEOPLE_CULTURE',
    questionNumber: 22,
    title: 'Mức độ thành thạo các kỹ năng số và công cụ làm việc hiện đại của đội ngũ nhân sự?',
    context: 'Đo lường năng lực số của lực lượng lao động.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Đa số nhân viên chỉ biết gọi điện thoại và thao tác ứng dụng nhắn tin cá nhân cơ bản.', score: 1 },
      { text: 'Nhân viên biết dùng Word/Excel cơ bản nhưng gặp khó khăn khi làm quen với phần mềm mới.', score: 2 },
      { text: 'Nhân viên sử dụng thành thạo các công cụ làm việc trực tuyến, họp từ xa và phần mềm chuyên môn.', score: 3 },
      { text: 'Nhân sự chủ động tự động hóa các tác vụ nhỏ, phân tích dữ liệu và ứng dụng các công cụ AI hỗ trợ công việc.', score: 4 },
      { text: 'Đội ngũ có tư duy dữ liệu (Data-driven mindset) xuất sắc, liên tục sáng tạo giải pháp công nghệ mới cho doanh nghiệp.', score: 5 }
    ]
  },
  {
    id: 'Q23',
    pillarId: 'PEOPLE_CULTURE',
    questionNumber: 23,
    title: 'Hoạt động đào tạo và bồi dưỡng năng lực số nội bộ?',
    context: 'Đầu tư phát triển nguồn nhân lực thích ứng kỷ nguyên số.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Không có hoạt động đào tạo nào, nhân viên tự xoay xở khi nhận việc.', score: 1 },
      { text: 'Chỉ hướng dẫn qua loa vài buổi khi công ty mới mua phần mềm.', score: 2 },
      { text: 'Có chương trình đào tạo kỹ năng số định kỳ hàng năm và kiểm tra sau đào tạo.', score: 3 },
      { text: 'Xây dựng cổng học tập trực tuyến (E-Learning / LMS), khuyến khích và tài trợ chứng chỉ công nghệ cho nhân sự.', score: 4 },
      { text: 'Văn hóa học tập liên tục suốt đời (Life-long learning), chương trình ươm mầm tài năng số và đổi mới sáng tạo nội bộ.', score: 5 }
    ]
  },
  {
    id: 'Q24',
    pillarId: 'PEOPLE_CULTURE',
    questionNumber: 24,
    title: 'Mức độ cởi mở và sẵn sàng đón nhận sự thay đổi công nghệ mới?',
    context: 'Đo lường sự kháng cự thay đổi (Change Resistance).',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Nhân viên và cấp quản lý kháng cự mạnh mẽ, tìm cách quay lại dùng giấy tờ khi áp dụng phần mềm.', score: 1 },
      { text: 'Chấp nhận làm theo nhưng với tâm lý đối phó, thường xuyên phàn nàn là mất thời gian hơn.', score: 2 },
      { text: 'Đội ngũ quản lý trung gian tích cực vận động nhân viên hợp tác triển khai giải pháp mới.', score: 3 },
      { text: 'Đại đa số nhân viên hào hứng vì thấy công nghệ giúp giảm tải công việc và tăng hiệu suất rõ rệt.', score: 4 },
      { text: 'Nhân viên các phòng ban chủ động đề xuất sáng kiến số hóa và cải tiến quy trình lên ban lãnh đạo hàng tháng.', score: 5 }
    ]
  },
  {
    id: 'Q25',
    pillarId: 'PEOPLE_CULTURE',
    questionNumber: 25,
    title: 'Cơ chế khuyến khích, khen thưởng cho các sáng kiến đổi mới số?',
    context: 'Chính sách tạo động lực cho chuyển đổi số.',
    weight: 0.25,
    targetSize: 'ALL',
    options: [
      { text: 'Không có cơ chế khen thưởng, làm tốt không được gì nhưng làm sai khi dùng phần mềm mới thì bị phạt.', score: 1 },
      { text: 'Khen ngợi miệng trong các cuộc họp tổng kết nhưng không có phần thưởng cụ thể.', score: 2 },
      { text: 'Có phần thưởng tài chính cho các cá nhân/nhóm hoàn thành đúng hạn việc triển khai hệ thống mới.', score: 3 },
      { text: 'Đưa chỉ số chuyển đổi số và đổi mới sáng tạo vào tiêu chí đánh giá KPI/xét thăng tiến hàng quý.', score: 4 },
      { text: 'Quỹ đổi mới sáng tạo nội bộ, chia sẻ lợi ích tài chính trực tiếp từ hiệu quả tiết kiệm chi phí/tăng doanh thu do sáng kiến số mang lại.', score: 5 }
    ]
  }
];

// Conditional Branching Questions (triggered when certain criteria are met)
export const CONDITIONAL_DEEPENING_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'CQ_01',
    pillarId: 'INFRASTRUCTURE_TECH',
    questionNumber: 26,
    title: '[Chuyên sâu Cấp độ 3+] Chiến lược triển khai kiến trúc đa đám mây (Multi-Cloud) và tính sẵn sàng cao?',
    context: 'Dành cho doanh nghiệp đã có hạ tầng số kết nối API: Đánh giá phương án dự phòng chuyển vùng máy chủ xuyên trung tâm dữ liệu.',
    weight: 0.5,
    targetSize: 'ALL',
    isConditional: true,
    conditionalTrigger: {
      dependsOnQuestionId: 'Q10',
      minScoreRequired: 3
    },
    options: [
      { text: 'Chỉ phụ thuộc vào 1 nhà cung cấp đám mây duy nhất, chưa có kịch bản chuyển dịch khi nhà cung cấp gặp sự cố.', score: 2 },
      { text: 'Đã chuẩn bị phương án sao lưu dữ liệu sang dịch vụ đám mây thứ hai định kỳ.', score: 3 },
      { text: 'Kiến trúc Multi-cloud với dịch vụ container (Docker/Kubernetes) cho phép chuyển đổi nhanh chóng.', score: 4 },
      { text: 'Tự động định tuyến lưu lượng thông minh giữa các đám mây với độ khả dụng 99.999% SLA toàn cầu.', score: 5 }
    ]
  },
  {
    id: 'CQ_02',
    pillarId: 'DATA_SECURITY',
    questionNumber: 27,
    title: '[Chuyên sâu Cấp độ 3+] Năng lực tích hợp và khai thác Trí tuệ nhân tạo (Generative AI / LLM) vào vận hành?',
    context: 'Dành cho doanh nghiệp đã có kho dữ liệu tập trung: Đánh giá mức độ ứng dụng AI nâng cao trong tự động hóa quyết định.',
    weight: 0.5,
    targetSize: 'ALL',
    isConditional: true,
    conditionalTrigger: {
      dependsOnQuestionId: 'Q18',
      minScoreRequired: 3
    },
    options: [
      { text: 'Chưa có chiến lược ứng dụng AI vào dữ liệu nội bộ vì lo ngại bảo mật rò rỉ thông tin.', score: 2 },
      { text: 'Nhân viên dùng ChatGPT/AI bên ngoài tự do cho công việc cá nhân nhưng chưa có hướng dẫn chính thức.', score: 3 },
      { text: 'Đã triển khai hệ thống AI Assistant nội bộ (Private AI/RAG) bảo mật dữ liệu tri thức doanh nghiệp.', score: 4 },
      { text: 'Huấn luyện mô hình AI chuyên biệt theo dữ liệu ngành riêng, tự động hóa 60% các quyết định phân tích nghiệp vụ.', score: 5 }
    ]
  }
];

// Initial Vendor Listings
export const INITIAL_TECH_LISTINGS: TechListing[] = [
  {
    id: 'LISTING-001',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    vendorMst: '0101234567',
    id_tech: 'TECH-ERP-01',
    techName: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    pillarId: 'OPERATIONS',
    summary: 'Giải pháp ERP thế hệ mới cho doanh nghiệp sản xuất và thương mại, tối ưu dòng tiền và tinh gọn chuỗi cung ứng.',
    description: 'FastERP là nền tảng quản trị tổng thể được thiết kế chuyên biệt theo chuẩn chế độ kế toán Việt Nam (VAS) và thông tư thuế mới nhất. Tích hợp phân hệ Quản lý Mua hàng, Bán hàng, Kho thông minh Barcode, Kế toán tài chính và Lập kế hoạch sản xuất MRP. Hệ thống vận hành trên nền tảng Cloud an toàn chuẩn Tier 3 tại Việt Nam.',
    priceMin: 45000000,
    priceMax: 180000000,
    priceUnit: 'VND / Gói triển khai trọn gói',
    targetSizes: ['SME', 'LARGE'],
    targetDbiLevels: [2, 3, 4],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    brochurePdfName: 'FastERP_Enterprise_Catalogue_2026.pdf',
    features: [
      'Đồng bộ 100% hóa đơn điện tử và gạch nợ ngân hàng tự động',
      'Lập kế hoạch nhu cầu nguyên vật liệu (MRP) chính xác 98%',
      'Hỗ trợ truy cập đa nền tảng Mobile App và Web',
      'Phân quyền bảo mật dữ liệu theo từng phòng ban và chi nhánh'
    ],
    deploymentTime: '4 - 8 tuần',
    status: 'approved',
    views: 1420,
    interestCount: 38,
    rating: 4.8,
    reviewCount: 26,
    createdAt: '2026-02-15'
  },
  {
    id: 'LISTING-002',
    vendorId: 'VEND-002',
    vendorName: 'Công ty TNHH Phần mềm Quản trị Khách hàng V-CRM',
    vendorMst: '0315897412',
    id_tech: 'TECH-CRM-02',
    techName: 'Nền tảng Quản trị Quan hệ Khách hàng (CRM Omnichannel)',
    pillarId: 'CUSTOMER_EXPERIENCE',
    summary: 'Nền tảng CRM hợp nhất đa kênh Facebook, Zalo, Website, Hotline. Tăng 35% tỷ lệ chốt đơn và giữ chân khách hàng.',
    description: 'V-CRM Omnichannel cung cấp phễu chuyển đổi bán hàng trực quan, tự động phân phối cơ hội kinh doanh cho nhân viên sales theo KPI. Tích hợp AI Chatbot trả lời khách hàng 24/7 và hệ thống chấm điểm khách hàng tiềm năng Lead Scoring. Giúp doanh nghiệp không bỏ sót bất kỳ một tin nhắn hay yêu cầu báo giá nào.',
    priceMin: 18000000,
    priceMax: 65000000,
    priceUnit: 'VND / Năm',
    targetSizes: ['SME'],
    targetDbiLevels: [1, 2, 3],
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    brochurePdfName: 'V-CRM_Omnichannel_Brochure.pdf',
    features: [
      'Gộp toàn bộ tin nhắn Zalo ZNS, Fanpage và Hotline về 1 màn hình',
      'Tự động chăm sóc khách hàng sau bán theo kịch bản',
      'Tích hợp tổng đài ảo VoIP ghi âm cuộc gọi trực tiếp',
      'Báo cáo hiệu suất kinh doanh của từng nhân viên theo thời gian thực'
    ],
    deploymentTime: '1 - 2 tuần',
    status: 'approved',
    views: 980,
    interestCount: 42,
    rating: 4.9,
    reviewCount: 31,
    createdAt: '2026-02-20'
  },
  {
    id: 'LISTING-003',
    vendorId: 'VEND-003',
    vendorName: 'Công ty Cổ phần Công nghệ An ninh Mạng CyberSafe VN',
    vendorMst: '0108963254',
    id_tech: 'TECH-SEC-06',
    techName: 'Giải pháp An toàn Thông tin & Phòng chống Ransomware (EDR/SIEM)',
    pillarId: 'DATA_SECURITY',
    summary: 'Giải pháp phòng thủ mã độc tống tiền thế hệ mới, sao lưu bất biến và hỗ trợ tuân thủ Nghị định 13/2023/NĐ-CP.',
    description: 'CyberShield EDR bảo vệ toàn diện máy chủ và máy trạm nhân viên trước các biến thể virus mã hóa dữ liệu. Hệ thống tự động snapshot dữ liệu dạng bất biến (Immutable Backup) giúp khôi phục dữ liệu nguyên vẹn ngay cả khi xảy ra tấn công nguy hiểm.',
    priceMin: 28000000,
    priceMax: 95000000,
    priceUnit: 'VND / Năm (Gói 50 endpoints)',
    targetSizes: ['SME', 'LARGE'],
    targetDbiLevels: [2, 3, 4, 5],
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
    brochurePdfName: 'CyberShield_Security_Solution.pdf',
    features: [
      'Ngăn chặn Ransomware bằng thuật toán phân tích hành vi AI',
      'Sao lưu bất biến chống xóa và mã hóa dự phòng',
      'Báo cáo tuân thủ an toàn thông tin theo Nghị định 13',
      'Hỗ trợ ứng cứu khẩn cấp 24/7 từ chuyên gia an ninh mạng'
    ],
    deploymentTime: '3 - 5 ngày',
    status: 'approved',
    views: 740,
    interestCount: 19,
    rating: 4.7,
    reviewCount: 15,
    createdAt: '2026-02-22'
  },
  {
    id: 'LISTING-004',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    vendorMst: '0101234567',
    id_tech: 'TECH-BI-07',
    techName: 'Nền tảng Báo cáo Dữ liệu Thông minh (Business Intelligence - BI)',
    pillarId: 'DATA_SECURITY',
    summary: 'Dashboard phân tích chỉ số kinh doanh tức thời, dự báo dòng tiền và quản trị lợi nhuận trên điện thoại.',
    description: 'SmartBI kết nối trực tiếp với cơ sở dữ liệu bán hàng, kế toán và kho bãi hiện có của doanh nghiệp. Biến những bảng số liệu Excel khô khan thành những biểu đồ trực quan, sinh động giúp CEO và các giám đốc chuyên môn nắm bắt sức khỏe công ty mọi lúc mọi nơi.',
    priceMin: 22000000,
    priceMax: 70000000,
    priceUnit: 'VND / Trọn gói triển khai',
    targetSizes: ['SME', 'LARGE'],
    targetDbiLevels: [3, 4, 5],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60',
    features: [
      'Xem báo cáo tài chính, doanh số tức thời qua Mobile App iOS/Android',
      'Cảnh báo tự động qua Zalo/Telegram khi các chỉ số vượt ngưỡng an toàn',
      'Không cần nhân sự IT kỹ thuật chuyên sâu vẫn tự tạo được biểu đồ mới',
      'Độ trễ cập nhật số liệu dưới 5 giây'
    ],
    deploymentTime: '2 - 3 tuần',
    status: 'approved',
    views: 610,
    interestCount: 22,
    rating: 4.8,
    reviewCount: 18,
    createdAt: '2026-02-25'
  },
  {
    id: 'LISTING-005',
    vendorId: 'VEND-004',
    vendorName: 'Công ty Cổ phần Giải pháp Nhân sự Số SmartHR',
    vendorMst: '0107845123',
    id_tech: 'TECH-HRM-03',
    techName: 'Phần mềm Quản lý Nhân sự & e-HRM',
    pillarId: 'PEOPLE_CULTURE',
    summary: 'Chấm công nhận diện khuôn mặt AI, tự động tính lương theo KPI và ký hợp đồng lao động điện tử.',
    description: 'SmartHR là giải pháp chuyển đổi số toàn diện cho phòng nhân sự. Loại bỏ 100% chấm công thủ công và sai sót tính lương. Ứng dụng di động cho phép nhân viên xin nghỉ phép, nhận phiếu lương điện tử và gửi đề xuất cải tiến nội bộ nhanh chóng.',
    priceMin: 15000000,
    priceMax: 55000000,
    priceUnit: 'VND / Năm (Gói đến 150 nhân sự)',
    targetSizes: ['SME'],
    targetDbiLevels: [1, 2, 3],
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    features: [
      'Chấm công GPS & AI FaceID chống gian lận',
      'Tự động hóa tính lương phức tạp theo ca kíp và phụ cấp',
      'Ký hợp đồng lao động điện tử có giá trị pháp lý',
      'Đo lường mức độ gắn kết nhân viên qua khảo sát e-NPS'
    ],
    deploymentTime: '1 - 2 tuần',
    status: 'approved',
    views: 890,
    interestCount: 35,
    rating: 4.8,
    reviewCount: 20,
    createdAt: '2026-03-01'
  },
  {
    id: 'LISTING-006',
    vendorId: 'VEND-005',
    vendorName: 'Công ty Công nghệ CloudViet Systems',
    vendorMst: '0316521489',
    id_tech: 'TECH-WMS-04',
    techName: 'Hệ thống Quản lý Kho thông minh (Smart WMS & Barcode/RFID)',
    pillarId: 'OPERATIONS',
    summary: 'Số hóa quản lý xuất nhập tồn kho bằng QR Barcode và giải pháp chỉ đường lấy hàng thông minh.',
    description: 'Smart WMS giúp doanh nghiệp sản xuất và phân phối loại bỏ hoàn toàn sai lệch tồn kho. Quét mã QR code trên điện thoại hoặc máy quét chuyên dụng, tự động gợi ý vị trí lưu kho tối ưu và cảnh báo hàng cận hạn sử dụng (FIFO/FEFO).',
    priceMin: 35000000,
    priceMax: 120000000,
    priceUnit: 'VND / Trọn gói',
    targetSizes: ['SME', 'LARGE'],
    targetDbiLevels: [2, 3, 4],
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60',
    features: [
      'Kiểm kho nhanh hơn gấp 5 lần so với ghi chép sổ sách thủ công',
      'Cảnh báo tồn kho an toàn và tự động sinh yêu cầu mua hàng',
      'In tem nhãn mã vạch tiêu chuẩn GS1 trực tiếp',
      'Tích hợp sẵn với phần mềm kế toán và bán hàng phổ biến'
    ],
    deploymentTime: '2 - 4 tuần',
    status: 'pending', // Pending approval testing
    views: 45,
    interestCount: 2,
    rating: 0,
    reviewCount: 0,
    createdAt: '2026-03-09'
  }
];

// Sample User Accounts
export const SAMPLE_USERS: UserAccount[] = [
  {
    id: 'USER-BUYER-01',
    email: 'ceo@dongnamphat.vn',
    phone: '0912345678',
    fullName: 'Trần Văn Hùng',
    role: 'BUYER',
    company: {
      companyName: 'Công ty Cổ phần Sản xuất & Thương mại Đông Nam Phát',
      mst: '0108967845',
      industry: 'Sản xuất & Chế biến chế tạo',
      employeeCount: 85,
      size: 'SME',
      province: 'Hà Nội',
      address: 'KCN Bắc Thăng Long, Đông Anh, Hà Nội',
      website: 'https://dongnamphat.vn',
      verifiedTax: true,
      kycStatus: 'approved'
    },
    createdAt: '2026-01-10'
  },
  {
    id: 'USER-VENDOR-01',
    email: 'contact@fasttech.vn',
    phone: '0988776655',
    fullName: 'Lê Minh Tuấn',
    role: 'VENDOR',
    company: {
      companyName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
      mst: '0101234567',
      industry: 'Công nghệ thông tin & Viễn thông',
      employeeCount: 250,
      size: 'LARGE',
      province: 'Hà Nội',
      address: 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội',
      website: 'https://fasttech.vn',
      verifiedTax: true,
      licenseFile: 'Giay_Phep_Kinh_Doanh_FPT_FastTech_2024.pdf',
      intellectualPropertyFile: 'Giay_Chung_Nhan_SHTT_FastTech_ERP_No1892.pdf',
      kycStatus: 'approved',
      submittedAt: '2026-01-15T08:30:00Z'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'USER-VENDOR-02',
    email: 'support@cloudviet.vn',
    phone: '0909112233',
    fullName: 'Nguyễn Thanh Sơn',
    role: 'VENDOR',
    company: {
      companyName: 'Công ty Công nghệ CloudViet Systems',
      mst: '0316521489',
      industry: 'Công nghệ thông tin & Viễn thông',
      employeeCount: 45,
      size: 'SME',
      province: 'TP. Hồ Chí Minh',
      address: 'Tầng 8, Tòa nhà Innovation, Công viên Phần mềm Quang Trung, Q.12, TP.HCM',
      website: 'https://cloudviet.vn',
      verifiedTax: true,
      licenseFile: 'GPKD_CloudViet_Scan.pdf',
      intellectualPropertyFile: 'Dang_Ky_Quyen_Tac_Gia_CloudViet_HRM_2024.pdf',
      kycStatus: 'pending', // SLA > 24h pending review
      submittedAt: '2026-03-08T10:15:00Z'
    },
    createdAt: '2026-03-08'
  },
  {
    id: 'USER-ADMIN-01',
    email: 'admin@dbi-portal.gov.vn',
    phone: '02439876543',
    fullName: 'Vũ Quốc Bảo',
    role: 'ADMIN',
    company: {
      companyName: 'Ban Quản trị Cổng Thông tin DBI Quốc gia',
      mst: '0100109106',
      industry: 'Dịch vụ Chuyên nghiệp & Tư vấn doanh nghiệp',
      employeeCount: 30,
      size: 'SME',
      province: 'Hà Nội'
    },
    createdAt: '2026-01-01'
  }
];

export const GUEST_USER: UserAccount = {
  id: 'USER-GUEST-01',
  email: '',
  phone: '',
  fullName: 'Khách vãng lai',
  role: 'GUEST',
  company: {
    companyName: 'Chưa đăng nhập',
    mst: 'Chưa xác thực',
    industry: 'Khách vãng lai',
    employeeCount: 0,
    size: 'SME',
    province: 'Toàn quốc'
  },
  createdAt: '2026-01-01'
};

// Initial Inquiries and Chats
export const DEFAULT_PLATFORM_PRICING: PlatformPricingConfig = {
  smeLeadUnlockFee: 99000,
  largeLeadUnlockFee: 199000,
  allowOffPlatformTrading: true,
  listingFee: 0,
  commissionRate: 0,
};

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TX-1001',
    type: 'TOPUP',
    amount: 500000,
    description: 'Nạp tiền vào Ví Nền tảng (VietQR / Quà tặng kích hoạt Vendor)',
    timestamp: '2026-03-01 10:00',
    balanceAfter: 500000
  },
  {
    id: 'TX-1002',
    leadId: 'LEAD-001',
    leadTitle: 'Công ty Cổ phần Sản xuất & Thương mại Đông Nam Phát',
    type: 'LEAD_UNLOCK',
    amount: -99000,
    description: 'Phí mở khóa hồ sơ Lead & RFQ #LEAD-001 (DN Cơ khí - SME)',
    timestamp: '2026-03-05 14:22',
    balanceAfter: 401000
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: 'LEAD-001',
    buyerId: 'USER-BUYER-01',
    buyerName: 'Trần Văn Hùng',
    buyerCompany: 'Công ty Cổ phần Sản xuất & Thương mại Đông Nam Phát',
    buyerMst: '0108967845',
    buyerPhone: '0912345678',
    buyerEmail: 'ceo@dongnamphat.vn',
    buyerIndustry: 'Sản xuất & Chế biến chế tạo',
    buyerProvince: 'Hà Nội',
    buyerEmployeeCount: 85,
    buyerSize: 'SME',
    // 2. Hiện trạng số (assessments, pillar_scores)
    buyerDbiScore: 38,
    buyerDbiLevel: 2,
    pillarScores: {
      CUSTOMER_EXPERIENCE: 42,
      STRATEGY: 40,
      INFRASTRUCTURE_TECH: 34,
      OPERATIONS: 26,
      DATA_SECURITY: 22,
      PEOPLE_CULTURE: 48
    },
    // 3. Khoảng trống (3 trụ cột yếu nhất, kèm câu trả lời tương ứng)
    topGaps: [
      {
        pillarId: 'DATA_SECURITY',
        pillarName: 'Dữ liệu & Bảo mật',
        score: 22,
        weaknessSummary: 'Dữ liệu kinh doanh nằm phân tán trên máy tính cá nhân, chưa có phân quyền theo vai trò.',
        assessmentAnswerSnippet: 'Khảo sát Q17: "Dữ liệu lưu phân tán trên USB và file Excel cục bộ, chưa có backup tự động."'
      },
      {
        pillarId: 'OPERATIONS',
        pillarName: 'Vận hành',
        score: 26,
        weaknessSummary: 'Kho vận và điều phối kế hoạch sản xuất gia công cơ khí hoàn toàn quản lý bằng sổ sách và Excel thủ công.',
        assessmentAnswerSnippet: 'Khảo sát Q15: "Chưa ứng dụng phần mềm quản lý phân xưởng, thường xuyên lệch tồn kho thép và phụ liệu."'
      },
      {
        pillarId: 'INFRASTRUCTURE_TECH',
        pillarName: 'Hạ tầng & Công nghệ',
        score: 34,
        weaknessSummary: 'Chưa có kết nối mạng công nghiệp, hạ tầng máy chủ nội bộ cũ kỹ.',
        assessmentAnswerSnippet: 'Khảo sát Q10: "Hạ tầng mạng nội bộ đơn giản, chưa liên thông dữ liệu giữa văn phòng và xưởng."'
      }
    ],
    // 4. Nhu cầu (investment_profiles, rfq)
    interestedTechCategories: ['ERP', 'WMS (Quản lý kho)', 'MES (Sản xuất)'],
    buyerBudget: '100 - 200 triệu VND',
    budgetRange: '100 - 200 triệu VND',
    timeline: 'Quý II/2026 (Trong 30-45 ngày)',
    notes: 'Doanh nghiệp cơ khí 85 nhân sự, gặp vướng mắc lớn ở khâu kiểm soát tồn kho phôi thép và điều phối sản xuất theo ca.',
    // 5. Mức sẵn sàng (investment_profiles: 1-5)
    readiness: {
      personnelScore: 3,
      infrastructureScore: 2,
      leadershipCommitmentScore: 4,
      notes: 'Ban giám đốc cam kết chuyển đổi số quyết liệt; đội ngũ quản đốc cần đào tạo cầm tay chỉ việc.'
    },
    // 6. Độ tươi (assessments)
    assessmentDate: '2026-03-05',
    daysSinceAssessment: 10,
    techListingId: 'LISTING-001',
    techName: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    status: 'contacted',
    createdAt: '2026-03-05 14:20',
    lastMessageAt: '2026-03-06 09:15',
    isUnlocked: true,
    unlockFee: 99000,
    unlockedAt: '2026-03-05 14:22',
    rfqDetails: {
      scopeSummary: 'Triển khai phân hệ Quản lý Kho thông minh WMS và Quản trị Lệnh sản xuất cơ khí theo chuyền, kết nối máy quét mã vạch và cấp dữ liệu kế toán.',
      targetPillars: ['OPERATIONS', 'DATA_SECURITY'],
      expectedDeliveryMonths: 2,
      decisionMakerRole: 'Tổng Giám đốc (CEO)',
      urgency: 'HIGH'
    },
    messages: [
      {
        id: 'MSG-1',
        sender: 'SYSTEM',
        senderName: 'Hệ thống DBI',
        text: 'Doanh nghiệp Đông Nam Phát (DBI Cấp 2 - Điểm 38/100) đã gửi tín hiệu "Quan tâm" tới giải pháp FastERP.',
        timestamp: '05/03 14:20'
      },
      {
        id: 'MSG-2',
        sender: 'BUYER',
        senderName: 'Trần Văn Hùng',
        text: 'Chào đại diện FastTech, doanh nghiệp tôi hiện có 85 nhân sự mảng cơ khí, đang gặp vướng mắc lớn ở khâu kiểm soát tồn kho nguyên vật liệu và tiến độ sản xuất. Gói giải pháp FastERP có thể triển khai trước 2 phân hệ này được không?',
        timestamp: '05/03 14:25'
      },
      {
        id: 'MSG-3',
        sender: 'VENDOR',
        senderName: 'Lê Minh Tuấn (FastTech)',
        text: 'Chào anh Hùng, rất vui được kết nối với Đông Nam Phát. Hoàn toàn khả thi anh nhé! FastERP cho phép triển khai theo giai đoạn mô-đun hóa (Phased Rollout). Anh có thể bắt đầu với phân hệ Quản lý Kho thông minh WMS và Sản xuất trước trong 4 tuần, sau đó mới mở rộng sang Kế toán tài chính.',
        timestamp: '06/03 09:15'
      }
    ]
  },
  {
    id: 'LEAD-002',
    buyerId: 'USER-BUYER-02',
    buyerName: 'Phạm Hoàng Long',
    buyerCompany: 'Công ty TNHH Dược Phẩm Sinh Học Hưng Thịnh',
    buyerMst: '0314892019',
    buyerPhone: '0982554433',
    buyerEmail: 'long.ph@hungthinhpharma.com',
    buyerIndustry: 'Thiết bị y tế & Dược phẩm',
    buyerProvince: 'TP. Hồ Chí Minh',
    buyerEmployeeCount: 120,
    buyerSize: 'SME',
    // 2. Hiện trạng số (assessments, pillar_scores)
    buyerDbiScore: 42,
    buyerDbiLevel: 3,
    pillarScores: {
      CUSTOMER_EXPERIENCE: 50,
      STRATEGY: 45,
      INFRASTRUCTURE_TECH: 40,
      OPERATIONS: 30,
      DATA_SECURITY: 25,
      PEOPLE_CULTURE: 46
    },
    // 3. Khoảng trống (3 trụ cột yếu nhất, kèm câu trả lời tương ứng)
    topGaps: [
      {
        pillarId: 'DATA_SECURITY',
        pillarName: 'Dữ liệu & Bảo mật',
        score: 25,
        weaknessSummary: 'Chưa có nhật ký truy vết (Audit Trail) và mã hóa số liệu công thức dược phẩm theo chuẩn ngành.',
        assessmentAnswerSnippet: 'Khảo sát Q19: "Chỉ bảo vệ bằng mật khẩu Excel, chưa phân quyền vai trò phòng Lab và Kho vật tư."'
      },
      {
        pillarId: 'OPERATIONS',
        pillarName: 'Vận hành',
        score: 30,
        weaknessSummary: 'Quản lý số lô (Lot/Batch) và hạn dùng (Expiry Date) dược liệu phụ thuộc kiểm đếm tay, dễ sai số GMP.',
        assessmentAnswerSnippet: 'Khảo sát Q16: "Quản lý tồn kho theo tháng, chưa truy vết điện tử số lô nguyên liệu đầu vào."'
      },
      {
        pillarId: 'INFRASTRUCTURE_TECH',
        pillarName: 'Hạ tầng & Công nghệ',
        score: 40,
        weaknessSummary: 'Phần mềm kế toán tách rời hoàn toàn với phân xưởng đóng gói và hệ thống mã vạch y tế.',
        assessmentAnswerSnippet: 'Khảo sát Q11: "Đã có server nội bộ nhưng chưa tích hợp API máy in tem 2D DataMatrix."'
      }
    ],
    // 4. Nhu cầu (investment_profiles, rfq)
    interestedTechCategories: ['ERP Dược phẩm', 'Barcode / QR GS1', 'WMS Đạt chuẩn GMP'],
    buyerBudget: '150 - 300 triệu VND',
    budgetRange: '150 - 300 triệu VND',
    timeline: 'Quý II/2026 (Trong 45 ngày)',
    notes: 'Yêu cầu thẩm định phần mềm quản lý kho theo chuẩn GMP-WHO và truy vết số lô hạn dùng điện tử.',
    // 5. Mức sẵn sàng (investment_profiles: 1-5)
    readiness: {
      personnelScore: 4,
      infrastructureScore: 3,
      leadershipCommitmentScore: 5,
      notes: 'Ban lãnh đạo cam kết 100% ngân sách để chuẩn hóa GMP; nhân sự QA/QC có kỹ năng sử dụng máy tính tốt.'
    },
    // 6. Độ tươi (assessments)
    assessmentDate: '2026-03-12',
    daysSinceAssessment: 3,
    techListingId: 'LISTING-001',
    techName: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    status: 'new',
    createdAt: '2026-03-12 10:15',
    lastMessageAt: '2026-03-12 10:15',
    isUnlocked: false,
    unlockFee: 99000,
    rfqDetails: {
      scopeSummary: 'DN sản xuất thiết bị & vật tư y tế cần giải pháp đáp ứng chuẩn GMP, kiểm soát nhập - xuất - hủy theo lô (Batch/Expiry), tích hợp máy quét mã 2D GS1 DataMatrix.',
      targetPillars: ['OPERATIONS', 'DATA_SECURITY', 'CUSTOMER_EXPERIENCE'],
      expectedDeliveryMonths: 3,
      decisionMakerRole: 'Giám đốc Vận hành & Trưởng ban QLCL',
      urgency: 'HIGH'
    },
    messages: [
      {
        id: 'MSG-4',
        sender: 'SYSTEM',
        senderName: 'Hệ thống DBI',
        text: 'Doanh nghiệp Dược phẩm Sinh học Hưng Thịnh đã hoàn thành đánh giá DBI (Cấp 3 - 42đ) và gửi yêu cầu tư vấn gói ERP chuyên ngành.',
        timestamp: '12/03 10:15'
      }
    ]
  },
  {
    id: 'LEAD-003',
    buyerId: 'USER-BUYER-03',
    buyerName: 'Nguyễn Thu Trang',
    buyerCompany: 'Công ty Cổ phần May Xuất Khẩu An Phước Thắng',
    buyerMst: '0106728391',
    buyerPhone: '0934112233',
    buyerEmail: 'trang.nt@anphuocthang.vn',
    buyerIndustry: 'Dệt may & Da giày',
    buyerProvince: 'Nam Định',
    buyerEmployeeCount: 320,
    buyerSize: 'SME',
    // 2. Hiện trạng số (assessments, pillar_scores)
    buyerDbiScore: 35,
    buyerDbiLevel: 2,
    pillarScores: {
      CUSTOMER_EXPERIENCE: 38,
      STRATEGY: 32,
      INFRASTRUCTURE_TECH: 30,
      OPERATIONS: 24,
      DATA_SECURITY: 20,
      PEOPLE_CULTURE: 44
    },
    // 3. Khoảng trống (3 trụ cột yếu nhất, kèm câu trả lời tương ứng)
    topGaps: [
      {
        pillarId: 'DATA_SECURITY',
        pillarName: 'Dữ liệu & Bảo mật',
        score: 20,
        weaknessSummary: 'Hồ sơ thiết kế mẫu vải và đơn hàng đối tác nước ngoài chưa có bảo mật phân quyền phòng ban.',
        assessmentAnswerSnippet: 'Khảo sát Q19: "Nhân viên dùng máy tính cá nhân chia sẻ tài liệu qua Zalo chưa được kiểm soát."'
      },
      {
        pillarId: 'OPERATIONS',
        pillarName: 'Vận hành',
        score: 24,
        weaknessSummary: 'Tiến độ chuyền may cập nhật theo bảng phấn thủ công cuối ca, không phát hiện được nghẽn công đoạn.',
        assessmentAnswerSnippet: 'Khảo sát Q15: "Chỉ ghi chép sản lượng ra bảng phấn, cuối ngày quản đốc mới tổng hợp báo cáo."'
      },
      {
        pillarId: 'INFRASTRUCTURE_TECH',
        pillarName: 'Hạ tầng & Công nghệ',
        score: 30,
        weaknessSummary: 'Đường truyền internet tại các xưởng may vệ tinh chưa ổn định, thiếu thiết bị máy tính bảng đầu chuyền.',
        assessmentAnswerSnippet: 'Khảo sát Q10: "Mạng nội bộ yếu tại các khu vực cắt vải và hoàn thiện đơn hàng."'
      }
    ],
    // 4. Nhu cầu (investment_profiles, rfq)
    interestedTechCategories: ['ERP May mặc', 'Theo dõi chuyền Realtime', 'Quản lý phụ liệu'],
    buyerBudget: '200 - 350 triệu VND',
    budgetRange: '200 - 350 triệu VND',
    timeline: 'Quý III/2026 (Trong 60 ngày)',
    notes: 'Doanh nghiệp may FOB 3 xưởng tại Nam Định, muốn số hóa quy trình theo dõi chuyền may, kiểm kê phụ liệu nút chỉ.',
    // 5. Mức sẵn sàng (investment_profiles: 1-5)
    readiness: {
      personnelScore: 3,
      infrastructureScore: 2,
      leadershipCommitmentScore: 4,
      notes: 'Lãnh đạo ủng hộ chuyển đổi số để đáp ứng kiểm toán của khách hàng Mỹ; công nhân cần giao diện cực kỳ đơn giản.'
    },
    // 6. Độ tươi (assessments)
    assessmentDate: '2026-03-10',
    daysSinceAssessment: 5,
    techListingId: 'LISTING-001',
    techName: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    status: 'new',
    createdAt: '2026-03-10 14:30',
    lastMessageAt: '2026-03-10 14:30',
    isUnlocked: false,
    unlockFee: 99000,
    rfqDetails: {
      scopeSummary: 'Số hóa quản lý tiến độ gia công may xuất khẩu theo từng Style đơn hàng, cảnh báo rủi ro trễ tiến độ xuất cảng và tính toán định mức vải vụn thừa.',
      targetPillars: ['OPERATIONS', 'STRATEGY'],
      expectedDeliveryMonths: 3,
      decisionMakerRole: 'Phó Tổng Giám đốc Sản xuất',
      urgency: 'MEDIUM'
    },
    messages: [
      {
        id: 'MSG-6',
        sender: 'SYSTEM',
        senderName: 'Hệ thống DBI',
        text: 'Doanh nghiệp May XK An Phước Thắng đã gửi yêu cầu kết nối gói ERP Sản xuất.',
        timestamp: '10/03 14:30'
      }
    ]
  },
  {
    id: 'LEAD-004',
    buyerId: 'USER-BUYER-04',
    buyerName: 'Đỗ Thành Nam',
    buyerCompany: 'Tập đoàn Nhựa & Bao bì Công nghiệp Tân Á Đông',
    buyerMst: '0300998877',
    buyerPhone: '0909887766',
    buyerEmail: 'nam.do@tanadonggroup.vn',
    buyerIndustry: 'Bao bì & Nhựa công nghiệp',
    buyerProvince: 'Bình Dương',
    buyerEmployeeCount: 1450,
    buyerSize: 'LARGE',
    // 2. Hiện trạng số (assessments, pillar_scores)
    buyerDbiScore: 58,
    buyerDbiLevel: 3,
    pillarScores: {
      CUSTOMER_EXPERIENCE: 65,
      STRATEGY: 62,
      INFRASTRUCTURE_TECH: 55,
      OPERATIONS: 48,
      DATA_SECURITY: 42,
      PEOPLE_CULTURE: 60
    },
    // 3. Khoảng trống (3 trụ cột yếu nhất, kèm câu trả lời tương ứng)
    topGaps: [
      {
        pillarId: 'DATA_SECURITY',
        pillarName: 'Dữ liệu & Bảo mật',
        score: 42,
        weaknessSummary: 'Chưa có kiến trúc Data Warehouse hợp nhất 4 cụm nhà máy và rà soát an toàn thông tin theo ISO 27001.',
        assessmentAnswerSnippet: 'Khảo sát Q18: "Báo cáo tài chính hợp nhất mất 12 ngày sau kết thúc tháng; dữ liệu OT nhà máy chưa kết nối IT."'
      },
      {
        pillarId: 'OPERATIONS',
        pillarName: 'Vận hành',
        score: 48,
        weaknessSummary: 'Dây chuyền thổi màng nhựa chưa thu thập tín hiệu IoT/SCADA tự động về phần mềm ERP để tính giá thành tức thời.',
        assessmentAnswerSnippet: 'Khảo sát Q16: "Hao hụt hạt nhựa tái sinh chưa tính toán được theo thời gian thực từng mẻ đùn."'
      },
      {
        pillarId: 'INFRASTRUCTURE_TECH',
        pillarName: 'Hạ tầng & Công nghệ',
        score: 55,
        weaknessSummary: 'Hạ tầng mạng công nghiệp cáp quang giữa các phân xưởng chưa đồng bộ, còn nghẽn băng thông truyền tải video AI camera.',
        assessmentAnswerSnippet: 'Khảo sát Q12: "Chưa triển khai kiến trúc Hybrid Cloud đồng bộ giữa trung tâm dữ liệu và các cụm nhà máy."'
      }
    ],
    // 4. Nhu cầu (investment_profiles, rfq)
    interestedTechCategories: ['ERP Doanh nghiệp Lớn', 'SCADA / IoT Công nghiệp', 'Kho tự động WMS'],
    buyerBudget: '600 triệu - 1.2 tỷ VND',
    budgetRange: '600 triệu - 1.2 tỷ VND',
    timeline: 'Quý II - Quý III/2026',
    notes: 'Tập đoàn 4 nhà máy, cần tích hợp SCADA dây chuyền thổi màng nhựa với ERP và dự báo tồn kho hạt nhựa tái sinh.',
    // 5. Mức sẵn sàng (investment_profiles: 1-5)
    readiness: {
      personnelScore: 4,
      infrastructureScore: 4,
      leadershipCommitmentScore: 5,
      notes: 'Ban HĐQT đã phê duyệt ngân sách chuyển đổi số cấp Tập đoàn; có phòng ban IT 15 kỹ sư chuyên trách.'
    },
    // 6. Độ tươi (assessments)
    assessmentDate: '2026-03-14',
    daysSinceAssessment: 1,
    techListingId: 'LISTING-001',
    techName: 'Hệ thống Quản trị Doanh nghiệp Tổng thể (ERP)',
    vendorId: 'VEND-001',
    vendorName: 'Công ty Cổ phần Giải pháp Số FPT FastTech',
    status: 'new',
    createdAt: '2026-03-14 08:45',
    lastMessageAt: '2026-03-14 08:45',
    isUnlocked: false,
    unlockFee: 199000,
    rfqDetails: {
      scopeSummary: 'Dự án Chuyển đổi số cấp Tập đoàn: Nâng cấp hạ tầng ERP kết nối SCADA/IoT công nghiệp thu thập dữ liệu máy ép, tự động hóa tính giá thành kế toán sản phẩm.',
      targetPillars: ['OPERATIONS', 'DATA_SECURITY', 'STRATEGY', 'CUSTOMER_EXPERIENCE'],
      expectedDeliveryMonths: 6,
      decisionMakerRole: 'Giám đốc Chuyển đổi số (CDO) & Ban HĐQT',
      urgency: 'HIGH'
    },
    messages: [
      {
        id: 'MSG-8',
        sender: 'SYSTEM',
        senderName: 'Hệ thống DBI',
        text: 'Tập đoàn Tân Á Đông (Doanh nghiệp lớn - 1.450 nhân sự) đã phát hành RFQ chính thức cho phân hệ ERP Sản xuất & Kho thông minh.',
        timestamp: '14/03 08:45'
      }
    ]
  }
];

// Default Matching Weights (must sum to 1.0)
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  dbiGapWeight: 0.40,
  budgetWeight: 0.30,
  industryWeight: 0.15,
  sizeWeight: 0.15,
  industryFitWeight: 0.15,
  budgetFitWeight: 0.30,
  companySizeFitWeight: 0.15,
  vendorReputationWeight: 0.10,
  readinessWeight: 0.05
};

// Initial Sample Assessment Result for quick testing
export const SAMPLE_ASSESSMENT_RESULT: AssessmentResultData = {
  id: 'ASSESS-SAMPLE-2026',
  userId: 'USER-BUYER-01',
  companyName: 'Công ty Cổ phần Sản xuất & Thương mại Đông Nam Phát',
  industry: 'Sản xuất & Chế biến chế tạo',
  date: '2026-03-05',
  totalScore: 42,
  level: 3,
  levelTitle: 'Đã thiết lập / Quản lý cơ bản',
  pillarScores: {
    CUSTOMER_EXPERIENCE: 48,
    STRATEGY: 45,
    INFRASTRUCTURE_TECH: 35,
    OPERATIONS: 32,
    DATA_SECURITY: 28,
    PEOPLE_CULTURE: 52
  },
  industryAvgScores: {
    CUSTOMER_EXPERIENCE: 42,
    STRATEGY: 38,
    INFRASTRUCTURE_TECH: 40,
    OPERATIONS: 45,
    DATA_SECURITY: 36,
    PEOPLE_CULTURE: 39
  },
  industryAvgTotal: 40,
  answers: [],
  gaps: [
    {
      pillar: 'Dữ liệu & Bảo mật',
      score: 28,
      issue: 'Dữ liệu kinh doanh lưu trữ phân tán, chưa có cơ chế phòng thủ mã độc ransomware và sao lưu bất biến.',
      recommendation: 'Ưu tiên triển khai giải pháp sao lưu đám mây tự động 3-2-1 và rà soát tuân thủ Nghị định 13/2023/NĐ-CP.',
      priority: 'HIGH'
    },
    {
      pillar: 'Vận hành',
      score: 32,
      issue: 'Quản lý kho và điều phối đơn hàng sản xuất còn phụ thuộc vào bảng tính Excel, tỷ lệ sai lệch tồn kho còn cao.',
      recommendation: 'Triển khai phần mềm Quản lý Kho thông minh WMS sử dụng mã QR Barcode và kết nối với kế toán.',
      priority: 'HIGH'
    },
    {
      pillar: 'Hạ tầng & Công nghệ',
      score: 35,
      issue: 'Hệ thống ứng dụng rời rạc, chưa có liên thông dữ liệu tự động qua API giữa bán hàng và xưởng.',
      recommendation: 'Đưa các phần mềm nghiệp vụ cốt lõi lên Cloud và xây dựng cổng API kết nối dữ liệu dùng chung.',
      priority: 'MEDIUM'
    }
  ],
  aiSummary: 'Doanh nghiệp Đông Nam Phát đang ở giai đoạn Cấp độ 3 (Điểm tổng thể: 42/100). Ban lãnh đạo đã có định hướng chuyển đổi số rõ ràng và văn hóa nhân viên cởi mở tiếp nhận công nghệ mới (Điểm Con người & Văn hóa đạt 52/100, cao hơn 13% so với trung bình ngành). Tuy nhiên, "điểm nghẽn" cốt tử nằm ở trụ cột Dữ liệu & Bảo mật (28/100) và Vận hành (32/100). Doanh nghiệp cần khẩn trương đầu tư số hóa khâu quản lý kho hàng và thiết lập lá chắn an toàn thông tin trước khi mở rộng kinh doanh quy mô lớn.'
};
