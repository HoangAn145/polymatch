import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  GitFork, 
  Filter, 
  Search, 
  ShieldCheck,
  Award,
  Sliders
} from 'lucide-react';
import { SME_ASSESSMENT_QUESTIONS, CONDITIONAL_DEEPENING_QUESTIONS, DBI_PILLARS } from '../../data/mockData';
import { PillarId } from '../../types';

export const AdminQuestionsPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('Q01');

  const allQuestions = [...SME_ASSESSMENT_QUESTIONS, ...CONDITIONAL_DEEPENING_QUESTIONS];

  const filtered = allQuestions.filter(q => {
    if (selectedPillar !== 'ALL' && q.pillarId !== selectedPillar) return false;
    if (searchQuery.trim()) {
      const txt = (q.title + (q.context || '') + q.id).toLowerCase();
      if (!txt.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

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
            <HelpCircle className="w-6 h-6 text-purple-600" />
            <span>Bộ Chỉ số & Câu hỏi Đánh giá Trưởng thành Số Quốc gia (DBI 25 Câu)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Cấu trúc 6 Trụ cột • Thang điểm 5 mức & Cơ chế rẽ nhánh logic tự động
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/matching-config')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Cấu hình Trọng số Thuật toán</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Tổng số câu hỏi</div>
          <div className="text-2xl font-extrabold text-slate-900">{allQuestions.length} câu</div>
          <div className="text-[11px] text-teal-600 font-semibold">25 tiêu chuẩn + 2 chuyên sâu</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Số Trụ cột đánh giá</div>
          <div className="text-2xl font-extrabold text-slate-900">6 Trụ cột</div>
          <div className="text-[11px] text-purple-600 font-semibold">Tỷ trọng đồng đều ~16.6%</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Thang đo mức độ (Rubric)</div>
          <div className="text-2xl font-extrabold text-slate-900">5 Mức</div>
          <div className="text-[11px] text-blue-600 font-semibold">Từ Khởi đầu đến Dẫn đầu</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Rẽ nhánh có điều kiện</div>
          <div className="text-2xl font-extrabold text-slate-900">2 Quy tắc</div>
          <div className="text-[11px] text-amber-600 font-semibold">Trigger khi điểm &gt;= Cấp 3</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedPillar('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedPillar === 'ALL' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả Trụ cột ({allQuestions.length})
          </button>
          {DBI_PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPillar(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedPillar === p.id ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.shortName}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo nội dung câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filtered.map((q, idx) => {
          const isExpanded = expandedQuestionId === q.id;
          const pInfo = DBI_PILLARS.find(p => p.id === q.pillarId);

          return (
            <div 
              key={q.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
                isExpanded ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div 
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-purple-200">
                    {q.id}
                  </span>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {pInfo?.name || q.pillarId}
                      </span>
                      {q.isConditional && (
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          Rẽ nhánh khi {q.conditionalTrigger?.dependsOnQuestionId} đạt ≥ {q.conditionalTrigger?.minScoreRequired} điểm
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">Trọng số: {q.weight}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 text-xs font-bold text-purple-600 hover:underline">
                  {isExpanded ? 'Thu gọn' : 'Xem 5 Mức Rubric'}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                  {q.context && (
                    <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      💡 Hướng dẫn cán bộ khảo sát: {q.context}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Thang chuẩn hóa 5 Mức điểm (1 - 5 điểm):
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div 
                          key={optIdx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs"
                        >
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                            {optIdx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800">{opt.text}</div>
                            {opt.description && (
                              <div className="text-[11px] text-slate-500">{opt.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
