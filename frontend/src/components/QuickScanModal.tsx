import React, { useState } from 'react';
import { QUESTIONS_QUICK_SCAN } from '../data/questions';
import { storage } from '../lib/storage';
import { BranchCode, GroupCode } from '../data/questions';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck,
  Building,
  RotateCcw
} from 'lucide-react';

interface QuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAndRegister: () => void;
  onStartFullAssessment?: () => void;
}

export const QuickScanModal: React.FC<QuickScanModalProps> = ({
  isOpen,
  onClose,
  onCompleteAndRegister,
  onStartFullAssessment,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const totalQuestions = QUESTIONS_QUICK_SCAN.length;
  const currentQ = QUESTIONS_QUICK_SCAN[currentStep];

  const handleSelectOption = (qMa: string, optionId: string) => {
    const updated = { ...answers, [qMa]: optionId };
    setAnswers(updated);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishScan(updated);
    }
  };

  const finishScan = (finalAnswers: Record<string, string>) => {
    // Determine 3 recommended areas based on Q03-Q09 responses (M04.02)
    const suggestedAreas: { code: GroupCode; name: string; reason: string }[] = [];

    // Check VT (Vận tải)
    if (finalAnswers['Q03'] === 'chua' || finalAnswers['Q05'] === 'zalo' || finalAnswers['Q10'] === 'chi_phi_cao') {
      suggestedAreas.push({
        code: 'VT',
        name: 'Vận tải & Lập tuyến',
        reason: 'Chưa có phần mềm quản lý vận tải TMS hoặc vẫn điều hành xe thủ công qua Zalo/Excel.',
      });
    }

    // Check KB (Kho bãi)
    if (finalAnswers['Q04'] === 'chua' || finalAnswers['Q08'] === 'thuong_xuyen' || finalAnswers['Q10'] === 'lech_ton_kho') {
      suggestedAreas.push({
        code: 'KB',
        name: 'Kho bãi & Tồn kho',
        reason: 'Số liệu tồn kho chưa kiểm soát thời gian thực, có nguy cơ lệch kho và dồn ứ đơn.',
      });
    }

    // Check HT (Hiển thị & Tích hợp)
    if (finalAnswers['Q06'] === 'chua_co' || finalAnswers['Q07'] === 'khong' || finalAnswers['Q10'] === 'khong_theo_doi') {
      suggestedAreas.push({
        code: 'HT',
        name: 'Hiển thị & Theo dõi hành trình',
        reason: 'Khách hàng chưa thể tự tra cứu tình trạng hàng, việc theo dõi xe còn phân tán.',
      });
    }

    // Fallback if less than 3
    if (suggestedAreas.length < 3) {
      suggestedAreas.push({
        code: 'CP',
        name: 'Chi phí & Hiệu suất vận hành',
        reason: 'Cần thiết lập bảng điều khiển chỉ số KPI và bóc tách chi phí chi tiết theo tuyến.',
      });
    }
    if (suggestedAreas.length < 3) {
      suggestedAreas.push({
        code: 'DH',
        name: 'Xử lý Đơn hàng & ePOD',
        reason: 'Cần số hóa tiếp nhận đơn và xác nhận giao hàng điện tử để rút ngắn chu kỳ thanh toán.',
      });
    }

    const branch = (finalAnswers['Q01'] as BranchCode) || 'VT';

    // Save session to storage
    storage.saveQuickScan({
      sessionId: `qs-sess-${Date.now()}`,
      answers: finalAnswers,
      topAreas: suggestedAreas.slice(0, 3),
      completedAt: new Date().toISOString(),
      branch,
    });

    setIsCompleted(true);
  };

  const resetScan = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Quick Scan Logistics
              </h3>
              <p className="text-[11px] text-slate-500">
                10 câu hỏi chẩn đoán nhanh · Không cần đăng nhập (~2 phút)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        {!isCompleted && (
          <div className="w-full bg-slate-100 h-1.5">
            <div
              className="bg-blue-600 h-1.5 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* QUESTION VIEW */}
        {!isCompleted ? (
          <div className="p-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
              <span>CÂU HỎI {currentStep + 1} / {totalQuestions}</span>
              <span>{progressPercent}%</span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-5 leading-snug">
              {currentQ.cau_hoi}
            </h4>

            <div className="space-y-2.5">
              {currentQ.lua_chon.map((opt) => {
                const isSelected = answers[currentQ.ma] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.ma, opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Câu trước
              </button>

              <span className="text-[11px] text-slate-400">
                Tự động chuyển câu khi chọn đáp án
              </span>
            </div>
          </div>
        ) : (
          /* RESULT VIEW (M04.02) */
          <div className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Hoàn thành chẩn đoán Quick Scan!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Dựa trên 10 câu trả lời sơ bộ, hệ thống đã phát hiện <strong>3 khu vực trọng yếu</strong> doanh nghiệp cần ưu tiên đánh giá sâu và số hóa:
              </p>
            </div>

            {/* 3 Preliminary Recommended Areas */}
            <div className="space-y-2.5">
              {storage.getQuickScan()?.topAreas.map((area, idx) => (
                <div key={area.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {area.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {area.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Value Proposition Box */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-700" />
                Bước tiếp theo: Làm bài Đánh giá đầy đủ (10–12 phút)
              </div>
              <p className="text-slate-600">
                Để nhận được chỉ số trưởng thành kép <strong>DBI & LDMI chuẩn xác</strong>, bảng tính 7 thành phần đề xuất giải pháp công nghệ và bản diễn giải chuyên sâu, vui lòng tạo tài khoản doanh nghiệp.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onCompleteAndRegister();
                }}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Đăng ký tài khoản để xem giải pháp phù hợp
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={resetScan}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại Quick Scan
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
