import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Store, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSelectPage: React.FC = () => {
  const { navigate, switchRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUYER');

  const handleContinue = () => {
    switchRole(selectedRole);
    navigate('/onboarding/company');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Bước 1: Định danh người dùng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Chọn mục tiêu tham gia Cổng DBI
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Vui lòng chọn vai trò phù hợp nhất với nhu cầu hiện tại của tổ chức/doanh nghiệp bạn.
          </p>
        </div>

        {/* 2 Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: BUYER */}
          <div
            onClick={() => setSelectedRole('BUYER')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
              selectedRole === 'BUYER'
                ? 'border-teal-600 bg-teal-50/50 shadow-md ring-2 ring-teal-600/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {selectedRole === 'BUYER' && (
              <div className="absolute top-4 right-4 text-teal-600">
                <CheckCircle className="w-6 h-6 fill-teal-600 text-white" />
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Tôi muốn MUA công nghệ</h3>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded mt-1 inline-block">
                  Vai trò: TECH BUYER
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Đánh giá miễn phí Mức độ Chuyển đổi số theo chuẩn DBI (25 câu hỏi).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Nhận báo cáo biểu đồ Radar 6 trụ cột và tư vấn khoảng trống ưu tiên.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Nhận danh sách giải pháp công nghệ AI gợi ý theo đúng ngân sách.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: VENDOR */}
          <div
            onClick={() => setSelectedRole('VENDOR')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
              selectedRole === 'VENDOR'
                ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {selectedRole === 'VENDOR' && (
              <div className="absolute top-4 right-4 text-blue-600">
                <CheckCircle className="w-6 h-6 fill-blue-600 text-white" />
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Tôi muốn BÁN công nghệ</h3>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded mt-1 inline-block">
                  Vai trò: TECH VENDOR
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Đăng tin giới thiệu giải pháp theo danh mục chuẩn hóa đóng (Closed Taxonomy).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Tiếp cận danh sách khách hàng doanh nghiệp có nhu cầu thực tế và đã có điểm DBI.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Trực tiếp trao đổi, gửi báo giá và quản lý phễu khách hàng tiềm năng.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Đã có tài khoản? <strong className="text-teal-700">Đăng nhập</strong>
          </button>
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục điền hồ sơ doanh nghiệp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
