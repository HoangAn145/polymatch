import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Send,
  FileText,
  FileCheck2,
  BadgePercent,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';

export const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const solutions = dbService.getSolutions().filter(s => s.nha_cung_cap_id === seller?.id);
  const requests = dbService.getConnections().filter(c => c.sellerId === seller?.id || c.sellerId === currentUser?.id);
  const quotations = dbService.getQuotations().filter(q => q.sellerId === seller?.id || q.sellerId === currentUser?.id);
  const contracts = dbService.getContracts().filter(ctr => ctr.sellerId === seller?.id || ctr.sellerId === currentUser?.id);

  const isApproved = currentUser?.vendorApproved || seller?.trang_thai === 'da_duyet';

  return (
    <div className="space-y-8">
      {/* Verification Alert Banner if Pending */}
      {!isApproved && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-amber-900">
                Tài khoản đang trong hàng đợi xác minh mã số thuế
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Hồ sơ của <strong>{seller.ten}</strong> (MST: {seller.ma_so_thue}) đang được Admin thẩm định theo quy chuẩn VNYTL. Bạn có thể xem trang thái hoặc chuyển sang tài khoản Admin để duyệt ngay.
              </p>
            </div>
          </div>
          <Link to="/seller/verification" className="shrink-0">
            <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900 font-bold">
              Xem tiến độ xác minh &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Seller Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700/50 text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>KÊNH NHÀ CUNG CẤP CÔNG NGHỆ (SELLER)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Xin chào, {currentUser?.fullName || seller.nguoi_lien_he}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {seller.ten} • MST: <strong className="font-mono">{seller.ma_so_thue}</strong> • Trạng thái:{' '}
            <strong className="underline">{isApproved ? 'Đã duyệt chính thức' : 'Chờ Admin xác minh'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link to="/seller/solutions/new">
            <Button
              variant="secondary"
              size="md"
              className="bg-white text-emerald-800 font-bold shadow-sm"
              disabled={!isApproved}
            >
              + Đăng giải pháp mới
            </Button>
          </Link>
          <Link to="/seller/requests">
            <Button variant="outline" size="md" className="border-white/40 text-white hover:bg-white/10 font-medium">
              Yêu cầu kết nối ({requests.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Giải pháp đang niêm yết"
          value={solutions.length}
          change={isApproved ? "Đang hiển thị" : "Bị tạm khóa"}
          changeType={isApproved ? "positive" : "negative"}
          description="Các phân hệ công nghệ trên catalog"
          icon={<Lightbulb className="w-5 h-5 text-emerald-700" />}
          actionText="Quản lý giải pháp"
          onAction={() => navigate('/seller/solutions')}
        />

        <StatCard
          title="Yêu cầu kết nối mới"
          value={requests.length}
          change={requests.filter(r => r.trang_thai === 'moi').length > 0 ? "Cần phản hồi" : "Đã cập nhật"}
          changeType="positive"
          description="Nhu cầu từ các doanh nghiệp logistics"
          icon={<Send className="w-5 h-5 text-blue-600" />}
          actionText="Xem danh sách yêu cầu"
          onAction={() => navigate('/seller/requests')}
        />

        <StatCard
          title="Báo giá đã phát hành"
          value={quotations.length}
          change={contracts.length > 0 ? `${contracts.length} hợp đồng ký` : "Đang chờ phản hồi"}
          changeType="positive"
          description="Báo giá thương mại gửi khách hàng"
          icon={<FileText className="w-5 h-5 text-indigo-600" />}
          actionText="Xem lịch sử báo giá"
          onAction={() => navigate('/seller/quotes')}
        />

        <StatCard
          title="Hợp đồng & Hoa hồng"
          value={contracts.length}
          change="5% - 8% - 10%"
          changeType="neutral"
          description="Đối soát hoa hồng hợp đồng VNYTL"
          icon={<BadgePercent className="w-5 h-5 text-amber-600" />}
          actionText="Đối soát hoa hồng"
          onAction={() => navigate('/seller/commission')}
        />
      </div>

      {/* Incoming Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-extrabold text-base text-slate-900">
              Yêu cầu kết nối từ Doanh nghiệp (Leads)
            </h3>
          </div>
          <Link to="/seller/requests" className="text-xs font-semibold text-[#1769AA] hover:underline">
            Xem tất cả
          </Link>
        </div>

        {requests.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {requests.map(req => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{req.buyerCompany}</span>
                    <Badge variant="primary" size="sm">Giải pháp: {req.solutionName}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">#{req.id}</span>
                  </div>
                  <p className="text-slate-600 text-xs line-clamp-1">{req.nhu_cau_chi_tiet}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span>Người liên hệ: <strong>{req.buyerName} ({req.buyerPhone})</strong></span>
                    <span>Ngân sách: <strong>{req.ngan_sach_du_kien}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/seller/quotes?connId=${req.id}`}>
                    <Button variant="primary" size="sm" disabled={!isApproved}>
                      Tạo báo giá gửi khách
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            Chưa có yêu cầu kết nối nào. Khi Buyer chọn giải pháp của bạn, yêu cầu sẽ hiển thị tại đây.
          </p>
        )}
      </div>

      {/* Subscription Status Card */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Gói Phí Thường Niên Nhà Cung Cấp</Badge>
            <span className="text-xs text-slate-500 font-bold">6.000.000 VNĐ / năm</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hạn thuê bao: <strong>{seller.goi_tham_gia.ngay_bat_dau}</strong> đến <strong>{seller.goi_tham_gia.ngay_het_han}</strong>. Trạng thái: <strong className="text-emerald-700 capitalize">{seller.goi_tham_gia.trang_thai_phi.replace(/_/g, ' ')}</strong>.
          </p>
        </div>

        <Link to="/seller/subscription">
          <Button variant="outline" size="sm">
            Chi tiết quyền lợi gói &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
};
