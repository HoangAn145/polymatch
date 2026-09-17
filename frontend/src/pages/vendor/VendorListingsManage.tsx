import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit, 
  Eye, 
  Star,
  Building2,
  ArrowRight
} from 'lucide-react';
import { TechListing } from '../../types';

export const VendorListingsManage: React.FC = () => {
  const { techListings, currentUser, navigate, setActiveTechDetailId } = useApp();

  const myListings = techListings.filter(t => t.vendorId === currentUser.id || t.vendorName.includes('FPT') || t.vendorName.includes('VNPT') || true);

  const getStatusBadge = (status: TechListing['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Đã duyệt & Đang niêm yết</span>
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Chờ duyệt (SLA 24h)</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Cần bổ sung hồ sơ</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            <span>Bản nháp</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Quản lý Danh mục Giải pháp</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Các Giải pháp Công nghệ của {currentUser.company.companyName}
          </h1>
          <p className="text-xs text-slate-500">
            Tất cả giải pháp được gắn nhãn theo Danh mục chuẩn hóa (Closed Taxonomy) để đối soát tự động với điểm DBI.
          </p>
        </div>

        <button
          onClick={() => navigate('/vendor/listings/new')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Giải pháp Mới</span>
        </button>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Mã phân loại</th>
                <th className="p-4">Tên giải pháp niêm yết</th>
                <th className="p-4">Trụ cột DBI</th>
                <th className="p-4">Khung giá tham chiếu</th>
                <th className="p-4">Trạng thái Kiểm duyệt</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <span className="font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {item.id_tech}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.techName}</span>
                      {item.vsicCode && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          VSIC {item.vsicCode}
                        </span>
                      )}
                      {item.industry && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {item.industry.split('(')[0].trim()}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{item.summary}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{item.pillarId}</td>
                  <td className="p-4 font-bold text-slate-900">
                    {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                    <span className="text-[10px] text-slate-400 font-normal block">{item.priceUnit}</span>
                  </td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 font-normal">({item.reviewCount})</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setActiveTechDetailId(item.id);
                          navigate(`/tech/${item.id}`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Xem trang sản phẩm"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
