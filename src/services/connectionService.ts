import {
  ConnectionRequest,
  Quotation,
  Contract,
  ConsultingBooking,
  ReportOrder,
  ProjectTracking
} from '../types';
import { dbService } from './mockDatabase';

export class ConnectionService {
  /**
   * Calculate commission based on contract value (VNYTL rule)
   */
  public calculateCommission(valueVnd: number): { rate: number; amount: number } {
    let rate = 0.05;
    if (valueVnd > 100000000) {
      rate = 0.10; // > 100tr => 10%
    } else if (valueVnd > 50000000) {
      rate = 0.08; // 50 - 100tr => 8%
    } else {
      rate = 0.05; // <= 50tr => 5%
    }
    return {
      rate,
      amount: Math.round(valueVnd * rate)
    };
  }

  /**
   * Buyer sends a connection request to Seller
   */
  public createConnectionRequest(params: {
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
  }): ConnectionRequest {
    const newReq: ConnectionRequest = {
      id: `conn-${Date.now()}`,
      ...params,
      trang_thai: 'moi',
      ngay_tao: new Date().toISOString(),
      ngay_cap_nhat: new Date().toISOString()
    };

    dbService.addConnection(newReq);

    dbService.addAuditLog({
      adminId: "system",
      adminName: "Hệ thống Tự động",
      hanh_dong: "TAO_YEU_CAU_KET_NOI",
      doi_tuong: "ket_noi",
      doi_tuong_id: newReq.id,
      mo_ta: `Doanh nghiệp ${params.buyerCompany} đã gửi yêu cầu kết nối giải pháp ${params.solutionName} tới ${params.sellerCompany}.`
    });

    return newReq;
  }

  /**
   * Seller creates and sends quotation to Buyer
   */
  public sendQuotation(params: {
    connectionId: string;
    sellerId: string;
    sellerCompany: string;
    buyerId: string;
    buyerCompany: string;
    solutionId: string;
    solutionName: string;
    tong_gia_tri: number;
    thoi_gian_trien_khai_tuan: number;
    noi_dung_bao_gia: string;
    cac_hang_muc: { ten: string; so_luong: number; don_gia: number }[];
  }): Quotation {
    const quote: Quotation = {
      id: `quote-${Date.now()}`,
      ...params,
      ngay_gui: new Date().toISOString(),
      han_hieu_luc: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      trang_thai: 'cho_phan_hoi'
    };

    dbService.addQuotation(quote);
    dbService.updateConnection(params.connectionId, {
      trang_thai: 'da_bao_gia',
      bao_gia_id: quote.id
    });

    return quote;
  }

