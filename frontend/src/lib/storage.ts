/**
 * State and Persistence Management for POLYMATCH Logistics
 * Manages Auth (Guest, Buyer, Vendor, Admin), Assessments, RFQs, Wallets, and Audit Logs
 */

import { BranchCode, GroupCode } from '../data/questions';
import { EnterpriseScale, DbiResult, LdmiResult, IdentifiedGap, RecommendedSolution } from './scoring';
import { AiInterpretation } from './gemini';

export type UserRole = 'guest' | 'buyer' | 'vendor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  companyName?: string;
  taxCode?: string;
  branch?: BranchCode;
  scale?: EnterpriseScale;
  credits: number; // Triệu đồng / Điểm tín chỉ
  verified: boolean; // Vendor verified status
  address?: string;
  representative?: string;
  vendorCoverage?: {
    branches: BranchCode[];
    gapCodes: string[];
  };
  subscriptionPlan?: 'co_ban' | 'chuyen_nghiep';
}

export interface QuickScanSession {
  sessionId: string;
  answers: Record<string, string>;
  topAreas: { code: GroupCode; name: string; reason: string }[];
  completedAt: string;
  branch: BranchCode;
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  companyName: string;
  branch: BranchCode;
  dichVu3pl?: string[];
  scale: EnterpriseScale;
  answersDbi: Record<string, number>;
  answersLdmi: Record<string, number>;
  answersMetrics: Record<string, { trang_thai: 'co_do' | 'uoc_luong' | 'khong_do'; gia_tri?: number }>;
  priorities: string[];
  budget: string;
  readiness: { nhanSu?: string; duLieu?: string; lanhDao?: string };
  currentSoftware: string[];
  freeText?: string;
  dbiResult: DbiResult;
  ldmiResult: LdmiResult;
  topGaps: IdentifiedGap[];
  recommendations: RecommendedSolution[];
  aiInterpretation?: AiInterpretation;
  status: 'nhap' | 'da_nop' | 'da_cham';
  createdAt: string;
  processingMs: number;
}

