import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  ArrowRight, 
  BarChart2, 
  TrendingUp, 
  Download, 
  Eye, 
  RefreshCw,
  Award
} from 'lucide-react';
import { DBI_LEVELS } from '../../data/mockData';

export const AssessmentHistoryPage: React.FC = () => {
  const { currentResult, currentUser, navigate } = useApp();

  // Sample history runs
  const historyRuns = [
    {
      id: currentResult.id,
      date: currentResult.date,
      score: currentResult.totalScore,
      level: currentResult.level,
      levelTitle: currentResult.levelTitle,
      status: 'Chính thức',
      pillarsSummary: 'Hoàn thiện 6/6 trụ cột (Đạt chuẩn Cấp 2)',
      isCurrent: true
    },
    {
      id: 'DBI-2025-Q3-0981',
      date: '15/09/2025',
      score: 32,
      level: 1,
      levelTitle: 'Khởi đầu chuyển đổi số',
      status: 'Lịch sử',
      pillarsSummary: 'Điểm thấp ở Vận hành & Hạ tầng số',
      isCurrent: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <History className="w-3.5 h-3.5" />
            <span>Nhật ký Chuyển đổi số Doanh nghiệp</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Lịch sử Đánh giá & Tiến trình Nâng hạng DBI
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi sự chuyển biến về chỉ số trưởng thành số qua các quý của {currentUser.company.companyName}
          </p>
        </div>

        <button
          onClick={() => navigate('/assessment/intro')}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Thực hiện Khảo sát Mới</span>
        </button>
      </div>

      {/* Improvement Metric Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Mức độ tăng trưởng điểm DBI: +16 điểm</h4>
            <p className="text-xs text-slate-300">
              Doanh nghiệp đã thăng từ Cấp độ 1 (Khởi tạo) lên Cấp độ 2 (Đang thử nghiệm).
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-300 block">Kỳ đánh giá kế tiếp khuyến nghị:</span>
          <strong className="text-sm text-teal-300 font-extrabold">Quý 3/2026</strong>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Mã hồ sơ</th>
                <th className="p-4">Ngày khảo sát</th>
                <th className="p-4">Tổng điểm DBI</th>
                <th className="p-4">Cấp độ Trưởng thành</th>
                <th className="p-4">Ghi chú tiến độ</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRuns.map((run) => {
                const lvl = DBI_LEVELS.find(l => l.level === run.level) || DBI_LEVELS[0];
                return (
                  <tr key={run.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {run.id}
                      {run.isCurrent && (
                        <span className="ml-2 text-[10px] font-extrabold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                          Mới nhất
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">{run.date}</td>
                    <td className="p-4">
                      <span className="text-sm font-extrabold text-teal-700">{run.score}/100</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${lvl.badgeColor}`}>
                        Cấp {run.level}: {lvl.title}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{run.pillarsSummary}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate('/assessment/active/result')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem Báo cáo Radar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
