import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';
import { DBI_PILLARS, DBI_LEVELS, VIETNAM_INDUSTRIES } from '../../data/mockData';

export const AdminAnalyticsPage: React.FC = () => {
  const { navigate } = useApp();

  const regionalData = [
    { province: 'Hà Nội', count: 482, avgScore: 54.2 },
    { province: 'TP. Hồ Chí Minh', count: 564, avgScore: 56.8 },
    { province: 'Đà Nẵng', count: 142, avgScore: 51.5 },
    { province: 'Bình Dương', count: 156, avgScore: 49.3 },
    { province: 'Hải Phòng', count: 114, avgScore: 48.7 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều khiển Admin</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>Báo cáo Thống kê & Xu hướng Chuyển đổi số Doanh nghiệp</span>
          </h1>
          <p className="text-xs text-slate-500">
            Dữ liệu phân tích vĩ mô chỉ số DBI theo ngành nghề, địa bàn và quy mô tổ chức trên toàn quốc.
          </p>
        </div>
      </div>

      {/* 6 Pillars National Average Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            Điểm Trung bình 6 Trụ cột DBI Toàn quốc
          </h2>
          <span className="text-xs font-bold text-slate-500">Mẫu: 1.458 doanh nghiệp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {DBI_PILLARS.map((p, idx) => {
            const nationalAvg = [55, 48, 44, 42, 38, 46][idx];
            return (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800">{p.shortName}</span>
                  <span className="text-teal-700 font-extrabold text-sm">{nationalAvg}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-teal-600" 
                    style={{ width: `${nationalAvg}%` }} 
                  />
                </div>
                <div className="text-[11px] text-slate-400">Trọng số khung: {Math.round(p.weight * 100)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional breakdown table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Mức độ Tham gia & Điểm số DBI theo Vùng Kinh tế Trọng điểm</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-3.5">Tỉnh / Thành phố</th>
                <th className="p-3.5">Số lượng Doanh nghiệp tham gia</th>
                <th className="p-3.5">Điểm DBI Bình quân</th>
                <th className="p-3.5">Cấp độ Phổ biến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionalData.map((reg) => (
                <tr key={reg.province} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{reg.province}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{reg.count} doanh nghiệp</td>
                  <td className="p-3.5 font-extrabold text-teal-700">{reg.avgScore} / 100</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Cấp độ 2 (Đang thử nghiệm)
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
