import React, { useState } from 'react';
import { Search, Tag, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ARTICLES_DATA } from '../../data/expertsData';
import { InsightArticle } from '../../types';

export const InsightsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<InsightArticle | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả chuyên mục' },
    { id: 'TMS-WMS-ERP', name: 'TMS - WMS - ERP' },
    { id: 'Logistics Xanh', name: 'Logistics Xanh & ESG' },
    { id: 'Case Study', name: 'Case Study thực tiễn' },
    { id: 'Hướng dẫn chọn công nghệ', name: 'Hướng dẫn chọn công nghệ' }
  ];

  const filtered = ARTICLES_DATA.filter(art => {
    const matchSearch =
      art.tieu_de.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tom_tat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'all' || art.chuyen_muc === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <Badge variant="primary">Logistics Insights</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kiến thức & Xu hướng Chuyển đổi số Chuỗi cung ứng
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Bài viết chuyên sâu, kinh nghiệm triển khai phần mềm quản lý vận tải, tối ưu kho bãi và các nghiên cứu điển hình từ các chuyên gia đầu ngành.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm bài viết theo từ khóa..."
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-[#1769AA] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={art.hinh_anh}
                  alt={art.tieu_de}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1769AA] text-[11px] uppercase tracking-wider">
                    {art.chuyen_muc}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.thoi_gian_doc}
                  </span>
                </div>

                <h3
                  className="font-bold text-sm text-slate-900 hover:text-[#1769AA] transition-colors leading-snug cursor-pointer line-clamp-2"
                  onClick={() => setReadingArticle(art)}
                >
                  {art.tieu_de}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {art.tom_tat}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{art.tac_gia}</span>
                <button
                  onClick={() => setReadingArticle(art)}
                  className="text-xs font-semibold text-[#1769AA] hover:text-[#104D80] flex items-center gap-1 cursor-pointer"
                >
                  Đọc tiếp &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {readingArticle && (
        <Modal
          isOpen={true}
          onClose={() => setReadingArticle(null)}
          title={readingArticle.tieu_de}
          subtitle={`Tác giả: ${readingArticle.tac_gia} • Ngày đăng: ${readingArticle.ngay_dang}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={readingArticle.hinh_anh}
                alt={readingArticle.tieu_de}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 bg-blue-50/70 border-l-4 border-[#1769AA] rounded-r-lg italic text-slate-800 text-xs">
              {readingArticle.tom_tat}
            </div>

            <div className="whitespace-pre-line space-y-3 pt-2 text-slate-700 leading-relaxed">
              {readingArticle.noi_dung}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
              {readingArticle.tags.map((t, i) => (
                <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
