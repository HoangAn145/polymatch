import React, { useState } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  ArrowRight, 
  X, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WalletTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedAmount?: number;
}

export const WalletTopupModal: React.FC<WalletTopupModalProps> = ({
  isOpen,
  onClose,
  recommendedAmount
}) => {
  const { vendorWalletBalance, topupVendorWallet } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(recommendedAmount || 200000);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [100000, 200000, 500000, 1000000];

  const handleTopup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      topupVendorWallet(selectedAmount);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 backdrop-blur-xs mb-2 border border-white/20">
            <Wallet className="w-3.5 h-3.5 text-teal-400" />
            <span>Ví Nền tảng Nhà cung cấp</span>
          </div>
          <h3 className="text-xl font-black">Nạp tiền Ví Mở Lead</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Dùng để mở khóa hồ sơ khách hàng tiềm năng và chi tiết RFQ theo nhu cầu thực.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Current balance */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Số dư khả dụng hiện tại:</span>
            <span className="text-base font-black text-slate-900">
              {vendorWalletBalance.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>

          {/* Preset amounts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Chọn mức nạp:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {quickAmounts.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-black shadow-xs ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-sm">{amt.toLocaleString('vi-VN')} đ</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {amt === 200000 ? 'Mở ~2 lead SME' : amt === 500000 ? 'Mở ~5 lead SME' : amt === 1000000 ? 'Khuyên dùng' : 'Tối thiểu'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Phương thức: Chuyển khoản VietQR / Thẻ</span>
              </span>
              <span className="text-[11px] text-emerald-600 font-extrabold">Xử lý tức thì</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Trong môi trường thử nghiệm, tiền sẽ được cộng ngay lập tức vào số dư ví của Vendor để mở lead thực tế.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Nạp thành công +{selectedAmount.toLocaleString('vi-VN')} VNĐ vào Ví Nền tảng!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleTopup}
              disabled={isProcessing || isSuccess}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý nạp...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Xác nhận Nạp {selectedAmount.toLocaleString('vi-VN')} VNĐ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
