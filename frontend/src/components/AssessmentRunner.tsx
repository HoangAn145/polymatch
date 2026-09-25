import React, { useState, useEffect } from 'react';
import { 
  BranchCode, 
  GroupCode, 
  QUESTIONS_DBI, 
  QUESTIONS_LDMI, 
  QUESTIONS_METRICS, 
  QUESTIONS_PHAN_LOAI, 
  QUESTIONS_PRIORITY 
} from '../data/questions';
import { 
  tinhQuyMoDoanhNghiep, 
  getTenQuyMo, 
  EnterpriseScale,
  tinhDbiScore,
  tinhLdmiScore,
  xacDinhKhoangTrong,
  ghepNoiGiaiPhap
} from '../lib/scoring';
import { taoDienGiaiAi } from '../lib/gemini';
import { storage, AssessmentRecord, UserProfile } from '../lib/storage';
import { LOGISTICS_GLOSSARY } from '../data/glossary';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  HelpCircle, 
  ShieldCheck, 
  Save, 
  AlertTriangle,
  Building2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface AssessmentRunnerProps {
  currentUser: UserProfile;
  onFinishAssessment: (assessmentId: string) => void;
  onCancel: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  currentUser,
  onFinishAssessment,
  onCancel,
}) => {
  // Wizard Stages:
  // 0: Hồ sơ phân loại (C01-C06)
  // 1: Phần chung DBI (12 câu)
  // 2: Phần LDMI chuyên ngành theo nhánh (13-24 câu)
  // 3: 13 Chỉ số logistics (K01-K13)
  // 4: Ưu tiên, ngân sách, sẵn sàng (P01-P10)
  const [activeStage, setActiveStage] = useState<number>(0);

  // Classification state
  const [c01, setC01] = useState<'duoi_10' | '10_50' | '50_100' | 'tren_100'>('10_50');
  const [c02, setC02] = useState<'duoi_10' | '10_100' | '100_300' | 'tren_300'>('10_100');
  const [c03, setC03] = useState<'duoi_3' | '3_50' | '50_100' | 'tren_100'>('3_50');
  const [c04Branch, setC04Branch] = useState<BranchCode>(currentUser.branch || 'VT');
  const [c05Services, setC05Services] = useState<string[]>(['VT', 'KB']);
  const [c06ScaleValue, setC06ScaleValue] = useState<string>('25');

  // Answers State
  const [answersDbi, setAnswersDbi] = useState<Record<string, number>>({});
  const [answersLdmi, setAnswersLdmi] = useState<Record<string, number>>({});
  const [answersMetrics, setAnswersMetrics] = useState<Record<string, { trang_thai: 'co_do' | 'uoc_luong' | 'khong_do'; gia_tri?: number }>>({});
  
  // Priority & Budget State
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['giam_chi_phi', 'giam_chay_rong']);
  const [selectedBudget, setSelectedBudget] = useState<string>('20_100');
  const [selectedTiming, setSelectedTiming] = useState<string>('3_thang');
  const [p04Staff, setP04Staff] = useState<string>('kiem_nhiem');
  const [p05Data, setP05Data] = useState<string>('excel_day_du');
  const [p06Leadership, setP06Leadership] = useState<string>('truc_tiep');
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>(['ke_toan']);
  const [freeText, setFreeText] = useState<string>('Chi phí dầu tăng cao, xe chạy chiều về rỗng nhiều.');

  // UI helpers
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [missingErrors, setMissingErrors] = useState<string[]>([]);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);

  // Auto-calculate scale in real time (R01)
  const currentScale = tinhQuyMoDoanhNghiep(c01, c02, c03);

  // Filter LDMI questions applicable to chosen branch (R02)
  const applicableLdmiQuestions = QUESTIONS_LDMI.filter((q) => {
    if (!q.nhanh_ap_dung.includes(c04Branch)) return false;
    if (c04Branch === '3PL' && c05Services.length > 0) {
      if (q.nhom_nang_luc === 'VT' && !c05Services.includes('VT')) return false;
      if (q.nhom_nang_luc === 'KB' && !c05Services.includes('KB')) return false;
      if (q.nhom_nang_luc === 'GN' && !c05Services.includes('GN')) return false;
    }
    return true;
  });

  // Filter applicable metrics
  const applicableMetrics = QUESTIONS_METRICS.filter((m) => m.nhanh.includes(c04Branch));

  // Initialize defaults
  useEffect(() => {
    // Pre-fill defaults for quick testing if empty
    const initDbi: Record<string, number> = {};
    QUESTIONS_DBI.forEach((q) => { initDbi[q.ma] = 2; });
    setAnswersDbi(initDbi);

    const initLdmi: Record<string, number> = {};
    applicableLdmiQuestions.forEach((q) => { initLdmi[q.ma] = 2; });
    // Simulate some real variance for testing R07
    if (initLdmi['VT2']) initLdmi['VT2'] = 1; // Low route planning
    if (initLdmi['VT1']) initLdmi['VT1'] = 2;
    if (initLdmi['VT3']) initLdmi['VT3'] = 3;
    setAnswersLdmi(initLdmi);

    const initMetrics: Record<string, { trang_thai: 'co_do' | 'uoc_luong' | 'khong_do'; gia_tri?: number }> = {};
    applicableMetrics.forEach((m) => {
      initMetrics[m.ma] = { trang_thai: 'co_do', gia_tri: 15 };
    });
    if (initMetrics['K01']) initMetrics['K01'] = { trang_thai: 'khong_do' }; // Triggers 1.1 multiplier in R07!
    setAnswersMetrics(initMetrics);
  }, [c04Branch]);

  // Show auto-save toast when answering
  const triggerAutoSave = () => {
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2000);
  };

  // Submit and calculate results (R03 - R09)
  const handleSubmitAssessment = async () => {
    // Validate required questions (M05.08)
    const missing: string[] = [];
    QUESTIONS_DBI.forEach((q) => {
      if (!answersDbi[q.ma]) missing.push(`DBI: ${q.ma} - ${q.noi_dung.substring(0, 30)}...`);
    });
    applicableLdmiQuestions.forEach((q) => {
      if (!answersLdmi[q.ma]) missing.push(`LDMI: ${q.ma} - ${q.noi_dung.substring(0, 30)}...`);
    });

    if (missing.length > 0) {
      setMissingErrors(missing);
      alert(`Còn ${missing.length} câu hỏi bắt buộc chưa trả lời. Vui lòng hoàn thành để nộp bài.`);
      return;
    }

    setIsSubmitting(true);
    const startTime = performance.now();

    // 1. Calculate DBI (TOPSIS R04)
    const dbiRes = tinhDbiScore(answersDbi);

    // 2. Calculate LDMI & Group Scores with bottlenecks (R05, R06)
    const ldmiRes = tinhLdmiScore(c04Branch, answersLdmi, c05Services);

    // 3. Identify Top 3 Gaps & Next Steps (R07, R19)
    const topGaps = xacDinhKhoangTrong(
      c04Branch,
      ldmiRes.diem_nhom,
      answersLdmi,
      answersMetrics,
      ldmiRes.muc,
      selectedPriorities
    );

    // 4. Match Solutions with 7 Components (R08, R09)
    const matching = ghepNoiGiaiPhap(
      c04Branch,
      currentScale,
      ldmiRes.muc,
      topGaps,
      selectedPriorities,
      selectedBudget,
      { nhanSu: p04Staff, duLieu: p05Data, lanhDao: p06Leadership },
      selectedSoftware
    );

    // 5. Generate AI Diễn giải (M33)
    const aiInterp = await taoDienGiaiAi(
      c04Branch,
      dbiRes.muc_ten,
      ldmiRes.muc_ten,
      topGaps,
      selectedPriorities,
      selectedBudget,
      freeText
    );

    const endTime = performance.now();
    const processingMs = Math.round(endTime - startTime);

    const newAssessmentId = `asm-${Date.now()}`;
    const record: AssessmentRecord = {
      id: newAssessmentId,
      userId: currentUser.id,
      companyName: currentUser.companyName || 'Doanh nghiệp Logistics',
      branch: c04Branch,
      dichVu3pl: c04Branch === '3PL' ? c05Services : undefined,
      scale: currentScale,
      answersDbi,
      answersLdmi,
      answersMetrics,
      priorities: selectedPriorities,
      budget: selectedBudget,
      readiness: { nhanSu: p04Staff, duLieu: p05Data, lanhDao: p06Leadership },
      currentSoftware: selectedSoftware,
      freeText,
      dbiResult: dbiRes,
      ldmiResult: ldmiRes,
      topGaps,
      recommendations: matching.de_xuat_xac_thuc,
      aiInterpretation: aiInterp,
      status: 'da_cham',
      createdAt: new Date().toISOString(),
      processingMs,
    };

    storage.saveAssessment(record);
    setIsSubmitting(false);
    onFinishAssessment(newAssessmentId);
  };

  const STAGES = [
    { id: 0, title: 'Hồ sơ quy mô' },
    { id: 1, title: 'Chung DBI' },
    { id: 2, title: `Logistics ${c04Branch}` },
    { id: 3, title: 'Chỉ số mốc' },
    { id: 4, title: 'Ưu tiên & Ngân sách' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner & Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                M05.01 · ĐÁNH GIÁ ĐẦY ĐỦ
              </span>
              {draftSavedToast && (
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium transition-opacity">
                  <CheckCircle2 className="w-3 h-3" /> Tự động lưu nháp (M05.06)
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Bài đánh giá Trưởng thành số Logistics & DBI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Khoảng 21–29 câu hỏi theo nhánh {c04Branch} · Dự kiến 10–12 phút · Có lưu nháp tự động
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Hủy / Về sau
            </button>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                activeStage === s.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                  : s.id < activeStage
                  ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 font-medium'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-70">Bước {s.id + 1}</div>
              <div className="text-xs truncate">{s.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STAGE 0: HỒ SƠ PHÂN LOẠI QUY MÔ (C01 - C06, R01) */}
      {activeStage === 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Thông tin quy mô & Lĩnh vực hoạt động
              </h3>
              <p className="text-xs text-slate-500">
                Căn cứ Điều 5 Nghị định 80/2021/NĐ-CP (lĩnh vực thương mại, dịch vụ)
              </p>
            </div>
            {/* Real-time calculated scale badge (R01) */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Quy mô tự tính (R01):</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800">
                <Building2 className="w-3.5 h-3.5" />
                {getTenQuyMo(currentScale)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                C01. Số lao động tham gia bảo hiểm xã hội bình quân năm (Tiêu chí bắt buộc)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUESTIONS_PHAN_LOAI[0].lua_chon.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setC01(item.id as any); triggerAutoSave(); }}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      c01 === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  C02. Tổng doanh thu năm trước liền kề
                </label>
                <div className="space-y-2">
                  {QUESTIONS_PHAN_LOAI[1].lua_chon.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setC02(item.id as any); triggerAutoSave(); }}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all ${
                        c02 === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  C03. Tổng nguồn vốn cuối năm trước liền kề
                </label>
                <div className="space-y-2">
                  {QUESTIONS_PHAN_LOAI[2].lua_chon.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setC03(item.id as any); triggerAutoSave(); }}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all ${
                        c03 === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                C04. Hoạt động logistics chính của doanh nghiệp (Quyết định bộ câu hỏi R02)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'VT', text: 'Vận tải nội địa (VT)' },
                  { id: 'FF', text: 'Giao nhận quốc tế (FF)' },
                  { id: 'KB', text: 'Kho bãi (KB)' },
                  { id: '3PL', text: '3PL / 4PL Logistics' },
                  { id: 'LM', text: 'Chặng cuối (LM)' },
                  { id: 'KH', text: 'Khác (Có logistics riêng)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setC04Branch(item.id as BranchCode); triggerAutoSave(); }}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      c04Branch === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* If 3PL: Multi-service selection C05 */}
            {c04Branch === '3PL' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-900 mb-2">
                  C05. Đối với 3PL: Vui lòng chọn các dịch vụ đang cung cấp (Quyết định các nhóm câu hỏi sẽ hỏi)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUESTIONS_PHAN_LOAI[4].lua_chon.map((item) => {
                    const isChecked = c05Services.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setC05Services(c05Services.filter((s) => s !== item.id));
                          } else {
                            setC05Services([...c05Services, item.id]);
                          }
                          triggerAutoSave();
                        }}
                        className={`p-2.5 rounded-lg border text-xs text-left flex items-center justify-between ${
                          isChecked ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-bold' : 'border-amber-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>{item.text}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                C06. Quy mô đặc thù theo nhánh (Số lượng xe / Số lô tháng / Diện tích kho m²)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 30 xe tải, 5.000m² kho..."
                value={c06ScaleValue}
                onChange={(e) => setC06ScaleValue(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage(1)}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Tiếp tục: Phần chung DBI (12 câu)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 1: PHẦN CHUNG DBI (12 CÂU) */}
      {activeStage === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Phần chung DBI (Chỉ số Trưởng thành Số Doanh nghiệp)
              </h3>
              <p className="text-xs text-slate-500">
                12 câu hỏi đo lường 6 trụ cột · Phương pháp TOPSIS chuẩn quốc gia
              </p>
            </div>
            <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              12 CÂU HỎI
            </span>
          </div>

          <div className="space-y-6">
            {QUESTIONS_DBI.map((q, idx) => (
              <div key={q.ma} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-100 text-blue-800">
                    {q.ma}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Trụ cột: {q.tru_cot_dbi?.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3">
                  {idx + 1}. {q.noi_dung}
                </p>

                <div className="space-y-2">
                  {q.phuong_an?.map((opt) => {
                    const isSelected = answersDbi[q.ma] === opt.muc;
                    return (
                      <button
                        key={opt.muc}
                        type="button"
                        onClick={() => {
                          setAnswersDbi({ ...answersDbi, [q.ma]: opt.muc });
                          triggerAutoSave();
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.noi_dung}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage(0)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Bước trước
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(2)}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Tiếp tục: Phần Logistics {c04Branch} ({applicableLdmiQuestions.length} câu)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: PHẦN LOGISTICS CHUYÊN NGÀNH LDMI (THEO NHÁNH R02) */}
      {activeStage === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. Phần Chuyên ngành Logistics LDMI (Nhánh {c04Branch})
              </h3>
              <p className="text-xs text-slate-500">
                Chỉ hỏi các câu năng lực thực tế áp dụng cho mô hình doanh nghiệp của bạn (R02)
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              {applicableLdmiQuestions.length} CÂU HỎI
            </span>
          </div>

          <div className="space-y-6">
            {applicableLdmiQuestions.map((q, idx) => (
              <div key={q.ma} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800">
                      {q.ma}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      Nhóm: {q.nhom_nang_luc}
                    </span>
                  </div>

                  {/* Clickable Glossary hints (M05.09) */}
                  {(q.noi_dung.includes('TMS') || q.noi_dung.includes('WMS') || q.noi_dung.includes('OTIF') || q.noi_dung.includes('ePOD') || q.noi_dung.includes('FMS')) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (q.noi_dung.includes('TMS')) setActiveGlossaryTerm('TMS');
                        else if (q.noi_dung.includes('WMS')) setActiveGlossaryTerm('WMS');
                        else if (q.noi_dung.includes('OTIF')) setActiveGlossaryTerm('OTIF');
                        else if (q.noi_dung.includes('ePOD')) setActiveGlossaryTerm('ePOD');
                        else if (q.noi_dung.includes('FMS')) setActiveGlossaryTerm('FMS');
                      }}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <HelpCircle className="w-3 h-3" />
                      Giải thích thuật ngữ (M05.09)
                    </button>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3">
                  {idx + 1}. {q.noi_dung}
                </p>

                <div className="space-y-2">
                  {q.phuong_an?.map((opt) => {
                    const isSelected = answersLdmi[q.ma] === opt.muc;
                    return (
                      <button
                        key={opt.muc}
                        type="button"
                        onClick={() => {
                          setAnswersLdmi({ ...answersLdmi, [q.ma]: opt.muc });
                          triggerAutoSave();
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.noi_dung}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage(1)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Bước trước
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(3)}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Tiếp tục: Chỉ số Logistics mốc ({applicableMetrics.length} chỉ số)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: 13 CHỈ SỐ LOGISTICS (MỐC TRƯỚC TRIỂN KHAI, R07 MULTIPLIER 1.1) */}
      {activeStage === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Chỉ số Logistics – Thiết lập mốc trước triển khai (K01–K13)
              </h3>
              <p className="text-xs text-slate-500">
                Nếu chọn "Không đo", hệ số khoảng trống của nhóm liên quan sẽ nhân thêm 1,1 (R07)
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg">
              {applicableMetrics.length} CHỈ SỐ ÁP DỤNG
            </span>
          </div>

          <div className="space-y-4">
            {applicableMetrics.map((m) => {
              const currentVal = answersMetrics[m.ma] || { trang_thai: 'co_do', gia_tri: 0 };
              return (
                <div key={m.ma} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-purple-100 text-purple-800">
                        {m.ma}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {m.ten} ({m.don_vi})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Nhóm: {m.nhom} · {m.he_qua}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAnswersMetrics({
                          ...answersMetrics,
                          [m.ma]: { ...currentVal, trang_thai: 'co_do' }
                        });
                        triggerAutoSave();
                      }}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                        currentVal.trang_thai === 'co_do' ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      ✓ Có đo lường chính xác
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnswersMetrics({
                          ...answersMetrics,
                          [m.ma]: { ...currentVal, trang_thai: 'uoc_luong' }
                        });
                        triggerAutoSave();
                      }}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                        currentVal.trang_thai === 'uoc_luong' ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      ~ Có ước lượng sơ bộ
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnswersMetrics({
                          ...answersMetrics,
                          [m.ma]: { ...currentVal, trang_thai: 'khong_do' }
                        });
                        triggerAutoSave();
                      }}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                        currentVal.trang_thai === 'khong_do' ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      ✕ Không đo (Tăng khoảng trống x1.1)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage(2)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Bước trước
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(4)}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Tiếp tục: Ưu tiên & Ngân sách (P01-P10)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: ƯU TIÊN, NGÂN SÁCH, MỨC SẴN SÀNG (P01-P10) */}
      {activeStage === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                5. Ưu tiên, Ngân sách & Sẵn sàng triển khai
              </h3>
              <p className="text-xs text-slate-500">
                Đầu vào trực tiếp cho bộ máy ghép nối 7 thành phần (R08) và bậc phí hồ sơ nhu cầu (R12)
              </p>
            </div>
            <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              BƯỚC CUỐI
            </span>
          </div>

          <div className="space-y-5">
            {/* P01: Ưu tiên 6 tháng */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                P01. Nếu chỉ cải thiện được 1 đến 2 vấn đề trong 6 tháng tới, doanh nghiệp ưu tiên nhất điều gì? (Chọn tối đa 2)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUESTIONS_PRIORITY.P01.lua_chon.map((item) => {
                  const isChecked = selectedPriorities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedPriorities(selectedPriorities.filter((p) => p !== item.id));
                        } else {
                          if (selectedPriorities.length >= 2) {
                            setSelectedPriorities([selectedPriorities[1], item.id]);
                          } else {
                            setSelectedPriorities([...selectedPriorities, item.id]);
                          }
                        }
                        triggerAutoSave();
                      }}
                      className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                        isChecked ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.text}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* P02: Ngân sách */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                P02. Ngân sách dự kiến đầu tư cho công nghệ trong 12 tháng tới (Quyết định bậc phí hồ sơ R12)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUESTIONS_PRIORITY.P02.lua_chon.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setSelectedBudget(item.id); triggerAutoSave(); }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      selectedBudget === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* P03: Thời điểm */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                P03. Thời điểm doanh nghiệp muốn triển khai giải pháp
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUESTIONS_PRIORITY.P03.lua_chon.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setSelectedTiming(item.id); triggerAutoSave(); }}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      selectedTiming === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* P04-P06: Mức sẵn sàng */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  P04. Nhân sự phụ trách
                </label>
                <div className="space-y-1.5">
                  {QUESTIONS_PRIORITY.P04.lua_chon.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setP04Staff(item.id); triggerAutoSave(); }}
                      className={`w-full p-2 rounded-lg border text-xs text-left ${
                        p04Staff === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  P05. Dữ liệu hiện có
                </label>
                <div className="space-y-1.5">
                  {QUESTIONS_PRIORITY.P05.lua_chon.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setP05Data(item.id); triggerAutoSave(); }}
                      className={`w-full p-2 rounded-lg border text-xs text-left ${
                        p05Data === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  P06. Cam kết lãnh đạo
                </label>
                <div className="space-y-1.5">
                  {QUESTIONS_PRIORITY.P06.lua_chon.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setP06Leadership(item.id); triggerAutoSave(); }}
                      className={`w-full p-2 rounded-lg border text-xs text-left ${
                        p06Leadership === item.id ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* P07: Phần mềm đang dùng */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                P07. Phần mềm doanh nghiệp đang dùng hiện tại (chọn nhiều để khớp tích hợp)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUESTIONS_PRIORITY.P07.lua_chon.map((item) => {
                  const isChecked = selectedSoftware.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSoftware(selectedSoftware.filter((s) => s !== item.id));
                        } else {
                          setSelectedSoftware([...selectedSoftware, item.id]);
                        }
                        triggerAutoSave();
                      }}
                      className={`p-2.5 rounded-lg border text-xs text-left flex items-center justify-between ${
                        isChecked ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.text}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* P10: Ý kiến tự do */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                P10. Chia sẻ thêm về bài toán vận hành hoặc lo ngại lớn nhất (Dùng cho AI diễn giải)
              </label>
              <textarea
                rows={2}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Ví dụ: Xe về rỗng nhiều, không biết tuyến nào lỗ..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveStage(3)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Bước trước
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitAssessment}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang chấm điểm TOPSIS & LDMI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Nộp bài & Xem kết quả tức thời
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* GLOSSARY TOOLTIP MODAL (M05.09) */}
      {activeGlossaryTerm && LOGISTICS_GLOSSARY[activeGlossaryTerm] && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold font-mono text-blue-700">
                {LOGISTICS_GLOSSARY[activeGlossaryTerm].thuat_ngu}
              </span>
              <button
                onClick={() => setActiveGlossaryTerm(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                {LOGISTICS_GLOSSARY[activeGlossaryTerm].ten_day_du}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {LOGISTICS_GLOSSARY[activeGlossaryTerm].dinh_nghia}
              </p>
              <div className="p-2.5 bg-blue-50 rounded-lg text-[11px] text-blue-900">
                {LOGISTICS_GLOSSARY[activeGlossaryTerm].vi_du}
              </div>
            </div>
            <button
              onClick={() => setActiveGlossaryTerm(null)}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