  /**
   * Buyer accepts quotation -> Generates contract & records commission
   */
  public acceptQuotation(quotationId: string): Contract {
    const quote = dbService.getQuotations().find(q => q.id === quotationId);
    if (!quote) throw new Error("Báo giá không tồn tại.");

    dbService.updateQuotation(quotationId, { trang_thai: 'chap_nhan' });

    const comm = this.calculateCommission(quote.tong_gia_tri);

    const contract: Contract = {
      id: `ctr-${Date.now()}`,
      ma_hop_dong: `HD-PM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      connectionId: quote.connectionId,
      quotationId: quote.id,
      buyerId: quote.buyerId,
      buyerCompany: quote.buyerCompany,
      sellerId: quote.sellerId,
      sellerCompany: quote.sellerCompany,
      solutionName: quote.solutionName,
      gia_tri_hop_dong: quote.tong_gia_tri,
      ngay_ky: new Date().toISOString().split('T')[0],
      trang_thai: 'hieu_luc',
      hoa_hong: {
        ty_le: comm.rate,
        so_tien: comm.amount,
        trang_thai: 'chua_doi_soat'
      }
    };

    dbService.addContract(contract);
    dbService.updateConnection(quote.connectionId, { trang_thai: 'hoan_thanh' });

    dbService.addAuditLog({
      adminId: "system",
      adminName: "Hệ thống Tự động",
      hanh_dong: "KY_HOP_DONG",
      doi_tuong: "hop_dong",
      doi_tuong_id: contract.id,
      mo_ta: `Hợp đồng ${contract.ma_hop_dong} trị giá ${(contract.gia_tri_hop_dong / 1000000).toFixed(1)} triệu đồng giữa ${contract.buyerCompany} và ${contract.sellerCompany} đã được ký kết. Ghi nhận nghĩa vụ hoa hồng ${comm.rate * 100}% (${(comm.amount / 1000000).toFixed(1)} triệu đồng).`
    });

    return contract;
  }

  /**
   * Buyer books expert consultation (Basic: 3 sessions / 3tr; Pro: 5 sessions / 6.5tr)
   */
  public bookConsultation(params: {
    buyerId: string;
    buyerCompany: string;
    buyerContactName: string;
    buyerPhone: string;
    buyerEmail: string;
    goi_dich_vu: 'Basic' | 'Pro';
    ngay_mong_muon: string;
    khung_gio: string;
    muc_tieu_tu_van: string;
    chuyen_gia_id?: string;
  }): ConsultingBooking {
    const gia_goi = params.goi_dich_vu === 'Basic' ? 3000000 : 6500000;
    const tong_so_buoi = params.goi_dich_vu === 'Basic' ? 3 : 5;

    let chuyen_gia_ten: string | undefined;
    if (params.chuyen_gia_id) {
      const exp = dbService.getExperts().find(e => e.id === params.chuyen_gia_id);
      if (exp) chuyen_gia_ten = exp.ho_ten;
    }

    const booking: ConsultingBooking = {
      id: `cst-${Date.now()}`,
      ...params,
      gia_goi,
      chuyen_gia_ten,
      trang_thai: params.chuyen_gia_id ? 'da_phan_cong' : 'cho_admin_duyet',
      ngay_tao: new Date().toISOString(),
      so_buoi_hoan_thanh: 0,
      tong_so_buoi
    };

    dbService.addConsulting(booking);

    dbService.addAuditLog({
      adminId: "system",
      adminName: "Hệ thống Tự động",
      hanh_dong: "DAT_LICH_TU_VAN",
      doi_tuong: "lich_tu_van",
      doi_tuong_id: booking.id,
      mo_ta: `Doanh nghiệp ${params.buyerCompany} đã đăng ký gói tư vấn ${params.goi_dich_vu} (${(gia_goi / 1000000).toFixed(1)} triệu đồng).`
    });

    return booking;
  }

  /**
   * Buyer buys deep-dive report (700,000 VND)
   */
  public orderDeepDiveReport(buyerId: string, buyerCompany: string): ReportOrder {
    const order: ReportOrder = {
      id: `rep-${Date.now()}`,
      buyerId,
      buyerCompany,
      loai_bao_cao: "Báo cáo chẩn đoán chuyên sâu & Danh sách giải pháp tối ưu",
      gia: 700000,
      ngay_dat: new Date().toISOString(),
      trang_thai: "da_thanh_toan",
      ma_hoa_don: `INV-REP-${Math.floor(1000 + Math.random() * 9000)}`,
      file_url: "#"
    };

    dbService.addReportOrder(order);

    dbService.addAuditLog({
      adminId: "system",
      adminName: "Hệ thống Tự động",
      hanh_dong: "DAT_MUA_BAO_CAO",
      doi_tuong: "bao_cao",
      doi_tuong_id: order.id,
      mo_ta: `Doanh nghiệp ${buyerCompany} đã mua Báo cáo chẩn đoán chuyên sâu (700.000 VNĐ - Hóa đơn ${order.ma_hoa_don}).`
    });

    return order;
  }

  /**
   * Buyer creates tracking project (3 months / 3tr; 8 months / 5tr; 12 months / 6.5tr)
   */
  public createTrackingProject(params: {
    buyerId: string;
    buyerCompany: string;
    solutionId: string;
    solutionName: string;
    ten_du_an: string;
    goi_theo_doi: '3_thang' | '8_thang' | '12_thang';
  }): ProjectTracking {
    const feeMap = {
      '3_thang': 3000000,
      '8_thang': 5000000,
      '12_thang': 6500000
    };

    const daysMap = {
      '3_thang': 90,
      '8_thang': 240,
      '12_thang': 365
    };

    const proj: ProjectTracking = {
      id: `prj-${Date.now()}`,
      ...params,
      phi_theo_doi: feeMap[params.goi_theo_doi],
      ngay_bat_dau: new Date().toISOString().split('T')[0],
      ngay_ket_thuc_du_kien: new Date(Date.now() + daysMap[params.goi_theo_doi] * 24 * 3600 * 1000).toISOString().split('T')[0],
      tien_do_phan_tram: 15,
      trang_thai: 'dang_cai_dat',
      cac_moc: [
        { id: "m1", ten_moc: "Ký kết hợp đồng & Kế hoạch triển khai", ngay_du_kien: new Date().toISOString().split('T')[0], da_hoan_thanh: true, ngay_hoan_thanh: new Date().toISOString().split('T')[0] },
        { id: "m2", ten_moc: "Khởi tạo môi trường & Cài đặt hệ thống", ngay_du_kien: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0], da_hoan_thanh: false },
        { id: "m3", ten_moc: "Đào tạo nhân sự vận hành", ngay_du_kien: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0], da_hoan_thanh: false },
        { id: "m4", ten_moc: "Vận hành thử nghiệm (UAT)", ngay_du_kien: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0], da_hoan_thanh: false },
        { id: "m5", ten_moc: "Đo lường KPI sau chạy thật & Nghiệm thu", ngay_du_kien: new Date(Date.now() + daysMap[params.goi_theo_doi] * 24 * 3600 * 1000).toISOString().split('T')[0], da_hoan_thanh: false }
      ],
      chi_so_kpi: [
        { ma: "K01", ten: "Tỷ lệ xe chạy rỗng", don_vi: "%", truoc_trien_khai: 28.5, muc_tieu: 15.0, hien_tai: 25.0 },
        { ma: "K04", ten: "Tỷ lệ giao đúng hẹn (OTIF)", don_vi: "%", truoc_trien_khai: 84.0, muc_tieu: 96.0, hien_tai: 88.5 }
      ]
    };

    dbService.addProject(proj);
    return proj;
  }
}

export const connectionService = new ConnectionService();
