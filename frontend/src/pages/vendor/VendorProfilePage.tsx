import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  MapPin,
  Edit,
  Copyright
} from 'lucide-react';

export const VendorProfilePage: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Hồ sơ Nhà cung cấp Công nghệ (Vendor KYC)
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentUser.company.companyName}
            </h1>
            <p className="text-xs text-slate-500">
              Mã số thuế: <strong>{currentUser.company.mst}</strong> • Ngành: {currentUser.company.industry}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đã xác minh Thuế Quốc gia</span>
          </div>
        </div>

        {/* Overview Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Người đại diện pháp luật</span>
            <div className="text-slate-800 font-semibold">{currentUser.fullName}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Hotline kỹ thuật</span>
            <div className="text-slate-800 font-semibold">{currentUser.phone}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Email nhận yêu cầu giải pháp</span>
            <div className="text-slate-800 font-semibold">{currentUser.email}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Trụ sở chính</span>
            <div className="text-slate-800 font-semibold">{currentUser.company.province}, Việt Nam</div>
          </div>
        </div>
      </div>

      {/* Business License & SLA Document Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Giấy chứng nhận Đăng ký Doanh nghiệp & Hồ sơ Pháp lý</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <strong className="text-xs text-slate-800 font-bold block">
              {currentUser.company.licenseFile || 'GPKD_XacThuc_DienTu_ChungThucSo.pdf'}
            </strong>
            <span className="text-[11px] text-slate-400">
              Giấy phép ĐKKD • Định dạng PDF • Đã xác thực Chữ ký số Ban Cơ yếu
            </span>
          </div>

          <button
            onClick={() => alert('Tải xuống thành công tài liệu pháp lý GPKD.')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải tệp lưu trữ</span>
          </button>
        </div>

        {/* Giấy Đăng ký Quyền sở hữu trí tuệ */}
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-xs text-purple-950 font-bold block">
                {currentUser.company.intellectualPropertyFile || 'Giay_Chung_Nhan_Dang_Ky_Quyen_SHTT_PhanMem.pdf'}
              </strong>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                <Copyright className="w-3 h-3" /> Đã thẩm định
              </span>
            </div>
            <span className="text-[11px] text-purple-900/80">
              Giấy Đăng ký Quyền Sở hữu trí tuệ (Cục Bản quyền tác giả & Cục SHTT) • Cấp quyền bảo hộ giải pháp công nghệ
            </span>
          </div>

          <button
            onClick={() => alert('Tải xuống thành công Giấy chứng nhận Đăng ký Quyền Sở hữu trí tuệ.')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-purple-100/60 text-purple-900 border border-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>Tải văn bằng SHTT</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>Quy chế Quản lý & SLA Phản hồi Khách hàng</span>
          </div>
          <p className="text-[11px] text-blue-950/80 leading-relaxed">
            Nhà cung cấp cam kết phản hồi các yêu cầu báo giá từ các doanh nghiệp có mã đánh giá DBI trong vòng 24 giờ. Trường hợp vi phạm quá 3 lần sẽ bị tạm ngưng hiển thị trên Sàn B2B.
          </p>
        </div>
      </div>
    </div>
  );
};
