import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers,
  Tag,
  DollarSign,
  Clock,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { SOLUTIONS_DATA } from '../../data/solutionsData';
import { Solution } from '../../types';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const SolutionsCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPriceModel, setSelectedPriceModel] = useState<string>('all');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả nhóm giải pháp' },
    { id: 'WMS', name: 'Quản lý kho (WMS)' },
    { id: 'TMS', name: 'Quản lý vận tải (TMS)' },
    { id: 'OMS', name: 'Quản lý đơn hàng (OMS)' },
    { id: 'TOI_UU_TUYEN', name: 'Tối ưu tuyến đường (VRP)' },
    { id: 'EPOD', name: 'Ký nhận điện tử (ePOD)' },
    { id: 'GIAO_NHAN', name: 'Giao nhận quốc tế (FMS)' },
    { id: 'THEO_DOI_LO', name: 'Theo dõi container' },
    { id: 'CHUNG_TU', name: 'Khai hải quan & e-Doc' },
    { id: 'DINH_VI', name: 'Định vị GPS & Nhiên liệu' },
    { id: 'DOI_SOAT', name: 'Đối soát cước & Hóa đơn' },
    { id: 'COST_TO_SERVE', name: 'Chi phí theo tuyến' },
    { id: 'PHAT_THAI', name: 'Đo phát thải (GLEC)' }
  ];

  const branches = [
    { id: 'all', name: 'Tất cả ngành' },
    { id: 'VT', name: 'Vận tải đường bộ (VT)' },
    { id: 'KB', name: 'Kho bãi (KB)' },
    { id: 'FF', name: 'Giao nhận (FF)' },
    { id: '3PL', name: 'Logistics tích hợp (3PL)' },
    { id: 'LM', name: 'Chặng cuối (LM)' }
  ];

  const filteredSolutions = useMemo(() => {
    return SOLUTIONS_DATA.filter(sol => {
      const matchSearch =
        sol.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.nha_cung_cap_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.mo_ta.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = selectedCategory === 'all' || sol.nhom_giai_phap === selectedCategory;
      const matchBranch = selectedBranch === 'all' || sol.phan_khuc.includes(selectedBranch);
      const matchPrice = selectedPriceModel === 'all' || sol.mo_hinh_chi_phi === selectedPriceModel;

      return matchSearch && matchCat && matchBranch && matchPrice;
    });
  }, [searchTerm, selectedCategory, selectedBranch, selectedPriceModel]);

  const handleConnect = (sol: Solution) => {
    if (!currentUser) {
      toast.info("Yêu cầu đăng nhập", "Vui lòng đăng nhập tài khoản Doanh nghiệp để gửi yêu cầu kết nối và nhận báo giá.");
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'BUYER') {
      toast.warning("Chức năng dành cho Doanh nghiệp", "Bạn đang đăng nhập vai trò Seller/Admin. Hãy chuyển sang tài khoản Buyer để tạo yêu cầu kết nối.");
      return;
    }

    // Go directly to buyer connect request
    navigate(`/buyer/connections?action=new&solutionId=${sol.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="primary">Danh mục giải pháp công nghệ</Badge>
          <span className="text-xs text-slate-400">• Cập nhật tháng 10/2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Danh mục công nghệ phục vụ chuỗi cung ứng logistics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Tra cứu, so sánh và gửi yêu cầu báo giá trực tiếp tới các nhà cung cấp giải pháp công nghệ đã được thẩm định mã số thuế trên nền tảng POLYMATCH.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm giải pháp, nhà cung cấp, từ khóa..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick pill stats */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Tìm thấy <strong>{filteredSolutions.length}</strong> giải pháp công nghệ phù hợp
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Đã xác thực ({filteredSolutions.filter(s => s.trang_thai_nguon === 'da_xac_thuc').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Tài trợ ({filteredSolutions.filter(s => s.la_tai_tro).length})
            </span>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      {filteredSolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map(sol => (
            <div
              key={sol.id}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">{sol.nhom_giai_phap}</Badge>
                  <div className="flex items-center gap-1.5">
                    {sol.la_tai_tro && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Tài trợ
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        sol.trang_thai_nguon === 'da_xac_thuc'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sol.trang_thai_nguon === 'da_xac_thuc' ? '✓ Đã xác thực' : 'Tham khảo'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-slate-900 leading-snug hover:text-[#1769AA] transition-colors cursor-pointer" onClick={() => setSelectedSolution(sol)}>
                  {sol.ten}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {sol.mo_ta}
                </p>

                {/* Metadata badges */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Nhà cung cấp:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {sol.nha_cung_cap_ten}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Chi phí dự kiến:</span>
                    <span className="font-bold text-[#1769AA] text-[11px] truncate max-w-[180px]">
                      {sol.khoang_gia_text}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Thời gian triển khai:</span>
                    <span className="text-slate-700 text-[11px]">{sol.thoi_gian_trien_khai}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Mức LDMI phù hợp:</span>
                    <span className="font-medium text-slate-700 text-[11px]">Mức {sol.muc_ldmi_phu_hop}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 mt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedSolution(sol)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleConnect(sol)}
                >
                  Kết nối / Báo giá
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không tìm thấy giải pháp công nghệ phù hợp"
          description="Vui lòng thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc danh mục và ngành."
          actionText="Đặt lại bộ lọc"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedBranch('all');
            setSelectedPriceModel('all');
          }}
        />
      )}

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSolution(null)}
          title={selectedSolution.ten}
          subtitle={`Nhóm: ${selectedSolution.nhom_giai_phap} • Nhà cung cấp: ${selectedSolution.nha_cung_cap_ten}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-medium">
                Mã hệ thống: {selectedSolution.ma}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedSolution(null)}>
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    const s = selectedSolution;
                    setSelectedSolution(null);
                    handleConnect(s);
                  }}
                >
                  Gửi yêu cầu báo giá
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs sm:text-sm text-slate-700">
            {/* Description */}
            <div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Tổng quan giải pháp</h4>
              <p className="text-slate-600 leading-relaxed">{selectedSolution.mo_ta}</p>
            </div>

            {/* Key features */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 text-sm">Tính năng & Khả năng nổi bật</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedSolution.tinh_nang_chinh.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Chi phí ước tính:</span>
                <p className="font-bold text-[#1769AA] text-sm mt-0.5">{selectedSolution.khoang_gia_text}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Thời gian triển khai:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedSolution.thoi_gian_trien_khai}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Quy mô phù hợp:</span>
                <p className="font-semibold text-slate-800 mt-0.5 capitalize">
                  {selectedSolution.quy_mo_phu_hop.join(', ').replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Mức độ tích hợp:</span>
                <p className="font-semibold text-slate-800 mt-0.5 uppercase">
                  {selectedSolution.tich_hop.join(', ')}
                </p>
              </div>
            </div>

            {/* Case study if any */}
            {selectedSolution.case_study && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-950">
                <span className="font-bold text-xs uppercase text-emerald-800 block mb-1">
                  Kết quả kiểm chứng thực tế (Case study)
                </span>
                <p className="text-xs leading-relaxed">{selectedSolution.case_study}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
