import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Building2, 
  Store, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Compass, 
  Check, 
  Layers, 
  Sliders, 
  MessageSquare, 
  BarChart3,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

export const DemoQuickBar: React.FC = () => {
  const { currentUser, switchRole, navigate, currentRoute, resetAllDemoData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleReset = () => {
    if (confirm('Bạn có muốn đặt lại toàn bộ dữ liệu demo (khảo sát, tin nhắn, danh mục) về mặc định?')) {
      resetAllDemoData();
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3000);
    }
  };

  const KEY_DEMO_STEPS = [
    {
      title: '1. Khảo sát DBI (25 câu)',
      role: 'BUYER' as UserRole,
      route: '/assessment/new',
      desc: 'Form khảo sát với rẽ nhánh chuyên sâu và lưu tự động'
    },
    {
      title: '2. Báo cáo Radar Chart & Gap Analysis',
      role: 'BUYER' as UserRole,
      route: '/assessment/active/result',
      desc: 'Biểu đồ mạng nhện 6 trụ cột & Điểm chuẩn ngành'
    },
    {
      title: '3. Năng lực đầu tư & Gợi ý AI',
      role: 'BUYER' as UserRole,
      route: '/assessment/active/recommendations',
      desc: 'Khớp nối giải pháp công nghệ theo ngân sách và DBI'
    },
    {
      title: '4. So sánh 3 giải pháp & Gửi Inquiry',
      role: 'BUYER' as UserRole,
      route: '/tech/compare',
      desc: 'So sánh tính năng, giá cả và mở chatbox trực tiếp'
    },
    {
      title: '5. Đăng tin Danh mục Đóng (Vendor)',
      role: 'VENDOR' as UserRole,
      route: '/vendor/listings/new',
      desc: 'Chặn nhập tự do, bắt buộc chọn mã chuẩn Closed Taxonomy'
    },
    {
      title: '6. Quản lý Lead & Thống kê Vendor',
      role: 'VENDOR' as UserRole,
      route: '/vendor/leads',
      desc: 'Theo dõi tiến trình đàm phán và trao đổi tin nhắn'
    },
    {
      title: '7. Trọng số Khớp nối AI = 1.0 (Admin)',
      role: 'ADMIN' as UserRole,
      route: '/admin/matching-config',
      desc: 'Ràng buộc toán học tổng 4 trọng số luôn bằng 100%'
    },
    {
      title: '8. Duyệt Vendor SLA 24h (Admin)',
      role: 'ADMIN' as UserRole,
      route: '/admin/vendors',
      desc: 'Kiểm duyệt hồ sơ GPKD và xác thực MST'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-full shadow-xl border border-slate-700/80 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Demo Controller</span>
          <span className="w-2 h-2 rounded-full bg-teal-400" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-3 text-slate-800">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
                  Điều khiển Thử nghiệm Demo
                </h4>
                <p className="text-[11px] text-slate-300">
                  Chuyển vai trò & điểm mấu chốt một chạm
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* 1. Quick Role Switcher */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                1. Chuyển đổi Vai trò Hiện tại
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => switchRole('BUYER')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    currentUser.role === 'BUYER' 
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                  <div className="text-[11px] font-bold">Buyer</div>
                </button>

                <button
                  onClick={() => switchRole('VENDOR')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    currentUser.role === 'VENDOR' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-extrabold shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-[11px] font-bold">Vendor</div>
                </button>

                <button
                  onClick={() => switchRole('ADMIN')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    currentUser.role === 'ADMIN' 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 font-extrabold shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <div className="text-[11px] font-bold">Admin</div>
                </button>
              </div>
            </div>

            {/* 2. Key Demo Navigation Milestones */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                2. Bước Demo Quan trọng (Quick Jump)
              </label>
              <div className="space-y-1.5">
                {KEY_DEMO_STEPS.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (currentUser.role !== step.role) {
                        switchRole(step.role);
                      }
                      navigate(step.route);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      currentRoute === step.route
                        ? 'bg-teal-50/80 border-teal-300 font-bold'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{step.title}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{step.desc}</div>
                    </div>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      step.role === 'BUYER' ? 'bg-teal-100 text-teal-800' :
                      step.role === 'VENDOR' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {step.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Demo Data Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại dữ liệu Demo ban đầu</span>
              </button>
              {resetNotice && (
                <span className="text-[10px] font-extrabold text-emerald-600">Đã làm mới!</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
