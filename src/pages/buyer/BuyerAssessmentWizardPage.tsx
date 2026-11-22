import { sandboxMode } from "../../lib/demoSandbox";
import { OperationalKpiEditor } from "../../components/platform/OperationalKpiEditor";
import type { OperationalKpiInput } from "../../lib/diagnosticEvidence";
import { demoMode } from "../../lib/supabase";
import { budgetFor } from "../../services/assessmentService";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Send,
  Building2,
  Compass,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { DBI_QUESTIONS, LDMI_QUESTIONS } from "../../data/assessmentQuestions";
import { authService } from "../../services/authService";
import { dbService } from "../../services/mockDatabase";
import { assessmentService } from "../../services/assessmentService";
import { useToast } from "../../components/ui/Toast";

const DRAFT_KEY = sandboxMode ? "polymatch_public_demo_assessment_draft" : "polymatch_assessment_draft";

export const BuyerAssessmentWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const enterprise =
    dbService.getEnterprises().find((e) => e.userId === currentUser?.id) ||
    dbService.getEnterprises()[0];

  const [readiness, setReadiness] = useState({
    people: enterprise.san_sang_nhan_su ?? 3,
    data: enterprise.san_sang_du_lieu ?? 3,
    leadership: enterprise.cam_ket_lanh_dao ?? 3,
  });
  const [kpiDraftLoaded, setKpiDraftLoaded] = useState(false);
  const [operationalKpis, setOperationalKpis] = useState<OperationalKpiInput[]>(
    enterprise.operational_kpis || [],
  );
  const [baseline, setBaseline] = useState({
    name: "Tỷ lệ giao đúng hạn",
    value: 0,
    unit: "%",
  });
  const [budget, setBudget] = useState(budgetFor(enterprise));
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    "VT_DIEU_PHOI",
    "DH_EPOD",
  ]);
  const [termModal, setTermModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Applicable LDMI questions for this branch
  const applicableLdmi = LDMI_QUESTIONS.filter((q) =>
    q.nhanh_ap_dung.includes(enterprise.nhanh),
  );

  // Load draft
  useEffect(() => {
    try {
      const metricsDraft = localStorage.getItem(
        `${DRAFT_KEY}_${enterprise.id}_operational`,
      );
      if (metricsDraft) {
        const parsed = JSON.parse(metricsDraft);
        if (Array.isArray(parsed)) setOperationalKpis(parsed);
      }
      const draft = localStorage.getItem(`${DRAFT_KEY}_${enterprise.id}`);
      if (draft) {
        setAnswers(JSON.parse(draft));
      } else if (demoMode) {
        // Pre-seed default answers for comfortable testing
        const initial: Record<string, number> = {};
        DBI_QUESTIONS.forEach((q) => (initial[q.id] = 3));
        applicableLdmi.forEach((q) => (initial[q.id] = 2));
        setAnswers(initial);
      }
    } catch {
      // Ignore
    } finally {
      setKpiDraftLoaded(true);
    }
  }, [enterprise.id]);

  useEffect(() => {
    if (!kpiDraftLoaded) return;
    try {
      localStorage.setItem(
        `${DRAFT_KEY}_${enterprise.id}_operational`,
        JSON.stringify(operationalKpis),
      );
    } catch {}
  }, [operationalKpis, kpiDraftLoaded, enterprise.id]);

  // Autosave draft
  const saveDraft = (updatedAnswers: Record<string, number>) => {
    setAnswers(updatedAnswers);
    try {
      localStorage.setItem(
        `${DRAFT_KEY}_${enterprise.id}`,
        JSON.stringify(updatedAnswers),
      );
    } catch {
      // Ignore
    }
  };

  const handleSelectOption = (questionId: string, level: number) => {
    const updated = { ...answers, [questionId]: level };
    saveDraft(updated);
  };

  const handleManualSaveDraft = () => {
    saveDraft(answers);
    try {
      localStorage.setItem(
        `${DRAFT_KEY}_${enterprise.id}_operational`,
        JSON.stringify(operationalKpis),
      );
    } catch {}
    toast.success(
      "Đã lưu bản nháp",
      "Bạn có thể quay lại làm tiếp bất cứ lúc nào.",
    );
  };

  const stepsList = [
    { num: 1, title: "Xác nhận hồ sơ" },
    { num: 2, title: "Chuyển đổi số chung (DBI)" },
    { num: 3, title: "Năng lực Logistics (LDMI)" },
    { num: 4, title: "Điểm nghẽn & Ưu tiên" },
    { num: 5, title: "Mức sẵn sàng & Ngân sách" },
    { num: 6, title: "Kiểm tra & Nộp bài" },
  ];

  const termsDictionary: Record<string, { title: string; desc: string }> = {
    TMS: {
      title: "Hệ thống Quản lý Vận tải (TMS - Transport Management System)",
      desc: "Phần mềm giúp lập kế hoạch, thực hiện và tối ưu hóa hoạt động vận chuyển hàng hóa, phân xe theo tải trọng và theo dõi hành trình GPS.",
    },
    WMS: {
      title: "Hệ thống Quản lý Kho (WMS - Warehouse Management System)",
      desc: "Phần mềm quản trị chi tiết hoạt động kho: từ nhập kho, lưu kho theo vị trí ô kệ (Bin location), lấy hàng theo đợt và kiểm kê bằng mã vạch/RFID.",
    },
    ePOD: {
      title: "Chứng từ Giao nhận Điện tử (ePOD - electronic Proof of Delivery)",
      desc: "Giải pháp ứng dụng di động cho phép tài xế chụp ảnh kiện hàng, lấy chữ ký điện tử của người nhận và gửi ngay biên bản về kế toán đối soát.",
    },
    OTIF: {
      title: "Chỉ số Đúng Hạn & Đủ Hàng (OTIF - On-Time In-Full)",
      desc: "Thước đo chất lượng dịch vụ logistics: tỷ lệ phần trăm các đơn hàng được giao đúng khung giờ cam kết và đầy đủ số lượng không bị hư hao.",
    },
    IRA: {
      title: "Độ Chính xác Tồn kho (IRA - Inventory Record Accuracy)",
      desc: "Tỷ lệ phần trăm số lượng tồn kho trên sổ sách khớp chính xác tuyệt đối với số lượng thực tế đếm được trong kho hàng.",
    },
  };

  const showTerm = (key: string) => {
    if (termsDictionary[key]) {
      setTermModal(termsDictionary[key]);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const updatedEnterprise = {
        ...enterprise,
        ngan_sach_toi_da_trieu: budget,
        operational_kpis: operationalKpis,
        san_sang_nhan_su: readiness.people,
        san_sang_du_lieu: readiness.data,
        cam_ket_lanh_dao: readiness.leadership,
      };
      dbService.updateEnterprise(enterprise.userId, updatedEnterprise);
      const result = await assessmentService.submit(
        currentUser?.id || "guest",
        updatedEnterprise,
        answers,
        baseline,
      );

      setConfirmSubmitModal(false);
      toast.success(
        "Nộp bài đánh giá thành công!",
        `Kết quả: DBI ${result.dbi_diem}/100 (${result.dbi_muc}), LDMI ${result.ldmi_diem}/100 (${result.ldmi_muc}).`,
      );

      navigate("/buyer/results");
    } catch (err: any) {
      toast.error(
        "Lỗi khi nộp bài",
        err.message || "Không thể tính toán kết quả lúc này.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">Khảo sát Đánh giá Chuyển đổi số</Badge>
            <span className="text-xs text-slate-500">• Tự động lưu nháp</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Đánh giá Mức độ Trưởng thành số & Điểm nghẽn Chuỗi cung ứng
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleManualSaveDraft}
          >
            Lưu nháp
          </Button>
        </div>
      </div>

      <section
        className="bg-white rounded-2xl border p-5 space-y-3"
        aria-label="KPI đầu vào"
      >
        <h2 className="font-bold">KPI đầu vào & Ngân sách thực tế</h2>
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          <label>
            Tên KPI
            <input
              required
              value={baseline.name}
              maxLength={200}
              onChange={(e) =>
                setBaseline({ ...baseline, name: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
          </label>
          <label>
            Giá trị hiện tại
            <input
              required
              type="number"
              min="0"
              step="any"
              value={baseline.value}
              onChange={(e) =>
                setBaseline({ ...baseline, value: e.target.valueAsNumber })
              }
              className="w-full border rounded-lg p-2"
            />
          </label>
          <label>
            Đơn vị
            <input
              required
              value={baseline.unit}
              maxLength={30}
              onChange={(e) =>
                setBaseline({ ...baseline, unit: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
          </label>
          <label>
            Ngân sách 12 tháng (triệu đồng)
            <input
              required
              type="number"
              min="0.01"
              step="any"
              value={budget}
              onChange={(e) => setBudget(e.target.valueAsNumber)}
              className="w-full border rounded-lg p-2"
            />
          </label>
        </div>
      </section>

      <OperationalKpiEditor
        value={operationalKpis}
        onChange={setOperationalKpis}
      />
      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px]">
          {stepsList.map((s, idx) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div
                  onClick={() => setStep(s.num)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-[#1769AA] text-white ring-4 ring-[#1769AA]/20"
                        : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    {isDone ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isCurrent
                        ? "font-bold text-[#1769AA]"
                        : isDone
                          ? "font-medium text-slate-800"
                          : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-3 ${step > idx + 1 ? "bg-emerald-500" : "bg-slate-200"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Enterprise confirmation */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Bước 1: Xác nhận thông tin doanh nghiệp
            </h2>
            <p className="text-xs text-slate-500">
              Kiểm tra thông tin đã đăng ký để hệ thống chọn đúng bộ câu hỏi
              theo đặc thù ngành và quy mô của bạn.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">
                Tên doanh nghiệp:
              </span>
              <p className="font-bold text-slate-800 mt-0.5">
                {enterprise.ten}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Mã số thuế:</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {enterprise.ma_so_thue}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Hoạt động logistics chính:
              </span>
              <p className="font-bold text-[#1769AA] mt-0.5">
                {enterprise.nhanh === "VT" && "Vận tải đường bộ (VT)"}
                {enterprise.nhanh === "KB" && "Kho bãi & Phân phối (KB)"}
                {enterprise.nhanh === "FF" && "Giao nhận quốc tế (FF)"}
                {enterprise.nhanh === "3PL" && "Logistics tích hợp (3PL)"}
                {enterprise.nhanh === "LM" && "Chặng cuối (LM)"}
                {enterprise.nhanh === "KH" && "Khác (KH)"}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Quy mô theo Nghị định 80:
              </span>
              <p className="font-bold text-slate-800 mt-0.5 capitalize">
                {enterprise.quy_mo} ({enterprise.so_lao_dong_bhxh} lao động)
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1">
            <div className="font-bold text-[#1769AA]">
              Lưu ý về bài đánh giá:
            </div>
            <p>
              • Phần chuyển đổi số chung (DBI): gồm 14 câu hỏi khảo sát 7 trụ
              cột chiến lược, khách hàng, vận hành và dữ liệu.
            </p>
            <p>
              • Phần năng lực logistics (LDMI): gồm {applicableLdmi.length} câu
              hỏi chuyên sâu áp dụng riêng cho ngành{" "}
              <strong>{enterprise.nhanh}</strong>.
            </p>
            <p>
              • Thời gian thực hiện: khoảng 8 - 12 phút. Mỗi câu chọn mức phản
              ánh đúng thực tế đang chạy nhất.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Bắt đầu phần Đánh giá DBI &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DBI 14 questions */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-8">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary">Phần 1: Chỉ số DBI (14 câu)</Badge>
              <span className="text-xs text-slate-400">
                Tham chiếu Quyết định 2158/QĐ-BTTTT
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Đánh giá mức độ chuyển đổi số doanh nghiệp chung
            </h2>
          </div>

          <div className="space-y-8">
            {DBI_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                data-question-id={q.id}
                className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#1769AA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-semibold text-[#1769AA] uppercase tracking-wider block">
                        Trụ cột: {q.tru_cot_dbi}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                        {q.tieu_de}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {q.ma}
                  </Badge>
                </div>

                {/* 5 Options */}
                <div className="space-y-2 pt-1">
                  {q.phuong_an.map((opt) => {
                    const isSelected = answers[q.id] === opt.muc;
                    return (
                      <button
                        key={opt.muc}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.muc)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "border-[#1769AA] bg-blue-50/80 text-[#1769AA] font-bold shadow-2xs"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            isSelected
                              ? "border-[#1769AA] bg-[#1769AA] text-white"
                              : "border-slate-300 text-slate-500"
                          }`}
                        >
                          {opt.muc}
                        </span>
                        <span className="flex-1 leading-relaxed">
                          {opt.noi_dung}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(1)}
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(3)}
            >
              Tiếp tục sang phần LDMI &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: LDMI domain questions */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-8">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary">
                Phần 2: Chỉ số LDMI Logistics ({applicableLdmi.length} câu)
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Thuật ngữ:</span>
                {["TMS", "WMS", "ePOD", "OTIF"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => showTerm(t)}
                    className="text-[#1769AA] hover:underline font-semibold cursor-pointer"
                  >
                    [{t}]
                  </button>
                ))}
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Đánh giá năng lực nghiệp vụ logistics đặc thù ngành{" "}
              {enterprise.nhanh}
            </h2>
          </div>

          <div className="space-y-8">
            {applicableLdmi.map((q, idx) => (
              <div
                key={q.id}
                data-question-id={q.id}
                className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                        Nhóm: {q.nhom_nang_luc}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                        {q.tieu_de}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {q.ma}
                  </Badge>
                </div>

                {/* 5 Options */}
                <div className="space-y-2 pt-1">
                  {q.phuong_an.map((opt) => {
                    const isSelected = answers[q.id] === opt.muc;
                    return (
                      <button
                        key={opt.muc}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.muc)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-2xs"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 text-slate-500"
                          }`}
                        >
                          {opt.muc}
                        </span>
                        <span className="flex-1 leading-relaxed">
                          {opt.noi_dung}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(4)}
            >
              Tiếp tục sang Điểm nghẽn & Ưu tiên &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Bottlenecks & Priorities */}
      {step === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <Badge variant="warning">Phần 3: Điểm nghẽn & Định hướng</Badge>
            <h2 className="text-lg font-bold text-slate-900">
              Chọn 1 đến 2 ưu tiên chiến lược trong 6 tháng tới
            </h2>
            <p className="text-xs text-slate-500">
              Hệ thống sẽ dùng ưu tiên này để trọng số hóa các giải pháp công
              nghệ đề xuất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                id: "VT_DIEU_PHOI",
                title: "Giảm thời gian chờ điều xe & tự động hóa lịch chạy",
              },
              {
                id: "VT_CHAY_RONG",
                title: "Cắt giảm chi phí nhiên liệu & quản lý xe chạy rỗng",
              },
              {
                id: "KB_TON_KHO",
                title: "Nâng cao độ chính xác tồn kho & kiểm kê mã vạch",
              },
              {
                id: "KB_LAY_HANG",
                title: "Tối ưu vị trí sắp xếp kho & tăng năng suất nhặt hàng",
              },
              {
                id: "DH_EPOD",
                title:
                  "Bằng chứng giao hàng điện tử ePOD & rút ngắn đối soát cước",
              },
              {
                id: "GN_BAO_GIA",
                title:
                  "Tự động hóa báo giá cước và tra cứu container cho khách",
              },
              {
                id: "HT_TICH_HOP",
                title: "Tích hợp thông suốt giữa phần mềm vận hành và kế toán",
              },
              {
                id: "XA_PHAT_THAI",
                title:
                  "Đo lường phát thải khí nhà kính (CO₂e) đáp ứng thầu xanh",
              },
            ].map((p) => {
              const selected = selectedPriorities.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      setSelectedPriorities(
                        selectedPriorities.filter((x) => x !== p.id),
                      );
                    } else {
                      if (selectedPriorities.length >= 2) {
                        setSelectedPriorities([selectedPriorities[1], p.id]);
                      } else {
                        setSelectedPriorities([...selectedPriorities, p.id]);
                      }
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 cursor-pointer transition-colors ${
                    selected
                      ? "border-[#1769AA] bg-blue-50/70 text-[#1769AA] font-bold shadow-2xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center text-xs mt-0.5 ${selected ? "bg-[#1769AA] text-white" : "border border-slate-300"}`}
                  >
                    {selected && "✓"}
                  </span>
                  <span className="leading-relaxed">{p.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(3)}
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(5)}
            >
              Tiếp tục sang Mức sẵn sàng &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Readiness & Budget */}
      {step === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <Badge variant="primary">Phần 4: Nguồn lực & Mức sẵn sàng</Badge>
            <h2 className="text-lg font-bold text-slate-900">
              Đánh giá điều kiện thực thi & khả năng tiếp nhận công nghệ
            </h2>
          </div>

          <div className="space-y-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                1. Mức độ sẵn sàng của nhân sự vận hành (Tài xế, Thủ kho, Điều
                phối):
              </label>
              <select
                value={readiness.people}
                onChange={(e) => {
                  setReadiness({
                    ...readiness,
                    people: Number(e.target.value),
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="1">
                  Mức 1: Nhân sự ngại thay đổi, chưa từng dùng ứng dụng công
                  việc
                </option>
                <option value="2">
                  Mức 2: Dùng được smartphone cơ bản, cần hướng dẫn cầm tay chỉ
                  việc
                </option>
                <option value="3">
                  Mức 3: Đã quen dùng Zalo/Google Sheet, có thể đào tạo trong
                  1-2 tuần
                </option>
                <option value="4">
                  Mức 4: Đội ngũ nòng cốt thành thạo máy tính, sẵn sàng thích
                  ứng
                </option>
                <option value="5">
                  Mức 5: Nhân sự chủ động đề xuất sáng kiến số hóa
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                2. Mức độ sẵn sàng của dữ liệu vận hành:
              </label>
              <select
                value={readiness.data}
                onChange={(e) => {
                  setReadiness({ ...readiness, data: Number(e.target.value) });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="1">
                  Mức 1: Dữ liệu nằm trên sổ sách giấy hoặc trí nhớ cá nhân
                </option>
                <option value="2">
                  Mức 2: Dữ liệu trên Excel nhưng rời rạc, sai lệch nhiều
                </option>
                <option value="3">
                  Mức 3: Đã chuẩn hóa danh mục xe, tài xế, mã khách hàng trên
                  file
                </option>
                <option value="4">
                  Mức 4: Dữ liệu có cấu trúc chuẩn, sẵn sàng import vào phần mềm
                </option>
                <option value="5">
                  Mức 5: Có cơ sở dữ liệu số hóa liên tục và làm sạch định kỳ
                </option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                3. Sự cam kết và bảo trợ của Ban Lãnh đạo:
              </label>
              <select
                value={readiness.leadership}
                onChange={(e) => {
                  setReadiness({
                    ...readiness,
                    leadership: Number(e.target.value),
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
              >
                <option value="1">
                  Mức 1: Lãnh đạo chưa ưu tiên, chỉ tìm hiểu cho biết
                </option>
                <option value="2">
                  Mức 2: Đồng ý về chủ trương nhưng chưa bố trí người phụ trách
                </option>
                <option value="3">
                  Mức 3: Đã giao đầu mối quản lý dự án chuyển đổi số
                </option>
                <option value="4">
                  Mức 4: Trực tiếp giám sát các mốc tiến độ và giải quyết vướng
                  mắc
                </option>
                <option value="5">
                  Mức 5: Coi chuyển đổi số là chiến lược sống còn của doanh
                  nghiệp
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(4)}
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(6)}
            >
              Kiểm tra & Nộp bài &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: Review & Final Submission */}
      {step === 6 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <Badge variant="success">Bước cuối: Kiểm tra câu trả lời</Badge>
            <h2 className="text-lg font-bold text-slate-900">
              Kiểm tra lại toàn bộ khảo sát trước khi tính điểm
            </h2>
            <p className="text-xs text-slate-500">
              Hệ thống sẽ tổng hợp điểm số DBI, LDMI và kích hoạt bộ máy ghép
              nối giải pháp công nghệ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">
                Số câu DBI đã hoàn thành:
              </span>
              <strong className="text-base text-slate-800">
                {
                  Object.keys(answers).filter((k) => k.startsWith("dbi-"))
                    .length
                }{" "}
                / {DBI_QUESTIONS.length}
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">
                Số câu LDMI đã hoàn thành:
              </span>
              <strong className="text-base text-slate-800">
                {
                  Object.keys(answers).filter((k) => k.startsWith("ldmi-"))
                    .length
                }{" "}
                / {applicableLdmi.length}
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block">
                Ưu tiên 6 tháng đã chọn:
              </span>
              <strong className="text-base text-slate-800">
                {selectedPriorities.length} mục tiêu
              </strong>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Sẵn sàng nộp bài đánh giá:</span>
            </div>
            <p className="leading-relaxed">
              Tất cả câu hỏi bắt buộc đã được điền đầy đủ. Khi bấm{" "}
              <strong>Nộp bài chính thức</strong>, kết quả sẽ được ghi vào lịch
              sử đánh giá của doanh nghiệp và tạo báo cáo radar phân tích tức
              thì.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(5)}
            >
              Quay lại chỉnh sửa
            </Button>

            <Button
              variant="primary"
              size="md"
              loading={loading}
              rightIcon={<Send className="w-4 h-4" />}
              onClick={() => setConfirmSubmitModal(true)}
            >
              Xác nhận Nộp bài đánh giá
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmSubmitModal}
        onClose={() => setConfirmSubmitModal(false)}
        title="Xác nhận nộp bài đánh giá chuyển đổi số"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmSubmitModal(false)}
            >
              Xem lại
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleFinalSubmit}
            >
              Đồng ý nộp bài
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          Bạn có chắc chắn muốn chốt các câu trả lời này không? Sau khi nộp, hệ
          thống sẽ lưu kết quả chính thức cho lần đánh giá này và chuyển bạn
          sang màn hình phân tích kết quả chi tiết.
        </p>
      </Modal>

      {/* Terminology Modal */}
      {termModal && (
        <Modal
          isOpen={true}
          onClose={() => setTermModal(null)}
          title={termModal.title}
          maxWidth="sm"
        >
          <div className="text-xs text-slate-700 leading-relaxed space-y-2">
            <p>{termModal.desc}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
