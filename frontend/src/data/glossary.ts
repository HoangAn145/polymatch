/**
 * Logistics glossary terms for tooltips and modal explanations (M05.09)
 */

export interface GlossaryTerm {
  thuat_ngu: string;
  ten_day_du: string;
  dinh_nghia: string;
  vi_du: string;
  nhom: string;
}

export const LOGISTICS_GLOSSARY: Record<string, GlossaryTerm> = {
  TMS: {
    thuat_ngu: 'TMS',
    ten_day_du: 'Transportation Management System (Hệ thống Quản lý Vận tải)',
    dinh_nghia: 'Phần mềm chuyên dụng dùng để lập kế hoạch, tối ưu hóa tuyến đường, điều phối phương tiện và theo dõi quá trình giao nhận hàng hóa.',
    vi_du: 'Ví dụ: Điều phối viên dùng TMS để tự động xếp 50 đơn hàng lên 3 xe tải sao cho quãng đường chạy ngắn nhất.',
    nhom: 'Vận tải'
  },
  WMS: {
    thuat_ngu: 'WMS',
    ten_day_du: 'Warehouse Management System (Hệ thống Quản lý Kho)',
    dinh_nghia: 'Hệ thống phần mềm hỗ trợ quản lý toàn diện các hoạt động trong kho từ nhập hàng, định vị vị trí lưu kho (bin/location), nhặt hàng, đóng gói đến xuất kho.',
    vi_du: 'Ví dụ: Thủ kho dùng WMS quét mã vạch để biết chính xác pallet sữa đang ở kệ tầng 3, ô B-12.',
    nhom: 'Kho bãi'
  },
  OMS: {
    thuat_ngu: 'OMS',
    ten_day_du: 'Order Management System (Hệ thống Quản lý Đơn hàng)',
    dinh_nghia: 'Phần mềm quản lý vòng đời của đơn hàng từ lúc khách đặt mua, xác nhận thanh toán, định tuyến đơn sang kho xuất đến theo dõi giao hàng.',
    vi_du: 'Ví dụ: Gom đơn từ Shopee, TikTok Shop và Website về một nơi để xử lý tập trung.',
    nhom: 'Đơn hàng'
  },
  OTIF: {
    thuat_ngu: 'OTIF',
    ten_day_du: 'On-Time In-Full (Giao hàng Đúng hạn và Đủ số lượng)',
    dinh_nghia: 'Chỉ số đo lường hiệu suất logistics phản ánh tỷ lệ phần trăm các đơn hàng được giao đúng thời gian cam kết và đầy đủ số lượng không hư hao.',
    vi_du: 'Ví dụ: Giao 100 đơn, trong đó 95 đơn đúng giờ và đủ hàng thì tỷ lệ OTIF là 95%.',
    nhom: 'Chỉ số KPI'
  },
  ePOD: {
    thuat_ngu: 'ePOD',
    ten_day_du: 'Electronic Proof of Delivery (Xác nhận Giao hàng Điện tử)',
    dinh_nghia: 'Giải pháp thay thế biên bản giao nhận giấy bằng hình thức ký xác nhận trên điện thoại thông minh, chụp ảnh hàng hóa và ghi nhận tọa độ GPS tại thời điểm giao.',
    vi_du: 'Ví dụ: Khách ký tên lên màn hình app của tài xế, kế toán tại văn phòng nhận được ngay chứng từ để xuất hóa đơn.',
    nhom: 'Chứng từ'
  },
  FMS: {
    thuat_ngu: 'FMS',
    ten_day_du: 'Freight Management System (Hệ thống Quản lý Giao nhận Vận tải Quốc tế)',
    dinh_nghia: 'Hệ thống phần mềm quản lý các nghiệp vụ của công ty giao nhận vận tải quốc tế (Forwarder) bao gồm quản lý House/Master B/L, booking, manifest và kế toán cước.',
    vi_du: 'Ví dụ: Quản lý chi tiết lô hàng container nhập khẩu từ Thượng Hải về cảng Cát Lái.',
    nhom: 'Giao nhận'
  },
  GLEC: {
    thuat_ngu: 'GLEC',
    ten_day_du: 'Global Logistics Emissions Council Framework',
    dinh_nghia: 'Khung phương pháp luận quốc tế chuẩn hóa dùng để tính toán và báo cáo lượng phát thải khí nhà kính (CO₂e) xuyên suốt chuỗi cung ứng đa phương thức.',
    vi_du: 'Ví dụ: Tính toán lượng phát thải cho lô hàng 10 tấn vận chuyển bằng xe container từ Bình Dương ra Hà Nội.',
    nhom: 'Logistics xanh'
  },
  RFID: {
    thuat_ngu: 'RFID',
    ten_day_du: 'Radio Frequency Identification (Nhận dạng qua Tần số Sóng vô tuyến)',
    dinh_nghia: 'Công nghệ sử dụng sóng vô tuyến để tự động nhận dạng và theo dõi thẻ gắn trên hàng hóa mà không cần nhìn thấy trực tiếp hay quét qua ống kính như mã vạch.',
    vi_du: 'Ví dụ: Cổng kho tự động kiểm đếm toàn bộ 50 thùng hàng đi qua trong 1 giây mà không cần nhân viên quét từng mã.',
    nhom: 'Công nghệ'
  },
  'Control Tower': {
    thuat_ngu: 'Control Tower',
    ten_day_du: 'Tháp Điều hành Chuỗi Cung ứng (Logistics Control Tower)',
    dinh_nghia: 'Trung tâm giám sát tập trung tích hợp dữ liệu từ mọi nguồn (xe, kho, cảng, hãng tàu) nhằm cung cấp khả năng hiển thị đầu-cuối (end-to-end visibility) và phát hiện sự cố sớm.',
    vi_du: 'Ví dụ: Màn hình trung tâm hiển thị toàn bộ 200 chuyến xe đang chạy trên cả nước kèm trạng thái nhiệt độ thùng lạnh.',
    nhom: 'Vận hành'
  },
  'FIFO/FEFO': {
    thuat_ngu: 'FIFO / FEFO',
    ten_day_du: 'First In First Out / First Expired First Out',
    dinh_nghia: 'Nguyên tắc quản lý kho: FIFO là hàng nhập trước xuất trước; FEFO là hàng có hạn sử dụng gần hơn thì được xuất trước.',
    vi_du: 'Ví dụ: Kho thực phẩm mát bắt buộc xuất các lô sữa chua có date hết hạn sớm hơn trước.',
    nhom: 'Kho bãi'
  }
};

