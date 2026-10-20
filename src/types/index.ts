// POLYMATCH - Core Type Definitions (Synced with VNYTL & Master Specs)

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export type AccountStatus = 'active' | 'pending' | 'locked';

export type EnterpriseScale = 'sieu_nho' | 'nho' | 'vua' | 'lon';

export type LogisticsBranch = 'VT' | 'FF' | 'KB' | '3PL' | 'LM' | 'KH';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  companyName: string;
  taxId?: string;
  avatarUrl?: string;
  createdAt: string;
  // Specific role metadata
  vendorApproved?: boolean;
  rejectReason?: string;
}

export interface EnterpriseProfile {
  id: string;
  userId: string;
  ten: string;
  ma_so_thue: string;
  tinh_thanh: string;
  dia_chi: string;
  nguoi_lien_he: string;
  so_dien_thoai: string;
  email_lien_he: string;
  so_lao_dong_bhxh: number;
  doanh_thu_nam_truoc: string; // '< 10 tỷ' | '10 - 50 tỷ' | '50 - 300 tỷ' | '> 300 tỷ'
  tong_nguon_von: string; // '< 3 tỷ' | '3 - 20 tỷ' | '20 - 100 tỷ' | '> 100 tỷ'
  quy_mo: EnterpriseScale;
  nhanh: LogisticsBranch;
  dich_vu_3pl?: string[];
  quy_mo_dac_thu: {
    so_xe?: number;
    so_lo_thang?: number;
    dien_tich_kho?: number;
    so_khach_b2b?: number;
    so_don_ngay?: number;
  };
  phan_mem_dang_dung: string[]; // ['ke_toan', 'tms', 'wms', 'oms', 'erp', 'giao_nhan', 'khong']
  ngan_sach_12_thang?: string;
  thoi_diem_trien_khai?: string;
  san_sang_nhan_su?: number;
  san_sang_du_lieu?: number;
  cam_ket_lanh_dao?: number;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  ten: string;
  ma_so_thue: string;
  nguoi_lien_he: string;
  so_dien_thoai: string;
  email_lien_he: string;
  dia_chi: string;
  website: string;
  nhom_cong_nghe: string[];
  nganh_phuc_vu: string[];
  quy_mo_khach_hang: string[];
  trang_thai: 'cho_duyet' | 'da_duyet' | 'tu_choi';
  ly_do_tu_choi?: string;
  mst_tra_cuu?: {
    ten_dang_ky: string;
    ngay_cap: string;
    tinh_trang: string;
    nguon: string;
  };
  goi_tham_gia: {
    ten_goi: string;
    phi_nam: number;
    ngay_bat_dau: string;
    ngay_het_han: string;
    trang_thai_phi: 'da_thanh_toan' | 'chua_thanh_toan' | 'mien_phi_pilot';
  };
  updatedAt: string;
}

export interface QuestionOption {
  muc: number; // 1 to 5
  noi_dung: string;
  mo_ta_chi_tiet?: string;
}

export interface Question {
  id: string;
  ma: string;
  phan: 'dbi' | 'ldmi' | 'quick' | 'kpi' | 'san_sang';
  tru_cot_dbi?: string;
  nhom_nang_luc?: 'VT' | 'KB' | 'GN' | 'DH' | 'HT' | 'CT' | 'CP' | 'XA';
  nhanh_ap_dung: string[]; // LogisticsBranch[]
  tieu_de: string;
  giai_thich_thuat_ngu?: string;
  phuong_an: QuestionOption[];
  bat_buoc: boolean;
  ma_khoang_trong?: string;
}

export interface KnowledgeGap {
  ma: string; // e.g. 'G-VT-01'
  nhom_nang_luc: string;
  ten: string;
  trieu_chung: string;
  nguyen_nhan: string;
  buoc_tiep: {
    muc_1: string;
    muc_2: string;
    muc_3: string;
    muc_4: string;
  };
  dieu_kien: string;
  chi_so: string;
  rui_ro: string;
  nguon: string[];
  luu_y_bang_chung?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  doanh_nghiep_id: string;
  lan_thu: number;
  ngay_tao: string;
  trang_thai: 'nhap' | 'hoan_thanh';
  
