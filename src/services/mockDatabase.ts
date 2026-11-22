import {
  User,
  EnterpriseProfile,
  SellerProfile,
  AssessmentResult,
  Solution,
  ConnectionRequest,
  Quotation,
  Contract,
  Expert,
  ConsultingBooking,
  ProjectTracking,
  ReportOrder,
  InsightArticle,
  AuditLog,
  UserWallet,
  CreditTransaction,
  WithdrawalRequest,
  CreditPackage
} from '../types';

import { SOLUTIONS_DATA } from '../data/solutionsData';
import { EXPERTS_DATA, ARTICLES_DATA } from '../data/expertsData';

const DB_KEY = 'polymatch_database_v3';

export const CREDIT_EXCHANGE_RATE = 10000; // 1 Tín chỉ = 10.000 VNĐ
export const MIN_WITHDRAW_CREDITS = 50; // Tối thiểu 50 tín chỉ (500.000 VNĐ)

export interface PolymatchDB {
  users: User[];
  enterprises: EnterpriseProfile[];
  sellers: SellerProfile[];
  assessments: AssessmentResult[];
  solutions: Solution[];
  connections: ConnectionRequest[];
  quotations: Quotation[];
  contracts: Contract[];
  experts: Expert[];
  consultings: ConsultingBooking[];
  projects: ProjectTracking[];
  reportOrders: ReportOrder[];
  articles: InsightArticle[];
  auditLogs: AuditLog[];
  wallets: Record<string, UserWallet>;
  creditTransactions: CreditTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  creditPackages: CreditPackage[];
  commissionRules: {
    bac_1: { maxVal: 50000000; rate: 0.05; label: '≤ 50 triệu (5%)' };
    bac_2: { minVal: 50000000; maxVal: 100000000; rate: 0.08; label: '50 - 100 triệu (8%)' };
    bac_3: { minVal: 100000000; rate: 0.10; label: '> 100 triệu (10%)' };
  };
}

export const INITIAL_USERS: User[] = [
  {
    id: "user-buyer-1",
    email: "buyer@vinatrans.vn",
    phone: "0903123456",
    fullName: "Nguyễn Văn Hùng",
    role: "BUYER",
    status: "active",
    companyName: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    taxId: "0312144913",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2026-09-01T08:00:00.000Z"
  },
  {
    id: "user-seller-active",
    email: "seller@smartlog.vn",
    phone: "0918888999",
    fullName: "Lê Hoàng Tuấn (Smartlog)",
    role: "SELLER",
    status: "active",
    companyName: "Công ty CP Giải pháp Chuỗi cung ứng Smartlog",
    taxId: "0316956049",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    vendorApproved: true,
    createdAt: "2026-09-05T09:30:00.000Z"
  },
  {
    id: "user-seller-pending",
    email: "pending@logitech.vn",
    phone: "0934567890",
    fullName: "Phạm Quốc Bảo (LogiTech)",
    role: "SELLER",
    status: "pending",
    companyName: "Công ty TNHH Giải pháp Vận tải LogiTech",
    taxId: "0108054755",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    vendorApproved: false,
    createdAt: "2026-10-18T10:00:00.000Z"
  },
  {
    id: "user-admin",
    email: "admin@polymatch.vn",
    phone: "0988776655",
    fullName: "Quản trị viên Hệ thống POLYMATCH",
    role: "ADMIN",
    status: "active",
    companyName: "Ban Quản trị Nền tảng POLYMATCH",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    createdAt: "2026-08-01T00:00:00.000Z"
  }
];

export const INITIAL_ENTERPRISES: EnterpriseProfile[] = [
  {
    id: "ent-vinatrans",
    userId: "user-buyer-1",
    ten: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    ma_so_thue: "0312144913",
    tinh_thanh: "TP. Hồ Chí Minh",
    dia_chi: "490A Điện Biên Phủ, Phường 21, Quận Bình Thạnh, TP.HCM",
    nguoi_lien_he: "Nguyễn Văn Hùng - Giám đốc Điều hành",
    so_dien_thoai: "0903123456",
    email_lien_he: "buyer@vinatrans.vn",
    so_lao_dong_bhxh: 65,
    doanh_thu_nam_truoc: "50 - 300 tỷ",
    tong_nguon_von: "20 - 100 tỷ",
    quy_mo: "vua",
    nhanh: "VT",
    dich_vu_3pl: ["Vận tải đường bộ", "Giao nhận nội địa"],
    quy_mo_dac_thu: {
      so_xe: 45,
      so_don_ngay: 120
    },
    phan_mem_dang_dung: ["ke_toan"],
    ngan_sach_12_thang: "100_300",
    thoi_diem_trien_khai: "Trong 3 tháng tới",
    san_sang_nhan_su: 4,
    san_sang_du_lieu: 3,
    cam_ket_lanh_dao: 5,
    updatedAt: "2026-10-15T09:00:00.000Z"
  }
];

