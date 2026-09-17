import React, { useRef, useState } from 'react';
import { 
  Download, 
  Printer, 
  X, 
  ShieldCheck, 
  Award, 
  Scale, 
  Building2, 
  Building, 
  Calendar, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  FileText,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AssessmentResultData, UserAccount } from '../../types';
import { DBI_PILLARS } from '../../data/mockData';
import { 
  LARGE_PILLAR_MAX, 
  SME_PILLAR_MAX, 
  DBI_LEVELS_LARGE, 
  DBI_LEVELS_SME
} from '../../data/dbiConstants';
import { RadarChart } from './RadarChart';
import { exportElementToPdf } from '../../services/pdfExportService';

interface DbiCapabilityDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AssessmentResultData;
  currentUser: UserAccount;
}

export const DbiCapabilityDossierModal: React.FC<DbiCapabilityDossierModalProps> = ({
  isOpen,
  onClose,
  result,
  currentUser
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ percent: number; stage: string }>({
    percent: 0,
    stage: ''
  });

  if (!isOpen) return null;

  const isLarge = result.assessmentType === 'LARGE';
  const scaleMax = result.scaleMax || (isLarge ? 695 : 100);
  const levelsList = isLarge ? DBI_LEVELS_LARGE : DBI_LEVELS_SME;
  const levelMeta = levelsList.find(l => l.level === result.level) || levelsList[0];
  const pillarMaxMap = isLarge ? LARGE_PILLAR_MAX : SME_PILLAR_MAX;
  const percentageScore = result.percentageScore || Math.round((result.totalScore / scaleMax) * 100);

  const dossierCode = `DBI-VN-${result.id ? result.id.replace('ASM-', '') : '2026-9988'}`;
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadProgress({ percent: 10, stage: 'Bắt đầu tạo hồ sơ năng lực...' });

    const safeCompanyName = (currentUser.company.companyName || 'Doanh-Nghiep')
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '-')
      .replace(/-+/g, '-');
    const fileName = `Ho-So-Nang-Luc-Chuyen-Doi-So-DBI-${safeCompanyName}.pdf`;

    const success = await exportElementToPdf({
      elementId: 'dbi-capability-dossier-print-content',
      fileName,
      onProgress: (percent, stage) => {
        setDownloadProgress({ percent, stage });
      }
    });

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadProgress({ percent: 0, stage: '' });
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Modal Action Header (Hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Hồ sơ Năng lực Chuyển đổi số Doanh nghiệp (DBI Dossier)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tài liệu phục vụ nộp hồ sơ năng lực dự thầu, thẩm định chuyển đổi số và đề xuất cấp chứng nhận
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? `${downloadProgress.percent}%` : 'Tải file PDF (.pdf)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="In trực tiếp"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">In hồ sơ</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress notification during PDF generation */}
        {isDownloading && (
          <div className="bg-teal-50 border-b border-teal-200 px-6 py-2.5 text-xs text-teal-800 font-semibold flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span>{downloadProgress.stage || 'Đang xử lý PDF...'}</span>
            </div>
            <span className="font-extrabold">{downloadProgress.percent}%</span>
          </div>
        )}

        {/* Scrollable Dossier Paper Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
          
          {/* Printable Document Sheet (A4 Proportion) */}
          <div 
            id="dbi-capability-dossier-print-content"
            className="bg-white max-w-4xl mx-auto p-6 sm:p-10 rounded-xl shadow-xs border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-8 text-slate-800 text-xs sm:text-sm font-sans"
          >
            {/* Header: Title */}
            <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                BÁO CÁO HỒ SƠ NĂNG LỰC CHUYỂN ĐỔI SỐ
              </h1>
              <p className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wide">
                DIGITAL MATURITY CAPABILITY PROFILE (DBI INDEX)
              </p>
            </div>

            {/* Section I: Enterprise Identity & Profile */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">I</span>
                <span>THÔNG TIN ĐỊNH DANH DOANH NGHIỆP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block">Tên doanh nghiệp:</span>
                  <strong className="text-slate-900 font-bold text-sm sm:text-base">
                    {currentUser.company.companyName}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Mã số thuế / ĐKKD:</span>
                  <strong className="text-slate-900 font-bold">
                    {currentUser.company.mst || '0108934521'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Ngành nghề kinh tế chính:</span>
                  <strong className="text-slate-800">
                    {currentUser.company.industry}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Phân khúc quy mô áp dụng:</span>
                  <strong className="text-indigo-700">
                    {isLarge ? 'Doanh nghiệp Lớn (Bộ tiêu chí 695 điểm)' : 'Doanh nghiệp Nhỏ & Vừa - SME (Thang điểm 100)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Người đại diện / Chức vụ:</span>
                  <strong className="text-slate-800">
                    {currentUser.company.representative || currentUser.fullName} - Đại diện Doanh nghiệp
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Trụ sở đăng ký:</span>
                  <span className="text-slate-700">
                    {currentUser.company.address || 'Khu Công nghệ cao Hòa Lạc, Hà Nội, Việt Nam'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section II: Overall Score & Level Qualification */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">II</span>
                <span>KẾT QUẢ ĐÁNH GIÁ CHỈ SỐ DBI VÀ XẾP HẠNG CẤP ĐỘ</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Card */}
                <div className="p-4 rounded-xl border-2 border-teal-600 bg-teal-50/40 flex flex-col justify-between items-center text-center space-y-2">
                  <span className="text-[11px] font-bold text-teal-900 uppercase">
                    Điểm số DBI đạt được
                  </span>
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-teal-800">
                      {result.totalScore}
                    </span>
                    <span className="text-xs font-extrabold text-slate-500">
                      /{scaleMax}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                    Tỷ lệ hoàn thiện: {percentageScore}%
                  </div>
                </div>

                {/* Level Card */}
                <div className="p-4 rounded-xl border border-slate-300 bg-white flex flex-col justify-between items-center text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Xếp hạng Cấp độ Chuyển đổi số
                  </span>
                  <div>
                    <span className="inline-block px-4 py-1.5 rounded-xl text-sm sm:text-base font-black bg-teal-100 text-teal-900 border border-teal-200">
                      CẤP {result.level}: {levelMeta.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Khung quy định: {levelMeta.minScore} - {levelMeta.maxScore} điểm
                  </span>
                </div>

                {/* Benchmark Card */}
                <div className="p-4 rounded-xl border border-slate-300 bg-white flex flex-col justify-between items-center text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    So sánh đối chuẩn ngành
                  </span>
                  <div>
                    <span className="text-2xl font-black text-slate-800">
                      {result.industryAvgTotal}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/{scaleMax} điểm</span>
                  </div>
                  <div className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    result.totalScore >= result.industryAvgTotal 
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                      : 'text-amber-700 bg-amber-50 border border-amber-200'
                  }`}>
                    {result.totalScore >= result.industryAvgTotal
                      ? `▲ Vượt chuẩn ngành +${result.totalScore - result.industryAvgTotal} điểm`
                      : `▼ Thấp hơn chuẩn ngành -${result.industryAvgTotal - result.totalScore} điểm`}
                  </div>
                </div>
              </div>

              {/* AI Expert Assessment Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Đánh giá hiện trạng & Năng lực cạnh tranh số:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{result.aiSummary}"
                </p>
              </div>
            </div>

            {/* Section III: Detailed 6 Pillars & Radar Visualization */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">III</span>
                <span>BIỂU ĐỒ NĂNG LỰC ĐA CHIỀU & BẢNG ĐIỂM 6 TRỤ CỘT</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Radar Chart Visual */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 mb-2">
                    Biểu đồ Radar Năng lực 6 Trụ cột (0 - 100%)
                  </div>
                  <RadarChart 
                    userScores={result.pillarScores} 
                    industryScores={result.industryAvgScores} 
                    size={280}
                  />
                </div>

                {/* Table of 6 Pillars Breakdown */}
                <div className="lg:col-span-7 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                        <th className="py-2 px-2.5 font-bold">Trụ cột đánh giá</th>
                        <th className="py-2 px-2 font-bold text-center">Điểm thô</th>
                        <th className="py-2 px-2 font-bold text-center">Tối đa</th>
                        <th className="py-2 px-2 font-bold text-center">Tỷ lệ %</th>
                        <th className="py-2 px-2 font-bold text-center">Chuẩn ngành</th>
                        <th className="py-2 px-2 font-bold text-right">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {DBI_PILLARS.map((p) => {
                        const scoreNorm = result.pillarScores[p.id] || 0;
                        const maxPt = pillarMaxMap[p.id] || 100;
                        const raw = result.pillarRawScores 
                          ? result.pillarRawScores[p.id] 
                          : Math.round((scoreNorm / 100) * maxPt);
                        const indAvgNorm = result.industryAvgScores[p.id] || 50;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 font-semibold text-slate-900">
                              {p.name}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-slate-800">
                              {raw}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-500">
                              {maxPt}
                            </td>
                            <td className="py-2 px-2 text-center font-extrabold text-teal-700">
                              {scoreNorm}%
                            </td>
                            <td className="py-2 px-2 text-center text-slate-600">
                              {indAvgNorm}%
                            </td>
                            <td className="py-2 px-2 text-right">
                              {scoreNorm >= 75 ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Tốt</span>
                              ) : scoreNorm >= 50 ? (
                                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Đạt</span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Cần cải thiện</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section IV: Gap Analysis & Strategic Recommendations */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">IV</span>
                <span>KHOẢNG TRỐNG NĂNG LỰC (GAPS) & KHUYẾN NGHỊ HÀNH ĐỘNG</span>
              </div>

              <div className="space-y-2.5">
                {result.gaps.map((gap, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        Trụ cột: {gap.pillar} (Mức đạt {gap.score}%)
                      </strong>
                      <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Ưu tiên: {gap.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
                      <div>
                        <span className="text-slate-500 font-semibold block">Hạn chế tồn tại:</span>
                        <span>{gap.issue}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 text-teal-900 font-medium">
                        <span className="text-teal-700 font-bold block">Hành động khắc phục:</span>
                        <span>{gap.recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section V: Roadmap & Digital Action Plan */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">V</span>
                <span>LỘ TRÌNH CHUYỂN ĐỔI SỐ NÂNG HẠNG DBI ĐỀ XUẤT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <span>1. Ngắn hạn (1 - 3 tháng)</span>
                  </div>
                  <ul className="text-slate-600 space-y-1 pl-3 list-disc text-[11px]">
                    <li>Chuẩn hóa hồ sơ dữ liệu số và quy chế an toàn thông tin nội bộ.</li>
                    <li>Áp dụng chữ ký số tập trung & văn phòng số không giấy tờ.</li>
                    <li>Đào tạo nâng cao nhận thức số và kỹ năng công nghệ cơ bản.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>2. Trung hạn (3 - 6 tháng)</span>
                  </div>
                  <ul className="text-slate-600 space-y-1 pl-3 list-disc text-[11px]">
                    <li>Tích hợp dữ liệu liên thông giữa bán hàng, kho vận và kế toán.</li>
                    <li>Triển khai hệ thống CRM/ERP quản trị tập trung thời gian thực.</li>
                    <li>Xây dựng Dashboard Báo cáo Quản trị Thông minh (BI).</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>3. Dài hạn (6 - 12 tháng)</span>
                  </div>
                  <ul className="text-slate-600 space-y-1 pl-3 list-disc text-[11px]">
                    <li>Ứng dụng Trí tuệ nhân tạo (AI/ML) phân tích dự báo kinh doanh.</li>
                    <li>Tự động hóa quy trình thông minh (RPA) tối ưu chi phí vận hành.</li>
                    <li>Mở rộng kết nối API hệ sinh thái đối tác và chuỗi cung ứng số.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Controls (Hidden when printing) */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden text-xs">
          <span className="text-slate-500">
            Khổ in tối ưu: <strong>A4</strong> • Độ phân giải cao (2x DPI) • Kèm biểu đồ vector SVG
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng xem trước
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Đang xuất file...' : 'Tải file PDF ngay'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