  // Scores
  dbi_diem: number; // 0 - 100
  dbi_muc: 'Khởi động' | 'Bắt đầu' | 'Hình thành' | 'Nâng cao' | 'Dẫn dắt';
  dbi_tru_cot: {
    ten: string;
    diem: number;
  }[];

  ldmi_diem: number; // 0 - 100
  ldmi_muc: 'Thủ công' | 'Số hóa' | 'Tích hợp' | 'Hiển thị' | 'Thông minh';
  ldmi_nhom: {
    ma: string;
    ten: string;
    diem: number;
  }[];

  // Top 3 Bottlenecks
  top_khoang_trong: {
    thu_hang: number;
    ma: string;
    ten: string;
    nhom: string;
    diem_gap: number;
    trieu_chung: string;
    nguyen_nhan: string;
    buoc_tiep_theo: string;
    chi_so_khuyen_nghi: string;
  }[];

  // AI Interpretation (Synchronized with 06_PROMPT_AI_DIEN_GIAI.md)
  ai_dien_giai: {
    tom_tat: string;
    diem_manh: string[];
    diem_nghen: {
      ma: string;
      hien_trang: string;
      nguyen_nhan_co_the: string;
      tac_dong: string;
      buoc_chuan_bi: string;
      kpi: string[];
      nguon: string[];
    }[];
    gioi_han: string;
  };

  // Answers snapshot
  tra_loi: Record<string, number>;
}

export interface Solution {
  id: string;
  ma: string;
  ten: string;
  nhom_giai_phap: string; // 'WMS' | 'TMS' | 'OMS' | 'TICH_HOP' | 'DRP' | 'DIEU_PHOI_TU_DONG' | 'TOI_UU_TUYEN' | 'DASHBOARD' | 'DINH_VI' | 'CANH_BAO_ETA' | 'CONTROL_TOWER' | 'SAN_GIAO_VAN' | 'QUAN_LY_DOI_XE' | 'CONG_KHACH_HANG' | 'BI' | 'DU_BAO' | 'GIAO_NHAN' | 'BAO_GIA' | 'THEO_DOI_LO' | 'EPOD' | 'CHUNG_TU' | 'OCR' | 'PHAT_THAI' | 'DOI_SOAT' | 'MA_VACH' | 'COST_TO_SERVE';
  hoat_dong_logistics: string[];
  khoang_trong_giai_quyet: string[]; // G-VT-01, etc.
  phan_khuc: string[];
  muc_ldmi_phu_hop: number; // 1-5
  quy_mo_phu_hop: EnterpriseScale[];
  khoang_gia_text: string;
  gia_min_trieu?: number;
  gia_max_trieu?: number;
  mo_hinh_chi_phi: 'thue_bao_thang' | 'thue_bao_nam' | 'thiet_bi' | 'du_an' | 'lien_he';
  trang_thai_gia: 'cong_khai' | 'thu_cap' | 'lien_he';
  thoi_gian_trien_khai: string;
  tich_hop: string[];
  nguon_luc_can: string[];
  nha_cung_cap_id?: string;
  nha_cung_cap_ten: string;
  trang_thai_nguon: 'da_xac_thuc' | 'tham_khao';
  la_tai_tro: boolean;
  mo_ta: string;
  tinh_nang_chinh: string[];
  case_study?: string;
  danh_gia_sao: number;
  so_luot_danh_gia: number;
}

export interface SolutionMatch {
  solution: Solution;
  matchScore: number; // 0 - 100%
  breakdown: {
    khoang_trong: number; // 0 - 1
    uu_tien: number;
    loai_hinh_quy_mo: number;
    ngan_sach: number;
    san_sang: number;
    he_thong: number;
    kiem_chung: number;
  };
  ly_do: string[];
  han_che: string[];
}

