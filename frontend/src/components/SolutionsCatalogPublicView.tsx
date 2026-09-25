import React, { useState } from 'react';
import { SOLUTIONS_CATALOG, Solution } from '../data/solutions';
import { BranchCode, GroupCode } from '../data/questions';
import { TEN_NHANH, TEN_NHOM_NANG_LUC } from '../data/weights';
import { 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  Lock, 
  Layers, 
  Sparkles,
  ExternalLink,
  Send
} from 'lucide-react';

interface SolutionsCatalogPublicViewProps {
  onSelectSolution: (sol: Solution) => void;
  onProtectedAction: (reason: string) => void;
  isLoggedIn: boolean;
}

export const SolutionsCatalogPublicView: React.FC<SolutionsCatalogPublicViewProps> = ({
  onSelectSolution,
  onProtectedAction,
  isLoggedIn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedLdmi, setSelectedLdmi] = useState<string>('all');
  const [selectedCostModel, setSelectedCostModel] = useState<string>('all');

  const filteredSolutions = SOLUTIONS_CATALOG.filter((sol) => {
    if (selectedBranch !== 'all' && !sol.phan_khuc.includes(selectedBranch as BranchCode)) return false;
    if (selectedLdmi !== 'all' && sol.muc_ldmi_phu_hop !== parseInt(selectedLdmi, 10)) return false;
    if (selectedCostModel !== 'all' && sol.mo_hinh_chi_phi !== selectedCostModel) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = sol.ten.toLowerCase().includes(q);
      const matchCode = sol.ma.toLowerCase().includes(q);
      const matchDesc = sol.mo_ta.toLowerCase().includes(q);
      const matchVendor = sol.nha_cung_cap_ten.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc && !matchVendor) return false;
    }
    return true;
  });

  const handleAction = (sol: Solution) => {
    if (!isLoggedIn) {
      onProtectedAction(`Vui lòng đăng nhập hoặc đăng ký để gửi yêu cầu báo giá cho giải pháp ${sol.ten}.`);
    } else {
      onSelectSolution(sol);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            M01.08 · DANH MỤC GIẢI PHÁP LOGISTICS
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Cơ sở Dữ liệu Giải pháp Công nghệ Logistics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp 32 giải pháp chuyên ngành · Phân theo mức LDMI và khoảng trống vận hành
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          {filteredSolutions.length} GIẢI PHÁP
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm giải pháp theo tên (WMS, TMS, ePOD, định vị...), mã hoặc nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Phân khúc logistics:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Tất cả phân khúc</option>
              <option value="VT">Vận tải nội địa (VT)</option>
              <option value="KB">Dịch vụ kho bãi (KB)</option>
              <option value="FF">Giao nhận quốc tế (FF)</option>
              <option value="3PL">3PL/4PL Logistics</option>
              <option value="LM">Chặng cuối (LM)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Mức độ trưởng thành LDMI:</label>
            <select
              value={selectedLdmi}
              onChange={(e) => setSelectedLdmi(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Tất cả mức LDMI</option>
              <option value="2">Mức 2: Số hóa</option>
              <option value="3">Mức 3: Tích hợp</option>
              <option value="4">Mức 4: Hiển thị</option>
              <option value="5">Mức 5: Thông minh</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Mô hình chi phí:</label>
            <select
              value={selectedCostModel}
              onChange={(e) => setSelectedCostModel(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Tất cả mô hình chi phí</option>
              <option value="thue_bao_thang">Thuê bao tháng (SaaS)</option>
              <option value="thue_bao_nam">Thuê bao năm</option>
              <option value="thiet_bi">Mua thiết bị phần cứng</option>
              <option value="du_an">Triển khai theo dự án</option>
            </select>
          </div>
        </div>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSolutions.map((sol) => {
          const isVerified = sol.trang_thai_nguon === 'da_xac_thuc';

          return (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm p-6 flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800">
                      {sol.ma}
                    </span>
                    <span className="text-xs font-semibold text-blue-700">
                      {sol.nhom_giai_phap}
                    </span>
                  </div>

                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tham khảo (R11)
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {sol.ten}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {sol.mo_ta}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mức LDMI phù hợp:</span>
                    <strong className="text-blue-700">Mức {sol.muc_ldmi_phu_hop}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Khoảng giá (R27):</span>
                    <strong className="text-slate-900">{sol.khoang_gia_text}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nhà cung cấp:</span>
                    <strong className="text-slate-800">{sol.nha_cung_cap_ten}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Triển khai: {sol.thoi_gian_trien_khai}
                </span>

                {isVerified ? (
                  <button
                    type="button"
                    onClick={() => handleAction(sol)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Yêu cầu báo giá
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAction(sol)}
                    className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Gửi nhu cầu (Concierge)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
