import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../../components/ui/Toast';

export const SellerVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const seller = dbService.getSellers().find(s => s.userId === currentUser?.id) || dbService.getSellers()[0];

  const isApproved = currentUser?.vendorApproved || seller?.trang_thai === 'da_duyet';

  const handleSimulateAdminApproval = () => {
    // Approve seller in DB
    dbService.updateSeller(seller.id, { trang_thai: 'da_duyet' });
    if (currentUser) {
      authService.updateUser(currentUser.id, { vendorApproved: true, status: 'active' });
    }
    toast.success(
      "Đã duyệt tài khoản Nhà cung cấp!",
      `Nhà cung cấp ${seller.ten} đã được chuyển sang trạng thái ĐÃ XÁC THỰC.`
    );
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <Badge variant={isApproved ? "success" : "warning"}>
          {isApproved ? "Đã xác thực thành công" : "Đang chờ Admin thẩm định"}
        </Badge>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Tình trạng Xác minh Pháp lý & Mã số thuế Nhà cung cấp
        </h1>
        <p className="text-xs text-slate-500">
          Quy chế VNYTL yêu cầu toàn bộ nhà cung cấp phải xác minh mã số thuế hợp lệ trước khi giải pháp được đưa vào bộ máy ghép nối.
        </p>
      </div>

      {/* Status Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs ${
        isApproved
          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
          : 'bg-amber-50/60 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            {isApproved ? <ShieldCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-900">
              {isApproved
                ? 'Hồ sơ đã được phê duyệt chính thức'
                : 'Hồ sơ đang trong hàng đợi phê duyệt (SLA 24 giờ)'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isApproved
                ? 'Tài khoản của bạn đã được cấp quyền đăng tải tối đa giải pháp lên catalog và tiếp nhận yêu cầu kết nối từ các doanh nghiệp chuỗi cung ứng.'
                : 'Hồ sơ đăng ký của bạn đang được Ban Quản trị POLYMATCH đối chiếu thông tin với Cổng Đăng ký Doanh nghiệp Quốc gia.'}
            </p>
          </div>
        </div>

        {!isApproved && (
          <Button
            variant="success"
            size="md"
            className="shrink-0 bg-emerald-700 hover:bg-emerald-800 font-bold"
            onClick={handleSimulateAdminApproval}
          >
            ⚡ Phê duyệt nhanh (Mô phỏng Demo)
          </Button>
        )}
      </div>

      {/* Tax Lookup Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#1769AA]" />
          <span>Dữ liệu tra cứu cổng Đăng ký Kinh doanh (Mô phỏng API esgoo.net)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Tên đăng ký kinh doanh:</span>
            <p className="font-bold text-slate-900 mt-0.5">
              {seller.mst_tra_cuu?.ten_dang_ky || seller.ten.toUpperCase()}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Mã số thuế:</span>
            <p className="font-bold font-mono text-[#1769AA] text-sm mt-0.5">
              {seller.ma_so_thue}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Tình trạng hoạt động:</span>
            <p className="font-semibold text-emerald-700 mt-0.5">
              {seller.mst_tra_cuu?.tinh_trang || "Đang hoạt động (đã được cấp GCN ĐKT)"}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Nguồn tra cứu:</span>
            <p className="font-semibold text-slate-700 mt-0.5">
              {seller.mst_tra_cuu?.nguon || "esgoo.net"} (Thời gian phản hồi &lt; 300ms)
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-600 space-y-1">
          <div className="font-bold text-[#1769AA]">Tiêu chí thẩm định Seller trên POLYMATCH:</div>
          <p>• Mã số thuế hợp lệ, đúng thuật toán checksum số thứ 10 (theo quy tắc R25).</p>
          <p>• Tên doanh nghiệp khai báo khớp với giấy chứng nhận đăng ký kinh doanh.</p>
          <p>• Đồng ý cam kết biểu phí thường niên 6.000.000đ/năm và hoa hồng đối soát hợp đồng thành công theo tài liệu VNYTL.</p>
        </div>
      </div>
    </div>
  );
};
