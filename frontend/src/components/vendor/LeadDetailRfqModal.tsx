import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Layers, 
  FileText, 
  Handshake, 
  X,
  Clock,
  ShieldCheck,
  Send,
  MapPin,
  Gauge,
  Award,
  TrendingDown,
  Zap
} from 'lucide-react';
import { LeadInquiry } from '../../types';
import { useApp } from '../../context/AppContext';
import { DBI_PILLARS } from '../../data/mockData';

interface LeadDetailRfqModalProps {
  lead: LeadInquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (leadId: string) => void;
}

export const LeadDetailRfqModal: React.FC<LeadDetailRfqModalProps> = ({
  lead,
  isOpen,
  onClose,
  onOpenChat
}) => {
  const { updateLeadStatus } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-blue-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ĐÃ MỞ KHÓA HỒ SƠ</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-blue-200 border border-white/20">
              Mã Lead: {lead.id}
            </span>
            {lead.unlockedAt && (
              <span className="text-[11px] text-blue-200">
                Mở lúc: {lead.unlockedAt}
              </span>
            )}
          </div>
          <h2 className="text-xl font-black">
            {lead.buyerCompany || lead.buyerName}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            MST: <strong>{lead.buyerMst || '0108967845'}</strong> • Ngành: <strong>{lead.buyerIndustry || 'Sản xuất'}</strong> • Quy mô: <strong>{lead.buyerEmployeeCount || 85} nhân sự</strong>
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Direct Contact Cards (Unlocked & Ready) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Thông tin Liên hệ Trực tiếp (Toàn quyền giao dịch)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Chấp nhận giao dịch ngoài
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Phone */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Số điện thoại di động:</span>
                  <a 
                    href={`tel:${lead.buyerPhone || '0912345678'}`}
                    className="text-sm font-black text-blue-800 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lead.buyerPhone || '0912345678'}</span>
                  </a>
                  <span className="text-[10px] text-slate-400">Người đại diện: {lead.buyerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard(lead.buyerPhone || '0912345678', 'phone')}
                    title="Sao chép số điện thoại"
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedField === 'phone' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`https://zalo.me/${lead.buyerPhone?.replace(/\D/g, '') || '0912345678'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    Mở Zalo
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">Email tiếp nhận báo giá:</span>
                  <a 
                    href={`mailto:${lead.buyerEmail || 'ceo@dongnamphat.vn'}`}
                    className="text-xs font-bold text-slate-800 hover:underline flex items-center gap-1.5 truncate max-w-[180px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{lead.buyerEmail || 'ceo@dongnamphat.vn'}</span>
                  </a>
                  <span className="text-[10px] text-slate-400">Email công vụ đã xác thực</span>
                </div>
                <button
                  onClick={() => copyToClipboard(lead.buyerEmail || 'ceo@dongnamphat.vn', 'email')}
                  title="Sao chép Email"
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedField === 'email' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic & RFQ Technical Scope (6 dimensions unlocked) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Hồ sơ Chẩn đoán DBI & Yêu cầu Kỹ thuật (RFQ)</span>
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Độ tươi: {lead.daysSinceAssessment !== undefined ? `${lead.daysSinceAssessment} ngày trước` : 'Mới'} ({lead.assessmentDate || '03/2026'})</span>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">Điểm tổng DBI:</span>
                <strong className="text-sm text-teal-700">{lead.buyerDbiScore}/100 đ</strong>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">Mức chuyển đổi số:</span>
                <strong className="text-sm text-slate-800">Mức {lead.buyerDbiLevel}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">Dự toán ngân sách:</span>
                <strong className="text-sm text-blue-700">{lead.budgetRange || lead.buyerBudget || 'Thỏa thuận'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">Thời điểm triển khai:</span>
                <strong className="text-sm text-slate-800">{lead.timeline || 'Quý II/2026'}</strong>
              </div>
            </div>

            {/* Điểm 6 Trụ Cột DBI */}
            {lead.pillarScores && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Điểm 6 Trụ cột Đánh giá DBI</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {DBI_PILLARS.map((p) => {
                    const score = lead.pillarScores?.[p.id] ?? 30;
                    const isWeak = score < 30;
                    return (
                      <div 
                        key={p.id} 
                        className={`p-2 rounded-lg text-center border ${
                          isWeak ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-[10px] font-bold truncate text-slate-500">{p.shortName}</div>
                        <div className={`text-xs font-black mt-0.5 ${isWeak ? 'text-rose-700' : 'text-slate-900'}`}>
                          {score}đ
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Khoảng trống: 3 trụ cột yếu nhất kèm trích dẫn câu trả lời thực tế */}
            {lead.topGaps && lead.topGaps.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                  <span>Khoảng trống Số: 3 Trụ cột yếu nhất (Nhu cầu tháo gỡ cấp bách)</span>
                </div>
                <div className="space-y-2">
                  {lead.topGaps.map((gap, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-amber-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-950 flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center font-black">
                            {idx + 1}
                          </span>
                          <span>{gap.pillarName}</span>
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">
                          {gap.score} / 100 điểm
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{gap.weaknessSummary}</p>
                      {gap.assessmentAnswerSnippet && (
                        <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200/60">
                          <strong>Câu trả lời khảo sát thực tế:</strong> {gap.assessmentAnswerSnippet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nhu cầu & Mức sẵn sàng (1-5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nhu cầu công nghệ */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  <span>Nhu cầu Công nghệ Quan tâm</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Giải pháp đăng ký:</span>
                  <strong className="text-slate-900">{lead.techName}</strong>
                </div>
                {lead.interestedTechCategories && lead.interestedTechCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.interestedTechCategories.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Mức sẵn sàng (1-5) */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mức Sẵn sàng Đầu tư (1 - 5)</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nhân sự & Năng lực số:</span>
                    <strong className="text-slate-900">★ {lead.readiness?.personnelScore || 3}/5</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hạ tầng mạng & Thiết bị:</span>
                    <strong className="text-slate-900">★ {lead.readiness?.infrastructureScore || 3}/5</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cam kết Ban Lãnh đạo:</span>
                    <strong className="text-emerald-700">★ {lead.readiness?.leadershipCommitmentScore || 4}/5</strong>
                  </div>
                  {lead.readiness?.notes && (
                    <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-100">
                      "{lead.readiness.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {lead.rfqDetails?.scopeSummary ? (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Phạm vi kỹ thuật chi tiết:</span>
                  {lead.rfqDetails.decisionMakerRole && (
                    <span className="text-[10px] text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded">
                      Người quyết định: {lead.rfqDetails.decisionMakerRole}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {lead.rfqDetails.scopeSummary}
                </p>
              </div>
            ) : null}

            {lead.notes && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Ghi chú từ khách hàng:</span>
                <p className="italic">"{lead.notes}"</p>
              </div>
            )}
          </div>

          {/* Off-platform Trading Commitment Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <Handshake className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Chính sách Giao dịch Ngoài (Off-platform Transaction):</span>
              <p className="text-emerald-900 text-[11px] leading-relaxed">
                Nền tảng đã thu phí mở lead ({lead.unlockFee?.toLocaleString('vi-VN') || '99.000'} VNĐ) ngay từ đầu. Bạn hoàn toàn có quyền chủ động hẹn gặp, ký hợp đồng giấy hoặc điện tử và nhận thanh toán trực tiếp từ doanh nghiệp mua mà <strong>không phải nộp thêm bất kỳ khoản phí hoa hồng nào</strong>.
              </p>
            </div>
          </div>

          {/* Status update & Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Trạng thái xử lý:</span>
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadInquiry['status'])}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="NEW">Mới nhận</option>
                <option value="CONTACTED">Đang trao đổi</option>
                <option value="QUOTED">Đã gửi báo giá</option>
                <option value="CLOSED">Đã chốt hợp đồng thành công</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(lead.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mở Chatbox trên Sàn</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
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
