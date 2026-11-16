import React, { useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Layers,
  LayoutDashboard,
  Building2,
  FileCheck2,
  Award,
  AlertTriangle,
  Lightbulb,
  GitCompare,
  Calculator,
  Send,
  FileSpreadsheet,
  Users,
  FolderGit2,
  History,
  Settings,
  ShieldAlert,
  PlusCircle,
  FileText,
  BadgePercent,
  CreditCard,
  BarChart3,
  UserCheck,
  CalendarDays,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { authService } from "../services/authService";
import { dbService } from "../services/mockDatabase";
import { DemoToolbar } from "../components/common/DemoToolbar";
import { useToast } from "../components/ui/Toast";

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  if (!currentUser) return <Navigate to="/login" replace />;
  const requestedRole = location.pathname.split("/")[1]?.toUpperCase();
  if (
    ["BUYER", "SELLER", "ADMIN"].includes(requestedRole) &&
    requestedRole !== currentUser.role
  )
    return (
      <Navigate to={`/${currentUser.role.toLowerCase()}/dashboard`} replace />
    );

  const wallet = currentUser ? dbService.getWallet(currentUser.id) : null;
  const walletPath =
    currentUser?.role === "BUYER"
      ? "/buyer/wallet"
      : currentUser?.role === "SELLER"
        ? "/seller/wallet"
        : "/admin/wallets";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      toast.error("Không thể đăng xuất", (e as Error).message);
      return;
    }
    toast.info("Đã đăng xuất", "Hẹn gặp lại bạn!");
    navigate("/login");
  };

  // Nav items per role
  const buyerNav = [
    {
      title: "Tổng quan",
      path: "/buyer/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      title: "Hồ sơ doanh nghiệp",
      path: "/buyer/profile",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      title: "Đánh giá chuyển đổi số",
      path: "/buyer/assessment",
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      title: "Kết quả đánh giá",
      path: "/buyer/results",
      icon: <Award className="w-4 h-4" />,
    },
    {
      title: "Điểm nghẽn logistics",
      path: "/buyer/gaps",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      title: "Giải pháp đề xuất",
      path: "/buyer/solutions",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      title: "So sánh giải pháp",
      path: "/buyer/compare",
      icon: <GitCompare className="w-4 h-4" />,
    },
    {
      title: "Mô phỏng ROI",
      path: "/buyer/roi",
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      title: "Yêu cầu kết nối",
      path: "/buyer/connections",
      icon: <Send className="w-4 h-4" />,
    },
    {
      title: "Ví tín chỉ (Nạp / Rút)",
      path: "/buyer/wallet",
      icon: <Coins className="w-4 h-4 text-amber-500" />,
    },
    {
      title: "Báo cáo chuyên sâu",
      path: "/buyer/reports",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      title: "Tư vấn chuyên gia",
      path: "/buyer/consulting",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Dự án & KPI",
      path: "/buyer/projects",
      icon: <FolderGit2 className="w-4 h-4" />,
    },
    {
      title: "Lịch sử đánh giá",
      path: "/buyer/history",
      icon: <History className="w-4 h-4" />,
    },
    {
      title: "Lộ trình triển khai",
      path: "/buyer/roadmap",
      icon: <FolderGit2 className="w-4 h-4" />,
    },
    {
      title: "Lịch sử KPI & Cảnh báo",
      path: "/buyer/kpi",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      title: "Hỗ trợ CSKH",
      path: "/buyer/support",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      title: "Cài đặt tài khoản",
      path: "/buyer/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const sellerNav = [
    {
      title: "Tổng quan",
      path: "/seller/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      title: "Hồ sơ nhà cung cấp",
      path: "/seller/profile",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      title: "Xác minh tài khoản",
      path: "/seller/verification",
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      title: "Giải pháp của tôi",
      path: "/seller/solutions",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      title: "Thêm giải pháp",
      path: "/seller/solutions/new",
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      title: "Yêu cầu kết nối",
      path: "/seller/requests",
      icon: <Send className="w-4 h-4" />,
    },
    {
      title: "Báo giá đã gửi",
      path: "/seller/quotes",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Hợp đồng giao dịch",
      path: "/seller/contracts",
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      title: "Ví tín chỉ (Nạp / Rút)",
      path: "/seller/wallet",
      icon: <Coins className="w-4 h-4 text-amber-500" />,
    },
    {
      title: "Đối soát hoa hồng",
      path: "/seller/commission",
      icon: <BadgePercent className="w-4 h-4" />,
    },
    {
      title: "Gói tham gia (6tr/năm)",
      path: "/seller/subscription",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      title: "Thống kê hiệu quả",
      path: "/seller/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      title: "Hỗ trợ CSKH",
      path: "/seller/support",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      title: "Cài đặt tài khoản",
      path: "/seller/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const adminNav = [
    {
      title: "Tổng quan nền tảng",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      title: "Quản lý người dùng",
      path: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Xác minh nhà cung cấp",
      path: "/admin/sellers",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      title: "Duyệt giải pháp",
      path: "/admin/solutions",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      title: "Quản lý chuyên gia",
      path: "/admin/experts",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Lịch tư vấn",
      path: "/admin/consulting",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      title: "Quản lý ví & Tín chỉ",
      path: "/admin/wallets",
      icon: <Coins className="w-4 h-4 text-amber-500" />,
    },
    {
      title: "Bộ câu hỏi & Tiêu chí",
      path: "/admin/questions",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      title: "Yêu cầu kết nối sàn",
      path: "/admin/connections",
      icon: <Send className="w-4 h-4" />,
    },
    {
      title: "Giao dịch & Hoa hồng",
      path: "/admin/transactions",
      icon: <BadgePercent className="w-4 h-4" />,
    },
    {
      title: "Quản lý bài viết",
      path: "/admin/articles",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Cấu hình hệ thống",
      path: "/admin/config",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      title: "Tri thức chatbot",
      path: "/admin/knowledge",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Yêu cầu CSKH",
      path: "/admin/support",
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      title: "Nhật ký CSKH",
      path: "/admin/support-audit",
      icon: <History className="w-4 h-4" />,
    },
    {
      title: "Nhật ký hệ thống",
      path: "/admin/audit",
      icon: <History className="w-4 h-4" />,
    },
  ];

  let currentNav = buyerNav;
  let roleTitle = "Doanh nghiệp (Buyer)";
  let roleBg = "bg-blue-600";
  if (currentUser.role === "SELLER") {
    currentNav = sellerNav;
    roleTitle = "Nhà cung cấp (Seller)";
    roleBg = "bg-emerald-600";
  } else if (currentUser.role === "ADMIN") {
    currentNav = adminNav;
    roleTitle = "Quản trị viên (Admin)";
    roleBg = "bg-purple-600";
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      {/* Demo toolbar across top */}
      <DemoToolbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Component (Clean BDX style) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1769AA] flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#1769AA]">
                POLYMATCH
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Actor Tag */}
          <div className="p-3 mx-3 my-2 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${roleBg}`} />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {roleTitle}
              </span>
            </div>
            <p
              className="text-xs font-semibold text-slate-900 mt-1 truncate"
              title={currentUser.companyName}
            >
              {currentUser.companyName}
            </p>
            {currentUser.role === "SELLER" && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    currentUser.vendorApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {currentUser.vendorApproved
                    ? "✓ Đã xác minh"
                    : "⏳ Chờ Admin duyệt"}
                </span>
              </div>
            )}

            {/* Wallet Quick Balance in Sidebar */}
            <Link
              to={walletPath}
              className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/60 p-1 rounded transition-colors group"
              title="Nhấn để xem Ví Tín Chỉ"
            >
              <div className="flex items-center gap-1.5 text-slate-600">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium">Số dư ví:</span>
              </div>
              <div className="font-extrabold text-[#1769AA] font-mono flex items-center gap-1">
                <span>
                  {wallet ? wallet.so_du_tin_chi.toLocaleString("vi-VN") : 0}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  TC
                </span>
              </div>
            </Link>
          </div>

          {/* Nav items list */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-[#1769AA] font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`${isActive ? "text-[#1769AA]" : "text-slate-400"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar bottom portal quick links */}
          <div className="p-3 border-t border-slate-100 shrink-0 space-y-1">
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>Về trang chủ công khai</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar */}
          <header className="h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb path */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {roleTitle}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-medium capitalize">
                  {location.pathname.split("/").pop()?.replace(/-/g, " ") ||
                    "Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser.role === "BUYER" && (
                <Link
                  to="/buyer/assessment"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-[#1769AA] hover:bg-[#104D80] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Đánh giá chuyển đổi số</span>
                </Link>
              )}

              {currentUser.role === "SELLER" && (
                <Link
                  to="/seller/solutions/new"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm giải pháp mới</span>
                </Link>
              )}

              {/* Wallet Quick Balance in Header */}
              <Link
                to={walletPath}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors shadow-2xs"
                title="Nhấn để xem Ví tín chỉ & Nạp / Rút"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-mono">
                  {wallet ? wallet.so_du_tin_chi.toLocaleString("vi-VN") : 0}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold uppercase">
                  Tín chỉ
                </span>
              </Link>

              <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />

              {/* User profile capsule */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">
                    {currentUser.companyName}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Render */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
