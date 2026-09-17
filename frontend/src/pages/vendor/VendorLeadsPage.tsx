import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  Clock, 
  ArrowRight,
  Filter,
  DollarSign,
  Lock,
  Unlock,
  KeyRound,
  Wallet,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Handshake,
  Tag,
  MapPin,
  Gauge,
  Award,
  TrendingDown
} from 'lucide-react';
import { LeadInquiry } from '../../types';
import { LeadUnlockModal } from '../../components/vendor/LeadUnlockModal';
import { PlatformPricingModal } from '../../components/vendor/PlatformPricingModal';
import { WalletTopupModal } from '../../components/vendor/WalletTopupModal';
import { WalletTransactionsModal } from '../../components/vendor/WalletTransactionsModal';
import { LeadDetailRfqModal } from '../../components/vendor/LeadDetailRfqModal';

export const VendorLeadsPage: React.FC = () => {
  const { 
    leads, 
    updateLeadStatus, 
    setActiveChatLeadId, 
    navigate,
    vendorWalletBalance,
    platformPricing
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [unlockingLead, setUnlockingLead] = useState<LeadInquiry | null>(null);
  const [detailLead, setDetailLead] = useState<LeadInquiry | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  // Stats calculation
  const totalLeads = leads.length;
  const unlockedCount = leads.filter(l => l.isUnlocked).length;
  const lockedCount = totalLeads - unlockedCount;

  // Filtering
  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'unlocked' && !lead.isUnlocked) return false;
    if (activeFilter === 'locked' && lead.isUnlocked) return false;
    if (selectedStatus !== 'ALL' && lead.status !== selectedStatus) return false;
    return true;
  });

  const handleOpenUnlock = (lead: LeadInquiry) => {
    setUnlockingLead(lead);
  };

  const handleOpenDetail = (lead: LeadInquiry) => {
    if (!lead.isUnlocked) {
      setUnlockingLead(lead);
    } else {
      setDetailLead(lead);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Wallet Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>Quản lý Lead & Khách hàng Quan tâm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Phễu Khách hàng Doanh nghiệp & RFQ
            </h1>
          </div>

          {/* Platform Wallet Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700/50">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Wallet className="w-4 h-4 text-teal-400" />
                <span>Số dư Ví Nền tảng (Pay-per-Lead):</span>
              </div>
              <div className="text-2xl font-black text-teal-300 mt-1">
                {vendorWalletBalance.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-300">VNĐ</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Dùng mở khóa lead khi có nhu cầu thực tế
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsTopupModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>+ Nạp ví</span>
              </button>
              <button
                onClick={() => setIsTransactionsModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Xem lịch sử giao dịch trừ tiền"
              >
                <History className="w-3.5 h-3.5" />
                <span>Lịch sử</span>
              </button>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Bảng giá và cam kết nền tảng"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Biểu phí</span>
              </button>
            </div>
          </div>
        </div>

        {/* Platform Policy High-Trust Callout */}
        <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Handshake className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-700 space-y-0.5">
              <div className="font-extrabold text-blue-950 text-sm">
                Cơ chế Thu phí Nền tảng: Trả theo Lead mở khóa (Pay-per-Lead)
              </div>
              <p className="text-slate-600 leading-relaxed">
                Vendor chỉ trả phí ({platformPricing.smeLeadUnlockFee.toLocaleString('vi-VN')}đ/lead SME, {platformPricing.largeLeadUnlockFee.toLocaleString('vi-VN')}đ/lead Lớn) khi bấm xem chi tiết một lead có nhu cầu thật. 
                <strong className="text-blue-900"> Không thu được hợp đồng thì vendor cũng không mất gì.</strong> Sau khi mở, Vendor toàn quyền gặp mặt, gọi điện và <strong>giao dịch ngoài nền tảng</strong> mà không bị thu thêm bất kỳ chi phí hoa hồng nào.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPricingModalOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-blue-100/50 border border-blue-300 text-blue-800 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Xem quy chế nền tảng
          </button>
        </div>

        {/* Filter and Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tất cả ({totalLeads})
            </button>
            <button
              onClick={() => setActiveFilter('locked')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'locked'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Chưa mở khóa ({lockedCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('unlocked')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'unlocked'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Đã mở khóa ({unlockedCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="NEW">Mới gửi</option>
              <option value="CONTACTED">Đang trao đổi</option>
              <option value="QUOTED">Đã gửi báo giá</option>
              <option value="CLOSED">Đã chốt hợp đồng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy yêu cầu phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thử thay đổi bộ lọc trạng thái hoặc chế độ hiển thị để kiểm tra các khách hàng tiềm năng khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => {
            const isLarge = (lead.buyerEmployeeCount && lead.buyerEmployeeCount >= 500) || (lead.buyerDbiLevel && lead.buyerDbiLevel >= 4);
            const unlockFee = lead.unlockFee || (isLarge ? platformPricing.largeLeadUnlockFee : platformPricing.smeLeadUnlockFee);
            const isUnlocked = !!lead.isUnlocked;

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isUnlocked ? 'border-emerald-200/80 ring-1 ring-emerald-100' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Card Top Banner */}
                <div className={`px-5 py-3 border-b flex items-center justify-between text-xs ${
                  isUnlocked 
                    ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900' 
                    : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ĐÃ MỞ KHÓA LIÊN HỆ</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>CHƯA MỞ KHÓA</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200/80">
                    {isUnlocked ? 'Được giao dịch ngoài' : `Phí mở: ${unlockFee.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-5 space-y-4">
                  {/* Company & Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isUnlocked ? 'Hồ sơ đầy đủ' : 'Bản ẩn danh'}
                        </span>
                        {lead.daysSinceAssessment !== undefined && (
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            Độ tươi: {lead.daysSinceAssessment} ngày
                          </span>
                        )}
                      </div>

                      {/* Tên Doanh Nghiệp: ẨN HOÀN TOÀN TRƯỚC KHI MỞ */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug pt-0.5">
                        {isUnlocked 
                          ? (lead.buyerCompany || lead.buyerName) 
                          : `[Doanh nghiệp ${lead.buyerIndustry || 'Sản xuất'}]`}
                      </h3>

                      {/* Nhận dạng: Ngành, quy mô, tỉnh/thành. Không lộ MST trước khi mở */}
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{lead.buyerIndustry || 'Sản xuất'}</span>
                        </span>
                        <span>•</span>
                        <span>{lead.buyerEmployeeCount || 85} nhân sự</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lead.buyerProvince || 'Toàn quốc'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-100 text-teal-900 inline-block">
                        Cấp {lead.buyerDbiLevel} ({lead.buyerDbiScore}đ)
                      </span>
                      {isUnlocked && lead.buyerMst && (
                        <div className="text-[10px] text-slate-400 mt-1">MST: {lead.buyerMst}</div>
                      )}
                    </div>
                  </div>

                  {/* Nhu cầu & Mức sẵn sàng */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Công nghệ quan tâm:</span>
                      <strong className="text-slate-900 truncate max-w-[170px]">{lead.techName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dự toán ngân sách:</span>
                      <strong className="text-teal-700">{lead.budgetRange || lead.buyerBudget || 'Thỏa thuận'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời điểm triển khai:</span>
                      <strong className="text-slate-700">{lead.timeline || 'Quý 2/2026'}</strong>
                    </div>
                    {lead.readiness && (
                      <div className="flex justify-between pt-1 border-t border-slate-200/80 text-[11px]">
                        <span className="text-slate-500">Mức sẵn sàng:</span>
                        <span className="font-bold text-slate-800">
                          Nhân sự: <span className="text-amber-600 font-extrabold">{lead.readiness.personnelScore}/5</span> • Hạ tầng: <span className="text-amber-600 font-extrabold">{lead.readiness.infrastructureScore}/5</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Area (Protected Blur vs Unlocked) */}
                  {isUnlocked ? (
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          <span>{lead.buyerPhone || '0912345678'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">Người liên hệ: {lead.buyerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{lead.buyerEmail || 'ceo@company.vn'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold shrink-0">Đã mở liên hệ</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100/70 border border-dashed border-slate-300 space-y-1 text-center relative overflow-hidden">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tên Doanh nghiệp & Liên hệ được ẩn</span>
                      </div>
                      <div className="text-[11px] text-slate-400 filter blur-xs select-none">
                        Doanh nghiệp: CTY CP THƯƠNG MẠI ••• SĐT: 0984 892 •••
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Chỉ mở khi có nhu cầu thật ({unlockFee.toLocaleString('vi-VN')}đ). Không chốt được không mất gì.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Trạng thái:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadInquiry['status'])}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="NEW">Mới gửi</option>
                      <option value="CONTACTED">Đang trao đổi</option>
                      <option value="QUOTED">Đã gửi báo giá</option>
                      <option value="CLOSED">Đã chốt hợp đồng</option>
                    </select>
                  </div>

                  {/* Unlock Button or View Detail */}
                  {!isUnlocked ? (
                    <button
                      onClick={() => handleOpenUnlock(lead)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-amber-300" />
                      <span>Mở khóa Lead & Xem RFQ ({unlockFee.toLocaleString('vi-VN')}đ)</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenDetail(lead)}
                        className="py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Xem chi tiết RFQ</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveChatLeadId(lead.id);
                          navigate('/interests');
                        }}
                        className="py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Mở Chatbox</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <LeadUnlockModal
        lead={unlockingLead}
        isOpen={!!unlockingLead}
        onClose={() => setUnlockingLead(null)}
        onOpenTopup={() => setIsTopupModalOpen(true)}
        onSuccessUnlocked={(unlockedId) => {
          const updated = leads.find(l => l.id === unlockedId);
          if (updated) {
            setDetailLead(updated);
          }
        }}
      />

      <LeadDetailRfqModal
        lead={detailLead}
        isOpen={!!detailLead}
        onClose={() => setDetailLead(null)}
        onOpenChat={(leadId) => {
          setActiveChatLeadId(leadId);
          navigate('/interests');
        }}
      />

      <PlatformPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onOpenTopup={() => setIsTopupModalOpen(true)}
      />

      <WalletTopupModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
      />

      <WalletTransactionsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        onOpenTopup={() => setIsTopupModalOpen(true)}
      />
    </div>
  );
};
