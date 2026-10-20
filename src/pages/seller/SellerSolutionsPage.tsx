import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  PlusCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { Solution } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const SellerSolutionsPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const [solutions, setSolutions] = useState(() => {
    return dbService.getSolutions().filter(s => s.nha_cung_cap_id === seller?.id);
  });

  const isApproved = currentUser?.vendorApproved || seller?.trang_thai === 'da_duyet';

  const handleToggleHide = (solId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'da_xac_thuc' ? 'tham_khao' : 'da_xac_thuc';
    dbService.updateSolution(solId, { trang_thai_nguon: newStatus as any });
    setSolutions(prev => prev.map(s => s.id === solId ? { ...s, trang_thai_nguon: newStatus as any } : s));
    toast.info("Đã cập nhật trạng thái hiển thị", `Giải pháp đã được chuyển sang chế độ ${newStatus === 'da_xac_thuc' ? 'Hiển thị công khai' : 'Tạm ẩn'}.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Badge variant="primary">Quản trị giải pháp công nghệ</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Danh sách giải pháp của {seller.ten}
          </h1>
          <p className="text-xs text-slate-500">
            Quản lý các phân hệ phần mềm, mức giá, thời gian triển khai và phạm vi phục vụ khách hàng.
          </p>
        </div>

        <Link to="/seller/solutions/new">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            disabled={!isApproved}
          >
            Thêm giải pháp mới
          </Button>
        </Link>
      </div>

      {/* Solutions Table */}
      {solutions.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4">Tên giải pháp / Mã</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4">Khoảng giá</th>
                <th className="p-4">Mức LDMI</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {solutions.map(sol => (
                <tr key={sol.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{sol.ten}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{sol.ma}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" size="sm">{sol.nhom_giai_phap}</Badge>
                    <div className="text-[11px] text-slate-400 mt-1 capitalize">{sol.hoat_dong_logistics.join(', ')}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#1769AA]">{sol.khoang_gia_text}</span>
                    <span className="text-[11px] text-slate-400 block capitalize">{sol.mo_hinh_chi_phi.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    Mức {sol.muc_ldmi_phu_hop}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        sol.trang_thai_nguon === 'da_xac_thuc'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sol.trang_thai_nguon === 'da_xac_thuc' ? '✓ Đang hiển thị' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleHide(sol.id, sol.trang_thai_nguon)}
                        title={sol.trang_thai_nguon === 'da_xac_thuc' ? "Ẩn giải pháp" : "Hiển thị công khai"}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        {sol.trang_thai_nguon === 'da_xac_thuc' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <p className="text-xs text-slate-500">Bạn chưa đăng tải giải pháp nào.</p>
          <Link to="/seller/solutions/new">
            <Button variant="primary" size="sm" disabled={!isApproved}>
              + Tạo hồ sơ giải pháp đầu tiên
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