export const INITIAL_SELLERS: SellerProfile[] = [
  {
    id: "vendor-smartlog",
    userId: "user-seller-active",
    ten: "Công ty CP Giải pháp Chuỗi cung ứng Smartlog",
    ma_so_thue: "0316956049",
    nguoi_lien_he: "Lê Hoàng Tuấn - Giám đốc Phát triển Kinh doanh",
    so_dien_thoai: "0918888999",
    email_lien_he: "seller@smartlog.vn",
    dia_chi: "Tòa nhà Qunimex, 28 Nguyễn Thị Diệu, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    website: "https://gosmartlog.com",
    nhom_cong_nghe: ["TMS", "WMS", "ePOD", "Control Tower"],
    nganh_phuc_vu: ["VT", "KB", "3PL", "LM"],
    quy_mo_khach_hang: ["nho", "vua", "lon"],
    trang_thai: "da_duyet",
    mst_tra_cuu: {
      ten_dang_ky: "CÔNG TY CỔ PHẦN GIẢI PHÁP CHUỖI CUNG ỨNG SMARTLOG",
      ngay_cap: "2015-08-12",
      tinh_trang: "Đang hoạt động (đã được cấp GCN ĐKT)",
      nguon: "esgoo.net"
    },
    goi_tham_gia: {
      ten_goi: "Gói Nhà Cung Cấp Chuẩn (VNYTL)",
      phi_nam: 6000000,
      ngay_bat_dau: "2026-09-01",
      ngay_het_han: "2027-09-01",
      trang_thai_phi: "da_thanh_toan"
    },
    updatedAt: "2026-09-05T09:30:00.000Z"
  },
  {
    id: "vendor-logitech",
    userId: "user-seller-pending",
    ten: "Công ty TNHH Giải pháp Vận tải LogiTech",
    ma_so_thue: "0108054755",
    nguoi_lien_he: "Phạm Quốc Bảo",
    so_dien_thoai: "0934567890",
    email_lien_he: "pending@logitech.vn",
    dia_chi: "Tầng 5, Tòa nhà Detech, Số 8 Tôn Thất Thuyết, Cầu Giấy, Hà Nội",
    website: "https://logitech-vn.com",
    nhom_cong_nghe: ["TMS", "Tối ưu định tuyến", "GPS Tracking"],
    nganh_phuc_vu: ["VT", "LM"],
    quy_mo_khach_hang: ["nho", "vua"],
    trang_thai: "cho_duyet",
    mst_tra_cuu: {
      ten_dang_ky: "CÔNG TY TNHH GIẢI PHÁP VẬN TẢI LOGITECH",
      ngay_cap: "2020-04-15",
      tinh_trang: "Đang hoạt động (đã được cấp GCN ĐKT)",
      nguon: "Xinvoice"
    },
    goi_tham_gia: {
      ten_goi: "Gói Nhà Cung Cấp Chuẩn (VNYTL)",
      phi_nam: 6000000,
      ngay_bat_dau: "2026-10-18",
      ngay_het_han: "2027-10-18",
      trang_thai_phi: "chua_thanh_toan"
    },
    updatedAt: "2026-10-18T10:00:00.000Z"
  }
];

export const INITIAL_ASSESSMENT: AssessmentResult = {
  id: "asm-vinatrans-01",
  userId: "user-buyer-1",
  doanh_nghiep_id: "ent-vinatrans",
  lan_thu: 1,
  ngay_tao: "2026-10-16T14:30:00.000Z",
  trang_thai: "hoan_thanh",
  dbi_diem: 42.5,
  dbi_muc: "Hình thành",
  dbi_tru_cot: [
    { ten: "Định hướng chiến lược", diem: 50 },
    { ten: "Trải nghiệm khách hàng", diem: 37.5 },
    { ten: "Chuỗi cung ứng", diem: 37.5 },
    { ten: "Hệ thống & Dữ liệu", diem: 25 },
    { ten: "An toàn thông tin", diem: 37.5 },
    { ten: "Quản lý vận hành", diem: 50 },
    { ten: "Con người & Văn hóa", diem: 60 }
  ],
  ldmi_diem: 38.0,
  ldmi_muc: "Số hóa",
  ldmi_nhom: [
    { ma: "VT", ten: "Vận tải", diem: 25.0 },
    { ma: "DH", ten: "Đơn hàng & Giao nhận", diem: 37.5 },
    { ma: "HT", ten: "Hiển thị & Tích hợp", diem: 25.0 },
    { ma: "CP", ten: "Chi phí & Hiệu suất", diem: 37.5 },
    { ma: "XA", ten: "Logistics Xanh", diem: 25.0 },
    { ma: "CT", ten: "Chứng từ", diem: 50.0 },
    { ma: "KB", ten: "Kho bãi", diem: 50.0 },
    { ma: "GN", ten: "Giao nhận", diem: 45.0 }
  ],
  top_khoang_trong: [
    {
      thu_hang: 1,
      ma: "G-VT-01",
      ten: "Điều phối xe thủ công",
      nhom: "VT - Vận tải",
      diem_gap: 75.0,
      trieu_chung: "Điều phối viên quá tải; xe chờ lâu; không biết xe nào rảnh khi có đơn gấp.",
      nguyen_nhan: "Điều phối dựa vào trí nhớ và điện thoại, không có lịch xe và lệnh điều xe dùng chung.",
      buoc_tiep_theo: "Chuyển sang phần mềm quản lý vận tải có mô-đun lệnh điều xe điện tử.",
      chi_so_khuyen_nghi: "Số chuyến mỗi xe mỗi ngày; thời gian chờ điều xe."
    },
    {
      thu_hang: 2,
      ma: "G-DH-02",
      ten: "Không có bằng chứng giao hàng điện tử",
      nhom: "DH - Đơn hàng",
      diem_gap: 62.5,
      trieu_chung: "Tranh chấp giao hàng; chậm đối soát cước vì chờ biên bản giấy của tài xế gửi về.",
      nguyen_nhan: "Xác nhận giao hàng phụ thuộc biên bản giấy hoặc ảnh chụp rời rạc trên Zalo.",
      buoc_tiep_theo: "Triển khai ứng dụng tài xế có chụp ảnh kiện hàng và ký nhận điện tử (ePOD).",
      chi_so_khuyen_nghi: "Thời gian đối soát cước; số lượng tranh chấp giao hàng."
    },
    {
      thu_hang: 3,
      ma: "G-XA-01",
      ten: "Chạy rỗng cao, không đo được",
      nhom: "XA - Logistics Xanh",
      diem_gap: 75.0,
      trieu_chung: "Chiều về thường không có hàng ghép; chi phí nhiên liệu và cầu đường lớn.",
      nguyen_nhan: "Không có dữ liệu số hóa theo dõi km rỗng, chưa chủ động tìm đơn hàng chiều về.",
      buoc_tiep_theo: "Đo tỷ lệ km chạy rỗng hằng tháng, kết nối ghép chuyến về qua sàn giao vận.",
      chi_so_khuyen_nghi: "Tỷ lệ km chạy rỗng (%); tỷ lệ chuyến về có hàng (%)."
    }
  ],
  ai_dien_giai: {
    tom_tat: "Doanh nghiệp VinaTrans đang ở giai đoạn Hình thành về chuyển đổi số doanh nghiệp (DBI 42.5/100) và mức Số hóa về năng lực logistics (LDMI 38.0/100). Doanh nghiệp có quyết tâm cao từ ban lãnh đạo, tuy nhiên hoạt động điều hành đội xe 45 phương tiện vẫn phụ thuộc nhiều vào quy trình thủ công rời rạc.",
    diem_manh: [
      "Ban lãnh đạo trực tiếp bảo trợ và có cam kết chuyển đổi quy trình mạnh mẽ.",
      "Quy trình kế toán và tài chính đã có phần mềm chuẩn mực hỗ trợ.",
      "Đội ngũ nhân sự có tinh thần cởi mở sẵn sàng tiếp nhận công cụ số mới."
    ],
    diem_nghen: [
      {
        ma: "G-VT-01",
        hien_trang: "Lệnh điều xe phát sinh hàng ngày qua điện thoại và nhóm chat, điều phối viên thường xuyên quá tải.",
        nguyen_nhan_co_the: "Chưa có phần mềm TMS tập trung điều phối lịch xe và theo dõi trạng thái sẵn sàng của phương tiện.",
        tac_dong: "Thời gian chờ điều xe kéo dài, giảm hệ số sử dụng phương tiện trên ngày.",
        buoc_chuan_bi: "Chuẩn hóa danh mục xe, tài xế và quy trình ban hành lệnh vận chuyển trước khi cài đặt phần mềm.",
        kpi: ["Số chuyến/xe/ngày", "Thời gian phản hồi điều xe"],
        nguon: ["Facchini et al. (2020)", "ASCM SCOR-DS"]
      },
      {
        ma: "G-DH-02",
        hien_trang: "Biên bản giao hàng giấy thường nộp về trễ 5-7 ngày làm chậm chu kỳ đối soát công nợ với chủ hàng.",
        nguyen_nhan_co_the: "Chưa trang bị ứng dụng di động cho tài xế để ghi nhận bằng chứng giao nhận tức thời.",
        tac_dong: "Dòng tiền thu về chậm, phát sinh tranh chấp số lượng giao thiếu không có ảnh đối chiếu.",
        buoc_chuan_bi: "Trang bị smartphone cơ bản cho tài xế và ban hành quy định chụp ảnh bắt buộc khi bàn giao.",
        kpi: ["Thời gian đối soát cước (ngày)", "Số biên bản giao hàng tồn đọng"],
        nguon: ["Rushton et al.", "SCOR Perfect Order Fulfilment"]
      }
    ],
    gioi_han: "Kết quả đánh giá mang tính chất chẩn đoán sơ bộ dựa trên thông tin tự kê khai của doanh nghiệp tại thời điểm khảo sát. Không thay thế cho kiểm toán vận hành chuyên sâu trực tiếp tại hiện trường."
  },
  tra_loi: {
    "dbi-01": 3,
    "dbi-02": 3,
    "dbi-03": 2,
    "dbi-04": 3,
    "dbi-05": 2,
    "dbi-06": 3,
    "dbi-07": 2,
    "dbi-08": 2,
    "dbi-09": 3,
    "dbi-10": 2,
    "dbi-11": 3,
    "dbi-12": 3,
    "dbi-13": 4,
    "dbi-14": 4,
    "ldmi-01": 2,
    "ldmi-02": 2,
    "ldmi-07": 2,
    "ldmi-08": 2,
    "ldmi-09": 2,
    "ldmi-10": 2,
    "ldmi-13": 2,
    "ldmi-14": 3,
    "ldmi-15": 2,
    "ldmi-16": 1
  }
};

