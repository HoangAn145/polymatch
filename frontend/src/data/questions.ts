/**
 * Questions dataset for POLYMATCH Logistics
 * Derived directly from BANG_CAU_HOI_CAI_TIEN.xlsx
 */

export type BranchCode = 'VT' | 'FF' | 'KB' | '3PL' | 'LM' | 'KH';
export type GroupCode = 'VT' | 'KB' | 'GN' | 'DH' | 'HT' | 'CT' | 'CP' | 'XA';

export interface QuestionOption {
  muc: number; // 1 to 5
  noi_dung: string;
}

export interface Question {
  id: string;
  ma: string;
  phan: 'phan_loai' | 'quick' | 'dbi' | 'ldmi' | 'chi_so' | 'uu_tien';
  nhom_nang_luc?: GroupCode;
  ten_nhom?: string;
  tru_cot_dbi?: 'khach_hang' | 'chien_luoc' | 'cong_nghe' | 'van_hanh' | 'van_hoa' | 'du_lieu';
  nhanh_ap_dung: BranchCode[];
  noi_dung: string;
  loai_tra_loi: 'muc_1_5' | 'chon_1' | 'chon_nhieu' | 'so' | 'tu_do';
  phuong_an?: QuestionOption[];
  ma_khoang_trong?: string;
  bat_buoc: boolean;
  thu_tu: number;
  y_nghia?: string;
  dieu_kien_chan?: string;
}

// 1. Phân loại doanh nghiệp (C01 - C06)
export const QUESTIONS_PHAN_LOAI = [
  {
    ma: 'C01',
    noi_dung: 'Số lao động tham gia bảo hiểm xã hội bình quân năm',
    lua_chon: [
      { id: 'duoi_10', text: 'Không quá 10 người' },
      { id: '10_50', text: 'Trên 10 đến 50 người' },
      { id: '50_100', text: 'Trên 50 đến 100 người' },
      { id: 'tren_100', text: 'Trên 100 người' },
    ]
  },
  {
    ma: 'C02',
    noi_dung: 'Tổng doanh thu năm trước liền kề',
    lua_chon: [
      { id: 'duoi_10', text: 'Không quá 10 tỷ đồng' },
      { id: '10_100', text: 'Trên 10 đến 100 tỷ đồng' },
      { id: '100_300', text: 'Trên 100 đến 300 tỷ đồng' },
      { id: 'tren_300', text: 'Trên 300 tỷ đồng' },
    ]
  },
  {
    ma: 'C03',
    noi_dung: 'Tổng nguồn vốn cuối năm trước liền kề',
    lua_chon: [
      { id: 'duoi_3', text: 'Không quá 3 tỷ đồng' },
      { id: '3_50', text: 'Trên 3 đến 50 tỷ đồng' },
      { id: '50_100', text: 'Trên 50 đến 100 tỷ đồng' },
      { id: 'tren_100', text: 'Trên 100 tỷ đồng' },
    ]
  },
  {
    ma: 'C04',
    noi_dung: 'Hoạt động logistics chính của doanh nghiệp',
    lua_chon: [
      { id: 'VT', text: 'Vận tải nội địa (VT)' },
      { id: 'FF', text: 'Giao nhận quốc tế / Freight Forwarding (FF)' },
      { id: 'KB', text: 'Dịch vụ Kho bãi (KB)' },
      { id: '3PL', text: '3PL / 4PL - Logistics tổng thể (3PL)' },
      { id: 'LM', text: 'Giao hàng chặng cuối / Last Mile (LM)' },
      { id: 'KH', text: 'Khác (có hoạt động logistics riêng)' },
      { id: 'TECH', text: 'Công ty cung cấp phần mềm, nền tảng logistics (Chuyển sang Vendor)' }
    ]
  },
  {
    ma: 'C05',
    noi_dung: 'Dành riêng cho 3PL: Dịch vụ đang cung cấp (chọn nhiều)',
    lua_chon: [
      { id: 'VT', text: 'Vận tải hàng hóa' },
      { id: 'KB', text: 'Kho bãi & lưu trữ' },
      { id: 'GN', text: 'Giao nhận quốc tế' },
      { id: 'LM', text: 'Giao hàng chặng cuối' },
      { id: 'COLD', text: 'Chuỗi cung ứng lạnh' },
      { id: 'VAS', text: 'Dịch vụ giá trị gia tăng (đóng gói, dán nhãn)' },
    ]
  },
  {
    ma: 'C06',
    noi_dung: 'Quy mô đặc thù theo nhánh (Số lượng xe / Số lô tháng / Diện tích kho m²)',
    lua_chon: [],
    goi_y: 'Ví dụ: 30 xe tải, 5.000m² kho, 300 lô hàng/tháng...'
  }
];

