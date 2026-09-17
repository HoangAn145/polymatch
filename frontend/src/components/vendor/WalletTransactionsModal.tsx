import React from 'react';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  X, 
  Wallet,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WalletTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTopup?: () => void;
}

export const WalletTransactionsModal: React.FC<WalletTransactionsModalProps> = ({
  isOpen,
  onClose,
  onOpenTopup
}) => {
  const { vendorWalletBalance, vendorTransactions } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-teal-300">
              <History className="w-3.5 h-3.5" />
              <span>Sổ Cái Giao dịch Minh bạch</span>
            </div>
            <h3 className="text-xl font-black">Lịch sử Biến động Số dư Ví</h3>
            <p className="text-xs text-slate-400">
              Mọi khoản trừ phí mở lead và nạp ví đều được lưu vết chi tiết.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Balance card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div>
              <span className="text-xs font-bold text-blue-900 block">Số dư Ví hiện tại</span>
              <span className="text-2xl font-black text-blue-950">
                {vendorWalletBalance.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
            {onOpenTopup && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTopup();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                + Nạp thêm tiền
              </button>
            )}
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Lịch sử ({vendorTransactions.length} giao dịch)</span>
              <span>Số dư sau GD</span>
            </div>

            {vendorTransactions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Chưa có giao dịch nào trong ví.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {vendorTransactions.map((tx) => {
                  const isDeduction = tx.amount < 0;
                  return (
                    <div 
                      key={tx.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3 text-xs bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isDeduction ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isDeduction ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Mã GD: <strong>{tx.id}</strong></span>
                            <span>•</span>
                            <span>{tx.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-black text-sm ${
                          isDeduction ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {isDeduction ? '' : '+'}{tx.amount.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {tx.balanceAfter.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Cam kết: Phí chỉ thu khi Vendor xác nhận mở khóa xem chi tiết Lead. Không phát sinh chi phí ẩn hoặc trừ định kỳ.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
