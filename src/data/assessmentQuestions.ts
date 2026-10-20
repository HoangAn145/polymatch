import { Question } from '../types';

export const DBI_QUESTIONS: Question[] = [
  // Trụ cột 1: Định hướng chiến lược
  {
    id: "dbi-01",
    ma: "D01",
    phan: "dbi",
    tru_cot_dbi: "Định hướng chiến lược",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Mục tiêu chuyển đổi số của doanh nghiệp được xác định ở mức nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chưa xác định mục tiêu chuyển đổi số cụ thể nào." },
      { muc: 2, noi_dung: "Đã có ý tưởng hoặc thảo luận sơ bộ nhưng chưa văn bản hóa thành mục tiêu rõ ràng." },
      { muc: 3, noi_dung: "Đã có mục tiêu số hóa cho một vài quy trình hoặc phòng ban riêng lẻ." },
      { muc: 4, noi_dung: "Có mục tiêu chuyển đổi số bằng văn bản, có người phụ trách và lộ trình thời hạn." },
      { muc: 5, noi_dung: "Mục tiêu số gắn liền với chiến lược kinh doanh tổng thể và được ban lãnh đạo rà soát định kỳ." }
    ]
  },
  {
    id: "dbi-02",
    ma: "D02",
    phan: "dbi",
    tru_cot_dbi: "Định hướng chiến lược",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Việc đánh giá hiệu quả đầu tư công nghệ được thực hiện thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không đánh giá hiệu quả tài chính hay tác động vận hành sau khi mua." },
      { muc: 2, noi_dung: "Quyết định đầu tư chủ yếu dựa vào cảm nhận hoặc thấy đối thủ dùng." },
      { muc: 3, noi_dung: "Có ước tính chi phí và lợi ích cơ bản trước khi quyết định mua." },
      { muc: 4, noi_dung: "Có theo dõi định lượng kết quả và chỉ số KPI sau khi triển khai công nghệ." },
      { muc: 5, noi_dung: "So sánh lợi ích thực tế định kỳ với mục tiêu ban đầu và linh hoạt điều chỉnh danh mục đầu tư." }
    ]
  },

  // Trụ cột 2: Trải nghiệm khách hàng
  {
    id: "dbi-03",
    ma: "D03",
    phan: "dbi",
    tru_cot_dbi: "Trải nghiệm khách hàng",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Khách hàng gửi yêu cầu và nhận cập nhật dịch vụ qua kênh nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chủ yếu qua gặp trực tiếp hoặc gọi điện thoại, không có nhật ký." },
      { muc: 2, noi_dung: "Qua email, Zalo hoặc tin nhắn nhưng nhân viên xử lý hoàn toàn thủ công." },
      { muc: 3, noi_dung: "Có kênh số chuyên biệt (form web, email chuẩn) với quy trình phản hồi rõ ràng." },
      { muc: 4, noi_dung: "Khách hàng có thể tự tra cứu tình trạng hoặc tạo đơn qua cổng thông tin/ứng dụng." },
      { muc: 5, noi_dung: "Các kênh tương tác kết nối liền mạch và cá nhân hóa tự động theo lịch sử của khách hàng." }
    ]
  },
  {
    id: "dbi-04",
    ma: "D04",
    phan: "dbi",
    tru_cot_dbi: "Trải nghiệm khách hàng",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Doanh nghiệp đo lường và xử lý phản hồi, khiếu nại của khách hàng thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không ghi nhận phản hồi có hệ thống." },
      { muc: 2, noi_dung: "Chỉ xử lý sự vụ khi khách hàng gọi phàn nàn gay gắt." },
      { muc: 3, noi_dung: "Ghi nhận nhật ký khiếu nại và tổng hợp báo cáo định kỳ." },
      { muc: 4, noi_dung: "Phân loại nguyên nhân khiếu nại theo dịch vụ/tuyến và theo dõi thời gian khắc phục." },
      { muc: 5, noi_dung: "Dùng dữ liệu phản hồi để phát hiện sớm xu hướng và chủ động cải tiến quy trình phục vụ." }
    ]
  },

  // Trụ cột 3: Chuỗi cung ứng
  {
    id: "dbi-05",
    ma: "D05",
    phan: "dbi",
    tru_cot_dbi: "Chuỗi cung ứng",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Thông tin đơn hàng và lô hàng được chia sẻ giữa các bên liên quan thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Gọi điện hoặc gửi email qua lại, không có nơi lưu trữ trạng thái chung." },
      { muc: 2, noi_dung: "Chia sẻ các file Excel rời rạc, cập nhật thủ công ngắt quãng." },
      { muc: 3, noi_dung: "Có bảng tính dùng chung trên Google Drive/OneDrive hoặc phần mềm cho các bên nội bộ." },
      { muc: 4, noi_dung: "Thông tin được cập nhật và chia sẻ theo quy trình số thống nhất giữa đối tác và khách hàng." },
      { muc: 5, noi_dung: "Dữ liệu được trao đổi tự động qua API/EDI theo thời gian thực với đối tác chính trong chuỗi." }
    ]
  },
  {
    id: "dbi-06",
    ma: "D06",
    phan: "dbi",
    tru_cot_dbi: "Chuỗi cung ứng",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Khi phát sinh sự cố hoặc gián đoạn, doanh nghiệp phối hợp xử lý thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Xử lý ngẫu hứng tùy tình huống, không lưu lại kinh nghiệm." },
      { muc: 2, noi_dung: "Trao đổi thủ công qua nhóm chat, thiếu phân định trách nhiệm rõ ràng." },
      { muc: 3, noi_dung: "Có quy trình xử lý ngoại lệ và người phụ trách chính cho từng loại sự cố." },
      { muc: 4, noi_dung: "Theo dõi trạng thái khắc phục trên hệ thống và đo lường thời gian xử lý." },
      { muc: 5, noi_dung: "Dùng dữ liệu lịch sử để cảnh báo sớm rủi ro và họp rút kinh nghiệm sau mỗi sự cố." }
    ]
  },

  // Trụ cột 4: Hệ thống thông tin & Quản lý dữ liệu
  {
    id: "dbi-07",
    ma: "D07",
    phan: "dbi",
    tru_cot_dbi: "Hệ thống thông tin & Quản trị dữ liệu",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Dữ liệu vận hành chính được lưu trữ và cập nhật ở đâu?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Lưu trên sổ sách giấy hoặc trên máy tính cá nhân của từng nhân viên." },
      { muc: 2, noi_dung: "Nhiều file riêng lẻ, dữ liệu thường xuyên bị sai lệch phiên bản." },
      { muc: 3, noi_dung: "Dữ liệu chính được nhập vào phần mềm chuyên ngành hoặc bảng dữ liệu chuẩn hóa." },
      { muc: 4, noi_dung: "Có quy tắc chuẩn hóa dữ liệu dùng chung cho toàn bộ công ty." },
      { muc: 5, noi_dung: "Dữ liệu được quản trị tập trung, kiểm soát chất lượng tự động và cập nhật tức thời." }
    ]
  },
  {
    id: "dbi-08",
    ma: "D08",
    phan: "dbi",
    tru_cot_dbi: "Hệ thống thông tin & Quản trị dữ liệu",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Doanh nghiệp sử dụng dữ liệu để ra quyết định điều hành thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Ra quyết định chủ yếu dựa vào kinh nghiệm cá nhân của chủ doanh nghiệp." },
      { muc: 2, noi_dung: "Chỉ tìm kiếm số liệu khi gặp vấn đề hoặc đối soát tranh chấp." },
      { muc: 3, noi_dung: "Theo dõi báo cáo định kỳ tuần hoặc tháng trên bảng số liệu." },
      { muc: 4, noi_dung: "Có dashboard phân tích xu hướng chi phí, doanh thu và năng suất theo mốc thời gian." },
      { muc: 5, noi_dung: "Ứng dụng mô hình dự báo và phân tích kịch bản để tối ưu quyết định vận hành." }
    ]
  },

  // Trụ cột 5: Rủi ro và An toàn thông tin
  {
    id: "dbi-09",
    ma: "D09",
    phan: "dbi",
    tru_cot_dbi: "An toàn thông tin",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Quyền truy cập dữ liệu và tài khoản phần mềm được quản lý thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không có quy tắc rõ ràng, ai cũng có thể xem mọi dữ liệu." },
      { muc: 2, noi_dung: "Nhiều người dùng chung một tài khoản hoặc mật khẩu đơn giản." },
      { muc: 3, noi_dung: "Mỗi nhân viên có tài khoản riêng và được phân quyền chức năng cơ bản." },
      { muc: 4, noi_dung: "Rà soát phân quyền định kỳ, có quy trình thu hồi tài khoản ngay khi nhân sự nghỉ việc." },
      { muc: 5, noi_dung: "Có chính sách bảo mật dữ liệu khách hàng theo quy định, nhật ký truy cập được ghi lại đầy đủ." }
    ]
  },
  {
    id: "dbi-10",
    ma: "D10",
    phan: "dbi",
    tru_cot_dbi: "An toàn thông tin",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Doanh nghiệp chuẩn bị phương án sao lưu và phục hồi dữ liệu thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chưa từng sao lưu dữ liệu máy tính hay phần mềm." },
      { muc: 2, noi_dung: "Sao lưu không đều đặn ra USB/ổ cứng ngoài, chưa từng thử khôi phục." },
      { muc: 3, noi_dung: "Có sao lưu tự động định kỳ lên đám mây, khôi phục thủ công khi có sự cố." },
      { muc: 4, noi_dung: "Có người phụ trách sao lưu và định kỳ kiểm tra khả năng phục hồi dữ liệu." },
      { muc: 5, noi_dung: "Có quy trình duy trì kinh doanh liên tục (BCP) sẵn sàng chuyển đổi khi hệ thống gặp sự cố." }
    ]
  },

  // Trụ cột 6: Quản lý vận hành
  {
    id: "dbi-11",
    ma: "D11",
    phan: "dbi",
    tru_cot_dbi: "Quản lý vận hành",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Các quy trình nội bộ (kế toán, đề xuất, phê duyệt) được quản lý thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Hoàn toàn bằng giấy tờ, trình ký trực tiếp." },
      { muc: 2, noi_dung: "Dùng các công cụ nhắn tin hoặc email rời rạc để xin phê duyệt." },
      { muc: 3, noi_dung: "Các quy trình chính (như kế toán, chấm công) đã có phần mềm riêng." },
      { muc: 4, noi_dung: "Quy trình phê duyệt và luân chuyển chứng từ được số hóa xuyên suốt giữa các phòng ban." },
      { muc: 5, noi_dung: "Luồng công việc tự động hóa có kiểm soát, giảm thiểu thời gian chờ phê duyệt." }
    ]
  },
  {
    id: "dbi-12",
    ma: "D12",
    phan: "dbi",
    tru_cot_dbi: "Quản lý vận hành",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Doanh nghiệp theo dõi hiệu suất vận hành và cải tiến quy trình ra sao?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không có chỉ số đo lường hiệu suất cụ thể." },
      { muc: 2, noi_dung: "Chỉ kiểm tra lại khi thấy chi phí tăng vọt hoặc khách phàn nàn." },
      { muc: 3, noi_dung: "Có bộ chỉ số KPI cơ bản và họp đánh giá hàng tháng." },
      { muc: 4, noi_dung: "Có người chịu trách nhiệm đo lường và theo dõi các hành động cải tiến quy trình." },
      { muc: 5, noi_dung: "Văn hóa cải tiến liên tục dựa trên dữ liệu, kết quả cải tiến được định lượng rõ ràng." }
    ]
  },

  // Trụ cột 7: Con người và tổ chức
  {
    id: "dbi-13",
    ma: "D13",
    phan: "dbi",
    tru_cot_dbi: "Con người & Văn hóa số",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Đội ngũ nhân sự được đào tạo sử dụng công cụ số thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chưa từng tổ chức hướng dẫn, nhân viên tự mày mò." },
      { muc: 2, noi_dung: "Người trước chỉ cho người sau khi phát sinh công việc mới." },
      { muc: 3, noi_dung: "Được nhà cung cấp phần mềm hướng dẫn khi bắt đầu triển khai." },
      { muc: 4, noi_dung: "Có kế hoạch đào tạo định kỳ cho nhân viên mới và cập nhật kỹ năng cho nhân sự cũ." },
      { muc: 5, noi_dung: "Đánh giá mức độ thành thạo công nghệ và khuyến khích các sáng kiến cải tiến từ nhân sự." }
    ]
  },
  {
    id: "dbi-14",
    ma: "D14",
    phan: "dbi",
    tru_cot_dbi: "Con người & Văn hóa số",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Ai là người trực tiếp chịu trách nhiệm cho các dự án chuyển đổi số?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không có ai phụ trách, ai thích dùng gì thì dùng." },
      { muc: 2, noi_dung: "Giao kiêm nhiệm cho kế toán hoặc nhân viên IT nhưng không có quyền quyết." },
      { muc: 3, noi_dung: "Có một nhân sự đầu mối được giao trách nhiệm cụ thể." },
      { muc: 4, noi_dung: "Có ban điều hành hoặc nhóm phối hợp trực tiếp giữa lãnh đạo và các trưởng bộ phận." },
      { muc: 5, noi_dung: "Ban lãnh đạo trực tiếp bảo trợ, có ngân sách và mục tiêu KPI rõ ràng cho chuyển đổi số." }
    ]
  }
];