export const LOGISTICS_ARTICLES = [
  {
    id: 'art-01',
    slug: 'lo-trinh-chuyen-doi-so-doanh-nghiep-van-tai-nho-va-vua',
    tieu_de: 'Lộ trình chuyển đổi số thực tế cho doanh nghiệp vận tải nội địa (10 - 50 xe)',
    chuyen_muc: 'TMS-WMS-ERP',
    phan_khuc: 'VT',
    tac_gia: 'Chuyên gia Logistics POLYMATCH',
    ngay_dang: '2026-09-20',
    thoi_gian_doc: '4 phút',
    anh_bia: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tom_tat: 'Vì sao 70% doanh nghiệp vận tải bắt đầu số hóa bằng cách mua phần mềm đắt tiền đều thất bại? Bài học từ bài toán chuẩn hóa dữ liệu lộ trình và tận dụng thiết bị GPS có sẵn.',
    noi_dung: `Phần lớn các doanh nghiệp vận tải đường bộ Việt Nam khi nghĩ đến chuyển đổi số đều kỳ vọng một phần mềm có thể tự động giải quyết mọi việc. Tuy nhiên, nếu dữ liệu đầu vào như địa chỉ giao hàng, định mức dầu và quy trình giao nhận chưa được chuẩn hóa, công nghệ sẽ trở thành gánh nặng.

Bước 1: Chuẩn hóa lệnh điều xe và ghi nhận nhật trình
Thay vì nhắn tin miệng hay chat Zalo rời rạc, hãy đưa toàn bộ lịch điều xe lên một bảng tính dùng chung hoặc mẫu chuẩn. Mỗi chuyến xe cần có thông tin tài xế, số km bắt đầu và kết thúc.

Bước 2: Khai thác kho báu dữ liệu từ thiết bị giám sát hành trình (hộp đen)
Xe tải kinh doanh vận tải tại Việt Nam bắt buộc phải lắp thiết bị GPS. Hãy yêu cầu nhà cung cấp thiết bị mở API hoặc xuất báo cáo định kỳ để theo dõi thời gian dừng đỗ và tốc độ, gắn dữ liệu này vào từng chuyến xe.

Bước 3: Tối ưu chuyến xe chiều về và giảm tỷ lệ chạy rỗng
Chi phí dầu chiếm từ 35-45% chi phí chuyến đi. Việc kết nối mạng lưới hoặc ứng dụng thuật toán ghép chuyến sẽ giúp doanh nghiệp chuyển đổi từ hòa vốn sang sinh lời bền vững.`,
    cta_text: 'Kiểm tra mức độ sẵn sàng số hóa vận tải với Quick Scan miễn phí (2 phút)',
    cta_action: 'quick_scan'
  },
  {
    id: 'art-02',
    slug: 'kiem-ke-ton-kho-chinh-xac-99-phan-tram-khong-can-dau-tu-tien-ty',
    tieu_de: 'Làm thế nào để kho hàng đạt độ chính xác tồn kho 99% mà không cần đầu tư tiền tỷ?',
    chuyen_muc: 'TMS-WMS-ERP',
    phan_khuc: 'KB',
    tac_gia: 'Nguyễn Văn Minh - Chuyên gia Quản trị Kho',
    ngay_dang: '2026-09-18',
    thoi_gian_doc: '5 phút',
    anh_bia: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    tom_tat: 'Phân tích nguyên nhân gốc rễ của sai lệch kho và phương pháp kiểm kê luân phiên (Cycle Counting) kết hợp mã vạch định danh vị trí.',
    noi_dung: `Sai lệch giữa số liệu tồn kho trên sổ sách và thực tế tại các kho bãi SME thường dao động từ 5% đến 15%. Điều này dẫn đến tình trạng hết hàng đột xuất, khách phàn nàn và tốn hàng chục giờ đối soát cuối tháng.

Nguyên nhân gốc rễ không nằm ở việc thiếu robot tự động, mà ở:
1. Thiếu mã định danh vị trí kệ ô (Bin location): Hàng để đâu phụ thuộc vào trí nhớ của thủ kho cũ.
2. Không ghi nhận xuất nhập ngay tại thời điểm thao tác: Nhân viên xuất hàng xong để gom phiếu cuối ngày mới nhập vào máy tính.

Giải pháp từng bước:
- Đặt tên vị trí kệ ô theo quy tắc Dãy - Kệ - Tầng - Ô và in dán mã vạch.
- Trang bị thiết bị quét mã vạch cầm tay hoặc smartphone có camera quét mã.
- Chuyển từ kiểm kê toàn bộ cuối năm sang kiểm kê luân phiên cuốn chiếu 10-15 mặt hàng mỗi ngày.`,
    cta_text: 'Đánh giá khoảng trống năng lực kho bãi của doanh nghiệp bạn',
    cta_action: 'quick_scan'
  },
  {
    id: 'art-03',
    slug: 'chuan-bi-kiem-ke-phat-thai-glec-cho-doanh-nghiep-logistics-xanh',
    tieu_de: 'Chuẩn bị kiểm kê phát thải carbon theo chuẩn GLEC Framework và ISO 14083',
    chuyen_muc: 'Logistics xanh',
    phan_khuc: '3PL',
    tac_gia: 'Viện Nghiên cứu Logistics Xanh',
    ngay_dang: '2026-09-15',
    thoi_gian_doc: '6 phút',
    anh_bia: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    tom_tat: 'Các tập đoàn đa quốc gia và sàn TMĐT đang bắt đầu yêu cầu đối tác vận tải cung cấp báo cáo phát thải CO₂e trên từng chuyến giao.',
    noi_dung: `Xu hướng Logistics Xanh không còn là khẩu hiệu quan hệ công chúng mà đã trở thành tiêu chí chấm thầu bắt buộc của các khách hàng FDI lớn tại Việt Nam.

Khung GLEC (Global Logistics Emissions Council) cung cấp phương pháp luận chuẩn xác để quy đổi lượng dầu diesel tiêu thụ thành lượng khí nhà kính phát thải (gCO₂e/tkm). Để bắt đầu, doanh nghiệp cần ghi nhận chính xác 3 biến số:
1. Trọng lượng hàng chuyên chở thực tế trên từng chặng.
2. Số km quãng đường di chuyển.
3. Số lít nhiên liệu tiêu thụ thực tế.`,
    cta_text: 'Tìm giải pháp công nghệ tính phát thải phù hợp trong danh mục',
    cta_action: 'solutions'
  }
];
