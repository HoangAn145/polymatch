import React, { useState } from 'react';
import {
  Lightbulb,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Tag
} from 'lucide-react';
import { dbService } from '../../services/mockDatabase';
import { Solution } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const AdminSolutionsPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>(() => dbService.getSolutions());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'da_xac_thuc' | 'tham_khao'>('all');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const toast = useToast();

  const handleToggleVerified = (sol: Solution) => {
    const nextStatus = sol.trang_thai_nguon === 'da_xac_thuc' ? 'tham_khao' : 'da_xac_thuc';
    dbService.updateSolution(sol.id, { trang_thai_nguon: nextStatus });
    setSolutions(dbService.getSolutions());
    if (selectedSolution?.id === sol.id) {
      setSelectedSolution({ ...sol, trang_thai_nguon: nextStatus });
    }
    dbService.addAuditLog({
      adminId: 'usr-admin-01',
      adminName: 'Quản trị viên POLYMATCH',
      hanh_dong: nextStatus === 'da_xac_thuc' ? 'XAC_THUC_GIAI_PHAP' : 'BO_XAC_THUC_GIAI_PHAP',
      doi_tuong: 'solution',
      doi_tuong_id: sol.id,
      mo_ta: `Chuyển trạng thái giải pháp ${sol.ten} (${sol.ma}) sang ${nextStatus}`
    });
    toast.success(
      nextStatus === 'da_xac_thuc' ? "Đã xác thực giải pháp" : "Đã hủy xác thực",
      `Giải pháp ${sol.ten} hiện ở chế độ ${nextStatus === 'da_xac_thuc' ? 'Đã xác thực chính thức' : 'Tham khảo'}.`
    );
  };

  const filtered = solutions.filter(s => {
    const matchSearch =
      s.ten.toLowerCase().includes(search.toLowerCase()) ||
      s.ma.toLowerCase().includes(search.toLowerCase()) ||
      s.nha_cung_cap_ten.toLowerCase().includes(search.toLowerCase()) ||
      s.nhom_giai_phap.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.trang_thai_nguon === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-[#1769AA]" />
            Duyệt & Quản lý giải pháp công nghệ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thẩm định tiêu chí kỹ thuật, mức độ sẵn sàng và phân nhóm chuỗi cung ứng trước khi niêm yết
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên phần mềm, nhà cung cấp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1769AA]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white"
          >
            <option value="all">Tất cả ({solutions.length})</option>
            <option value="da_xac_thuc">Đã xác thực ({solutions.filter(s => s.trang_thai_nguon === 'da_xac_thuc').length})</option>
            <option value="tham_khao">Tham khảo ({solutions.filter(s => s.trang_thai_nguon === 'tham_khao').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Mã & Tên giải pháp</th>
                <th className="py-3.5 px-4">Nhà cung cấp</th>
                <th className="py-3.5 px-4">Nhóm giải pháp</th>
                <th className="py-3.5 px-4">Quy mô phù hợp</th>
                <th className="py-3.5 px-4">Nguồn xác thực</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Không tìm thấy giải pháp nào phù hợp bộ lọc
                  </td>
                </tr>
              ) : (
                filtered.map(sol => (
                  <tr key={sol.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {sol.ma}
                        </span>
                        <span className="font-bold text-slate-900">{sol.ten}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">
                        {sol.mo_ta}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{sol.nha_cung_cap_ten}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        ★ {sol.danh_gia_sao} • {sol.so_luot_danh_gia} đánh giá
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary">{sol.nhom_giai_phap}</Badge>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {sol.hoat_dong_logistics.join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">
                        {sol.quy_mo_phu_hop.map(q => q.toUpperCase()).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {sol.trang_thai_nguon === 'da_xac_thuc' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                          <Tag className="w-3 h-3" /> Tham khảo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSolution(sol)}
                        className="text-[#1769AA]"
                      >
                        <Eye className="w-3 h-3 mr-1" /> Chi tiết
                      </Button>
                      <Button
                        variant={sol.trang_thai_nguon === 'da_xac_thuc' ? 'outline' : 'success'}
                        size="sm"
                        onClick={() => handleToggleVerified(sol)}
                      >
                        {sol.trang_thai_nguon === 'da_xac_thuc' ? 'Chuyển tham khảo' : 'Xác thực'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSolution && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSolution(null)}
          title={`Chi tiết giải pháp: ${selectedSolution.ten}`}
          subtitle={`Mã: ${selectedSolution.ma} • Nhà cung cấp: ${selectedSolution.nha_cung_cap_ten}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-bold text-[#1769AA] block mb-1">Mô tả giải pháp:</span>
              <p>{selectedSolution.mo_ta}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="text-slate-400 block text-[11px]">Nhóm giải pháp:</span>
                <span className="font-bold text-slate-900">{selectedSolution.nhom_giai_phap}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Nguồn xác thực:</span>
                <span className="font-bold uppercase text-slate-900">{selectedSolution.trang_thai_nguon}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Khoảng chi phí:</span>
                <span className="font-bold text-[#1769AA]">{selectedSolution.khoang_gia_text}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Thời gian triển khai:</span>
                <span className="font-semibold text-slate-900">{selectedSolution.thoi_gian_trien_khai}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Mức độ trưởng thành phù hợp:</span>
                <span className="font-semibold text-slate-900">Mức {selectedSolution.muc_ldmi_phu_hop}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Mô hình chi phí:</span>
                <span className="font-semibold text-slate-900">{selectedSolution.mo_hinh_chi_phi}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Tính năng cốt lõi:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSolution.tinh_nang_chinh.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[11px]">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant={selectedSolution.trang_thai_nguon === 'da_xac_thuc' ? 'outline' : 'success'}
                size="sm"
                onClick={() => handleToggleVerified(selectedSolution)}
              >
                {selectedSolution.trang_thai_nguon === 'da_xac_thuc' ? 'Chuyển sang dạng tham khảo' : 'Xác thực giải pháp'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedSolution(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
