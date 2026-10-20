import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/authService';
import { DemoToolbar } from '../components/common/DemoToolbar';
import { useToast } from '../components/ui/Toast';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast.info("Đã đăng xuất", "Hẹn gặp lại bạn!");
    navigate('/');
  };

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Đánh giá nhanh", path: "/quick-scan" },
    { name: "Giải pháp công nghệ", path: "/solutions" },
    { name: "Nhà cung cấp", path: "/providers" },
    { name: "Tư vấn chuyên gia", path: "/consulting" },
    { name: "Bảng giá", path: "/pricing" },
    { name: "Tin tức", path: "/insights" },
    { name: "Liên hệ", path: "/contact" }
  ];

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'BUYER') return '/buyer/dashboard';
    if (currentUser.role === 'SELLER') return '/seller/dashboard';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-800">
      {/* Demo helper toolbar */}
      <DemoToolbar />

      {/* Main Header (BDX Portal Inspired) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        {/* Top bar with contact & portal announcement */}
        <div className="bg-[#104D80] text-slate-100 text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Cổng đánh giá mức độ trưởng thành số & kết nối giải pháp Logistics Việt Nam
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3 h-3 text-blue-300" /> Hotline hỗ trợ: 1900 6868
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <span className="text-[11px] bg-[#1769AA] px-2 py-0.5 rounded font-medium">Bản thử nghiệm Pilot</span>
              <span className="text-slate-300">Đồng bộ tiêu chuẩn VNYTL 2026</span>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-lg bg-[#1769AA] flex items-center justify-center text-white shadow-sm group-hover:bg-[#104D80] transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#1769AA] group-hover:text-[#104D80] transition-colors">
                  POLYMATCH
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Logistics & Chuỗi cung ứng
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'text-[#1769AA] bg-blue-50/90 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* User action buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center gap-2 bg-[#1769AA] hover:bg-[#104D80] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard ({currentUser.role})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-700 hover:text-[#1769AA] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 bg-[#1769AA] hover:bg-[#104D80] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                  >
                    <span>Đăng ký</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex xl:hidden items-center gap-2">
              {currentUser && (
                <Link
                  to={getDashboardPath()}
                  className="bg-[#1769AA] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-[#1769AA] bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#1769AA] text-white font-semibold py-2 rounded-lg text-sm"
                  >
                    Vào trang quản trị ({currentUser.role})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-rose-600 hover:bg-rose-50 font-medium py-2 rounded-lg text-sm"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center border border-slate-300 font-semibold py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#1769AA] text-white font-semibold py-2 rounded-lg text-sm"
                  >
                    Đăng ký tài khoản
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (Clean BDX Enterprise Style) */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Slogan */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1769AA] flex items-center justify-center text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">POLYMATCH</span>
              </div>
              <p className="text-xs text-slate-400 font-medium italic">
                “Đánh giá đúng – Kết nối trúng – Chuyển đổi nhanh”
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Nền tảng hỗ trợ doanh nghiệp trong chuỗi cung ứng logistics đánh giá mức độ trưởng thành số, nhận diện điểm nghẽn và tìm kiếm giải pháp công nghệ phù hợp với ngân sách và khả năng triển khai thực tế.
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                Tuân thủ khung nguyên tắc trung lập VNYTL và phương pháp đánh giá DBI theo Quyết định 2158/QĐ-BTTTT.
              </div>
            </div>

            {/* Col 2: Dành cho Doanh nghiệp */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Doanh nghiệp</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/quick-scan" className="hover:text-white transition-colors">Đánh giá nhanh (Quick Scan)</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition-colors">Tra cứu giải pháp công nghệ</Link></li>
                <li><Link to="/consulting" className="hover:text-white transition-colors">Tư vấn chuyên gia (Basic/Pro)</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Báo cáo chẩn đoán chuyên sâu</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Cách POLYMATCH chấm điểm</Link></li>
              </ul>
            </div>

            {/* Col 3: Nhà cung cấp & Đối tác */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Nhà cung cấp</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/register/seller" className="hover:text-white transition-colors">Đăng ký tham gia nền tảng</Link></li>
                <li><Link to="/providers" className="hover:text-white transition-colors">Danh sách nhà cung cấp xác thực</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Biểu phí & Hoa hồng hợp đồng</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Quy chế xác minh mã số thuế</Link></li>
              </ul>
            </div>

            {/* Col 4: Liên hệ & Hỗ trợ */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Thông tin hỗ trợ</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>hotro@polymatch.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>1900 6868 (8:00 - 17:30)</span>
                </li>
                <li><Link to="/insights" className="hover:text-white transition-colors">Logistics Insights</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ đối tác</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer note */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} POLYMATCH. Bản quyền thuộc về Dự án Nền tảng Chuyển đổi số Logistics.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Môi trường thử nghiệm tĩnh tương tác (Frontend Demo)</span>
              <span>Chính sách bảo mật dữ liệu</span>
              <span>Điều khoản sử dụng</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