export interface RfqRecord {
  id: string;
  buyerId: string;
  assessmentId: string;
  solutionId?: string;
  solutionName: string;
  branch: BranchCode;
  scale: EnterpriseScale;
  budgetTier: 'bac_1' | 'bac_2' | 'bac_3';
  budgetText: string;
  status: 'dang_phat' | 'dong_du_luot' | 'da_chon' | 'khong_con_nhu_cau' | 'het_han';
  unlockedVendorIds: string[]; // R15: max 5
  createdAt: string;
  expiresAt: string;
  // R14: Anonymous snapshot (safe for vendor preview before unlocking)
  anonymousSnapshot: {
    nhanh: BranchCode;
    quyMo: EnterpriseScale;
    dbiMuc: string;
    ldmiMuc: number;
    ldmiMucTen: string;
    topGaps: string[];
    priorities: string[];
    budget: string;
    date: string;
  };
  // Full contact details (only visible to vendors who unlocked the RFQ)
  fullContact: {
    companyName: string;
    taxCode: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
  };
  quotesReceived: {
    id: string;
    vendorId: string;
    vendorName: string;
    price: string;
    timeline: string;
    message: string;
    createdAt: string;
  }[];
  messages: {
    id: string;
    senderId: string;
    senderRole: 'buyer' | 'vendor';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface WalletTransaction {
  id: string;
  vendorId: string;
  type: 'nap' | 'tru_mo_ho_so' | 'hoan' | 'mua_goi';
  amount: number; // credits / triệu VNĐ
  rfqId?: string;
  note: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

// Default Seed Accounts
const DEFAULT_BUYER: UserProfile = {
  id: 'usr-buyer-01',
  email: 'giamdoc@achau-logistics.vn',
  phone: '0918234567',
  name: 'Trần Văn Hùng',
  role: 'buyer',
  companyName: 'Công ty Cổ phần Vận tải Á Châu Logistics',
  taxCode: '0316956049',
  branch: 'VT',
  scale: 'nho',
  credits: 0,
  verified: true,
  address: '490A Điện Biên Phủ, Phường 21, Bình Thạnh, TP.HCM',
  representative: 'Trần Văn Hùng',
};

const DEFAULT_VENDOR: UserProfile = {
  id: 'usr-vendor-01',
  email: 'contact@gosmartlog.com',
  phone: '02873006879',
  name: 'Đại diện Smartlog',
  role: 'vendor',
  companyName: 'Công ty TNHH Giải pháp Logistics Smartlog',
  taxCode: '0312144913',
  branch: 'VT',
  scale: 'vua',
  credits: 5.0, // 5 triệu đồng trong ví
  verified: true,
  address: '215B32 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức, TP.HCM',
  representative: 'Kurt Bình',
  vendorCoverage: {
    branches: ['VT', 'KB', '3PL', 'LM'],
    gapCodes: ['G-VT-01', 'G-VT-02', 'G-KB-01', 'G-KB-02', 'G-DH-02', 'G-HT-01'],
  },
  subscriptionPlan: 'chuyen_nghiep',
};

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@polymatch.vn',
  name: 'Quản trị viên Hệ thống',
  role: 'admin',
  credits: 999,
  verified: true,
};

// Initial Seed RFQs for Vendor / Admin feeds
const INITIAL_RFQS: RfqRecord[] = [
  {
    id: 'rfq-01',
    buyerId: 'usr-buyer-01',
    assessmentId: 'asm-seed-01',
    solutionId: 'sol-02',
    solutionName: 'Hệ thống Quản lý Vận tải (TMS)',
    branch: 'VT',
    scale: 'nho',
    budgetTier: 'bac_2',
    budgetText: '20 đến 100 triệu đồng',
    status: 'dang_phat',
    unlockedVendorIds: [],
    createdAt: '2026-09-24T10:00:00Z',
    expiresAt: '2026-10-24T10:00:00Z',
    anonymousSnapshot: {
      nhanh: 'VT',
      quyMo: 'nho',
      dbiMuc: 'Bắt đầu',
      ldmiMuc: 2,
      ldmiMucTen: 'Số hóa',
      topGaps: ['G-VT-02: Lập tuyến chưa tối ưu', 'G-VT-01: Điều phối xe thủ công', 'G-XA-01: Chạy rỗng cao'],
      priorities: ['Giảm chi phí vận hành', 'Giảm km chạy rỗng'],
      budget: '20 đến 100 triệu đồng',
      date: '24/09/2026',
    },
    fullContact: {
      companyName: 'Công ty Cổ phần Vận tải Á Châu Logistics',
      taxCode: '0316956049',
      contactPerson: 'Trần Văn Hùng (Giám đốc)',
      phone: '0918234567',
      email: 'giamdoc@achau-logistics.vn',
      address: '490A Điện Biên Phủ, Phường 21, Bình Thạnh, TP.HCM',
    },
    quotesReceived: [],
    messages: []
  },
  {
    id: 'rfq-02',
    buyerId: 'usr-buyer-demo',
    assessmentId: 'asm-seed-02',
    solutionName: 'Quản lý Kho thông minh WMS',
    branch: 'KB',
    scale: 'vua',
    budgetTier: 'bac_3',
    budgetText: '100 đến 300 triệu đồng',
    status: 'dang_phat',
    unlockedVendorIds: ['usr-vendor-other'],
    createdAt: '2026-09-23T14:30:00Z',
    expiresAt: '2026-10-23T14:30:00Z',
    anonymousSnapshot: {
      nhanh: 'KB',
      quyMo: 'vua',
      dbiMuc: 'Hình thành',
      ldmiMuc: 2,
      ldmiMucTen: 'Số hóa',
      topGaps: ['G-KB-01: Tồn kho không chính xác', 'G-KB-02: Năng suất lấy hàng thấp', 'G-HT-02: Hệ thống rời rạc'],
      priorities: ['Tăng độ chính xác tồn kho', 'Rút ngắn thời gian xử lý đơn'],
      budget: '100 đến 300 triệu đồng',
      date: '23/09/2026',
    },
    fullContact: {
      companyName: 'Công ty Cổ phần Tiếp vận ICD Miền Nam',
      taxCode: '0312144913',
      contactPerson: 'Nguyễn Thị Bích (Trưởng phòng Vận hành)',
      phone: '0908112233',
      email: 'bich.nguyen@icd-south.com',
      address: 'Khu công nghiệp Sóng Thần, Bình Dương',
    },
    quotesReceived: [],
    messages: []
  }
];

class StorageService {
  private currentUser: UserProfile | null = null;
  private quickScanSession: QuickScanSession | null = null;
  private assessments: AssessmentRecord[] = [];
  private rfqs: RfqRecord[] = INITIAL_RFQS;
  private transactions: WalletTransaction[] = [];
  private auditLogs: AuditLog[] = [];
  private feeCollectionActive: boolean = false; // R18: default false for Pilot Year 1
  private vendorApplications: {
    id: string;
    companyName: string;
    taxCode: string;
    email: string;
    phone: string;
    representative: string;
    branches: BranchCode[];
    status: 'cho_duyet' | 'da_duyet' | 'tu_choi';
    taxStatus: 'hop_le' | 'cho_duyet_tay';
    submittedAt: string;
  }[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem('polymatch_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        // Default to guest (Khách vãng lai)
        this.currentUser = null;
      }

      const storedQs = localStorage.getItem('polymatch_quickscan');
      if (storedQs) this.quickScanSession = JSON.parse(storedQs);

      const storedAsm = localStorage.getItem('polymatch_assessments');
      if (storedAsm) this.assessments = JSON.parse(storedAsm);

      const storedRfqs = localStorage.getItem('polymatch_rfqs');
      if (storedRfqs) this.rfqs = JSON.parse(storedRfqs);

      const storedTxs = localStorage.getItem('polymatch_txs');
      if (storedTxs) this.transactions = JSON.parse(storedTxs);

      const storedAudit = localStorage.getItem('polymatch_audit');
      if (storedAudit) this.auditLogs = JSON.parse(storedAudit);

      const storedFee = localStorage.getItem('polymatch_fee_active');
      if (storedFee !== null) this.feeCollectionActive = storedFee === 'true';
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu LocalStorage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (this.currentUser) {
        localStorage.setItem('polymatch_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('polymatch_user');
      }

      if (this.quickScanSession) {
        localStorage.setItem('polymatch_quickscan', JSON.stringify(this.quickScanSession));
      }

      localStorage.setItem('polymatch_assessments', JSON.stringify(this.assessments));
      localStorage.setItem('polymatch_rfqs', JSON.stringify(this.rfqs));
      localStorage.setItem('polymatch_txs', JSON.stringify(this.transactions));
      localStorage.setItem('polymatch_audit', JSON.stringify(this.auditLogs));
      localStorage.setItem('polymatch_fee_active', String(this.feeCollectionActive));
    } catch (e) {
      console.error('Lỗi khi lưu LocalStorage:', e);
    }
  }

  // --- Auth & Profile Management ---
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  loginAs(role: 'buyer' | 'vendor' | 'admin'): UserProfile {
    if (role === 'buyer') this.currentUser = { ...DEFAULT_BUYER };
    else if (role === 'vendor') this.currentUser = { ...DEFAULT_VENDOR };
    else if (role === 'admin') this.currentUser = { ...DEFAULT_ADMIN };
    this.saveToStorage();
    return this.currentUser!;
  }

  registerUser(
    email: string,
    name: string,
    role: 'buyer' | 'vendor',
    companyName: string,
    taxCode: string,
    branch: BranchCode = 'VT'
  ): UserProfile {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role,
      companyName,
      taxCode,
      branch,
      scale: 'nho',
      credits: role === 'vendor' ? 2.0 : 0, // Bonus 2 credits for new vendor
      verified: role === 'buyer', // Buyers immediately active; vendors require verification
    };

    this.currentUser = newUser;

    // M02.06: Gắn kết quả Quick Scan đã làm khi chưa đăng nhập vào tài khoản mới
    if (this.quickScanSession && role === 'buyer') {
      newUser.branch = this.quickScanSession.branch;
      this.addAuditLog('SYSTEM', 'LINK_QUICKSCAN', `Ghép Quick Scan session ${this.quickScanSession.sessionId} cho tài khoản ${email}`);
    }

    if (role === 'vendor') {
      this.vendorApplications.push({
        id: `vapp-${Date.now()}`,
        companyName,
        taxCode,
        email,
        phone: '0901234567',
        representative: name,
        branches: [branch],
        status: 'cho_duyet',
        taxStatus: 'hop_le',
        submittedAt: new Date().toISOString(),
      });
    }

    this.saveToStorage();
    return newUser;
  }

  logout() {
    this.currentUser = null;
    this.saveToStorage();
  }

  updateUserProfile(updates: Partial<UserProfile>) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    this.saveToStorage();
  }

