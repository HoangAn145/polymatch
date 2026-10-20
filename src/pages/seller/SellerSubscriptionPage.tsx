import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Calendar, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../../components/ui/Toast';

export const SellerSubscriptionPage: React.FC = () => {
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];
  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedGoi = {
        ...seller.goi_tham_gia,
        trang_thai_phi: 'da_thanh_toan' as const,
        ngay_het_han: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]
      };
      dbService.updateSeller(seller.id, { goi_tham_gia: updatedGoi });
      setLoading(false);
      toast.success(
        "Kích hoạt gói thường niên thành công!",
        "Gói 6.000.000 VNĐ / năm đã được gia hạn thêm 12 tháng (Mô phỏng diễn tập)."
      );
      window.location.reload();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 space-y-1">
        <Badge variant="primary">Biểu phí Nhà cung cấp (VNYTL 4.1.3)</Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Gói tham gia Nền tảng Thường niên
        </h1>
        <p className="text-xs text-slate-500">
          Mức phí quy chuẩn áp dụng cho các nhà cung cấp giải pháp công nghệ chính thức trên POLYMATCH.
        </p>
      </div>

      {/* Package Details Card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500 p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Gói Tiêu chuẩn Nhà Cung Cấp
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              6.000.000 <span className="text-sm font-normal text-slate-500">VNĐ / năm</span>
            </h2>
          </div>

          <Badge variant={seller.goi_tham_gia.trang_thai_phi === 'da_thanh_toan' ? 'success' : 'warning'} size="md">
            {seller.goi_tham_gia.trang_thai_phi === 'da_thanh_toan' ? '✓ Đang hoạt động' : 'Chưa thanh toán'}
          </Badge>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Quyền lợi dành cho Nhà cung cấp:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Được gắn nhãn <strong>Đối tác đã xác thực mã số thuế</strong> trên catalog giải pháp.</span>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Đăng tải tối đa 5 hồ sơ giải pháp công nghệ tương thích với 17 điểm nghẽn logistics.</span>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Nhận thông báo tự động khi có doanh nghiệp tạo yêu cầu kết nối hoặc hỏi báo giá.</span>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Quyền gửi bảng báo giá chính thức và đối soát hợp đồng minh bạch trên nền tảng.</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-slate-400 block font-medium">Thời hạn hiệu lực hiện tại:</span>
            <strong className="text-slate-900">
              {seller.goi_tham_gia.ngay_bat_dau} đến {seller.goi_tham_gia.ngay_het_han}
            </strong>
          </div>

          <Button
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleSimulatePayment}
          >
            Gia hạn 12 tháng (Mô phỏng 6 triệu)
          </Button>
        </div>
      </div>
    </div>
  );
};
