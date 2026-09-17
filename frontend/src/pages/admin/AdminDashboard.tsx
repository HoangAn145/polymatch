import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  Sliders, 
  BarChart3, 
  TrendingUp,
  AlertCircle,
  DollarSign,
  Handshake,
  KeyRound
} from 'lucide-react';
import { DBI_LEVELS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { 
    techListings, 
    pendingVendors, 
    approveVendor, 
    approveListing, 
    navigate, 
    matchingWeights,
    platformPricing,
    leads
  } = useApp();

  const pendingListings = techListings.filter(t => t.status === 'PENDING_REVIEW');
  const unlockedLeadsCount = leads.filter(l => l.isUnlocked).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Khu vực Quản trị Hệ thống DBI Quốc gia (Admin)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Bảng điều khiển Tổng quan & Kiểm duyệt
          </h1>
          <p className="text-xs text-slate-500">
            Giám sát mức độ trưởng thành số của các doanh nghiệp, phê duyệt nhà cung cấp và tinh chỉnh thuật toán khớp nối AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/matching-config')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Biểu phí Thu Nền tảng</span>
          </button>
          <button
            onClick={() => navigate('/admin/matching-config')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Trọng số Khớp nối AI (1.0)</span>
          </button>
        </div>
      </div>

      {/* Macro System KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Doanh nghiệp đánh giá</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">1.458</div>
          <div className="text-[11px] text-teal-600 font-semibold">+12% so với tháng trước</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Nhà cung cấp thẩm định</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">152</div>
          <div className="text-[11px] text-blue-600 font-semibold">100% Xác thực MST</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Hồ sơ Vendor chờ duyệt</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{pendingVendors.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold">SLA duyệt trong 24h</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Giải pháp chờ duyệt</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{pendingListings.length}</div>
          <div className="text-[11px] text-purple-600 font-semibold">Closed Taxonomy</div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase">Doanh thu Phí Mở Lead</span>
            <DollarSign className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-extrabold text-blue-950">15.858.000 <span className="text-xs font-bold text-slate-500">đ</span></div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span>142 lượt mở • Giao dịch ngoài 100%</span>
          </div>
        </div>
      </div>

      {/* Platform Pay-per-Lead Policy Summary */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-black text-teal-400 uppercase tracking-wider">
            <Handshake className="w-4 h-4" />
            <span>Mô hình Doanh thu Nền tảng: Pay-per-Lead (Mở khóa theo nhu cầu)</span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Phí mở lead: Khi vendor bấm xem chi tiết một lead / RFQ. <strong>Vendor chỉ trả khi có nhu cầu thật</strong> ({platformPricing.smeLeadUnlockFee.toLocaleString('vi-VN')}đ / SME, {platformPricing.largeLeadUnlockFee.toLocaleString('vi-VN')}đ / Lớn). Không thu được hợp đồng thì vendor cũng không mất gì. Nền tảng chấp nhận vendor mở rồi giao dịch ngoài tự do vì đã thu phí ngay từ đầu.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/matching-config')}
          className="shrink-0 px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
        >
          Điều chỉnh biểu phí
        </button>
      </div>

      {/* Distribution of Enterprise Maturity Levels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Phân bổ Mức độ Trưởng thành Số Doanh nghiệp Toàn quốc (Khung DBI)
            </h2>
            <p className="text-xs text-slate-500">
              Thống kê tỷ lệ doanh nghiệp theo 5 Cấp độ trưởng thành số
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Dữ liệu tổng hợp thời gian thực
          </span>
        </div>

        {/* 5 Levels Bar breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {DBI_LEVELS.map((lvl) => {
            // Simulated percentages based on realistic enterprise distribution
            const percentages = [18, 42, 25, 11, 4];
            const pct = percentages[lvl.level - 1];
            return (
              <div key={lvl.level} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">CẤP {lvl.level}</span>
                  <span className="font-bold text-slate-500">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${pct * 2}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-900 pt-1 leading-snug">{lvl.title}</div>
                <div className="text-[11px] text-slate-400">Điểm: {lvl.minScore} - {lvl.maxScore}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Approval Queues Grid: Vendors & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Queue 1: Pending Vendors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Hàng đợi Duyệt Nhà cung cấp ({pendingVendors.length})
              </h3>
              <p className="text-xs text-slate-500">Kiểm tra Mã số thuế và ĐKKD (SLA: 24h)</p>
            </div>
            <button
              onClick={() => navigate('/admin/vendors')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {pendingVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{vendor.companyName}</h4>
                  <div className="text-[11px] text-slate-500">
                    MST: <strong>{vendor.mst}</strong> • Đại diện: {vendor.representative}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> SLA còn lại: 18 giờ
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveVendor(vendor.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Duyệt ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queue 2: Pending Listings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Hàng đợi Duyệt Giải pháp Công nghệ ({pendingListings.length})
              </h3>
              <p className="text-xs text-slate-500">Kiểm tra Danh mục chuẩn hóa Closed Taxonomy</p>
            </div>
            <button
              onClick={() => navigate('/admin/listings')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {pendingListings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.id_tech}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.techName}</h4>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Nhà cung cấp: <strong>{item.vendorName}</strong>
                  </div>
                  <div className="text-[10px] text-teal-700 font-semibold">
                    {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveListing(item.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Duyệt Niêm yết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