  // --- Quick Scan Session ---
  saveQuickScan(qs: QuickScanSession) {
    this.quickScanSession = qs;
    this.saveToStorage();
  }

  getQuickScan(): QuickScanSession | null {
    return this.quickScanSession;
  }

  // --- Assessments ---
  saveAssessment(record: AssessmentRecord) {
    const existingIdx = this.assessments.findIndex((a) => a.id === record.id);
    if (existingIdx >= 0) {
      this.assessments[existingIdx] = record;
    } else {
      this.assessments.unshift(record);
    }
    this.saveToStorage();
  }

  getAssessment(id: string): AssessmentRecord | undefined {
    return this.assessments.find((a) => a.id === id);
  }

  getAssessmentsByUser(userId: string): AssessmentRecord[] {
    return this.assessments.filter((a) => a.userId === userId);
  }

  getLatestAssessment(userId: string): AssessmentRecord | undefined {
    const list = this.getAssessmentsByUser(userId);
    return list[0];
  }

  // --- RFQs & Unlocks ---
  createRfq(rfq: RfqRecord) {
    this.rfqs.unshift(rfq);
    this.saveToStorage();
  }

  getRfqs(): RfqRecord[] {
    return this.rfqs;
  }

  getRfq(id: string): RfqRecord | undefined {
    return this.rfqs.find((r) => r.id === id);
  }

