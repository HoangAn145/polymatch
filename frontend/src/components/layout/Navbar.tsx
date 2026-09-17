import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Store, 
  Compass, 
  ChevronDown, 
  Bell, 
  LogOut, 
  Sparkles,
  Search,
  LayoutGrid,
  X,
  Check,
  Lock,
  ShieldAlert,
  Menu,
  BarChart3,
  BadgeCheck,
  Wallet
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentRoute: rawRoute, 
    navigate, 
    currentUser, 
    switchRole, 
    logout,
    leads,
    compareList,
    pendingVendors,
    techListings,
    vendorWalletBalance
  } = useApp();
  const currentRoute = rawRoute || '/';
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoutesDrawer, setShowRoutesDrawer] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerTab, setDrawerTab] = useState<'ACTIVE' | 'LOCKED'>('ACTIVE');
  const [lockedPrompt, setLockedPrompt] = useState<{ name: string; requiredRole: UserRole; path: string } | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadLeadsCount = (leads || []).filter(l => l.status === 'new').length;
  const compareCount = (compareList || []).length;
  const pendingVendorsCount = (pendingVendors || []).length;
  const pendingListingsCount = (techListings || []).filter(t => t.status === 'pending').length;

  const ALL_ROUTES_MAP = [
    {
      id: 'BUYER' as UserRole,
      category: 'Doanh nghiệp Mua (Tech Buyer)',
      icon: Building2,
      color: 'teal',
      badge: 'Buyer',
      desc: 'Đánh giá DBI, xem Radar Chart, nhận gợi ý AI & chat đàm phán giải pháp',
      routes: [
        { path: '/dashboard', name: '1. Bảng điều khiển Doanh nghiệp Mua (Buyer Dashboard)', desc: 'Tổng quan điểm số, đề xuất công nghệ và tiến độ số hóa' },
        { path: '/assessment/intro', name: '2. Giới thiệu Khảo sát DBI', desc: 'Xem chuẩn khung đánh giá SME (100đ) hoặc DN Lớn (695đ)' },
        { path: '/assessment/new', name: '3. Khảo sát Chuyển đổi số 25 câu DBI', desc: 'Thực hiện chấm điểm 6 trụ cột theo thang điểm pháp định' },
        { path: '/assessment/active/result', name: '4. Kết quả Đánh giá & Radar Chart 6 Trụ cột', desc: 'Biểu đồ mạng nhện, điểm chuẩn ngành và Top 3 khoảng trống GAP' },
        { path: '/assessment/active/investment', name: '5. Năng lực & Dự toán Đầu tư Chuyển đổi số', desc: 'Khai báo ngân sách, thời gian triển khai và kỳ vọng ROI' },
        { path: '/assessment/active/recommendations', name: '6. Danh mục Giải pháp Công nghệ AI Đề xuất', desc: 'Thuật toán khớp nối công nghệ dựa trên khoảng trống điểm DBI' },
        { path: '/tech/LISTING-001', name: '7. Chi tiết Giải pháp Công nghệ & Báo giá', desc: 'Xem cấu hình tính năng, SLA và hồ sơ nhà cung cấp' },
        { path: '/tech/compare', name: '8. So sánh Đối chiếu Giải pháp', desc: 'So sánh ma trận tính năng giữa tối đa 3 giải pháp cùng loại' },
        { path: '/interests', name: '9. Tin quan tâm, Đàm phán & Chatbox B2B', desc: 'Quản lý danh sách gửi yêu cầu tư vấn và tin nhắn trực tuyến' },
        { path: '/assessment/history', name: '10. Lịch sử các Kỳ Đánh giá DBI', desc: 'Theo dõi tiến trình tăng trưởng mức độ chuyển đổi số qua các năm' }
      ]
    },
    {
      id: 'VENDOR' as UserRole,
      category: 'Nhà cung cấp Công nghệ (Tech Vendor)',
      icon: Store,
      color: 'blue',
      badge: 'Vendor',
      desc: 'Đăng tin danh mục đóng, tiếp cận khách hàng tiềm năng và quản lý giao dịch B2B',
      routes: [
        { path: '/vendor', name: '1. Bảng điều khiển Nhà cung cấp (Vendor Dashboard)', desc: 'Tổng quan lượt xem tin, số lead mới và chỉ số SLA cam kết' },
        { path: '/vendor/listings', name: '2. Quản lý Tin đăng Giải pháp Công nghệ', desc: 'Danh sách các giải pháp đã duyệt, đang chờ duyệt hoặc cần sửa' },
        { path: '/vendor/listings/new', name: '3. Tạo Tin đăng Danh mục đóng (Closed Taxonomy)', desc: 'Đăng tin theo mã chuẩn danh mục số hóa' },
        { path: '/vendor/leads', name: '4. Quản lý Khách tiềm năng (Lead) & Chatbox', desc: 'Tiếp nhận inquiry từ doanh nghiệp mua và phản hồi đàm phán' },
        { path: '/vendor/analytics', name: '5. Thống kê Hiệu quả & Xuất Báo cáo Excel', desc: 'Phân tích tỷ lệ chuyển đổi, độ quan tâm theo từng trụ cột DBI' },
        { path: '/vendor/profile', name: '6. Hồ sơ Năng lực Nhà cung cấp & Xác thực KYC', desc: 'Cập nhật GPKD, MST, chứng nhận ISO/an toàn thông tin' }
      ]
    },
    {
      id: 'ADMIN' as UserRole,
      category: 'Quản trị viên Hệ thống (Platform Admin)',
      icon: ShieldCheck,
      color: 'purple',
      badge: 'Admin',
      desc: 'Kiểm duyệt Vendor SLA 24h, cấu hình thuật toán khớp nối và quản trị danh mục chuẩn',
      routes: [
        { path: '/admin', name: '1. Bảng điều khiển Quản trị Cấp cao (Admin Dashboard)', desc: 'Giám sát toàn cảnh hệ thống DBI, số lượng doanh nghiệp và giao dịch' },
        { path: '/admin/vendors', name: '2. Hàng đợi Duyệt Vendor (Cam kết SLA 24h)', desc: 'Thẩm định hồ sơ pháp lý, MST và giấy phép kinh doanh của Vendor' },
        { path: '/admin/listings', name: '3. Hàng đợi Duyệt Tin đăng Giải pháp', desc: 'Kiểm duyệt nội dung tin đăng bám sát danh mục đóng' },
        { path: '/admin/tech-catalog', name: '4. Quản lý Danh mục Công nghệ Chuẩn', desc: 'Quản lý cây phân cấp danh mục đóng và hỗ trợ Import Excel' },
        { path: '/admin/questions', name: '5. Quản lý Bộ câu hỏi & Trọng số Trụ cột DBI', desc: 'Cập nhật nội dung câu hỏi trắc nghiệm DBI' },
        { path: '/admin/matching-config', name: '6. Cấu hình Thuật toán Khớp nối AI (Tổng = 1.0)', desc: 'Điều chỉnh trọng số: Điểm DBI, Ngân sách, Ngành và Quy mô' },
        { path: '/admin/users', name: '7. Quản lý Người dùng & Phân quyền RBAC', desc: 'Quản lý tài khoản doanh nghiệp mua, nhà cung cấp và chuyên gia' },
        { path: '/admin/reports', name: '8. Báo cáo & Thống kê Phổ cập Chuyển đổi số', desc: 'Tổng hợp phân bố cấp độ số hóa của cộng đồng doanh nghiệp' }
      ]
    },
    {
      id: 'GUEST' as UserRole,
      category: 'Công khai & Xác thực (Public & Auth)',
      icon: Compass,
      color: 'slate',
      badge: 'Công khai',
      desc: 'Các trang thông tin mở, đăng ký, đăng nhập và tìm hiểu nền tảng',
      routes: [
        { path: '/', name: '1. Trang chủ Cổng Thông tin DBI (Landing Page)', desc: 'Giới thiệu tổng quan hệ thống đánh giá chuyển đổi số và sàn B2B' },
        { path: '/login', name: '2. Đăng nhập Hệ thống (Login)', desc: 'Truy cập tài khoản người dùng' },
        { path: '/forgot-password', name: '3. Khôi phục Mật khẩu (Forgot Password)', desc: 'Lấy lại mật khẩu qua email xác thực' },
        { path: '/onboarding/company', name: '4. Khởi tạo Hồ sơ Doanh nghiệp (Company Onboarding)', desc: 'Khai báo mã số thuế, quy mô doanh nghiệp ban đầu' }
      ]
    }
  ];

  const activeGroup = ALL_ROUTES_MAP.find(g => g.id === currentUser.role) || ALL_ROUTES_MAP[0];
  const lockedGroups = ALL_ROUTES_MAP.filter(g => g.id !== currentUser.role && g.id !== 'GUEST');

  const handleRouteClick = (path: string, requiredRole: UserRole, name: string) => {
    if (requiredRole === currentUser.role || requiredRole === 'GUEST') {
      navigate(path);
      setShowRoutesDrawer(false);
    } else {
      if (currentUser.role === 'GUEST') {
        sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập tài khoản để truy cập chức năng "${name}".`);
        navigate('/login');
        setShowRoutesDrawer(false);
      } else {
        setLockedPrompt({ name, requiredRole, path });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex justify-end items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="inline-flex items-center gap-1 text-[11px] text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800/80 hover:bg-teal-900 transition-colors cursor-pointer"
              >
                <span className="text-teal-400 font-medium">Vai trò:</span>
                <strong className="text-white">
                  {currentUser.role === 'BUYER' ? 'Doanh nghiệp Mua' :
                   currentUser.role === 'VENDOR' ? 'Nhà cung cấp' :
                   currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Khách vãng lai'}
                </strong>
                <ChevronDown className="w-3 h-3 text-teal-400" />
              </button>

              {showRoleMenu && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-slate-800 z-50 animate-in fade-in"
                  onClick={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Chuyển đổi vai trò kiểm thử</span>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  </div>
                  <button
                    onClick={() => switchRole('BUYER')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${currentUser.role === 'BUYER' ? 'font-bold text-teal-700 bg-teal-50' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Doanh nghiệp Mua (Buyer)</div>
                      <div className="text-[10px] text-slate-500">Đánh giá DBI & Nhận gợi ý giải pháp AI</div>
                    </div>
                  </button>
                  <button
                    onClick={() => switchRole('VENDOR')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${currentUser.role === 'VENDOR' ? 'font-bold text-blue-700 bg-blue-50' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Store className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Nhà cung cấp (Vendor)</div>
                      <div className="text-[10px] text-slate-500">Đăng tin giải pháp & Tiếp cận khách hàng</div>
                    </div>
                  </button>
                  <button
                    onClick={() => switchRole('ADMIN')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${currentUser.role === 'ADMIN' ? 'font-bold text-purple-700 bg-purple-50' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Quản trị viên (Admin)</div>
                      <div className="text-[10px] text-slate-500">Kiểm duyệt Vendor, Tin đăng & Trọng số</div>
                    </div>
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => switchRole('GUEST')}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      <span>Chế độ Khách vãng lai (Chưa đăng nhập)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              id="navbar-brand-logo"
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0" 
              onClick={() => navigate('/')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-teal-600 flex items-center justify-center text-white shadow-md font-black text-base sm:text-lg tracking-wider shrink-0 group-hover:scale-105 transition-transform">
                DBI
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                POLY<span className="text-teal-600">MATCH</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {currentUser.role === 'BUYER' && (
                <>
                  <button onClick={() => navigate('/dashboard')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/dashboard' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Bảng điều khiển</button>
                  <button onClick={() => navigate('/assessment/intro')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute.startsWith('/assessment') && !currentRoute.includes('recommendations') && !currentRoute.includes('result') && !currentRoute.includes('history') ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Đánh giá DBI (25 câu)</button>
                  <button onClick={() => navigate('/assessment/active/result')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute.includes('result') ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Radar 6 Trụ cột</button>
                  <button onClick={() => navigate('/assessment/active/recommendations')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute.includes('recommendations') ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Giải pháp Đề xuất</button>
                  <button onClick={() => navigate('/tech/compare')} className={`px-3 py-2 rounded-lg transition-colors relative ${currentRoute === '/tech/compare' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>
                    <span>So sánh giải pháp</span>
                    {compareCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-teal-600 text-white rounded-full text-[10px] font-bold">{compareCount}</span>}
                  </button>
                  <button onClick={() => navigate('/interests')} className={`px-3 py-2 rounded-lg transition-colors relative ${currentRoute === '/interests' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>
                    <span>Quan tâm & Chat</span>
                    {unreadLeadsCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-teal-600 text-white rounded-full text-[10px] font-bold">{unreadLeadsCount}</span>}
                  </button>
                  <button onClick={() => navigate('/assessment/history')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/assessment/history' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Lịch sử đánh giá</button>
                </>
              )}

              {currentUser.role === 'VENDOR' && (
                <>
                  <button onClick={() => navigate('/vendor')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/vendor' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>Tổng quan Vendor</button>
                  <button onClick={() => navigate('/vendor/listings')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute.startsWith('/vendor/listings') && currentRoute !== '/vendor/listings/new' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>Quản lý Tin đăng</button>
                  <button onClick={() => navigate('/vendor/listings/new')} className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${currentRoute === '/vendor/listings/new' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>+ Đăng tin mới</button>
                  <button onClick={() => navigate('/vendor/leads')} className={`px-3 py-2 rounded-lg transition-colors relative ${currentRoute === '/vendor/leads' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>
                    <span>Khách tiềm năng</span>
                    {unreadLeadsCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold">{unreadLeadsCount}</span>}
                  </button>
                  <button onClick={() => navigate('/vendor/analytics')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/vendor/analytics' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>Thống kê hiệu quả</button>
                  <button onClick={() => navigate('/vendor/profile')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/vendor/profile' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'}`}>Hồ sơ & KYC</button>
                </>
              )}

              {currentUser.role === 'ADMIN' && (
                <>
                  <button onClick={() => navigate('/admin')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/admin' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>Admin Dashboard</button>
                  <button onClick={() => navigate('/admin/vendors')} className={`px-3 py-2 rounded-lg transition-colors relative ${currentRoute === '/admin/vendors' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>
                    <span>Duyệt Vendor</span>
                    {pendingVendorsCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-purple-600 text-white rounded-full text-[10px] font-bold">{pendingVendorsCount}</span>}
                  </button>
                  <button onClick={() => navigate('/admin/listings')} className={`px-3 py-2 rounded-lg transition-colors relative ${currentRoute === '/admin/listings' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>
                    <span>Duyệt Tin đăng</span>
                    {pendingListingsCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-amber-600 text-white rounded-full text-[10px] font-bold">{pendingListingsCount}</span>}
                  </button>
                  <button onClick={() => navigate('/admin/tech-catalog')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/admin/tech-catalog' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>Danh mục Chuẩn</button>
                  <button onClick={() => navigate('/admin/questions')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/admin/questions' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>Bộ Câu hỏi DBI</button>
                  <button onClick={() => navigate('/admin/matching-config')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/admin/matching-config' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>Thuật toán AI</button>
                  <button onClick={() => navigate('/admin/users')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/admin/users' ? 'text-purple-700 bg-purple-50 font-bold' : 'text-slate-700 hover:text-purple-600 hover:bg-slate-50'}`}>Người dùng</button>
                </>
              )}

              {currentUser.role === 'GUEST' && (
                <>
                  <button onClick={() => navigate('/')} className={`px-3 py-2 rounded-lg transition-colors ${currentRoute === '/' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'}`}>Trang chủ</button>
                  <button onClick={() => { sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập để thực hiện Khảo sát Đánh giá Chuyển đổi số DBI.'); navigate('/login'); }} className="px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-colors cursor-pointer">Bộ chỉ số DBI</button>
                  <button onClick={() => { sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập để truy cập Đề xuất Giải pháp Công nghệ trên Sàn B2B.'); navigate('/login'); }} className="px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-colors cursor-pointer">Sàn Công nghệ B2B</button>
                  <button onClick={() => { sessionStorage.setItem('dbi_login_notice', 'Vui lòng đăng nhập để sử dụng tính năng So sánh Giải pháp Công nghệ.'); navigate('/login'); }} className="px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-colors cursor-pointer">So sánh Giải pháp</button>
                </>
              )}
            </nav>

            {/* Right Action Profile & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser.role === 'GUEST' ? (
                <div className="flex items-center">
                  {/* Chỉ giữ duy nhất Nút Đăng nhập */}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentUser.role === 'VENDOR' && (
                    <button
                      onClick={() => navigate('/vendor/leads')}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      title="Ví Nền tảng (Pay-per-Lead): Bấm để quản lý hoặc nạp ví"
                    >
                      <Wallet className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ví: <strong className="text-blue-950">{vendorWalletBalance.toLocaleString('vi-VN')} đ</strong></span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (currentUser.role === 'BUYER') navigate('/interests');
                      else if (currentUser.role === 'VENDOR') navigate('/vendor/leads');
                      else navigate('/admin/vendors');
                    }}
                    className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                    title="Thông báo & Yêu cầu mới"
                  >
                    <Bell className="w-4 h-4" />
                    {(unreadLeadsCount > 0 || (currentUser.role === 'ADMIN' && pendingVendorsCount > 0)) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                        {currentUser.role === 'ADMIN' ? pendingVendorsCount : unreadLeadsCount}
                      </span>
                    )}
                  </button>

                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left"
                    >
                      <div className="text-right hidden md:block">
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {currentUser.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                          {currentUser.company.companyName}
                        </div>
                      </div>
                      
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-xs ${
                        currentUser.role === 'BUYER' ? 'bg-teal-100 text-teal-800 border-teal-300 ring-2 ring-teal-500/10' :
                        currentUser.role === 'VENDOR' ? 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-500/10' :
                        'bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-500/10'
                      }`}>
                        {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    </button>

                    {showProfileMenu && (
                      <div 
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-extrabold text-slate-900 text-sm truncate">
                              {currentUser.fullName}
                            </div>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              currentUser.role === 'BUYER' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                              currentUser.role === 'VENDOR' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-purple-100 text-purple-800 border-purple-200'
                            }`}>
                              {currentUser.role === 'BUYER' ? 'Buyer' :
                               currentUser.role === 'VENDOR' ? 'Vendor' : 'Admin'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            {currentUser.email || 'user@example.vn'}
                          </div>

                          <div className="mt-2.5 p-2 rounded-xl bg-white border border-slate-200/80 text-[11px]">
                            <div className="font-bold text-slate-800 truncate">
                              {currentUser.company.companyName}
                            </div>
                            <div className="text-slate-500 flex items-center justify-between mt-1">
                              <span>MST: <strong>{currentUser.company.mst}</strong></span>
                              <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-semibold">{currentUser.company.size}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 border-b border-slate-100 text-xs">
                          {currentUser.role === 'BUYER' && (
                            <>
                              <button onClick={() => { navigate('/onboarding/company'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-teal-50 hover:text-teal-800 transition-colors flex items-center gap-2 font-medium">
                                <Building2 className="w-4 h-4 text-teal-600" />
                                <span>Hồ sơ Doanh nghiệp & MST</span>
                              </button>
                              <button onClick={() => { navigate('/assessment/history'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-teal-50 hover:text-teal-800 transition-colors flex items-center gap-2 font-medium">
                                <BarChart3 className="w-4 h-4 text-teal-600" />
                                <span>Lịch sử các kỳ đánh giá DBI</span>
                              </button>
                            </>
                          )}

                          {currentUser.role === 'VENDOR' && (
                            <>
                              <button onClick={() => { navigate('/vendor/leads'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors flex items-center justify-between font-medium">
                                <span className="flex items-center gap-2">
                                  <Wallet className="w-4 h-4 text-blue-600" />
                                  <span>Ví Mở Lead (Pay-per-Lead)</span>
                                </span>
                                <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                  {vendorWalletBalance.toLocaleString('vi-VN')} đ
                                </span>
                              </button>
                              <button onClick={() => { navigate('/vendor/profile'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors flex items-center gap-2 font-medium">
                                <BadgeCheck className="w-4 h-4 text-blue-600" />
                                <span>Hồ sơ Năng lực & Xác thực KYC</span>
                              </button>
                              <button onClick={() => { navigate('/vendor/listings/new'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors flex items-center gap-2 font-medium">
                                <Store className="w-4 h-4 text-blue-600" />
                                <span>Đăng tin giải pháp công nghệ mới</span>
                              </button>
                            </>
                          )}

                          {currentUser.role === 'ADMIN' && (
                            <>
                              <button onClick={() => { navigate('/admin/users'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors flex items-center gap-2 font-medium">
                                <ShieldCheck className="w-4 h-4 text-purple-600" />
                                <span>Quản trị tài khoản & Phân quyền RBAC</span>
                              </button>
                              <button onClick={() => { navigate('/admin/vendors'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-800 transition-colors flex items-center gap-2 font-medium">
                                <ShieldAlert className="w-4 h-4 text-purple-600" />
                                <span>Hàng đợi kiểm duyệt Vendor (SLA 24h)</span>
                              </button>
                            </>
                          )}
                        </div>

                        <div className="p-2 border-b border-slate-100 text-xs">
                          <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-400">
                            Đổi vai trò kiểm thử
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1">
                            <button onClick={() => { switchRole('BUYER'); setShowProfileMenu(false); }} className={`py-1.5 rounded-lg text-center font-bold text-[11px] border transition-colors ${currentUser.role === 'BUYER' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}>Buyer</button>
                            <button onClick={() => { switchRole('VENDOR'); setShowProfileMenu(false); }} className={`py-1.5 rounded-lg text-center font-bold text-[11px] border transition-colors ${currentUser.role === 'VENDOR' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}>Vendor</button>
                            <button onClick={() => { switchRole('ADMIN'); setShowProfileMenu(false); }} className={`py-1.5 rounded-lg text-center font-bold text-[11px] border transition-colors ${currentUser.role === 'ADMIN' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}>Admin</button>
                          </div>
                        </div>

                        <div className="p-2">
                          <button onClick={() => { logout(); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center justify-between transition-colors">
                            <span className="flex items-center gap-2">
                              <LogOut className="w-4 h-4 text-rose-500" />
                              <span>Đăng xuất tài khoản</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">Về khách</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                title="Mở menu di động"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'BUYER' ? 'bg-teal-100 text-teal-800' :
                    currentUser.role === 'VENDOR' ? 'bg-blue-100 text-blue-800' :
                    currentUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentUser.role === 'BUYER' ? 'B' :
                     currentUser.role === 'VENDOR' ? 'V' :
                     currentUser.role === 'ADMIN' ? 'A' : 'G'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {currentUser.role === 'GUEST' ? 'Khách vãng lai' : currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {currentUser.role === 'GUEST' ? 'Chưa đăng nhập' : `${currentUser.role} • ${currentUser.company.size}`}
                    </div>
                  </div>
                </div>
                {currentUser.role !== 'GUEST' && (
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Thoát</span>
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {currentUser.role === 'GUEST' && (
                  <div className="pt-2">
                    <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full py-2 text-center text-xs font-bold text-white bg-teal-600 rounded-xl">
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};