// 2. Quick Scan - 10 câu hỏi (~2 phút)
export const QUESTIONS_QUICK_SCAN = [
  {
    ma: 'Q01',
    cau_hoi: 'Hoạt động logistics chính của doanh nghiệp là gì?',
    loai: 'chon_1',
    lua_chon: [
      { id: 'VT', text: 'Vận tải nội địa' },
      { id: 'FF', text: 'Giao nhận quốc tế (Freight Forwarding)' },
      { id: 'KB', text: 'Kho bãi' },
      { id: '3PL', text: '3PL / Logistics tổng thể' },
      { id: 'LM', text: 'Giao hàng chặng cuối' },
      { id: 'KH', text: 'Khác' },
    ]
  },
  {
    ma: 'Q02',
    cau_hoi: 'Quy mô hoạt động chính của doanh nghiệp?',
    loai: 'chon_1',
    lua_chon: [
      { id: 'micro', text: 'Dưới 10 xe / Dưới 1.000m² kho / Dưới 50 lô/tháng' },
      { id: 'small', text: '10 - 30 xe / 1.000 - 5.000m² kho / 50 - 200 lô/tháng' },
      { id: 'medium', text: '31 - 100 xe / 5.000 - 20.000m² kho / 200 - 1.000 lô/tháng' },
      { id: 'large', text: 'Trên 100 xe / Trên 20.000m² kho / Trên 1.000 lô/tháng' },
    ]
  },
  {
    ma: 'Q03',
    cau_hoi: 'Doanh nghiệp có dùng phần mềm quản lý vận tải (TMS) không?',
    loai: 'chon_1',
    nhom_lien_quan: 'VT',
    lua_chon: [
      { id: 'co', text: 'Có, phần mềm chuyên dụng' },
      { id: 'chua', text: 'Chưa, chủ yếu điều hành qua điện thoại / Zalo / Excel' },
      { id: 'khong_ap_dung', text: 'Không áp dụng hoạt động vận tải' },
    ]
  },
  {
    ma: 'Q04',
    cau_hoi: 'Doanh nghiệp có dùng phần mềm quản lý kho (WMS) không?',
    loai: 'chon_1',
    nhom_lien_quan: 'KB',
    lua_chon: [
      { id: 'co', text: 'Có, phần mềm WMS chuyên dụng' },
      { id: 'chua', text: 'Chưa, quản lý sổ tay hoặc file Excel' },
      { id: 'khong_ap_dung', text: 'Không quản lý kho hàng' },
    ]
  },
  {
    ma: 'Q05',
    cau_hoi: 'Việc điều phối hoặc lập kế hoạch vận hành chủ yếu làm bằng gì?',
    loai: 'chon_1',
    nhom_lien_quan: 'CP',
    lua_chon: [
      { id: 'zalo', text: 'Điện thoại, trao đổi qua nhóm Zalo' },
      { id: 'excel', text: 'Lập bảng tính Excel / Google Sheets' },
      { id: 'software', text: 'Phần mềm có thuật toán hỗ trợ tự động' },
    ]
  },
  {
    ma: 'Q06',
    cau_hoi: 'Doanh nghiệp có biết vị trí xe hoặc lô hàng theo thời gian thực không?',
    loai: 'chon_1',
    nhom_lien_quan: 'HT',
    lua_chon: [
      { id: 'co_lien_tuc', text: 'Có, hiển thị liên tục trên bản đồ hệ thống' },
      { id: 'co_dinh_vi_rieng', text: 'Có thiết bị GPS nhưng phải vào app riêng của hãng định vị để xem' },
      { id: 'chua_co', text: 'Chưa theo dõi được hoặc phải gọi tài xế' },
    ]
  },
  {
    ma: 'Q07',
    cau_hoi: 'Khách hàng có tự tra cứu được tình trạng hàng qua web/app không?',
    loai: 'chon_1',
    nhom_lien_quan: 'HT',
    lua_chon: [
      { id: 'co', text: 'Có cổng tra cứu trực tuyến tự phục vụ' },
      { id: 'khong', text: 'Không, khách gọi điện hoặc nhắn tin hỏi nhân viên' },
    ]
  },
  {
    ma: 'Q08',
    cau_hoi: 'Số liệu tồn kho trên hệ thống có khớp với thực tế không?',
    loai: 'chon_1',
    nhom_lien_quan: 'KB',
    lua_chon: [
      { id: 'luon_khop', text: 'Luôn khớp hoặc sai số rất nhỏ (<1%)' },
      { id: 'thinh_thoang', text: 'Thỉnh thoảng lệch khi kiểm kê' },
      { id: 'thuong_xuyen', text: 'Thường xuyên lệch, phải đối soát mệt mỏi' },
      { id: 'khong_kho', text: 'Không quản lý kho' },
    ]
  },
  {
    ma: 'Q09',
    cau_hoi: 'Doanh nghiệp có bảng điều khiển (Dashboard) theo dõi chỉ số vận hành không?',
    loai: 'chon_1',
    nhom_lien_quan: 'CP',
    lua_chon: [
      { id: 'co', text: 'Có báo cáo Dashboard cập nhật tự động' },
      { id: 'khong', text: 'Chưa có, tổng hợp thủ công cuối tháng' },
    ]
  },
  {
    ma: 'Q10',
    cau_hoi: 'Vấn đề logistics nhức nhối nhất hiện tại của doanh nghiệp là gì?',
    loai: 'chon_1',
    lua_chon: [
      { id: 'chi_phi_cao', text: 'Chi phí nhiên liệu & vận hành cao, khó kiểm soát lợi nhuận từng tuyến' },
      { id: 'chay_rong', text: 'Tỷ lệ xe chạy rỗng chiều về lớn' },
      { id: 'khong_theo_doi', text: 'Không theo dõi được vị trí và tiến độ giao hàng tức thời' },
      { id: 'lech_ton_kho', text: 'Số liệu tồn kho không chính xác, nhầm lẫn hàng' },
      { id: 'chung_tu_cham', text: 'Chứng từ giấy tờ chậm trễ, sai sót, đối soát cước lâu' },
      { id: 'giao_tre', text: 'Khó kiểm soát tỷ lệ giao hàng đúng hạn đủ hàng (OTIF)' },
      { id: 'khac', text: 'Vấn đề quản lý nội bộ rời rạc khác' },
    ]
  }
];

