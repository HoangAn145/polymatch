import { PillarId, AssessmentQuestion } from '../types';

export interface SmeCoreQuestionItem {
  stt: number;
  subCode: string | null;
  question: string;
  pillarId: PillarId;
  answerOptionsScaled: Array<{ level: number; text: string }> | null;
  answerOptionsChoice: string[] | null;
  isScored: boolean;
  scoringMethod: string;
}

export interface IndustryBlock {
  question: string;
  label: string;
  options: string[];
}

export interface SmeIndustryItem {
  stt: number;
  industry: string;
  blocks: IndustryBlock[];
  digitalSolutionsScoring: {
    maxScoreRaw: number;
    formula: string;
    note?: string;
  };
}

export const SME_CORE_QUESTIONS: SmeCoreQuestionItem[] = [
  {
    stt: 1,
    subCode: null,
    question: "Doanh nghiệp Anh/Chị hiện có bao nhiêu người?",
    pillarId: "PEOPLE_CULTURE",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Dưới 10 người",
      "10-49 người",
      "50-199 người",
      "Từ 200 người trở lên"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng để phân loại quy mô doanh nghiệp"
  },
  {
    stt: 2,
    subCode: null,
    question: "Doanh thu năm gần nhất của doanh nghiệp Anh/Chị khoảng bao nhiêu (tỷ VNĐ)?",
    pillarId: "STRATEGY",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Dưới 2 tỷ VNĐ",
      "2-dưới 5 tỷ VNĐ",
      "5-10 tỷ",
      "Trên 10 tỷ"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng để phân loại quy mô tài chính"
  },
  {
    stt: 3,
    subCode: null,
    question: "Doanh nghiệp áp dụng ảo hóa, IoT, tự động hóa và điện toán đám mây ở mức nào?",
    pillarId: "INFRASTRUCTURE_TECH",
    answerOptionsScaled: [
      { level: 1, text: "Ảo hóa/IoT/Cloud chưa sử dụng hoặc theo sự vụ" },
      { level: 2, text: "Một số bộ phận sử dụng ảo hóa, kết nối không dây, IoT" },
      { level: 3, text: "Nhiều bộ phận sử dụng, hạ tầng đáp ứng nhu cầu cơ bản" },
      { level: 4, text: "Sử dụng hiệu quả toàn DN, có quản lý hạ tầng tích hợp" },
      { level: 5, text: "Sử dụng hiệu quả trong toàn hệ sinh thái" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 4,
    subCode: null,
    question: "Doanh nghiệp ra quyết định dựa trên dữ liệu và khai thác giá trị kinh tế từ dữ liệu không?",
    pillarId: "DATA_SECURITY",
    answerOptionsScaled: [
      { level: 1, text: "Quyết định hiếm khi dựa trên dữ liệu, chưa tạo ra giá trị đo lường được" },
      { level: 2, text: "Một số bộ phận ra quyết định dựa trên dữ liệu, tạo ra một số giá trị" },
      { level: 3, text: "Hầu hết quyết định dựa trên dữ liệu cấp bộ phận, giá trị đáng kể" },
      { level: 4, text: "Toàn DN ra quyết định dựa trên dữ liệu, tối ưu hóa giá trị kinh tế" },
      { level: 5, text: "Ra quyết định dựa trên dữ liệu từ toàn hệ sinh thái, tối đa hóa giá trị" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 5,
    subCode: null,
    question: "Doanh nghiệp đảm bảo an toàn thông tin theo cấp độ và phát hiện xâm nhập ở mức nào?",
    pillarId: "DATA_SECURITY",
    answerOptionsScaled: [
      { level: 1, text: "Phê duyệt 80% hồ sơ đề xuất cấp độ cho HTTT" },
      { level: 2, text: "Phê duyệt 100%, triển khai bảo đảm cho 50% hệ thống" },
      { level: 3, text: "100% hệ thống được phê duyệt và triển khai bảo đảm an toàn theo cấp độ" },
      { level: 4, text: "Định kỳ kiểm tra, đánh giá 100% hệ thống theo quy định pháp luật" },
      { level: 5, text: "100% hệ thống được giám sát, bảo vệ chuyên nghiệp liên tục" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 6,
    subCode: null,
    question: "Doanh nghiệp đang cá nhân hóa trải nghiệm và tương tác với khách hàng ở mức độ nào?",
    pillarId: "CUSTOMER_EXPERIENCE",
    answerOptionsScaled: [
      { level: 1, text: "Chưa có/chỉ có rất ít cá nhân hóa, tương tác rời rạc" },
      { level: 2, text: "Một số khía cạnh được cá nhân hóa tại một số bộ phận" },
      { level: 3, text: "Cá nhân hóa tại nhiều bộ phận, có tiếp thị mục tiêu cơ bản" },
      { level: 4, text: "Toàn bộ khía cạnh trải nghiệm KH được cá nhân hóa xuyên suốt toàn DN" },
      { level: 5, text: "Cá nhân hóa toàn diện, tích hợp với các đối tác trong hệ sinh thái" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 7,
    subCode: null,
    question: "Anh/Chị tự đánh giá sự thâm nhập của công nghệ số vào doanh nghiệp mình đang ở mức độ nào?",
    pillarId: "INFRASTRUCTURE_TECH",
    answerOptionsScaled: [
      { level: 1, text: "Không" },
      { level: 2, text: "Thấp" },
      { level: 3, text: "Trung bình" },
      { level: 4, text: "Cao" },
      { level: 5, text: "Hoàn toàn" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Phân bổ vào nhóm CN-1 đến CN-5 theo TOPSIS (Thang 0-4)"
  },
  {
    stt: 8,
    subCode: null,
    question: "Doanh nghiệp có chiến lược chuyển đổi số rõ ràng, được đồng bộ và quản trị thực thi không?",
    pillarId: "STRATEGY",
    answerOptionsScaled: [
      { level: 1, text: "DN chưa có tầm nhìn hoặc chiến lược rõ ràng" },
      { level: 2, text: "DN có tầm nhìn và đang bắt đầu phát triển chiến lược" },
      { level: 3, text: "Có chiến lược rõ ràng, phù hợp với tầm nhìn, đang được triển khai" },
      { level: 4, text: "Chiến lược được tối ưu hóa, đồng bộ giữa các bộ phận và có quản trị rủi ro" },
      { level: 5, text: "Chiến lược chuyển đổi số thống nhất và được chấp nhận trong toàn hệ sinh thái" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 9,
    subCode: null,
    question: "Doanh nghiệp có ngân sách và đo lường hiệu quả đầu tư cho chuyển đổi số không?",
    pillarId: "STRATEGY",
    answerOptionsScaled: [
      { level: 1, text: "Chưa có ngân sách riêng cho chuyển đổi số" },
      { level: 2, text: "Ngân sách sẵn có và linh hoạt tại một số bộ phận" },
      { level: 3, text: "Ngân sách có tại hầu hết các bộ phận, bắt đầu có KPI đánh giá" },
      { level: 4, text: "Ngân sách luôn sẵn sàng và linh hoạt trong toàn DN, có cải tiến dựa trên kết quả" },
      { level: 5, text: "Ngân sách được chia sẻ và sẵn sàng trong toàn hệ sinh thái" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — Mức 1 = 0 điểm; mỗi mức cao hơn +1 điểm (Thang 0-4)"
  },
  {
    stt: 10,
    subCode: null,
    question: "Rào cản lớn nhất khi chuyển đổi số tại doanh nghiệp Anh/Chị là gì?",
    pillarId: "STRATEGY",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Thiếu ngân sách",
      "Thiếu kiến thức/kỹ năng",
      "Thiếu nhân lực",
      "Không thấy cần thiết",
      "Không có hỗ trợ từ bên ngoài",
      "Không tìm được đối tác phù hợp",
      "Khác"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng cho hoạch định chính sách hỗ trợ"
  },
  {
    stt: 11,
    subCode: null,
    question: "Anh/Chị cần hỗ trợ gì để thúc đẩy quá trình chuyển đổi số?",
    pillarId: "PEOPLE_CULTURE",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Đào tạo kỹ năng",
      "Tư vấn giải pháp",
      "Hỗ trợ tài chính",
      "Cung cấp công cụ/phần mềm miễn phí",
      "Kết nối với chuyên gia/đối tác công nghệ"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng cho hoạch định chính sách hỗ trợ"
  },
  {
    stt: 12,
    subCode: null,
    question: "Anh/Chị có sẵn sàng đầu tư vào công nghệ số trong 12 tháng tới không?",
    pillarId: "STRATEGY",
    answerOptionsScaled: null,
    answerOptionsChoice: ["Có", "Không", "Còn phân vân"],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng tham khảo"
  },
  {
    stt: 13,
    subCode: null,
    question: "Doanh nghiệp có từng nhận hỗ trợ từ các chương trình quốc gia hoặc hiệp hội (nếu có)?",
    pillarId: "STRATEGY",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Không",
      "Có nghe nhưng chưa tham gia",
      "Đã từng nộp đăng ký",
      "Đang tham gia chương trình hỗ trợ (ví dụ: RDX, SMEdx...)"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng tham khảo"
  },
  {
    stt: 14,
    subCode: null,
    question: "Mục tiêu chính khi chuyển đổi số của doanh nghiệp Anh/Chị là gì?",
    pillarId: "OPERATIONS",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Tăng doanh thu",
      "Tối ưu chi phí",
      "Nâng cao hiệu quả nhân viên",
      "Tăng trải nghiệm khách hàng",
      "Mở rộng thị trường",
      "Đổi mới sản phẩm/dịch vụ"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng tham khảo"
  },
  {
    stt: 15,
    subCode: null,
    question: "Những nỗ lực chuyển đổi số trước đây của Anh/Chị có hiệu quả không?",
    pillarId: "OPERATIONS",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Không thành công",
      "Rất ít hiệu quả",
      "Tạm ổn",
      "Tương đối thành công",
      "Rất thành công"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ dùng tham khảo"
  },
  {
    stt: 16,
    subCode: null,
    question: "Anh/Chị có muốn chia sẻ thêm kinh nghiệm, mong muốn, hoặc khó khăn trong quá trình chuyển đổi số không?",
    pillarId: "PEOPLE_CULTURE",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Vướng mắc về chi phí đầu tư ban đầu",
      "Nhân sự chưa quen sử dụng phần mềm mới",
      "Lo ngại an toàn bảo mật dữ liệu",
      "Cần nhà cung cấp đồng hành hướng dẫn đào tạo tận nơi",
      "Đang tìm giải pháp trọn gói đồng bộ"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — chỉ thu thập thông tin định tính"
  },
  {
    stt: 17,
    subCode: null,
    question: "Phân ngành hẹp hoạt động của doanh nghiệp:",
    pillarId: "OPERATIONS",
    answerOptionsScaled: null,
    answerOptionsChoice: [
      "Thương mại / Phân phối hàng hóa",
      "Gia công, sản xuất trực tiếp",
      "Dịch vụ và giải pháp kỹ thuật",
      "Vận tải, Logistics, Kho vận",
      "Mô hình tích hợp hoặc lĩnh vực khác"
    ],
    isScored: false,
    scoringMethod: "Không tính điểm — dùng để phân loại chi tiết ngành"
  },
  {
    stt: 18,
    subCode: "7.2",
    question: "Các giải pháp số doanh nghiệp hiện đang thực tế sử dụng (Mục 7.2 theo ngành)",
    pillarId: "OPERATIONS",
    answerOptionsScaled: [
      { level: 1, text: "Đang dùng dưới 20% các công cụ số cơ bản của ngành" },
      { level: 2, text: "Đã ứng dụng 20% - 40% danh mục giải pháp số ngành" },
      { level: 3, text: "Đã ứng dụng 40% - 60% danh mục giải pháp số ngành" },
      { level: 4, text: "Đã ứng dụng 60% - 80% danh mục giải pháp số ngành" },
      { level: 5, text: "Đã ứng dụng trên 80% toàn bộ danh mục giải pháp số ngành" }
    ],
    answerOptionsChoice: null,
    isScored: true,
    scoringMethod: "Có tính điểm — (Tổng điểm đạt được / Tổng điểm tối đa của ngành) × 100%"
  }
];

// Danh mục giải pháp mẫu theo ngành tiêu biểu (25 ngành)
export const SME_INDUSTRIES_SOLUTIONS: Record<string, { maxScoreRaw: number; solutions: string[] }> = {
  "Bán lẻ": {
    maxScoreRaw: 20.83,
    solutions: [
      "Máy POS", "Máy quét mã", "Máy in hóa đơn", "Thanh toán không dùng tiền mặt",
      "Website đặt hàng", "Quản lý tồn kho", "Hệ thống quản lý đơn hàng (OMS)",
      "Phần mềm quản lý chuỗi cửa hàng", "Quản lý kho thời gian thực", "Quản lý khách hàng (CRM)",
      "Phần mềm kế toán kết nối POS", "HRM bán lẻ", "Dashboard phân tích kinh doanh",
      "Bán hàng đa kênh (omnichannel)", "Marketing automation", "Loyalty đa nền tảng",
      "Chatbot bán hàng tự động", "Đề xuất sản phẩm AI", "Hệ thống đánh giá khách hàng"
    ]
  },
  "Thực phẩm và Đồ uống (F&B)": {
    maxScoreRaw: 28.0,
    solutions: [
      "Phần mềm bán hàng (POS)", "Thanh toán online (QR/ví/ngân hàng)", "Đặt món online qua app/web",
      "Đặt bàn tự động", "Quản lý vận chuyển/giao đồ ăn", "Tự động đặt món & thanh toán tại bàn",
      "Quản lý kho nguyên liệu", "Quản lý thiết bị bếp IoT", "Bếp trên mây (cloud kitchen)",
      "Quản lý chuỗi F&B", "HACCP checklist số", "Đồng bộ giao hàng", "Quản lý ca làm việc",
      "Dashboard thời gian thực", "Phân tích số liệu kinh doanh", "Phân tích hành vi khách hàng",
      "Dự báo kinh doanh bằng AI", "Chatbot chăm sóc khách hàng", "Thẻ thành viên điện tử",
      "Tự động gửi voucher ưu đãi", "Loyalty đa nền tảng"
    ]
  },
  "Logistics": {
    maxScoreRaw: 20.83,
    solutions: [
      "Quản lý kho (WMS)", "Quản lý vận tải (TMS)", "Quản lý đơn hàng (OMS)",
      "WMS-TMS-OMS tích hợp", "Auto-planning điều phối tự động", "Quản lý phân phối (DMS)",
      "Tối ưu định tuyến xe", "Theo dõi GPS, RFID", "Cảnh báo trễ giao hàng (ETA)",
      "Control Tower chuỗi cung ứng", "Kết nối sàn giao vận", "Quản lý tài xế, định mức nhiên liệu",
      "Bán hàng đa kênh tích hợp logistics", "BI & AI phân tích dữ liệu logistics"
    ]
  },
  "Du lịch - Lữ hành": {
    maxScoreRaw: 21.0,
    solutions: [
      "Booking tour trực tuyến", "Ứng dụng OTA", "Quản lý lịch trình tour",
      "Vé điện tử", "Mobile app hỗ trợ khách tour", "Điều phối xe tour",
      "Phần mềm quản lý lữ hành tổng thể", "Thanh toán điện tử", "Báo cáo doanh thu tour",
      "CRM du lịch", "Email marketing tour", "Chatbot tư vấn tour",
      "Loyalty khách hàng thân thiết", "Phân tích xu hướng thị trường du lịch"
    ]
  },
  "Sắt thép": {
    maxScoreRaw: 14.0,
    solutions: [
      "Quản lý kho bằng mã vạch", "Đặt hàng qua web/app", "Thanh toán không dùng tiền mặt",
      "Kết nối trạm cân điện tử", "Thiết bị handheld", "Tra cứu xuất xứ sản phẩm",
      "Email doanh nghiệp", "Website", "Phần mềm kế toán", "CRM khách hàng",
      "Quảng cáo số", "Chatbot", "Dự báo kinh doanh tự động"
    ]
  },
  "Xây dựng": {
    maxScoreRaw: 22.0,
    solutions: [
      "CDE môi trường dữ liệu dùng chung", "Quản lý bản vẽ, hồ sơ online",
      "Phần mềm lập kế hoạch thi công", "Mô hình BIM 2D/3D", "BIM Hub",
      "Quản lý công trường, nhật ký số", "Quản lý an toàn lao động", "Quản lý thầu phụ & vật tư",
      "Camera AI giám sát an toàn", "IoT trạm trộn và cẩu tháp", "Quản lý hợp đồng & đấu thầu",
      "Lập dự toán điện tử", "Báo cáo thời gian thực", "Nghiệm thu thanh toán theo tiến độ"
    ]
  }
};

// Chuyển đổi thành AssessmentQuestion[]
export const SME_ASSESSMENT_QUESTIONS_1567: AssessmentQuestion[] = SME_CORE_QUESTIONS.map(q => {
  let options: Array<{ text: string; score: number; description?: string }> = [];

  if (q.answerOptionsScaled) {
    options = q.answerOptionsScaled.map(opt => ({
      text: opt.text,
      score: opt.level,
      description: q.isScored ? `Mức ${opt.level} (${opt.level - 1} điểm thô)` : 'Phân loại'
    }));
  } else if (q.answerOptionsChoice) {
    options = q.answerOptionsChoice.map((choice, idx) => ({
      text: choice,
      score: idx + 1,
      description: q.isScored ? `${idx + 1} điểm` : 'Phân loại / Khảo sát'
    }));
  }

  return {
    id: `SME_Q${q.stt < 10 ? '0' + q.stt : q.stt}`,
    pillarId: q.pillarId,
    questionNumber: q.stt,
    title: `Câu ${q.stt}: ${q.question}`,
    context: ` • ${q.scoringMethod}`,
    weight: q.isScored ? 1 / 7 : 0,
    targetSize: 'SME',
    options
  };
});
