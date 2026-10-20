import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  GitCompare,
  Send,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { dbService } from '../../services/mockDatabase';
import { assessmentService } from '../../services/assessmentService';
import { connectionService } from '../../services/connectionService';
import { SolutionMatch, Solution } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const BuyerSolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();
  const enterprise = dbService.getEnterprises().find(e => e.userId === currentUser?.id) || dbService.getEnterprises()[0];
  const assessments = dbService.getAssessments().filter(a => a.userId === currentUser?.id);
  const latestAssessment = assessments[0] || dbService.getAssessments()[0];

  const [filterGap, setFilterGap] = useState<string>(searchParams.get('gap') || 'all');
  const [selectedSolutionForQuote, setSelectedSolutionForQuote] = useState<Solution | null>(null);
  const [detailSolution, setDetailSolution] = useState<SolutionMatch | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Quote form state
  const [reqDetails, setReqDetails] = useState('');
  const [reqBudget, setReqBudget] = useState(enterprise.ngan_sach_12_thang || 'Khoảng 50 - 100 triệu VNĐ');
  const [reqTimeframe, setReqTimeframe] = useState('Triển khai trong tháng tới');

  const matches = useMemo(() => {
    return assessmentService.matchSolutions(latestAssessment, enterprise);
  }, [latestAssessment, enterprise]);

  const filteredMatches = useMemo(() => {
    if (filterGap === 'all') return matches;
    return matches.filter(m => m.solution.khoang_trong_giai_quyet.includes(filterGap));
  }, [matches, filterGap]);

  const toggleCompare = (solId: string) => {
    if (comparedIds.includes(solId)) {
      setComparedIds(comparedIds.filter(id => id !== solId));
    } else {
      if (comparedIds.length >= 3) {
        toast.warning("Tối đa 3 giải pháp", "Bạn chỉ có thể so sánh tối đa 3 giải pháp cùng lúc.");
        return;
      }
      setComparedIds([...comparedIds, solId]);
      toast.info("Đã thêm vào so sánh", `Đã chọn ${comparedIds.length + 1} / 3 giải pháp.`);
    }
  };

  const handleSendConnectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForQuote) return;

    try {
      const newReq = connectionService.createConnectionRequest({
        buyerId: currentUser?.id || enterprise.userId,
        buyerName: currentUser?.fullName || enterprise.nguoi_lien_he,
        buyerCompany: enterprise.ten,
        buyerPhone: enterprise.so_dien_thoai,
        buyerEmail: enterprise.email_lien_he,
        sellerId: selectedSolutionForQuote.nha_cung_cap_id || 'vendor-unknown',
        sellerCompany: selectedSolutionForQuote.nha_cung_cap_ten,
        solutionId: selectedSolutionForQuote.id,
        solutionName: selectedSolutionForQuote.ten,
        nhu_cau_chi_tiet: reqDetails || `Doanh nghiệp muốn nhận tư vấn và báo giá triển khai ${selectedSolutionForQuote.ten}.`,
        ngan_sach_du_kien: reqBudget,
        thoi_gian_du_kien: reqTimeframe
      });

      setSelectedSolutionForQuote(null);
      toast.success(
        "Đã gửi yêu cầu kết nối thành công!",
        `Nhà cung cấp ${selectedSolutionForQuote.nha_cung_cap_ten} đã nhận được thông tin và sẽ phản hồi báo giá qua mục Yêu cầu kết nối.`
      );

      navigate('/buyer/connections');
    } catch {
      toast.error("Lỗi khi gửi yêu cầu", "Không thể tạo yêu cầu kết nối lúc này.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Badge variant="primary">Bộ máy ghép nối 7 thành phần</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Giải pháp công nghệ được đề xuất theo điểm nghẽn
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Được xếp hạng tự động dựa trên mức độ giải quyết điểm nghẽn, quy mô {enterprise.quy_mo}, ngành {enterprise.nhanh} và ngân sách.
          </p>
        </div>

        {comparedIds.length > 0 && (
          <Link to={`/buyer/compare?ids=${comparedIds.join(',')}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<GitCompare className="w-4 h-4" />}
            >
              So sánh ({comparedIds.length} / 3)
            </Button>
          </Link>
        )}
      </div>

      {/* Filter by Gap Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0">Lọc theo điểm nghẽn:</span>
        <button
          onClick={() => setFilterGap('all')}
          className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
            filterGap === 'all'
              ? 'bg-[#1769AA] text-white border-[#1769AA]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả đề xuất ({matches.length})
        </button>
        {latestAssessment.top_khoang_trong.map(gap => (
          <button
            key={gap.ma}
            onClick={() => setFilterGap(gap.ma)}
            className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors whitespace-nowrap ${
              filterGap === gap.ma
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {gap.ma}: {gap.ten}
          </button>
        ))}
      </div>

      {/* Solutions List */}
      <div className="space-y-4">
        {filteredMatches.map(m => {
          const isCompared = comparedIds.includes(m.solution.id);
          return (
            <div
              key={m.solution.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Match score badge */}
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Độ phù hợp: {m.matchScore}%
                  </span>

                  <Badge variant="secondary" size="sm">{m.solution.nhom_giai_phap}</Badge>

                  {m.solution.la_tai_tro ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Tài trợ (Thứ hạng không đổi)
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Nhà cung cấp đã xác thực
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {m.solution.ten}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {m.solution.mo_ta}
                </p>

                {/* Match reasons highlights */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  {m.ly_do.slice(0, 2).map((r, i) => (
                    <span key={i} className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{r}</span>
                    </span>
                  ))}
                  {m.han_che.slice(0, 1).map((c, i) => (
                    <span key={i} className="flex items-center gap-1 text-amber-600">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Nhà cung cấp: <strong className="text-slate-800">{m.solution.nha_cung_cap_ten}</strong></span>
                  <span>Chi phí: <strong className="text-[#1769AA]">{m.solution.khoang_gia_text}</strong></span>
                  <span>Thời gian: <strong className="text-slate-800">{m.solution.thoi_gian_trien_khai}</strong></span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedSolutionForQuote(m.solution)}
                >
                  Yêu cầu báo giá
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setDetailSolution(m)}
                  >
                    Điểm 7 thành phần
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(m.solution.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                      isCompared
                        ? 'bg-blue-50 border-[#1769AA] text-[#1769AA]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isCompared ? '✓ Đã chọn so sánh' : '+ So sánh'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Factor Breakdown Detail Modal */}
      {detailSolution && (
        <Modal
          isOpen={true}
          onClose={() => setDetailSolution(null)}
          title={`Chi tiết điểm số phù hợp: ${detailSolution.solution.ten}`}
          subtitle={`Tổng điểm tương thích: ${detailSolution.matchScore}%`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Điểm số phù hợp được tính toán dựa trên ma trận 7 thành phần độc lập (theo Điều R08/R09 tài liệu VNYTL):
            </p>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>1. Khớp điểm nghẽn cốt lõi (30%):</span>
                  <strong>{Math.round(detailSolution.breakdown.khoang_trong * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${detailSolution.breakdown.khoang_trong * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>2. Khớp mục tiêu ưu tiên 6 tháng (15%):</span>
                  <strong>{Math.round(detailSolution.breakdown.uu_tien * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${detailSolution.breakdown.uu_tien * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>3. Khớp ngành & Quy mô doanh nghiệp (15%):</span>
                  <strong>{Math.round(detailSolution.breakdown.loai_hinh_quy_mo * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${detailSolution.breakdown.loai_hinh_quy_mo * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>4. Phù hợp ngân sách dự kiến (15%):</span>
                  <strong>{Math.round(detailSolution.breakdown.ngan_sach * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600" style={{ width: `${detailSolution.breakdown.ngan_sach * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>5. Khả năng tiếp nhận & Mức sẵn sàng (10%):</span>
                  <strong>{Math.round(detailSolution.breakdown.san_sang * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: `${detailSolution.breakdown.san_sang * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>6. Khả năng tích hợp hệ thống hiện tại (10%):</span>
                  <strong>{Math.round(detailSolution.breakdown.he_thong * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600" style={{ width: `${detailSolution.breakdown.he_thong * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>7. Kết quả kiểm chứng thực tế (5%):</span>
                  <strong>{Math.round(detailSolution.breakdown.kiem_chung * 100)}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: `${detailSolution.breakdown.kiem_chung * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <strong className="block text-slate-800">Lý do giải pháp được đề xuất:</strong>
              <ul className="space-y-1 list-disc pl-4 text-slate-600">
                {detailSolution.ly_do.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {/* Quote Request Modal */}
      {selectedSolutionForQuote && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSolutionForQuote(null)}
          title={`Gửi yêu cầu báo giá: ${selectedSolutionForQuote.ten}`}
          subtitle={`Gửi trực tiếp tới: ${selectedSolutionForQuote.nha_cung_cap_ten}`}
          maxWidth="md"
        >
          <form onSubmit={handleSendConnectionRequest} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-medium">Bên yêu cầu (Buyer):</span>
              <p className="font-bold text-slate-800">{enterprise.ten} ({enterprise.nguoi_lien_he})</p>
              <p className="text-slate-500">SĐT: {enterprise.so_dien_thoai} • Email: {enterprise.email_lien_he}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mô tả chi tiết nhu cầu vận hành & kỳ vọng *
              </label>
              <textarea
                rows={3}
                required
                value={reqDetails}
                onChange={e => setReqDetails(e.target.value)}
                placeholder="Ví dụ: Đội xe hiện có 45 xe tải, cần áp dụng lệnh điều xe điện tử và liên kết GPS để theo dõi hành trình..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngân sách dự kiến</label>
                <input
                  type="text"
                  value={reqBudget}
                  onChange={e => setReqBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thời gian muốn triển khai</label>
                <input
                  type="text"
                  value={reqTimeframe}
                  onChange={e => setReqTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-slate-600">
              * Yêu cầu kết nối sẽ xuất hiện trên màn hình Báo giá của Nhà cung cấp. Nhà cung cấp sẽ gửi lại bảng giá chính thức để bạn phê duyệt.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setSelectedSolutionForQuote(null)}>
                Hủy bỏ
              </Button>
              <Button variant="primary" size="sm" type="submit" rightIcon={<Send className="w-3.5 h-3.5" />}>
                Xác nhận gửi yêu cầu
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
