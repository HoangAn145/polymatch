import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { LandingPage } from '../pages/LandingPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { RoleSelectPage } from '../pages/auth/RoleSelectPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { CompanyOnboardingPage } from '../pages/auth/CompanyOnboardingPage';

// Buyer Pages
import { BuyerDashboard } from '../pages/buyer/BuyerDashboard';
import { AssessmentIntro } from '../pages/buyer/AssessmentIntro';
import { AssessmentWizard } from '../pages/buyer/AssessmentWizard';
import { AssessmentResult } from '../pages/buyer/AssessmentResult';
import { InvestmentReadinessPage } from '../pages/buyer/InvestmentReadinessPage';
import { RecommendationsPage } from '../pages/buyer/RecommendationsPage';
import { TechDetailPage } from '../pages/buyer/TechDetailPage';
import { TechComparePage } from '../pages/buyer/TechComparePage';
import { InterestsChatPage } from '../pages/buyer/InterestsChatPage';
import { AssessmentHistoryPage } from '../pages/buyer/AssessmentHistoryPage';

// Vendor Pages
import { VendorDashboard } from '../pages/vendor/VendorDashboard';
import { VendorListingCreator } from '../pages/vendor/VendorListingCreator';
import { VendorListingsManage } from '../pages/vendor/VendorListingsManage';
import { VendorLeadsPage } from '../pages/vendor/VendorLeadsPage';
import { VendorProfilePage } from '../pages/vendor/VendorProfilePage';
import { VendorAnalyticsPage } from '../pages/vendor/VendorAnalyticsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminVendorReview } from '../pages/admin/AdminVendorReview';
import { AdminListingReview } from '../pages/admin/AdminListingReview';
import { AdminTaxonomyManage } from '../pages/admin/AdminTaxonomyManage';
import { AdminMatchingConfig } from '../pages/admin/AdminMatchingConfig';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminQuestionsPage } from '../pages/admin/AdminQuestionsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { UserRole } from '../types';

// Component to redirect guest users back to login
const GuestRedirect: React.FC<{ attemptedPath?: string; message?: string }> = ({ attemptedPath, message }) => {
  const { navigate } = useApp();

  React.useEffect(() => {
    let notice = message;
    if (!notice) {
      if (attemptedPath === '/tech/compare') {
        notice = 'Vui lòng đăng nhập để sử dụng tính năng So sánh Giải pháp Công nghệ.';
      } else if (attemptedPath?.startsWith('/assessment')) {
        notice = 'Vui lòng đăng nhập để thực hiện và theo dõi khảo sát Đánh giá Chuyển đổi số DBI.';
      } else if (attemptedPath?.startsWith('/dashboard')) {
        notice = 'Vui lòng đăng nhập để truy cập Bảng điều khiển Doanh nghiệp.';
      } else if (attemptedPath?.startsWith('/vendor')) {
        notice = 'Vui lòng đăng nhập tài khoản Nhà cung cấp để truy cập Cổng Vendor.';
      } else if (attemptedPath?.startsWith('/admin')) {
        notice = 'Vui lòng đăng nhập tài khoản Quản trị viên để truy cập Hệ thống Quản trị.';
      } else if (attemptedPath?.startsWith('/interests')) {
        notice = 'Vui lòng đăng nhập để quản lý Danh sách quan tâm và Hộp thư đàm phán B2B.';
      } else {
        notice = 'Bạn đang ở vai trò Khách. Vui lòng đăng nhập để thực hiện chức năng này.';
      }
    }
    sessionStorage.setItem('dbi_login_notice', notice);
    navigate('/login');
  }, [navigate, message, attemptedPath]);

  return <LoginPage />;
};

