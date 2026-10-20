import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Building2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QUICK_SCAN_QUESTIONS } from '../../data/assessmentQuestions';
import { useToast } from '../../components/ui/Toast';

export const QuickScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUICK_SCAN_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / QUICK_SCAN_QUESTIONS.length) * 100);

  const handleSelectOption = (muc: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: muc }));
  };

  const handleNext = () => {
    if (!answers[currentQ.id]) {
      toast.warning("Vui lòng chọn một phương án", "Hãy chọn mức độ phản ánh gần nhất với thực tế của doanh nghiệp.");
      return;
    }

    if (currentIndex < QUICK_SCAN_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      toast.success("Hoàn tất đánh giá nhanh!", "Đã tính toán sơ bộ 3 khu vực cần trọng tâm chuyển đổi số.");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Compute preliminary scores
  const scoreValues = Object.values(answers);
  const avgLevel = scoreValues.length
    ? Math.round((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) * 10) / 10
    : 2.5;

  const preliminaryScore = Math.round(((avgLevel - 1) / 4) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {!isCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary">Quick Scan • Miễn phí • 2 Phút</Badge>
              <span className="text-xs font-semibold text-slate-500">
                Câu hỏi {currentIndex + 1} / {QUICK_SCAN_QUESTIONS.length}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              Khảo sát nhanh mức độ trưởng thành số logistics
            </h1>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#1769AA] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-right text-[11px] text-slate-400 font-medium">
                {progressPercent}% hoàn thành
              </div>
            </div>
          </div>

          {/* Question card */}
          <div className="bg-slate-50/70 p-6 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#1769AA] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {currentIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.tieu_de}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.phuong_an.map(opt => {
                const isSelected = answers[currentQ.id] === opt.muc;
                return (
                  <button
                    key={opt.muc}
                    type="button"
                    onClick={() => handleSelectOption(opt.muc)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#1769AA] bg-blue-50/70 text-[#1769AA] font-bold shadow-2xs ring-1 ring-[#1769AA]/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#1769AA] bg-[#1769AA] text-white'
                          : 'border-slate-300 text-slate-500 bg-slate-50'
                      }`}
                    >
                      {opt.muc}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.noi_dung}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Quay lại
            </Button>

            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNext}
            >
              {currentIndex === QUICK_SCAN_QUESTIONS.length - 1 ? "Xem kết quả sơ bộ" : "Tiếp theo"}
            </Button>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <Badge variant="success" size="md">
              ✓ Hoàn thành đánh giá sơ bộ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Kết quả Quick Scan của Doanh nghiệp
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Dựa trên 10 câu trả lời khảo sát nhanh, đây là ước tính năng lực số hóa và các bài toán trọng tâm cần tháo gỡ.
            </p>
          </div>

          {/* Big Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/60 p-6 rounded-2xl border border-blue-100">
            <div className="text-center md:text-left space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Điểm số số hóa sơ bộ
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#1769AA]">
                {preliminaryScore} <span className="text-xl text-slate-400 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-600">
                Mức ước tính: <strong className="text-slate-900">{preliminaryScore < 30 ? 'Thủ công sơ khai' : preliminaryScore < 50 ? 'Số hóa cơ bản' : preliminaryScore < 75 ? 'Tích hợp quy trình' : 'Hiển thị nâng cao'}</strong>
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <div className="font-bold text-slate-900 text-sm mb-1">Nhận định sơ bộ:</div>
              <p>• Doanh nghiệp đã nhận thức rõ các rào cản chi phí và có mong muốn áp dụng công nghệ.</p>
              <p>• Các mắt xích điều hành còn phụ thuộc nhiều vào thao tác nhập lại thủ công trên Excel hoặc Zalo.</p>
              <p>• Cần chuẩn hóa dữ liệu trước khi đầu tư các hệ thống phần mềm tốn kém.</p>
            </div>
          </div>

          {/* 3 Focal Areas */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>3 Khu vực trọng tâm nên đánh giá chuyên sâu</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <Badge variant="primary" size="sm">Trọng tâm 1</Badge>
                <h4 className="font-bold text-xs text-slate-900">Điều phối xe & Lệnh vận chuyển điện tử</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Giảm thời gian chờ điều xe, chuẩn hóa mẫu lệnh vận chuyển và kết nối dữ liệu GPS trên bản đồ số.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <Badge variant="warning" size="sm">Trọng tâm 2</Badge>
                <h4 className="font-bold text-xs text-slate-900">Bằng chứng giao hàng số (ePOD)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Thay thế biên bản giao hàng giấy, cho phép tài xế chụp ảnh ký nhận tức thì để rút ngắn thời gian đối soát cước.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <Badge variant="secondary" size="sm">Trọng tâm 3</Badge>
                <h4 className="font-bold text-xs text-slate-900">Quản lý xe chạy rỗng & Giá thành theo tuyến</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đo lường chính xác tỷ lệ km chạy rỗng chiều về và bóc tách biên lợi nhuận của từng tuyến xe.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-[#104D80] rounded-xl p-6 text-white text-center space-y-4">
            <h4 className="font-bold text-lg">Bạn muốn xem bản chẩn đoán đầy đủ và giải pháp đề xuất?</h4>
            <p className="text-xs text-blue-100 max-w-lg mx-auto leading-relaxed">
              Đăng ký tài khoản Doanh nghiệp (hoàn toàn miễn phí) để điền bài đánh giá đầy đủ (12 câu DBI + các câu đặc thù theo ngành), nhận phân tích radar và danh sách giải pháp công nghệ phù hợp ngân sách.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/register/buyer">
                <Button variant="secondary" size="md" className="bg-white text-[#104D80] font-bold">
                  Đăng ký tài khoản Doanh nghiệp (Lưu kết quả)
                </Button>
              </Link>
              <Link to="/buyer/assessment">
                <Button variant="outline" size="md" className="border-white/50 text-white hover:bg-white/10">
                  Làm bài đánh giá đầy đủ (Chế độ Demo)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
