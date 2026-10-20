import React, { useState } from 'react';
import {
  UserCheck,
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Clock,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { dbService } from '../../services/mockDatabase';
import { SellerProfile } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const AdminSellersPage: React.FC = () => {
  const toast = useToast();
  const [sellers, setSellers] = useState<SellerProfile[]>(() => dbService.getSellers());
  const [rejectModalSeller, setRejectModalSeller] = useState<SellerProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('Mã số thuế không khớp với tên doanh nghiệp đăng ký kinh doanh.');
  const [searchTerm, setSearchTerm] = useState('');

  const reloadSellers = () => {
    setSellers([...dbService.getSellers()]);
  };

  const handleApprove = (seller: SellerProfile) => {
    dbService.updateSeller(seller.id, { trang_thai: 'da_duyet' });

    // Also update associated user if exists
    const users = dbService.getUsers();
    const user = users.find(u => u.id === seller.userId);
    if (user) {
      dbService.updateUser(user.id, { vendorApproved: true, status: 'active' });
    }

    dbService.addAuditLog({
      adminId: "admin-system",
      adminName: "Admin Quản trị viên",
      hanh_dong: "DUYET_NHA_CUNG_CAP",
      doi_tuong: "nha_cung_cap",
      doi_tuong_id: seller.id,
      mo_ta: `Phê duyệt nhà cung cấp ${seller.ten} (MST: ${seller.ma_so_thue}) sau khi đối soát hợp lệ.`
    });

    reloadSellers();
    toast.success("Đã phê duyệt Nhà cung cấp!", `Nhà cung cấp ${seller.ten} đã được cấp quyền đăng tải giải pháp.`);
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalSeller) return;

    dbService.updateSeller(rejectModalSeller.id, {
      trang_thai: 'tu_choi',
      ly_do_tu_choi: rejectReason
    });

    dbService.addAuditLog({
      adminId: "admin-system",
      adminName: "Admin Quản trị viên",
      hanh_dong: "TU_CHOI_NHA_CUNG_CAP",
      doi_tuong: "nha_cung_cap",
      doi_tuong_id: rejectModalSeller.id,
      mo_ta: `Từ chối duyệt nhà cung cấp ${rejectModalSeller.ten}. Lý do: ${rejectReason}`
    });

    setRejectModalSeller(null);
    reloadSellers();
    toast.info("Đã từ chối hồ sơ", `Lý do đã được ghi nhận: ${rejectReason}`);
  };

  const filtered = sellers.filter(s =>
    s.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ma_so_thue.includes(searchTerm) ||
    s.nguoi_lien_he.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <Badge variant="primary">Thẩm định đối tác công nghệ</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Hàng đợi Thẩm định & Xác minh Nhà cung cấp (Seller)
        </h1>
        <p className="text-xs text-slate-500">
          Đối chiếu mã số thuế qua cổng thông tin quốc gia, phê duyệt hoặc từ chối kèm lý do chính thức.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên nhà cung cấp, mã số thuế..."
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
        />
      </div>

      {/* Sellers List */}
      <div className="space-y-4">
        {filtered.map(s => {
          const isPending = s.trang_thai === 'cho_duyet';
          return (
            <div
              key={s.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                isPending
                  ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                  : s.trang_thai === 'da_duyet'
                  ? 'bg-white border-slate-200'
                  : 'bg-rose-50/30 border-rose-200'
              }`}
            >
              <div className="space-y-2.5 flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge
                    variant={s.trang_thai === 'da_duyet' ? 'success' : s.trang_thai === 'tu_choi' ? 'danger' : 'warning'}
                    size="sm"
                    dot
                  >
                    {s.trang_thai === 'da_duyet' ? 'Đã duyệt' : s.trang_thai === 'tu_choi' ? 'Đã từ chối' : 'Chờ Admin duyệt (SLA 24h)'}
                  </Badge>
                  <span className="font-mono text-slate-400">#{s.id}</span>
                  <span className="font-bold text-[#1769AA] font-mono">MST: {s.ma_so_thue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <h3 className="font-extrabold text-base text-slate-900">{s.ten}</h3>
                </div>

                {s.mst_tra_cuu && (
                  <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-[11px] space-y-0.5 text-slate-600">
                    <div>Tên ĐKKD: <strong className="text-slate-800">{s.mst_tra_cuu.ten_dang_ky}</strong></div>
                    <div>Tình trạng: <span className="text-emerald-700 font-medium">{s.mst_tra_cuu.tinh_trang}</span> ({s.mst_tra_cuu.nguon})</div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
                  <span>Người liên hệ: <strong>{s.nguoi_lien_he} ({s.so_dien_thoai})</strong></span>
                  <span>Email: <strong>{s.email_lien_he}</strong></span>
                  <span>Công nghệ: <strong className="text-slate-700">{s.nhom_cong_nghe.join(', ')}</strong></span>
                </div>

                {s.ly_do_tu_choi && (
                  <div className="p-2 bg-rose-100/70 border border-rose-200 rounded text-rose-800 text-[11px]">
                    <strong>Lý do từ chối:</strong> {s.ly_do_tu_choi}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isPending && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800"
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => handleApprove(s)}
                    >
                      Duyệt ngay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      onClick={() => setRejectModalSeller(s)}
                    >
                      Từ chối
                    </Button>
                  </>
                )}

                {s.trang_thai === 'da_duyet' && (
                  <Badge variant="success" size="md">✓ Đã hoạt động chính thức</Badge>
                )}

                {s.trang_thai === 'tu_choi' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(s)}
                  >
                    Xem xét & Duyệt lại
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {rejectModalSeller && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModalSeller(null)}
          title={`Từ chối hồ sơ Nhà cung cấp: ${rejectModalSeller.ten}`}
          subtitle="Vui lòng cung cấp lý do từ chối để nhà cung cấp bổ sung hồ sơ."
          maxWidth="md"
        >
          <form onSubmit={handleRejectConfirm} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lý do từ chối *</label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setRejectModalSeller(null)}>
                Hủy bỏ
              </Button>
              <Button variant="danger" size="sm" type="submit">
                Xác nhận từ chối
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
