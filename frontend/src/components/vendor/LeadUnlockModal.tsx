import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  Building2, 
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  MapPin,
  Clock,
  Gauge,
  Layers,
  Award,
  Calendar,
  Zap,
  TrendingDown,
  Info
} from 'lucide-react';
import { LeadInquiry } from '../../types';
import { useApp } from '../../context/AppContext';
import { DBI_PILLARS } from '../../data/mockData';

interface LeadUnlockModalProps {
  lead: LeadInquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlocked?: (leadId: string) => void;
  onOpenTopup?: () => void;
}

export const LeadUnlockModal: React.FC<LeadUnlockModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSuccessUnlocked,
  onOpenTopup
}) => {
  const { vendorWalletBalance, unlockLead, platformPricing } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  if (!isOpen || !lead) return null;

  const isLarge = (lead.buyerEmployeeCount && lead.buyerEmployeeCount >= 500) || (lead.buyerDbiLevel && lead.buyerDbiLevel >= 4);
  const unlockFee = lead.unlockFee || (isLarge ? platformPricing.largeLeadUnlockFee : platformPricing.smeLeadUnlockFee);
  const hasEnoughBalance = vendorWalletBalance >= unlockFee;
  const balanceAfter = vendorWalletBalance - unlockFee;

  const handleConfirmUnlock = () => {
    if (!hasEnoughBalance) {
      setFeedback({
        type: 'error',
        message: 'Số dư ví không đủ. Vui lòng nạp thêm để mở khóa lead này.'
      });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);

    setTimeout(() => {
      const res = unlockLead(lead.id);
      setIsProcessing(false);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message
        });
        setTimeout(() => {
          onSuccessUnlocked?.(lead.id);
          onClose();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: res.message
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 backdrop-blur-xs mb-2 border border-white/20">
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Mở khóa Lead & Chi tiết RFQ</span>
          </div>
          <h2 className="text-xl font-black">
            Mở khóa Thông tin Khách hàng Tiềm năng
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">
            Doanh nghiệp đã hoàn thành đánh giá DBI chính thức và cần nhà cung cấp tư vấn giải pháp.
          </p>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dimension 1: Nhận dạng ẩn danh (company_profiles) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                    Bản Ẩn Danh (Trước khi Mở)
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Không lộ tên DN & liên hệ</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  [Doanh nghiệp {lead.buyerIndustry || 'Sản xuất'} - {lead.buyerProvince || 'Hà Nội'}]
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ngành: <strong>{lead.buyerIndustry || 'Sản xuất'}</strong></span>
                  </span>
                  <span>•</span>
                  <span>Quy mô: <strong>{lead.buyerEmployeeCount || 85} nhân sự ({lead.buyerSize || (lead.buyerEmployeeCount && lead.buyerEmployeeCount >= 500 ? 'Doanh nghiệp Lớn' : 'SME')})</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Khu vực: <strong>{lead.buyerProvince || 'Toàn quốc'}</strong></span>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 inline-block">
                  Cấp {lead.buyerDbiLevel} ({lead.buyerDbiScore}/100đ)
                </span>
                <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Đã kiểm định MST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension 2 & 6: Hiện trạng số (6 trụ cột) + Độ tươi của bài đánh giá */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Hiện trạng Số (DBI Cấp {lead.buyerDbiLevel}) & Độ tươi Đánh giá
                </h4>
              </div>
              {/* Độ tươi: Ngày đánh giá & số ngày trôi qua */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Độ tươi: {lead.daysSinceAssessment !== undefined ? `${lead.daysSinceAssessment} ngày trước` : 'Mới trong tháng'} ({lead.assessmentDate || 'Tháng 03/2026'})</span>
              </div>
            </div>

            {/* 6 Pillars Score Grid */}
            {lead.pillarScores && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {DBI_PILLARS.map((p) => {
                  const score = lead.pillarScores?.[p.id] ?? 30;
                  const isLow = score < 30;
                  return (
                    <div 
                      key={p.id} 
                      className={`p-2 rounded-xl text-center border ${
                        isLow ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold truncate text-slate-500">{p.shortName}</div>
                      <div className={`text-sm font-black mt-0.5 ${isLow ? 'text-rose-700' : 'text-slate-900'}`}>
                        {score}đ
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dimension 3: Khoảng trống (3 trụ cột yếu nhất kèm trích dẫn câu trả lời) */}
          {lead.topGaps && lead.topGaps.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
                <TrendingDown className="w-4 h-4 text-amber-700" />
                <span>Khoảng trống Cốt lõi: 3 Trụ cột Yếu nhất (Cơ hội triển khai)</span>
              </div>
              <div className="space-y-2">
                {lead.topGaps.map((gap, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-xs space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-950 font-extrabold flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span>{gap.pillarName}</span>
                      </strong>
                      <span className="text-[11px] font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {gap.score}/100 đ
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{gap.weaknessSummary}</p>
                    {gap.assessmentAnswerSnippet && (
                      <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200/60 mt-1">
                        <strong>Dữ liệu khảo sát:</strong> {gap.assessmentAnswerSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dimension 4 & 5: Nhu cầu (Công nghệ, ngân sách, thời điểm) & Mức sẵn sàng (1-5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nhu cầu & RFQ */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>Nhu cầu Đầu tư & RFQ</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 text-[11px] block">Giải pháp quan tâm:</span>
                  <strong className="text-slate-900 text-xs">{lead.techName}</strong>
                </div>
                {lead.interestedTechCategories && lead.interestedTechCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.interestedTechCategories.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Dự toán ngân sách:</span>
                  <strong className="text-teal-700">{lead.budgetRange || lead.buyerBudget || 'Thỏa thuận'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời điểm triển khai:</span>
                  <strong className="text-slate-800">{lead.timeline || 'Quý II/2026'}</strong>
                </div>
              </div>
            </div>

            {/* Mức sẵn sàng (1 - 5) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Mức Sẵn sàng Triển khai (Thang 1-5)</span>
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">Nhân sự & Năng lực:</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {lead.readiness?.personnelScore || 3}/5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">Hạ tầng & Thiết bị:</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {lead.readiness?.infrastructureScore || 3}/5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">Cam kết Ban Lãnh đạo:</span>
                  <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {lead.readiness?.leadershipCommitmentScore || 4}/5
                  </span>
                </div>
                {lead.readiness?.notes && (
                  <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                    "{lead.readiness.notes}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Masked Info Notice: Tại sao trả tiền có ý nghĩa */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <span className="font-bold text-amber-900 block">Quy chế Hiển thị & Ý nghĩa Trả tiền Mở Lead:</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Trước khi mở, bạn đã nắm trọn <strong>Hiện trạng số, 3 Trụ cột yếu nhất, Nhu cầu, Ngân sách và Độ tươi</strong> để định giá độ phù hợp. 
                Sau khi bấm mở, hệ thống sẽ mở khóa vĩnh viễn <strong>Tên Doanh nghiệp chính thức, Mã số thuế, Họ tên người phụ trách, Số điện thoại di động và Email</strong> để bạn chủ động gọi điện, gửi báo giá và chốt hợp đồng.
              </p>
            </div>
          </div>

          {/* Pricing & Wallet Calculation */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
              <span className="text-slate-400">Phí mở khóa Lead ({isLarge ? 'Doanh nghiệp Lớn' : 'Doanh nghiệp SME'}):</span>
              <span className="text-base font-black text-amber-400">
                {unlockFee.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Số dư ví nền tảng hiện tại:</span>
              <span className="font-bold text-slate-200">
                {vendorWalletBalance.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Số dư sau khi mở khóa:</span>
              <span className={`font-black text-sm ${hasEnoughBalance ? 'text-teal-400' : 'text-rose-400'}`}>
                {hasEnoughBalance ? `${balanceAfter.toLocaleString('vi-VN')} VNĐ` : 'Không đủ số dư'}
              </span>
            </div>
          </div>

          {/* Platform Commitment Reminder */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 space-y-1.5 text-[11px] text-blue-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Cam kết thu phí minh bạch (Pay-per-Lead):</span>
            </div>
            <p className="text-blue-800 leading-relaxed pl-5">
              • Bạn chỉ trả khi có nhu cầu thật. Không mở = không mất bất kỳ chi phí nào.<br />
              • <strong>Chấp nhận giao dịch ngoài:</strong> Sau khi mở khóa, bạn toàn quyền gọi điện, gặp mặt, ký kết hợp đồng ngoài nền tảng mà không phải chia sẻ % hoa hồng.
            </p>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Để sau
            </button>

            {hasEnoughBalance ? (
              <button
                onClick={handleConfirmUnlock}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang xử lý trừ ví...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Xác nhận Mở khóa (Trừ {unlockFee.toLocaleString('vi-VN')}đ)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenTopup?.();
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Nạp thêm ví ({unlockFee.toLocaleString('vi-VN')}đ)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
