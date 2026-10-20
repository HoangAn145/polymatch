import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { DBI_QUESTIONS, LDMI_QUESTIONS, QUICK_SCAN_QUESTIONS } from '../../data/assessmentQuestions';
import { Badge } from '../../components/ui/Badge';
import { Question } from '../../types';

export const AdminQuestionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dbi' | 'ldmi' | 'quick'>('dbi');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const currentList: Question[] =
    activeTab === 'dbi' ? DBI_QUESTIONS : activeTab === 'ldmi' ? LDMI_QUESTIONS : QUICK_SCAN_QUESTIONS;

  const filtered = currentList.filter(q =>
    q.ma.toLowerCase().includes(search.toLowerCase()) ||
    q.tieu_de.toLowerCase().includes(search.toLowerCase()) ||
    (q.giai_thich_thuat_ngu ? q.giai_thich_thuat_ngu.toLowerCase().includes(search.toLowerCase()) : false)
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#1769AA]" />
          Ngân hàng câu hỏi & Tiêu chí đánh giá
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quy chuẩn theo Bộ câu hỏi & nguyên tắc chấm điểm v4 (Đồng bộ tài liệu VNYTL)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('dbi')}
          className={`pb-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer ${
            activeTab === 'dbi'
              ? 'border-[#1769AA] text-[#1769AA]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Trụ cột nền tảng DBI ({DBI_QUESTIONS.length} câu • 7 trụ cột)
        </button>
        <button
          onClick={() => setActiveTab('ldmi')}
          className={`pb-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ldmi'
              ? 'border-[#1769AA] text-[#1769AA]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cụm năng lực LDMI ({LDMI_QUESTIONS.length} câu • 8 cụm chuỗi cung ứng)
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`pb-3 font-semibold text-xs border-b-2 transition-colors cursor-pointer ${
            activeTab === 'quick'
              ? 'border-[#1769AA] text-[#1769AA]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Khảo sát nhanh Quick Scan ({QUICK_SCAN_QUESTIONS.length} câu)
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm câu hỏi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1769AA] bg-white"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.map(q => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
            >
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-[#1769AA] rounded border border-blue-200">
                    {q.ma}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{q.tieu_de}</h3>
                    {q.giai_thich_thuat_ngu && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">{q.giai_thich_thuat_ngu}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {q.tru_cot_dbi && (
                    <Badge variant="primary" size="sm">
                      {q.tru_cot_dbi}
                    </Badge>
                  )}
                  {q.nhom_nang_luc && (
                    <Badge variant="secondary" size="sm">
                      Cụm {q.nhom_nang_luc}
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-3 text-xs">
                  {q.giai_thich_thuat_ngu && (
                    <div className="text-slate-600 italic bg-blue-50/60 p-2.5 rounded border border-blue-100">
                      💡 {q.giai_thich_thuat_ngu}
                    </div>
                  )}

                  <div className="space-y-1.5 mt-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Thang điểm & Mô tả các mức (1 - 5 điểm):
                    </span>
                    {q.phuong_an.map(opt => (
                      <div
                        key={opt.muc}
                        className="flex items-start gap-2 p-2 rounded bg-white border border-slate-200/70"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1769AA] font-bold text-xs flex items-center justify-center shrink-0">
                          {opt.muc}
                        </span>
                        <div className="text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-800">{opt.noi_dung}</span>
                          {opt.mo_ta_chi_tiet && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{opt.mo_ta_chi_tiet}</p>
                          )}
                        </div>
                      </div>
                    ))}
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