export const INITIAL_CONNECTIONS: ConnectionRequest[] = [
  {
    id: "conn-01",
    buyerId: "user-buyer-1",
    buyerName: "Nguyễn Văn Hùng",
    buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    buyerPhone: "0903123456",
    buyerEmail: "buyer@vinatrans.vn",
    sellerId: "user-seller-active",
    sellerCompany: "Công ty CP Giải pháp Chuỗi cung ứng Smartlog",
    solutionId: "sol-02",
    solutionName: "Hệ thống quản lý vận tải (TMS) - Smartlog STM",
    nhu_cau_chi_tiet: "Cần triển khai phần mềm quản lý vận tải cho đội 45 xe tải thùng và container tuyến Bắc Nam. Yêu cầu có lệnh điều xe điện tử và theo dõi GPS.",
    ngan_sach_du_kien: "Khoảng 60 - 90 triệu đồng/năm",
    thoi_gian_du_kien: "Triển khai trong tháng 11/2026",
    trang_thai: "da_bao_gia",
    ngay_tao: "2026-10-17T09:15:00.000Z",
    ngay_cap_nhat: "2026-10-18T14:20:00.000Z",
    ghi_chu_seller: "Đã liên hệ anh Hùng, Smartlog đã gửi bảng báo giá gói STM Cloud cho 45 xe.",
    bao_gia_id: "quote-01"
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "quote-01",
    connectionId: "conn-01",
    sellerId: "user-seller-active",
    sellerCompany: "Công ty CP Giải pháp Chuỗi cung ứng Smartlog",
    buyerId: "user-buyer-1",
    buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    solutionId: "sol-02",
    solutionName: "Smartlog STM Cloud (Gói 45 xe)",
    tong_gia_tri: 72000000, // 72 triệu VND
    thoi_gian_trien_khai_tuan: 4,
    noi_dung_bao_gia: "Gói thuê bao 12 tháng phần mềm Smartlog STM cho 45 xe, bao gồm phân hệ điều phối, quản lý cước, app tài xế và đào tạo vận hành tại chỗ.",
    cac_hang_muc: [
      { ten: "Phí thuê bao phần mềm Smartlog STM Cloud (45 xe x 12 tháng)", so_luong: 1, don_gia: 54000000 },
      { ten: "Phí khởi tạo hệ thống & tích hợp GPS Viettel hiện có", so_luong: 1, don_gia: 8000000 },
      { ten: "Dịch vụ đào tạo nhân sự điều phối & tài xế tại văn phòng", so_luong: 2, don_gia: 5000000 }
    ],
    ngay_gui: "2026-10-18T14:20:00.000Z",
    han_hieu_luc: "2026-11-18T23:59:59.000Z",
    trang_thai: "cho_phan_hoi"
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "ctr-01",
    ma_hop_dong: "HD-PM-2026-0089",
    connectionId: "conn-sample",
    quotationId: "quote-sample",
    buyerId: "user-buyer-1",
    buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    sellerId: "vendor-misa",
    sellerCompany: "Công ty Cổ phần MISA",
    solutionName: "MISA meInvoice & Đối soát cước",
    gia_tri_hop_dong: 18000000, // 18 triệu
    ngay_ky: "2026-10-01",
    trang_thai: "hieu_luc",
    hoa_hong: {
      ty_le: 0.05, // 5% for <= 50tr
      so_tien: 900000,
      trang_thai: "da_doi_soat",
      ngay_doi_soat: "2026-10-10"
    }
  }
];

