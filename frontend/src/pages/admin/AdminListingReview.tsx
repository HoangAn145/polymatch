import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Building2, 
  Tag, 
  DollarSign, 
  Clock, 
  Check 
} from 'lucide-react';
import { TechListing } from '../../types';

export const AdminListingReview: React.FC = () => {
  const { techListings, approveListing, rejectListing, navigate } = useApp();

  const pendingListings = techListings.filter(t => t.status === 'PENDING_REVIEW');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <Layers className="w-6 h-6 text-purple-600" />
            <span>Kiểm duyệt Danh mục Giải pháp Công nghệ (Listings Review)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kiểm tra đối soát tính tuân thủ với danh mục phân loại đóng (Closed Taxonomy) và tính minh bạch về chi phí.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900">
          Chờ kiểm duyệt: <strong>{pendingListings.length}</strong>
        </div>
      </div>

      {pendingListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Tất cả giải pháp đã được phê duyệt!</h3>
          <p className="text-xs text-slate-500">
            Không có giải pháp nào đang ở trạng thái chờ duyệt.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      Mã chuẩn: {item.id_tech}
                    </span>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                      Trụ cột: {item.pillarId}
                    </span>
                    <span className="text-[11px] text-slate-400">ID: {item.id}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {item.techName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Nhà cung cấp: <strong>{item.vendorName}</strong> (MST: {item.vendorMst})</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase">Khung chi phí niêm yết</span>
                  <span className="text-base font-extrabold text-teal-700">
                    {item.priceMin.toLocaleString('vi-VN')} - {item.priceMax.toLocaleString('vi-VN')} VND
                  </span>
                  <span className="text-slate-400 text-xs block">{item.priceUnit}</span>
                </div>
              </div>

              {/* Summary and Features */}
              <div className="space-y-3 text-xs">
                <div>
                  <strong className="text-slate-700 block mb-1">Mô tả tóm tắt giải pháp:</strong>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <strong className="text-slate-700 block mb-1.5">Tính năng công bố:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => rejectListing(item.id)}
                  className="px-5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Từ chối niêm yết</span>
                </button>

                <button
                  onClick={() => approveListing(item.id)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Duyệt & Công khai trên Sàn</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
