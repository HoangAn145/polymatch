import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Building2,
  FileCheck2,
  Lightbulb,
  BadgePercent,
  CalendarDays,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { dbService } from '../../services/mockDatabase';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const users = dbService.getUsers();
  const buyers = users.filter(u => u.role === 'BUYER');
  const sellers = dbService.getSellers();
  const pendingSellers = sellers.filter(s => s.trang_thai === 'cho_duyet');
  const solutions = dbService.getSolutions();
  const assessments = dbService.getAssessments();
  const connections = dbService.getConnections();
  const contracts = dbService.getContracts();
  const consultings = dbService.getConsultings();
  const experts = dbService.getExperts();

  const totalRevenueMock = (
    contracts.reduce((sum, c) => sum + c.hoa_hong.so_tien, 0) +
    consultings.reduce((sum, c) => sum + c.gia_goi, 0) +
    dbService.getReportOrders().reduce((sum, r) => sum + r.gia, 0) +
    (sellers.filter(s => s.goi_tham_gia.trang_thai_phi === 'da_thanh_toan').length * 6000000)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Pending Sellers Alert Bar */}
      {pendingSellers.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="font-bold text-xs sm:text-sm">
              Có {pendingSellers.length} hồ sơ Nhà cung cấp đang chờ thẩm định mã số thuế!
            </span>
          </div>
          <Link to="/admin/sellers">
            <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900 font-bold">
              Đến hàng đợi xét duyệt &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-purple-800/50 text-purple-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRUNG TÂM ĐIỀU HÀNH NỀN TẢNG (ADMIN DASHBOARD)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Quản trị Vận hành & Phân tích Toàn hệ thống POLYMATCH
          </h1>
          <p className="text-xs text-purple-200">
            Giám sát 3 vai trò (Buyer, Seller, Admin), mạng lưới Chuyên gia tư vấn và các luồng giao dịch thương mại.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/sellers">
            <Button variant="secondary" size="md" className="bg-white text-purple-900 font-bold shadow-sm">
              Duyệt Nhà cung cấp ({pendingSellers.length})
            </Button>
          </Link>
          <Link to="/admin/experts">
            <Button variant="outline" size="md" className="border-white/40 text-white hover:bg-white/10 font-medium">
              Quản lý Chuyên gia ({experts.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Doanh nghiệp (Buyer)"
          value={buyers.length}
          change="+1 mới tuần này"
          changeType="positive"
          description="Doanh nghiệp logistics tham gia khảo sát"
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          actionText="Xem danh sách doanh nghiệp"
          onAction={() => navigate('/admin/users')}
        />

        <StatCard
          title="Nhà cung cấp (Seller)"
          value={sellers.length}
          change={`${pendingSellers.length} chờ duyệt`}
          changeType={pendingSellers.length > 0 ? "negative" : "positive"}
          description="Đối tác công nghệ đã thẩm định"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          actionText="Thẩm định nhà cung cấp"
          onAction={() => navigate('/admin/sellers')}
        />

        <StatCard
          title="Lượt đánh giá chuyển đổi số"
          value={assessments.length}
          change="DBI & LDMI"
          changeType="positive"
          description="Báo cáo chẩn đoán đã tạo trên sàn"
          icon={<FileCheck2 className="w-5 h-5 text-indigo-600" />}
          actionText="Xem tiêu chí đánh giá"
          onAction={() => navigate('/admin/questions')}
        />

        <StatCard
          title="Doanh thu dịch vụ (Mô phỏng)"
          value={`${(totalRevenueMock / 1000000).toLocaleString('vi-VN')} tr`}
          change="Hoa hồng + Phí sàn"
          changeType="positive"
          description="Báo cáo 700k + Seller 6tr + Tư vấn + Hoa hồng"
          icon={<BadgePercent className="w-5 h-5 text-purple-600" />}
          actionText="Đối soát giao dịch"
          onAction={() => navigate('/admin/transactions')}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Giải pháp công nghệ niêm yết"
          value={solutions.length}
          change="32 giải pháp logistics"
          changeType="neutral"
          icon={<Lightbulb className="w-5 h-5 text-amber-600" />}
          actionText="Duyệt danh mục giải pháp"
          onAction={() => navigate('/admin/solutions')}
        />

        <StatCard
          title="Phiên tư vấn chuyên gia"
          value={consultings.length}
          change={`${experts.length} chuyên gia đối tác`}
          changeType="positive"
          icon={<CalendarDays className="w-5 h-5 text-teal-600" />}
          actionText="Điều phối lịch tư vấn"
          onAction={() => navigate('/admin/consulting')}
        />

        <StatCard
          title="Hợp đồng thương mại ký kết"
          value={contracts.length}
          change="Nguồn kết nối POLYMATCH"
          changeType="positive"
          icon={<FileCheck2 className="w-5 h-5 text-rose-600" />}
          actionText="Xem danh sách hợp đồng"
          onAction={() => navigate('/admin/transactions')}
        />
      </div>

      {/* Quick queues overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Hàng đợi Thẩm định Nhà cung cấp (SLA 24h)</span>
            </h3>
            <Link to="/admin/sellers" className="text-xs font-semibold text-[#1769AA] hover:underline">
              Xem tất cả
            </Link>
          </div>

          {pendingSellers.length > 0 ? (
            <div className="space-y-3">
              {pendingSellers.map(s => (
                <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{s.ten}</div>
                    <div className="text-[11px] text-slate-500 font-mono">MST: {s.ma_so_thue} • Người liên hệ: {s.nguoi_lien_he}</div>
                  </div>
                  <Link to="/admin/sellers">
                    <Button variant="primary" size="sm">Duyệt ngay</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              ✓ Không có hồ sơ nào đang chờ duyệt.
            </p>
          )}
        </div>

        {/* Consulting Queue Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#1769AA]" />
              <span>Lịch tư vấn chuyên gia gần nhất</span>
            </h3>
            <Link to="/admin/consulting" className="text-xs font-semibold text-[#1769AA] hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {consultings.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{c.buyerCompany}</div>
                  <div className="text-[11px] text-slate-500">
                    Gói {c.goi_dich_vu} • Chuyên gia: <strong className="text-[#1769AA]">{c.chuyen_gia_ten || 'Chưa phân công'}</strong>
                  </div>
                </div>
                <Badge variant={c.trang_thai === 'da_phan_cong' ? 'success' : 'warning'} size="sm">
                  {c.trang_thai === 'da_phan_cong' ? 'Đã phân công' : 'Chờ xử lý'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
