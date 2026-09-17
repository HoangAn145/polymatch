import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { ScoreGauge } from '../../components/common/ScoreGauge';
import { DBI_PILLARS, DBI_LEVELS } from '../../data/mockData';
import { DbiCapabilityDossierModal } from '../../components/common/DbiCapabilityDossierModal';
import { GeminiTechAdvisorModal } from '../../components/common/GeminiTechAdvisorModal';

export const BuyerDashboard: React.FC = () => {
  const { currentResult, currentUser, navigate, techListings, leads } = useApp();
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  const levelInfo = DBI_LEVELS.find(l => l.level === currentResult.level) || DBI_LEVELS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Enterprise Identity & Quick Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Khu vực Doanh nghiệp Mua (Buyer)
            </span>
            <span className="text-xs text-slate-400">• MST: {currentUser.company.mst}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {currentUser.company.companyName}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-3">
            <span>Ngành: <strong>{currentUser.company.industry}</strong></span>
            <span>Quy mô: <strong>{currentUser.company.employeeCount} nhân sự ({currentUser.company.size})</strong></span>
            <span>Địa điểm: <strong>{currentUser.company.province}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAiAdvisorOpen(true)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-200" />
            <span>Tư vấn Giải pháp AI Gemini</span>
          </button>

          <button
            onClick={() => setIsDossierModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Xuất Hồ sơ Năng lực (PDF)</span>
          </button>

          <button
            onClick={() => navigate('/assessment/intro')}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Đánh giá DBI Mới</span>
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Overall DBI Score & Level Badge */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Chỉ số DBI Hiện tại</h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Đánh giá: {currentResult.date}
              </span>
            </div>

            <div className="py-2">
              <ScoreGauge 
                score={currentResult.totalScore} 
                levelTitle={`Cấp độ ${currentResult.level}: ${currentResult.levelTitle}`} 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelInfo.badgeColor}`}>
              Cấp {currentResult.level}: {levelInfo.title}
            </span>
            <button
              onClick={() => navigate('/assessment/active/result')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Xem báo cáo Radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Pillar Quick Scores */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800">Điểm số 6 Trụ cột</h2>
              <button 
                onClick={() => navigate('/assessment/active/result')}
                className="text-[11px] font-bold text-teal-700 hover:underline"
              >
                Chi tiết
              </button>
            </div>

            <div className="space-y-3">
              {DBI_PILLARS.map((p) => {
                const score = currentResult.pillarScores[p.id] || 0;
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{p.shortName}</span>
                      <span className="text-slate-900 font-extrabold">{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          score > 60 ? 'bg-teal-500' : score > 40 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, score)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Trung bình ngành của bạn: <strong>{currentResult.industryAvgTotal}/100 điểm</strong>
          </div>
        </div>

        {/* Card 3: AI Diagnosis Summary & Top Gap */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <Sparkles className="w-4 h-4" />
              <span>Chẩn đoán Trí tuệ Nhân tạo (AI DBI Engine)</span>
            </div>
            <h3 className="text-base font-extrabold leading-snug">
              Phát hiện khoảng trống ưu tiên
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {currentResult.aiSummary}
            </p>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span>Khuyến nghị giải quyết cấp bách:</span>
              </div>
              <div className="text-slate-200">
                {currentResult.gaps[0]?.recommendation || 'Đầu tư số hóa quản lý kho và an toàn thông tin.'}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => navigate('/assessment/active/recommendations')}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Xem giải pháp công nghệ phù hợp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Tech Solutions Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Giải pháp Công nghệ AI Khớp nối cho Doanh nghiệp bạn
            </h2>
            <p className="text-xs text-slate-500">
              Dựa trên điểm số Cấp độ {currentResult.level} và nhu cầu ngành {currentUser.company.industry}
            </p>
          </div>
          <button
            onClick={() => navigate('/assessment/active/recommendations')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Xem tất cả ({techListings.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techListings.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.id_tech}
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Khớp 92%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.techName}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>

                <div className="pt-2 text-xs font-bold text-teal-700">
                  {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                  <span className="text-[10px] text-slate-400 font-normal block">{item.priceUnit}</span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/tech/${item.id}`)}
                  className="text-xs font-bold text-slate-700 hover:text-teal-700"
                >
                  Chi tiết
                </button>
                <button
                  onClick={() => navigate('/assessment/active/recommendations')}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                >
                  Bày tỏ quan tâm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capability Dossier Modal */}
      <DbiCapabilityDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        result={currentResult}
        currentUser={currentUser}
      />

      {/* Gemini AI Tech Advisor Modal */}
      <GeminiTechAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        defaultIndustry={currentUser.company.industry || currentResult.industry || 'Bán lẻ'}
        defaultLevel={currentResult.level || 2}
      />
    </div>
  );
};
