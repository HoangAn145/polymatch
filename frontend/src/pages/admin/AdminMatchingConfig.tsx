import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Info,
  Scale,
  DollarSign,
  Handshake,
  ShieldCheck,
  Save,
  Zap
} from 'lucide-react';
import { MatchingWeights } from '../../types';

export const AdminMatchingConfig: React.FC = () => {
  const { 
    matchingWeights, 
    updateMatchingWeights, 
    navigate,
    platformPricing,
    updatePlatformPricing
  } = useApp();

  const [wGap, setWGap] = useState<number>(matchingWeights.dbiGapWeight);
  const [wBudget, setWBudget] = useState<number>(matchingWeights.budgetWeight);
  const [wIndustry, setWIndustry] = useState<number>(matchingWeights.industryWeight);
  const [wSize, setWSize] = useState<number>(matchingWeights.sizeWeight);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Platform pricing state
  const [smeFee, setSmeFee] = useState<number>(platformPricing.smeLeadUnlockFee);
  const [largeFee, setLargeFee] = useState<number>(platformPricing.largeLeadUnlockFee);
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState(false);

  // Precise sum calculation
  const totalWeight = Math.round((wGap + wBudget + wIndustry + wSize) * 100) / 100;
  const isValidSum = Math.abs(totalWeight - 1.0) < 0.001;

  // Auto-normalize function to force sum to exactly 1.0
  const handleAutoNormalize = () => {
    const currentSum = wGap + wBudget + wIndustry + wSize;
    if (currentSum === 0) {
      setWGap(0.25);
      setWBudget(0.25);
      setWIndustry(0.25);
      setWSize(0.25);
      return;
    }
    const factor = 1.0 / currentSum;
    const nGap = Math.round(wGap * factor * 100) / 100;
    const nBudget = Math.round(wBudget * factor * 100) / 100;
    const nInd = Math.round(wIndustry * factor * 100) / 100;
    const nSize = Math.round((1.0 - (nGap + nBudget + nInd)) * 100) / 100;

    setWGap(nGap);
    setWBudget(nBudget);
    setWIndustry(nInd);
    setWSize(nSize);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSum) {
      alert('Không thể lưu: Tổng 4 trọng số bắt buộc phải bằng chính xác 1.0 (100%)!');
      return;
    }

    const success = updateMatchingWeights({
      dbiGapWeight: wGap,
      budgetWeight: wBudget,
      industryWeight: wIndustry,
      sizeWeight: wSize
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bảng điều khiển Admin</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-600" />
            <span>Cấu hình Trọng số Thuật toán Khớp nối AI (Matching Engine)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Hiệu chỉnh tỷ trọng ảnh hưởng của từng nhân tố khi tính toán % tương thích giải pháp cho doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Strict Sum Status Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isValidSum 
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isValidSum ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {isValidSum ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-sm font-extrabold">
              {isValidSum 
                ? 'Tổng trọng số hợp lệ: 1.00 (100%)' 
                : `CẢNH BÁO TOÁN HỌC: Tổng trọng số hiện tại là ${Math.round(totalWeight * 100)}% (${totalWeight.toFixed(2)})`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isValidSum 
                ? 'Hệ số ma trận tương thích đạt chuẩn toán học để xếp hạng danh mục khuyến nghị.' 
                : 'Quy chế bắt buộc: Tổng 4 trọng số phải bằng chính xác 1.0 (100%) mới được phép áp dụng.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoNormalize}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            isValidSum 
              ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300' 
              : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-sm'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Tự động cân bằng về 1.0 (Normalize)</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Cập nhật cấu hình trọng số thành công! Thuật toán đã được áp dụng toàn hệ thống.</span>
        </div>
      )}

      {/* Main Sliders Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Slider 1: DBI Gap */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800">
              1. Trọng số Khắc phục Điểm nghẽn DBI (DBI Gap Weight)
            </span>
            <span className="text-purple-700 font-extrabold text-sm px-3 py-1 rounded bg-purple-100">
              {Math.round(wGap * 100)}% ({wGap.toFixed(2)})
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ưu tiên các giải pháp trực tiếp cải thiện trụ cột có điểm số thấp nhất của doanh nghiệp.
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={wGap}
            onChange={(e) => setWGap(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* Slider 2: Budget */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800">
              2. Trọng số Phù hợp Ngân sách Đầu tư (Budget Alignment Weight)
            </span>
            <span className="text-teal-700 font-extrabold text-sm px-3 py-1 rounded bg-teal-100">
              {Math.round(wBudget * 100)}% ({wBudget.toFixed(2)})
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Mức độ tương thích giữa giá niêm yết của giải pháp và gói ngân sách dự kiến của doanh nghiệp mua.
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={wBudget}
            onChange={(e) => setWBudget(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>

        {/* Slider 3: Industry */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800">
              3. Trọng số Tương thích Chuyên ngành (Industry Match Weight)
            </span>
            <span className="text-blue-700 font-extrabold text-sm px-3 py-1 rounded bg-blue-100">
              {Math.round(wIndustry * 100)}% ({wIndustry.toFixed(2)})
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Đánh giá theo lịch sử triển khai thành công tại các doanh nghiệp trong 25 phân ngành kinh tế.
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={wIndustry}
            onChange={(e) => setWIndustry(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Slider 4: Size */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800">
              4. Trọng số Quy mô Doanh nghiệp (Enterprise Size Weight: SME / Large)
            </span>
            <span className="text-amber-700 font-extrabold text-sm px-3 py-1 rounded bg-amber-100">
              {Math.round(wSize * 100)}% ({wSize.toFixed(2)})
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Khớp độ phức tạp của phần mềm với số lượng nhân sự và cơ cấu tổ chức phòng ban.
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={wSize}
            onChange={(e) => setWSize(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs">
            Tổng cộng: <strong className={isValidSum ? 'text-emerald-700' : 'text-rose-600'}>
              {Math.round(totalWeight * 100)}% / 100%
            </strong>
          </div>

          <button
            type="submit"
            disabled={!isValidSum}
            className={`px-8 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              isValidSum 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Lưu & Kích hoạt Thuật toán Mới</span>
          </button>
        </div>
      </form>

      {/* Platform Pricing & Pay-per-Lead Policy Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Chính sách Thu phí Nền tảng (Monetization Engine)</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Cấu hình Thu phí Mở Lead & Quy chế Giao dịch
            </h2>
            <p className="text-xs text-slate-500">
              Thiết lập biểu phí mở khóa hồ sơ RFQ cho nhà cung cấp theo quy mô doanh nghiệp.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Handshake className="w-4 h-4 text-emerald-600" />
            <span>Chấp nhận giao dịch ngoài: ĐANG BẬT</span>
          </div>
        </div>

        {/* Core Logic Explainer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Nguyên tắc vận hành mô hình Pay-per-Lead của Nền tảng:</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            1. <strong>Phí mở lead:</strong> Thu khi vendor chủ động bấm xem chi tiết một lead / RFQ có nhu cầu thật. Không mở thì không thu.<br />
            2. <strong>Không rủi ro:</strong> Nếu không thu được hợp đồng thì vendor cũng không mất gì thêm, không chịu phí thuê bao duy trì hàng tháng.<br />
            3. <strong>Chấp nhận giao dịch ngoài:</strong> Vendor có thể mở rồi tự do giao dịch, ký hợp đồng và nhận tiền bên ngoài. Nền tảng hoàn toàn chấp nhận vì đã thu phí mở lead ngay từ đầu.
          </p>
        </div>

        {/* Fee Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Phí mở Lead Doanh nghiệp SME (&lt; 500 nhân sự)
            </label>
            <p className="text-[11px] text-slate-500">
              Áp dụng cho các hồ sơ chẩn đoán DBI từ doanh nghiệp vừa và nhỏ.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={10000}
                min={0}
                value={smeFee}
                onChange={(e) => setSmeFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <span className="text-xs font-bold text-slate-500 shrink-0">VNĐ / lead</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Phí mở Lead Doanh nghiệp Lớn (&ge; 500 nhân sự / Cấp 4, 5)
            </label>
            <p className="text-[11px] text-slate-500">
              Hồ sơ dự án chuyển đổi số cấp tập đoàn, yêu cầu kỹ thuật phức tạp.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={10000}
                min={0}
                value={largeFee}
                onChange={(e) => setLargeFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <span className="text-xs font-bold text-slate-500 shrink-0">VNĐ / lead</span>
            </div>
          </div>
        </div>

        {pricingSaveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Đã lưu thành công biểu phí mở lead mới! Toàn bộ vendor sẽ áp dụng mức giá này.</span>
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              updatePlatformPricing({
                smeLeadUnlockFee: smeFee,
                largeLeadUnlockFee: largeFee
              });
              setPricingSaveSuccess(true);
              setTimeout(() => setPricingSaveSuccess(false), 2500);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Cập nhật Biểu phí Nền tảng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