export const LDMI_QUESTIONS: Question[] = [
  // Nhóm VT: Vận tải
  {
    id: "ldmi-01",
    ma: "L01",
    phan: "ldmi",
    nhom_nang_luc: "VT",
    nhanh_ap_dung: ["VT", "3PL", "LM"],
    tieu_de: "Quy trình điều phối xe và chuyến được thực hiện thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-VT-01",
    phuong_an: [
      { muc: 1, noi_dung: "Dựa vào điện thoại hoặc Zalo, không có lịch xe chung, phụ thuộc trí nhớ." },
      { muc: 2, noi_dung: "Lập lịch phân xe trên bảng tính Excel hoặc Google Sheet dùng chung." },
      { muc: 3, noi_dung: "Quản lý và ban hành lệnh điều xe trên phần mềm quản lý vận tải (TMS)." },
      { muc: 4, noi_dung: "Phần mềm hỗ trợ gợi ý ghép xe theo vị trí, tải trọng và theo dõi trạng thái chuyến." },
      { muc: 5, noi_dung: "Điều phối tự động theo thuật toán có kiểm soát theo ràng buộc vận hành thực tế." }
    ]
  },
  {
    id: "ldmi-02",
    ma: "L02",
    phan: "ldmi",
    nhom_nang_luc: "VT",
    nhanh_ap_dung: ["VT", "3PL", "LM"],
    tieu_de: "Tuyến đường và hiệu quả sử dụng phương tiện được quản lý ra sao?",
    bat_buoc: true,
    ma_khoang_trong: "G-VT-02",
    phuong_an: [
      { muc: 1, noi_dung: "Tài xế tự chọn tuyến theo thói quen, không lưu lại dữ liệu quãng đường." },
      { muc: 2, noi_dung: "Có ghi chép số km thực tế nhưng chỉ tổng hợp thủ công cuối tháng." },
      { muc: 3, noi_dung: "Dùng công cụ gợi ý tuyến đường hoặc theo dõi chi phí xăng dầu theo từng chuyến." },
      { muc: 4, noi_dung: "Tối ưu hóa đa điểm giao và khung giờ cấm tải, theo dõi tỷ lệ chạy rỗng chiều về." },
      { muc: 5, noi_dung: "Tối ưu hóa động theo tình hình giao thông thực tế và tự động ghép đơn chiều về." }
    ]
  },

  // Nhóm KB: Kho bãi
  {
    id: "ldmi-03",
    ma: "L03",
    phan: "ldmi",
    nhom_nang_luc: "KB",
    nhanh_ap_dung: ["KB", "3PL"],
    tieu_de: "Nhập – xuất – tồn và vị trí hàng trong kho được quản lý thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-KB-01",
    phuong_an: [
      { muc: 1, noi_dung: "Ghi sổ tay hoặc nhân viên tự nhớ vị trí để hàng trong kho." },
      { muc: 2, noi_dung: "Quản lý xuất nhập tồn trên bảng tính Excel cập nhật thủ công hàng ngày." },
      { muc: 3, noi_dung: "Phần mềm quản lý kho chuyên dụng (WMS) quản lý danh mục và số lượng tồn." },
      { muc: 4, noi_dung: "Quản lý chính xác theo vị trí ô kệ (Bin), số lô, hạn sử dụng và quét barcode/QR." },
      { muc: 5, noi_dung: "Hệ thống tự động gợi ý vị trí để hàng tối ưu và cảnh báo hàng sắp hết hạn/tồn lâu." }
    ]
  },
  {
    id: "ldmi-04",
    ma: "L04",
    phan: "ldmi",
    nhom_nang_luc: "KB",
    nhanh_ap_dung: ["KB", "3PL"],
    tieu_de: "Độ chính xác tồn kho và năng suất lấy hàng được theo dõi thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-KB-02",
    phuong_an: [
      { muc: 1, noi_dung: "Không kiểm kê định kỳ, chỉ biết khi khách báo giao thiếu hoặc hết hàng." },
      { muc: 2, noi_dung: "Kiểm kê tổng định kỳ hàng quý/năm, phải dừng kho để đếm hàng." },
      { muc: 3, noi_dung: "Kiểm kê luân phiên định kỳ theo tuần và ghi nhận số liệu chênh lệch." },
      { muc: 4, noi_dung: "Có chỉ số độ chính xác tồn kho (IRA), phiếu nhặt hàng in theo lộ trình ngắn nhất." },
      { muc: 5, noi_dung: "Quét mã vạch cập nhật tức thời thời gian thực, đối soát sai lệch liên tục." }
    ]
  },

  // Nhóm GN: Giao nhận quốc tế (Forwarding)
  {
    id: "ldmi-05",
    ma: "L05",
    phan: "ldmi",
    nhom_nang_luc: "GN",
    nhanh_ap_dung: ["FF", "3PL"],
    tieu_de: "Báo giá cước, booking và hồ sơ lô hàng được quản lý thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-GN-01",
    phuong_an: [
      { muc: 1, noi_dung: "Tính giá thủ công từ nhiều email cước hãng tàu, báo giá chậm trễ." },
      { muc: 2, noi_dung: "Có bảng cước chuẩn trên Excel nhưng nhân viên phải tra và nhập tay từng báo giá." },
      { muc: 3, noi_dung: "Phần mềm giao nhận (FMS) quản lý bảng giá, booking và tạo báo giá mẫu nhanh." },
      { muc: 4, noi_dung: "Dữ liệu lô hàng liên kết tự động giữa báo giá, chứng từ vận đơn và kế toán." },
      { muc: 5, noi_dung: "Tự động cập nhật biểu cước thị trường và trao đổi dữ liệu tự động với hãng vận chuyển." }
    ]
  },
  {
    id: "ldmi-06",
    ma: "L06",
    phan: "ldmi",
    nhom_nang_luc: "GN",
    nhanh_ap_dung: ["FF", "3PL"],
    tieu_de: "Theo dõi trạng thái container và lô hàng quốc tế được thực hiện ra sao?",
    bat_buoc: true,
    ma_khoang_trong: "G-GN-02",
    phuong_an: [
      { muc: 1, noi_dung: "Khi khách hỏi mới vào từng web hãng tàu tra cứu hoặc gọi đại lý hỏi." },
      { muc: 2, noi_dung: "Nhân viên cập nhật tiến độ container thủ công vào bảng theo dõi nội bộ hàng ngày." },
      { muc: 3, noi_dung: "Sử dụng công cụ tra cứu container tập trung gom nhiều hãng về một nơi." },
      { muc: 4, noi_dung: "Tự động nhận cảnh báo chậm trễ (delay) hoặc thay đổi lịch tàu cho phần lớn các lô." },
      { muc: 5, noi_dung: "Dự báo thời gian tàu cập cảng (ETA) chính xác và chủ động cảnh báo phí lưu cont (Dem/Det)." }
    ]
  },

  // Nhóm DH: Đơn hàng & Giao nhận
  {
    id: "ldmi-07",
    ma: "L07",
    phan: "ldmi",
    nhom_nang_luc: "DH",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Quy trình tiếp nhận đơn hàng và chuyển sang thực hiện thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-DH-01",
    phuong_an: [
      { muc: 1, noi_dung: "Nhận đơn qua điện thoại, Zalo, nhân viên nhập lại nhiều lần dễ sai lệch." },
      { muc: 2, noi_dung: "Nhận đơn qua email/file Excel theo mẫu cố định nhưng vẫn phải copy thủ công." },
      { muc: 3, noi_dung: "Có phần mềm quản lý đơn hàng (OMS) tập trung các kênh về một đầu mối." },
      { muc: 4, noi_dung: "Đơn hàng tự động liên kết và phân bổ nguồn lực sang kho bãi hoặc đội xe." },
      { muc: 5, noi_dung: "Kết nối trực tiếp hệ thống của khách hàng (API/EDI), tự động kiểm tra năng lực và xác nhận." }
    ]
  },
  {
    id: "ldmi-08",
    ma: "L08",
    phan: "ldmi",
    nhom_nang_luc: "DH",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Bằng chứng giao hàng (POD) và xác nhận hoàn tất dịch vụ được quản lý ra sao?",
    bat_buoc: true,
    ma_khoang_trong: "G-DH-02",
    phuong_an: [
      { muc: 1, noi_dung: "Xác nhận bằng biên bản giấy, tài xế gom về cuối tuần hoặc cuối tháng mới nộp." },
      { muc: 2, noi_dung: "Tài xế chụp ảnh biên bản gửi qua Zalo, dễ thất lạc và chậm đối soát." },
      { muc: 3, noi_dung: "Có kho lưu trữ ảnh biên bản giao hàng số hóa theo mã đơn hàng." },
      { muc: 4, noi_dung: "Dùng ứng dụng tài xế ký nhận điện tử (ePOD) kèm tọa độ GPS và ảnh chụp kiện hàng." },
      { muc: 5, noi_dung: "Biên bản ePOD truyền ngay về hệ thống đối soát cước và tự động gửi thông báo cho khách." }
    ]
  },

  // Nhóm HT: Hiển thị & Tích hợp
  {
    id: "ldmi-09",
    ma: "L09",
    phan: "ldmi",
    nhom_nang_luc: "HT",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Khách hàng theo dõi vị trí và tiến độ hàng hóa thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-HT-01",
    phuong_an: [
      { muc: 1, noi_dung: "Khách phải gọi điện hoặc nhắn tin hỏi bộ phận chăm sóc khách hàng." },
      { muc: 2, noi_dung: "Nhân viên gửi email báo cáo tình trạng theo ngày một cách thủ công." },
      { muc: 3, noi_dung: "Khách có thể tra cứu mã vận đơn trên cổng website với các trạng thái cập nhật theo mốc." },
      { muc: 4, noi_dung: "Khách theo dõi hành trình xe hoặc vị trí kiện hàng trên bản đồ gần thời gian thực." },
      { muc: 5, noi_dung: "Hệ thống tự động thông báo sự cố và thời gian giao hàng dự kiến (ETA) qua tin nhắn." }
    ]
  },
  {
    id: "ldmi-10",
    ma: "L10",
    phan: "ldmi",
    nhom_nang_luc: "HT",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Các phần mềm nội bộ (Vận tải, Kho, Kế toán) kết nối với nhau thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-HT-02",
    phuong_an: [
      { muc: 1, noi_dung: "Các phần mềm hoạt động biệt lập, phải gõ lại số liệu giữa các phòng ban." },
      { muc: 2, noi_dung: "Xuất dữ liệu ra file Excel từ phần mềm này rồi import sang phần mềm khác định kỳ." },
      { muc: 3, noi_dung: "Một số phần mềm cốt lõi (như Vận tải với Kế toán) có kết nối đồng bộ dữ liệu." },
      { muc: 4, noi_dung: "Hệ thống vận hành chính dùng chung một cơ sở dữ liệu hoặc kết nối qua API thông suốt." },
      { muc: 5, noi_dung: "Nền tảng tích hợp dữ liệu tập trung toàn diện và kiểm soát lỗi dữ liệu tự động." }
    ]
  },

  // Nhóm CT: Chứng từ & Hải quan
  {
    id: "ldmi-11",
    ma: "L11",
    phan: "ldmi",
    nhom_nang_luc: "CT",
    nhanh_ap_dung: ["FF", "3PL", "VT", "KB", "LM"],
    tieu_de: "Quy trình lập và lưu trữ bộ chứng từ vận tải/hải quan được thực hiện ra sao?",
    bat_buoc: true,
    ma_khoang_trong: "G-CT-01",
    phuong_an: [
      { muc: 1, noi_dung: "Gõ thủ công lặp đi lặp lại thông tin cùng lô hàng trên nhiều biểu mẫu khác nhau." },
      { muc: 2, noi_dung: "Soạn trên mẫu Word/Excel lưu trong thư mục máy tính, hay bị nhầm lẫn phiên bản." },
      { muc: 3, noi_dung: "Sinh chứng từ tự động từ thông tin lô hàng trên phần mềm nghiệp vụ." },
      { muc: 4, noi_dung: "Dữ liệu được tái sử dụng giữa các chứng từ, có ký số điện tử và phân quyền truy xuất." },
      { muc: 5, noi_dung: "Ứng dụng nhận dạng dữ liệu tự động (OCR) và trao đổi chứng từ số với hải quan/đối tác." }
    ]
  },
  {
    id: "ldmi-12",
    ma: "L12",
    phan: "ldmi",
    nhom_nang_luc: "CT",
    nhanh_ap_dung: ["FF", "3PL"],
    tieu_de: "Kiểm tra và đối chiếu tính chính xác của chứng từ khai báo thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-CT-01",
    phuong_an: [
      { muc: 1, noi_dung: "Phụ thuộc vào kinh nghiệm của cá nhân phụ trách, dễ sót lỗi mã HS hoặc số lượng." },
      { muc: 2, noi_dung: "Kiểm tra thủ công bằng mắt giữa chứng từ gốc và tờ khai." },
      { muc: 3, noi_dung: "Có checklist kiểm tra chứng từ chuẩn và quy trình đối chiếu chéo 2 người." },
      { muc: 4, noi_dung: "Hệ thống có cảnh báo các điểm bất thường về trọng lượng, giá tính thuế hoặc mã HS." },
      { muc: 5, noi_dung: "Tự động kiểm tra tính hợp lệ của bộ chứng từ trước khi truyền khai báo hải quan." }
    ]
  },

  // Nhóm CP: Chi phí & Hiệu suất
  {
    id: "ldmi-13",
    ma: "L13",
    phan: "ldmi",
    nhom_nang_luc: "CP",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Chi phí logistics được bóc tách và phân tích ở cấp độ nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-CP-01",
    phuong_an: [
      { muc: 1, noi_dung: "Chỉ biết tổng chi phí cả công ty vào cuối tháng, không phân bổ được chi tiết." },
      { muc: 2, noi_dung: "Ước tính sơ bộ chi phí theo tháng, không rõ từng chuyến hay từng đơn có lãi hay lỗ." },
      { muc: 3, noi_dung: "Tính được giá thành trực tiếp theo từng chuyến xe, từng lô hàng hoặc đơn hàng." },
      { muc: 4, noi_dung: "Phân bổ chi phí và biên lợi nhuận bóc tách theo từng tuyến đường và từng khách hàng." },
      { muc: 5, noi_dung: "Cảnh báo tức thì các chuyến vận tải dưới giá thành và dự báo xu hướng chi phí." }
    ]
  },
  {
    id: "ldmi-14",
    ma: "L14",
    phan: "ldmi",
    nhom_nang_luc: "CP",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Bảng điều khiển (Dashboard) và chỉ số hiệu suất vận hành được theo dõi ra sao?",
    bat_buoc: true,
    ma_khoang_trong: "G-CP-02",
    phuong_an: [
      { muc: 1, noi_dung: "Không có bảng chỉ số, lãnh đạo hỏi thì nhân viên mới đi tổng hợp." },
      { muc: 2, noi_dung: "Báo cáo tổng hợp thủ công trên Excel hàng tuần hoặc hàng tháng." },
      { muc: 3, noi_dung: "Có dashboard theo dõi 3 - 5 chỉ số cốt lõi cập nhật định kỳ từ phần mềm." },
      { muc: 4, noi_dung: "Bảng điều khiển trực quan cập nhật theo thời gian thực về tiến độ, doanh thu, xe bận/rỗi." },
      { muc: 5, noi_dung: "Dashboard đa chiều hỗ trợ phân tích nguyên nhân gốc rễ và đề xuất hành động cải tiến." }
    ]
  },

  // Nhóm XA: Logistics Xanh
  {
    id: "ldmi-15",
    ma: "L15",
    phan: "ldmi",
    nhom_nang_luc: "XA",
    nhanh_ap_dung: ["VT", "3PL", "LM"],
    tieu_de: "Nhiên liệu và tỷ lệ xe chạy rỗng được theo dõi thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-XA-01",
    phuong_an: [
      { muc: 1, noi_dung: "Không theo dõi km rỗng, chi phí nhiên liệu chỉ tính theo hóa đơn cuối tháng." },
      { muc: 2, noi_dung: "Khoán nhiên liệu theo định mức chung, không đo đạc thực tế theo từng cung đường." },
      { muc: 3, noi_dung: "Ghi chép số km có hàng và km chạy rỗng theo từng chuyến xe hàng tháng." },
      { muc: 4, noi_dung: "Có chỉ tiêu giảm tỷ lệ chạy rỗng và chủ động tìm đơn hàng kết hợp chiều về." },
      { muc: 5, noi_dung: "Ứng dụng thuật toán ghép chuyến tự động và theo dõi hiệu suất năng lượng trên từng km." }
    ]
  },
  {
    id: "ldmi-16",
    ma: "L16",
    phan: "ldmi",
    nhom_nang_luc: "XA",
    nhanh_ap_dung: ["VT", "FF", "3PL", "LM"],
    tieu_de: "Lượng phát thải khí nhà kính (CO₂e) từ hoạt động logistics được tính toán thế nào?",
    bat_buoc: true,
    ma_khoang_trong: "G-XA-02",
    phuong_an: [
      { muc: 1, noi_dung: "Chưa từng đo lường hoặc tính toán phát thải." },
      { muc: 2, noi_dung: "Chỉ ước tính sơ bộ khi có khách hàng lớn yêu cầu cung cấp thông tin." },
      { muc: 3, noi_dung: "Tính toán lượng phát thải định kỳ từ lượng nhiên liệu diesel tiêu thụ theo hệ số quy đổi." },
      { muc: 4, noi_dung: "Áp dụng phương pháp tính phát thải chuẩn hóa (như GLEC Framework hoặc ISO 14083)." },
      { muc: 5, noi_dung: "Xuất báo cáo phát thải carbon cho từng lô hàng và có kế hoạch xanh hóa chuỗi cung ứng." }
    ]
  }
];

