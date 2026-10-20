import { Expert, InsightArticle } from '../types';

export const EXPERTS_DATA: Expert[] = [
  {
    id: "exp-01",
    ho_ten: "TS. Nguyễn Thành Danh",
    chuc_danh: "Chuyên gia Cố vấn Chuyển đổi số Chuỗi cung ứng",
    linh_vuc: ["Vận tải & Định tuyến", "Hệ thống TMS", "Logistics Xanh"],
    so_nam_kinh_nghiem: 18,
    cong_ty_to_chuc: "Viện Nghiên cứu & Phát triển Logistics Việt Nam (VLI)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    gioi_thieu: "Hơn 18 năm kinh nghiệm tư vấn tái cấu trúc mạng lưới logistics cho hơn 60 doanh nghiệp vừa và nhỏ tại Việt Nam. Giảng viên cao cấp về tối ưu vận tải và đo lường phát thải chuỗi cung ứng.",
    cac_goi_phu_trach: ["Basic", "Pro"],
    so_phien_da_tu_van: 48,
    danh_gia_sao: 4.9,
    trang_thai: "san_sang"
  },
  {
    id: "exp-02",
    ho_ten: "ThS. Lê Hoàng Phương",
    chuc_danh: "Chuyên gia Tư vấn Quản trị Kho vận & Tự động hóa",
    linh_vuc: ["Hệ thống WMS", "Layout Kho", "Kiểm soát Tồn kho"],
    so_nam_kinh_nghiem: 14,
    cong_ty_to_chuc: "Nguyên Giám đốc Vận hành Kho vận Sotrans",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    gioi_thieu: "Chuyên gia thiết kế mô hình vận hành kho phân phối, triển khai barcode/RFID và thiết lập chỉ số IRA (độ chính xác tồn kho) cho các chuỗi bán lẻ và 3PL.",
    cac_goi_phu_trach: ["Basic", "Pro"],
    so_phien_da_tu_van: 35,
    danh_gia_sao: 4.8,
    trang_thai: "san_sang"
  },
  {
    id: "exp-03",
    ho_ten: "Trần Minh Tuấn",
    chuc_danh: "Chuyên gia Giải pháp Giao nhận Quốc tế & Hải quan",
    linh_vuc: ["Forwarding FMS", "Hải quan điện tử", "Báo giá cước tự động"],
    so_nam_kinh_nghiem: 16,
    cong_ty_to_chuc: "Hiệp hội Doanh nghiệp Dịch vụ Logistics Việt Nam (VLA)",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    gioi_thieu: "Chuyên gia tư vấn chuyển đổi số cho các công ty Freight Forwarder, chuẩn hóa dữ liệu Manifest và quy trình kiểm soát lợi nhuận theo từng lô hàng xuất nhập khẩu.",
    cac_goi_phu_trach: ["Basic"],
    so_phien_da_tu_van: 29,
    danh_gia_sao: 4.7,
    trang_thai: "san_sang"
  },
  {
    id: "exp-04",
    ho_ten: "Vũ Thị Bích Ngọc",
    chuc_danh: "Chuyên gia Phân tích Chi phí Logistics & Dữ liệu BI",
    linh_vuc: ["Cost-to-Serve", "Power BI Logistics", "Kiến trúc Tích hợp Hệ thống"],
    so_nam_kinh_nghiem: 12,
    cong_ty_to_chuc: "Cố vấn Dữ liệu Doanh nghiệp Chuỗi cung ứng",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    gioi_thieu: "Đã xây dựng mô hình tính giá thành và bóc tách lãi lỗ theo từng tuyến vận tải cho hơn 30 đơn vị vận tải đường bộ. Chuyên gia đào tạo xây dựng Dashboard vận hành logistics.",
    cac_goi_phu_trach: ["Basic", "Pro"],
    so_phien_da_tu_van: 41,
    danh_gia_sao: 5.0,
    trang_thai: "san_sang"
  }
];