export const INITIAL_CONSULTINGS: ConsultingBooking[] = [
  {
    id: "cst-01",
    buyerId: "user-buyer-1",
    buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    buyerContactName: "Nguyễn Văn Hùng",
    buyerPhone: "0903123456",
    buyerEmail: "buyer@vinatrans.vn",
    goi_dich_vu: "Basic",
    gia_goi: 3000000, // 3 buổi x 60-90p = 3 triệu (Theo VNYTL)
    chuyen_gia_id: "exp-01",
    chuyen_gia_ten: "TS. Nguyễn Thành Danh",
    ngay_mong_muon: "2026-10-25",
    khung_gio: "09:00 - 11:00",
    muc_tieu_tu_van: "Đánh giá chi tiết phương án lựa chọn phần mềm TMS và xây dựng lộ trình số hóa giảm chạy rỗng cho đội xe 45 chiếc.",
    trang_thai: "da_phan_cong",
    ngay_tao: "2026-10-18T16:00:00.000Z",
    so_buoi_hoan_thanh: 0,
    tong_so_buoi: 3
  }
];

export const INITIAL_PROJECTS: ProjectTracking[] = [
  {
    id: "prj-01",
    buyerId: "user-buyer-1",
    buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
    solutionId: "sol-10",
    solutionName: "MISA meInvoice & Đối soát cước",
    ten_du_an: "Số hóa hóa đơn điện tử & quy trình đối soát cước vận tải VinaTrans",
    goi_theo_doi: "3_thang",
    phi_theo_doi: 3000000, // 3 triệu / 3 tháng theo VNYTL
    ngay_bat_dau: "2026-10-05",
    ngay_ket_thuc_du_kien: "2027-01-05",
    tien_do_phan_tram: 65,
    trang_thai: "dao_tao",
    cac_moc: [
      { id: "m1", ten_moc: "Ký kết hợp đồng & Thống nhất đầu bài", ngay_du_kien: "2026-10-05", da_hoan_thanh: true, ngay_hoan_thanh: "2026-10-05" },
      { id: "m2", ten_moc: "Cài đặt & Khởi tạo tài khoản hóa đơn", ngay_du_kien: "2026-10-12", da_hoan_thanh: true, ngay_hoan_thanh: "2026-10-11" },
      { id: "m3", ten_moc: "Đào tạo nghiệp vụ kế toán & xuất hóa đơn", ngay_du_kien: "2026-10-20", da_hoan_thanh: false },
      { id: "m4", ten_moc: "Chạy thử nghiệm xuất hóa đơn cho 10 khách hàng", ngay_du_kien: "2026-11-05", da_hoan_thanh: false },
      { id: "m5", ten_moc: "Vận hành chính thức toàn bộ & Nghiệm thu", ngay_du_kien: "2026-12-15", da_hoan_thanh: false }
    ],
    chi_so_kpi: [
      { ma: "K07", ten: "Tỷ lệ chứng từ sai phải hủy/sửa", don_vi: "%", truoc_trien_khai: 14.5, muc_tieu: 2.0, hien_tai: 6.2 },
      { ma: "TDS", ten: "Thời gian hoàn tất đối soát công nợ", don_vi: "ngày", truoc_trien_khai: 12, muc_tieu: 3, hien_tai: 5 }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-01",
    adminId: "user-admin",
    adminName: "Admin POLYMATCH",
    hanh_dong: "DUYET_NHA_CUNG_CAP",
    doi_tuong: "nha_cung_cap",
    doi_tuong_id: "vendor-smartlog",
    mo_ta: "Phê duyệt hồ sơ nhà cung cấp Smartlog sau khi đối chiếu mã số thuế 0316956049 trên esgoo.net hợp lệ.",
    thoi_gian: "2026-09-05T09:30:00.000Z"
  },
  {
    id: "log-02",
    adminId: "user-admin",
    adminName: "Admin POLYMATCH",
    hanh_dong: "PHAN_CONG_CHUYEN_GIA",
    doi_tuong: "lich_tu_van",
    doi_tuong_id: "cst-01",
    mo_ta: "Phân công TS. Nguyễn Thành Danh phụ trách gói tư vấn Basic cho VinaTrans.",
    thoi_gian: "2026-10-18T16:30:00.000Z"
  }
];

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pkg-50',
    ten_goi: 'Gói Khởi Động',
    so_tin_chi: 50,
    so_tien_vnd: 500000,
    tin_chi_thuong: 0,
    mo_ta: 'Thử nghiệm dịch vụ, phù hợp đánh giá cơ bản hoặc tra cứu'
  },
  {
    id: 'pkg-100',
    ten_goi: 'Gói Tiêu Chuẩn',
    so_tin_chi: 100,
    so_tien_vnd: 1000000,
    tin_chi_thuong: 5,
    mo_ta: 'Tặng thêm 5 tín chỉ, phù hợp mua Báo cáo chẩn đoán chuyên sâu (70 tín chỉ)'
  },
  {
    id: 'pkg-300',
    ten_goi: 'Gói Cố Vấn (Hot)',
    so_tin_chi: 300,
    so_tien_vnd: 3000000,
    tin_chi_thuong: 25,
    hot: true,
    mo_ta: 'Tặng thêm 25 tín chỉ (tiết kiệm 250k), đủ trọn gói 3 buổi tư vấn Chuyên gia Basic'
  },
  {
    id: 'pkg-650',
    ten_goi: 'Gói Chuyên Sâu Pro',
    so_tin_chi: 650,
    so_tien_vnd: 6500000,
    tin_chi_thuong: 70,
    mo_ta: 'Tặng thêm 70 tín chỉ (tiết kiệm 700k), bao gồm trọn gói 5 buổi cố vấn chuyển đổi số'
  },
  {
    id: 'pkg-1000',
    ten_goi: 'Gói Doanh Nghiệp VIP',
    so_tin_chi: 1000,
    so_tien_vnd: 10000000,
    tin_chi_thuong: 150,
    mo_ta: 'Tặng thêm 150 tín chỉ (15%), ưu đãi tối đa cho chuỗi cung ứng lớn & nhà cung cấp'
  }
];

