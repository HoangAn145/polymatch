import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldCheck, Clock, RotateCcw, Building2, ChevronDown, Coins } from 'lucide-react';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../ui/Toast';

export const DemoToolbar: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (role: 'BUYER' | 'SELLER_APPROVED' | 'SELLER_PENDING' | 'ADMIN') => {
    const user = authService.switchDemoUser(role);
    setIsOpen(false);
    toast.success(`Đã chuyển vai trò: ${user.fullName}`, `Vai trò hiện tại: ${user.role} (${user.companyName})`);

    if (user.role === 'BUYER') {
      navigate('/buyer/dashboard');
    } else if (user.role === 'SELLER') {
      navigate('/seller/dashboard');
    } else if (user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  };

  const handleResetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu demo về trạng thái ban đầu không?")) {
      dbService.resetDatabase();
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs z-40 relative">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/70 border border-amber-600/40 px-2 py-0.5 rounded text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          MÔI TRƯỜNG DEMO 3 ACTOR
        </span>
        <span className="hidden sm:inline text-slate-400">
          Đang xem: <strong className="text-white">{currentUser?.fullName || "Khách"}</strong> ({currentUser?.role || "GUEST"} - {currentUser?.companyName || "Chưa đăng nhập"})
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
          >
            <span>Đổi vai trò demo</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-72 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Chọn tài khoản diễn tập
              </div>

              <button
                onClick={() => handleSwitch('BUYER')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-blue-50 transition-colors cursor-pointer ${
                  currentUser?.role === 'BUYER' ? 'bg-blue-50/80 font-bold text-[#1769AA]' : 'text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-medium">1. BUYER – Doanh nghiệp</div>
                  <div className="text-[11px] text-slate-500 font-normal">VinaTrans (Vận tải 45 xe, đã có kết quả DBI/LDMI)</div>
                </div>
              </button>

              <button
                onClick={() => handleSwitch('SELLER_APPROVED')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-emerald-50 transition-colors cursor-pointer ${
                  currentUser?.role === 'SELLER' && currentUser?.vendorApproved ? 'bg-emerald-50/80 font-bold text-emerald-700' : 'text-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-medium">2. SELLER – Nhà cung cấp (Đã duyệt)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Smartlog (Đã duyệt MST, báo giá & hợp đồng)</div>
                </div>
              </button>

              <button
                onClick={() => handleSwitch('SELLER_PENDING')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-amber-50 transition-colors cursor-pointer ${
                  currentUser?.role === 'SELLER' && !currentUser?.vendorApproved ? 'bg-amber-50/80 font-bold text-amber-700' : 'text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-medium">3. SELLER – Chờ duyệt xác minh</div>
                  <div className="text-[11px] text-slate-500 font-normal">LogiTech (Chờ Admin duyệt mã số thuế)</div>
                </div>
              </button>

              <button
                onClick={() => handleSwitch('ADMIN')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-50 transition-colors cursor-pointer ${
                  currentUser?.role === 'ADMIN' ? 'bg-purple-50/80 font-bold text-purple-700' : 'text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <div className="font-medium">4. ADMIN – Quản trị viên</div>
                  <div className="text-[11px] text-slate-500 font-normal">Duyệt Seller, quản lý Chuyên gia & giao dịch</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {currentUser && (
          <button
            onClick={() => {
              dbService.depositCredits(currentUser.id, 100, 'Nạp nhanh Demo Toolbar', 'Cộng nhanh 100 tín chỉ để diễn tập');
              toast.success("Đã cộng 100 tín chỉ!", `Tài khoản ${currentUser.companyName} được nạp thêm 100 tín chỉ vào ví.`);
              window.location.reload();
            }}
            title="Bấm để nạp nhanh 100 tín chỉ vào ví diễn tập"
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>+100 Tín chỉ</span>
          </button>
        )}

        {/* Reset Demo button */}
        <button
          onClick={handleResetData}
          title="Khôi phục toàn bộ kho dữ liệu demo về mặc định"
          className="flex items-center gap-1 text-slate-400 hover:text-rose-300 hover:bg-slate-800 px-2 py-1 rounded transition-colors cursor-pointer text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Data</span>
        </button>
      </div>
    </div>
  );
};
