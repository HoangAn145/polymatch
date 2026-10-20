import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Building2, UserCheck, ArrowRight } from 'lucide-react';

export const RegisterChoicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1769AA] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-[#1769AA] tracking-tight">POLYMATCH</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chọn loại tài khoản đăng ký
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vui lòng chọn vai trò phù hợp nhất với mô hình hoạt động của bạn trên nền tảng POLYMATCH.
          </p>
        </div>

        {/* 2 Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Choice 1: Buyer */}
          <Link
            to="/register/buyer"
            className="group bg-white p-8 rounded-2xl border-2 border-slate-200/90 hover:border-[#1769AA] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1769AA] flex items-center justify-center group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#1769AA] transition-colors">
                Doanh nghiệp (Buyer)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dành cho các doanh nghiệp vận tải, kho bãi, giao nhận (Forwarder) và chủ hàng muốn đánh giá mức độ trưởng thành số, chẩn đoán điểm nghẽn và tìm giải pháp công nghệ phù hợp.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li>• Khảo sát DBI & LDMI miễn phí</li>
                <li>• Nhận danh sách giải pháp tương thích</li>
                <li>• Gửi yêu cầu báo giá trực tiếp tới Seller</li>
              </ul>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1769AA] pt-4 border-t border-slate-100">
              <span>Đăng ký Doanh nghiệp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Choice 2: Seller */}
          <Link
            to="/register/seller"
            className="group bg-white p-8 rounded-2xl border-2 border-slate-200/90 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                Nhà cung cấp (Seller)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dành cho các công ty phần mềm, nhà tích hợp hệ thống, nhà cung cấp thiết bị phần cứng GPS, RFID, ERP muốn giới thiệu giải pháp và kết nối doanh nghiệp có nhu cầu.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li>• Niêm yết sản phẩm đã thẩm định MST</li>
                <li>• Nhận yêu cầu kết nối từ các Buyer khớp</li>
                <li>• Gửi báo giá & đối soát hợp đồng minh bạch</li>
              </ul>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 pt-4 border-t border-slate-100">
              <span>Đăng ký Nhà cung cấp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Login link */}
        <div className="text-center text-xs text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-[#1769AA] hover:underline">
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};
