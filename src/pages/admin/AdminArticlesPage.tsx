import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Clock,
  Eye
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { InsightArticle } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<InsightArticle[]>(() => dbService.getArticles());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InsightArticle['chuyen_muc']>('Hướng dẫn chọn công nghệ');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Ban Biên tập POLYMATCH');
  const toast = useToast();

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      toast.warning("Thiếu thông tin", "Vui lòng nhập tiêu đề và tóm tắt bài viết.");
      return;
    }
    const newArt: InsightArticle = {
      id: `art-${Date.now()}`,
      slug: `bai-viet-${Date.now()}`,
      tieu_de: title,
      chuyen_muc: category,
      tom_tat: summary,
      noi_dung: summary + "\n\nNội dung chi tiết đang được cập nhật bởi Ban Biên tập POLYMATCH.",
      tac_gia: author,
      ngay_dang: new Date().toISOString().split('T')[0],
      hinh_anh: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      thoi_gian_doc: '5 phút',
      tags: ['Chuyển đổi số', 'Logistics', category]
    };
    dbService.addArticle(newArt);
    setArticles(dbService.getArticles());
    setIsModalOpen(false);
    setTitle('');
    setSummary('');
    toast.success("Đã xuất bản bài viết", `Bài viết "${newArt.tieu_de}" đã được đưa lên chuyên mục Cẩm nang & Góc nhìn.`);
  };

  const filtered = articles.filter(a =>
    a.tieu_de.toLowerCase().includes(search.toLowerCase()) ||
    a.tom_tat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1769AA]" />
            Quản lý bài viết & Cẩm nang chuyển đổi số
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Biên tập tin tức, case study thành công và cẩm nang hướng dẫn cho doanh nghiệp logistics
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Viết bài mới
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, nội dung bài viết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1769AA]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(art => (
          <div key={art.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {art.chuyen_muc}
                </Badge>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.ngay_dang}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                {art.tieu_de}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3">
                {art.tom_tat}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{art.tac_gia}</span>
              <span className="flex items-center gap-1 text-[11px]">
                {art.thoi_gian_doc} đọc
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title="Tạo bài viết mới"
          subtitle="Đăng tải lên cổng thông tin POLYMATCH"
        >
          <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="VD: Kinh nghiệm tối ưu chi phí vận tải đường bộ bằng TMS..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chuyên mục:</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Hướng dẫn chọn công nghệ">Hướng dẫn chọn công nghệ</option>
                <option value="Case Study">Điển hình thành công (Case Study)</option>
                <option value="TMS-WMS-ERP">TMS - WMS - ERP</option>
                <option value="AI trong Logistics">AI trong Logistics</option>
                <option value="Logistics Xanh">Logistics Xanh</option>
                <option value="Chính sách & Quy định">Chính sách & Quy định</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tác giả / Nguồn:</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tóm tắt nội dung:</label>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                rows={4}
                placeholder="Tóm tắt ngắn gọn các ý chính của bài viết..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Xuất bản ngay
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