export interface ConnectionRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  buyerEmail: string;
  sellerId: string;
  sellerCompany: string;
  solutionId: string;
  solutionName: string;
  nhu_cau_chi_tiet: string;
  ngan_sach_du_kien: string;
  thoi_gian_du_kien: string;
  trang_thai: 'moi' | 'da_tiep_nhan' | 'dang_trao_doi' | 'da_bao_gia' | 'hoan_thanh' | 'da_huy';
  ngay_tao: string;
  ngay_cap_nhat: string;
  ghi_chu_seller?: string;
  bao_gia_id?: string;
}

export interface Quotation {
  id: string;
  connectionId: string;
  sellerId: string;
  sellerCompany: string;
  buyerId: string;
  buyerCompany: string;
  solutionId: string;
  solutionName: string;
  tong_gia_tri: number; // in VND
  thoi_gian_trien_khai_tuan: number;
  noi_dung_bao_gia: string;
  cac_hang_muc: {
    ten: string;
    so_luong: number;
    don_gia: number;
  }[];
  ngay_gui: string;
  han_hieu_luc: string;
  trang_thai: 'cho_phan_hoi' | 'chap_nhan' | 'tu_choi';
}

export interface Contract {
  id: string;
  ma_hop_dong: string;
  connectionId: string;
  quotationId: string;
  buyerId: string;
  buyerCompany: string;
  sellerId: string;
  sellerCompany: string;
  solutionName: string;
  gia_tri_hop_dong: number; // in VND
  ngay_ky: string;
  trang_thai: 'hieu_luc' | 'dang_trien_khai' | 'hoan_thanh' | 'thanh_ly';
  hoa_hong: {
    ty_le: number; // 0.05, 0.08, 0.10
    so_tien: number;
    trang_thai: 'chua_doi_soat' | 'da_doi_soat' | 'da_thanh_toan';
    ngay_doi_soat?: string;
  };
}

export interface Expert {
  id: string;
  ho_ten: string;
  chuc_danh: string;
  linh_vuc: string[];
  so_nam_kinh_nghiem: number;
  cong_ty_to_chuc: string;
  avatarUrl: string;
  gioi_thieu: string;
  cac_goi_phu_trach: ('Basic' | 'Pro')[];
  so_phien_da_tu_van: number;
  danh_gia_sao: number;
  trang_thai: 'san_sang' | 'ban' | 'ngung_hoat_dong';
}

export interface ConsultingBooking {
  id: string;
  buyerId: string;
  buyerCompany: string;
  buyerContactName: string;
  buyerPhone: string;
  buyerEmail: string;
  goi_dich_vu: 'Basic' | 'Pro'; // Basic: 3 buổi (3 triệu), Pro: 5 buổi (6.5 triệu)
  gia_goi: number;
  chuyen_gia_id?: string;
  chuyen_gia_ten?: string;
  ngay_mong_muon: string;
  khung_gio: string;
  muc_tieu_tu_van: string;
  trang_thai: 'cho_admin_duyet' | 'da_phan_cong' | 'dang_dien_ra' | 'hoan_thanh' | 'da_huy';
  ngay_tao: string;
  so_buoi_hoan_thanh: number;
  tong_so_buoi: number;
  ket_qua_bien_ban?: string;
  tai_lieu_ban_giao_url?: string;
}

