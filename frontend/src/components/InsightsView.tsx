import React, { useState } from 'react';
import { LOGISTICS_ARTICLES } from '../data/glossary';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Tag, 
  Calendar, 
  ArrowLeft,
  Share2
} from 'lucide-react';

interface InsightsViewProps {
  onStartQuickScan: () => void;
  onExploreSolutions: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  onStartQuickScan,
  onExploreSolutions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<any | null>(null);

  const CATEGORIES = [
    'Tất cả',
    'TMS-WMS-ERP',
    'AI trong logistics',
    'Logistics xanh',
    'Quy định & Chính sách',
    'Case Study thực tế',
    'Hướng dẫn chọn công nghệ'
  ];

  const filteredArticles = selectedCategory === 'Tất cả' || selectedCategory === 'all'
    ? LOGISTICS_ARTICLES
    : LOGISTICS_ARTICLES.filter((a) => a.chuyen_muc === selectedCategory);

  if (readingArticle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => setReadingArticle(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách bài viết
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-blue-700 font-bold uppercase tracking-wider">
            <span>{readingArticle.chuyen_muc}</span>
            <span>·</span>
            <span>{readingArticle.thoi_gian_doc}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {readingArticle.tieu_de}
          </h1>

          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>Tác giả: <strong>{readingArticle.tac_gia}</strong></span>
            <span>·</span>
            <span>Ngày đăng: {readingArticle.ngay_dang}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-100 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed border-l-4 border-blue-700">
          {readingArticle.tom_tat}
        </div>

        <div className="text-sm text-slate-800 leading-relaxed space-y-4 whitespace-pre-line font-sans">
          {readingArticle.noi_dung}
        </div>

        {/* Call to Action Block (M01.06) */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md space-y-3 my-8">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            HÀNH ĐỘNG DÀNH CHO BẠN
          </div>
          <h3 className="text-base font-bold text-white">
            {readingArticle.cta_text}
          </h3>
          <p className="text-xs text-blue-200">
            POLYMATCH cung cấp công cụ chẩn đoán độc lập và ghép nối giải pháp công nghệ chính xác theo khoảng trống của từng doanh nghiệp.
          </p>
          <div className="pt-2">
            {readingArticle.cta_action === 'quick_scan' ? (
              <button
                onClick={onStartQuickScan}
                className="px-5 py-2.5 bg-white text-blue-900 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                Làm Quick Scan ngay (2 phút)
              </button>
            ) : (
              <button
                onClick={onExploreSolutions}
                className="px-5 py-2.5 bg-white text-blue-900 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors inline-flex items-center gap-1.5"
              >
                Khám phá Danh mục giải pháp
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            M01.05 · LOGISTICS INSIGHTS
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Góc nhìn Chuyển đổi số &amp; Công nghệ Logistics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bài viết phân tích thực chiến, cập nhật quy định và hướng dẫn chọn công nghệ phù hợp
          </p>
        </div>

        <button
          onClick={onStartQuickScan}
          className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          Quick Scan Miễn phí
        </button>
      </div>

      {/* Category Filter Pills (Interactive Buttons M01.07) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = (cat === 'Tất cả' && selectedCategory === 'all') || selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Tất cả' ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-blue-700">{art.chuyen_muc}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.thoi_gian_doc}
                </span>
              </div>

              <h3 
                onClick={() => setReadingArticle(art)}
                className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer leading-snug"
              >
                {art.tieu_de}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {art.tom_tat}
              </p>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-slate-400 font-mono">
                {art.ngay_dang}
              </span>
              <button
                onClick={() => setReadingArticle(art)}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                Đọc bài viết <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
