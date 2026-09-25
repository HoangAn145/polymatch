import React from 'react';
import { 
  Compass, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Scale, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface MethodologyViewProps {
  onStartQuickScan: () => void;
  onStartFullAssessment: () => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  onStartQuickScan,
  onStartFullAssessment,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
          M01.04 · CÁCH POLYMATCH CHẤM ĐIỂM
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Phương pháp luận Đánh giá &amp; Nguyên tắc Trung lập
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Minh bạch toàn diện: Từ bộ chỉ số trưởng thành số doanh nghiệp DBI, mô hình trưởng thành số chuyên sâu LDMI, công thức tính khoảng trống đến thuật toán ghép nối giải pháp 7 thành phần.
        </p>
      </div>

      {/* Principle 1: DBI (TOPSIS) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lớp 1: Chỉ số Trưởng thành Số Doanh nghiệp (DBI) theo TOPSIS
            </h2>
            <p className="text-xs text-slate-500">
              Khung đánh giá: Bộ chỉ số đánh giá mức độ trưởng thành số doanh nghiệp (DBI)
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Đo lường 6 trụ cột chuyển đổi số cốt lõi: <em>Khách hàng, Chiến lược, Công nghệ, Vận hành, Văn hóa và Dữ liệu</em> (mỗi trụ cột 2 câu hỏi, thang 5 mức). Điểm số tổng hợp được tính bằng thuật toán <strong>TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</strong>:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 space-y-1.5 border border-slate-200">
          <div>D+ = Khoảng cách Euclid tới giải pháp lý tưởng dương A+ (mọi câu đạt mức 5 = 100đ)</div>
          <div>D- = Khoảng cách Euclid tới giải pháp lý tưởng âm A- (mọi câu mức 1 = 0đ)</div>
          <div className="font-bold text-blue-800 pt-1">
            Hệ số gần gũi Ci = D- / (D+ + D-)  →  Điểm DBI = Ci × 100
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 bg-slate-50 border rounded-lg">
            <span className="font-bold block text-slate-700">Khởi động</span>
            <span className="text-[10px] text-slate-400">&lt; 25 điểm</span>
          </div>
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
            <span className="font-bold block">Bắt đầu</span>
            <span className="text-[10px]">25 đến &lt; 50đ</span>
          </div>
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
            <span className="font-bold block">Hình thành</span>
            <span className="text-[10px]">50 đến &lt; 75đ</span>
          </div>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
            <span className="font-bold block">Nâng cao</span>
            <span className="text-[10px]">75 đến &lt; 95đ</span>
          </div>
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900">
            <span className="font-bold block">Dẫn dắt</span>
            <span className="text-[10px]">≥ 95 điểm</span>
          </div>
        </div>
      </div>

      {/* Principle 2: LDMI (Logistics Digital Maturity Index) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lớp 2: Chỉ số Trưởng thành Logistics (LDMI) &amp; Điều kiện Chặn
            </h2>
            <p className="text-xs text-slate-500">
              8 nhóm năng lực chuyên sâu phân theo 6 nhánh hoạt động thực tế
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Được thiết kế riêng cho logistics Việt Nam với ma trận trọng số nhóm × nhánh (Sheet 8_HeSo). Điểm LDMI được tính theo trung bình có trọng số của các nhóm năng lực được hỏi:
        </p>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-mono font-bold text-center">
          Điểm LDMI = Σ(Điểm nhóm năng lực × Hệ số quan trọng) / Σ Hệ số quan trọng
        </div>

        <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200">
          <span className="font-bold text-slate-900 block">Quy tắc Điều kiện Chặn (Gatekeeper Rules - R06):</span>
          <p className="text-slate-600">
            Để đảm bảo không "nhảy cóc" hình thức, doanh nghiệp muốn đạt mức trưởng thành cao bắt buộc phải đáp ứng năng lực nền tảng:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            <li><strong>Mức 3 (Tích hợp):</strong> Nhóm Hiển thị &amp; Tích hợp (HT) phải đạt từ <strong>50 điểm trở lên</strong>.</li>
            <li><strong>Mức 4 (Hiển thị):</strong> Nhóm Hiển thị &amp; Tích hợp (HT) phải đạt từ <strong>65 điểm trở lên</strong>.</li>
            <li><strong>Mức 5 (Thông minh):</strong> Nhóm Chi phí &amp; Hiệu suất (CP) phải đạt từ <strong>75 điểm trở lên</strong>.</li>
          </ul>
          <p className="text-[11px] text-amber-700 font-medium pt-1">
            → Nếu không thỏa điều kiện chặn, hệ thống sẽ tự động hạ một mức cho đến khi thỏa mãn (R06).
          </p>
        </div>
      </div>

      {/* Principle 3: Gaps & 7-Component Matching */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Xác định Khoảng trống (R07) &amp; Ghép nối 7 Thành phần (R08)
            </h2>
            <p className="text-xs text-slate-500">
              Công thức tường minh không dùng thuật toán hộp đen hay thiên vị nhà tài trợ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
            <strong className="text-slate-900 block">Độ lớn khoảng trống (R07):</strong>
            <div className="p-2 bg-white rounded border font-mono text-[11px] text-purple-800">
              Độ lớn = (100 − Điểm nhóm) × Hệ số nhánh × (1.1 nếu có chỉ số "Không đo")
            </div>
            <p className="text-slate-600">
              Chọn 3 nhóm có độ lớn lớn nhất. Trong mỗi nhóm, chọn khoảng trống cụ thể dựa trên câu hỏi có điểm số thấp nhất.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
            <strong className="text-slate-900 block">7 Thành phần Ghép nối (R08, R09):</strong>
            <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
              <li>• 30%: Khớp khoảng trống cấp bách</li>
              <li>• 15%: Khớp ưu tiên 6 tháng</li>
              <li>• 15%: Khớp loại hình và quy mô</li>
              <li>• 15%: Khớp khung ngân sách</li>
              <li>• 10%: Mức sẵn sàng nhân sự &amp; dữ liệu</li>
              <li>• 10%: Khớp hệ thống phần mềm hiện tại</li>
              <li>• 05%: Kết quả đánh giá đã kiểm chứng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Neutrality Guarantees */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Cam kết Trung lập &amp; Độc lập Tuyệt đối
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <strong className="text-white block font-bold">1. Không bán thứ hạng (R10)</strong>
            <p>Cờ tài trợ hoặc gói thuê bao chỉ đổi nhãn hiển thị, hoàn toàn không được tham gia vào hàm chấm điểm thứ hạng.</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <strong className="text-white block font-bold">2. Không thu hoa hồng (R21)</strong>
            <p>POLYMATCH không thu phần trăm theo giá trị hợp đồng, không can thiệp vào đàm phán thương mại giữa hai bên.</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <strong className="text-white block font-bold">3. AI không chấm điểm (R24)</strong>
            <p>Mô hình ngôn ngữ chỉ diễn giải kết quả đã tính bằng công thức toán học tường minh, không quyết định điểm số.</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={onStartQuickScan}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs rounded-xl"
        >
          Làm thử Quick Scan (2 phút)
        </button>
        <button
          onClick={onStartFullAssessment}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm"
        >
          Bắt đầu Đánh giá đầy đủ (10–12 phút)
        </button>
      </div>

    </div>
  );
};
