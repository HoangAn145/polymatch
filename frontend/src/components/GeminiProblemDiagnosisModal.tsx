import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Send, 
  RefreshCw, 
  ShieldAlert, 
  TrendingDown, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  Cpu, 
  FileText,
  Building2,
  ChevronRight,
  Layers
} from 'lucide-react';
import { BranchCode } from '../data/questions';
import { TEN_NHANH } from '../data/weights';
import { AssessmentRecord } from '../lib/storage';
import { goiGeminiPhanTichVanDe, GeminiProblemAnalysis } from '../lib/gemini';

interface GeminiProblemDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestAssessment?: AssessmentRecord;
  initialBranch?: BranchCode;
}

export const GeminiProblemDiagnosisModal: React.FC<GeminiProblemDiagnosisModalProps> = ({
  isOpen,
  onClose,
  latestAssessment,
  initialBranch = 'VT',
}) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchCode>(
    latestAssessment?.branch || initialBranch
  );
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<GeminiProblemAnalysis | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selected branch if assessment changes
  useEffect(() => {
    if (latestAssessment?.branch) {
      setSelectedBranch(latestAssessment.branch);
    }
  }, [latestAssessment]);

  if (!isOpen) return null;

  const handleRunDiagnosis = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await goiGeminiPhanTichVanDe({
        companyName: latestAssessment?.companyName || 'Doanh nghiệp Logistics',
        branch: selectedBranch,
        scale: latestAssessment?.scale || 'Vừa và nhỏ (Nghị định 80)',
        dbiResult: latestAssessment?.dbiResult,
        ldmiResult: latestAssessment?.ldmiResult,
        topGaps: latestAssessment?.topGaps,
        gatekeeperWarning: latestAssessment?.ldmiResult?.dieu_kien_chan_ghi_chu,
        operationalDescription: customPrompt.trim() || undefined,
      });

      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Có lỗi khi kết nối tới Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const text = `
=== CHẨN ĐOÁN VẤN ĐỀ LOGISTICS BẰNG GEMINI AI ===
Tiêu đề: ${analysis.tieu_de_chan_doan}
Tổng quan: ${analysis.danh_gia_tong_quan}

CÁC VẤN ĐỀ CỐT LÕI:
${analysis.danh_sach_van_de
  .map(
    (vd, i) =>
      `${i + 1}. [${vd.muc_do.toUpperCase()}] ${vd.ten_van_de} (${vd.khau_anh_huong})\n- Triệu chứng: ${vd.trieu_chung_thuc_te}\n- Nguyên nhân gốc rễ: ${vd.nguyen_nhan_goc_re}\n- Thiệt hại/Rủi ro: ${vd.rui_ro_thiet_hai}\n- Giải pháp: ${vd.giai_phap_khac_phuc}`
  )
  .join('\n\n')}

ĐIỂM NGHẼN LIÊN PHÒNG BAN:
${analysis.diem_nghen_lien_phong_ban}

LỘ TRÌNH 3 BƯỚC CẤP BÁCH:
${analysis.lo_trinh_3_buoc_cap_bach.map((b) => `• ${b.giai_doan}: ${b.viec_can_lam} -> Đầu ra: ${b.ket_qua_dau_ra}`).join('\n')}

Thông điệp chuyên gia: ${analysis.thong_diep_chuyen_gia}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Powered by Google Gemini API · @google/genai
            </span>
            <span className="text-[11px] text-slate-300 hidden sm:inline">
              Mô hình gemini-3.8-flash (Server-Side)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Trợ lý Chẩn đoán Vấn đề Gặp phải trong Logistics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Gọi trực tiếp Gemini API để phân tích ma trận điểm nghẽn, chỉ ra chính xác các vấn đề đứt gãy luồng vận hành, nguyên nhân gốc rễ và đề xuất giải pháp cấp bách.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Input & Context Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Nhánh hoạt động cần chẩn đoán:
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(['VT', 'FF', 'KB', '3PL', 'LM', 'KH'] as BranchCode[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBranch(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedBranch === b
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b} · {TEN_NHANH[b]}
                    </button>
                  ))}
                </div>
              </div>

              {latestAssessment && (
                <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 shrink-0">
                  <span className="font-bold block">✓ Đã gắn kết quả đánh giá:</span>
                  <span>
                    {latestAssessment.companyName} (LDMI: {latestAssessment.ldmiResult.diem.toFixed(1)}đ · Mức {latestAssessment.ldmiResult.muc})
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                Mô tả bài toán / vấn đề thực tế tại doanh nghiệp (Tùy chọn):
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Đội xe 30 chiếc thường xuyên chạy rỗng chiều về 35-40%, tài xế hay giao trễ nhưng chỉ báo qua Zalo, cuối tháng mất 10 ngày đối soát cước..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                ⚡ Gemini API sẽ phân tích triệu chứng thực tế, nguyên nhân gốc rễ và rủi ro tài chính.
              </span>
              <button
                onClick={handleRunDiagnosis}
                disabled={isLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang gọi Gemini API phân tích...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {analysis ? 'Chẩn đoán lại bằng Gemini API' : 'Gọi Gemini API Chẩn Đoán Vấn Đề'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="p-8 bg-white rounded-2xl border border-blue-200 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Đang gửi dữ liệu đánh giá và truy vấn Gemini API...
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Gemini đang phân tích ma trận 8 nhóm năng lực, đối chiếu điều kiện chặn Gatekeeper và lập báo cáo vấn đề gặp phải...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Diagnosis Result View */}
          {analysis && !isLoading && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Result Header */}
              <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/30 border border-blue-400/30 text-blue-200 text-[11px] font-bold font-mono">
                      KẾT QUẢ CHẨN ĐOÁN GEMINI API
                    </span>
                    {analysis.isFallback && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                        Bản chuyên gia kiểm chứng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Đã chép!' : 'Sao chép chẩn đoán'}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {analysis.tieu_de_chan_doan}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  {analysis.danh_gia_tong_quan}
                </p>
              </div>

              {/* List of Identified Problems */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Các Vấn Đề Gặp Phải Cụ Thể ({analysis.danh_sach_van_de.length} vấn đề)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Phân loại theo mức độ nghiêm trọng
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {analysis.danh_sach_van_de.map((vd, idx) => {
                    const isSevere = vd.muc_do === 'nghiem_trong';
                    const isWarning = vd.muc_do === 'canh_bao';

                    return (
                      <div
                        key={vd.id || idx}
                        className={`bg-white rounded-2xl p-5 border transition-all ${
                          isSevere
                            ? 'border-rose-300 hover:border-rose-400 shadow-xs'
                            : isWarning
                            ? 'border-amber-300 hover:border-amber-400 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        } space-y-3`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isSevere
                                  ? 'bg-rose-100 text-rose-800'
                                  : isWarning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isSevere ? '⚠️ Cực kỳ nghiêm trọng' : isWarning ? '⚡ Cảnh báo rủi ro' : '💡 Khuyến nghị cải tiến'}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Khâu: <strong className="text-slate-800">{vd.khau_anh_huong}</strong>
                            </span>
                          </div>

                          <span className="text-[11px] font-mono text-slate-400">
                            Mã: #{vd.id}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {vd.ten_van_de}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <span className="font-bold text-slate-700 block">Triệu chứng thực tế gặp phải:</span>
                            <p className="text-slate-600 leading-relaxed">{vd.trieu_chung_thuc_te}</p>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <span className="font-bold text-slate-700 block">Nguyên nhân gốc rễ (Root Cause):</span>
                            <p className="text-slate-600 leading-relaxed">{vd.nguyen_nhan_goc_re}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-1">
                          <span className="font-bold text-rose-900 flex items-center gap-1.5">
                            <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
                            Rủi ro &amp; Thiệt hại tài chính/vận hành:
                          </span>
                          <p className="text-slate-700 leading-relaxed">{vd.rui_ro_thiet_hai}</p>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            Giải pháp khắc phục cấp bách (30-60 ngày):
                          </span>
                          <p className="text-slate-800 font-medium leading-relaxed">{vd.giai_phap_khac_phuc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cross-department Silos & Gatekeeper Bottlenecks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Điểm nghẽn ốc đảo dữ liệu liên phòng ban
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.diem_nghen_lien_phong_ban}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Nguy cơ từ Điều kiện chặn Gatekeeper (R06)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.nguy_co_gatekeeper}
                  </p>
                </div>
              </div>

              {/* Urgent 3-Step Roadmap */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Lộ trình 3 Bước Tháo Gỡ Vấn Đề Cấp Bách (Thực thi trong 6 tháng):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {analysis.lo_trinh_3_buoc_cap_bach.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] block w-fit">
                        {step.giai_doan}
                      </span>
                      <div>
                        <strong className="text-slate-800 block text-[11px]">Hành động cần làm:</strong>
                        <p className="text-slate-600 mt-0.5">{step.viec_can_lam}</p>
                      </div>
                      <div className="pt-1 border-t border-slate-200">
                        <strong className="text-emerald-800 block text-[11px]">Kết quả đầu ra:</strong>
                        <p className="text-slate-600 mt-0.5">{step.ket_qua_dau_ra}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Advice Message */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">Thông điệp thực chiến từ Chuyên gia:</strong>
                  <p className="text-slate-700 italic leading-relaxed">"{analysis.thong_diep_chuyen_gia}"</p>
                </div>
              </div>

            </div>
          )}

          {/* Initial State / Prompting to Run */}
          {!analysis && !isLoading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Sẵn sàng gọi Gemini API để chẩn đoán vấn đề gặp phải
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Nhấn nút <strong>"Gọi Gemini API Chẩn Đoán Vấn Đề"</strong> ở trên. Hệ thống sẽ truyền dữ liệu khảo sát và truy vấn AI để tìm ra nguyên nhân gốc rễ và rủi ro tiềm ẩn.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Tuân thủ quy tắc M33.03: Không quảng cáo nhà cung cấp · Không cam kết số ảo
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
