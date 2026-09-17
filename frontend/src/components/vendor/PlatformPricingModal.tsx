import React from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  PhoneCall, 
  Handshake, 
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PlatformPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTopup?: () => void;
}

export const PlatformPricingModal: React.FC<PlatformPricingModalProps> = ({
  isOpen,
  onClose,
  onOpenTopup
}) => {
  const { platformPricing, vendorWalletBalance } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 backdrop-blur-xs mb-3 border border-white/20">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Chính sách Thu phí Nền tảng Minh bạch</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Mô hình Thu phí Pay-per-Lead
          </h2>
          <p className="text-sm text-blue-100 mt-1 max-w-lg">
            Vendor chỉ trả phí khi chủ động mở khóa xem chi tiết Lead có nhu cầu thật. Không mất phí duy trì, toàn quyền giao dịch ngoài.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SME Lead Card */}
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Lead Doanh nghiệp SME
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Quy mô &lt; 500 NS</span>
                </div>
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {platformPricing.smeLeadUnlockFee.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-sm font-bold text-slate-600">VNĐ / lead</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Phí mở khóa 1 lần duy nhất cho toàn bộ hồ sơ kỹ thuật & liên hệ.
                  </p>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-blue-200/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Xem đầy đủ SĐT, Email, Tên lãnh đạo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Toàn quyền gọi điện & kết bạn Zalo trực tiếp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hồ sơ điểm DBI & bài toán thiếu hụt chuẩn xác</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Lead Card */}
            <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/40 p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Lead Doanh nghiệp Lớn
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Quy mô &ge; 500 NS</span>
                </div>
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {platformPricing.largeLeadUnlockFee.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-sm font-bold text-slate-600">VNĐ / lead</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Hồ sơ RFQ chuyên sâu cấp tập đoàn / dự án ngân sách lớn.
                  </p>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-purple-200/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Thông tin Ban Chuyển đổi số & Ban TGĐ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Chi tiết RFQ 13 trụ cột & phạm vi kỹ thuật</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Toàn quyền đàm phán & ký hợp đồng bên ngoài</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Core Rules Banner */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>3 Nguyên tắc Vận hành Cốt lõi của Nền tảng</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-blue-700">
                  <Zap className="w-3.5 h-3.5" />
                  <span>1. Chỉ trả khi có nhu cầu</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Vendor được xem tóm tắt nhu cầu, ngành nghề, điểm số DBI hoàn toàn <strong>MIỄN PHÍ</strong>. Chỉ trả tiền khi chủ động bấm mở khóa hồ sơ phù hợp.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-emerald-700">
                  <Handshake className="w-3.5 h-3.5" />
                  <span>2. Chấp nhận giao dịch ngoài</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Nền tảng <strong>không thu % hoa hồng</strong> hợp đồng thành công. Sau khi mở lead, vendor tự do gặp mặt, ký kết và thanh toán trực tiếp với khách hàng.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-purple-700">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>3. Không rủi ro, không phí ẩn</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Nếu không có lead phù hợp hoặc không mở, vendor <strong>không mất bất kỳ chi phí nào</strong>. Không phí duy trì tháng, không ép cam kết số lượng.
                </p>
              </div>
            </div>
          </div>

          {/* Current Wallet status & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Số dư Ví Nền tảng của bạn:</div>
              <div className="text-2xl font-black text-teal-400">
                {vendorWalletBalance.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onOpenTopup && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTopup();
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-extrabold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  + Nạp thêm ví
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
