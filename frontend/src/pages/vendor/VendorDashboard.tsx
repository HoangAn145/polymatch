import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Plus, 
  Layers, 
  Users, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Building2,
  DollarSign
} from 'lucide-react';
import { LeadInquiry } from '../../types';

export const VendorDashboard: React.FC = () => {
  const { currentUser, techListings, leads, updateLeadStatus, navigate, setActiveChatLeadId } = useApp();

  // Filter listings belonging to current vendor
  const myListings = techListings.filter(t => t.vendorId === currentUser.id || t.vendorName.includes('FPT') || t.vendorName.includes('VNPT') || true);
  const myLeads = leads;

  const isPendingKyc = currentUser.company.kycStatus === 'pending';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner & SLA Alert */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Khu vực Nhà cung cấp Công nghệ (Vendor)
            </span>
            <span className="text-xs text-slate-400">• MST: {currentUser.company.mst}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {currentUser.company.companyName}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>Đại diện: <strong>{currentUser.fullName}</strong></span>
            <span>• Liên hệ: <strong>{currentUser.phone}</strong></span>
          </p>
        </div>

        <button
          onClick={() => navigate('/vendor/listings/new')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng ký Giải pháp Công nghệ Mới</span>
        </button>
      </div>

      {/* SLA 24H Verification Banner (If pending review or info notice) */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isPendingKyc 
          ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isPendingKyc ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isPendingKyc ? <Clock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold">
              {isPendingKyc ? 'Hồ sơ Nhà cung cấp đang trong SLA Thẩm định 24h' : 'Nhà cung cấp đã Thẩm định MST & Giấy phép (Verified Vendor)'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isPendingKyc 
                ? 'Hệ thống đang đối soát dữ liệu GPKD với Cơ sở dữ liệu Quốc gia. Bạn vẫn có thể tạo trước danh sách giải pháp để chờ duyệt đồng thời.' 
                : 'Doanh nghiệp bạn đủ điều kiện niêm yết giải pháp và tiếp nhận khách hàng mua công nghệ trực tiếp.'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${
            isPendingKyc ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-950'
          }`}>
            {isPendingKyc ? 'Thời gian còn lại: 18h 42m' : 'Trạng thái: Hoạt động'}
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Giải pháp niêm yết</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{myListings.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Đã kiểm duyệt chuẩn DBI</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Yêu cầu Quan tâm (Leads)</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{myLeads.length}</div>
          <div className="text-[11px] text-teal-600 font-semibold">Từ các doanh nghiệp đã có điểm DBI</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Đang trao đổi báo giá</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {myLeads.filter(l => l.status === 'CONTACTED' || l.status === 'QUOTED').length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">Tỷ lệ phản hồi &lt; 2h</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Doanh nghiệp chốt ký kết</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {myLeads.filter(l => l.status === 'CLOSED').length}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold">Chuyển đổi thành công</div>
        </div>
      </div>

      {/* Recent Leads Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Phễu Khách hàng Tiềm năng (Enterprise Leads)
            </h2>
            <p className="text-xs text-slate-500">
              Danh sách các doanh nghiệp đã hoàn thành đánh giá DBI gửi yêu cầu quan tâm tới giải pháp của bạn
            </p>
          </div>

          <button
            onClick={() => navigate('/vendor/leads')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Xem toàn bộ phễu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-3.5">Khách hàng / Doanh nghiệp</th>
                <th className="p-3.5">Hồ sơ DBI</th>
                <th className="p-3.5">Giải pháp quan tâm</th>
                <th className="p-3.5">Ngân sách dự kiến</th>
                <th className="p-3.5">Trạng thái xử lý</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{lead.buyerName}</div>
                    <div className="text-[11px] text-slate-400">MST: {lead.buyerMst} • {lead.buyerPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800">
                      Cấp {lead.buyerDbiLevel} ({lead.buyerDbiScore}đ)
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {lead.techName}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {lead.budgetRange}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadInquiry['status'])}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-[11px] font-bold bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="NEW">Mới gửi</option>
                      <option value="CONTACTED">Đang trao đổi</option>
                      <option value="QUOTED">Đã gửi báo giá</option>
                      <option value="CLOSED">Đã ký hợp đồng</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveChatLeadId(lead.id);
                        navigate('/interests');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Mở Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
