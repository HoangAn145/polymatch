import React, { useState } from 'react';
import { AssessmentRecord } from '../lib/storage';
import { TEN_NHOM_NANG_LUC, TEN_NHANH } from '../data/weights';
import { GroupCode } from '../data/questions';
import { goiGeminiPhanTichVanDe, GeminiProblemAnalysis } from '../lib/gemini';
import { 
  Award, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  FileText,
  Clock,
  Layers,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Cpu,
  Info,
  RefreshCw,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

interface ResultsDashboardProps {
  assessment: AssessmentRecord;
  onViewGaps: () => void;
  onViewSolutions: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  assessment,
  onViewGaps,
  onViewSolutions,
}) => {
  const [aiFeedback, setAiFeedback] = useState<'up' | 'down' | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiProblemAnalysis | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [customUserNote, setCustomUserNote] = useState<string>('');
  const [copiedDiagnosis, setCopiedDiagnosis] = useState<boolean>(false);

  const { dbiResult, ldmiResult, topGaps, aiInterpretation, branch, scale, processingMs } = assessment;

  const handlePrint = () => {
    window.print();
  };

  const handleCallGeminiDiagnosis = async () => {
    setIsGeminiLoading(true);
    setGeminiError(null);
    try {
      const result = await goiGeminiPhanTichVanDe({
        companyName: assessment.companyName,
        branch: assessment.branch,
        scale: assessment.scale,
        dbiResult: assessment.dbiResult,
        ldmiResult: assessment.ldmiResult,
        topGaps: assessment.topGaps,
        gatekeeperWarning: assessment.ldmiResult.dieu_kien_chan_ghi_chu,
        operationalDescription: customUserNote.trim() || undefined,
      });
      setGeminiAnalysis(result);
    } catch (err: any) {
      setGeminiError(err?.message || 'Có lỗi khi kết nối tới Gemini API.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleCopyDiagnosis = () => {
    if (!geminiAnalysis) return;
    const text = `
=== KẾT QUẢ CHẨN ĐOÁN VẤN ĐỀ LOGISTICS - GEMINI AI ===
Doanh nghiệp: ${assessment.companyName} (Nhánh ${assessment.branch} - ${TEN_NHANH[assessment.branch]})
Tiêu đề: ${geminiAnalysis.tieu_de_chan_doan}
Đánh giá tổng quan: ${geminiAnalysis.danh_gia_tong_quan}

DANH SÁCH VẤN ĐỀ GẶP PHẢI:
${geminiAnalysis.danh_sach_van_de
  .map(
    (vd, i) =>
      `${i + 1}. [${vd.muc_do.toUpperCase()}] ${vd.ten_van_de} (${vd.khau_anh_huong})\n- Triệu chứng: ${vd.trieu_chung_thuc_te}\n- Nguyên nhân gốc rễ: ${vd.nguyen_nhan_goc_re}\n- Thiệt hại & Rủi ro: ${vd.rui_ro_thiet_hai}\n- Giải pháp khắc phục: ${vd.giai_phap_khac_phuc}`
  )
  .join('\n\n')}

ĐIỂM NGHẼN LIÊN PHÒNG BAN:
${geminiAnalysis.diem_nghen_lien_phong_ban}

CẢNH BÁO GATEKEEPER:
${geminiAnalysis.nguy_co_gatekeeper}

LỘ TRÌNH 3 BƯỚC CẤP BÁCH:
${geminiAnalysis.lo_trinh_3_buoc_cap_bach.map((s) => `• ${s.giai_doan}: ${s.viec_can_lam} => Đầu ra: ${s.ket_qua_dau_ra}`).join('\n')}

Thông điệp chuyên gia: "${geminiAnalysis.thong_diep_chuyen_gia}"
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedDiagnosis(true);
    setTimeout(() => setCopiedDiagnosis(false), 2000);
  };

  // 8 Capability Groups Data
  const groupsList: GroupCode[] = ['VT', 'KB', 'GN', 'DH', 'HT', 'CT', 'CP', 'XA'];

  // Helper colors for levels
  const getDbiColor = (muc: string) => {
    switch (muc) {
      case 'khoi_dong': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'bat_dau': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'hinh_thanh': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'nang_cao': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'dan_dat': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getLdmiColor = (muc: number) => {
    switch (muc) {
      case 1: return 'from-slate-500 to-slate-700 text-white';
      case 2: return 'from-amber-500 to-amber-600 text-white';
      case 3: return 'from-blue-600 to-blue-700 text-white';
      case 4: return 'from-emerald-600 to-emerald-700 text-white';
      case 5: return 'from-purple-600 to-purple-700 text-white';
      default: return 'from-blue-600 to-blue-700 text-white';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              KẾT QUẢ ĐÁNH GIÁ HAI LỚP (M06.06)
            </span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Chấm điểm trong {processingMs}ms (R23)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Báo cáo Trưởng thành số: {assessment.companyName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhánh: <strong>{TEN_NHANH[branch]}</strong> · Quy mô: <strong>{scale.toUpperCase()}</strong> · Ngày lập: {new Date(assessment.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Tải PDF / In (M06.10)
          </button>

          <button
            onClick={onViewGaps}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            Xem 3 khoảng trống & Lộ trình
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DUAL GAUGES: DBI (National Standard) & LDMI (Logistics Digital Maturity Index) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Layer 1: DBI (TOPSIS) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                LỚP 1 · CHỈ SỐ DOANH NGHIỆP (TOPSIS)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Chỉ số DBI (Digital Business Index)
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDbiColor(dbiResult.muc_ma)}`}>
              Mức: {dbiResult.muc_ten}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-5">
            <span className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
              {dbiResult.diem.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              / 100 điểm (Hệ số gần gũi Ci: {dbiResult.ci.toFixed(3)})
            </span>
          </div>

          {/* 6 DBI Pillars Bar Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Điểm 6 Trụ cột chuyển đổi số:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(dbiResult.diem_tru_cot).map(([pillar, val]) => (
                <div key={pillar} className="p-2 bg-slate-50 rounded-lg">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 capitalize">{pillar.replace('_', ' ')}</span>
                    <span className="font-mono font-bold text-slate-900">{val}đ</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Layer 2: LDMI (Logistics Digital Maturity Index with Bottleneck R06) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                LỚP 2 · MÔ HÌNH CHUYÊN SÂU LOGISTICS
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Chỉ số LDMI (Logistics 5 Mức)
              </h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLdmiColor(ldmiResult.muc)} shadow-xs`}>
              Mức {ldmiResult.muc}: {ldmiResult.muc_ten}
            </div>
          </div>

          <div className="flex items-baseline gap-3 my-5">
            <span className="text-4xl font-extrabold text-blue-700 font-mono tabular-nums">
              {ldmiResult.diem.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              / 100 điểm có trọng số nhánh {branch}
            </span>
          </div>

          {/* Condition Bottleneck Warning if triggered (R06) */}
          {ldmiResult.dieu_kien_chan_ghi_chu ? (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Điều kiện chặn R06:</strong> {ldmiResult.dieu_kien_chan_ghi_chu}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Thỏa điều kiện chặn:</strong> Năng lực kết nối hệ thống và chi phí đạt chuẩn theo cấp độ hiện tại.
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>5 Cấp độ: Thủ công (1) → Số hóa (2) → Tích hợp (3) → Hiển thị (4) → Thông minh (5)</span>
          </div>
        </div>

      </div>

      {/* 8 LOGISTICS CAPABILITY GROUPS DASHBOARD (M06.07) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Bảng điểm 8 Nhóm năng lực Logistics cốt lõi (M06.07)
            </h3>
            <p className="text-xs text-slate-500">
              Điểm số quy đổi từ 0 đến 100 theo từng năng lực vận hành thực tế
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Thang điểm 0 – 100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {groupsList.map((g) => {
            const score = ldmiResult.diem_nhom[g];
            const isAsked = score !== null;
            return (
              <div 
                key={g} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isAsked 
                    ? score < 40 
                      ? 'border-rose-200 bg-rose-50/40' 
                      : score < 70 
                      ? 'border-blue-200 bg-blue-50/30' 
                      : 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {TEN_NHOM_NANG_LUC[g]}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">
                    {g}
                  </span>
                </div>

                {isAsked ? (
                  <>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xl font-bold font-mono text-slate-900">
                        {score}đ
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {score < 40 ? 'Khoảng trống lớn' : score < 70 ? 'Mức khá' : 'Tiên tiến'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${
                          score < 40 ? 'bg-rose-500' : score < 70 ? 'bg-blue-600' : 'bg-emerald-600'
                        }`} 
                        style={{ width: `${score}%` }} 
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    Không áp dụng cho nhánh {branch}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* GEMINI AI DEEP PROBLEM DIAGNOSIS (CALL GEMINI API) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Chẩn đoán Chuyên sâu bằng Gemini API · @google/genai
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Vấn Đề Gặp Phải &amp; Điểm Nghẽn Vận Hành Chuỗi Cung Ứng
            </h3>
            <p className="text-xs text-slate-500">
              Truy vấn mô hình Gemini 3.8 Flash để mổ xẻ nguyên nhân gốc rễ, rủi ro tài chính và tháo gỡ điểm nghẽn cho {assessment.companyName}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleCallGeminiDiagnosis}
              disabled={isGeminiLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isGeminiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang phân tích với Gemini API...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {geminiAnalysis ? 'Chẩn đoán lại với Gemini' : 'Gọi Gemini API Chẩn Đoán Vấn Đề'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Custom Problem Context */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Bổ sung tình huống / khó khăn đặc thù doanh nghiệp đang gặp (tùy chọn):
            </label>
            <span className="text-[11px] text-slate-400">
              Ví dụ: Chiều về rỗng, đối soát cước trễ 20 ngày, tài xế không quen app...
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập khó khăn cụ thể của bạn để Gemini phân tích trúng đích hơn..."
              value={customUserNote}
              onChange={(e) => setCustomUserNote(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
            {customUserNote.trim() && (
              <button
                onClick={handleCallGeminiDiagnosis}
                disabled={isGeminiLoading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap"
              >
                Cập nhật phân tích
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {geminiError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{geminiError}</span>
          </div>
        )}

        {/* Loading state animation */}
        {isGeminiLoading && (
          <div className="p-8 text-center space-y-3 bg-indigo-50/40 rounded-2xl border border-indigo-100 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <h4 className="text-sm font-bold text-indigo-950">
              Gemini API đang bóc tách vấn đề và phân tích luồng vận hành...
            </h4>
            <p className="text-xs text-indigo-800 max-w-md mx-auto">
              Đối chiếu dữ liệu DBI TOPSIS, LDMI 8 nhóm năng lực và điều kiện chặn Gatekeeper để nhận diện các điểm nghẽn cốt lõi...
            </p>
          </div>
        )}

        {/* Gemini Result Presentation */}
        {geminiAnalysis && !isGeminiLoading && (
          <div className="space-y-6">
            
            {/* Executive Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[11px] font-bold font-mono">
                    CHẨN ĐOÁN BỞI GEMINI 3.8 FLASH
                  </span>
                  {geminiAnalysis.isFallback && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                      Bản chuyên gia kiểm chứng
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyDiagnosis}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  {copiedDiagnosis ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDiagnosis ? 'Đã sao chép' : 'Sao chép chẩn đoán'}
                </button>
              </div>

              <h4 className="text-lg font-bold text-white">
                {geminiAnalysis.tieu_de_chan_doan}
              </h4>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                {geminiAnalysis.danh_gia_tong_quan}
              </p>
            </div>

            {/* List of Problems Detected */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Các vấn đề gặp phải cụ thể ({geminiAnalysis.danh_sach_van_de.length} vấn đề)
                </span>
                <span className="text-[11px] text-slate-400">
                  Triệu chứng · Nguyên nhân gốc rễ · Thiệt hại · Giải pháp
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {geminiAnalysis.danh_sach_van_de.map((vd, i) => {
                  const isSevere = vd.muc_do === 'nghiem_trong';
                  const isWarning = vd.muc_do === 'canh_bao';

                  return (
                    <div
                      key={vd.id || i}
                      className={`p-5 rounded-2xl border transition-all ${
                        isSevere
                          ? 'border-rose-300 bg-rose-50/20'
                          : isWarning
                          ? 'border-amber-300 bg-amber-50/20'
                          : 'border-slate-200 bg-white'
                      } space-y-3 shadow-2xs`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isSevere
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : isWarning
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {isSevere ? '⚠️ Cực kỳ nghiêm trọng' : isWarning ? '⚡ Cảnh báo rủi ro' : '💡 Khuyến nghị tối ưu'}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            Khâu: <strong className="text-slate-900">{vd.khau_anh_huong}</strong>
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">#{vd.id}</span>
                      </div>

                      <h5 className="text-base font-bold text-slate-900">
                        {vd.ten_van_de}
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-700 block">Triệu chứng thực tế gặp phải:</span>
                          <p className="text-slate-600 leading-relaxed">{vd.trieu_chung_thuc_te}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-700 block">Nguyên nhân gốc rễ (Root Cause):</span>
                          <p className="text-slate-600 leading-relaxed">{vd.nguyen_nhan_goc_re}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-1">
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

            {/* Department Silos & Gatekeeper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Điểm nghẽn ốc đảo dữ liệu liên phòng ban:
                </span>
                <p className="text-slate-600 leading-relaxed">{geminiAnalysis.diem_nghen_lien_phong_ban}</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <span className="font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Cảnh báo điều kiện chặn Gatekeeper (R06):
                </span>
                <p className="text-slate-700 leading-relaxed">{geminiAnalysis.nguy_co_gatekeeper}</p>
              </div>
            </div>

            {/* Urgent 3-step Roadmap */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Lộ trình 3 bước khắc phục cấp bách (6 tháng):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {geminiAnalysis.lo_trinh_3_buoc_cap_bach.map((step, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] block w-fit">
                      {step.giai_doan}
                    </span>
                    <div>
                      <strong className="text-slate-800 block text-[11px]">Hành động cần làm:</strong>
                      <p className="text-slate-600 mt-0.5">{step.viec_can_lam}</p>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <strong className="text-emerald-800 block text-[11px]">Kết quả đầu ra:</strong>
                      <p className="text-slate-600 mt-0.5">{step.ket_qua_dau_ra}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Message */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">Lời khuyên từ Chuyên gia Logistics:</strong>
                <p className="text-slate-700 italic leading-relaxed">"{geminiAnalysis.thong_diep_chuyen_gia}"</p>
              </div>
            </div>

          </div>
        )}

        {/* Initial Prompt State if not diagnosed yet */}
        {!geminiAnalysis && !isGeminiLoading && (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
            <p className="text-xs text-slate-600">
              Doanh nghiệp muốn biết các điểm nghẽn đang âm thầm làm thất thoát chi phí và cản trở việc chốt hợp đồng với khách hàng lớn?
            </p>
            <button
              onClick={handleCallGeminiDiagnosis}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Gọi Gemini API để chẩn đoán các vấn đề gặp phải ngay
            </button>
          </div>
        )}
      </div>

      {/* AI DIỄN GIẢI LOGISTICS (MODULE M33) */}
      {aiInterpretation && (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Diễn giải Vận hành & Phân tích Khoảng trống (Module M33)
                </h3>
                <p className="text-xs text-blue-200">
                  Tri thức kiểm chứng từ chuyên gia · Tuân thủ nghiêm ngặt quy tắc độc lập M33.03
                </p>
              </div>
            </div>

            {/* AI Helpful Rating (M33.05) */}
            <div className="flex items-center gap-1.5 no-print text-xs text-blue-200">
              <span className="text-[11px] mr-1">Hữu ích?</span>
              <button
                onClick={() => setAiFeedback('up')}
                className={`p-1.5 rounded-lg border transition-colors ${aiFeedback === 'up' ? 'bg-blue-600 border-blue-400 text-white' : 'border-blue-400/30 hover:bg-white/10'}`}
                title="Hữu ích"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setAiFeedback('down')}
                className={`p-1.5 rounded-lg border transition-colors ${aiFeedback === 'down' ? 'bg-rose-600 border-rose-400 text-white' : 'border-blue-400/30 hover:bg-white/10'}`}
                title="Chưa sát thực tế"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-sm leading-relaxed text-blue-50">
            {aiInterpretation.tom_tat}
          </div>

          {/* 3 Detailed Gaps Operational View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {aiInterpretation.khoang_trong.map((gap, idx) => (
              <div key={gap.ma} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-blue-300 font-mono font-bold">
                  <span>Khoảng trống #{idx + 1}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">{gap.ma}</span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  {gap.ten}
                </h4>
                <p className="text-blue-100 text-[11px]">
                  <strong>Hiện trạng:</strong> {gap.hien_trang}
                </p>
                <div className="p-2.5 rounded-lg bg-blue-800/40 border border-blue-400/20 text-emerald-200 text-[11px]">
                  <strong>Bước tiếp theo (Mức {ldmiResult.muc}):</strong> {gap.buoc_tiep_theo}
                </div>
              </div>
            ))}
          </div>

          {/* AI Caveat Warning */}
          <div className="text-[11px] text-blue-300/80 pt-2 border-t border-white/10 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{aiInterpretation.luu_y}</span>
          </div>
        </div>
      )}

      {/* MANDATORY LIMITATION NOTE (M06.11) */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Ghi chú giới hạn (M06.11):</strong> Kết quả đánh giá là ước lượng từ bộ câu hỏi rút gọn theo đặc thù logistics Việt Nam. Điểm số dùng để tham khảo định hướng lộ trình số hóa và làm bộ lọc ghép nối giải pháp công nghệ; không thay thế cho các cuộc khảo sát tiền khả thi chuyên sâu tại hiện trường.
        </div>
      </div>

      {/* Next Actions CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 no-print">
        <button
          onClick={onViewGaps}
          className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-colors"
        >
          Xem chi tiết 3 Khoảng trống & Lộ trình
        </button>
        <button
          onClick={onViewSolutions}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          Khám phá Giải pháp Công nghệ đề xuất ({assessment.recommendations.length} giải pháp)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
