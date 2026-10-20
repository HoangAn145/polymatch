import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Star,
  Award,
  Calendar,
  Save,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { dbService } from '../../services/mockDatabase';
import { Expert } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const AdminExpertsPage: React.FC = () => {
  const toast = useToast();
  const [experts, setExperts] = useState<Expert[]>(() => dbService.getExperts());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [hoTen, setHoTen] = useState('');
  const [chucDanh, setChucDanh] = useState('');
  const [congTy, setCongTy] = useState('');
  const [soNamKn, setSoNamKn] = useState<number>(10);
  const [linhVucText, setLinhVucText] = useState('Vận tải, Kho bãi, Tối ưu chi phí');
  const [gioiThieu, setGioiThieu] = useState('');

  const handleAddExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen || !chucDanh) {
      toast.warning("Thiếu thông tin", "Vui lòng nhập họ tên và chức danh chuyên gia.");
      return;
    }

    const newExp: Expert = {
      id: `exp-${Date.now()}`,
      ho_ten: hoTen,
      chuc_danh: chucDanh,
      linh_vuc: linhVucText.split(',').map(s => s.trim()).filter(Boolean),
      so_nam_kinh_nghiem: soNamKn,
      cong_ty_to_chuc: congTy || "Chuyên gia Tư vấn Độc lập",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      gioi_thieu: gioiThieu || "Hơn 10 năm kinh nghiệm tư vấn giải pháp chuyển đổi số chuỗi cung ứng logistics.",
      cac_goi_phu_trach: ["Basic", "Pro"],
      so_phien_da_tu_van: 0,
      danh_gia_sao: 5.0,
      trang_thai: "san_sang"
    };

    dbService.addExpert(newExp);
    dbService.addAuditLog({
      adminId: "admin",
      adminName: "Admin Quản trị viên",
      hanh_dong: "THEM_CHUYEN_GIA",
      doi_tuong: "chuyen_gia",
      doi_tuong_id: newExp.id,
      mo_ta: `Thêm mới chuyên gia tư vấn đối tác: ${newExp.ho_ten} (${newExp.chuc_danh}).`
    });

    setExperts([...dbService.getExperts()]);
    setIsAddModalOpen(false);
    toast.success("Đã thêm chuyên gia mới!", `Chuyên gia ${newExp.ho_ten} đã sẵn sàng nhận phiên tư vấn.`);
  };

  const filtered = experts.filter(e =>
    e.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.linh_vuc.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Tích hợp Quản trị Chuyên gia VNYTL</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quản lý Đội ngũ Chuyên gia Cố vấn Đối tác
          </h1>
          <p className="text-xs text-slate-500">
            Theo quy chuẩn VNYTL, chuyên gia là đối tác cung ứng dịch vụ tư vấn được Admin trực tiếp quản lý và phân công lịch họp.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm chuyên gia đối tác
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên chuyên gia, chuyên môn..."
          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
        />
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(exp => (
          <div
            key={exp.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={exp.avatarUrl}
                    alt={exp.ho_ten}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{exp.ho_ten}</h3>
                    <p className="text-xs font-semibold text-[#1769AA]">{exp.chuc_danh}</p>
                    <p className="text-[11px] text-slate-500">{exp.cong_ty_to_chuc}</p>
                  </div>
                </div>

                <Badge variant={exp.trang_thai === 'san_sang' ? 'success' : 'neutral'} size="sm">
                  {exp.trang_thai === 'san_sang' ? 'Sẵn sàng' : 'Tạm bận'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {exp.gioi_thieu}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.linh_vuc.map((l, i) => (
                  <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{exp.so_nam_kinh_nghiem} năm KN • Đã tư vấn {exp.so_phien_da_tu_van} phiên</span>
              <span className="font-bold text-amber-600">★ {exp.danh_gia_sao}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm mới Chuyên gia Cố vấn Đối tác"
        subtitle="Chuyên gia sẽ được hiển thị trên danh mục tư vấn cho Doanh nghiệp."
        maxWidth="md"
      >
        <form onSubmit={handleAddExpert} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ và tên chuyên gia *</label>
            <input
              type="text"
              required
              value={hoTen}
              onChange={e => setHoTen(e.target.value)}
              placeholder="TS. Nguyễn Văn B"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chức danh *</label>
              <input
                type="text"
                required
                value={chucDanh}
                onChange={e => setChucDanh(e.target.value)}
                placeholder="Cố vấn Chuỗi cung ứng"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số năm kinh nghiệm</label>
              <input
                type="number"
                value={soNamKn}
                onChange={e => setSoNamKn(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tổ chức / Đơn vị công tác</label>
            <input
              type="text"
              value={congTy}
              onChange={e => setCongTy(e.target.value)}
              placeholder="Viện Logistics, Hiệp hội VLA..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lĩnh vực chuyên môn (ngăn cách bởi dấu phẩy)</label>
            <input
              type="text"
              value={linhVucText}
              onChange={e => setLinhVucText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Giới thiệu ngắn tiểu sử & kinh nghiệm</label>
            <textarea
              rows={3}
              value={gioiThieu}
              onChange={e => setGioiThieu(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Lưu chuyên gia
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
