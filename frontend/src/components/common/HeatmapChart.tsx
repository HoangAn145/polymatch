import React from 'react';
import { PillarId } from '../../types';
import { DBI_PILLARS } from '../../data/mockData';

interface HeatmapChartProps {
  userScores: Record<PillarId, number>;
  industryScores: Record<PillarId, number>;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ userScores, industryScores }) => {
  const getScoreColor = (score: number) => {
    if (score <= 20) return { bg: 'bg-rose-100', text: 'text-rose-700', bar: 'bg-rose-500', label: 'Cấp 1: Khởi động' };
    if (score <= 40) return { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500', label: 'Cấp 2: Bắt đầu' };
    if (score <= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500', label: 'Cấp 3: Hình thành' };
    if (score <= 80) return { bg: 'bg-teal-100', text: 'text-teal-700', bar: 'bg-teal-500', label: 'Cấp 4: Nâng cao' };
    return { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-500', label: 'Cấp 5: Dẫn dắt' };
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DBI_PILLARS.map((p) => {
          const score = userScores[p.id] ?? 0;
          const indScore = industryScores[p.id] ?? 40;
          const meta = getScoreColor(score);
          const diff = score - indScore;

          return (
            <div 
              key={p.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold mt-1 ${meta.bg} ${meta.text}`}>
                    {meta.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-slate-900">{score}<span className="text-xs font-medium text-slate-400">/100</span></div>
                  <span className={`text-[11px] font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {diff >= 0 ? `+${diff}` : diff} so với ngành
                  </span>
                </div>
              </div>

              {/* Dual Bar Progress */}
              <div className="space-y-1 mt-1">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${meta.bar}`}
                    style={{ width: `${Math.max(4, score)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Mức chuẩn ngành: {indScore} điểm</span>
                  <span>Trọng số: {Math.round(p.weight * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
