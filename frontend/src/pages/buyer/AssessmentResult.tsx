import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RadarChart 
} from '../../components/common/RadarChart';
import { 
  HeatmapChart 
} from '../../components/common/HeatmapChart';
import { 
  ScoreGauge 
} from '../../components/common/ScoreGauge';
import { 
  Download, 
  Printer, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Building2, 
  Building,
  Layers,
  ChevronRight,
  Share2,
  Scale,
  Award,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DBI_PILLARS } from '../../data/mockData';
import { 
  DBI_LEVELS_SME, 
  DBI_LEVELS_LARGE, 
  LARGE_PILLAR_MAX, 
  SME_PILLAR_MAX, 
  LEGAL_FRAMEWORK 
} from '../../data/assessmentData';
import { DbiCapabilityDossierModal } from '../../components/common/DbiCapabilityDossierModal';
import { GeminiTechAdvisorModal } from '../../components/common/GeminiTechAdvisorModal';

export const AssessmentResult: React.FC = () => {
  const { currentResult, currentUser, navigate } = useApp();
  const [viewTab, setViewTab] = useState<'RADAR' | 'HEATMAP'>('RADAR');
  const [isExporting, setIsExporting] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  const isLarge = currentResult.assessmentType === 'LARGE';
  const scaleMax = currentResult.scaleMax || (isLarge ? 695 : 100);
  const levelsList = isLarge ? DBI_LEVELS_LARGE : DBI_LEVELS_SME;
  const levelMeta = levelsList.find(l => l.level === currentResult.level) || levelsList[0];
  const pillarMaxMap = isLarge ? LARGE_PILLAR_MAX : SME_PILLAR_MAX;

  const handleExportPDF = () => {
    setIsDossierModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:space-y-4">
      {/* Top Legal Framework Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white shadow-xs border border-teal-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/30 text-teal-200 border border-teal-400/30 uppercase tracking-wide">
                  Căn cứ Pháp lý Chính thức
                </span>
                <span className="text-xs text-slate-300 font-medium">Bộ trưởng Bộ Khoa học và Công nghệ</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {currentResult.legalBasis || `${LEGAL_FRAMEWORK.title} (${LEGAL_FRAMEWORK.decisionNumber})`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              isLarge 
                ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40' 
                : 'bg-teal-500/20 text-teal-200 border-teal-400/40'
            }`}>
              {isLarge ? 'Phụ lục II: Doanh nghiệp Lớn (Thang 695đ)' : 'Phụ lục I: SME (Thang 100đ)'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Banner & Export Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:shadow-none">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <span>Báo cáo Chỉ số DBI Quốc gia</span>
            <span>• Mã hồ sơ: {currentResult.id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Kết quả Đánh giá Mức độ Chuyển đổi số Doanh nghiệp
          </h1>
          <p className="text-xs text-slate-500">
            Doanh nghiệp: <strong>{currentUser.company.companyName}</strong> • Ngành: {currentUser.company.industry} • Ngày đánh giá: {currentResult.date}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            onClick={() => setIsDossierModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất Hồ sơ Năng lực (PDF)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/40 text-teal-100 uppercase">
            </span>
          </button>

          <button
            onClick={() => navigate('/assessment/active/investment')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Khảo sát Đầu tư</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards: Total Score + Level Badge + Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Score Gauge & Level */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {isLarge ? <Building2 className="w-4 h-4 text-indigo-600" /> : <Building className="w-4 h-4 text-teal-600" />}
            <span>Điểm Đánh giá Tổng thể ({isLarge ? 'Thang 695đ' : 'Thang 100đ'})</span>
          </div>

          <ScoreGauge 
            score={currentResult.totalScore} 
            maxScore={scaleMax}
            levelTitle="" 
          />

          <div className="space-y-1">
            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-extrabold ${levelMeta.badgeColor}`}>
              MỨC {currentResult.level}: {levelMeta.title}
            </span>
            <div className="text-[11px] font-bold text-slate-500">
              Ngưỡng quy định: {levelMeta.minScore} đến {levelMeta.maxScore} điểm
            </div>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed pt-1 font-medium">
              {levelMeta.description}
            </p>
          </div>
        </div>

        {/* Card 2: AI Natural Language Summary */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <Sparkles className="w-4 h-4" />
              <span>Phân tích Độc quyền từ AI Engine theo Chuẩn Quyết định 1567</span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              Tổng quan Hiện trạng & Tiềm năng Bứt phá
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {currentResult.aiSummary}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span>Mức điểm chuẩn ngành so sánh:</span>
              <strong className="text-white text-sm">
                {currentResult.industryAvgTotal} / {scaleMax} điểm ({Math.round((currentResult.industryAvgTotal / scaleMax) * 100)}%)
              </strong>
            </div>
            <div className={`font-bold ${currentResult.totalScore >= currentResult.industryAvgTotal ? 'text-emerald-400' : 'text-amber-400'}`}>
              {currentResult.totalScore >= currentResult.industryAvgTotal
                ? `Cao hơn mức chuẩn ngành ${currentResult.totalScore - currentResult.industryAvgTotal} điểm`
                : `Thấp hơn mức chuẩn ngành ${currentResult.industryAvgTotal - currentResult.totalScore} điểm`}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pillar Breakdown Summary Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Chi tiết Điểm số 6 Trụ cột chuyển đổi số
            </h2>
            <p className="text-xs text-slate-500">
              Quy đổi chi tiết giữa điểm thô quy định theo và tỷ lệ phần trăm chuẩn hóa
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 self-start sm:self-center">
            {isLarge ? 'Phụ lục II (DNL)' : 'Phụ lục I (SME)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DBI_PILLARS.map((p) => {
            const normalizedScore = currentResult.pillarScores[p.id] || 0;
            const maxPoint = pillarMaxMap[p.id] || 100;
            const rawScore = currentResult.pillarRawScores 
              ? currentResult.pillarRawScores[p.id] 
              : Math.round((normalizedScore / 100) * maxPoint);

            return (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">{p.name}</span>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {normalizedScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${normalizedScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Điểm đạt: <strong className="text-slate-800">{rawScore}</strong> / {maxPoint} điểm</span>
                  <span>Chuẩn ngành: {Math.round((currentResult.industryAvgScores[p.id] / 100) * maxPoint)} đ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visualizations Section: Radar Chart vs. Heatmap */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Biểu đồ Phân tích Đa chiều 6 Trụ cột DBI
            </h2>
            <p className="text-xs text-slate-500">
              So sánh trực quan giữa điểm số thực tế của doanh nghiệp và mức chuẩn trung bình ngành (đã chuẩn hóa % 0-100)
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start print:hidden">
            <button
              onClick={() => setViewTab('RADAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'RADAR' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Biểu đồ Radar (Mạng nhện)
            </button>
            <button
              onClick={() => setViewTab('HEATMAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'HEATMAP' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bản đồ nhiệt (Heatmap)
            </button>
          </div>
        </div>

        {/* Chart View Content */}
        <div className="pt-2">
          {viewTab === 'RADAR' ? (
            <div className="flex justify-center py-4">
              <RadarChart 
                userScores={currentResult.pillarScores} 
                industryScores={currentResult.industryAvgScores} 
                size={380}
              />
            </div>
          ) : (
            <HeatmapChart 
              userScores={currentResult.pillarScores} 
              industryScores={currentResult.industryAvgScores} 
            />
          )}
        </div>
      </div>

      {/* Gap Analysis & Top 3 Priority Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Top 3 Khoảng trống (Gaps) & Khuyến nghị Ưu tiên Đầu tư
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Các điểm nghẽn có tỷ lệ hoàn thành thấp nhất cần tập trung tháo gỡ để nâng hạng DBI lên cấp độ tiếp theo
          </p>
        </div>

        <div className="space-y-4">
          {currentResult.gaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Trụ cột: {gap.pillar}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Mức độ đạt: {gap.score}%
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    gap.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Ưu tiên: {gap.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-1">
                  <strong className="text-slate-500 font-bold block">Hiện trạng phát hiện:</strong>
                  <p className="text-slate-700 leading-relaxed">{gap.issue}</p>
                </div>
                <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="text-teal-700 font-bold block">Hành động khắc phục đề xuất:</strong>
                  <p className="text-slate-800 leading-relaxed font-medium">{gap.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Capability Profile Dossier Export Highlight Card */}
        <div className="pt-6 border-t border-slate-100 print:hidden">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-md border border-teal-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Hồ sơ Thầu & Chứng chỉ Năng lực
                </span>
                <span className="text-xs text-slate-300 font-medium"></span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Báo cáo Hồ sơ Năng lực Chuyển đổi số Doanh nghiệp (DBI Dossier)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Tài liệu PDF chính thức định dạng A4 chuẩn quốc gia, tích hợp biểu đồ Radar vector sắc nét, bảng đối chuẩn 6 trụ cột, phân tích khoảng trống và lộ trình nâng hạng DBI. Sẵn sàng nộp hồ sơ năng lực dự thầu, báo cáo ban lãnh đạo và thẩm định hỗ trợ chuyển đổi số.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-teal-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Đầy đủ Biểu đồ & Bảng điểm 6 Trụ cột
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Mã định danh hồ sơ & Con dấu điện tử
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Xuất file PDF (.pdf) hoặc In trực tiếp
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => setIsDossierModalOpen(true)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Xem & Tải Hồ sơ Năng lực (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation to Investment Step */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="text-xs text-slate-500">
            Bước tiếp theo: Khám phá giải pháp công nghệ chuẩn xác theo ngành hoặc hoàn thiện khảo sát ngân sách.
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsAiAdvisorOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Gợi ý Giải pháp từ AI Gemini</span>
            </button>

            <button
              onClick={() => navigate('/assessment/active/investment')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Khảo sát Ngân sách</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Capability Dossier Modal */}
      <DbiCapabilityDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        result={currentResult}
        currentUser={currentUser}
      />

      {/* Gemini AI Tech Advisor Modal */}
      <GeminiTechAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        defaultIndustry={currentUser.company.industry || currentResult.industry || 'Bán lẻ'}
        defaultLevel={currentResult.level || 2}
      />
    </div>
  );
};