export const INITIAL_WALLETS: Record<string, UserWallet> = {
  'user-buyer-1': {
    userId: 'user-buyer-1',
    so_du_tin_chi: 420,
    so_du_dong_bang: 0,
    tong_nap_tin_chi: 500,
    tong_rut_tin_chi: 0,
    tong_chi_tieu_tin_chi: 80,
    tong_thu_tin_chi: 0,
    updatedAt: new Date().toISOString()
  },
  'user-seller-active': {
    userId: 'user-seller-active',
    so_du_tin_chi: 1250,
    so_du_dong_bang: 200,
    tong_nap_tin_chi: 0,
    tong_rut_tin_chi: 500,
    tong_chi_tieu_tin_chi: 600,
    tong_thu_tin_chi: 2550,
    updatedAt: new Date().toISOString()
  },
  'user-seller-pending': {
    userId: 'user-seller-pending',
    so_du_tin_chi: 50,
    so_du_dong_bang: 0,
    tong_nap_tin_chi: 50,
    tong_rut_tin_chi: 0,
    tong_chi_tieu_tin_chi: 0,
    tong_thu_tin_chi: 0,
    updatedAt: new Date().toISOString()
  },
  'user-admin': {
    userId: 'user-admin',
    so_du_tin_chi: 50000,
    so_du_dong_bang: 0,
    tong_nap_tin_chi: 50000,
    tong_rut_tin_chi: 0,
    tong_chi_tieu_tin_chi: 0,
    tong_thu_tin_chi: 3500,
    updatedAt: new Date().toISOString()
  }
};

export const INITIAL_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx-01',
    ma_giao_dich: 'TX-NAP-9281',
    userId: 'user-buyer-1',
    userName: 'Nguyễn Văn Hùng (VinaTrans)',
    userRole: 'BUYER',
    loai_giao_dich: 'NAP_TIEN',
    so_tin_chi: 500,
    so_tien_vnd: 5000000,
    so_du_sau_giao_dich: 500,
    phuong_thuc: 'Chuyển khoản VietQR',
    trang_thai: 'thanh_cong',
    ghi_chu: 'Nạp Gói Cố Vấn qua quét mã VietQR ngân hàng BIDV',
    thoi_gian: '2026-10-15T09:15:00.000Z'
  },
  {
    id: 'tx-02',
    ma_giao_dich: 'TX-SPEND-3312',
    userId: 'user-buyer-1',
    userName: 'Nguyễn Văn Hùng (VinaTrans)',
    userRole: 'BUYER',
    loai_giao_dich: 'THANH_TOAN_DICH_VU',
    so_tin_chi: -70,
    so_tien_vnd: 700000,
    so_du_sau_giao_dich: 430,
    phuong_thuc: 'Ví Tín Chỉ POLYMATCH',
    trang_thai: 'thanh_cong',
    ghi_chu: 'Thanh toán Báo cáo chẩn đoán chuyên sâu & Danh sách giải pháp tối ưu',
    thoi_gian: '2026-10-17T10:05:00.000Z'
  },
  {
    id: 'tx-03',
    ma_giao_dich: 'TX-COMM-7721',
    userId: 'user-seller-active',
    userName: 'Lê Hoàng Tuấn (Smartlog)',
    userRole: 'SELLER',
    loai_giao_dich: 'NHAN_HOA_HONG',
    so_tin_chi: 1500,
    so_tien_vnd: 15000000,
    so_du_sau_giao_dich: 1950,
    phuong_thuc: 'Ví Tín Chỉ POLYMATCH',
    trang_thai: 'thanh_cong',
    ghi_chu: 'Cộng doanh thu thanh toán giai đoạn 1 hợp đồng HD-2026-001',
    thoi_gian: '2026-10-16T14:20:00.000Z'
  },
  {
    id: 'tx-04',
    ma_giao_dich: 'TX-RUT-1049',
    userId: 'user-seller-active',
    userName: 'Lê Hoàng Tuấn (Smartlog)',
    userRole: 'SELLER',
    loai_giao_dich: 'RUT_TIEN',
    so_tin_chi: -500,
    so_tien_vnd: 5000000,
    so_du_sau_giao_dich: 1450,
    phuong_thuc: 'Rút tiền về Vietcombank (STK: 0071001234567)',
    thong_tin_ngan_hang: {
      ngan_hang: 'Vietcombank',
      so_tai_khoan: '0071001234567',
      ten_chu_tai_khoan: 'LE HOANG TUAN'
    },
    trang_thai: 'thanh_cong',
    ghi_chu: 'Rút tiền doanh thu về tài khoản ngân hàng doanh nghiệp',
    thoi_gian: '2026-10-18T11:00:00.000Z'
  }
];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: 'with-01',
    ma_lenh: 'WR-2026-081',
    userId: 'user-seller-active',
    userName: 'Lê Hoàng Tuấn',
    userRole: 'SELLER',
    companyName: 'Công ty CP Giải pháp Chuỗi cung ứng Smartlog',
    so_tin_chi: 200,
    so_tien_vnd: 2000000,
    phi_rut_vnd: 0,
    thuc_nhan_vnd: 2000000,
    ngan_hang: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    so_tai_khoan: '0071001234567',
    ten_chu_tai_khoan: 'LE HOANG TUAN',
    trang_thai: 'cho_duyet',
    ngay_tao: '2026-10-19T08:30:00.000Z'
  },
  {
    id: 'with-02',
    ma_lenh: 'WR-2026-079',
    userId: 'user-seller-active',
    userName: 'Lê Hoàng Tuấn',
    userRole: 'SELLER',
    companyName: 'Công ty CP Giải pháp Chuỗi cung ứng Smartlog',
    so_tin_chi: 500,
    so_tien_vnd: 5000000,
    phi_rut_vnd: 0,
    thuc_nhan_vnd: 5000000,
    ngan_hang: 'Vietcombank',
    so_tai_khoan: '0071001234567',
    ten_chu_tai_khoan: 'LE HOANG TUAN',
    trang_thai: 'da_duyet',
    ngay_tao: '2026-10-18T10:00:00.000Z',
    ngay_duyet: '2026-10-18T11:00:00.000Z',
    nguoi_duyet: 'Admin POLYMATCH',
    ma_tham_chieu_ngan_hang: 'FT26292019481'
  }
];

