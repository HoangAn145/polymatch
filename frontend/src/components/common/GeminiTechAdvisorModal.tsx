import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  TrendingUp, 
  Coins, 
  Send, 
  RefreshCw,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AVAILABLE_INDUSTRIES } from '../../data/geminiTechKnowledgeBase';
import { getGeminiTechRecommendations, GeminiAdvisorResponse, RecommendedTechSolution } from '../../services/geminiTechAdvisorService';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultIndustry?: string;
  defaultLevel?: number;
}

export const GeminiTechAdvisorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultIndustry,
  defaultLevel = 2
}) => {
  const { currentUser, currentResult, createLead, navigate, investmentPrefs } = useApp();

  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    defaultIndustry || currentResult?.industry || currentUser.company.industry || 'Bán lẻ'
  );
  const [selectedSize, setSelectedSize] = useState<'Siêu nhỏ' | 'Nhỏ' | 'Vừa' | 'Lớn'>(() => {
    const emp = currentUser?.company?.employeeCount || 35;
    if (emp < 10) return 'Siêu nhỏ';
    if (emp <= 50) return 'Nhỏ';
    if (emp <= 200) return 'Vừa';
    return 'Lớn';
  });
  const [selectedLevel, setSelectedLevel] = useState<number>(currentResult?.level || defaultLevel);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeminiAdvisorResponse | null>(null);
  const [sendingLeadTech, setSendingLeadTech] = useState<string | null>(null);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string | null>(null);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const data = await getGeminiTechRecommendations({
        assessmentId: currentResult?.id,
        companyName: currentUser?.company?.companyName || currentResult?.companyName || 'Doanh nghiệp',
        mst: currentUser?.company?.mst,
        industry: selectedIndustry,
        employeeCount: currentUser?.company?.employeeCount || 35,
        companySize: selectedSize,
        totalScore: currentResult?.totalScore || 48,
        scaleMax: currentResult?.scaleMax || 100,
        percentageScore: currentResult?.percentageScore || 48,
        currentDbiLevel: selectedLevel,
        levelTitle: currentResult?.levelTitle || 'Bắt đầu kết nối',
        pillarScores: currentResult?.pillarScores,
        diagnosedGaps: currentResult?.gaps || [],
        budgetRange: investmentPrefs.budgetText || '50 - 200 triệu VND',
        timeline: investmentPrefs.timeline || 'Năm 2026'
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdvice();
    }
  }, [isOpen, selectedIndustry, selectedSize, selectedLevel]);

  if (!isOpen) return null;

  const handleQuickLead = (item: RecommendedTechSolution) => {
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập tài khoản doanh nghiệp để gửi yêu cầu kết nối với "${item.techName}".`);
      onClose();
      navigate('/login');
      return;
    }
    setSendingLeadTech(item.techName);
    createLead({
      listingId: `GEMINI-${Date.now()}`,
      techName: item.techName,
      vendorName: item.vendorName,
      buyerName: currentUser.company.companyName,
      buyerMst: currentUser.company.mst,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      buyerDbiLevel: selectedLevel,
      buyerDbiScore: selectedLevel * 20,
      notes: `Yêu cầu báo giá chính thức cho giải pháp ${item.techName} (Đơn giá tham chiếu: ${item.suggestedPrice}).`,
      budgetRange: item.suggestedPrice,
      timeline: 'Ngay trong quý này'
    });

    setTimeout(() => {
      setSendingLeadTech(null);
      setLeadSuccessMsg(`Đã tạo yêu cầu báo giá cho "${item.techName}" tới đối tác ${item.vendorName}!`);
      setTimeout(() => setLeadSuccessMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Gemini 2.5 AI Solution Engine
              </span>
              <span className="text-xs text-teal-300 font-medium">Huấn luyện dữ liệu 25 ngành</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Cố Vấn Giải Pháp Công Nghệ Số Chuẩn Xác
            </h2>
            <p className="text-xs text-slate-300 font-normal">
              Khớp nối danh mục công nghệ chuẩn ngành, đối soát bảng giá tham chiếu & mô hình chi phí chuẩn mực.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Success Notification */}
        {leadSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-6 flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{leadSuccessMsg}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/interests');
              }}
              className="text-teal-700 underline font-bold hover:text-teal-900 cursor-pointer"
            >
              Xem trong Hộp thư Trao đổi
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              1. Ngành nghề kinh doanh
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {AVAILABLE_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Phân khúc quy mô
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['Siêu nhỏ', 'Nhỏ', 'Vừa', 'Lớn'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              3. Mức DBI hiện tại
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Mức {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-xs font-semibold">Gemini AI đang tổng hợp và khớp nối giải pháp chuẩn xác...</p>
            </div>
          ) : result ? (
            <>
              {/* Strategic Summary Box */}
              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 text-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Định hướng Chiến lược từ Gemini AI</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {result.summary}
                </p>
                
                {/* 3-Step Action Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {result.strategicRoadmap.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-teal-100 shadow-2xs text-xs space-y-1">
                      <span className="font-bold text-teal-700 block text-[11px] uppercase tracking-wider">
                        Bước {idx + 1}
                      </span>
                      <p className="text-slate-600 font-normal leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Governance Notice Badge */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Nguyên tắc Thẩm định & Chuẩn hóa Đơn giá:</span>
                  <p className="text-amber-800 leading-relaxed font-normal">{result.pricingGovernanceNotice}</p>
                </div>
              </div>

              {/* Solutions Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Danh mục Giải pháp Công nghệ Được Khớp nối ({result.recommendedSolutions.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Ngành: <strong className="text-slate-800">{selectedIndustry}</strong> • Quy mô: <strong className="text-slate-800">{selectedSize}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendedSolutions.map((sol, index) => {
                    const isHigh = sol.priority === 'CAO';
                    return (
                      <div
                        key={index}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                          isHigh 
                            ? 'bg-white border-teal-300 shadow-sm hover:border-teal-500' 
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              isHigh 
                                ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              Ưu tiên {sol.priority}
                            </span>
                            <span className="text-[11px] font-bold text-slate-600">
                              {sol.dbiLevel}
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {sol.techName}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>Nhà cung ứng: <strong className="text-slate-800 font-bold">{sol.vendorName}</strong></span>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                            {sol.whyMatched}
                          </p>

                          <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200/80 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 text-[11px]">Đơn giá tham chiếu:</span>
                              <span className="font-extrabold text-teal-800 text-xs">{sol.suggestedPrice}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Mô hình:</span>
                              <span className="font-semibold text-slate-700">{sol.costModel}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 italic pt-0.5 border-t border-slate-200">
                              {sol.pricingRuleNote}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                            Đã chuẩn hóa
                          </span>

                          <button
                            onClick={() => handleQuickLead(sol)}
                            disabled={sendingLeadTech === sol.techName}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            <span>{sendingLeadTech === sol.techName ? 'Đang gửi...' : 'Nhận Báo Giá'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Dữ liệu giải pháp được cập nhật định kỳ để chuẩn hóa bài toán chuyển đổi số theo ngành.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
