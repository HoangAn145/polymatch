import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ExternalLink,
  Download,
  AlertTriangle,
  Copyright
} from 'lucide-react';

export const AdminVendorReview: React.FC = () => {
  const { pendingVendors, approveVendor, rejectVendor, navigate } = useApp();

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
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Hàng đợi Thẩm định Hồ sơ Nhà cung cấp (Vendor KYC)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Kiểm tra đối soát tính hợp lệ của Giấy phép ĐKKD (GPKD) và thông tin nộp thuế theo cam kết SLA 24 giờ.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>Hồ sơ đang chờ xử lý: <strong>{pendingVendors.length}</strong></span>
        </div>
      </div>

      {pendingVendors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Không có hồ sơ nào tồn đọng!</h3>
          <p className="text-xs text-slate-500">
            Tất cả nhà cung cấp công nghệ đăng ký đã được thẩm định đúng hạn theo SLA.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingVendors.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    Mã hồ sơ: {v.id}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {v.companyName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                    <span>MST: <strong>{v.mst}</strong></span>
                    <span>• Đại diện: <strong>{v.representative}</strong></span>
                    <span>• Tỉnh thành: <strong>{v.province}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-semibold block">Cam kết SLA duyệt:</span>
                    <strong className="text-xs text-amber-700 font-extrabold flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> Còn 18h 42m
                    </strong>
                  </div>
                </div>
              </div>

              {/* Middle details: Tax verification & GPKD / SHTT document preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Tax verification box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Tình trạng Tra cứu Thuế Doanh nghiệp</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div>Tên ĐKKD: <strong>{v.companyName}</strong></div>
                    <div>Tình trạng: <strong className="text-emerald-700">Đang hoạt động (Đã nộp thuế đầy đủ)</strong></div>
                    <div>Cơ quan thuế quản lý: Cục Thuế {v.province}</div>
                  </div>
                </div>

                {/* GPKD File Attachment */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span>Giấy phép ĐKKD (Bắt buộc)</span>
                    </div>
                    <div className="text-blue-950 font-semibold truncate" title={v.licenseFile}>{v.licenseFile || 'Chưa đính kèm'}</div>
                    <div className="text-[11px] text-blue-800/80">
                      Nộp lúc: {new Date(v.submittedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Xem tài liệu thẩm định: ${v.licenseFile}`)}
                    className="self-start px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800 text-xs font-bold hover:bg-blue-100/50 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Mở xem tệp GPKD</span>
                  </button>
                </div>

                {/* Intellectual Property Certificate */}
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Copyright className="w-4 h-4 text-purple-700" />
                      <span>Giấy Đăng ký Quyền Sở hữu trí tuệ</span>
                    </div>
                    <div className="text-purple-950 font-semibold truncate" title={v.intellectualPropertyFile || 'Chưa nộp'}>
                      {v.intellectualPropertyFile || 'Chưa nộp (Tùy chọn)'}
                    </div>
                    <div className="text-[11px] text-purple-800/80">
                      {v.intellectualPropertyFile ? 'Cục Bản quyền tác giả / Cục SHTT' : 'Không bắt buộc'}
                    </div>
                  </div>

                  {v.intellectualPropertyFile ? (
                    <button
                      onClick={() => alert(`Mở xem Giấy Đăng ký Quyền sở hữu trí tuệ: ${v.intellectualPropertyFile}`)}
                      className="self-start px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-800 text-xs font-bold hover:bg-purple-100/50 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Mở xem chứng nhận SHTT</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Chưa đính kèm văn bằng SHTT</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => rejectVendor(v.id)}
                  className="px-5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Yêu cầu bổ sung hồ sơ</span>
                </button>

                <button
                  onClick={() => approveVendor(v.id)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Phê duyệt Kích hoạt Nhà cung cấp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
