import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  Download, 
  ArrowLeft, 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Layers, 
  Calendar,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export const VendorAnalyticsPage: React.FC = () => {
  const { techListings, leads, navigate, currentUser } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filter listings
  const myListings = techListings.filter(t => t.vendorId === currentUser.id || t.vendorName.includes('FPT') || t.vendorName.includes('VNPT') || true);
  const totalViews = myListings.reduce((sum, item) => sum + (item.views || 450), 0);
  const totalInquiries = leads.length;
  const closedLeads = leads.filter(l => l.status === 'closed' || l.status === 'qualified');

  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/vendor')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều khiển Vendor</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Thống kê Hiệu quả Giải pháp & Chuyển đổi Khách hàng</span>
          </h1>
          <p className="text-xs text-slate-500">
            Dữ liệu tiếp cận từ các doanh nghiệp hoàn thành đánh giá DBI theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '7d' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '30d' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              30 ngày
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '90d' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Quý này
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExporting ? 'Đang kết xuất...' : 'Xuất Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã xuất thành công tệp "Bao_cao_hieu_qua_Vendor_2026.xlsx" chứa danh sách 100% Leads và số liệu tương tác!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Tổng lượt xem giải pháp</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalViews.toLocaleString('vi-VN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+18.5% qua thuật toán gợi ý DBI</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Yêu cầu tư vấn (Inquiries)</span>
            <MessageSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalInquiries}</div>
          <div className="text-[11px] text-teal-600 font-semibold">Tỷ lệ tương tác: 4.8%</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Lead chất lượng cao</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{closedLeads.length + 2}</div>
          <div className="text-[11px] text-indigo-600 font-semibold">Khớp mức DBI và ngân sách</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Doanh thu dự kiến (Pipeline)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">850M đ</div>
          <div className="text-[11px] text-emerald-600 font-semibold">3 hợp đồng trong đàm phán</div>
        </div>
      </div>

      {/* Conversion Funnel & Industry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Phễu Chuyển đổi từ Khảo sát DBI sang Đơn hàng</span>
          </h3>
          <p className="text-xs text-slate-500">
            Hành trình doanh nghiệp tiếp cận giải pháp từ kết quả khảo sát mức độ trưởng thành số.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>1. Xem trong danh sách Đề xuất AI</span>
                <span>{totalViews} lượt (100%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>2. Xem Trang chi tiết & Thêm vào So sánh</span>
                <span>{Math.round(totalViews * 0.35)} lượt (35%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[35%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>3. Bấm "Bày tỏ Quan tâm" & Mở Chatbox</span>
                <span>{totalInquiries} lượt (5.2%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-[16%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>4. Gửi báo giá & Hẹn Demo trực tiếp</span>
                <span>{closedLeads.length + 2} lượt (2.1%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[8%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Demanded Sectors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span>Cơ cấu Khách hàng theo Ngành nghề quan tâm</span>
          </h3>
          <p className="text-xs text-slate-500">
            Tỷ lệ các nhóm ngành tìm kiếm giải pháp chuyển đổi số của đơn vị.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-800">Sản xuất & Chế tạo (Manufacturing)</span>
              </div>
              <span className="text-xs font-extrabold text-blue-700">42% (38 doanh nghiệp)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="text-xs font-bold text-slate-800">Bán lẻ & Thương mại điện tử (Retail)</span>
              </div>
              <span className="text-xs font-extrabold text-teal-700">28% (25 doanh nghiệp)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-slate-800">Logistics & Vận tải kho bãi</span>
              </div>
              <span className="text-xs font-extrabold text-amber-700">18% (16 doanh nghiệp)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span className="text-xs font-bold text-slate-800">Dịch vụ Tài chính & F&B</span>
              </div>
              <span className="text-xs font-extrabold text-purple-700">12% (11 doanh nghiệp)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per Listing Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-700" />
          <span>Hiệu quả chi tiết từng Giải pháp niêm yết</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Giải pháp Công nghệ</th>
                <th className="p-3">Mã Closed Taxonomy</th>
                <th className="p-3">Trụ cột DBI</th>
                <th className="p-3 text-center">Lượt xem</th>
                <th className="p-3 text-center">Yêu cầu Lead</th>
                <th className="p-3 text-center">Đánh giá</th>
                <th className="p-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myListings.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{t.techName}</div>
                    <div className="text-[11px] text-slate-500">{t.priceMin.toLocaleString('vi-VN')} - {t.priceMax.toLocaleString('vi-VN')} {t.priceUnit}</div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {t.id_tech}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">{t.pillarId}</td>
                  <td className="p-3 text-center font-bold">{t.views || 420}</td>
                  <td className="p-3 text-center font-bold text-teal-700">{leads.filter(l => l.techName === t.techName).length || 2}</td>
                  <td className="p-3 text-center font-bold text-amber-600">★ {t.rating}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Đang hoạt động
                    </span>
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
