/**
 * Weight matrix and configuration rules for POLYMATCH Logistics
 * Derived from Sheet 8_HeSo, LOGIC NGHIỆP VỤ R01-R27, and sheet CẤU HÌNH
 */

import { BranchCode, GroupCode } from './questions';

// Ma trận hệ số quan trọng của Nhóm Năng Lực theo Nhánh (Sheet 8_HeSo)
// Giá trị 0 nghĩa là không hỏi nhóm này cho nhánh đó
export const HE_SO_NHOM_NHANH: Record<BranchCode, Record<GroupCode, number>> = {
  VT: { VT: 1.3, KB: 0.0, GN: 0.0, DH: 0.8, HT: 1.1, CT: 0.5, CP: 1.2, XA: 1.0 },
  FF: { VT: 0.0, KB: 0.0, GN: 1.3, DH: 0.8, HT: 1.1, CT: 1.3, CP: 0.9, XA: 0.6 },
  KB: { VT: 0.0, KB: 1.3, GN: 0.0, DH: 1.0, HT: 1.0, CT: 0.5, CP: 1.1, XA: 0.0 },
  '3PL': { VT: 1.0, KB: 1.0, GN: 0.8, DH: 1.0, HT: 1.3, CT: 0.8, CP: 1.1, XA: 0.9 },
  LM: { VT: 1.1, KB: 0.0, GN: 0.0, DH: 1.3, HT: 1.1, CT: 0.5, CP: 1.1, XA: 0.9 },
  KH: { VT: 0.0, KB: 0.0, GN: 0.0, DH: 1.0, HT: 1.0, CT: 0.0, CP: 1.0, XA: 0.8 },
};

export const TEN_NHOM_NANG_LUC: Record<GroupCode, string> = {
  VT: 'Vận tải',
  KB: 'Kho bãi',
  GN: 'Giao nhận quốc tế',
  DH: 'Đơn hàng & hoàn tất đơn',
  HT: 'Hiển thị & tích hợp dữ liệu',
  CT: 'Hải quan & chứng từ',
  CP: 'Chi phí & hiệu suất',
  XA: 'Logistics xanh',
};

export const TEN_NHANH: Record<BranchCode, string> = {
  VT: 'Vận tải hàng hóa nội địa',
  FF: 'Giao nhận quốc tế (Freight Forwarding)',
  KB: 'Dịch vụ kho bãi',
  '3PL': '3PL / 4PL - Logistics tổng thể',
  LM: 'Giao hàng chặng cuối (Last Mile)',
  KH: 'Khác (Doanh nghiệp có logistics riêng)',
};

// Ngưỡng 5 mức DBI (Ci * 100)
export const DBI_CONFIG = {
  nguong: [
    { muc: 'khoi_dong', ten: 'Khởi động', min: 0, max: 25, mo_ta: 'Chưa có chiến lược và giải pháp số cụ thể.' },
    { muc: 'bat_dau', ten: 'Bắt đầu', min: 25, max: 50, mo_ta: 'Đang triển khai các ứng dụng CNTT cơ bản rời rạc.' },
    { muc: 'hinh_thanh', ten: 'Hình thành', min: 50, max: 75, mo_ta: 'Đã số hóa các quy trình cốt lõi và bắt đầu kết nối dữ liệu.' },
    { muc: 'nang_cao', ten: 'Nâng cao', min: 75, max: 95, mo_ta: 'Tích hợp toàn diện trên đám mây, tối ưu tự động dựa trên số liệu.' },
    { muc: 'dan_dat', ten: 'Dẫn dắt', min: 95, max: 100, mo_ta: 'Tự động hóa hoàn toàn, dự báo thông minh và dẫn dắt hệ sinh thái.' },
  ]
};

// Ngưỡng 5 mức LDMI (Thủ công, Số hóa, Tích hợp, Hiển thị, Thông minh) & Điều kiện chặn R06
export const LDMI_CONFIG = {
  nguong: [
    { muc: 1, ten: 'Thủ công', min: 0, max: 30, mo_ta: 'Chủ yếu dựa vào giấy tờ, điện thoại, Zalo, kinh nghiệm cá nhân.' },
    { muc: 2, ten: 'Số hóa', min: 30, max: 50, mo_ta: 'Có phần mềm quản lý cơ bản (Excel, TMS/WMS đơn giản), dữ liệu rải rác.' },
    { muc: 3, ten: 'Tích hợp', min: 50, max: 65, mo_ta: 'Các bộ phận và phần mềm kết nối dữ liệu, chuẩn hóa quy trình.' },
    { muc: 4, ten: 'Hiển thị', min: 65, max: 80, mo_ta: 'Theo dõi thời gian thực, bảng điều khiển KPI, khách hàng tự tra cứu.' },
    { muc: 5, ten: 'Thông minh', min: 80, max: 100, mo_ta: 'Điều phối thuật toán, dự báo nhu cầu, tối ưu chi phí và phát thải.' },
  ],
  // Điều kiện chặn (Gatekeeper bottlenecks)
  dieu_kien_chan: {
    muc_3: { nhom: 'HT' as GroupCode, diem_toi_thieu: 50 }, // Tích hợp: Nhóm HT ≥ 50
    muc_4: { nhom: 'HT' as GroupCode, diem_toi_thieu: 65 }, // Hiển thị: Nhóm HT ≥ 65
    muc_5: { nhom: 'CP' as GroupCode, diem_toi_thieu: 75 }, // Thông minh: Nhóm CP ≥ 75
  }
};

// Trọng số thuật toán ghép nối 7 thành phần (R08, R09)
export const MATCHING_WEIGHTS = {
  khoang_trong: 0.30,      // Khớp khoảng trống (1.0 nếu khớp #1, 0.7 nếu #2, 0.5 nếu #3)
  uu_tien: 0.15,           // Khớp ưu tiên chọn (1.0 nếu trùng, 0 nếu không)
  quy_mo_loai_hinh: 0.15,  // Khớp loại hình và quy mô
  ngan_sach: 0.15,         // Khớp ngân sách
  san_sang: 0.10,          // Mức độ sẵn sàng nhân sự & dữ liệu
  he_thong: 0.10,          // Khớp hệ thống phần mềm hiện tại
  kiem_chung: 0.05,        // Kết quả đánh giá đã kiểm chứng
};

// Biểu phí mở hồ sơ nhu cầu (Bậc 1, 2, 3) - Triệu đồng
export const BIEU_PHI_CONFIG = {
  bac_1: { ten: 'Bậc 1 (< 20 triệu/năm hoặc chưa xác định)', gia: 0.10, credits: 100 },
  bac_2: { ten: 'Bậc 2 (20 - 100 triệu/năm)', gia: 0.20, credits: 200 },
  bac_3: { ten: 'Bậc 3 (> 100 triệu/năm)', gia: 0.30, credits: 300 },
  // Công tắc bật tắt thu phí toàn hệ thống (Pilot năm 1: false = miễn phí, ghi giao dịch 0đ)
  dang_bat: false,
  tran_luot_mo: 5, // Tối đa 5 nhà cung cấp được mở cùng một hồ sơ
  han_ho_so_ngay: 30, // Hết hạn sau 30 ngày
  han_khieu_nai_ngay: 7, // Hạn khiếu nại trong vòng 7 ngày sau khi mở
};