// 3. Phần chung DBI - 12 câu, 2 câu mỗi trụ cột (Áp dụng cho mọi nhánh)
export const QUESTIONS_DBI: Question[] = [
  {
    id: 'D01',
    ma: 'D01',
    phan: 'dbi',
    tru_cot_dbi: 'khach_hang',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Khách hàng liên hệ và làm việc với doanh nghiệp qua những kênh nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 1,
    phuong_an: [
      { muc: 1, noi_dung: '1. Gặp trực tiếp và gọi điện thoại truyền thống' },
      { muc: 2, noi_dung: '2. Thêm trao đổi qua Zalo hoặc email' },
      { muc: 3, noi_dung: '3. Website và kênh số có quy trình tiếp nhận bài bản' },
      { muc: 4, noi_dung: '4. Cổng khách hàng tự phục vụ (tạo đơn, tra cứu vận đơn)' },
      { muc: 5, noi_dung: '5. Kênh số cá nhân hóa theo dữ liệu lịch sử của từng khách' },
    ]
  },
  {
    id: 'D02',
    ma: 'D02',
    phan: 'dbi',
    tru_cot_dbi: 'khach_hang',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp đo mức độ hài lòng của khách hàng như thế nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 2,
    phuong_an: [
      { muc: 1, noi_dung: '1. Không đo lường' },
      { muc: 2, noi_dung: '2. Chỉ ghi nhận khi có khiếu nại phát sinh' },
      { muc: 3, noi_dung: '3. Khảo sát định kỳ (quý / năm)' },
      { muc: 4, noi_dung: '4. Đo tự động sau từng giao dịch / chuyến giao hàng' },
      { muc: 5, noi_dung: '5. Phân tích dữ liệu hành vi để phát hiện khách có nguy cơ rời bỏ' },
    ]
  },
  {
    id: 'D03',
    ma: 'D03',
    phan: 'dbi',
    tru_cot_dbi: 'chien_luoc',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp có chiến lược chuyển đổi số chưa?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 3,
    phuong_an: [
      { muc: 1, noi_dung: '1. Chưa có định hướng cụ thể' },
      { muc: 2, noi_dung: '2. Có ý tưởng nhưng chưa thành văn bản kế hoạch' },
      { muc: 3, noi_dung: '3. Đã có văn bản, mục tiêu và lộ trình thực hiện' },
      { muc: 4, noi_dung: '4. Có chỉ số KPI số hóa, người chịu trách nhiệm và rà soát định kỳ' },
      { muc: 5, noi_dung: '5. Chiến lược số gắn kết chặt chẽ với đối tác và toàn bộ chuỗi cung ứng' },
    ]
  },
  {
    id: 'D04',
    ma: 'D04',
    phan: 'dbi',
    tru_cot_dbi: 'chien_luoc',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Ngân sách cho công nghệ được bố trí như thế nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 4,
    phuong_an: [
      { muc: 1, noi_dung: '1. Không có ngân sách riêng' },
      { muc: 2, noi_dung: '2. Chỉ chi khi có sự cố hoặc nhu cầu cấp bách phát sinh' },
      { muc: 3, noi_dung: '3. Có ngân sách cố định hằng năm cho CNTT' },
      { muc: 4, noi_dung: '4. Phân bổ linh hoạt theo hiệu quả đầu tư (ROI) đã đo lường' },
      { muc: 5, noi_dung: '5. Đầu tư theo danh mục đổi mới sáng tạo, đánh giá hiệu quả định kỳ' },
    ]
  },
  {
    id: 'D05',
    ma: 'D05',
    phan: 'dbi',
    tru_cot_dbi: 'cong_nghe',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Dữ liệu và phần mềm của doanh nghiệp được lưu và chạy ở đâu?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 5,
    phuong_an: [
      { muc: 1, noi_dung: '1. Trên máy tính cá nhân của nhân viên' },
      { muc: 2, noi_dung: '2. Có lưu trữ đám mây cơ bản (Google Drive, Dropbox)' },
      { muc: 3, noi_dung: '3. Các phần mềm nghiệp vụ chính chạy trên nền tảng đám mây' },
      { muc: 4, noi_dung: '4. Toàn bộ hệ thống chạy Cloud, truy cập an toàn từ xa mọi nơi' },
      { muc: 5, noi_dung: '5. Hạ tầng đám mây hiện đại, tự động sao lưu, co giãn và phục hồi' },
    ]
  },
  {
    id: 'D06',
    ma: 'D06',
    phan: 'dbi',
    tru_cot_dbi: 'cong_nghe',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'An toàn thông tin được bảo đảm như thế nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 6,
    phuong_an: [
      { muc: 1, noi_dung: '1. Chưa có biện pháp bảo mật nào' },
      { muc: 2, noi_dung: '2. Chỉ dùng mật khẩu cá nhân đơn giản' },
      { muc: 3, noi_dung: '3. Phân quyền tài khoản người dùng và sao lưu định kỳ' },
      { muc: 4, noi_dung: '4. Có chính sách bảo mật nội bộ và đào tạo định kỳ cho nhân viên' },
      { muc: 5, noi_dung: '5. Đạt tiêu chuẩn an toàn thông tin (như ISO 27001) và giám sát liên tục' },
    ]
  },
  {
    id: 'D07',
    ma: 'D07',
    phan: 'dbi',
    tru_cot_dbi: 'van_hanh',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Các nghiệp vụ chung như kế toán, nhân sự, hành chính được thực hiện ra sao?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 7,
    phuong_an: [
      { muc: 1, noi_dung: '1. Phần lớn làm trên giấy tờ truyền thống' },
      { muc: 2, noi_dung: '2. Dùng một số phần mềm rời rạc chưa kết nối' },
      { muc: 3, noi_dung: '3. Đã có phần mềm chuyên nghiệp cho từng phòng ban' },
      { muc: 4, noi_dung: '4. Các phần mềm nghiệp vụ kết nối và đồng bộ dữ liệu với nhau' },
      { muc: 5, noi_dung: '5. Tự động hóa toàn diện các luồng duyệt và xử lý liên phòng ban' },
    ]
  },
  {
    id: 'D08',
    ma: 'D08',
    phan: 'dbi',
    tru_cot_dbi: 'van_hanh',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Công việc nội bộ được giao và theo dõi như thế nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 8,
    phuong_an: [
      { muc: 1, noi_dung: '1. Giao miệng hoặc viết giấy ghi chú' },
      { muc: 2, noi_dung: '2. Trao đổi qua các nhóm chat Zalo' },
      { muc: 3, noi_dung: '3. Dùng công cụ quản lý công việc chuyên dụng (Trello, Base, Jira...)' },
      { muc: 4, noi_dung: '4. Quy trình số hóa có gắn thời hạn và theo dõi tiến độ tự động' },
      { muc: 5, noi_dung: '5. Hệ thống tự động giao việc theo thuật toán và báo cáo tức thời' },
    ]
  },
  {
    id: 'D09',
    ma: 'D09',
    phan: 'dbi',
    tru_cot_dbi: 'van_hoa',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Nhân sự vận hành (tài xế, thủ kho, điều phối) sử dụng công cụ số ở mức nào?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 9,
    phuong_an: [
      { muc: 1, noi_dung: '1. Hầu như không dùng phần mềm' },
      { muc: 2, noi_dung: '2. Dùng điện thoại thông minh ở mức nghe gọi nhắn tin cơ bản' },
      { muc: 3, noi_dung: '3. Thành thạo phần mềm nghiệp vụ được trang bị' },
      { muc: 4, noi_dung: '4. Được đào tạo nâng cao kỹ năng số định kỳ' },
      { muc: 5, noi_dung: '5. Chủ động đề xuất cải tiến quy trình bằng công cụ số' },
    ]
  },
  {
    id: 'D10',
    ma: 'D10',
    phan: 'dbi',
    tru_cot_dbi: 'van_hoa',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Ai phụ trách chuyển đổi số tại doanh nghiệp?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 10,
    phuong_an: [
      { muc: 1, noi_dung: '1. Không có ai phụ trách' },
      { muc: 2, noi_dung: '2. Có người kiêm nhiệm nhưng không có quyền quyết định' },
      { muc: 3, noi_dung: '3. Có nhân sự hoặc bộ phận chuyên trách rõ ràng' },
      { muc: 4, noi_dung: '4. Có Ban chỉ đạo chuyển đổi số gồm đại diện các phòng ban' },
      { muc: 5, noi_dung: '5. Lãnh đạo cấp cao nhất trực tiếp định hướng và dẫn dắt' },
    ]
  },
  {
    id: 'D11',
    ma: 'D11',
    phan: 'dbi',
    tru_cot_dbi: 'du_lieu',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Dữ liệu vận hành của doanh nghiệp đang nằm ở đâu?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 11,
    phuong_an: [
      { muc: 1, noi_dung: '1. Rải rác trên giấy tờ và máy tính cá nhân' },
      { muc: 2, noi_dung: '2. Nhiều file Excel khác nhau, nhiều phiên bản' },
      { muc: 3, noi_dung: '3. Tập trung trong cơ sở dữ liệu của phần mềm quản lý' },
      { muc: 4, noi_dung: '4. Có quy chuẩn rõ ràng về việc ai nhập, nhập thế nào và kiểm duyệt' },
      { muc: 5, noi_dung: '5. Kho dữ liệu tập trung (Data Warehouse), chất lượng được kiểm soát liên tục' },
    ]
  },
  {
    id: 'D12',
    ma: 'D12',
    phan: 'dbi',
    tru_cot_dbi: 'du_lieu',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp khai thác dữ liệu để làm gì?',
    loai_tra_loi: 'muc_1_5',
    bat_buoc: true,
    thu_tu: 12,
    phuong_an: [
      { muc: 1, noi_dung: '1. Hầu như chưa khai thác' },
      { muc: 2, noi_dung: '2. Xem số liệu thống kê đơn giản khi cần' },
      { muc: 3, noi_dung: '3. Lập báo cáo kết quả kinh doanh định kỳ' },
      { muc: 4, noi_dung: '4. Phân tích dữ liệu để tìm nguyên nhân gốc rễ của vấn đề' },
      { muc: 5, noi_dung: '5. Ứng dụng mô hình dự báo và tối ưu hóa vận hành tự động' },
    ]
  }
];