export const ARTICLES_DATA: InsightArticle[] = [
  {
    id: "art-01",
    slug: "chuyen-doi-so-logistics-bat-dau-tu-dau-cho-sme",
    tieu_de: "Doanh nghiệp Logistics SME nên bắt đầu chuyển đổi số từ bài toán nào?",
    tom_tat: "Tránh bẫy đầu tư dàn trải phần mềm triệu đô. Khám phá chiến lược giải quyết dứt điểm 3 điểm nghẽn cốt lõi trước khi mở rộng quy mô hệ thống.",
    noi_dung: "Nhiều doanh nghiệp vận tải và kho bãi tại Việt Nam thường vấp phải sai lầm khi mua cùng lúc các hệ thống phần mềm đắt đỏ trong khi quy trình ghi nhận dữ liệu thủ công vẫn chưa được chuẩn hóa. Báo cáo chuyển đổi số cho thấy, hơn 70% dự án thất bại xuất phát từ việc lựa chọn giải pháp vượt quá 1 bậc mức độ trưởng thành hiện tại (LDMI).\n\nBài viết hướng dẫn các bước đi thực tế: từ chuẩn hóa dữ liệu chuyến, áp dụng lệnh điều xe điện tử đến triển khai ứng dụng tài xế ký nhận ePOD để rút ngắn thời gian đối soát cước.",
    chuyen_muc: "Hướng dẫn chọn công nghệ",
    tac_gia: "Ban Biên tập POLYMATCH",
    ngay_dang: "15/10/2026",
    hinh_anh: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
    thoi_gian_doc: "5 phút",
    tags: ["SME Logistics", "Chiến lược", "Lộ trình"]
  },
  {
    id: "art-02",
    slug: "giai-bai-toan-chay-rong-chieu-ve-trong-van-tai-duong-bo",
    tieu_de: "Giải pháp cắt giảm tỷ lệ xe chạy rỗng chiều về cho đội xe vận tải",
    tom_tat: "Chạy rỗng chiếm tới 25-35% chi phí nhiên liệu của đội xe đường bộ. Cách thức ứng dụng công nghệ định tuyến và nền tảng kết nối hàng chiều về.",
    noi_dung: "Theo thống kê từ các doanh nghiệp vận tải container và xe tải nặng tại Việt Nam, chi phí nhiên liệu và phí cầu đường ở chiều xe chạy rỗng đang làm xói mòn biên lợi nhuận ròng. Khi chưa có dữ liệu kết nối thời gian thực, điều phối viên thường để xe quay về mà không thể kịp tìm nguồn hàng ghép.\n\nViệc kết nối định vị GPS với hệ thống quản lý lệnh vận chuyển giúp tự động phát tín hiệu xe rỗi sắp hoàn tất đơn giao, từ đó ghép hàng từ các sàn giao vận hoặc đối tác liên minh.",
    chuyen_muc: "TMS-WMS-ERP",
    tac_gia: "ThS. Nguyễn Thành Danh",
    ngay_dang: "10/10/2026",
    hinh_anh: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600",
    thoi_gian_doc: "7 phút",
    tags: ["Vận tải", "Chạy rỗng", "Nhiên liệu", "TMS"]
  },
  {
    id: "art-03",
    slug: "do-chinh-xac-ton-kho-nang-cao-hieu-suat-kho-hang",
    tieu_de: "Từ ghi sổ Excel sang quản lý vị trí kho: Bước ngoặt nâng cao độ chính xác tồn kho",
    tom_tat: "Cách một kho phân phối thực phẩm giảm 85% thời gian tìm hàng và triệt tiêu tình trạng giao thiếu bằng quy trình mã vạch đơn giản.",
    noi_dung: "Năng suất nhặt hàng và độ chính xác tồn kho (IRA) là hai chỉ số sống còn của mọi trung tâm phân phối. Khi hàng hóa chỉ được xếp theo trí nhớ của thủ kho, giờ cao điểm sẽ dẫn tới tình trạng nhân viên chạy loanh quanh tìm hàng, đơn giao bị trễ và khách hàng khiếu nại.\n\nTriển khai hệ thống mã hóa vị trí ô kệ (Bin Location) kết hợp với máy quét mã vạch cầm tay cho phép thực hiện kiểm kê luân phiên hàng ngày mà không cần dừng hoạt động xuất nhập của kho.",
    chuyen_muc: "Case Study",
    tac_gia: "ThS. Lê Hoàng Phương",
    ngay_dang: "05/10/2026",
    hinh_anh: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600",
    thoi_gian_doc: "6 phút",
    tags: ["WMS", "Kho bãi", "Tồn kho", "Mã vạch"]
  },
  {
    id: "art-04",
    slug: "tinh-toan-phat-thai-co2e-trong-chuoi-cung-ung-xanh",
    tieu_de: "Khung phương pháp GLEC Framework: Doanh nghiệp logistics cần chuẩn bị gì?",
    tom_tat: "Các tập đoàn FDI và chuỗi bán lẻ quốc tế bắt đầu đưa chỉ tiêu phát thải carbon vào điều kiện đấu thầu dịch vụ vận tải.",
    noi_dung: "Xanh hóa logistics không còn là câu chuyện xa vời khi các nhà sản xuất xuất khẩu sang thị trường Châu Âu và Mỹ đối mặt với cơ chế điều chỉnh biên giới carbon (CBAM). Các nhà cung cấp dịch vụ logistics (3PL/Forwarder) tại Việt Nam phải chứng minh năng lực đo đạc phát thải theo tấn-km (gCO2e/tkm).\n\nBài viết diễn giải cấu trúc đo lường từ giếng dầu đến bánh xe (Well-to-Wheel) và các bước thu thập dữ liệu tiêu thụ nhiên liệu diesel từng cung đường để sẵn sàng xuất chứng chỉ phát thải hợp chuẩn ISO 14083.",
    chuyen_muc: "Logistics Xanh",
    tac_gia: "Ban Nghiên cứu Chính sách POLYMATCH",
    ngay_dang: "28/09/2026",
    hinh_anh: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=600",
    thoi_gian_doc: "8 phút",
    tags: ["Logistics xanh", "ESG", "Phát thải", "GLEC"]
  }
];