// Access Denied Screen for Role Enforcement (between authenticated roles: BUYER, VENDOR, ADMIN)
const RoleAccessDenied: React.FC<{ requiredRole: UserRole; title: string }> = ({ requiredRole, title }) => {
  const { currentUser, switchRole, navigate } = useApp();

  React.useEffect(() => {
    if (currentUser.role === 'GUEST') {
      sessionStorage.setItem('dbi_login_notice', `Vui lòng đăng nhập để truy cập chức năng "${title}".`);
      navigate('/login');
    }
  }, [currentUser.role, navigate, title]);

  if (currentUser.role === 'GUEST') {
    return <LoginPage />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50/70">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full inline-block mb-3">
          Kiểm soát Phân quyền Vai trò (RBAC)
        </span>
        
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Không Đủ Quyền Truy Cập
        </h2>
        
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Chức năng <strong className="text-slate-900">{title}</strong> được chỉ định dành riêng cho vai trò <strong className="text-blue-700 font-bold">{requiredRole}</strong>. 
          Tài khoản hiện tại của bạn đang đăng nhập với vai trò <strong className="text-teal-700 font-bold">{currentUser.role}</strong>.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-left">
          <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Quy định phân quyền hệ thống:
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Hệ thống quy định mỗi phiên làm việc chỉ sử dụng đúng chức năng tương ứng với vai trò của mình, không được dùng chung chức năng của cả 3 vai trò cùng lúc.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              switchRole(requiredRole);
            }}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Chuyển sang vai trò {requiredRole}</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (currentUser.role === 'BUYER') navigate('/dashboard');
              else if (currentUser.role === 'VENDOR') navigate('/vendor');
              else if (currentUser.role === 'ADMIN') navigate('/admin');
              else navigate('/');
            }}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Về trang của tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  const { currentRoute, currentPath: pathFromContext, currentUser } = useApp();
  const currentPath = currentRoute || pathFromContext || (typeof window !== 'undefined' ? window.location.pathname : '/');

  // Pattern matching for dynamic routes like /tech/:id or /assessment/:id
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage />;
  }

  // Auth routes
  if (currentPath === '/register') return <RegisterPage />;
  if (currentPath === '/register/role') return <RoleSelectPage />;
  if (currentPath === '/login') return <LoginPage />;
  if (currentPath === '/forgot-password') return <ForgotPasswordPage />;

  // Enforce Guest Guard: In guest role, accessing any feature outside guest permissions returns to login page
  if (currentUser.role === 'GUEST') {
    const isPublic = 
      currentPath === '/' || 
      currentPath === '' || 
      currentPath === '/login' || 
      currentPath === '/register' || 
      currentPath === '/register/role' || 
      currentPath === '/forgot-password' || 
      (currentPath.startsWith('/tech/') && currentPath !== '/tech/new' && currentPath !== '/tech/compare');

    if (!isPublic) {
      return <GuestRedirect attemptedPath={currentPath} />;
    }
  }

  if (currentPath === '/onboarding/company') return <CompanyOnboardingPage />;

  // Enforce Admin Role Guard
  if (currentPath.startsWith('/admin')) {
    if (currentUser.role !== 'ADMIN') {
      return <RoleAccessDenied requiredRole="ADMIN" title="Quản trị viên Hệ thống (Admin)" />;
    }
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') return <AdminDashboard />;
    if (currentPath === '/admin/vendors') return <AdminVendorReview />;
    if (currentPath === '/admin/listings') return <AdminListingReview />;
    if (currentPath === '/admin/taxonomy' || currentPath === '/admin/tech-catalog') return <AdminTaxonomyManage />;
    if (currentPath === '/admin/questions') return <AdminQuestionsPage />;
    if (currentPath === '/admin/users') return <AdminUsersPage />;
    if (currentPath === '/admin/matching-config') return <AdminMatchingConfig />;
    if (currentPath === '/admin/analytics' || currentPath === '/admin/reports') return <AdminAnalyticsPage />;
    return <AdminDashboard />;
  }

  // Enforce Vendor Role Guard
  if (currentPath.startsWith('/vendor')) {
    if (currentUser.role !== 'VENDOR') {
      return <RoleAccessDenied requiredRole="VENDOR" title="Nhà cung cấp Công nghệ (Vendor)" />;
    }
    if (currentPath === '/vendor' || currentPath === '/vendor/dashboard') return <VendorDashboard />;
    if (currentPath === '/vendor/listings/new') return <VendorListingCreator />;
    if (currentPath === '/vendor/listings') return <VendorListingsManage />;
    if (currentPath === '/vendor/leads') return <VendorLeadsPage />;
    if (currentPath === '/vendor/profile') return <VendorProfilePage />;
    if (currentPath === '/vendor/analytics') return <VendorAnalyticsPage />;
    return <VendorDashboard />;
  }

  // Enforce Buyer Role Guard for Buyer-only workflows
  if (
    currentPath === '/dashboard' || 
    currentPath === '/interests' || 
    currentPath === '/assessment/history' || 
    currentPath.startsWith('/assessment/active') ||
    currentPath.startsWith('/assessment/new')
  ) {
    if (currentUser.role !== 'BUYER') {
      return <RoleAccessDenied requiredRole="BUYER" title="Doanh nghiệp Mua (Tech Buyer)" />;
    }
  }

  // Buyer routes
  if (currentPath === '/dashboard') return <BuyerDashboard />;
  if (currentPath === '/assessment/intro') return <AssessmentIntro />;
  if (currentPath === '/assessment/history') return <AssessmentHistoryPage />;
  if (currentPath === '/interests') return <InterestsChatPage />;
  if (currentPath === '/tech/compare') return <TechComparePage />;

  // Dynamic /tech/:id
  if (currentPath.startsWith('/tech/')) {
    const parts = currentPath.split('/');
    const techId = parts[2];
    if (techId && techId !== 'compare') {
      return <TechDetailPage />;
    }
  }

  // Assessment sub-routes
  if (currentPath.includes('/result')) {
    return <AssessmentResult />;
  }
  if (currentPath.includes('/investment')) {
    return <InvestmentReadinessPage />;
  }
  if (currentPath.includes('/recommendations')) {
    return <RecommendationsPage />;
  }
  if (currentPath.startsWith('/assessment/')) {
    return <AssessmentWizard />;
  }

  // Fallback
  return <LandingPage />;
};
