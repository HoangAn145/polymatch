import React, { useState } from 'react';
import { storage, UserProfile, RfqRecord, WalletTransaction } from '../lib/storage';
import { kiemTraMaSoThue, traCuuMstMoPhong } from '../lib/scoring';
import { TEN_NHOM_NANG_LUC, TEN_NHANH, BIEU_PHI_CONFIG } from '../data/weights';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Send, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  RefreshCcw, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  DollarSign,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Plus
} from 'lucide-react';

interface VendorPortalProps {
  currentUser: UserProfile;
  onUserUpdate: () => void;
}

export const VendorPortal: React.FC<VendorPortalProps> = ({
  currentUser,
  onUserUpdate,
}) => {
  const [rfqs, setRfqs] = useState<RfqRecord[]>(storage.getRfqs());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(storage.getTransactions(currentUser.id));
  
  // Modals
  const [quoteModalRfq, setQuoteModalRfq] = useState<RfqRecord | null>(null);
  const [quotePrice, setQuotePrice] = useState('36.000.000 VNĐ/năm');
  const [quoteTimeline, setQuoteTimeline] = useState('3 tuần');
  const [quoteMessage, setQuoteMessage] = useState('Gói giải pháp phần mềm hoàn chỉnh bao gồm đào tạo, tích hợp dữ liệu GPS và hỗ trợ kỹ thuật 24/7.');

  const [refundModalRfq, setRefundModalRfq] = useState<RfqRecord | null>(null);
  const [refundReason, setRefundReason] = useState<'sai_so_dien_thoai' | 'sai_email' | 'khong_con_nhu_cau' | 'khac'>('sai_so_dien_thoai');
  const [refundDescription, setRefundDescription] = useState('');

  // Tax Test Sandbox
  const [testTaxInput, setTestTaxInput] = useState('0316956049');
  const [testTaxResult, setTestTaxResult] = useState<any>(null);

  const refreshData = () => {
    setRfqs(storage.getRfqs());
    setTransactions(storage.getTransactions(currentUser.id));
    onUserUpdate();
  };

  const handleUnlockRfq = (rfq: RfqRecord) => {
    const res = storage.unlockRfq(rfq.id, currentUser.id);
    alert(res.message);
    refreshData();
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalRfq) return;

    storage.submitQuote(quoteModalRfq.id, {
      vendorId: currentUser.id,
      vendorName: currentUser.companyName || currentUser.name,
      price: quotePrice,
      timeline: quoteTimeline,
      message: quoteMessage,
    });

    alert('Đã gửi báo giá thành công tới doanh nghiệp (M18.05)!');
    setQuoteModalRfq(null);
    refreshData();
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalRfq) return;

    const res = storage.submitRefundComplaint(refundModalRfq.id, `${refundReason}: ${refundDescription}`);
    alert(res.message);
    setRefundModalRfq(null);
    refreshData();
  };

  const runTaxTest = () => {
    const check = kiemTraMaSoThue(testTaxInput);
    if (!check.hop_le) {
      setTestTaxResult({ hop_le: false, loi: check.loi });
    } else {
      const lookup = traCuuMstMoPhong(testTaxInput);
      setTestTaxResult({ hop_le: true, lookup });
    }
  };

  const isFeeActive = storage.isFeeActive();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Profile & Wallet Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
                CỔNG NHÀ CUNG CẤP CÔNG NGHỆ (VENDOR PORTAL)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Đã xác thực MST (R25/R26)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {currentUser.companyName || currentUser.name}
            </h1>
            <p className="text-xs text-slate-500">
              Mã số thuế: <strong className="font-mono text-slate-700">{currentUser.taxCode || '0312144913'}</strong> · Người đại diện: {currentUser.representative || currentUser.name} · Gói: <strong>{currentUser.subscriptionPlan === 'chuyen_nghiep' ? 'Chuyên nghiệp (Nhận tin sớm 24h M20.02)' : 'Cơ bản'}</strong>
            </p>
          </div>

          {/* Credit Wallet Card (M19.01) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm min-w-[280px] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Ví tín chỉ POLYMATCH (M19.01)
              </span>
              {!isFeeActive && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Pilot: Mở miễn phí
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-amber-400">
                {currentUser.credits.toFixed(2)}
              </span>
              <span className="text-xs text-slate-300">triệu VNĐ</span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  storage.topupCredits(currentUser.id, 1.0, 'Nạp tín chỉ thử nghiệm');
                  refreshData();
                }}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-center transition-colors"
              >
                + Nạp nhanh 1 triệu tín chỉ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEED OF MATCHED ANONYMOUS RFQS (M18.01, M18.02) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Hồ sơ nhu cầu phù hợp (Nhu cầu từ Doanh nghiệp Logistics)
            </h2>
            <p className="text-xs text-slate-500">
              Mỗi thẻ hiển thị bản tóm tắt ẩn danh (R14). Mở hồ sơ bằng tín chỉ để nhận toàn bộ thông tin liên hệ (Trần 5 lượt mở R15).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {rfqs.length} HỒ SƠ
          </span>
        </div>

        <div className="space-y-4">
          {rfqs.map((rfq) => {
            const hasUnlocked = rfq.unlockedVendorIds.includes(currentUser.id);
            const isFull = rfq.unlockedVendorIds.length >= 5;
            
            // Fee calculation (R12, R18)
            let fee = 0.10;
            if (rfq.budgetTier === 'bac_2') fee = 0.20;
            if (rfq.budgetTier === 'bac_3') fee = 0.30;
            if (!isFeeActive) fee = 0;

            return (
              <div
                key={rfq.id}
                className={`bg-white rounded-2xl border p-6 space-y-4 shadow-sm transition-all ${
                  hasUnlocked ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800">
                        {rfq.id}
                      </span>
                      <span className="text-xs font-semibold text-blue-700">
                        Nhánh: {rfq.branch}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600">
                        Quy mô: {rfq.scale.toUpperCase()}
                      </span>
                      {hasUnlocked && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã mở khóa
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">
                      Nhu cầu giải pháp: {rfq.solutionName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      Mức trưởng thành số: <strong>DBI {rfq.anonymousSnapshot.dbiMuc}</strong> · <strong>LDMI Mức {rfq.anonymousSnapshot.ldmiMuc} ({rfq.anonymousSnapshot.ldmiMucTen})</strong>
                    </p>
                  </div>

                  {/* Unlocked status and Fee */}
                  <div className="text-left sm:text-right space-y-1 shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800">
                      <Users className="w-3.5 h-3.5 text-blue-700" />
                      <span>{rfq.unlockedVendorIds.length}/5 Đã mở (R15)</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Phí mở hồ sơ: <strong className="text-slate-900 font-mono">{fee > 0 ? `${fee} triệu tín chỉ` : '0đ (Miễn phí Pilot)'}</strong>
                    </div>
                  </div>
                </div>

                {/* Anonymous Snapshot Section (R14) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                    <span className="font-bold text-slate-800 block">Khoảng trống cấp bách đã chẩn đoán:</span>
                    <ul className="space-y-1 text-slate-700">
                      {rfq.anonymousSnapshot.topGaps.map((g, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                    <span className="font-bold text-slate-800 block">Ưu tiên & Khung ngân sách:</span>
                    <p className="text-slate-700">
                      Ngân sách dự kiến: <strong>{rfq.budgetText} ({rfq.budgetTier})</strong>
                    </p>
                    <p className="text-slate-700">
                      Ưu tiên 6 tháng: <strong>{rfq.anonymousSnapshot.priorities.join(', ')}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Độ tươi: Tạo ngày {rfq.anonymousSnapshot.date}
                    </p>
                  </div>
                </div>

                {/* UNLOCKED FULL CONTACT DETAILS (R14, R16) */}
                {hasUnlocked ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-950 pb-1 border-b border-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Unlock className="w-4 h-4 text-emerald-700" />
                        THÔNG TIN LIÊN HỆ ĐẦY ĐỦ CỦA DOANH NGHIỆP:
                      </span>
                      <span className="text-[11px] font-mono text-emerald-800">Mở lại không trừ phí (R16)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 pt-1">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Tên doanh nghiệp:</span>
                        <strong className="text-slate-900">{rfq.fullContact.companyName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Mã số thuế:</span>
                        <strong className="font-mono text-slate-900">{rfq.fullContact.taxCode}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Người liên hệ: <strong>{rfq.fullContact.contactPerson}</strong> ({rfq.fullContact.phone})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email: <strong>{rfq.fullContact.email}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                      <button
                        type="button"
                        onClick={() => setQuoteModalRfq(rfq)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Gửi báo giá cho doanh nghiệp (M18.05)
                      </button>

                      <button
                        type="button"
                        onClick={() => setRefundModalRfq(rfq)}
                        className="px-3.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold rounded-lg"
                      >
                        Khiếu nại hoàn tín chỉ (R17)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Thông tin liên hệ (Tên, SĐT, Email) được bảo mật theo quy tắc ẩn danh R14.</span>
                    </div>

                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => handleUnlockRfq(rfq)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isFull
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }`}
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      {isFull ? 'Đã đủ 5 lượt mở' : `Mở hồ sơ ngay (${fee > 0 ? `${fee} tr tín chỉ` : '0đ Pilot'})`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TAX CODE TESTING LAB (R25/R26 EVALUATION TOOL) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Công cụ kiểm thử Thuật toán Mã số thuế (R25 & R26)
            </h3>
            <p className="text-xs text-slate-500">
              Kiểm tra tính hợp lệ bằng công thức K = 10 − (S mod 11) và tra cứu mô phỏng API esgoo/xinvoice
            </p>
          </div>
          <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
            KIỂM CHỨNG R25
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Nhập MST (ví dụ: 0316956049, 0101248141...)"
            value={testTaxInput}
            onChange={(e) => setTestTaxInput(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
          />
          <button
            type="button"
            onClick={runTaxTest}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Chạy kiểm tra chữ số kiểm tra
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center text-[11px]">Mã mẫu thử nghiệm:</span>
          {['0316956049', '0101248141', '0108054755', '0312144913', '0316956048 (sai số cuối)'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setTestTaxInput(code.split(' ')[0]);
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-mono text-slate-700"
            >
              {code}
            </button>
          ))}
        </div>

        {testTaxResult && (
          <div className={`p-4 rounded-xl text-xs border ${testTaxResult.hop_le ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
            {testTaxResult.hop_le ? (
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mã số thuế hợp lệ theo thuật toán R25!
                </div>
                <p>Doanh nghiệp: <strong>{testTaxResult.lookup?.ten}</strong></p>
                <p>Địa chỉ: {testTaxResult.lookup?.dia_chi}</p>
                <p>Tình trạng: {testTaxResult.lookup?.tinh_trang} (Nguồn: {testTaxResult.lookup?.nguon})</p>
              </div>
            ) : (
              <div className="font-bold flex items-center gap-1.5 text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Lỗi: {testTaxResult.loi}
              </div>
            )}
          </div>
        )}
      </div>

      {/* WALLET TRANSACTIONS HISTORY (M19.01) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Lịch sử giao dịch ví tín chỉ
        </h3>

        {transactions.length === 0 ? (
          <div className="text-xs text-slate-400 py-4 text-center">Chưa có giao dịch nào phát sinh.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Mã GD</th>
                  <th className="p-3">Loại giao dịch</th>
                  <th className="p-3">Số tín chỉ</th>
                  <th className="p-3">Ghi chú</th>
                  <th className="p-3">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">{tx.id}</td>
                    <td className="p-3 font-medium">
                      {tx.type === 'nap' && <span className="text-emerald-700 font-bold">+ Nạp tín chỉ</span>}
                      {tx.type === 'tru_mo_ho_so' && <span className="text-slate-800">- Mở hồ sơ</span>}
                      {tx.type === 'hoan' && <span className="text-blue-700 font-bold">↻ Hoàn tín chỉ</span>}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {tx.type === 'nap' || tx.type === 'hoan' ? `+${tx.amount}` : `-${tx.amount}`} tr
                    </td>
                    <td className="p-3">{tx.note}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{new Date(tx.timestamp).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEND QUOTATION MODAL (M18.05) */}
      {quoteModalRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Gửi báo giá: {quoteModalRfq.solutionName}
              </h3>
              <button onClick={() => setQuoteModalRfq(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Mức giá đề xuất</label>
                <input
                  type="text"
                  required
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Thời gian triển khai cam kết</label>
                <input
                  type="text"
                  required
                  value={quoteTimeline}
                  onChange={(e) => setQuoteTimeline(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Thông điệp tư vấn & Phạm vi công việc</label>
                <textarea
                  rows={3}
                  required
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setQuoteModalRfq(null)} className="px-4 py-2 border rounded-lg text-slate-600">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg">
                  Gửi báo giá chính thức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFUND COMPLAINT MODAL (R17, M18.06) */}
      {refundModalRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Khiếu nại hoàn tín chỉ (R17)
              </h3>
              <button onClick={() => setRefundModalRfq(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Theo quy tắc <strong>R17</strong>, các khiếu nại với lý do "Sai số điện thoại" hoặc "Sai email" sẽ được hệ thống <strong>tự động duyệt hoàn đủ tín chỉ</strong> ngay lập tức.
              </p>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Lý do khiếu nại (R17)</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="sai_so_dien_thoai">Số điện thoại không đúng / không liên lạc được (Tự hoàn)</option>
                  <option value="sai_email">Email liên hệ bị sai / không phản hồi (Tự hoàn)</option>
                  <option value="khong_con_nhu_cau">Doanh nghiệp đã hủy nhu cầu</option>
                  <option value="khac">Lý do kỹ thuật khác (Admin duyệt)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về cuộc gọi hoặc phản hồi..."
                  value={refundDescription}
                  onChange={(e) => setRefundDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRefundModalRfq(null)} className="px-4 py-2 border rounded-lg text-slate-600">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg">
                  Gửi yêu cầu hoàn tín chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
