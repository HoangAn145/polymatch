import { demoMode } from '../lib/supabase';
import { User, EnterpriseProfile, SellerProfile } from '../types';
import { dbService } from './mockDatabase';

const SESSION_KEY = 'polymatch_active_session_user';

export interface RegisterBuyerInput {
  email: string;
  phone: string;
  fullName: string;
  companyName: string;
  taxId: string;
  city: string;
  address: string;
  branch: 'VT' | 'FF' | 'KB' | '3PL' | 'LM' | 'KH';
  scale: 'sieu_nho' | 'nho' | 'vua' | 'lon';
}

export interface RegisterSellerInput {
  email: string;
  phone: string;
  fullName: string;
  companyName: string;
  taxId: string;
  city: string;
  address: string;
  website: string;
  techGroups: string[];
  servedBranches: string[];
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    if (demoMode) this.loadSession();
  }

  private loadSession(): void {
    if (!demoMode) return;
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Default to Buyer in demo environment so immediate inspection works smoothly
        const users = dbService.getUsers();
        this.currentUser = users.find(u => u.role === 'BUYER') || null;
        if (this.currentUser) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
        }
      }
    } catch {
      this.currentUser = null;
    }
  }

  public getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.loadSession();
    }
    return this.currentUser;
  }

  public async login(email: string): Promise<User> {
    if (!demoMode) throw new Error("Đăng nhập bằng Supabase tại /login.");
    const users = dbService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      throw new Error("Tài khoản hoặc email không tồn tại trên hệ thống demo.");
    }

    if (found.status === 'locked') {
      throw new Error("Tài khoản đã bị tạm khóa bởi quản trị viên.");
    }

    this.currentUser = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    return found;
  }

  public async registerBuyer(input: RegisterBuyerInput): Promise<User> {
    const existing = dbService.getUsers().find(u => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (existing) {
      throw new Error("Email này đã được đăng ký trên hệ thống.");
    }

    const newUser: User = {
      id: `user-buyer-${Date.now()}`,
      email: input.email.trim(),
      phone: input.phone.trim(),
      fullName: input.fullName.trim(),
      role: 'BUYER',
      status: 'active',
      companyName: input.companyName.trim(),
      taxId: input.taxId.trim(),
      createdAt: new Date().toISOString()
    };

    const newEnterprise: EnterpriseProfile = {
      id: `ent-${Date.now()}`,
      userId: newUser.id,
      ten: input.companyName.trim(),
      ma_so_thue: input.taxId.trim(),
      tinh_thanh: input.city,
      dia_chi: input.address,
      nguoi_lien_he: input.fullName.trim(),
      so_dien_thoai: input.phone.trim(),
      email_lien_he: input.email.trim(),
      so_lao_dong_bhxh: input.scale === 'sieu_nho' ? 8 : input.scale === 'nho' ? 30 : input.scale === 'vua' ? 80 : 200,
      doanh_thu_nam_truoc: input.scale === 'sieu_nho' ? '< 10 tỷ' : input.scale === 'nho' ? '10 - 50 tỷ' : '50 - 300 tỷ',
      tong_nguon_von: input.scale === 'sieu_nho' ? '< 3 tỷ' : '20 - 100 tỷ',
      quy_mo: input.scale,
      nhanh: input.branch,
      quy_mo_dac_thu: {
        so_xe: input.branch === 'VT' ? 20 : 0,
        dien_tich_kho: input.branch === 'KB' ? 2500 : 0
      },
      phan_mem_dang_dung: ["ke_toan"],
      updatedAt: new Date().toISOString()
    };

    dbService.addUser(newUser);
    dbService.addEnterprise(newEnterprise);

    this.currentUser = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  }

  public async registerSeller(input: RegisterSellerInput): Promise<User> {
    const existing = dbService.getUsers().find(u => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (existing) {
      throw new Error("Email này đã được đăng ký trên hệ thống.");
    }

    const newUser: User = {
      id: `user-seller-${Date.now()}`,
      email: input.email.trim(),
      phone: input.phone.trim(),
      fullName: input.fullName.trim(),
      role: 'SELLER',
      status: 'pending', // Pending Admin approval per spec!
      companyName: input.companyName.trim(),
      taxId: input.taxId.trim(),
      vendorApproved: false,
      createdAt: new Date().toISOString()
    };

    const newSeller: SellerProfile = {
      id: `vendor-${Date.now()}`,
      userId: newUser.id,
      ten: input.companyName.trim(),
      ma_so_thue: input.taxId.trim(),
      nguoi_lien_he: input.fullName.trim(),
      so_dien_thoai: input.phone.trim(),
      email_lien_he: input.email.trim(),
      dia_chi: input.address,
      website: input.website,
      nhom_cong_nghe: input.techGroups,
      nganh_phuc_vu: input.servedBranches,
      quy_mo_khach_hang: ["nho", "vua"],
      trang_thai: "cho_duyet",
      mst_tra_cuu: {
        ten_dang_ky: input.companyName.toUpperCase(),
        ngay_cap: new Date().toISOString().split('T')[0],
        tinh_trang: "Đang hoạt động (Đã xác minh qua cổng Thuế mô phỏng)",
        nguon: "esgoo.net"
      },
      goi_tham_gia: {
        ten_goi: "Gói Nhà Cung Cấp Chuẩn (VNYTL)",
        phi_nam: 6000000,
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        ngay_het_han: new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0],
        trang_thai_phi: "chua_thanh_toan"
      },
      updatedAt: new Date().toISOString()
    };

    dbService.addUser(newUser);
    dbService.addSeller(newSeller);

    dbService.addAuditLog({
      adminId: "system",
      adminName: "Hệ thống Tự động",
      hanh_dong: "DANG_KY_NHA_CUNG_CAP",
      doi_tuong: "nha_cung_cap",
      doi_tuong_id: newSeller.id,
      mo_ta: `Nhà cung cấp ${newSeller.ten} (MST: ${newSeller.ma_so_thue}) đã nộp hồ sơ chờ Admin duyệt.`
    });

    this.currentUser = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  }

  public switchDemoUser(role: 'BUYER' | 'SELLER_APPROVED' | 'SELLER_PENDING' | 'ADMIN'): User {
    if (!demoMode) throw new Error("Chế độ demo đã tắt.");
    const users = dbService.getUsers();
    let target: User | undefined;

    if (role === 'BUYER') {
      target = users.find(u => u.email === 'buyer@vinatrans.vn');
    } else if (role === 'SELLER_APPROVED') {
      target = users.find(u => u.email === 'seller@smartlog.vn');
    } else if (role === 'SELLER_PENDING') {
      target = users.find(u => u.email === 'pending@logitech.vn');
    } else if (role === 'ADMIN') {
      target = users.find(u => u.email === 'admin@polymatch.vn');
    }

    if (!target) {
      target = users[0];
    }

    this.currentUser = target;
    localStorage.setItem(SESSION_KEY, JSON.stringify(target));
    return target;
  }

  public updateUser(userId: string, partial: Partial<User>): User | null {
    const updated = dbService.updateUser(userId, partial);
    if (this.currentUser && this.currentUser.id === userId && updated) {
      this.currentUser = updated;
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  }
}

export const authService = new AuthService();
