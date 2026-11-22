import {demoMode, requireSupabase} from '../../lib/supabase';
import React, { useState } from 'react';
import { Building2, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../../components/ui/Toast';
import { EnterpriseProfile } from '../../types';

export const BuyerProfilePage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const initialEnt = dbService.getEnterprises().find(e => e.userId === currentUser?.id) || dbService.getEnterprises()[0];

  const [form, setForm] = useState<EnterpriseProfile>({ ...initialEnt });
  const [loading, setLoading] = useState(false);

  const softwareOptions = [
    { id: 'ke_toan', name: 'Phần mềm kế toán (MISA, FAST, Bravo...)' },
    { id: 'tms', name: 'Hệ thống quản lý vận tải (TMS)' },
    { id: 'wms', name: 'Hệ thống quản lý kho (WMS)' },
    { id: 'oms', name: 'Phần mềm quản lý đơn hàng (OMS)' },
    { id: 'erp', name: 'Hệ thống hoạch định nguồn lực (ERP)' },
    { id: 'giao_nhan', name: 'Phần mềm giao nhận (FMS)' },
    { id: 'dinh_vi', name: 'Thiết bị giám sát hành trình GPS' },
    { id: 'khong', name: 'Chưa sử dụng phần mềm nào' }
  ];

  const toggleSoftware = (id: string) => {
    setForm(prev => {
      const list = prev.phan_mem_dang_dung || [];
      if (id === 'khong') return { ...prev, phan_mem_dang_dung: ['khong'] };
      const filtered = list.filter(x => x !== 'khong');
      const updated = filtered.includes(id) ? filtered.filter(x => x !== id) : [...filtered, id];
      return { ...prev, phan_mem_dang_dung: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(!demoMode){const {error}=await requireSupabase().from('enterprises').upsert({user_id:form.userId,data:{legacyProfile:form},updated_at:new Date().toISOString()});if(error)throw error;}
      dbService.updateEnterprise(form.userId, form);
      toast.success("Đã cập nhật hồ sơ doanh nghiệp", "Thông tin hồ sơ và năng lực đã được lưu thành công.");
    } catch {
      toast.error("Lỗi khi lưu", "Không thể cập nhật hồ sơ lúc này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Badge variant="primary">Hồ sơ năng lực Doanh nghiệp</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Khai báo thông tin & Năng lực chuỗi cung ứng
          </h1>
          <p className="text-xs text-slate-500">
            Dữ liệu này được dùng trực tiếp cho bộ máy ghép nối giải pháp công nghệ và mô phỏng hiệu quả đầu tư.
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Legal & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1769AA]" />
            <span>1. Thông tin pháp lý & Người đại diện</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên Doanh nghiệp *</label>
              <input
                type="text"
                required
                value={form.ten}
                onChange={e => setForm({ ...form, ten: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã số thuế doanh nghiệp *</label>
              <input
                type="text"
                required
                value={form.ma_so_thue}
                onChange={e => setForm({ ...form, ma_so_thue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Người đại diện / phụ trách *</label>
              <input
                type="text"
                required
                value={form.nguoi_lien_he}
                onChange={e => setForm({ ...form, nguoi_lien_he: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={form.so_dien_thoai}
                onChange={e => setForm({ ...form, so_dien_thoai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email liên hệ *</label>
              <input
                type="email"
                required
                value={form.email_lien_he}
                onChange={e => setForm({ ...form, email_lien_he: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tỉnh / Thành phố *</label>
              <input
                type="text"
                value={form.tinh_thanh}
                onChange={e => setForm({ ...form, tinh_thanh: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scale & Branch */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            2. Ngành hoạt động & Quy mô logistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hoạt động logistics chính *</label>
              <select
                value={form.nhanh}
                onChange={e => setForm({ ...form, nhanh: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="VT">Vận tải đường bộ (VT)</option>
                <option value="KB">Kho bãi & Phân phối (KB)</option>
                <option value="FF">Giao nhận quốc tế (FF)</option>
                <option value="3PL">Logistics tích hợp (3PL)</option>
                <option value="LM">Giao hàng chặng cuối (LM)</option>
                <option value="KH">Khác</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số lao động tham gia BHXH</label>
              <input
                type="number"
                value={form.so_lao_dong_bhxh}
                onChange={e => setForm({ ...form, so_lao_dong_bhxh: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phân loại quy mô (NĐ 80/2021)</label>
              <select
                value={form.quy_mo}
                onChange={e => setForm({ ...form, quy_mo: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white capitalize"
              >
                <option value="sieu_nho">Siêu nhỏ</option>
                <option value="nho">Nhỏ</option>
                <option value="vua">Vừa</option>
                <option value="lon">Lớn</option>
              </select>
            </div>
          </div>

          {/* Specific operational fleet / warehouse size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số lượng phương tiện vận tải (xe)</label>
              <input
                type="number"
                value={form.quy_mo_dac_thu?.so_xe || ''}
                onChange={e => setForm({
                  ...form,
                  quy_mo_dac_thu: { ...form.quy_mo_dac_thu, so_xe: parseInt(e.target.value) || 0 }
                })}
                placeholder="Ví dụ: 45 xe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diện tích kho bãi quản lý (m²)</label>
              <input
                type="number"
                value={form.quy_mo_dac_thu?.dien_tich_kho || ''}
                onChange={e => setForm({
                  ...form,
                  quy_mo_dac_thu: { ...form.quy_mo_dac_thu, dien_tich_kho: parseInt(e.target.value) || 0 }
                })}
                placeholder="Ví dụ: 5000 m²"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
          </div>
        </div>

        {/* Section 3: IT Systems & Budget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            3. Hệ thống phần mềm đang dùng & Dự toán ngân sách
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Các phần mềm doanh nghiệp đang vận hành thực tế:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {softwareOptions.map(opt => {
                const checked = form.phan_mem_dang_dung?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleSoftware(opt.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                      checked
                        ? 'border-[#1769AA] bg-blue-50/70 text-[#1769AA] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${checked ? 'bg-[#1769AA] text-white' : 'border border-slate-300'}`}>
                      {checked && '✓'}
                    </span>
                    <span className="text-xs">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngân sách công nghệ dự kiến 12 tháng</label>
              <select
                value={form.ngan_sach_12_thang || '20_100'}
                onChange={e => setForm({ ...form, ngan_sach_12_thang: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="duoi_20">Dưới 20 triệu đồng</option>
                <option value="20_100">Từ 20 - 100 triệu đồng</option>
                <option value="100_300">Từ 100 - 300 triệu đồng</option>
                <option value="tren_300">Trên 300 triệu đồng</option>
                <option value="chua_xac_dinh">Chưa xác định cụ thể</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời điểm dự kiến triển khai</label>
              <select
                value={form.thoi_diem_trien_khai || 'Trong 3 tháng tới'}
                onChange={e => setForm({ ...form, thoi_diem_trien_khai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="Trong 1 tháng tới">Cần triển khai gấp (Trong 1 tháng tới)</option>
                <option value="Trong 3 tháng tới">Trong 3 tháng tới (Quý này)</option>
                <option value="Trong 6 tháng tới">Trong 6 tháng tới</option>
                <option value="Năm sau">Kế hoạch năm sau</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={loading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Lưu thay đổi hồ sơ doanh nghiệp
          </Button>
        </div>
      </form>
    </div>
  );
};