// 4. Phần chuyên ngành Logistics LDMI - 24 câu, 8 nhóm năng lực (Lọc theo nhánh R02)
export const QUESTIONS_LDMI: Question[] = [
  // Nhóm VT - Vận tải
  {
    id: 'VT1',
    ma: 'VT1',
    phan: 'ldmi',
    nhom_nang_luc: 'VT',
    ten_nhom: 'Vận tải',
    nhanh_ap_dung: ['VT', '3PL', 'LM'],
    noi_dung: 'Việc điều phối xe hằng ngày của doanh nghiệp được thực hiện như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-VT-01',
    bat_buoc: true,
    thu_tu: 13,
    y_nghia: 'Kiểm soát tính tức thời và tối ưu hóa việc phân bổ phương tiện, tránh phụ thuộc vào cá nhân điều phối.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Qua điện thoại hoặc Zalo, không lưu vết lịch sử' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Lịch xe ghi trên bảng tính Excel hoặc file dùng chung' },
      { muc: 3, noi_dung: '3. Tích hợp: Lập lệnh điều xe chính thức trên phần mềm quản lý vận tải (TMS)' },
      { muc: 4, noi_dung: '4. Hiển thị: Phần mềm tự gợi ý xe phù hợp theo tải trọng, thể tích và vị trí' },
      { muc: 5, noi_dung: '5. Thông minh: Hệ thống tự điều phối theo thuật toán tối ưu, người điều phối chỉ việc duyệt' },
    ]
  },
  {
    id: 'VT2',
    ma: 'VT2',
    phan: 'ldmi',
    nhom_nang_luc: 'VT',
    ten_nhom: 'Vận tải',
    nhanh_ap_dung: ['VT', '3PL', 'LM'],
    noi_dung: 'Tuyến đường cho mỗi chuyến được lập như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-VT-02',
    bat_buoc: true,
    thu_tu: 14,
    y_nghia: 'Tối ưu quãng đường và chi phí nhiên liệu, giảm km chạy rỗng và giao trễ hạn.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Tài xế tự chọn lộ trình theo kinh nghiệm cá nhân' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Điều phối viên tự kẻ đường hoặc đo tay trên Google Maps' },
      { muc: 3, noi_dung: '3. Tích hợp: Phần mềm gợi ý tuyến đường cho từng chuyến riêng lẻ' },
      { muc: 4, noi_dung: '4. Hiển thị: Thuật toán tối ưu tuyến cho nhiều điểm giao, nhiều xe, có ràng buộc giờ giao hàng' },
      { muc: 5, noi_dung: '5. Thông minh: Tối ưu tuyến động theo tình hình giao thông thực tế theo thời gian thực' },
    ]
  },
  {
    id: 'VT3',
    ma: 'VT3',
    phan: 'ldmi',
    nhom_nang_luc: 'VT',
    ten_nhom: 'Vận tải',
    nhanh_ap_dung: ['VT', '3PL', 'LM'],
    noi_dung: 'Dữ liệu định vị và vận hành xe được sử dụng như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-VT-03',
    bat_buoc: true,
    thu_tu: 15,
    y_nghia: 'Biến thiết bị giám sát hành trình thành công cụ sinh lợi, kiểm soát an toàn và bảo dưỡng dự phòng.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Chỉ có thiết bị giám sát hành trình (hộp đen) theo quy định, không khai thác dữ liệu' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Vào xem vị trí xe trên ứng dụng của nhà cung cấp thiết bị khi cần kiểm tra' },
      { muc: 3, noi_dung: '3. Tích hợp: Có cài đặt cảnh báo dừng đỗ, quá tốc độ, tiêu hao nhiên liệu' },
      { muc: 4, noi_dung: '4. Hiển thị: Dữ liệu GPS được tích hợp thẳng vào từng chuyến và đơn hàng trong phần mềm vận tải' },
      { muc: 5, noi_dung: '5. Thông minh: Dữ liệu vận hành được dùng để chấm điểm tài xế và cảnh báo bảo trì dự phòng' },
    ]
  },

  // Nhóm KB - Kho bãi
  {
    id: 'KB1',
    ma: 'KB1',
    phan: 'ldmi',
    nhom_nang_luc: 'KB',
    ten_nhom: 'Kho bãi',
    nhanh_ap_dung: ['KB', '3PL'],
    noi_dung: 'Nhập, xuất, tồn kho được quản lý như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-KB-01',
    bat_buoc: true,
    thu_tu: 16,
    y_nghia: 'Quản lý chính xác vị trí ô kệ, số lô, hạn dùng (FIFO/FEFO), tránh nhầm lẫn thất thoát hàng hóa.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Ghi chép sổ tay hoặc thẻ kho thủ công' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Quản lý trên các bảng tính Excel rời rạc' },
      { muc: 3, noi_dung: '3. Tích hợp: Dùng phần mềm quản lý kho cơ bản (nhập, xuất, tồn)' },
      { muc: 4, noi_dung: '4. Hiển thị: Phần mềm WMS quản lý chi tiết theo vị trí kệ ô, số lô, hạn dùng, FIFO/FEFO' },
      { muc: 5, noi_dung: '5. Thông minh: Hệ thống WMS thông minh tự động phân bổ vị trí lưu trữ và tối ưu đường đi lấy hàng' },
    ]
  },
  {
    id: 'KB2',
    ma: 'KB2',
    phan: 'ldmi',
    nhom_nang_luc: 'KB',
    ten_nhom: 'Kho bãi',
    nhanh_ap_dung: ['KB', '3PL'],
    noi_dung: 'Hàng hóa được nhận diện trong kho như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-KB-01',
    bat_buoc: true,
    thu_tu: 17,
    y_nghia: 'Tự động hóa nhận diện mã vạch/QR/RFID, tăng năng suất lấy hàng và triệt tiêu lỗi nhặt nhầm đơn.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Nhận diện bằng mắt thường, hàng không dán mã định danh' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Có mã vạch hoặc mã QR nhưng chỉ quét tại khâu nhập hoặc xuất' },
      { muc: 3, noi_dung: '3. Tích hợp: Quét mã định danh ở tất cả các khâu: nhập, cất kệ, lấy hàng, xuất' },
      { muc: 4, noi_dung: '4. Hiển thị: Quét bằng thiết bị cầm tay chuyên dụng (PDA/scanner), dữ liệu cập nhật tức thời vào WMS' },
      { muc: 5, noi_dung: '5. Thông minh: Nhận diện tự động qua RFID hoặc camera AI, đối soát kiểm đếm không cần quét tay' },
    ]
  },
  {
    id: 'KB3',
    ma: 'KB3',
    phan: 'ldmi',
    nhom_nang_luc: 'KB',
    ten_nhom: 'Kho bãi',
    nhanh_ap_dung: ['KB', '3PL'],
    noi_dung: 'Việc kiểm kê và đối chiếu tồn kho được thực hiện như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-KB-02',
    bat_buoc: true,
    thu_tu: 18,
    y_nghia: 'Đạt độ chính xác tồn kho >98%, chuyển từ kiểm kê cuối kỳ sang kiểm kê cuốn chiếu liên tục.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không kiểm kê định kỳ, chỉ kiểm tra khi phát sinh thất thoát' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Kiểm kê toàn bộ kho vào cuối kỳ, thường lệch số liệu nhiều' },
      { muc: 3, noi_dung: '3. Tích hợp: Kiểm kê định kỳ theo kế hoạch và có đo tỷ lệ lệch kho' },
      { muc: 4, noi_dung: '4. Hiển thị: Kiểm kê luân phiên cuốn chiếu theo nhóm hàng, độ chính xác cao (>98%)' },
      { muc: 5, noi_dung: '5. Thông minh: Đối soát liên tục thời gian thực, hệ thống tự phát hiện chênh lệch bất thường' },
    ]
  },

  // Nhóm GN - Giao nhận quốc tế
  {
    id: 'GN1',
    ma: 'GN1',
    phan: 'ldmi',
    nhom_nang_luc: 'GN',
    ten_nhom: 'Giao nhận quốc tế',
    nhanh_ap_dung: ['FF', '3PL'],
    noi_dung: 'Báo giá cho khách hàng được lập như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-GN-01',
    bat_buoc: true,
    thu_tu: 19,
    y_nghia: 'Rút ngắn thời gian phản hồi báo giá từ 24h xuống vài phút, tăng tỷ lệ chốt đơn hàng xuất nhập khẩu.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Tính giá thủ công bằng tay, gửi qua email' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Dùng bảng giá cước Excel mẫu lưu trên máy' },
      { muc: 3, noi_dung: '3. Tích hợp: Dùng phần mềm tự tính giá theo bảng cước lưu trữ' },
      { muc: 4, noi_dung: '4. Hiển thị: Báo giá tự động theo tuyến và loại hàng, lưu lịch sử để đo tỷ lệ chốt' },
      { muc: 5, noi_dung: '5. Thông minh: Báo giá tự động cập nhật theo giá cước thị trường thời gian thực của nhiều hãng' },
    ]
  },
  {
    id: 'GN2',
    ma: 'GN2',
    phan: 'ldmi',
    nhom_nang_luc: 'GN',
    ten_nhom: 'Giao nhận quốc tế',
    nhanh_ap_dung: ['FF', '3PL'],
    noi_dung: 'Lô hàng và booking được quản lý như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-GN-02',
    bat_buoc: true,
    thu_tu: 20,
    y_nghia: 'Đồng bộ hóa vận đơn, chứng từ và tiến độ lô hàng từ khi book chỗ đến khi thanh toán cước.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Qua email và các file Excel rời rạc' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Chỉ ghi nhận theo dõi trên phần mềm kế toán' },
      { muc: 3, noi_dung: '3. Tích hợp: Có phần mềm giao nhận (FMS) quản lý lô hàng và khách hàng' },
      { muc: 4, noi_dung: '4. Hiển thị: Phần mềm FMS kết nối đồng bộ với chứng từ và kế toán' },
      { muc: 5, noi_dung: '5. Thông minh: Kết nối trực tiếp qua EDI/API với hãng tàu, hãng hàng không, trạng thái cập nhật tự động' },
    ]
  },
  {
    id: 'GN3',
    ma: 'GN3',
    phan: 'ldmi',
    nhom_nang_luc: 'GN',
    ten_nhom: 'Giao nhận quốc tế',
    nhanh_ap_dung: ['FF', '3PL'],
    noi_dung: 'Tình trạng lô hàng quốc tế được theo dõi như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-GN-02',
    bat_buoc: true,
    thu_tu: 21,
    y_nghia: 'Dự báo thời gian hàng đến (ETA) chính xác và chủ động cảnh báo trễ hạn cho khách hàng.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Gọi điện hoặc email hỏi hãng khi khách yêu cầu' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Tra cứu thủ công trên trang web của từng hãng tàu/bay' },
      { muc: 3, noi_dung: '3. Tích hợp: Dùng công cụ tra cứu tập trung kết nối nhiều hãng' },
      { muc: 4, noi_dung: '4. Hiển thị: Hệ thống cập nhật trạng thái tự động và có cảnh báo khi có sự cố trễ' },
      { muc: 5, noi_dung: '5. Thông minh: Dự báo thời gian hàng đến (ETA) chính xác và gửi cảnh báo chủ động cho khách' },
    ]
  },

  // Nhóm DH - Đơn hàng & hoàn tất đơn
  {
    id: 'DH1',
    ma: 'DH1',
    phan: 'ldmi',
    nhom_nang_luc: 'DH',
    ten_nhom: 'Đơn hàng & hoàn tất đơn',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Đơn hàng từ khách được tiếp nhận như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-DH-01',
    bat_buoc: true,
    thu_tu: 22,
    y_nghia: 'Số hóa đầu vào luồng đơn, loại bỏ sai sót do nhập lại dữ liệu thủ công.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Qua điện thoại hoặc tin nhắn Zalo' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Nhận file Excel qua email rồi nhân viên nhập tay lại' },
      { muc: 3, noi_dung: '3. Tích hợp: Nhập trực tiếp vào phần mềm quản lý đơn hàng (OMS)' },
      { muc: 4, noi_dung: '4. Hiển thị: Khách hàng tự tạo đơn qua cổng thông tin hoặc kết nối API hệ thống' },
      { muc: 5, noi_dung: '5. Thông minh: Đơn hàng truyền tự động từ hệ thống của khách, tự phân bổ kho và điều xe' },
    ]
  },
  {
    id: 'DH2',
    ma: 'DH2',
    phan: 'ldmi',
    nhom_nang_luc: 'DH',
    ten_nhom: 'Đơn hàng & hoàn tất đơn',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Việc xác nhận đã giao hàng (Proof of Delivery - ePOD) được thực hiện như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-DH-02',
    bat_buoc: true,
    thu_tu: 23,
    y_nghia: 'Số hóa biên bản giao nhận có chữ ký số/ảnh chụp, rút ngắn thời gian đối soát cước và thu hồi công nợ.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Ký biên bản giao nhận bằng giấy truyền thống' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Tài xế chụp ảnh biên bản gửi qua nhóm Zalo' },
      { muc: 3, noi_dung: '3. Tích hợp: Ứng dụng nội bộ để chụp ảnh biên bản và chữ ký' },
      { muc: 4, noi_dung: '4. Hiển thị: Xác nhận giao hàng điện tử (ePOD) trên app tài xế, đồng bộ ngay với phần mềm vận tải' },
      { muc: 5, noi_dung: '5. Thông minh: Xác nhận giao gửi ngay tức thì cho khách hàng và tự động kích hoạt đối soát cước' },
    ]
  },
  {
    id: 'DH3',
    ma: 'DH3',
    phan: 'ldmi',
    nhom_nang_luc: 'DH',
    ten_nhom: 'Đơn hàng & hoàn tất đơn',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Tỷ lệ giao đúng hạn và đủ hàng (OTIF) được đo như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-DH-03',
    bat_buoc: true,
    thu_tu: 24,
    y_nghia: 'Đo lường cam kết SLA với khách hàng FDI và chuỗi bán lẻ, cảnh báo nguy cơ trễ cam kết trước khi xảy ra.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không đo lường' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Ước lượng cảm tính của bộ phận điều hành' },
      { muc: 3, noi_dung: '3. Tích hợp: Tổng hợp và đo thủ công hằng tháng trên Excel' },
      { muc: 4, noi_dung: '4. Hiển thị: Hệ thống đo tự động theo từng khách hàng và từng tuyến' },
      { muc: 5, noi_dung: '5. Thông minh: Đo lường thời gian thực, có cảnh báo nguy cơ trễ cam kết trước khi xảy ra' },
    ]
  },

  // Nhóm HT - Hiển thị & tích hợp dữ liệu (GATEKEEPER BOTTLENECK: Mức 3 >= 50đ, Mức 4 >= 65đ)
  {
    id: 'HT1',
    ma: 'HT1',
    phan: 'ldmi',
    nhom_nang_luc: 'HT',
    ten_nhom: 'Hiển thị & tích hợp dữ liệu',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Khách hàng theo dõi tình trạng hàng của mình như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-HT-01',
    bat_buoc: true,
    thu_tu: 25,
    y_nghia: 'Cung cấp đường link tra cứu tự phục vụ thời gian thực, giải phóng nhân viên khỏi việc nghe điện thoại trả lời vị trí hàng.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm HT bắt buộc đạt ≥ 50đ để lên Mức 3 (Tích hợp) và ≥ 65đ để lên Mức 4 (Hiển thị).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Gọi điện thoại hỏi nhân viên quản lý' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Nhân viên trả lời qua Zalo hoặc gửi email cập nhật' },
      { muc: 3, noi_dung: '3. Tích hợp: Cổng thông tin tra cứu trên web được nhân viên cập nhật thủ công' },
      { muc: 4, noi_dung: '4. Hiển thị: Đường link theo dõi trạng thái và vị trí theo thời gian thực' },
      { muc: 5, noi_dung: '5. Thông minh: Khách hàng nhận cảnh báo tự động chủ động và dự báo chính xác giờ hàng đến' },
    ]
  },
  {
    id: 'HT2',
    ma: 'HT2',
    phan: 'ldmi',
    nhom_nang_luc: 'HT',
    ten_nhom: 'Hiển thị & tích hợp dữ liệu',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Các phần mềm nội bộ (vận tải, kho, đơn hàng, kế toán) kết nối với nhau thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-HT-02',
    bat_buoc: true,
    thu_tu: 26,
    y_nghia: 'Xóa bỏ các "ốc đảo dữ liệu" (data silos) giữa các bộ phận vận tải, kho bãi và kế toán.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm HT bắt buộc đạt ≥ 50đ để lên Mức 3 (Tích hợp) và ≥ 65đ để lên Mức 4 (Hiển thị).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Chưa có phần mềm hoặc mỗi bộ phận dùng một công cụ riêng lẻ' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Dùng nhiều phần mềm, phải nhập lại tay dữ liệu giữa các phần mềm' },
      { muc: 3, noi_dung: '3. Tích hợp: Kết nối một phần bằng cách xuất và nhập file Excel định kỳ' },
      { muc: 4, noi_dung: '4. Hiển thị: Các phần mềm kết nối trực tiếp qua API, dùng chung cơ sở dữ liệu' },
      { muc: 5, noi_dung: '5. Thông minh: Một nền tảng dữ liệu chung duy nhất, thông tin cập nhật tức thời toàn hệ thống' },
    ]
  },
  {
    id: 'HT3',
    ma: 'HT3',
    phan: 'ldmi',
    nhom_nang_luc: 'HT',
    ten_nhom: 'Hiển thị & tích hợp dữ liệu',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp trao đổi dữ liệu với đối tác bên ngoài (khách hàng, thầu phụ, cảng) thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-HT-02',
    bat_buoc: true,
    thu_tu: 27,
    y_nghia: 'Kết nối API/EDI tự động với toàn bộ mạng lưới chuỗi cung ứng, nâng cao năng lực phục vụ khách hàng lớn.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm HT bắt buộc đạt ≥ 50đ để lên Mức 3 (Tích hợp) và ≥ 65đ để lên Mức 4 (Hiển thị).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Chủ yếu qua điện thoại và email thủ công' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Gửi file Excel báo cáo định kỳ' },
      { muc: 3, noi_dung: '3. Tích hợp: Cung cấp cổng thông tin riêng cho đối tác truy cập' },
      { muc: 4, noi_dung: '4. Hiển thị: Kết nối tự động qua API hoặc chuẩn EDI với các đối tác chính' },
      { muc: 5, noi_dung: '5. Thông minh: Kết nối API/EDI tự động với hầu hết đối tác trong mạng lưới chuỗi cung ứng' },
    ]
  },

  // Nhóm CT - Hải quan & chứng từ
  {
    id: 'CT1',
    ma: 'CT1',
    phan: 'ldmi',
    nhom_nang_luc: 'CT',
    ten_nhom: 'Hải quan & chứng từ',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM'],
    noi_dung: 'Chứng từ vận chuyển như vận đơn, hóa đơn, phiếu đóng gói được lập như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CT-01',
    bat_buoc: true,
    thu_tu: 28,
    y_nghia: 'Tự động sinh bộ chứng từ điện tử từ dữ liệu lô hàng, ký số và giảm thời gian lập giấy tờ.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Viết tay hoặc in từ phôi giấy mẫu sẵn' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Soạn thảo trên Word hoặc bảng tính Excel' },
      { muc: 3, noi_dung: '3. Tích hợp: Phần mềm tự lập chứng từ từ dữ liệu lô hàng đã nhập' },
      { muc: 4, noi_dung: '4. Hiển thị: Hệ thống tự sinh bộ chứng từ điện tử và thực hiện ký số số hóa' },
      { muc: 5, noi_dung: '5. Thông minh: Trao đổi chứng từ số hóa tự động với đối tác, hoàn toàn không cần nhập lại' },
    ]
  },
  {
    id: 'CT2',
    ma: 'CT2',
    phan: 'ldmi',
    nhom_nang_luc: 'CT',
    ten_nhom: 'Hải quan & chứng từ',
    nhanh_ap_dung: ['FF', '3PL'],
    noi_dung: 'Việc khai hải quan được chuẩn bị như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CT-01',
    bat_buoc: true,
    thu_tu: 29,
    y_nghia: 'Chuyển dữ liệu tự động từ FMS sang phần mềm hải quan, tự kiểm tra lỗi logic trước khi truyền tờ khai.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Thuê ngoài dịch vụ hoàn toàn, doanh nghiệp không lưu trữ dữ liệu' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Nhân viên nhập tay toàn bộ vào phần mềm khai báo hải quan (ECUS)' },
      { muc: 3, noi_dung: '3. Tích hợp: Lấy dữ liệu từ file Excel có sẵn rồi chỉnh sửa bổ sung bằng tay' },
      { muc: 4, noi_dung: '4. Hiển thị: Dữ liệu tự động chuyển từ phần mềm giao nhận FMS sang phần mềm khai hải quan' },
      { muc: 5, noi_dung: '5. Thông minh: Quy trình tự động hoàn toàn, có thuật toán tự kiểm tra lỗi logic trước khi truyền tờ khai' },
    ]
  },
  {
    id: 'CT3',
    ma: 'CT3',
    phan: 'ldmi',
    nhom_nang_luc: 'CT',
    ten_nhom: 'Hải quan & chứng từ',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM'],
    noi_dung: 'Chứng từ được lưu trữ và tra cứu như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CT-01',
    bat_buoc: true,
    thu_tu: 30,
    y_nghia: 'Số hóa kho chứng từ có phân quyền, ứng dụng OCR nhận dạng ký tự để trích xuất dữ liệu tự động.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Lưu bản giấy trong tủ hồ sơ tài liệu' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Scan file PDF rồi lưu theo thư mục trên máy tính' },
      { muc: 3, noi_dung: '3. Tích hợp: Đính kèm và lưu theo từng lô hàng trên phần mềm quản lý' },
      { muc: 4, noi_dung: '4. Hiển thị: Hệ thống số hóa chứng từ có phân quyền, tra cứu nhanh theo lô, khách, ngày' },
      { muc: 5, noi_dung: '5. Thông minh: Tự động nhận dạng ký tự (OCR) và trích xuất dữ liệu từ chứng từ vào hệ thống' },
    ]
  },

  // Nhóm CP - Chi phí & hiệu suất (GATEKEEPER BOTTLENECK: Mức 5 >= 75đ)
  {
    id: 'CP1',
    ma: 'CP1',
    phan: 'ldmi',
    nhom_nang_luc: 'CP',
    ten_nhom: 'Chi phí & hiệu suất',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Chi phí logistics được tính toán theo mức độ chi tiết nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CP-01',
    bat_buoc: true,
    thu_tu: 31,
    y_nghia: 'Phân tích chi phí và lợi nhuận gộp theo từng chuyến, từng tuyến và từng khách hàng, cảnh báo tuyến đang lỗ.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm CP bắt buộc đạt ≥ 75đ để đạt Mức 5 (Thông minh).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không tính chi phí chi tiết theo chuyến hay từng đơn hàng' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Chỉ ước tính tổng chi phí gộp vào cuối tháng' },
      { muc: 3, noi_dung: '3. Tích hợp: Tính toán chi phí cho từng chuyến hoặc đơn hàng bằng phương pháp thủ công' },
      { muc: 4, noi_dung: '4. Hiển thị: Hệ thống tự động phân bổ và tính chi phí theo từng chuyến, từng tuyến, từng khách hàng' },
      { muc: 5, noi_dung: '5. Thông minh: Phân tích lợi nhuận gộp theo từng tuyến và khách hàng, tự động cảnh báo tuyến đang lỗ' },
    ]
  },
  {
    id: 'CP2',
    ma: 'CP2',
    phan: 'ldmi',
    nhom_nang_luc: 'CP',
    ten_nhom: 'Chi phí & hiệu suất',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp theo dõi chỉ số vận hành bằng công cụ gì?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CP-02',
    bat_buoc: true,
    thu_tu: 32,
    y_nghia: 'Bảng điều khiển (Dashboard) thông minh hiển thị KPI vận hành theo thời gian thực và cảnh báo sớm xu hướng tiêu cực.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm CP bắt buộc đạt ≥ 75đ để đạt Mức 5 (Thông minh).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không có hệ thống theo dõi định kỳ' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Tổng hợp báo cáo bảng tính Excel định kỳ' },
      { muc: 3, noi_dung: '3. Tích hợp: Có bảng điều khiển (Dashboard) cập nhật số liệu định kỳ' },
      { muc: 4, noi_dung: '4. Hiển thị: Dashboard hiển thị các chỉ số KPI vận hành theo thời gian thực' },
      { muc: 5, noi_dung: '5. Thông minh: Dashboard thông minh tích hợp tính năng cảnh báo sớm và dự báo xu hướng' },
    ]
  },
  {
    id: 'CP3',
    ma: 'CP3',
    phan: 'ldmi',
    nhom_nang_luc: 'CP',
    ten_nhom: 'Chi phí & hiệu suất',
    nhanh_ap_dung: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'],
    noi_dung: 'Quyết định vận hành (thêm xe, mở kho, nhận khách mới) dựa vào đâu?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-CP-02',
    bat_buoc: true,
    thu_tu: 33,
    y_nghia: 'Chuyển đổi từ ra quyết định theo cảm tính sang mô hình mô phỏng, dự báo nhu cầu và tối ưu công suất tự động.',
    dieu_kien_chan: 'Điều kiện chặn R06: Nhóm CP bắt buộc đạt ≥ 75đ để đạt Mức 5 (Thông minh).',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Dựa hoàn toàn vào kinh nghiệm và trực giác của lãnh đạo' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Chỉ xem xét báo cáo khi có sự cố phát sinh' },
      { muc: 3, noi_dung: '3. Tích hợp: Họp định kỳ phân tích các chỉ số đã tổng hợp' },
      { muc: 4, noi_dung: '4. Hiển thị: Mục tiêu chỉ số hiệu quả được giao cụ thể và gắn liền với từng bộ phận' },
      { muc: 5, noi_dung: '5. Thông minh: Có mô hình mô phỏng, dự báo nhu cầu và tối ưu công suất hỗ trợ ra quyết định' },
    ]
  },

  // Nhóm XA - Logistics xanh
  {
    id: 'XA1',
    ma: 'XA1',
    phan: 'ldmi',
    nhom_nang_luc: 'XA',
    ten_nhom: 'Logistics xanh',
    nhanh_ap_dung: ['VT', '3PL', 'LM', 'KH'],
    noi_dung: 'Nhiên liệu vận hành được theo dõi và kiểm soát như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-XA-01',
    bat_buoc: true,
    thu_tu: 34,
    y_nghia: 'Kiểm soát định mức nhiên liệu theo từng chuyến và từng xe, phát hiện hao hụt hoặc tiêu hao bất thường.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không theo dõi riêng từng xe' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Theo dõi tổng hóa đơn tiền dầu/xăng cả đội xe hằng tháng' },
      { muc: 3, noi_dung: '3. Tích hợp: Theo dõi mức tiêu hao nhiên liệu theo từng đầu xe' },
      { muc: 4, noi_dung: '4. Hiển thị: Đo đạc theo từng chuyến đi, có định mức tiêu chuẩn và kiểm soát chênh lệch' },
      { muc: 5, noi_dung: '5. Thông minh: Hệ thống cảm biến tự động phát hiện hao hụt, hút trộm dầu hoặc tiêu hao bất thường' },
    ]
  },
  {
    id: 'XA2',
    ma: 'XA2',
    phan: 'ldmi',
    nhom_nang_luc: 'XA',
    ten_nhom: 'Logistics xanh',
    nhanh_ap_dung: ['VT', '3PL', 'LM', 'KH'],
    noi_dung: 'Doanh nghiệp quản lý tỷ lệ chạy rỗng và tận dụng chuyến xe chiều về như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-XA-01',
    bat_buoc: true,
    thu_tu: 35,
    y_nghia: 'Giảm km chạy rỗng chiều về, ghép chuyến tự động qua thuật toán hoặc sàn giao dịch vận tải.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không biết tỷ lệ km chạy rỗng là bao nhiêu' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Ước lượng chung chung' },
      { muc: 3, noi_dung: '3. Tích hợp: Đo đạc định kỳ tỷ lệ chạy rỗng hằng tháng' },
      { muc: 4, noi_dung: '4. Hiển thị: Theo dõi tỷ lệ rỗng từng chuyến và chủ động tìm hàng ghép chuyến về' },
      { muc: 5, noi_dung: '5. Thông minh: Ghép chuyến tự động qua hệ thống thuật toán hoặc kết nối sàn giao dịch vận tải' },
    ]
  },
  {
    id: 'XA3',
    ma: 'XA3',
    phan: 'ldmi',
    nhom_nang_luc: 'XA',
    ten_nhom: 'Logistics xanh',
    nhanh_ap_dung: ['VT', 'FF', '3PL', 'LM', 'KH'],
    noi_dung: 'Phát thải khí nhà kính của hoạt động vận tải được đo lường như thế nào?',
    loai_tra_loi: 'muc_1_5',
    ma_khoang_trong: 'G-XA-02',
    bat_buoc: true,
    thu_tu: 36,
    y_nghia: 'Xuất báo cáo phát thải carbon chuẩn quốc tế (GLEC Framework / ISO 14083), đáp ứng yêu cầu ESG từ khách hàng FDI.',
    phuong_an: [
      { muc: 1, noi_dung: '1. Thủ công: Không đo lường' },
      { muc: 2, noi_dung: '2. Số hóa cơ bản: Chỉ ước tính sơ bộ khi có khách hàng lớn yêu cầu' },
      { muc: 3, noi_dung: '3. Tích hợp: Tính toán từ tổng lượng nhiên liệu tiêu thụ định kỳ' },
      { muc: 4, noi_dung: '4. Hiển thị: Tính toán theo phương pháp chuẩn quốc tế (GLEC Framework hoặc ISO 14083)' },
      { muc: 5, noi_dung: '5. Thông minh: Xuất báo cáo phát thải carbon tự động theo từng lô hàng cụ thể cho đối tác' },
    ]
  }
];