  getRfqsByBuyer(buyerId: string): RfqRecord[] {
    return this.rfqs.filter((r) => r.buyerId === buyerId);
  }

  // R13, R14, R15, R16: Vendor unlocks RFQ
  unlockRfq(rfqId: string, vendorId: string): { success: boolean; message: string; cost: number } {
    const rfq = this.getRfq(rfqId);
    if (!rfq) return { success: false, message: 'Hồ sơ nhu cầu không tồn tại.', cost: 0 };

    // R16: Đã mở rồi thì không trừ tiền lần hai
    if (rfq.unlockedVendorIds.includes(vendorId)) {
      return { success: true, message: 'Bạn đã mở hồ sơ này trước đó. Trả về thông tin đầy đủ.', cost: 0 };
    }

    // R15: Trần cứng 5 lượt mở
    if (rfq.unlockedVendorIds.length >= 5) {
      rfq.status = 'dong_du_luot';
      this.saveToStorage();
      return { success: false, message: 'Hồ sơ này đã đủ tối đa 5 nhà cung cấp mở (R15). Vui lòng chọn hồ sơ khác.', cost: 0 };
    }

    // Tính phí mở theo Bậc phí (R12, R18)
    let cost = 0.10; // Bậc 1
    if (rfq.budgetTier === 'bac_2') cost = 0.20;
    if (rfq.budgetTier === 'bac_3') cost = 0.30;

    // R18: Nếu tắt công tắc thu phí (năm đầu Pilot) thì mở miễn phí nhưng ghi giao dịch 0đ
    if (!this.feeCollectionActive) {
      cost = 0;
    }

    // Kiểm tra số dư ví nếu đang bật thu phí
    if (this.currentUser && this.currentUser.role === 'vendor' && this.feeCollectionActive) {
      if (this.currentUser.credits < cost) {
        return { success: false, message: `Số dư tín chỉ không đủ (cần ${cost} triệu, số dư hiện có: ${this.currentUser.credits} triệu). Vui lòng nạp thêm.`, cost };
      }
      this.currentUser.credits = Math.round((this.currentUser.credits - cost) * 100) / 100;
    }

    // Thực hiện mở hồ sơ
    rfq.unlockedVendorIds.push(vendorId);
    if (rfq.unlockedVendorIds.length >= 5) {
      rfq.status = 'dong_du_luot';
    }

    // Ghi giao dịch
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      vendorId,
      type: 'tru_mo_ho_so',
      amount: cost,
      rfqId,
      note: `Mở hồ sơ nhu cầu ${rfq.solutionName} (${rfq.branch})`,
      timestamp: new Date().toISOString(),
    });

    this.saveToStorage();
    return { success: true, message: 'Mở hồ sơ thành công! Đã hiển thị đầy đủ thông tin liên hệ của doanh nghiệp.', cost };
  }

  // Submit quote from vendor
  submitQuote(rfqId: string, quote: { vendorId: string; vendorName: string; price: string; timeline: string; message: string }) {
    const rfq = this.getRfq(rfqId);
    if (!rfq) return;

    rfq.quotesReceived.push({
      id: `quote-${Date.now()}`,
      ...quote,
      createdAt: new Date().toISOString(),
    });

    this.saveToStorage();
  }

  // Send message in RFQ
  sendMessage(rfqId: string, message: { senderId: string; senderRole: 'buyer' | 'vendor'; senderName: string; text: string }) {
    const rfq = this.getRfq(rfqId);
    if (!rfq) return;

    rfq.messages.push({
      id: `msg-${Date.now()}`,
      ...message,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    });

    this.saveToStorage();
  }

  // R17: Khiếu nại hoàn tín chỉ
  submitRefundComplaint(rfqId: string, reason: string): { success: boolean; message: string } {
    const rfq = this.getRfq(rfqId);
    if (!rfq) return { success: false, message: 'Hồ sơ không tồn tại.' };

    let refundAmount = 0.10;
    if (rfq.budgetTier === 'bac_2') refundAmount = 0.20;
    if (rfq.budgetTier === 'bac_3') refundAmount = 0.30;
    if (!this.feeCollectionActive) refundAmount = 0;

    // Tự động duyệt hoàn nếu sai số điện thoại / sai email (R17)
    if (this.currentUser && this.currentUser.role === 'vendor') {
      this.currentUser.credits = Math.round((this.currentUser.credits + refundAmount) * 100) / 100;
    }

    this.transactions.unshift({
      id: `tx-refund-${Date.now()}`,
      vendorId: this.currentUser?.id || 'vendor',
      type: 'hoan',
      amount: refundAmount,
      rfqId,
      note: `Hoàn tín chỉ: ${reason}`,
      timestamp: new Date().toISOString(),
    });

    this.saveToStorage();
    return { success: true, message: `Khiếu nại được xử lý tự động thành công (R17). Đã hoàn ${refundAmount} triệu tín chỉ vào ví của bạn.` };
  }

  // --- Wallet & Transactions ---
  getTransactions(vendorId?: string): WalletTransaction[] {
    if (!vendorId) return this.transactions;
    return this.transactions.filter((t) => t.vendorId === vendorId);
  }

  topupCredits(vendorId: string, amount: number, note: string = 'Nạp tín chỉ chuyển khoản ngân hàng (Admin duyệt)') {
    if (this.currentUser && this.currentUser.id === vendorId) {
      this.currentUser.credits = Math.round((this.currentUser.credits + amount) * 100) / 100;
    }

    this.transactions.unshift({
      id: `tx-topup-${Date.now()}`,
      vendorId,
      type: 'nap',
      amount,
      note,
      timestamp: new Date().toISOString(),
    });

    this.addAuditLog('ADMIN', 'TOPUP_WALLET', `Cộng ${amount} triệu tín chỉ cho nhà cung cấp ${vendorId}. Lý do: ${note}`);
    this.saveToStorage();
  }

  // --- Admin Configuration & Audit Logs ---
  isFeeActive(): boolean {
    return this.feeCollectionActive;
  }

  setFeeActive(active: boolean, adminEmail: string = 'admin@polymatch.vn') {
    const oldVal = this.feeCollectionActive;
    this.feeCollectionActive = active;
    this.addAuditLog(adminEmail, 'UPDATE_CONFIG', `Đổi bieu_phi.dang_bat từ ${oldVal} sang ${active}`);
    this.saveToStorage();
  }

  addAuditLog(adminEmail: string, action: string, details: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      adminEmail,
      action,
      target: 'SYSTEM',
      details,
      timestamp: new Date().toLocaleString('vi-VN'),
    });
    this.saveToStorage();
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  getVendorApplications() {
    return this.vendorApplications;
  }

  approveVendorApplication(appId: string) {
    const app = this.vendorApplications.find((a) => a.id === appId);
    if (app) {
      app.status = 'da_duyet';
      this.addAuditLog('ADMIN', 'APPROVE_VENDOR', `Duyệt hồ sơ nhà cung cấp ${app.companyName} (${app.taxCode})`);
      this.saveToStorage();
    }
  }
}

export const storage = new StorageService();
