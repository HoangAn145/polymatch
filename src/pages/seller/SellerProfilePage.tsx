import React, { useState } from 'react';
import { Building2, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { SellerProfile } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const SellerProfilePage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const initialSeller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];

  const [form, setForm] = useState<SellerProfile>({ ...initialSeller });
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      dbService.updateSeller(form.id, form);
      toast.success("Đã lưu hồ sơ nhà cung cấp", "Thông tin công ty đã được cập nhật.");
    } catch {
      toast.error("Lỗi khi lưu", "Không thể cập nhật hồ sơ lúc này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Hồ sơ đối tác công nghệ</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hồ sơ Doanh nghiệp Nhà cung cấp (Seller)
          </h1>
          <p className="text-slate-500">
            Thông tin hiển thị công khai trên danh bạ đối tác của cổng thông tin POLYMATCH.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          loading={loading}
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tên Nhà cung cấp *</label>
            <input
              type="text"
              required
              value={form.ten}
              onChange={e => setForm({ ...form, ten: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mã số thuế *</label>
            <input
              type="text"
              required
              value={form.ma_so_thue}
              onChange={e => setForm({ ...form, ma_so_thue: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Người đại diện liên hệ *</label>
            <input
              type="text"
              required
              value={form.nguoi_lien_he}
              onChange={e => setForm({ ...form, nguoi_lien_he: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
            <input
              type="tel"
              required
              value={form.so_dien_thoai}
              onChange={e => setForm({ ...form, so_dien_thoai: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email liên hệ *</label>
            <input
              type="email"
              required
              value={form.email_lien_he}
              onChange={e => setForm({ ...form, email_lien_he: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
            <input
              type="text"
              value={form.dia_chi}
              onChange={e => setForm({ ...form, dia_chi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Website chính thức</label>
            <input
              type="url"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" type="submit" loading={loading} leftIcon={<Save className="w-4 h-4" />}>
            Lưu hồ sơ nhà cung cấp
          </Button>
        </div>
      </form>
    </div>
  );
};