// 5. 13 Chỉ số logistics đo lường trước/sau triển khai (K01 - K13)
export interface MetricQuestion {
  ma: string;
  ten: string;
  don_vi: string;
  nhom: GroupCode;
  nhanh: BranchCode[];
  he_qua: string;
}

export const QUESTIONS_METRICS: MetricQuestion[] = [
  { ma: 'K01', ten: 'Tỷ lệ km xe chạy rỗng', don_vi: '%', nhom: 'XA', nhanh: ['VT', '3PL', 'LM'], he_qua: 'Không kiểm soát được chi phí chạy rỗng, lãng phí tài sản' },
  { ma: 'K02', ten: 'Tỷ lệ chuyến xe về có hàng', don_vi: '%', nhom: 'XA', nhanh: ['VT', '3PL'], he_qua: 'Lãng phí năng lực vận tải chiều về' },
  { ma: 'K03', ten: 'Chi phí mỗi km theo tuyến', don_vi: 'nghìn đ/km', nhom: 'CP', nhanh: ['VT', '3PL', 'LM'], he_qua: 'Không biết tuyến nào đang lỗ' },
  { ma: 'K04', ten: 'Điểm an toàn lái xe của tài xế', don_vi: 'điểm (0-100)', nhom: 'VT', nhanh: ['VT', 'LM'], he_qua: 'Khó kiểm soát rủi ro tai nạn và tiêu hao nhiên liệu' },
  { ma: 'K05', ten: 'Tỷ lệ giao đúng hạn và đủ hàng (OTIF)', don_vi: '%', nhom: 'DH', nhanh: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'], he_qua: 'Không chứng minh được chất lượng dịch vụ với khách hàng' },
  { ma: 'K06', ten: 'Độ chính xác tồn kho', don_vi: '%', nhom: 'KB', nhanh: ['KB', '3PL'], he_qua: 'Số liệu tồn kho không tin cậy, giao thiếu hàng' },
  { ma: 'K07', ten: 'Năng suất lấy hàng', don_vi: 'dòng/người/giờ', nhom: 'KB', nhanh: ['KB', '3PL'], he_qua: 'Tắc nghẽn kho giờ cao điểm, tốn nhân công' },
  { ma: 'K08', ten: 'Thời gian phản hồi báo giá', don_vi: 'giờ', nhom: 'GN', nhanh: ['FF', '3PL'], he_qua: 'Mất đơn hàng vào tay đối thủ vì phản hồi chậm' },
  { ma: 'K09', ten: 'Thời gian thông quan trung bình', don_vi: 'giờ', nhom: 'CT', nhanh: ['FF', '3PL'], he_qua: 'Khó cam kết tiến độ thông quan với khách' },
  { ma: 'K10', ten: 'Tỷ lệ chứng từ phải sửa chữa', don_vi: '%', nhom: 'CT', nhanh: ['FF', '3PL'], he_qua: 'Tốn công sửa, nguy cơ bị phạt hải quan' },
  { ma: 'K11', ten: 'Tỷ lệ giao hàng thất bại lần đầu', don_vi: '%', nhom: 'DH', nhanh: ['LM'], he_qua: 'Tốn chi phí giao lại nhiều lần' },
  { ma: 'K12', ten: 'Thời gian đối soát cước với khách', don_vi: 'ngày', nhom: 'CP', nhanh: ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'], he_qua: 'Chậm thu hồi dòng tiền, thất thoát doanh thu' },
  { ma: 'K13', ten: 'Lượng phát thải CO₂e theo lô hàng', don_vi: 'kg CO₂e/lô', nhom: 'XA', nhanh: ['VT', 'FF', '3PL', 'LM'], he_qua: 'Khó đáp ứng yêu cầu kiểm kê phát thải từ khách quốc tế' },
];

// 6. Ưu tiên, ngân sách, mức sẵn sàng (P01 - P10)
export const QUESTIONS_PRIORITY = {
  P01: {
    ma: 'P01',
    cau_hoi: 'Nếu chỉ cải thiện được 1 đến 2 vấn đề trong 6 tháng tới, doanh nghiệp ưu tiên nhất điều gì? (Chọn tối đa 2)',
    lua_chon: [
      { id: 'giam_chi_phi', text: 'Giảm chi phí vận hành & nhiên liệu', nhom: 'CP' },
      { id: 'giam_chay_rong', text: 'Giảm km chạy rỗng & ghép chuyến chiều về', nhom: 'XA' },
      { id: 'tang_theo_doi', text: 'Tăng khả năng theo dõi vị trí hàng thời gian thực', nhom: 'HT' },
      { id: 'chinh_xac_kho', text: 'Tăng độ chính xác tồn kho & năng suất lấy hàng', nhom: 'KB' },
      { id: 'rut_ngan_don', text: 'Rút ngắn thời gian xử lý đơn hàng', nhom: 'DH' },
      { id: 'tang_otif', text: 'Tăng tỷ lệ giao hàng đúng hạn đủ hàng (OTIF)', nhom: 'DH' },
      { id: 'giam_sai_chung_tu', text: 'Giảm sai sót chứng từ & thủ tục hải quan', nhom: 'CT' },
      { id: 'giam_phat_thai', text: 'Đo lường và giảm phát thải khí nhà kính (Logistics xanh)', nhom: 'XA' },
    ]
  },
  P02: {
    ma: 'P02',
    cau_hoi: 'Ngân sách dự kiến đầu tư cho giải pháp công nghệ trong 12 tháng tới?',
    lua_chon: [
      { id: 'duoi_20', text: 'Dưới 20 triệu đồng (Bậc phí 1)' },
      { id: '20_100', text: '20 đến 100 triệu đồng (Bậc phí 2)' },
      { id: '100_300', text: '100 đến 300 triệu đồng (Bậc phí 3)' },
      { id: 'tren_300', text: 'Trên 300 triệu đồng (Bậc phí 3)' },
      { id: 'chua_xac_dinh', text: 'Chưa xác định cụ thể (Bậc phí 1)' },
    ]
  },
  P03: {
    ma: 'P03',
    cau_hoi: 'Thời điểm doanh nghiệp muốn triển khai giải pháp công nghệ?',
    lua_chon: [
      { id: 'ngay', text: 'Triển khai ngay trong tháng này' },
      { id: '3_thang', text: 'Trong vòng 3 tháng tới' },
      { id: '6_thang', text: 'Trong vòng 6 tháng tới' },
      { id: 'chua_xac_dinh', text: 'Đang nghiên cứu, chưa xác định thời điểm' },
    ]
  },
  P04: {
    ma: 'P04',
    cau_hoi: 'Mức độ sẵn sàng nhân sự phụ trách triển khai?',
    lua_chon: [
      { id: 'chuyen_trach', text: 'Có nhân sự CNTT / số hóa chuyên trách' },
      { id: 'kiem_nhiem', text: 'Có nhân sự quản lý kiêm nhiệm' },
      { id: 'chua_co', text: 'Chưa có nhân sự phụ trách riêng' },
    ]
  },
  P05: {
    ma: 'P05',
    cau_hoi: 'Dữ liệu vận hành hiện có của doanh nghiệp đang ở dạng nào?',
    lua_chon: [
      { id: 'phan_mem', text: 'Đã có trên các phần mềm quản lý, sẵn sàng tích hợp' },
      { id: 'excel_day_du', text: 'Lưu trên các file Excel đầy đủ, có cấu trúc' },
      { id: 'roi_rac', text: 'Dữ liệu còn rời rạc, thiếu sót nhiều' },
      { id: 'chua_co', text: 'Hầu như chưa có dữ liệu số hóa' },
    ]
  },
  P06: {
    ma: 'P06',
    cau_hoi: 'Mức độ cam kết của ban lãnh đạo đối với việc số hóa?',
    lua_chon: [
      { id: 'truc_tiep', text: 'Ban lãnh đạo trực tiếp chỉ đạo và ưu tiên cao nhất' },
      { id: 'dong_y', text: 'Đồng ý chủ trương và giao cho cấp dưới thực hiện' },
      { id: 'phan_van', text: 'Còn phân vân, muốn thấy hiệu quả cụ thể trước' },
    ]
  },
  P07: {
    ma: 'P07',
    cau_hoi: 'Phần mềm doanh nghiệp đang sử dụng hiện tại (chọn nhiều)?',
    lua_chon: [
      { id: 'ke_toan', text: 'Phần mềm kế toán (MISA, FAST, Bravo...)' },
      { id: 'tms', text: 'Phần mềm quản lý vận tải (TMS)' },
      { id: 'wms', text: 'Phần mềm quản lý kho (WMS)' },
      { id: 'oms', text: 'Phần mềm quản lý đơn hàng (OMS)' },
      { id: 'erp', text: 'Hệ thống ERP (SAP, Oracle, Odoo...)' },
      { id: 'giao_nhan', text: 'Phần mềm giao nhận (FMS) / Hải quan' },
      { id: 'khong_co', text: 'Chưa dùng phần mềm nghiệp vụ nào' },
    ]
  }
};
