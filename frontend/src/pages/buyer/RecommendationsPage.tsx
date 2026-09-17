import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  X, 
  Building2, 
  Star, 
  Send, 
  ArrowRight, 
  Scale, 
  Layers,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Info,
  ChevronRight,
  Tag,
  Coins,
  FileText,
  AlertCircle,
  HelpCircle,
  Clock,
  Briefcase,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { TechListing, PillarId } from '../../types';
import { 
  getGeminiTechRecommendations, 
  GeminiAdvisorResponse, 
  RecommendedTechSolution,
  HarvestedAssessmentInput 
} from '../../services/geminiTechAdvisorService';

interface InquiryItem {
  id: string;
  techName: string;
  vendorName: string;
  suggestedPrice?: string;
  pillarId?: string;
  isAiRecommended?: boolean;
}

export const RecommendationsPage: React.FC = () => {
  const { 
    techListings, 
    comparisonList, 
    toggleCompare, 
    createLead, 
    currentUser, 
    currentResult,
    navigate,
    investmentPrefs
  } = useApp();

  // Active view tab: AI Prescriptions (Default) vs All marketplace catalog
  const [activeTab, setActiveTab] = useState<'AI_RECOMMENDED' | 'ALL_CATALOG'>('AI_RECOMMENDED');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiAdvisorData, setAiAdvisorData] = useState<GeminiAdvisorResponse | null>(null);

  // Inquiry drawer state
  const [inquiryTarget, setInquiryTarget] = useState<InquiryItem | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [timelineChoice, setTimelineChoice] = useState(investmentPrefs.timeline || 'Quý 2/2026');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [successInquiryMsg, setSuccessInquiryMsg] = useState(false);
  
  // Quick lead notification
  const [quickLeadSuccess, setQuickLeadSuccess] = useState<string | null>(null);

  // AUTOMATED HARVESTING OF DBI ASSESSMENT DATA
  // No manual filters! AI extracts everything directly from the enterprise's DBI assessment and profile.
  const harvestedProfile: HarvestedAssessmentInput = useMemo(() => {
    const isLarge = currentResult.assessmentType === 'LARGE' || Boolean(investmentPrefs.isLargeEnterprise) || currentUser?.company?.size === 'LARGE';
    const scaleMax = currentResult.scaleMax || (isLarge ? 695 : 100);
    const totalScore = currentResult.totalScore || 0;
    const percentageScore = currentResult.percentageScore || Math.round((totalScore / scaleMax) * 100);
    const empCount = currentUser?.company?.employeeCount || 35;
    const sizeStr: 'Siêu nhỏ' | 'Nhỏ' | 'Vừa' | 'Lớn' = 
      isLarge ? 'Lớn' : empCount < 10 ? 'Siêu nhỏ' : empCount <= 50 ? 'Nhỏ' : empCount <= 200 ? 'Vừa' : 'Lớn';

    // Extract weakest pillars from assessment result
    let weakPillars: { pillarId: PillarId; pillarName: string; score: number }[] = [];
    if (currentResult.pillarScores) {
      const entries = Object.entries(currentResult.pillarScores) as [PillarId, number][];
      entries.sort((a, b) => a[1] - b[1]);
      weakPillars = entries.slice(0, 2).map(([pid, sc]) => {
        const meta = DBI_PILLARS.find(p => p.id === pid);
        return {
          pillarId: pid,
          pillarName: meta?.name || pid,
          score: Math.round(sc)
        };
      });
    }

    const industry = currentResult.industry || currentUser?.company?.industry || 'Bán lẻ';

    return {
      assessmentId: currentResult.id,
      companyName: currentUser?.company?.companyName || currentResult.companyName || 'Doanh nghiệp',
      mst: currentUser?.company?.mst || 'Chưa cập nhật',
      industry,
      industrySector: investmentPrefs.industrySector || industry,
      isLargeEnterprise: isLarge,
      employeeCount: empCount,
      companySize: sizeStr,
      enterpriseType: (isLarge ? 'LARGE' : 'SME') as 'SME' | 'LARGE',
      totalScore,
      scaleMax,
      percentageScore,
      currentDbiLevel: currentResult.level || 2,
      levelTitle: currentResult.levelTitle || (currentResult.level === 1 ? 'Khởi động' : currentResult.level === 2 ? 'Bắt đầu kết nối' : 'Đang số hóa'),
      pillarScores: currentResult.pillarScores,
      weakestPillars: weakPillars,
      diagnosedGaps: currentResult.gaps || [],
      budgetRange: investmentPrefs.budgetText || (isLarge ? '2 - 5 tỷ VND' : '100 - 300 triệu VND'),
      timeline: investmentPrefs.timeline || 'Quý 2/2026'
    };
  }, [currentResult, currentUser, investmentPrefs]);

  // Fetch AI Tech recommendations automatically based on the harvested assessment
  const loadAiRecommendations = async () => {
    setIsAiLoading(true);
    try {
      const data = await getGeminiTechRecommendations(harvestedProfile);
      setAiAdvisorData(data);
    } catch (err) {
      console.error('Failed to load AI recommendations:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    loadAiRecommendations();
  }, [harvestedProfile.assessmentId, harvestedProfile.totalScore, harvestedProfile.currentDbiLevel]);

  // Group AI solutions by diagnostic objective without requiring manual filters
  const groupedAiSolutions = useMemo(() => {
    if (!aiAdvisorData?.recommendedSolutions) {
      return { criticalGaps: [], nextLevelUpgrades: [], industryStandards: [] };
    }

    const all = aiAdvisorData.recommendedSolutions.filter((sol) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (sol.techName + sol.vendorName + sol.whyMatched + sol.costModel + sol.diagnosticEvidence).toLowerCase();
        return matchText.includes(q);
      }
      return true;
    });

    const criticalGaps = all.filter(s => s.targetObjective === 'KHAC_PHUC_DIEM_NGHEN');
    const nextLevelUpgrades = all.filter(s => s.targetObjective === 'NANG_CAP_DBI');
    const industryStandards = all.filter(s => s.targetObjective === 'CHUAN_HOA_NGANH');

    return { criticalGaps, nextLevelUpgrades, industryStandards };
  }, [aiAdvisorData, searchQuery]);

  // Filtered Marketplace Listings for optional catalog view
  const filteredMarketplaceListings = useMemo(() => {
    return techListings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (item.techName + item.summary + item.vendorName + item.id_tech).toLowerCase();
        if (!matchText.includes(q)) return false;
      }
      return true;
    });
  }, [techListings, searchQuery]);

  // Open inquiry drawer
  const handleOpenInquiry = (item: InquiryItem) => {
    setInquiryTarget(item);
    setInquiryNotes(
      `Kính gửi ${item.vendorName}, doanh nghiệp chúng tôi (${harvestedProfile.companyName}) đã hoàn thành đánh giá Chỉ số DBI (Đạt ${harvestedProfile.totalScore}/${harvestedProfile.scaleMax}đ - Cấp độ ${harvestedProfile.currentDbiLevel}). Qua hệ thống chẩn đoán tự động, chúng tôi có nhu cầu nhận báo giá và triển khai giải pháp "${item.techName}" cho quy mô ${harvestedProfile.employeeCount} nhân sự.`
    );
    setSuccessInquiryMsg(false);
  };

  // Submit inquiry drawer form
  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryTarget) return;

    setSubmittingInquiry(true);
    createLead({
      listingId: inquiryTarget.id,
      techName: inquiryTarget.techName,
      vendorName: inquiryTarget.vendorName,
      buyerName: harvestedProfile.companyName,
      buyerMst: harvestedProfile.mst,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      buyerDbiLevel: harvestedProfile.currentDbiLevel,
      buyerDbiScore: harvestedProfile.totalScore,
      notes: inquiryNotes,
      budgetRange: inquiryTarget.suggestedPrice || investmentPrefs.budgetText || '100 - 300 triệu VND',
      timeline: timelineChoice
    });

    setSubmittingInquiry(false);
    setSuccessInquiryMsg(true);

    setTimeout(() => {
      setInquiryTarget(null);
      setSuccessInquiryMsg(false);
      navigate('/interests');
    }, 1200);
  };

  // Direct 1-Click Lead from AI Card
  const handleQuickLead = (sol: RecommendedTechSolution) => {
    createLead({
      listingId: `AI-${Date.now()}`,
      techName: sol.techName,
      vendorName: sol.vendorName,
      buyerName: harvestedProfile.companyName,
      buyerMst: harvestedProfile.mst,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      buyerDbiLevel: harvestedProfile.currentDbiLevel,
      buyerDbiScore: harvestedProfile.totalScore,
      notes: `[Tự động từ Bài đánh giá DBI]: Yêu cầu báo giá giải pháp "${sol.techName}". Điểm nghẽn cần tháo gỡ: ${sol.diagnosticEvidence}.`,
      budgetRange: sol.suggestedPrice,
      timeline: investmentPrefs.timeline || 'Ngay trong quý này'
    });

    setQuickLeadSuccess(`Đã tạo yêu cầu báo giá cho "${sol.techName}" tới ${sol.vendorName}!`);
    setTimeout(() => setQuickLeadSuccess(null), 4000);
  };

  const isLarge = harvestedProfile.enterpriseType === 'LARGE';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Quick Lead Success Toast */}
      {quickLeadSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{quickLeadSuccess}</span>
          </div>
          <button
            onClick={() => navigate('/interests')}
            className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black text-xs transition-colors cursor-pointer"
          >
            Mở Hộp thư Trao đổi &rarr;
          </button>
        </div>
      )}

      {/* TOP BANNER: Automated Assessment Harvesting Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-900/50">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400 text-slate-950 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                AI Tự Động Thu Thập Từ Bài Đánh Giá DBI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-200 border border-teal-400/30">
                Mã khảo sát: {harvestedProfile.assessmentId || 'DBI-ACTIVE'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Giải Pháp Công Nghệ Số Hóa Được Kê Đơn Tự Động
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Hệ thống AI tự động thu thập và bóc tách dữ liệu từ bài đánh giá DBI của <strong className="text-white font-bold">{harvestedProfile.companyName}</strong>. 
              Toàn bộ giải pháp bên dưới được kê đơn trực tiếp theo hiện trạng điểm nghẽn và mục tiêu thăng hạng — <strong>không cần thiết lập bộ lọc thủ công</strong>.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {comparisonList.length > 0 && (
              <button
                onClick={() => navigate('/tech/compare')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Scale className="w-4 h-4" />
                <span>So sánh ({comparisonList.length}/3)</span>
              </button>
            )}

            <button
              onClick={() => navigate('/assessment/active/result')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Xem Bảng Điểm DBI</span>
            </button>

            <button
              onClick={loadAiRecommendations}
              disabled={isAiLoading}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'AI Đang Kê Đơn...' : 'Làm Mới Phân Tích'}</span>
            </button>
          </div>
        </div>

        {/* 4 BENTO CARDS: HARVESTED ASSESSMENT DOSSIER */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Enterprise Profile */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
            <div className="flex items-center justify-between text-teal-300 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Hồ sơ Doanh nghiệp
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                isLarge ? 'bg-indigo-400/30 text-indigo-200 border border-indigo-400/30' : 'bg-teal-400/20 text-teal-200'
              }`}>
                {isLarge ? 'Doanh nghiệp Lớn' : harvestedProfile.companySize}
              </span>
            </div>
            <div className="text-sm font-extrabold text-white truncate">
              {harvestedProfile.companyName}
            </div>
            <div className="text-[11px] text-slate-300 flex flex-col gap-0.5">
              <span className="truncate">Ngành: <strong className="text-teal-200">{harvestedProfile.industrySector || harvestedProfile.industry}</strong></span>
              <span>{harvestedProfile.employeeCount} nhân sự • MST: {harvestedProfile.mst}</span>
            </div>
          </div>

          {/* Card 2: DBI Assessment Score & Level */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
            <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                Chỉ số DBI Khảo sát
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-200">
                {isLarge ? 'Thang 695đ' : 'Thang 100đ'}
              </span>
            </div>
            <div className="text-sm font-extrabold text-white flex items-baseline gap-2">
              <span className="text-lg text-amber-400 font-black">{harvestedProfile.totalScore}/{harvestedProfile.scaleMax}</span>
              <span className="text-xs text-slate-300">({harvestedProfile.percentageScore}%)</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Cấp độ: <strong className="text-amber-200">Mức {harvestedProfile.currentDbiLevel} ({harvestedProfile.levelTitle})</strong>
            </div>
          </div>

          {/* Card 3: Weakest Pillars / Diagnosed Bottlenecks */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
            <div className="flex items-center justify-between text-rose-300 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Điểm nghẽn Cốt lõi Phát hiện
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-400/20 text-rose-200">
                Cần gỡ ngay
              </span>
            </div>
            <div className="text-xs font-bold text-white line-clamp-1">
              {harvestedProfile.weakestPillars.length > 0 
                ? harvestedProfile.weakestPillars.map(w => `${w.pillarName} (${w.score}%)`).join(', ')
                : 'Vận hành, An toàn thông tin'}
            </div>
            <div className="text-[11px] text-slate-300">
              Trụ cột có điểm số thấp nhất kìm hãm số hóa
            </div>
          </div>

          {/* Card 4: Investment Capacity & Timeline */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-1.5">
            <div className="flex items-center justify-between text-emerald-300 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Dự toán & Tiến độ
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                isLarge ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30' : 'bg-emerald-400/20 text-emerald-200'
              }`}>
                {isLarge ? 'Định mức Enterprise' : 'Khả thi 2026'}
              </span>
            </div>
            <div className="text-sm font-extrabold text-emerald-300 truncate">
              {harvestedProfile.budgetRange}
            </div>
            <div className="text-[11px] text-slate-300">
              Tiến độ: <strong className="text-white">{harvestedProfile.timeline}</strong>
            </div>
          </div>

        </div>

        {/* Link to retake assessment if buyer needs to update survey */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            AI đã xác nhận khớp nối tự động 100% với 25 câu hỏi khảo sát và phân loại ngành .
          </span>
          <button
            onClick={() => navigate('/assessment/new')}
            className="text-teal-300 hover:text-white underline cursor-pointer font-semibold"
          >
            Làm lại bài đánh giá DBI để AI cập nhật đề xuất mới &rarr;
          </button>
        </div>
      </div>

      {/* AI STRATEGIC DIAGNOSIS & ROADMAP ACCORDION */}
      {isAiLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">AI đang bóc tách kết quả khảo sát DBI và kê đơn giải pháp số...</p>
          <p className="text-xs text-slate-400">Đối chiếu chuẩn, điểm liệt từng trụ cột và thẩm định định mức chi phí.</p>
        </div>
      ) : aiAdvisorData ? (
        <div className="bg-white rounded-3xl border border-teal-100 p-6 sm:p-7 shadow-xs space-y-5">
          {/* Executive Strategy */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Bản Phân Tích Chẩn Đoán Chiến Lược (AI Gemini)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {aiAdvisorData.summary}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs md:max-w-md shrink-0 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-[11px] uppercase tracking-wider">Bộ Quy Tắc Quản Trị Chi Phí Minh Bạch:</span>
                <p className="text-amber-800 text-[11px] leading-relaxed font-normal">
                  {aiAdvisorData.pricingGovernanceNotice}
                </p>
              </div>
            </div>
          </div>

          {/* 3-Step Strategic Action Roadmap */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Lộ trình 3 Giai đoạn Tháo gỡ Điểm nghẽn & Thăng hạng DBI ({harvestedProfile.industry} • {harvestedProfile.companySize}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiAdvisorData.strategicRoadmap.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-teal-800 text-[11px] uppercase tracking-wider">
                      Giai đoạn {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {idx === 0 ? '0 - 3 tháng' : idx === 1 ? '3 - 6 tháng' : '6 - 12 tháng'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-normal leading-relaxed text-xs">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* VIEW SELECTOR & INSTANT SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('AI_RECOMMENDED')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'AI_RECOMMENDED'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Giải pháp Kê Đơn Tự Động ({aiAdvisorData?.recommendedSolutions.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_CATALOG')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'ALL_CATALOG'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Duyệt Toàn bộ Sàn ({techListings.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm theo tên công nghệ, nhà cung cấp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: AI PRESCRIBED SOLUTIONS GROUPED BY PROBLEM SOLVED */}
      {activeTab === 'AI_RECOMMENDED' && (
        <div className="space-y-10">

          {/* TRACK 1: CRITICAL GAP RESOLVERS (Điểm nghẽn Trọng yếu) */}
          {groupedAiSolutions.criticalGaps.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                        Cấp thiết • Điểm nghẽn Cốt lõi
                      </span>
                      <span className="text-xs text-rose-900 font-extrabold">
                        Giải quyết trực tiếp các trụ cột điểm thấp nhất trong bài đánh giá DBI
                      </span>
                    </div>
                    <p className="text-xs text-rose-700 mt-0.5">
                      Bài khảo sát ghi nhận các lỗ hổng tại trụ cột <strong>{harvestedProfile.weakestPillars.map(w => `${w.pillarName} (${w.score}%)`).join(', ') || 'Vận hành'}</strong>. 
                      Doanh nghiệp cần ưu tiên triển khai ngay để chặn nguy cơ đứt gãy quy trình.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-800 shrink-0 self-end sm:self-auto">
                  {groupedAiSolutions.criticalGaps.length} giải pháp chỉ định
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedAiSolutions.criticalGaps.map((sol, index) => renderTechCard(sol, `gap-${index}`))}
              </div>
            </div>
          )}

          {/* TRACK 2: NEXT LEVEL UPGRADES (Bứt phá Cấp độ) */}
          {groupedAiSolutions.nextLevelUpgrades.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                        Chiến lược • Bứt phá Cấp độ
                      </span>
                      <span className="text-xs text-emerald-900 font-extrabold">
                        Nâng hạng doanh nghiệp từ Cấp độ {harvestedProfile.currentDbiLevel} lên Cấp độ {Math.min(5, harvestedProfile.currentDbiLevel + 1)}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Đáp ứng các tiêu chí công nghệ nâng cao để sẵn sàng tái đánh giá nâng hạng trong kỳ tiếp theo.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-800 shrink-0 self-end sm:self-auto">
                  {groupedAiSolutions.nextLevelUpgrades.length} giải pháp chỉ định
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedAiSolutions.nextLevelUpgrades.map((sol, index) => renderTechCard(sol, `upgrade-${index}`))}
              </div>
            </div>
          )}

          {/* TRACK 3: INDUSTRY STANDARD TECH (Chuẩn hóa Ngành) */}
          {groupedAiSolutions.industryStandards.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                        Kiện toàn • Chuẩn hóa Ngành {harvestedProfile.industry}
                      </span>
                      <span className="text-xs text-indigo-900 font-extrabold">
                        Bù đắp danh mục công nghệ số bắt buộc theo 25 ngành kinh tế
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Chuẩn hóa các công cụ số vận hành chuyên sâu cho ngành <strong>{harvestedProfile.industry}</strong> giúp đồng bộ hóa dữ liệu toàn diện.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-800 shrink-0 self-end sm:self-auto">
                  {groupedAiSolutions.industryStandards.length} giải pháp chỉ định
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedAiSolutions.industryStandards.map((sol, index) => renderTechCard(sol, `industry-${index}`))}
              </div>
            </div>
          )}

          {/* Empty state when searching */}
          {groupedAiSolutions.criticalGaps.length === 0 && 
           groupedAiSolutions.nextLevelUpgrades.length === 0 && 
           groupedAiSolutions.industryStandards.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <p className="text-sm font-bold text-slate-700">Không tìm thấy giải pháp nào với từ khóa "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer"
              >
                Xóa từ khóa tìm kiếm
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: ALL MARKETPLACE LISTINGS */}
      {activeTab === 'ALL_CATALOG' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Hiển thị <strong className="text-slate-900 font-extrabold">{filteredMarketplaceListings.length}</strong> giải pháp công nghệ trên Sàn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketplaceListings.map((item) => {
              const isComparing = comparisonList.includes(item.id);
              const matchPercent = item.matchPercentage || 92;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail & Badges */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.techName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                        {item.id_tech}
                      </div>
                      <div className="absolute top-3 right-3 bg-teal-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Khớp {matchPercent}%</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/90 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-teal-600" />
                        <span>{item.vendorName}</span>
                      </div>
                    </div>

                    {/* Content info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Trụ cột: {item.pillarId}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{item.rating}</span>
                          <span className="text-slate-400 font-normal">({item.reviewCount})</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => navigate(`/tech/${item.id}`)}
                        className="text-base font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition-colors line-clamp-1"
                      >
                        {item.techName}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Pricing info */}
                      <div className="pt-1 text-xs">
                        <span className="text-slate-400 block text-[10px]">Khoảng giá tham chiếu:</span>
                        <span className="font-extrabold text-slate-900">
                          {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                        </span>
                        <span className="text-slate-400 text-[11px] block">{item.priceUnit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons & Compare Checkbox */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => toggleCompare(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>So sánh</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/tech/${item.id}`)}
                        className="text-xs font-bold text-slate-700 hover:text-teal-700 px-2 py-1.5"
                      >
                        Chi tiết
                      </button>

                      <button
                        onClick={() => handleOpenInquiry({
                          id: item.id,
                          techName: item.techName,
                          vendorName: item.vendorName,
                          suggestedPrice: `${item.priceMin.toLocaleString('vi-VN')} - ${item.priceMax.toLocaleString('vi-VN')} VND`,
                          pillarId: item.pillarId,
                          isAiRecommended: false
                        })}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Báo giá</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INQUIRY DRAWER MODAL */}
      {inquiryTarget && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                    Bày tỏ Quan tâm & Yêu cầu Báo giá
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    {inquiryTarget.techName}
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Nhà cung ứng: <strong className="text-slate-800">{inquiryTarget.vendorName}</strong></span>
                  </div>
                </div>
                <button
                  onClick={() => setInquiryTarget(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Assessment Context Card attached to lead */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-950">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Dữ liệu DBI Buyer đính kèm tự động tới Vendor:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-teal-900">
                  <div>Doanh nghiệp: <strong>{harvestedProfile.companyName}</strong></div>
                  <div>MST: <strong>{harvestedProfile.mst}</strong></div>
                  <div>Điểm DBI: <strong>{harvestedProfile.totalScore}/{harvestedProfile.scaleMax}đ (Cấp {harvestedProfile.currentDbiLevel})</strong></div>
                  <div>Quy mô: <strong>{harvestedProfile.employeeCount} nhân sự</strong></div>
                </div>
                <p className="text-[10px] text-teal-700 italic border-t border-teal-200/60 pt-1.5">
                  Vendor sẽ nhận đầy đủ chẩn đoán điểm nghẽn để thiết kế bảng chào giá và SLA chính xác nhất cho doanh nghiệp.
                </p>
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Thời gian dự kiến bắt đầu triển khai:
                  </label>
                  <select
                    value={timelineChoice}
                    onChange={(e) => setTimelineChoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-teal-600"
                  >
                    <option value="Ngay trong tháng này">Ngay trong tháng này (Cần gấp)</option>
                    <option value="Quý 2/2026">Quý 2/2026 (Theo kế hoạch)</option>
                    <option value="Quý 3/2026">Quý 3/2026</option>
                    <option value="Cuối năm 2026">Cuối năm 2026</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Nội dung yêu cầu khảo sát & báo giá:
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-teal-600 resize-none leading-relaxed"
                    placeholder="Mô tả cụ thể nhu cầu, số lượng người dùng..."
                  />
                </div>

                {successInquiryMsg ? (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đã gửi yêu cầu thành công! Đang chuyển đến Hộp thư...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingInquiry ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Báo Giá & Mở Phòng Chat B2B'}</span>
                  </button>
                )}
              </form>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-slate-100">
              Yêu cầu của bạn được bảo mật và chuyển tiếp trực tiếp đến ban điều hành nhà cung cấp.
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // HELPER FUNCTION: RENDER RICH TECH SOLUTION CARD
  function renderTechCard(sol: RecommendedTechSolution, key: string) {
    const isCritical = sol.targetObjective === 'KHAC_PHUC_DIEM_NGHEN';
    const isUpgrade = sol.targetObjective === 'NANG_CAP_DBI';
    
    return (
      <div
        key={key}
        className={`bg-white rounded-3xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group ${
          isCritical 
            ? 'border-rose-300 ring-1 ring-rose-100' 
            : isUpgrade
            ? 'border-emerald-300 ring-1 ring-emerald-100'
            : 'border-indigo-300 ring-1 ring-indigo-100'
        }`}
      >
        <div className="p-6 space-y-4">
          {/* Top Objective Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isCritical
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : isUpgrade
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
            }`}>
              {sol.targetObjectiveTitle}
            </span>
            <span className="text-[11px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {sol.dbiLevel}
            </span>
          </div>

          {/* Tech Name & Vendor */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
              Trụ cột: {sol.pillarId}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
              {sol.techName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Đối tác cung ứng: <strong className="text-slate-800 font-bold">{sol.vendorName}</strong></span>
            </div>
          </div>

          {/* DIAGNOSTIC EVIDENCE FROM ASSESSMENT */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
            isCritical 
              ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
              : isUpgrade 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Thu thập từ Khảo sát DBI Doanh nghiệp:
            </span>
            <p className="text-[11px] font-medium leading-relaxed">
              {sol.diagnosticEvidence}
            </p>
            <div className="pt-1 text-[10px] opacity-80 border-t border-current/15 flex items-center gap-1">
              <strong>Tác động DBI:</strong> {sol.expectedDbiImpact}
            </div>
          </div>

          {/* Pricing Benchmark Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Đơn giá tham chiếu:</span>
              <span className="font-black text-teal-900 text-xs">{sol.suggestedPrice}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Mô hình chi phí:</span>
              <span className="font-bold text-slate-700">{sol.costModel}</span>
            </div>
            <div className="text-[10px] text-slate-500 italic pt-1.5 border-t border-slate-200 leading-relaxed">
              💡 {sol.pricingRuleNote}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => handleOpenInquiry({
              id: `AI-${key}-${Date.now()}`,
              techName: sol.techName,
              vendorName: sol.vendorName,
              suggestedPrice: sol.suggestedPrice,
              pillarId: sol.pillarId,
              isAiRecommended: true
            })}
            className="text-xs font-bold text-slate-700 hover:text-teal-700 px-2 py-1.5 cursor-pointer"
          >
            Soạn yêu cầu
          </button>

          <button
            onClick={() => handleQuickLead(sol)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nhận Báo Giá</span>
          </button>
        </div>
      </div>
    );
  }
};