export interface ProjectTracking {
  id: string;
  buyerId: string;
  buyerCompany: string;
  solutionId: string;
  solutionName: string;
  ten_du_an: string;
  goi_theo_doi: '3_thang' | '8_thang' | '12_thang';
  phi_theo_doi: number; // 3tr, 5tr, 6.5tr
  ngay_bat_dau: string;
  ngay_ket_thuc_du_kien: string;
  tien_do_phan_tram: number;
  trang_thai: 'khoi_dong' | 'dang_cai_dat' | 'dao_tao' | 'chay_that' | 'nghiem_thu';
  cac_moc: {
    id: string;
    ten_moc: string;
    ngay_du_kien: string;
    da_hoan_thanh: boolean;
    ngay_hoan_thanh?: string;
  }[];
  chi_so_kpi: {
    ma: string;
    ten: string;
    don_vi: string;
    truoc_trien_khai: number;
    muc_tieu: number;
    hien_tai: number;
  }[];
}

export interface ReportOrder {
  id: string;
  buyerId: string;
  buyerCompany: string;
  loai_bao_cao: 'Báo cáo chẩn đoán chuyên sâu & Danh sách giải pháp tối ưu';
  gia: number; // 700.000 VND
  ngay_dat: string;
  trang_thai: 'da_thanh_toan' | 'cho_thanh_toan';
  ma_hoa_don: string;
  file_url?: string;
}

export interface InsightArticle {
  id: string;
  slug: string;
  tieu_de: string;
  tom_tat: string;
  noi_dung: string;
  chuyen_muc: 'TMS-WMS-ERP' | 'AI trong Logistics' | 'Logistics Xanh' | 'Chính sách & Quy định' | 'Case Study' | 'Hướng dẫn chọn công nghệ';
  tac_gia: string;
  ngay_dang: string;
  hinh_anh: string;
  thoi_gian_doc: string;
  tags: string[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  hanh_dong: string;
  doi_tuong: string;
  doi_tuong_id: string;
  mo_ta: string;
  thoi_gian: string;
}

// ================= VÍ TÍN CHỈ (CREDIT WALLET) =================

export type CreditTransactionType =
  | 'NAP_TIEN'
  | 'RUT_TIEN'
  | 'THANH_TOAN_DICH_VU'
  | 'NHAN_HOA_HONG'
  | 'HOAN_TIEN'
  | 'THUONG_KHUYEN_MAI'
  | 'DIEU_CHINH_ADMIN';

export type CreditTransactionStatus = 'thanh_cong' | 'cho_xu_ly' | 'tu_choi' | 'da_huy';

export interface UserWallet {
  userId: string;
  so_du_tin_chi: number;
  so_du_dong_bang: number; // Tín chỉ đang giữ chờ duyệt rút tiền
  tong_nap_tin_chi: number;
  tong_rut_tin_chi: number;
  tong_chi_tieu_tin_chi: number;
  tong_thu_tin_chi: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  ma_giao_dich: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  loai_giao_dich: CreditTransactionType;
  so_tin_chi: number; // Dương là cộng, âm là trừ
  so_tien_vnd: number;
  so_du_sau_giao_dich: number;
  phuong_thuc?: string;
  thong_tin_ngan_hang?: {
    ngan_hang: string;
    so_tai_khoan: string;
    ten_chu_tai_khoan: string;
  };
  trang_thai: CreditTransactionStatus;
  ghi_chu: string;
  thoi_gian: string;
}

export interface WithdrawalRequest {
  id: string;
  ma_lenh: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  companyName: string;
  so_tin_chi: number;
  so_tien_vnd: number;
  phi_rut_vnd: number;
  thuc_nhan_vnd: number;
  ngan_hang: string;
  so_tai_khoan: string;
  ten_chu_tai_khoan: string;
  trang_thai: 'cho_duyet' | 'da_duyet' | 'tu_choi';
  ly_do_tu_choi?: string;
  ngay_tao: string;
  ngay_duyet?: string;
  nguoi_duyet?: string;
  ma_tham_chieu_ngan_hang?: string;
}

export interface CreditPackage {
  id: string;
  ten_goi: string;
  so_tin_chi: number;
  so_tien_vnd: number;
  tin_chi_thuong: number;
  hot?: boolean;
  mo_ta: string;
}

