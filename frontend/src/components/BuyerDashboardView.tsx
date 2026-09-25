import React from 'react';
import { storage, UserProfile, AssessmentRecord } from '../lib/storage';
import { TEN_NHANH } from '../data/weights';
import { 
  Building2, 
  BarChart3, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Compass, 
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface BuyerDashboardViewProps {
  currentUser: UserProfile;
  latestAssessment?: AssessmentRecord;
  onStartAssessment: () => void;
  onViewResults: (id: string) => void;
  onViewRfqs: () => void;
  onViewSolutions: () => void;
}

export const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = ({
  currentUser,
  latestAssessment,
  onStartAssessment,
  onViewResults,
  onViewRfqs,
  onViewSolutions,
}) => {
  const userRfqs = storage.getRfqsByBuyer(currentUser.id);
  const assessments = storage.getAssessmentsByUser(currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              BẢNG ĐIỀU KHIỂN DOANH NGHIỆP LOGISTICS (BUYER)
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              {currentUser.companyName || 'Doanh nghiệp Logistics'}
            </h1>
            <p className="text-xs text-slate-500">
              Mã số thuế: <strong className="font-mono text-slate-700">{currentUser.taxCode || '0316956049'}</strong> · Nhánh: <strong>{TEN_NHANH[currentUser.branch || 'VT']}</strong> · Người liên hệ: {currentUser.name}
            </p>
          </div>

          <button
            onClick={onStartAssessment}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {latestAssessment ? 'Làm bài Đánh giá lại (M14.02)' : 'Bắt đầu Đánh giá đầy đủ'}
          </button>
        </div>
      </div>

      {/* LATEST ASSESSMENT CARD (If exists) */}
      {latestAssessment ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                KẾT QUẢ ĐÁNH GIÁ GẦN NHẤT
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Chỉ số Trưởng thành số Đạt được
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Ngày đánh giá: {new Date(latestAssessment.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Dual Score Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Mức DBI (Chỉ số Trưởng thành Số):</span>
              <div className="text-xl font-extrabold text-slate-900">
                {latestAssessment.dbiResult.muc_ten} ({latestAssessment.dbiResult.diem.toFixed(1)}đ)
              </div>
              <p className="text-[11px] text-slate-500">
                Đánh giá toàn diện 6 trụ cột chuyển đổi số theo phương pháp TOPSIS.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-blue-700">Mức LDMI (Logistics 5 Mức):</span>
              <div className="text-xl font-extrabold text-blue-900">
                Mức {latestAssessment.ldmiResult.muc}: {latestAssessment.ldmiResult.muc_ten} ({latestAssessment.ldmiResult.diem.toFixed(1)}đ)
              </div>
              <p className="text-[11px] text-blue-700/80">
                {latestAssessment.ldmiResult.dieu_kien_chan_ghi_chu || 'Thỏa mãn điều kiện chặn R06.'}
              </p>
            </div>
          </div>

          {/* 3 Gaps Snapshot */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-800 block">
              3 Khoảng trống vận hành cấp bách nhất:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {latestAssessment.topGaps.map((gap, idx) => (
                <div key={gap.ma_khoang_trong} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-blue-700 font-mono font-bold">
                    <span>Khoảng trống #{idx + 1}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">{gap.ma_khoang_trong}</span>
                  </div>
                  <strong className="text-slate-900 block text-xs">{gap.ten_khoang_trong}</strong>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{gap.buoc_tiep_theo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onViewResults(latestAssessment.id)}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Xem toàn bộ Báo cáo chẩn đoán
            </button>
            <button
              onClick={onViewSolutions}
              className="w-full sm:w-auto px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              Khám phá Giải pháp đề xuất ({latestAssessment.recommendations.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
          <Compass className="w-12 h-12 text-blue-600 mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Doanh nghiệp của bạn chưa thực hiện Đánh giá đầy đủ
            </h3>
            <p className="text-xs text-slate-500">
              Thực hiện bài đánh giá 10–12 phút để nhận chỉ số DBI &amp; LDMI, xác định 3 khoảng trống vận hành và mở khóa danh sách giải pháp công nghệ được ghép nối.
            </p>
          </div>
          <button
            onClick={onStartAssessment}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Bắt đầu Đánh giá ngay
          </button>
        </div>
      )}

      {/* RFQs OVERVIEW CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hồ sơ nhu cầu &amp; Yêu cầu Báo giá của bạn (M11.07)
            </h3>
            <p className="text-xs text-slate-500">
              Theo dõi số nhà cung cấp đã mở hồ sơ (tối đa 5 lượt mở R15) và báo giá nhận được
            </p>
          </div>
          <button
            onClick={onViewRfqs}
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
          >
            Quản lý tất cả ({userRfqs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userRfqs.length === 0 ? (
          <div className="text-xs text-slate-400 py-4 text-center">
            Bạn chưa gửi yêu cầu báo giá nào. Sau khi đánh giá, chọn giải pháp để tạo yêu cầu (RFQ).
          </div>
        ) : (
          <div className="space-y-3">
            {userRfqs.slice(0, 3).map((rfq) => (
              <div
                key={rfq.id}
                onClick={onViewRfqs}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600">{rfq.id}</span>
                    <strong className="text-slate-900">{rfq.solutionName}</strong>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Bậc ngân sách: {rfq.budgetText} · Ngày tạo: {new Date(rfq.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-mono font-bold text-xs">
                    {rfq.unlockedVendorIds.length}/5 NCC đã mở (R15)
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {rfq.quotesReceived.length} Báo giá
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
