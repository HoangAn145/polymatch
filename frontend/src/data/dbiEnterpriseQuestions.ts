import { PillarId, AssessmentQuestion } from '../types';

export interface EnterpriseQuestionItem {
  stt: number;
  code: string;
  pillar: string;
  pillarId: PillarId;
  criteriaGroup: string;
  question: string;
  mergedSubCriteria: string[];
  answerOptions: Array<{ level: number; text: string }>;
  followUpQuestions?: Array<{ trigger: string; code: string; question: string; options: string[] }>;
  mergeReason: string;
  reference: string;
}

export const ENTERPRISE_DBI_QUESTIONS: EnterpriseQuestionItem[] = [
  {
    stt: 1,
    code: "KH-1",
    pillar: "Khách hàng",
    pillarId: "CUSTOMER_EXPERIENCE",
    criteriaGroup: "1.1 Góc nhìn của KH đối với SP/DV",
    question: "Doanh nghiệp đang cá nhân hóa trải nghiệm và tương tác với khách hàng ở mức độ nào?",
    mergedSubCriteria: [
      "1.1.1 Cá nhân hóa trải nghiệm",
      "1.1.2 Tiếp thị mục tiêu",
      "1.1.3 Tự tùy chỉnh",
      "1.1.4 Dễ sử dụng",
      "1.1.5 Mức độ hứng thú",
      "1.1.6 Tương tác số",
      "1.1.7 Chủ động chăm sóc",
      "1.1.8 Gắn kết xã hội",
      "1.1.9 Thúc đẩy trung thành"
    ],
    answerOptions: [
      { level: 1, text: "Chưa có/chỉ có rất ít cá nhân hóa, tương tác rời rạc" },
      { level: 2, text: "Một số khía cạnh được cá nhân hóa tại một số bộ phận" },
      { level: 3, text: "Cá nhân hóa tại nhiều bộ phận, có tiếp thị mục tiêu cơ bản" },
      { level: 4, text: "Toàn bộ khía cạnh trải nghiệm KH được cá nhân hóa xuyên suốt toàn DN" },
      { level: 5, text: "Cá nhân hóa toàn diện, tích hợp với các đối tác trong hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "KH-1a", question: "Tỷ lệ % bộ phận đã áp dụng cá nhân hóa?", options: ["<30%", "30–70%", ">70%"] },
      { trigger: "Khi Mức 3", code: "KH-1b", question: "Doanh nghiệp đang cá nhân hóa những khía cạnh nào?", options: ["Tiếp thị", "Sản phẩm", "Dịch vụ", "Giá", "Trải nghiệm đa kênh"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 9 tiêu chí con đều quản trị 'trải nghiệm khách hàng nhìn từ góc độ của khách hàng'.",
    reference: "Phụ lục II, Mục 1.1 Phần B; Phụ lục II Mục 4 Nguyên tắc tính điểm."
  },
  {
    stt: 2,
    code: "KH-2",
    pillar: "Khách hàng",
    pillarId: "CUSTOMER_EXPERIENCE",
    criteriaGroup: "1.2 Quản lý trải nghiệm KH",
    question: "Doanh nghiệp có tầm nhìn, chiến lược và đo lường trải nghiệm khách hàng như thế nào?",
    mergedSubCriteria: [
      "1.2.1 Tầm nhìn về CX",
      "1.2.2 Thiết kế theo định hướng CX",
      "1.2.3 Ngân sách đầu tư cho CX",
      "1.2.4 Phạm vi danh mục SP/DV",
      "1.2.5 Quá trình đăng ký sử dụng",
      "1.2.6 Đa kênh hợp nhất",
      "1.2.7 Đo lường CX",
      "1.2.8 Quản lý hành trình KH"
    ],
    answerOptions: [
      { level: 1, text: "Chưa có tầm nhìn hoặc chiến lược về CX" },
      { level: 2, text: "Một số bộ phận bắt đầu xác định tầm nhìn CX riêng" },
      { level: 3, text: "DN có tầm nhìn CX rõ ràng, được một số bộ phận áp dụng" },
      { level: 4, text: "Tầm nhìn CX chung được áp dụng xuyên suốt toàn DN, có ngân sách đầu tư" },
      { level: 5, text: "Tầm nhìn CX thống nhất giữa DN và các đối tác trong hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "KH-2a", question: "Tỷ lệ % bộ phận đã áp dụng tầm nhìn CX?", options: ["<30%", "30–70%", ">70%"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'trải nghiệm khách hàng nhìn từ góc độ của doanh nghiệp'.",
    reference: "Phụ lục II, Mục 1.2 Phần B; Phụ lục II Mục 2.6.1."
  },
  {
    stt: 3,
    code: "KH-3",
    pillar: "Khách hàng",
    pillarId: "CUSTOMER_EXPERIENCE",
    criteriaGroup: "1.3 Thấu hiểu khách hàng",
    question: "Doanh nghiệp có góc nhìn 360 độ và nguồn dữ liệu tin cậy duy nhất về khách hàng không?",
    mergedSubCriteria: ["1.3.1 Góc nhìn 360°", "1.3.2 Nguồn dữ liệu tin cậy duy nhất", "1.3.3 Nhu cầu của KH"],
    answerOptions: [
      { level: 1, text: "Chưa có góc nhìn 360 độ" },
      { level: 2, text: "Duy trì góc nhìn 360 độ cho một số KH" },
      { level: 3, text: "Duy trì góc nhìn 360 độ cho hầu hết KH" },
      { level: 4, text: "Luôn duy trì góc nhìn 360 độ cho tất cả KH, có nguồn dữ liệu tin cậy duy nhất" },
      { level: 5, text: "Góc nhìn 360 độ được chia sẻ và duy trì trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "KH-3a", question: "Tỷ lệ % khách hàng được duy trì góc nhìn 360°?", options: ["<50%", "50–80%", ">80%"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'dữ liệu và hiểu biết về khách hàng'.",
    reference: "Phụ lục II, Mục 1.3 Phần B."
  },
  {
    stt: 4,
    code: "KH-4",
    pillar: "Khách hàng",
    pillarId: "CUSTOMER_EXPERIENCE",
    criteriaGroup: "1.4 Niềm tin của khách hàng",
    question: "Doanh nghiệp đáp ứng cam kết thương hiệu và xây dựng niềm tin với khách hàng như thế nào?",
    mergedSubCriteria: ["1.4.1 Cam kết thương hiệu", "1.4.2 Xử lý phản ánh KH", "1.4.3 Quyền riêng tư", "1.4.4 Kiểm soát thông tin cá nhân", "1.4.5 Thúc đẩy niềm tin KH"],
    answerOptions: [
      { level: 1, text: "Cam kết thương hiệu hiếm khi đáp ứng được kỳ vọng" },
      { level: 2, text: "Một số bộ phận có liên quan đáp ứng được kỳ vọng" },
      { level: 3, text: "Hầu hết bộ phận đáp ứng được kỳ vọng và có xử lý khiếu nại cơ bản" },
      { level: 4, text: "Toàn DN đáp ứng kỳ vọng, đảm bảo quyền riêng tư và xử lý khiếu nại chuyên nghiệp" },
      { level: 5, text: "Đáp ứng kỳ vọng trong toàn hệ sinh thái, tối đa hóa niềm tin KH" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "KH-4a", question: "Tỷ lệ % bộ phận đáp ứng kỳ vọng KH?", options: ["<50%", "50–80%", ">80%"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 5 tiêu chí con đều quản trị 'niềm tin của khách hàng'.",
    reference: "Phụ lục II, Mục 1.4 Phần B."
  },
  {
    stt: 5,
    code: "CL-1",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.1 Quản lý marketing & thương hiệu",
    question: "Doanh nghiệp có chiến lược thương hiệu số và tiếp thị số nhất quán không?",
    mergedSubCriteria: ["2.1.1 Chiến lược thương hiệu", "2.1.2 Quản trị thương hiệu", "2.1.3 Chỉ số đo lường thương hiệu", "2.1.4 Chiến lược tiếp thị"],
    answerOptions: [
      { level: 1, text: "Chưa có chiến lược thương hiệu số hoặc chỉ theo sự vụ" },
      { level: 2, text: "Chiến lược được hiểu và áp dụng tại một số bộ phận" },
      { level: 3, text: "Chiến lược được hiểu và áp dụng tại hầu hết bộ phận, có đo lường chỉ số" },
      { level: 4, text: "Chiến lược thương hiệu số nhất quán, áp dụng toàn DN" },
      { level: 5, text: "Chiến lược thương hiệu số thống nhất trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-1a", question: "Doanh nghiệp đã thiết lập chỉ số đo lường thương hiệu số chưa?", options: ["Chưa", "Đã thiết lập", "Đã đo lường định kỳ"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 4 tiêu chí con đều quản trị 'thương hiệu số và tiếp thị số'.",
    reference: "Phụ lục II, Mục 2.1 Phần B."
  },
  {
    stt: 6,
    code: "CL-2",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.2 Quản lý hệ sinh thái",
    question: "Doanh nghiệp có chiến lược và thiết kế tham gia hệ sinh thái số không?",
    mergedSubCriteria: ["2.2.1 Hệ sinh thái kinh doanh", "2.2.2 Thiết kế hệ sinh thái", "2.2.3 Lựa chọn đối tác"],
    answerOptions: [
      { level: 1, text: "DN chưa nhận thức được giá trị của việc tham gia hệ sinh thái" },
      { level: 2, text: "DN hiểu một phần về giá trị và vai trò của mình" },
      { level: 3, text: "DN hiểu đầy đủ về giá trị của việc tham gia hệ sinh thái" },
      { level: 4, text: "DN bắt đầu xác định chiến lược và thiết kế hệ sinh thái cụ thể" },
      { level: 5, text: "DN đã xác định chiến lược hệ sinh thái rõ ràng và thiết kế bền vững" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-2a", question: "DN đã xác định chiến lược tham gia hệ sinh thái chưa?", options: ["Chưa", "Đang xây dựng", "Đã có chiến lược"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'hệ sinh thái số'.",
    reference: "Phụ lục II, Mục 2.2 Phần B."
  },
  {
    stt: 7,
    code: "CL-3",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.3 Bảo trợ tài chính",
    question: "Doanh nghiệp có ngân sách và đo lường hiệu quả đầu tư cho chuyển đổi số không?",
    mergedSubCriteria: ["2.3.1 Ngân sách cho CĐS", "2.3.2 Đo lường hiệu quả đầu tư", "2.3.3 Đầu tư cải tiến liên tục"],
    answerOptions: [
      { level: 1, text: "Chưa có ngân sách riêng cho CĐS" },
      { level: 2, text: "Ngân sách sẵn có và linh hoạt tại một số bộ phận" },
      { level: 3, text: "Ngân sách có tại hầu hết các bộ phận, bắt đầu có KPI" },
      { level: 4, text: "Ngân sách luôn sẵn sàng toàn DN, có cải tiến dựa trên kết quả" },
      { level: 5, text: "Ngân sách được chia sẻ và sẵn sàng trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-3a", question: "Tỷ lệ % bộ phận có ngân sách CĐS?", options: ["<50%", "50–80%", ">80%"] },
      { trigger: "Khi Mức 3", code: "CL-3b", question: "KPI đánh giá hiệu quả đầu tư CĐS đã được sử dụng thực tế chưa?", options: ["Chưa", "Đang thử nghiệm", "Đã áp dụng"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'nguồn lực tài chính cho chuyển đổi số'.",
    reference: "Phụ lục II, Mục 2.3 Phần B."
  },
  {
    stt: 8,
    code: "CL-4",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.4 Hiểu biết về thị trường",
    question: "Doanh nghiệp đánh giá xu hướng ngành, nhu cầu KH và mạng lưới giá trị như thế nào?",
    mergedSubCriteria: ["2.4.1 Đánh giá xu hướng ngành", "2.4.2 Đánh giá nhu cầu KH", "2.4.3 Đánh giá mạng lưới giá trị"],
    answerOptions: [
      { level: 1, text: "Đánh giá xu hướng ngành và nhu cầu KH chỉ theo sự vụ" },
      { level: 2, text: "Một số bộ phận phân tích xu hướng và nhu cầu" },
      { level: 3, text: "Hầu hết bộ phận thực hiện phân tích xu hướng và nhu cầu" },
      { level: 4, text: "Toàn DN phân tích và dự đoán xu hướng, nhu cầu, mạng lưới giá trị" },
      { level: 5, text: "Phân tích và dự đoán được thực hiện trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-4a", question: "Tỷ lệ % bộ phận thực hiện phân tích thị trường?", options: ["<50%", "50–80%", ">80%"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'thị trường bên ngoài'.",
    reference: "Phụ lục II, Mục 2.4 Phần B."
  },
  {
    stt: 9,
    code: "CL-5",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.5 Quản lý danh mục SP/DV số",
    question: "Doanh nghiệp có danh mục sản phẩm/dịch vụ số cân đối và lộ trình đổi mới không?",
    mergedSubCriteria: ["2.5.1 Cân đối danh mục", "2.5.2 Lộ trình danh mục", "2.5.3 Đổi mới danh mục"],
    answerOptions: [
      { level: 1, text: "Cân đối danh mục đầu tư SP/DV số chỉ theo sự vụ" },
      { level: 2, text: "Một số bộ phận có danh mục phù hợp một phần với chiến lược" },
      { level: 3, text: "Hầu hết bộ phận có danh mục cân bằng và phù hợp với chiến lược" },
      { level: 4, text: "Toàn DN có danh mục cân bằng và lộ trình đổi mới bài bản" },
      { level: 5, text: "Danh mục và lộ trình được đồng bộ trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-5a", question: "Danh mục SP/DV số đã được đánh giá định kỳ theo chiến lược chưa?", options: ["Chưa", "Định kỳ năm", "Định kỳ quý"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'danh mục sản phẩm/dịch vụ số'.",
    reference: "Phụ lục II, Mục 2.5 Phần B."
  },
  {
    stt: 10,
    code: "CL-6",
    pillar: "Chiến lược",
    pillarId: "STRATEGY",
    criteriaGroup: "2.6 Quản lý chiến lược",
    question: "Doanh nghiệp có chiến lược chuyển đổi số rõ ràng, được đồng bộ và quản trị thực thi không?",
    mergedSubCriteria: ["2.6.1 Chiến lược phù hợp tầm nhìn", "2.6.2 Đồng bộ nhóm KD/kỹ thuật", "2.6.3 Đo lường chỉ số", "2.6.4 Quản lý rủi ro", "2.6.5 Lộ trình chuyển đổi", "2.6.6 Áp dụng chiến lược", "2.6.7 Quản trị chuyển đổi", "2.6.8 Bài học thành công"],
    answerOptions: [
      { level: 1, text: "DN chưa có tầm nhìn hoặc chiến lược rõ ràng" },
      { level: 2, text: "DN có tầm nhìn và đang bắt đầu phát triển chiến lược" },
      { level: 3, text: "Có chiến lược rõ ràng, phù hợp với tầm nhìn, đang được triển khai" },
      { level: 4, text: "Chiến lược được tối ưu hóa, đồng bộ giữa các bộ phận và có quản trị rủi ro" },
      { level: 5, text: "Chiến lược CĐS thống nhất và được chấp nhận trong toàn hệ sinh thái" }
    ],
    followUpQuestions: [
      { trigger: "Khi Mức 3", code: "CL-6a", question: "Chiến lược CĐS đã được phê duyệt ở cấp nào?", options: ["Nội bộ bộ phận", "Ban lãnh đạo", "Hội đồng quản trị"] }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'chiến lược chuyển đổi số'.",
    reference: "Phụ lục II, Mục 2.6 Phần B."
  },
  {
    stt: 11,
    code: "CN-1",
    pillar: "Công nghệ",
    pillarId: "INFRASTRUCTURE_TECH",
    criteriaGroup: "3.1 Quản trị công nghệ",
    question: "Doanh nghiệp có khung quản trị công nghệ và áp dụng tiêu chuẩn ngành không?",
    mergedSubCriteria: ["3.1.1 Khung quản trị CN", "3.1.2 Tiêu chuẩn ngành", "3.1.3 Quản lý môi trường", "3.1.4 Quản lý năng lượng", "3.1.5 Công nghệ mới"],
    answerOptions: [
      { level: 1, text: "Chưa có khung quản trị công nghệ chính thức" },
      { level: 2, text: "Khung quản trị đang được áp dụng ở một số bộ phận" },
      { level: 3, text: "Khung quản trị được áp dụng ở hầu hết bộ phận, có sử dụng tiêu chuẩn ngành" },
      { level: 4, text: "Khung quản trị áp dụng toàn DN, quan tâm đến tác động môi trường và năng lượng" },
      { level: 5, text: "Khung quản trị công nghệ được áp dụng trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 5 tiêu chí con đều quản trị 'quản trị công nghệ'.",
    reference: "Phụ lục II, Mục 3.1 Phần B."
  },
  {
    stt: 12,
    code: "CN-2",
    pillar: "Công nghệ",
    pillarId: "INFRASTRUCTURE_TECH",
    criteriaGroup: "3.2 Kiến trúc CN & ứng dụng",
    question: "Doanh nghiệp áp dụng kiến trúc microservices, API mở và điện toán đám mây ở mức độ nào?",
    mergedSubCriteria: ["3.2.1 Lộ trình CN", "3.2.2 Microservices & SOA", "3.2.3 Mã nguồn mở", "3.2.4 Cấu hình ứng dụng", "3.2.5 Điện toán đám mây", "3.2.6 API", "3.2.7 Kiến trúc CN"],
    answerOptions: [
      { level: 1, text: "Lộ trình công nghệ chưa phù hợp với chiến lược kinh doanh" },
      { level: 2, text: "Kiến trúc hướng dịch vụ bước đầu, microservices tại một số ứng dụng" },
      { level: 3, text: "Microservices đa số ứng dụng, sử dụng API và mã nguồn mở" },
      { level: 4, text: "Kiến trúc tối ưu toàn DN, áp dụng đầy đủ cloud và API mở" },
      { level: 5, text: "Kiến trúc công nghệ tích hợp liền mạch trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 7 tiêu chí con đều quản trị 'kiến trúc công nghệ và ứng dụng'.",
    reference: "Phụ lục II, Mục 3.2 Phần B."
  },
  {
    stt: 13,
    code: "CN-3",
    pillar: "Công nghệ",
    pillarId: "INFRASTRUCTURE_TECH",
    criteriaGroup: "3.3 An toàn thông tin mạng",
    question: "Doanh nghiệp đảm bảo an toàn thông tin theo cấp độ và phát hiện xâm nhập ở mức nào?",
    mergedSubCriteria: ["3.3.1 An toàn HTTT theo cấp độ", "3.3.2 Phát hiện xâm nhập", "3.3.3 An toàn an ninh mạng", "3.3.4 Bảo mật vật lý"],
    answerOptions: [
      { level: 1, text: "Phê duyệt 80% hồ sơ đề xuất cấp độ cho HTTT" },
      { level: 2, text: "Phê duyệt 100%, triển khai bảo đảm cho 50% hệ thống" },
      { level: 3, text: "100% hệ thống được phê duyệt và triển khai bảo đảm an toàn theo cấp độ" },
      { level: 4, text: "Định kỳ kiểm tra, đánh giá 100% hệ thống theo quy định pháp luật" },
      { level: 5, text: "100% hệ thống được giám sát, bảo vệ chuyên nghiệp liên tục" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 4 tiêu chí con đều quản trị 'an toàn thông tin'.",
    reference: "Phụ lục II, Mục 3.3 Phần B."
  },
  {
    stt: 14,
    code: "CN-4",
    pillar: "Công nghệ",
    pillarId: "INFRASTRUCTURE_TECH",
    criteriaGroup: "3.4 Ứng dụng và nền tảng",
    question: "Doanh nghiệp ứng dụng AI, nền tảng dữ liệu lớn và công cụ phát triển ra sao?",
    mergedSubCriteria: ["3.4.1 Trí tuệ nhân tạo", "3.4.2 Nền tảng dữ liệu lớn", "3.4.3 Công cụ phát triển ứng dụng", "3.4.4 Danh mục công cụ"],
    answerOptions: [
      { level: 1, text: "Sử dụng AI, nền tảng dữ liệu lớn theo sự vụ, chưa có kế hoạch" },
      { level: 2, text: "AI được một số bộ phận sử dụng để mang lại giá trị kinh tế" },
      { level: 3, text: "AI được sử dụng trong toàn DN, đã có nền tảng dữ liệu lớn" },
      { level: 4, text: "AI và nền tảng dữ liệu lớn được sử dụng rộng rãi, ngày càng tăng" },
      { level: 5, text: "AI và nền tảng dữ liệu được tích hợp và chia sẻ trong hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 4 tiêu chí con đều quản trị 'ứng dụng và nền tảng công nghệ'.",
    reference: "Phụ lục II, Mục 3.4 Phần B."
  },
  {
    stt: 15,
    code: "CN-5",
    pillar: "Công nghệ",
    pillarId: "INFRASTRUCTURE_TECH",
    criteriaGroup: "3.5 Kết nối và tính toán",
    question: "Doanh nghiệp áp dụng ảo hóa, IoT, tự động hóa và điện toán đám mây ở mức nào?",
    mergedSubCriteria: ["3.5.1 Ảo hóa", "3.5.2 Kết nối không dây", "3.5.3 Giao thức Internet", "3.5.4 IoT", "3.5.5 Quản lý hạ tầng", "3.5.6 Điều phối nguồn lực", "3.5.7 Điện toán đám mây", "3.5.8 Điện toán biên", "3.5.9 Tự động hóa"],
    answerOptions: [
      { level: 1, text: "Ảo hóa, IoT, điện toán đám mây chưa được sử dụng hoặc theo sự vụ" },
      { level: 2, text: "Một số bộ phận áp dụng ảo hóa, kết nối không dây, IoT" },
      { level: 3, text: "Nhiều bộ phận sử dụng, hạ tầng đáp ứng nhu cầu cơ bản" },
      { level: 4, text: "Sử dụng hiệu quả toàn DN, có quản lý hạ tầng tích hợp" },
      { level: 5, text: "Kết nối và tính toán được sử dụng hiệu quả trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 9 tiêu chí con đều quản trị 'hạ tầng kết nối và tính toán'.",
    reference: "Phụ lục II, Mục 3.5 Phần B."
  },
  {
    stt: 16,
    code: "VH-1",
    pillar: "Vận hành",
    pillarId: "OPERATIONS",
    criteriaGroup: "4.1 Quản trị vận hành",
    question: "Mô hình vận hành và quản lý rủi ro hoạt động có phù hợp với chiến lược số không?",
    mergedSubCriteria: ["4.1.1 Mô hình doanh nghiệp", "4.1.2 Quản lý rủi ro hoạt động", "4.1.3 Sự tuân thủ", "4.1.4 Bảo đảm vận hành an toàn"],
    answerOptions: [
      { level: 1, text: "Mô hình vận hành chưa hỗ trợ chiến lược CĐS" },
      { level: 2, text: "Mô hình vận hành đang được xây dựng để phù hợp với chiến lược" },
      { level: 3, text: "Mô hình vận hành phù hợp với chiến lược số, có quản lý rủi ro" },
      { level: 4, text: "Mô hình thể hiện đầy đủ chiến lược số, tuân thủ pháp lý và cải thiện liên tục" },
      { level: 5, text: "Mô hình vận hành thống nhất trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 4 tiêu chí con đều quản trị 'quản trị vận hành'.",
    reference: "Phụ lục II, Mục 4.1 Phần B."
  },
  {
    stt: 17,
    code: "VH-2",
    pillar: "Vận hành",
    pillarId: "OPERATIONS",
    criteriaGroup: "4.2 Thiết kế & đổi mới dịch vụ",
    question: "Doanh nghiệp áp dụng Design Thinking, Agile và đổi mới liên tục dịch vụ không?",
    mergedSubCriteria: ["4.2.1 Đáp ứng yêu cầu KD", "4.2.2 Design Thinking", "4.2.3 Phát triển linh hoạt", "4.2.4 Tối ưu hóa quy trình", "4.2.5 Đổi mới liên tục", "4.2.6 Hợp tác đối tác"],
    answerOptions: [
      { level: 1, text: "Chưa áp dụng Design Thinking hoặc Agile" },
      { level: 2, text: "Design Thinking và Agile được áp dụng tại một số bộ phận" },
      { level: 3, text: "Áp dụng tại hầu hết bộ phận, có tối ưu hóa quy trình" },
      { level: 4, text: "Áp dụng đầy đủ trong toàn DN, có đổi mới liên tục sản phẩm/dịch vụ" },
      { level: 5, text: "Đổi mới sáng tạo và Agile được thực hiện trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 6 tiêu chí con đều quản trị 'thiết kế và đổi mới dịch vụ'.",
    reference: "Phụ lục II, Mục 4.2 Phần B."
  },
  {
    stt: 18,
    code: "VH-3",
    pillar: "Vận hành",
    pillarId: "OPERATIONS",
    criteriaGroup: "4.3 Chuyển tiếp/Triển khai DV",
    question: "Doanh nghiệp áp dụng DevSecOps, CI/CD và quản lý phát hành thống nhất không?",
    mergedSubCriteria: ["4.3.1 Quản lý thay đổi", "4.3.2 Quản lý phát hành", "4.3.3 DevSecOps", "4.3.4 CI/CD"],
    answerOptions: [
      { level: 1, text: "Quản lý thay đổi và phát hành chỉ theo sự vụ" },
      { level: 2, text: "Một số bộ phận thống nhất và xác định trách nhiệm quản lý thay đổi" },
      { level: 3, text: "Hầu hết bộ phận có quy trình quản lý phát hành và thay đổi" },
      { level: 4, text: "Toàn DN áp dụng DevSecOps và CI/CD, quản lý phát hành linh hoạt" },
      { level: 5, text: "DevSecOps và CI/CD được áp dụng trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 4 tiêu chí con đều quản trị 'triển khai dịch vụ'.",
    reference: "Phụ lục II, Mục 4.3 Phần B."
  },
  {
    stt: 19,
    code: "VH-4",
    pillar: "Vận hành",
    pillarId: "OPERATIONS",
    criteriaGroup: "4.4 Vận hành dịch vụ",
    question: "Doanh nghiệp đảm bảo chất lượng dịch vụ, giám sát và quản lý chuỗi cung ứng ra sao?",
    mergedSubCriteria: ["4.4.1 Đảm bảo dịch vụ", "4.4.2 SRE", "4.4.3 Chuỗi cung ứng", "4.4.4 Đáp ứng yêu cầu SP/DV", "4.4.5 Giám sát hoạt động", "4.4.6 Quản lý doanh thu", "4.4.7 Quản lý gian lận", "4.4.8 Vận hành hệ thống"],
    answerOptions: [
      { level: 1, text: "Đảm bảo và giám sát dịch vụ chỉ theo sự vụ" },
      { level: 2, text: "Đảm bảo dịch vụ ban hành nhưng chưa đạt được mức cam kết" },
      { level: 3, text: "Đảm bảo dịch vụ được áp dụng và đạt mức hiệu suất đã thỏa thuận" },
      { level: 4, text: "Dịch vụ đạt cam kết và liên tục cải thiện, chuỗi cung ứng linh hoạt" },
      { level: 5, text: "Vận hành dịch vụ được đảm bảo và tối ưu trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'vận hành dịch vụ'.",
    reference: "Phụ lục II, Mục 4.4 Phần B."
  },
  {
    stt: 20,
    code: "VH-5",
    pillar: "Văn hóa",
    pillarId: "PEOPLE_CULTURE",
    criteriaGroup: "5.1 Giá trị doanh nghiệp",
    question: "Lãnh đạo, nhân viên có hành vi và văn hóa phù hợp với chiến lược số không?",
    mergedSubCriteria: ["5.1.1 Hành vi lãnh đạo", "5.1.2 Tác động của nhân viên", "5.1.3 Giá trị được chia sẻ", "5.1.4 Thất bại có kiểm soát", "5.1.5 Cộng tác ảo", "5.1.6 Sự hoà nhập"],
    answerOptions: [
      { level: 1, text: "Hành vi lãnh đạo và nhân viên chưa gắn kết với chiến lược số" },
      { level: 2, text: "Một số bộ phận có hành vi phù hợp với chiến lược và bối cảnh" },
      { level: 3, text: "Hầu hết bộ phận có hành vi phù hợp, có văn hóa 'thất bại có kiểm soát'" },
      { level: 4, text: "Toàn DN có văn hóa số, lãnh đạo là hình mẫu, nhân viên hiểu tác động của mình" },
      { level: 5, text: "Văn hóa số được chia sẻ và lan tỏa trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 6 tiêu chí con đều quản trị 'giá trị và văn hóa doanh nghiệp'.",
    reference: "Phụ lục II, Mục 5.1 Phần B."
  },
  {
    stt: 21,
    code: "VH-6",
    pillar: "Văn hóa",
    pillarId: "PEOPLE_CULTURE",
    criteriaGroup: "5.2 Quản lý tài năng",
    question: "Doanh nghiệp có chính sách đãi ngộ, phát triển và thu hút nhân tài số không?",
    mergedSubCriteria: ["5.2.1 Chính sách đãi ngộ", "5.2.2 Năng lực cơ bản", "5.2.3 Lập kế hoạch phát triển LLĐ", "5.2.4 Thu hút nhân tài", "5.2.5 Nhóm tài năng bên ngoài", "5.2.6 Phát triển tài năng", "5.2.7 Học tập trên môi trường số", "5.2.8 Sự gắn kết của NLĐ"],
    answerOptions: [
      { level: 1, text: "Chính sách đãi ngộ cứng nhắc, chưa thúc đẩy chiến lược số" },
      { level: 2, text: "Chính sách đãi ngộ phù hợp với chiến lược tại một số bộ phận" },
      { level: 3, text: "Chính sách phù hợp tại hầu hết bộ phận, có lập kế hoạch phát triển" },
      { level: 4, text: "Toàn DN có chính sách đãi ngộ và thu hút nhân tài số bài bản" },
      { level: 5, text: "Chính sách nhân tài được thống nhất trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'nguồn nhân lực'.",
    reference: "Phụ lục II, Mục 5.2 Phần B."
  },
  {
    stt: 22,
    code: "VH-7",
    pillar: "Văn hóa",
    pillarId: "PEOPLE_CULTURE",
    criteriaGroup: "5.3 Hỗ trợ môi trường làm việc",
    question: "Môi trường, công cụ và chính sách có thúc đẩy năng suất và đổi mới sáng tạo không?",
    mergedSubCriteria: ["5.3.1 Môi trường thúc đẩy năng suất", "5.3.2 Môi trường thúc đẩy đổi mới", "5.3.3 Công cụ thúc đẩy năng suất", "5.3.4 Công cụ thúc đẩy đổi mới", "5.3.5 Chính sách thúc đẩy năng suất", "5.3.6 Chính sách thúc đẩy đổi mới", "5.3.7 Nắm bắt tri thức", "5.3.8 Chia sẻ tri thức"],
    answerOptions: [
      { level: 1, text: "Môi trường, công cụ, chính sách chưa thúc đẩy năng suất/đổi mới" },
      { level: 2, text: "Một số bộ phận có môi trường và công cụ thúc đẩy năng suất" },
      { level: 3, text: "Hầu hết bộ phận có môi trường và công cụ thúc đẩy năng suất/đổi mới" },
      { level: 4, text: "Toàn DN có môi trường, công cụ và chính sách thúc đẩy tối ưu" },
      { level: 5, text: "Môi trường làm việc thúc đẩy và chia sẻ tri thức trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'môi trường làm việc'.",
    reference: "Phụ lục II, Mục 5.3 Phần B."
  },
  {
    stt: 23,
    code: "DL-1",
    pillar: "Dữ liệu",
    pillarId: "DATA_SECURITY",
    criteriaGroup: "6.1 Quản trị dữ liệu",
    question: "Doanh nghiệp có quản lý siêu dữ liệu, dữ liệu chủ và chính sách dữ liệu không?",
    mergedSubCriteria: ["6.1.1 Quản lý siêu dữ liệu", "6.1.2 Quản lý dữ liệu", "6.1.3 Quản lý dữ liệu chủ", "6.1.4 Quản lý bảo mật dữ liệu", "6.1.5 Chính sách dữ liệu", "6.1.6 Chiến lược dữ liệu", "6.1.7 Tổ chức và vai trò", "6.1.8 Quản lý quyền riêng tư dữ liệu"],
    answerOptions: [
      { level: 1, text: "Siêu dữ liệu, dữ liệu chủ chỉ theo sự vụ" },
      { level: 2, text: "Bắt đầu chuẩn hóa siêu dữ liệu và phân loại tại một số bộ phận" },
      { level: 3, text: "Siêu dữ liệu được định nghĩa theo phân loại chức năng, có chính sách" },
      { level: 4, text: "Quản trị dữ liệu tối ưu trong toàn DN, có chiến lược dữ liệu rõ ràng" },
      { level: 5, text: "Quản trị dữ liệu được thống nhất và tối ưu trong toàn hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 8 tiêu chí con đều quản trị 'quản trị dữ liệu'.",
    reference: "Phụ lục II, Mục 6.1 Phần B."
  },
  {
    stt: 24,
    code: "DL-2",
    pillar: "Dữ liệu",
    pillarId: "DATA_SECURITY",
    criteriaGroup: "6.2 Kỹ thuật dữ liệu",
    question: "Doanh nghiệp có mô hình hóa, lưu trữ và đảm bảo truy cập dữ liệu hiệu quả không?",
    mergedSubCriteria: ["6.2.1 Mô hình hoá dữ liệu", "6.2.2 Lưu trữ dữ liệu", "6.2.3 Khả năng truy cập dữ liệu", "6.2.4 Quản lý vòng đời dữ liệu", "6.2.5 Thu thập dữ liệu", "6.2.6 Đảm bảo tính toàn vẹn", "6.2.7 Trực quan hóa dữ liệu"],
    answerOptions: [
      { level: 1, text: "Dữ liệu chưa được xác định, phân loại và mô hình hóa" },
      { level: 2, text: "Một số bộ phận xác định và phân loại dữ liệu thành mô hình" },
      { level: 3, text: "Hầu hết bộ phận phân loại và quản lý vòng đời dữ liệu" },
      { level: 4, text: "Toàn DN có mô hình dữ liệu chung, đảm bảo truy cập và toàn vẹn" },
      { level: 5, text: "Mô hình dữ liệu chung và kỹ thuật dữ liệu chia sẻ trong hệ sinh thái" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 7 tiêu chí con đều quản trị 'kỹ thuật dữ liệu'.",
    reference: "Phụ lục II, Mục 6.2 Phần B."
  },
  {
    stt: 25,
    code: "DL-3",
    pillar: "Dữ liệu",
    pillarId: "DATA_SECURITY",
    criteriaGroup: "6.3 Hiện thực hóa giá trị từ dữ liệu",
    question: "Doanh nghiệp ra quyết định dựa trên dữ liệu và khai thác giá trị kinh tế từ dữ liệu không?",
    mergedSubCriteria: ["6.3.1 Ra quyết định dựa trên dữ liệu", "6.3.2 Năng lực khoa học dữ liệu", "6.3.3 Khai thác giá trị kinh tế từ dữ liệu"],
    answerOptions: [
      { level: 1, text: "Quyết định hiếm khi dựa trên dữ liệu, chưa tạo ra giá trị đo lường được" },
      { level: 2, text: "Một số bộ phận ra quyết định dựa trên dữ liệu, tạo ra một số giá trị" },
      { level: 3, text: "Hầu hết quyết định dựa trên dữ liệu cấp bộ phận, giá trị đáng kể" },
      { level: 4, text: "Toàn DN ra quyết định dựa trên dữ liệu, tối ưu hóa giá trị kinh tế" },
      { level: 5, text: "Ra quyết định dựa trên dữ liệu từ toàn hệ sinh thái, tối đa hóa giá trị" }
    ],
    mergeReason: "Cùng đối tượng quản trị: cả 3 tiêu chí con đều quản trị 'khai thác giá trị từ dữ liệu'.",
    reference: "Phụ lục II, Mục 6.3 Phần B."
  }
];

// Chuyển đổi sang AssessmentQuestion để tương thích với Wizard và hệ thống
export const ENTERPRISE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = ENTERPRISE_DBI_QUESTIONS.map(q => ({
  id: q.code,
  pillarId: q.pillarId,
  questionNumber: q.stt,
  title: `[${q.code}] ${q.question}`,
  context: `${q.criteriaGroup} • Căn cứ: ${q.reference}`,
  weight: 1 / 25,
  targetSize: 'LARGE',
  options: q.answerOptions.map(opt => ({
    text: opt.text,
    score: opt.level,
    description: `Mức ${opt.level} (${opt.level - 1} điểm thô)`
  }))
}));