export const QUICK_SCAN_QUESTIONS: Question[] = [
  {
    id: "qs-01",
    ma: "Q01",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Hoạt động cốt lõi của doanh nghiệp bạn trong chuỗi logistics là gì?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Vận tải đường bộ nội địa (VT)" },
      { muc: 2, noi_dung: "Giao nhận vận tải quốc tế & Hải quan (FF)" },
      { muc: 3, noi_dung: "Quản lý kho bãi & Phân phối (KB)" },
      { muc: 4, noi_dung: "Dịch vụ logistics tích hợp (3PL)" },
      { muc: 5, noi_dung: "Giao hàng chặng cuối thương mại điện tử (LM)" }
    ]
  },
  {
    id: "qs-02",
    ma: "Q02",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Quy mô số lao động đóng bảo hiểm xã hội hiện tại của doanh nghiệp?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Dưới 10 người (Siêu nhỏ)" },
      { muc: 2, noi_dung: "Từ 10 - 50 người (Nhỏ)" },
      { muc: 3, noi_dung: "Từ 50 - 100 người (Vừa)" },
      { muc: 4, noi_dung: "Trên 100 người (Lớn)" },
      { muc: 5, noi_dung: "Chưa xác định" }
    ]
  },
  {
    id: "qs-03",
    ma: "Q03",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Việc theo dõi và điều hành phương tiện/đơn hàng hiện tại thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chủ yếu qua điện thoại và nhóm chat Zalo" },
      { muc: 2, noi_dung: "Ghi chép trên các file Excel rời rạc" },
      { muc: 3, noi_dung: "Có phần mềm riêng nhưng chưa kết nối với nhau" },
      { muc: 4, noi_dung: "Đã có phần mềm chuyên ngành và định vị GPS thời gian thực" },
      { muc: 5, noi_dung: "Hệ thống tự động hóa và tích hợp thông suốt" }
    ]
  },
  {
    id: "qs-04",
    ma: "Q04",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Mức độ chính xác của tồn kho và quản lý vị trí hàng hóa ra sao?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Thường xuyên lệch kho, tìm hàng lâu" },
      { muc: 2, noi_dung: "Chỉ kiểm kê thủ công định kỳ, mất nhiều thời gian" },
      { muc: 3, noi_dung: "Có phần mềm kho cơ bản nhưng chưa quét mã vạch vị trí" },
      { muc: 4, noi_dung: "Quản lý vị trí ô kệ chuẩn xác, quét mã vạch cầm tay" },
      { muc: 5, noi_dung: "Kho thông minh tự động hóa cao" }
    ]
  },
  {
    id: "qs-05",
    ma: "Q05",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Khách hàng của bạn có tự tra cứu được tình trạng hàng hóa không?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Khách phải gọi điện hỏi từng lần" },
      { muc: 2, noi_dung: "Nhân viên gửi báo cáo thủ công qua email cuối ngày" },
      { muc: 3, noi_dung: "Có cổng tra cứu web cơ bản theo mã vận đơn" },
      { muc: 4, noi_dung: "Khách theo dõi hành trình xe/hàng gần thời gian thực" },
      { muc: 5, noi_dung: "Cảnh báo chủ động và dự báo thời gian giao ETA" }
    ]
  },
  {
    id: "qs-06",
    ma: "Q06",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Biên bản giao hàng (POD) và đối soát cước được xử lý thế nào?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Chứng từ giấy về chậm, thường tranh chấp giao hàng" },
      { muc: 2, noi_dung: "Tài xế chụp ảnh biên bản gửi Zalo, dễ mất mát" },
      { muc: 3, noi_dung: "Lưu trữ scan tập trung nhưng đối soát cước thủ công" },
      { muc: 4, noi_dung: "Dùng ứng dụng tài xế ký nhận điện tử ePOD tức thì" },
      { muc: 5, noi_dung: "Tự động xuất hóa đơn và đối soát công nợ tự động" }
    ]
  },
  {
    id: "qs-07",
    ma: "Q07",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Bạn có biết chính xác tuyến xe nào đang chịu lỗ hoặc khách nào có biên lợi nhuận cao không?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Không rõ, chỉ tính tổng doanh thu và chi phí cuối tháng" },
      { muc: 2, noi_dung: "Chỉ ước tính áng chừng theo kinh nghiệm" },
      { muc: 3, noi_dung: "Tính được chi phí xăng dầu theo chuyến" },
      { muc: 4, noi_dung: "Có báo cáo lãi lỗ theo từng tuyến và từng khách hàng" },
      { muc: 5, noi_dung: "Dashboard phân tích giá thành phục vụ (Cost-to-Serve) theo thời gian thực" }
    ]
  },
  {
    id: "qs-08",
    ma: "Q08",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Mức độ sẵn sàng về nhân sự và lãnh đạo cho chuyển đổi số?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Nhân viên ngại thay đổi, lãnh đạo chưa ưu tiên ngân sách" },
      { muc: 2, noi_dung: "Đồng ý chuyển đổi nhưng chưa có người phụ trách cụ thể" },
      { muc: 3, noi_dung: "Đã có nhân sự đầu mối và chuẩn bị ngân sách cơ bản" },
      { muc: 4, noi_dung: "Lãnh đạo cam kết mạnh mẽ, có lộ trình và người quản lý dự án" },
      { muc: 5, noi_dung: "Văn hóa đổi mới sáng tạo số đã thấm nhuần vào toàn thể công ty" }
    ]
  },
  {
    id: "qs-09",
    ma: "Q09",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Ngân sách dự kiến của doanh nghiệp cho công nghệ trong 12 tháng tới?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Dưới 20 triệu đồng (Chỉ dùng công cụ miễn phí/giá rẻ)" },
      { muc: 2, noi_dung: "Từ 20 - 100 triệu đồng" },
      { muc: 3, noi_dung: "Từ 100 - 300 triệu đồng" },
      { muc: 4, noi_dung: "Trên 300 triệu đồng" },
      { muc: 5, noi_dung: "Chưa xác định ngân sách" }
    ]
  },
  {
    id: "qs-10",
    ma: "Q10",
    phan: "quick",
    nhanh_ap_dung: ["VT", "FF", "KB", "3PL", "LM", "KH"],
    tieu_de: "Mục tiêu ưu tiên lớn nhất của doanh nghiệp trong 6 tháng tới là gì?",
    bat_buoc: true,
    phuong_an: [
      { muc: 1, noi_dung: "Cắt giảm chi phí nhiên liệu & quản lý xe chạy rỗng" },
      { muc: 2, noi_dung: "Nâng cao độ chính xác tồn kho và năng suất kho" },
      { muc: 3, noi_dung: "Tự động hóa báo giá cước và theo dõi đơn hàng cho khách" },
      { muc: 4, noi_dung: "Tích hợp toàn diện các phần mềm nội bộ với kế toán" },
      { muc: 5, noi_dung: "Mở rộng kinh doanh và đáp ứng yêu cầu xanh hóa chuỗi cung ứng" }
    ]
  }
];
