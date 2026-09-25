import React, { useState } from 'react';
import { AssessmentRecord } from '../lib/storage';
import { TEN_NHOM_NANG_LUC } from '../data/weights';
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  TrendingUp,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface GapsAndRoadmapViewProps {
  assessment: AssessmentRecord;
  onProceedToSolutions: () => void;
  onBackToResults: () => void;
}

export const GapsAndRoadmapView: React.FC<GapsAndRoadmapViewProps> = ({
  assessment,
  onProceedToSolutions,
  onBackToResults,
}) => {
  const { topGaps, ldmiResult, priorities } = assessment;
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(priorities || []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              M07 · KHOẢNG TRỐNG & LỘ TRÌNH 6 THÁNG
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            3 Khoảng trống Logistics then chốt cần giải quyết
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xác định tự động theo công thức R07: (100 − điểm) × hệ số quan trọng × hệ số đo lường
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToResults}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors"
          >
            ← Bảng điểm
          </button>
          <button
            onClick={onProceedToSolutions}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            Xem giải pháp đề xuất
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 EXPANDED GAP CARDS (M07.03, M07.04) */}
      <div className="space-y-5">
        {topGaps.map((gap, index) => {
          const triThuc = gap.tri_thuc;
          return (
            <div 
              key={gap.ma_khoang_trong}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-blue-300 transition-colors"
            >
              {/* Gap Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {gap.ma_khoang_trong}
                      </span>
                      <span className="text-xs font-semibold text-blue-700">
                        Nhóm: {TEN_NHOM_NANG_LUC[gap.nhom]}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {gap.ten_khoang_trong}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Độ lớn khoảng trống (R07):</span>
                  <span className="text-lg font-bold font-mono text-rose-600">
                    {gap.do_lon.toFixed(1)} điểm
                  </span>
                </div>
              </div>

              {/* Diagnosis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 block">Triệu chứng thực tế:</span>
                  <p className="text-slate-600 leading-relaxed">{triThuc.trieu_chung}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    Phát hiện từ câu hỏi {gap.cau_thap_nhat_ma} (Điểm đánh giá: {gap.cau_thap_nhat_muc}/5)
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-700 block">Nguyên nhân gốc rễ:</span>
                  <p className="text-slate-600 leading-relaxed">{triThuc.nguyen_nhan}</p>
                </div>
              </div>

              {/* Next Step Box (R19: Strictly tailored to current LDMI level) */}
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Bước tiếp theo đề xuất (Đúng mức LDMI hiện tại: Mức {ldmiResult.muc} {ldmiResult.muc_ten})
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700">R19 Không nhảy cóc</span>
                </div>
                <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                  {gap.buoc_tiep_theo}
                </p>
              </div>

              {/* Prerequisites & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-700 shrink-0">Điều kiện cần chuẩn bị:</span>
                  <span className="text-slate-600">{triThuc.dieu_kien}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-700 shrink-0">Chỉ số nên đo lường:</span>
                  <span className="text-slate-600 font-mono text-[11px]">{triThuc.chi_so}</span>
                </div>
              </div>

              {/* APA Source Tag */}
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Nguồn nghiên cứu học thuật: {triThuc.nguon.join(' · ')}</span>
                {triThuc.luu_y_bang_chung && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Lưu ý: {triThuc.luu_y_bang_chung}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROADMAP SECTION (M07.06) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Lộ trình 3 bước gợi ý trong 6 tháng tới (M07.06)
            </h3>
            <p className="text-xs text-slate-500">
              Sắp xếp theo thứ tự ưu tiên và sự sẵn sàng của dữ liệu
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
            LỘ TRÌNH THỰC THI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-800">
              <span>GIAI ĐOẠN 1 (Tháng 1 - 2)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 text-blue-900">Chuẩn hóa</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Chuẩn hóa quy trình & Mẫu dữ liệu gốc
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quy chuẩn mẫu lệnh điều xe, danh mục mã hàng, vị trí kho và quy định tài xế/thủ kho ghi nhận số liệu ngay khi thực hiện.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
              <span>GIAI ĐOẠN 2 (Tháng 3 - 4)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">Áp dụng công cụ</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Triển khai phần mềm chuyên dụng (TMS / WMS)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chọn giải pháp công nghệ đã xác thực phù hợp với ngân sách; kết nối thiết bị GPS và smartphone tài xế/thủ kho.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>GIAI ĐOẠN 3 (Tháng 5 - 6)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Tối ưu & Đo lường</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Đo lường chỉ số mốc & Báo cáo cải thiện
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo dõi biến thiên của OTIF, chi phí/km và tỷ lệ chạy rỗng; làm bài đánh giá lại (re-assessment) sau 6 tháng.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onProceedToSolutions}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            Tiếp tục: Xem danh sách Giải pháp công nghệ đề xuất
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
