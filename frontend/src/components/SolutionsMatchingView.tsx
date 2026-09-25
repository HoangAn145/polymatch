import React, { useState } from 'react';
import { AssessmentRecord, storage, RfqRecord } from '../lib/storage';
import { RecommendedSolution } from '../lib/scoring';
import { Solution } from '../data/solutions';
import { TEN_NHOM_NANG_LUC, TEN_NHANH, BIEU_PHI_CONFIG } from '../data/weights';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  SlidersHorizontal, 
  Info, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Clock, 
  FileText, 
  Lock,
  ExternalLink,
  Send,
  HelpCircle,
  Eye,
  Star
} from 'lucide-react';

interface SolutionsMatchingViewProps {
  assessment: AssessmentRecord;
  onNavigateToRequests: () => void;
  onBackToGaps: () => void;
}

export const SolutionsMatchingView: React.FC<SolutionsMatchingViewProps> = ({
  assessment,
  onNavigateToRequests,
  onBackToGaps,
}) => {
  const { recommendations, branch, scale, ldmiResult } = assessment;
  
  // Selected solution for 7-component score breakdown modal
  const [selectedMatchModal, setSelectedMatchModal] = useState<RecommendedSolution | null>(null);

  // RFQ Creation Modal state (M11.01, M11.02)
  const [rfqTargetSolution, setRfqTargetSolution] = useState<Solution | null>(null);
  const [agreeShare, setAgreeShare] = useState<boolean>(true);
  const [rfqCreatedSuccess, setRfqCreatedSuccess] = useState<string | null>(null);

  // Filters (M09.10)
  const [filterPrice, setFilterPrice] = useState<string>('all');
  const [filterDeployTime, setFilterDeployTime] = useState<string>('all');

  // Filter solutions
  const filteredRecommendations = recommendations.filter((item) => {
    if (filterPrice !== 'all' && item.solution.trang_thai_gia !== filterPrice) return false;
    return true;
  });

  // Reference solutions (R11)
  const referenceSolutions = recommendations.filter((item) => item.solution.trang_thai_nguon === 'tham_khao');

  const handleCreateRfq = (sol: Solution) => {
    if (!agreeShare) {
      alert('Vui lòng tích đồng ý chia sẻ bản thông tin ẩn danh để tạo yêu cầu báo giá (M11.02).');
      return;
    }

    const newRfqId = `rfq-${Date.now()}`;
    const budgetTier = assessment.budget === 'duoi_20' ? 'bac_1' : assessment.budget === '20_100' ? 'bac_2' : 'bac_3';
    const budgetText = assessment.budget === 'duoi_20' ? 'Dưới 20 triệu' : assessment.budget === '20_100' ? '20 - 100 triệu' : 'Trên 100 triệu';

    const rfq: RfqRecord = {
      id: newRfqId,
      buyerId: assessment.userId,
      assessmentId: assessment.id,
      solutionId: sol.id,
      solutionName: sol.ten,
      branch: assessment.branch,
      scale: assessment.scale,
      budgetTier,
      budgetText,
      status: 'dang_phat',
      unlockedVendorIds: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      // R14: Anonymous Snapshot
      anonymousSnapshot: {
        nhanh: assessment.branch,
        quyMo: assessment.scale,
        dbiMuc: assessment.dbiResult.muc_ten,
        ldmiMuc: assessment.ldmiResult.muc,
        ldmiMucTen: assessment.ldmiResult.muc_ten,
        topGaps: assessment.topGaps.map((g) => `${g.ma_khoang_trong}: ${g.ten_khoang_trong}`),
        priorities: assessment.priorities,
        budget: budgetText,
        date: new Date().toLocaleDateString('vi-VN'),
      },
      fullContact: {
        companyName: assessment.companyName,
        taxCode: storage.getCurrentUser()?.taxCode || '0316956049',
        contactPerson: storage.getCurrentUser()?.name || 'Trần Văn Hùng',
        phone: storage.getCurrentUser()?.phone || '0918234567',
        email: storage.getCurrentUser()?.email || 'giamdoc@achau-logistics.vn',
        address: storage.getCurrentUser()?.address || '490A Điện Biên Phủ, TP.HCM',
      },
      quotesReceived: [],
      messages: [],
    };

    storage.createRfq(rfq);
    setRfqCreatedSuccess(sol.ten);
    setRfqTargetSolution(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              M09 · ĐỀ XUẤT GIẢI PHÁP & GHÉP NỐI 7 THÀNH PHẦN
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Giải pháp công nghệ phù hợp nhất cho doanh nghiệp
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bộ lọc cứng: Nhánh {branch} · LDMI ≤ {ldmiResult.muc + 1} (R19) · Xếp hạng theo thuật toán 7 thành phần (R08)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToGaps}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors"
          >
            ← 3 Khoảng trống
          </button>
          <button
            onClick={onNavigateToRequests}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            Quản lý Hồ sơ nhu cầu ({storage.getRfqsByBuyer(assessment.userId).length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner if RFQ created */}
      {rfqCreatedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Đã tạo Hồ sơ nhu cầu thành công cho giải pháp:</strong> {rfqCreatedSuccess}.
              <p className="text-slate-600 mt-0.5">
                Bản tóm tắt ẩn danh đã được phát tới các nhà cung cấp đã xác thực. Bạn sẽ nhận được báo giá trong vòng 24–48h.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToRequests}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 whitespace-nowrap"
          >
            Xem hồ sơ của tôi
          </button>
        </div>
      )}

      {/* Filter Bar (M09.10) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span>Bộ lọc giải pháp:</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Trạng thái giá:</span>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="all">Tất cả</option>
              <option value="cong_khai">Công khai minh bạch</option>
              <option value="thu_cap">Nguồn thứ cấp</option>
              <option value="lien_he">Liên hệ báo giá</option>
            </select>
          </div>
        </div>
      </div>

      {/* MATCHED SOLUTIONS GRID (VERIFIED VENDORS) */}
      <div className="space-y-5">
        {filteredRecommendations.map((item) => {
          const sol = item.solution;
          const isVerified = sol.trang_thai_nguon === 'da_xac_thuc';

          return (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm p-6 space-y-4 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800">
                      {sol.ma}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Nhóm: {sol.nhom_giai_phap}
                    </span>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Đã xác thực (M09.04)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Tham khảo (R11)
                      </span>
                    )}

                    {/* R10: Sponsored flag alters label ONLY, does not change score/rank */}
                    {sol.la_tai_tro && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                        Được tài trợ (M09.08)
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 pt-1">
                    {sol.ten}
                  </h3>

                  <p className="text-xs text-slate-600">
                    Cung cấp bởi: <strong>{sol.nha_cung_cap_ten}</strong> · Đánh giá: <strong className="text-amber-600">★ {sol.danh_gia_sao}</strong> ({sol.so_danh_gia} lượt)
                  </p>
                </div>

                {/* Match Percentage Badge */}
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Độ phù hợp:</span>
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-mono text-blue-700">
                      {item.diem_phu_hop}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMatchModal(item)}
                    className="block text-[11px] text-blue-600 hover:underline font-semibold mt-0.5"
                  >
                    Xem chi tiết điểm 7 phần →
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed">
                {sol.mo_ta}
              </p>

              {/* Reasons (>=0.8) & Limitations (<0.5) (M09.06) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {item.ly_do.length > 0 && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Lý do phù hợp (Thành phần ≥ 0,8):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                      {item.ly_do.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.han_che.length > 0 && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Điểm hạn chế cần lưu ý (Thành phần &lt; 0,5):
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                      {item.han_che.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Specifications: Price, Deployment, Integrations (M09.07, R27) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Giá giải pháp (R27):</span>
                  <span className="font-bold text-slate-900">{sol.khoang_gia_text}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Thời gian triển khai:</span>
                  <span className="font-bold text-slate-900">{sol.thoi_gian_trien_khai}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tích hợp sẵn:</span>
                  <span className="font-medium text-slate-800 uppercase text-[11px] font-mono">
                    {sol.tich_hop.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mức LDMI phù hợp:</span>
                  <span className="font-bold text-blue-700">Mức {sol.muc_ldmi_phu_hop}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  Giải quyết khoảng trống: <strong className="text-blue-700">{sol.khoang_trong_giai_quyet.join(', ')}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {isVerified ? (
                    <button
                      type="button"
                      onClick={() => setRfqTargetSolution(sol)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Gửi yêu cầu báo giá (Tạo RFQ)
                    </button>
                  ) : (
                    /* R11: Reference solutions have no contact button! Only Concierge invite button */
                    <button
                      type="button"
                      onClick={() => alert('Yêu cầu đã được chuyển vào hàng đợi Concierge (M27.01). Ban quản trị sẽ chủ động kết nối nhà cung cấp này cho doanh nghiệp!')}
                      className="w-full sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      Gửi nhu cầu qua Concierge (R11)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REFERENCE SECTION DISCLAIMER (R11) */}
      <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Info className="w-4 h-4 text-blue-700" />
          Nguyên tắc trung lập & Minh bạch nguồn cung cấp (R10, R11)
        </div>
        <p className="leading-relaxed">
          POLYMATCH không thu hoa hồng môi giới theo hợp đồng (R21). Các giải pháp mang nhãn "Được tài trợ" chỉ thay đổi vị trí nhận diện thương hiệu, không làm thay đổi điểm số phù hợp hay thứ hạng gợi ý. Các giải pháp ở trạng thái "Tham khảo" là kết quả nghiên cứu thị trường độc lập và chưa ký kết thỏa thuận đối tác chính thức với nền tảng.
        </p>
      </div>

      {/* 7-COMPONENT SCORE BREAKDOWN MODAL (M09.03, R08, R09) */}
      {selectedMatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">
                  BẢNG TÍNH ĐIỂM 7 THÀNH PHẦN (R08)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedMatchModal.solution.ten}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatchModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">1. Khớp khoảng trống (Trọng số 30%)</span>
                  <p className="text-[11px] text-slate-500">Khớp khoảng trống số 1 = 1.0; số 2 = 0.7; số 3 = 0.5</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.khoang_trong_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">2. Khớp ưu tiên 6 tháng (Trọng số 15%)</span>
                  <p className="text-[11px] text-slate-500">Trùng với mục tiêu ưu tiên đã chọn tại P01</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.uu_tien_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">3. Loại hình & Quy mô (Trọng số 15%)</span>
                  <p className="text-[11px] text-slate-500">Trung bình khớp nhánh và quy mô {scale}</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.quy_mo_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">4. Khớp ngân sách phân bổ (Trọng số 15%)</span>
                  <p className="text-[11px] text-slate-500">R27: Giá liên hệ coi là 0.5; trong 70% ngân sách = 1.0</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.ngan_sach_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">5. Mức độ sẵn sàng (Trọng số 10%)</span>
                  <p className="text-[11px] text-slate-500">Nhân sự chuyên trách, chất lượng dữ liệu, cam kết lãnh đạo</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.san_sang_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">6. Khớp hệ thống hiện tại (Trọng số 10%)</span>
                  <p className="text-[11px] text-slate-500">Khả năng kết nối phần mềm kế toán/ERP hiện có</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.he_thong_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">7. Kết quả đã kiểm chứng (Trọng số 5%)</span>
                  <p className="text-[11px] text-slate-500">Số lượng đánh giá thực tế có chỉ số trước/sau (min 1, max 3)</p>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {(selectedMatchModal.chi_tiet_diem.kiem_chung_score * 100).toFixed(0)}%
                </span>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between font-bold text-blue-900 mt-2">
                <span>TỔNG ĐIỂM PHÙ HỢP HIỂN THỊ:</span>
                <span className="text-xl font-mono">{selectedMatchModal.diem_phu_hop}%</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedMatchModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Đóng bảng tính điểm
            </button>
          </div>
        </div>
      )}

      {/* CREATE RFQ MODAL WITH ANONYMOUS SNAPSHOT PREVIEW (M11.01, M11.02, R14) */}
      {rfqTargetSolution && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">
                  M11.01 · YÊU CẦU BÁO GIÁ (RFQ)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Tạo Hồ sơ nhu cầu: {rfqTargetSolution.ten}
                </h3>
              </div>
              <button
                onClick={() => setRfqTargetSolution(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* R14: Anonymous Snapshot Preview Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                  Xem trước bản tóm tắt ẩn danh (R14):
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Bảo mật thông tin
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Hoạt động: <strong>{TEN_NHANH[branch]}</strong></div>
                  <div>Quy mô: <strong>{scale.toUpperCase()}</strong></div>
                  <div>Mức DBI: <strong>{assessment.dbiResult.muc_ten}</strong></div>
                  <div>Mức LDMI: <strong>Mức {ldmiResult.muc} ({ldmiResult.muc_ten})</strong></div>
                  <div>Ngân sách: <strong>{assessment.budget === 'duoi_20' ? '< 20 triệu' : assessment.budget === '20_100' ? '20 - 100 triệu' : '> 100 triệu'}</strong></div>
                  <div>Bậc phí hồ sơ: <strong>{assessment.budget === 'duoi_20' ? 'Bậc 1' : assessment.budget === '20_100' ? 'Bậc 2' : 'Bậc 3'}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Khoảng trống cấp bách:</span>
                  <div className="space-y-0.5 text-slate-800">
                    {assessment.topGaps.map((g) => (
                      <div key={g.ma_khoang_trong} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{g.ma_khoang_trong}: {g.ten_khoang_trong}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 flex items-center gap-1.5 border border-amber-200/60">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>
                    <strong>Quy tắc R14:</strong> Tên doanh nghiệp, mã số thuế, số điện thoại và email của bạn hoàn toàn được ẩn. Nhà cung cấp chỉ có thể xem sau khi sử dụng tín chỉ để mở hồ sơ.
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Consent Checkbox (M11.02) */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={agreeShare}
                  onChange={(e) => setAgreeShare(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <strong>Đồng ý chia sẻ (Bắt buộc):</strong> Tôi đồng ý chia sẻ bản tóm tắt ẩn danh trên để hệ thống phát tới tối đa 5 nhà cung cấp uy tín đã xác thực (R15).
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRfqTargetSolution(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold text-xs rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleCreateRfq(rfqTargetSolution)}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Xác nhận & Phát hồ sơ nhu cầu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