class MockDatabaseService {
  private data: PolymatchDB;
  private storageKey = DB_KEY;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): PolymatchDB {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore fallback
    }
    return this.getInitialData();
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch {
      console.warn("Storage quota exceeded or unavailable");
    }
  }

  /** Isolate cloud caches without changing the existing demo database. */
  public activateCloudUser(user: User, enterprise: EnterpriseProfile, seller: SellerProfile | null, assessments: AssessmentResult[]): void {
    this.storageKey = `${DB_KEY}_cloud_${user.id}`;
    this.data = this.loadFromStorage();
    this.data.users = [user];
    this.data.enterprises = [enterprise];
    this.data.assessments = assessments;
    if (seller) this.data.sellers = [...this.data.sellers.filter(s => s.userId !== user.id), seller];
    this.saveToStorage();
  }

  public clearCloudUser(): void {
    this.storageKey = DB_KEY;
    this.data = this.getInitialData();
  }

  public resetDatabase(): void {
    this.data = this.getInitialData();
    this.saveToStorage();
    window.location.reload();
  }

  private getInitialData(): PolymatchDB {
    return {
      users: [...INITIAL_USERS],
      enterprises: [...INITIAL_ENTERPRISES],
      sellers: [...INITIAL_SELLERS],
      assessments: [INITIAL_ASSESSMENT],
      solutions: [...SOLUTIONS_DATA],
      connections: [...INITIAL_CONNECTIONS],
      quotations: [...INITIAL_QUOTATIONS],
      contracts: [...INITIAL_CONTRACTS],
      experts: [...EXPERTS_DATA],
      consultings: [...INITIAL_CONSULTINGS],
      projects: [...INITIAL_PROJECTS],
      reportOrders: [
        {
          id: "rep-01",
          buyerId: "user-buyer-1",
          buyerCompany: "Công ty Cổ phần Vận tải & Logistics VinaTrans",
          loai_bao_cao: "Báo cáo chẩn đoán chuyên sâu & Danh sách giải pháp tối ưu",
          gia: 700000,
          ngay_dat: "2026-10-17T10:00:00.000Z",
          trang_thai: "da_thanh_toan",
          ma_hoa_don: "INV-REP-7721",
          file_url: "#"
        }
      ],
      articles: [...ARTICLES_DATA],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      wallets: { ...INITIAL_WALLETS },
      creditTransactions: [...INITIAL_CREDIT_TRANSACTIONS],
      withdrawalRequests: [...INITIAL_WITHDRAWAL_REQUESTS],
      creditPackages: [...CREDIT_PACKAGES],
      commissionRules: {
        bac_1: { maxVal: 50000000, rate: 0.05, label: "≤ 50 triệu (5%)" },
        bac_2: { minVal: 50000000, maxVal: 100000000, rate: 0.08, label: "50 - 100 triệu (8%)" },
        bac_3: { minVal: 100000000, rate: 0.10, label: "> 100 triệu (10%)" }
      }
    };
  }

  // Getters
  public getDB(): PolymatchDB {
    return this.data;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getEnterprises(): EnterpriseProfile[] {
    return this.data.enterprises;
  }

  public getSellers(): SellerProfile[] {
    return this.data.sellers;
  }

  public getSolutions(): Solution[] {
    return this.data.solutions;
  }

  public getAssessments(): AssessmentResult[] {
    return this.data.assessments;
  }

  public getConnections(): ConnectionRequest[] {
    return this.data.connections;
  }

  public getQuotations(): Quotation[] {
    return this.data.quotations;
  }

  public getContracts(): Contract[] {
    return this.data.contracts;
  }

  public getExperts(): Expert[] {
    return this.data.experts;
  }

  public getConsultings(): ConsultingBooking[] {
    return this.data.consultings;
  }

  public getProjects(): ProjectTracking[] {
    return this.data.projects;
  }

  public getReportOrders(): ReportOrder[] {
    return this.data.reportOrders;
  }

  public getArticles(): InsightArticle[] {
    return this.data.articles;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // Mutations
  public addUser(user: User): void {
    this.data.users.push(user);
    this.saveToStorage();
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    let updated: User | null = null;
    this.data.users = this.data.users.map(u => {
      if (u.id === id) {
        updated = { ...u, ...updates };
        return updated;
      }
      return u;
    });
    this.saveToStorage();
    return updated;
  }

  public addEnterprise(ent: EnterpriseProfile): void {
    this.data.enterprises.push(ent);
    this.saveToStorage();
  }

  public updateEnterprise(userId: string, updates: Partial<EnterpriseProfile>): void {
    this.data.enterprises = this.data.enterprises.map(e => e.userId === userId ? { ...e, ...updates } : e);
    this.saveToStorage();
  }

  public addSeller(seller: SellerProfile): void {
    this.data.sellers.push(seller);
    this.saveToStorage();
  }

  public updateSeller(sellerId: string, updates: Partial<SellerProfile>): void {
    this.data.sellers = this.data.sellers.map(s => s.id === sellerId ? { ...s, ...updates } : s);
    this.saveToStorage();
  }

  public addAssessment(asm: AssessmentResult): void {
    this.data.assessments.unshift(asm);
    this.saveToStorage();
  }

  public addConnection(req: ConnectionRequest): void {
    this.data.connections.unshift(req);
    this.saveToStorage();
  }

  public updateConnection(id: string, updates: Partial<ConnectionRequest>): void {
    this.data.connections = this.data.connections.map(c => c.id === id ? { ...c, ...updates, ngay_cap_nhat: new Date().toISOString() } : c);
    this.saveToStorage();
  }

  public addQuotation(quote: Quotation): void {
    this.data.quotations.unshift(quote);
    this.saveToStorage();
  }

  public updateQuotation(id: string, updates: Partial<Quotation>): void {
    this.data.quotations = this.data.quotations.map(q => q.id === id ? { ...q, ...updates } : q);
    this.saveToStorage();
  }

  public addContract(ctr: Contract): void {
    this.data.contracts.unshift(ctr);
    this.saveToStorage();
  }

  public addConsulting(booking: ConsultingBooking): void {
    this.data.consultings.unshift(booking);
    this.saveToStorage();
  }

  public updateConsulting(id: string, updates: Partial<ConsultingBooking>): void {
    this.data.consultings = this.data.consultings.map(c => c.id === id ? { ...c, ...updates } : c);
    this.saveToStorage();
  }

  public addExpert(expert: Expert): void {
    this.data.experts.push(expert);
    this.saveToStorage();
  }

  public updateExpert(id: string, updates: Partial<Expert>): void {
    this.data.experts = this.data.experts.map(e => e.id === id ? { ...e, ...updates } : e);
    this.saveToStorage();
  }

  public addSolution(sol: Solution): void {
    this.data.solutions.unshift(sol);
    this.saveToStorage();
  }

  public updateSolution(id: string, updates: Partial<Solution>): void {
    this.data.solutions = this.data.solutions.map(s => s.id === id ? { ...s, ...updates } : s);
    this.saveToStorage();
  }

  public addReportOrder(order: ReportOrder): void {
    this.data.reportOrders.unshift(order);
    this.saveToStorage();
  }

  public addProject(proj: ProjectTracking): void {
    this.data.projects.unshift(proj);
    this.saveToStorage();
  }

  public updateProject(id: string, updates: Partial<ProjectTracking>): void {
    this.data.projects = this.data.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveToStorage();
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'thoi_gian'>): void {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      thoi_gian: new Date().toISOString()
    };
    this.data.auditLogs.unshift(newLog);
    this.saveToStorage();
  }

  public addArticle(article: InsightArticle): void {
    this.data.articles.unshift(article);
    this.saveToStorage();
  }

  // ================= VÍ TÍN CHỈ (CREDIT WALLET) METHODS =================

  public getWallet(userId: string): UserWallet {
    if (!this.data.wallets) {
      this.data.wallets = {};
    }
    if (!this.data.wallets[userId]) {
      this.data.wallets[userId] = {
        userId,
        so_du_tin_chi: 0,
        so_du_dong_bang: 0,
        tong_nap_tin_chi: 0,
        tong_rut_tin_chi: 0,
        tong_chi_tieu_tin_chi: 0,
        tong_thu_tin_chi: 0,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
    }
    return this.data.wallets[userId];
  }

  public getCreditTransactions(userId?: string): CreditTransaction[] {
    const list = this.data.creditTransactions || [];
    if (userId) {
      return list.filter(t => t.userId === userId);
    }
    return list;
  }

  public getWithdrawalRequests(userId?: string): WithdrawalRequest[] {
    const list = this.data.withdrawalRequests || [];
    if (userId) {
      return list.filter(w => w.userId === userId);
    }
    return list;
  }

  public getCreditPackages(): CreditPackage[] {
    return this.data.creditPackages || CREDIT_PACKAGES;
  }

  public depositCredits(
    userId: string,
    credits: number,
    paymentMethod: string = 'Chuyển khoản VietQR',
    note?: string
  ): CreditTransaction {
    const user = this.data.users.find(u => u.id === userId);
    const wallet = this.getWallet(userId);
    wallet.so_du_tin_chi += credits;
    wallet.tong_nap_tin_chi += credits;
    wallet.updatedAt = new Date().toISOString();

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ma_giao_dich: `TX-NAP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName: user ? user.fullName : 'Thành viên POLYMATCH',
      userRole: user ? user.role : 'BUYER',
      loai_giao_dich: 'NAP_TIEN',
      so_tin_chi: credits,
      so_tien_vnd: credits * CREDIT_EXCHANGE_RATE,
      so_du_sau_giao_dich: wallet.so_du_tin_chi,
      phuong_thuc: paymentMethod,
      trang_thai: 'thanh_cong',
      ghi_chu: note || `Nạp ${credits.toLocaleString('vi-VN')} tín chỉ vào ví thành công`,
      thoi_gian: new Date().toISOString()
    };

    if (!this.data.creditTransactions) this.data.creditTransactions = [];
    this.data.creditTransactions.unshift(tx);
    this.saveToStorage();
    return tx;
  }

  public createWithdrawalRequest(
    userId: string,
    credits: number,
    bankInfo: { ngan_hang: string; so_tai_khoan: string; ten_chu_tai_khoan: string }
  ): WithdrawalRequest {
    const wallet = this.getWallet(userId);
    if (wallet.so_du_tin_chi < credits) {
      throw new Error(`Số dư không đủ. Bạn đang có ${wallet.so_du_tin_chi.toLocaleString('vi-VN')} tín chỉ khả dụng.`);
    }
    if (credits < MIN_WITHDRAW_CREDITS) {
      throw new Error(`Mức rút tối thiểu là ${MIN_WITHDRAW_CREDITS} tín chỉ (${(MIN_WITHDRAW_CREDITS * CREDIT_EXCHANGE_RATE).toLocaleString('vi-VN')} đ).`);
    }

    const user = this.data.users.find(u => u.id === userId);
    // Freeze credits
    wallet.so_du_tin_chi -= credits;
    wallet.so_du_dong_bang += credits;
    wallet.updatedAt = new Date().toISOString();

    const so_tien_vnd = credits * CREDIT_EXCHANGE_RATE;
    const req: WithdrawalRequest = {
      id: `with-${Date.now()}`,
      ma_lenh: `WR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      userName: user ? user.fullName : 'Thành viên',
      userRole: user ? user.role : 'SELLER',
      companyName: user ? user.companyName : '',
      so_tin_chi: credits,
      so_tien_vnd,
      phi_rut_vnd: 0,
      thuc_nhan_vnd: so_tien_vnd,
      ngan_hang: bankInfo.ngan_hang,
      so_tai_khoan: bankInfo.so_tai_khoan,
      ten_chu_tai_khoan: bankInfo.ten_chu_tai_khoan.toUpperCase(),
      trang_thai: 'cho_duyet',
      ngay_tao: new Date().toISOString()
    };

    if (!this.data.withdrawalRequests) this.data.withdrawalRequests = [];
    this.data.withdrawalRequests.unshift(req);

    // Add pending transaction
    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      ma_giao_dich: `TX-RUT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName: user ? user.fullName : '',
      userRole: user ? user.role : 'SELLER',
      loai_giao_dich: 'RUT_TIEN',
      so_tin_chi: -credits,
      so_tien_vnd,
      so_du_sau_giao_dich: wallet.so_du_tin_chi,
      phuong_thuc: `Chuyển khoản ${bankInfo.ngan_hang} (${bankInfo.so_tai_khoan})`,
      thong_tin_ngan_hang: bankInfo,
      trang_thai: 'cho_xu_ly',
      ghi_chu: `Lệnh rút ${credits} tín chỉ về ${bankInfo.ngan_hang} (Chờ duyệt)`,
      thoi_gian: new Date().toISOString()
    };
    if (!this.data.creditTransactions) this.data.creditTransactions = [];
    this.data.creditTransactions.unshift(tx);

    this.saveToStorage();
    return req;
  }

  public approveWithdrawal(requestId: string, adminId: string, adminName: string, refCode: string = 'FT-AUTO-OK'): void {
    const req = this.data.withdrawalRequests.find(w => w.id === requestId);
    if (!req || req.trang_thai !== 'cho_duyet') return;

    req.trang_thai = 'da_duyet';
    req.ngay_duyet = new Date().toISOString();
    req.nguoi_duyet = adminName;
    req.ma_tham_chieu_ngan_hang = refCode;

    const wallet = this.getWallet(req.userId);
    wallet.so_du_dong_bang = Math.max(0, wallet.so_du_dong_bang - req.so_tin_chi);
    wallet.tong_rut_tin_chi += req.so_tin_chi;
    wallet.updatedAt = new Date().toISOString();

    const tx = (this.data.creditTransactions || []).find(
      t => t.userId === req.userId && t.loai_giao_dich === 'RUT_TIEN' && t.trang_thai === 'cho_xu_ly'
    );
    if (tx) {
      tx.trang_thai = 'thanh_cong';
      tx.ghi_chu = `Rút thành công ${req.so_tin_chi} tín chỉ về ${req.ngan_hang}. Mã tham chiếu: ${refCode}`;
    }

    this.addAuditLog({
      adminId,
      adminName,
      hanh_dong: 'DUYET_RUT_TIN_CHI',
      doi_tuong: 'withdrawal_request',
      doi_tuong_id: req.id,
      mo_ta: `Phê duyệt chi tiền ${req.thuc_nhan_vnd.toLocaleString('vi-VN')} đ (${req.so_tin_chi} tín chỉ) cho ${req.companyName} qua ${req.ngan_hang}`
    });

    this.saveToStorage();
  }

  public rejectWithdrawal(requestId: string, adminId: string, adminName: string, reason: string): void {
    const req = this.data.withdrawalRequests.find(w => w.id === requestId);
    if (!req || req.trang_thai !== 'cho_duyet') return;

    req.trang_thai = 'tu_choi';
    req.ly_do_tu_choi = reason;
    req.ngay_duyet = new Date().toISOString();
    req.nguoi_duyet = adminName;

    const wallet = this.getWallet(req.userId);
    wallet.so_du_dong_bang = Math.max(0, wallet.so_du_dong_bang - req.so_tin_chi);
    wallet.so_du_tin_chi += req.so_tin_chi;
    wallet.updatedAt = new Date().toISOString();

    const tx = (this.data.creditTransactions || []).find(
      t => t.userId === req.userId && t.loai_giao_dich === 'RUT_TIEN' && t.trang_thai === 'cho_xu_ly'
    );
    if (tx) {
      tx.trang_thai = 'tu_choi';
      tx.ghi_chu = `Từ chối lệnh rút. Lý do: ${reason}. Đã hoàn lại ${req.so_tin_chi} tín chỉ vào số dư.`;
    }

    this.addAuditLog({
      adminId,
      adminName,
      hanh_dong: 'TU_CHOI_RUT_TIN_CHI',
      doi_tuong: 'withdrawal_request',
      doi_tuong_id: req.id,
      mo_ta: `Từ chối lệnh rút tiền ${req.so_tin_chi} tín chỉ của ${req.companyName}. Lý do: ${reason}`
    });

    this.saveToStorage();
  }

  public payWithCredits(userId: string, amountCredits: number, serviceName: string): boolean {
    const wallet = this.getWallet(userId);
    if (wallet.so_du_tin_chi < amountCredits) {
      return false;
    }
    const user = this.data.users.find(u => u.id === userId);
    wallet.so_du_tin_chi -= amountCredits;
    wallet.tong_chi_tieu_tin_chi += amountCredits;
    wallet.updatedAt = new Date().toISOString();

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      ma_giao_dich: `TX-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName: user ? user.fullName : '',
      userRole: user ? user.role : 'BUYER',
      loai_giao_dich: 'THANH_TOAN_DICH_VU',
      so_tin_chi: -amountCredits,
      so_tien_vnd: amountCredits * CREDIT_EXCHANGE_RATE,
      so_du_sau_giao_dich: wallet.so_du_tin_chi,
      phuong_thuc: 'Ví Tín Chỉ POLYMATCH',
      trang_thai: 'thanh_cong',
      ghi_chu: `Thanh toán dịch vụ: ${serviceName}`,
      thoi_gian: new Date().toISOString()
    };
    if (!this.data.creditTransactions) this.data.creditTransactions = [];
    this.data.creditTransactions.unshift(tx);
    this.saveToStorage();
    return true;
  }

  public adminAdjustCredits(
    userId: string,
    amountCredits: number,
    reason: string,
    adminId: string,
    adminName: string
  ): CreditTransaction {
    const wallet = this.getWallet(userId);
    const user = this.data.users.find(u => u.id === userId);

    wallet.so_du_tin_chi += amountCredits;
    if (amountCredits > 0) {
      wallet.tong_thu_tin_chi += amountCredits;
    } else {
      wallet.tong_chi_tieu_tin_chi += Math.abs(amountCredits);
    }
    wallet.updatedAt = new Date().toISOString();

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      ma_giao_dich: `TX-ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName: user ? user.fullName : '',
      userRole: user ? user.role : 'BUYER',
      loai_giao_dich: 'DIEU_CHINH_ADMIN',
      so_tin_chi: amountCredits,
      so_tien_vnd: Math.abs(amountCredits) * CREDIT_EXCHANGE_RATE,
      so_du_sau_giao_dich: wallet.so_du_tin_chi,
      phuong_thuc: 'Điều chỉnh bởi Ban Quản trị',
      trang_thai: 'thanh_cong',
      ghi_chu: `Admin điều chỉnh (${amountCredits > 0 ? '+' : ''}${amountCredits} tín chỉ): ${reason}`,
      thoi_gian: new Date().toISOString()
    };

    if (!this.data.creditTransactions) this.data.creditTransactions = [];
    this.data.creditTransactions.unshift(tx);

    this.addAuditLog({
      adminId,
      adminName,
      hanh_dong: 'DIEU_CHINH_TIN_CHI',
      doi_tuong: 'wallet',
      doi_tuong_id: userId,
      mo_ta: `Điều chỉnh ${amountCredits > 0 ? '+' : ''}${amountCredits} tín chỉ cho ${user?.companyName || userId}. Lý do: ${reason}`
    });

    this.saveToStorage();
    return tx;
  }

  public resetToSeed(): void {
    localStorage.removeItem(DB_KEY);
    this.data = this.getInitialData();
    this.saveToStorage();
  }
}

export const dbService = new MockDatabaseService();
