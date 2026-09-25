import React, { useState } from 'react';
import { 
  QUESTIONS_DBI, 
  QUESTIONS_LDMI, 
  QUESTIONS_METRICS, 
  GroupCode, 
  BranchCode 
} from '../data/questions';
import { TEN_NHOM_NANG_LUC, TEN_NHANH, LDMI_CONFIG, DBI_CONFIG } from '../data/weights';
import { UserProfile, AssessmentRecord, storage } from '../lib/storage';
import { AssessmentRunner } from './AssessmentRunner';
import { 
  ClipboardCheck, 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Building2, 
  BarChart3, 
  Layers, 
  Sparkles, 
  RotateCcw, 
  Search, 
  Filter,
  Info,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  Award
} from 'lucide-react';

interface AssessmentViewProps {
  currentUser: UserProfile | null;
  latestAssessment?: AssessmentRecord;
  onRequireAuth: (reason: string) => void;
  onOpenQuickScan: () => void;
  onOpenGeminiDiagnosis?: () => void;
  onFinishAssessment: (assessmentId: string) => void;
  onViewResults: () => void;
  initialMode?: 'runner' | 'catalog' | 'methodology';
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  currentUser,
  latestAssessment,
  onRequireAuth,
  onOpenQuickScan,
  onOpenGeminiDiagnosis,
  onFinishAssessment,
  onViewResults,
  initialMode = 'runner'
}) => {
  // Navigation inside Assessment Page
  const [activeTab, setActiveTab] = useState<'runner' | 'catalog' | 'methodology'>(initialMode);
  
  // Is user actively doing the assessment in this view?
  const [isTakingAssessment, setIsTakingAssessment] = useState<boolean>(false);

  // Question Catalog Filter States
  const [catalogSection, setCatalogSection] = useState<'ldmi' | 'dbi' | 'metrics'>('ldmi');
  const [selectedGroup, setSelectedGroup] = useState<GroupCode | 'ALL'>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<BranchCode | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const ALL_GROUPS: GroupCode[] = ['VT', 'KB', 'GN', 'DH', 'HT', 'CT', 'CP', 'XA'];
  const ALL_BRANCHES: BranchCode[] = ['VT', 'FF', 'KB', '3PL', 'LM', 'KH'];

  // Filtered LDMI questions
  const filteredLdmiQuestions = QUESTIONS_LDMI.filter((q) => {
    if (selectedGroup !== 'ALL' && q.nhom_nang_luc !== selectedGroup) return false;
    if (selectedBranchFilter !== 'ALL' && !q.nhanh_ap_dung.includes(selectedBranchFilter)) return false;
    if (searchQuery.trim()) {
      const qText = `${q.ma} ${q.noi_dung} ${q.ten_nhom || ''}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  // Filtered DBI questions
  const filteredDbiQuestions = QUESTIONS_DBI.filter((q) => {
    if (searchQuery.trim()) {
      const qText = `${q.ma} ${q.noi_dung} ${q.tru_cot_dbi || ''}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  // Filtered Metrics
  const filteredMetrics = QUESTIONS_METRICS.filter((m) => {
    if (selectedBranchFilter !== 'ALL' && !m.nhanh.includes(selectedBranchFilter)) return false;
    if (searchQuery.trim()) {
      const qText = `${m.ma} ${m.ten} ${m.he_qua}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  // Handle start assessment action
  const handleStartAssessmentClick = () => {
    if (!currentUser) {
      onRequireAuth('Vui lòng đăng nhập hoặc đăng ký tài khoản Doanh nghiệp để làm bài Đánh giá đầy đủ (kết quả và báo cáo sẽ được lưu trữ an toàn trong tài khoản của bạn).');
    } else {
      setIsTakingAssessment(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Khung Đánh Giá Toàn Diện LDMI &amp; DBI · Phiên bản v3
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bài Đánh Giá Trưởng Thành Số Logistics
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Chẩn đoán chuyên sâu năng lực số cho doanh nghiệp vận tải, kho bãi, giao nhận quốc tế, 3PL và chặng cuối. Kết hợp Chỉ số Trưởng thành số (DBI) và Chỉ số Logistics (LDMI) với 8 nhóm năng lực cốt lõi.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Gemini AI Problem Diagnosis Button */}
            {onOpenGeminiDiagnosis && (
              <button
                onClick={onOpenGeminiDiagnosis}
                className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                title="Chẩn đoán vấn đề gặp phải bằng Gemini API"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Chẩn đoán AI (Gemini)
              </button>
            )}

            {/* Quick Scan link */}
            <button
              onClick={onOpenQuickScan}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              Quick Scan (2 phút)
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Assessment Page */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => { setActiveTab('runner'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'runner'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Làm bài đánh giá trực tuyến
          </button>

          <button
            onClick={() => { setActiveTab('catalog'); setIsTakingAssessment(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Khung câu hỏi LDMI &amp; DBI (24 câu)
          </button>

          <button
            onClick={() => { setActiveTab('methodology'); setIsTakingAssessment(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'methodology'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Phương pháp tính &amp; Quy tắc chặn
          </button>
        </div>
      </div>

      {/* ================= TAB 1: RUNNER / START ASSESSMENT ================= */}
      {activeTab === 'runner' && (
        <div className="space-y-6">
          {/* Active assessment in progress */}
          {isTakingAssessment && currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 text-xs">
                <span className="text-blue-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Đang trong phiên đánh giá của: <strong>{currentUser.companyName || currentUser.name}</strong>
                </span>
                <button
                  onClick={() => setIsTakingAssessment(false)}
                  className="text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  Tạm dừng bài đánh giá
                </button>
              </div>

              <AssessmentRunner
                currentUser={currentUser}
                onFinishAssessment={(id) => {
                  setIsTakingAssessment(false);
                  onFinishAssessment(id);
                }}
                onCancel={() => setIsTakingAssessment(false)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* If user is logged in AND already has a previous assessment */}
              {currentUser && latestAssessment && (
                <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã có kết quả đánh giá gần nhất
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        Hồ sơ trưởng thành số: {latestAssessment.companyName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Đánh giá ngày: {new Date(latestAssessment.createdAt).toLocaleDateString('vi-VN')} · Nhánh {latestAssessment.branch} ({TEN_NHANH[latestAssessment.branch]})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {onOpenGeminiDiagnosis && (
                        <button
                          onClick={onOpenGeminiDiagnosis}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          title="Chẩn đoán vấn đề gặp phải bằng Gemini API"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          Chẩn đoán vấn đề (AI)
                        </button>
                      )}
                      <button
                        onClick={onViewResults}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Xem Báo cáo kết quả
                      </button>
                      <button
                        onClick={() => setIsTakingAssessment(true)}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Làm bài mới
                      </button>
                    </div>
                  </div>

                  {/* Summary badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Chỉ số DBI</span>
                      <span className="text-lg font-extrabold text-blue-700">{latestAssessment.dbiResult.diem}đ</span>
                      <span className="text-[11px] text-blue-600 font-semibold block">{latestAssessment.dbiResult.muc_ten}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Chỉ số LDMI</span>
                      <span className="text-lg font-extrabold text-emerald-700">{latestAssessment.ldmiResult.diem}đ</span>
                      <span className="text-[11px] text-emerald-600 font-semibold block">Mức {latestAssessment.ldmiResult.muc} ({latestAssessment.ldmiResult.muc_ten})</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Quy mô DN</span>
                      <span className="text-sm font-bold text-slate-800 mt-1 block">{latestAssessment.scale.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400">Nghị định 80</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Khoảng trống then chốt</span>
                      <span className="text-sm font-bold text-amber-700 mt-1 block">{latestAssessment.topGaps.length} điểm nghẽn</span>
                      <span className="text-[10px] text-slate-400">Đã gắn giải pháp</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment Intro & Preparation Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4" />
                    Cấu trúc 5 phần bài đánh giá chuẩn
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Sẵn sàng chẩn đoán toàn diện doanh nghiệp của bạn
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Khảo sát kéo dài khoảng <strong>10 đến 12 phút</strong>. Toàn bộ câu hỏi được thiết kế theo đúng bài toán thực tế của các doanh nghiệp logistics Việt Nam, không hỏi chung chung lý thuyết.
                  </p>
                </div>

                {/* 5 Stages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Hồ sơ quy mô (C01–C06)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Lao động, doanh thu, nguồn vốn, tự động xác định quy mô theo Nghị định 80 và lọc nhánh chuyên ngành.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Chỉ số DBI (12 câu)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Đo 6 trụ cột doanh nghiệp: Khách hàng, Chiến lược, Công nghệ, Vận hành, Văn hóa, Dữ liệu bằng thuật toán TOPSIS.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Logistics LDMI (24 câu)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      8 nhóm năng lực chuyên ngành (VT, KB, GN, DH, HT, CT, CP, XA), tính theo trọng số ma trận và áp dụng điều kiện chặn R06.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">13 Chỉ số mốc (K01–K13)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Thiết lập mốc đo lường trước triển khai (km rỗng, độ chính xác kho, OTIF...). Không đo sẽ nhân 1.1 khoảng trống (R07).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                      5
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">Ưu tiên &amp; Ngân sách (P01–P07)</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Mục tiêu 6 tháng, ngân sách 12 tháng, mức sẵn sàng nhân sự và hệ sinh thái phần mềm để ghép nối giải pháp 7 thành phần.
                    </p>
                  </div>
                </div>

                {/* Primary CTA with Guest Interceptor */}
                <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      Cam kết bảo mật dữ liệu doanh nghiệp
                    </div>
                    <p className="text-xs text-blue-100">
                      Kết quả của bạn được lưu an toàn, báo cáo xuất bản không chia sẻ cho bên thứ ba trừ khi bạn yêu cầu báo giá.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={handleStartAssessmentClick}
                      className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <ClipboardCheck className="w-4 h-4 text-blue-700" />
                      {currentUser ? 'Bắt đầu làm bài đánh giá ngay' : 'Đăng nhập để bắt đầu bài đánh giá'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Quick Scan Notice for Guests */}
                {!currentUser && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        Nếu bạn là khách vãng lai và chỉ muốn thử nghiệm nhanh 2 phút mà không cần đăng nhập:
                      </span>
                    </div>
                    <button
                      onClick={onOpenQuickScan}
                      className="px-4 py-2 font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs whitespace-nowrap"
                    >
                      Làm Quick Scan (2 phút)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: QUESTION & COMPETENCY CATALOG (LDMI, DBI, METRICS) ================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cấu Trúc Khung Đánh Giá &amp; Bộ Câu Hỏi
                </h3>
                <p className="text-xs text-slate-500">
                  Tra cứu chi tiết toàn bộ các tiêu chí, thang 5 mức phát triển và điều kiện chặn nghiệp vụ
                </p>
              </div>

              {/* Section Selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setCatalogSection('ldmi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    catalogSection === 'ldmi' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  LDMI Chuyên ngành (24 câu)
                </button>
                <button
                  onClick={() => setCatalogSection('dbi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    catalogSection === 'dbi' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  DBI Quốc gia (12 câu)
                </button>
                <button
                  onClick={() => setCatalogSection('metrics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    catalogSection === 'metrics' ? 'bg-white text-purple-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  13 Chỉ số Logistics (K01–K13)
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi, từ khóa, mã câu (VT1, WMS, ePOD, TMS, OTIF...)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Branch filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Lọc theo nhánh:</span>
                <select
                  value={selectedBranchFilter}
                  onChange={(e) => setSelectedBranchFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">Tất cả các nhánh (6 nhánh)</option>
                  {ALL_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b} - {TEN_NHANH[b]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* If in LDMI section: Group Selector Pills */}
            {catalogSection === 'ldmi' && (
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>8 Nhóm năng lực logistics:</span>
                  <span className="text-[11px] text-amber-700 font-normal">
                    ⚠️ Nhóm HT &amp; CP có áp dụng điều kiện chặn Gatekeeper R06
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedGroup('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedGroup === 'ALL'
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả (24 câu)
                  </button>
                  {ALL_GROUPS.map((g) => {
                    const isGatekeeper = g === 'HT' || g === 'CP';
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedGroup(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                          selectedGroup === g
                            ? 'bg-emerald-700 text-white font-bold shadow-xs'
                            : isGatekeeper
                            ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{g} - {TEN_NHOM_NANG_LUC[g]}</span>
                        {isGatekeeper && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* QUESTIONS LISTING */}
          {/* SECTION 1: LDMI QUESTIONS */}
          {catalogSection === 'ldmi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hiển thị {filteredLdmiQuestions.length} câu hỏi LDMI
                </span>
                <span className="text-xs text-slate-400">
                  Thang điểm: 5 mức phát triển (Thủ công → Thông minh)
                </span>
              </div>

              {filteredLdmiQuestions.map((q) => {
                const isExpanded = expandedQuestionId === q.ma;
                const isGatekeeper = q.nhom_nang_luc === 'HT' || q.nhom_nang_luc === 'CP';

                return (
                  <div
                    key={q.ma}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      isGatekeeper ? 'border-amber-200 hover:border-amber-400' : 'border-slate-200 hover:border-slate-300'
                    } shadow-xs space-y-4`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-emerald-100 text-emerald-800">
                          {q.ma}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          Nhóm {q.nhom_nang_luc}: {TEN_NHOM_NANG_LUC[q.nhom_nang_luc!]}
                        </span>
                        {isGatekeeper && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            Điều kiện chặn R06
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Áp dụng nhánh: <strong>{q.nhanh_ap_dung.join(', ')}</strong></span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.noi_dung}
                      </h4>
                      {q.y_nghia && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          Ý nghĩa quản trị: {q.y_nghia}
                        </p>
                      )}
                      {q.dieu_kien_chan && (
                        <p className="text-xs text-amber-800 mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                          ⚠️ {q.dieu_kien_chan}
                        </p>
                      )}
                    </div>

                    {/* 5 Levels display */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        5 Mức độ trưởng thành:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {q.phuong_an?.map((opt) => (
                          <div
                            key={opt.muc}
                            className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                              opt.muc === 1
                                ? 'bg-slate-50 border-slate-200 text-slate-700'
                                : opt.muc === 2
                                ? 'bg-blue-50/50 border-blue-100 text-slate-800'
                                : opt.muc === 3
                                ? 'bg-emerald-50/50 border-emerald-100 text-slate-800'
                                : opt.muc === 4
                                ? 'bg-purple-50/50 border-purple-100 text-slate-800'
                                : 'bg-amber-50/50 border-amber-200 text-slate-900 font-medium'
                            }`}
                          >
                            <span className="font-bold text-[11px] block">
                              Mức {opt.muc}
                            </span>
                            <p className="text-[11px] leading-relaxed">
                              {opt.noi_dung.replace(/^[0-9]\.\s*/, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                      <span>Mã khoảng trống ánh xạ: <strong className="text-slate-600">{q.ma_khoang_trong}</strong></span>
                      <span>Mã câu: {q.ma} · Thứ tự: #{q.thu_tu}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 2: DBI QUESTIONS */}
          {catalogSection === 'dbi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  12 Câu hỏi DBI (Chỉ số Trưởng thành Số · TOPSIS)
                </span>
                <span className="text-xs text-blue-600 font-semibold">
                  6 Trụ cột: Khách hàng, Chiến lược, Công nghệ, Vận hành, Văn hóa, Dữ liệu
                </span>
              </div>

              {filteredDbiQuestions.map((q) => (
                <div key={q.ma} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-blue-100 text-blue-800">
                        {q.ma}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        Trụ cột: {q.tru_cot_dbi?.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">Áp dụng: Mọi nhánh</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.noi_dung}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
                    {q.phuong_an?.map((opt) => (
                      <div key={opt.muc} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <span className="font-bold text-[11px] text-blue-800 block">Mức {opt.muc}</span>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {opt.noi_dung.replace(/^[0-9]\.\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 3: 13 LOGISTICS METRICS */}
          {catalogSection === 'metrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  13 Chỉ số logistics mốc (K01–K13)
                </span>
                <span className="text-xs text-purple-700 font-semibold">
                  Hệ số 1.1 khoảng trống nếu "Không đo" (R07)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMetrics.map((m) => (
                  <div key={m.ma} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold font-mono bg-purple-100 text-purple-800">
                        {m.ma}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Đơn vị: <strong className="text-slate-800">{m.don_vi}</strong> · Nhóm {m.nhom}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {m.ten}
                    </h4>

                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                      <span className="font-bold text-purple-900 block">Hệ quả vận hành nếu không kiểm soát:</span>
                      <p className="text-slate-700 leading-relaxed">{m.he_qua}</p>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Áp dụng nhánh: <strong>{m.nhanh.join(', ')}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: METHODOLOGY & GATEKEEPER RULES ================= */}
      {activeTab === 'methodology' && (
        <div className="space-y-8">
          
          {/* Section 1: Dual-layer Architecture */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Lớp 1: Chỉ số Trưởng thành Số Doanh nghiệp (DBI) theo TOPSIS
                </h3>
                <p className="text-xs text-slate-500">
                  Khung đánh giá: Bộ chỉ số đánh giá mức độ trưởng thành số doanh nghiệp (DBI)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Đo lường 6 trụ cột chuyển đổi số cốt lõi: <em>Khách hàng, Chiến lược, Công nghệ, Vận hành, Văn hóa và Dữ liệu</em> (mỗi trụ cột 2 câu hỏi, thang 5 mức). Điểm số tổng hợp được tính bằng thuật toán <strong>TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</strong>:
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl font-mono text-xs text-slate-800 space-y-2 border border-slate-200">
              <div>• D+ = Khoảng cách Euclid tới giải pháp lý tưởng dương A+ (mọi câu đạt mức 5 = 100đ)</div>
              <div>• D- = Khoảng cách Euclid tới giải pháp lý tưởng âm A- (mọi câu mức 1 = 0đ)</div>
              <div className="font-bold text-blue-800 pt-1">
                Hệ số gần gũi Ci = D- / (D+ + D-)  →  Điểm DBI = Ci × 100
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 border rounded-xl">
                <span className="font-bold block text-slate-700">Khởi động</span>
                <span className="text-[10px] text-slate-400">&lt; 25 điểm</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold block">Bắt đầu</span>
                <span className="text-[10px]">25 đến &lt; 50đ</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <span className="font-bold block">Hình thành</span>
                <span className="text-[10px]">50 đến &lt; 75đ</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <span className="font-bold block">Nâng cao</span>
                <span className="text-[10px]">75 đến &lt; 95đ</span>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
                <span className="font-bold block">Dẫn dắt</span>
                <span className="text-[10px]">≥ 95 điểm</span>
              </div>
            </div>
          </div>

          {/* Section 2: LDMI & Gatekeeper Conditions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-base">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Lớp 2: Chỉ số Trưởng thành Logistics (LDMI) &amp; Điều kiện Chặn (R06)
                </h3>
                <p className="text-xs text-slate-500">
                  8 nhóm năng lực chuyên sâu phân theo 6 nhánh hoạt động thực tế
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Điểm LDMI được tính theo trung bình có trọng số của các nhóm năng lực được hỏi dựa trên ma trận hệ số quan trọng Nhóm × Nhánh (Sheet 8_HeSo):
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-mono font-bold text-center">
              Điểm LDMI = Σ(Điểm nhóm năng lực × Hệ số quan trọng) / Σ Hệ số quan trọng
            </div>

            <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Quy tắc Điều kiện Chặn (Gatekeeper Rules - R06):
              </div>
              <p className="text-slate-700 leading-relaxed">
                Để ngăn chặn tình trạng "nhảy cóc" hình thức khi chưa vững năng lực nền tảng, doanh nghiệp muốn đạt mức trưởng thành cao bắt buộc phải đáp ứng:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Lên Mức 3 (Tích hợp)</span>
                  <p className="text-slate-600 text-[11px]">
                    Nhóm Hiển thị &amp; Tích hợp (HT) phải đạt từ <strong>50 điểm trở lên</strong>.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Lên Mức 4 (Hiển thị)</span>
                  <p className="text-slate-600 text-[11px]">
                    Nhóm Hiển thị &amp; Tích hợp (HT) phải đạt từ <strong>65 điểm trở lên</strong>.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Lên Mức 5 (Thông minh)</span>
                  <p className="text-slate-600 text-[11px]">
                    Nhóm Chi phí &amp; Hiệu suất (CP) phải đạt từ <strong>75 điểm trở lên</strong>.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-amber-900 font-semibold pt-1">
                → Nếu điểm trung bình đạt mức cao nhưng vi phạm điều kiện chặn, hệ thống sẽ tự động hạ mức đánh giá tương ứng cho đến khi thỏa mãn điều kiện nền tảng (R06).
              </p>
            </div>
          </div>

          {/* Section 3: Gaps and 7-Component Matching */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-base">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Xác định Khoảng trống (R07) &amp; Ghép nối 7 Thành phần (R08, R09)
                </h3>
                <p className="text-xs text-slate-500">
                  Thuật toán minh bạch không thiên vị nhà tài trợ, loại bỏ cơ chế "bán thứ hạng"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-sm">Độ lớn khoảng trống (R07):</strong>
                <div className="p-2.5 bg-white rounded-xl border font-mono text-[11px] text-purple-900 font-bold">
                  Độ lớn = (100 − Điểm nhóm) × Hệ số nhánh × (1.1 nếu có chỉ số "Không đo")
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Tự động chọn ra 3 nhóm có độ lớn khoảng trống cao nhất. Trong mỗi nhóm, hệ thống xác định khoảng trống cụ thể dựa trên câu hỏi có điểm số thấp nhất.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-sm">Trọng số ghép nối 7 thành phần (R08):</strong>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  <li>• Khớp khoảng trống nghiệp vụ: <strong>30%</strong></li>
                  <li>• Khớp ưu tiên mục tiêu: <strong>15%</strong></li>
                  <li>• Khớp loại hình &amp; quy mô: <strong>15%</strong></li>
                  <li>• Khớp khung ngân sách: <strong>15%</strong></li>
                  <li>• Mức sẵn sàng nhân sự &amp; dữ liệu: <strong>10%</strong></li>
                  <li>• Khớp hệ sinh thái phần mềm hiện có: <strong>10%</strong></li>
                  <li>• Kết quả đã kiểm chứng thực tế: <strong>5%</strong></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
