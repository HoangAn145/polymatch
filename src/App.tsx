import { demoMode, supabase } from "./lib/supabase";
import { authService } from "./services/authService";
import { FeaturePage } from "./components/platform/FeaturePage";
import { ChatWidget } from "./components/platform/ChatWidget";
import { PasswordRecoveryPage } from "./pages/auth/PasswordRecoveryPage";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { AboutPage } from "./pages/public/AboutPage";
import { QuickScanPage } from "./pages/public/QuickScanPage";
import { SolutionsCatalogPage } from "./pages/public/SolutionsCatalogPage";
import { ProvidersPage } from "./pages/public/ProvidersPage";
import { ConsultingPage } from "./pages/public/ConsultingPage";
import { PricingPage } from "./pages/public/PricingPage";
import { InsightsPage } from "./pages/public/InsightsPage";
import { ContactPage } from "./pages/public/ContactPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterChoicePage } from "./pages/auth/RegisterChoicePage";
import { RegisterBuyerPage } from "./pages/auth/RegisterBuyerPage";
import { RegisterSellerPage } from "./pages/auth/RegisterSellerPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

// Buyer Pages
import { BuyerDashboardPage } from "./pages/buyer/BuyerDashboardPage";
import { BuyerProfilePage } from "./pages/buyer/BuyerProfilePage";
import { BuyerAssessmentWizardPage } from "./pages/buyer/BuyerAssessmentWizardPage";
import { BuyerAssessmentResultsPage } from "./pages/buyer/BuyerAssessmentResultsPage";
import { BuyerGapsPage } from "./pages/buyer/BuyerGapsPage";
import { BuyerSolutionsPage } from "./pages/buyer/BuyerSolutionsPage";
import { BuyerComparePage } from "./pages/buyer/BuyerComparePage";
import { BuyerRoiSimulatorPage } from "./pages/buyer/BuyerRoiSimulatorPage";
import { BuyerConnectionsPage } from "./pages/buyer/BuyerConnectionsPage";
import { BuyerReportsPage } from "./pages/buyer/BuyerReportsPage";
import { BuyerConsultingPage } from "./pages/buyer/BuyerConsultingPage";
import { BuyerProjectsPage } from "./pages/buyer/BuyerProjectsPage";
import { BuyerHistoryPage } from "./pages/buyer/BuyerHistoryPage";
import { BuyerSettingsPage } from "./pages/buyer/BuyerSettingsPage";

// Seller Pages
import { SellerDashboardPage } from "./pages/seller/SellerDashboardPage";
import { SellerProfilePage } from "./pages/seller/SellerProfilePage";
import { SellerVerificationPage } from "./pages/seller/SellerVerificationPage";
import { SellerSolutionsPage } from "./pages/seller/SellerSolutionsPage";
import { SellerNewSolutionPage } from "./pages/seller/SellerNewSolutionPage";
import { SellerRequestsPage } from "./pages/seller/SellerRequestsPage";
import { SellerQuotesPage } from "./pages/seller/SellerQuotesPage";
import { SellerContractsPage } from "./pages/seller/SellerContractsPage";
import { SellerCommissionPage } from "./pages/seller/SellerCommissionPage";
import { SellerSubscriptionPage } from "./pages/seller/SellerSubscriptionPage";
import { SellerAnalyticsPage } from "./pages/seller/SellerAnalyticsPage";
import { SellerSettingsPage } from "./pages/seller/SellerSettingsPage";

// Admin Pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminSellersPage } from "./pages/admin/AdminSellersPage";
import { AdminSolutionsPage } from "./pages/admin/AdminSolutionsPage";
import { AdminExpertsPage } from "./pages/admin/AdminExpertsPage";
import { AdminConsultingPage } from "./pages/admin/AdminConsultingPage";
import { AdminQuestionsPage } from "./pages/admin/AdminQuestionsPage";
import { AdminConnectionsPage } from "./pages/admin/AdminConnectionsPage";
import { AdminTransactionsPage } from "./pages/admin/AdminTransactionsPage";
import { AdminArticlesPage } from "./pages/admin/AdminArticlesPage";
import { AdminConfigPage } from "./pages/admin/AdminConfigPage";
import { AdminAuditPage } from "./pages/admin/AdminAuditPage";

// Scroll to top component on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function WorkspaceRedirect() {
  const user = authService.getCurrentUser();
  return (
    <Navigate
      to={user ? `/${user.role.toLowerCase()}/dashboard` : "/login"}
      replace
    />
  );
}
export default function App() {
  const [ready, setReady] = React.useState(demoMode || !supabase);
  const [authError, setAuthError] = React.useState("");
  const [, refresh] = React.useState(0);
  useEffect(() => {
    const unsubscribe = authService.subscribe(() => refresh((v) => v + 1));
    if (demoMode || !supabase) return unsubscribe;
    let active = true;
    authService
      .initialize()
      .catch((e) => {
        if (active) setAuthError(e.message);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      setTimeout(() => {
        if (active)
          void authService
            .synchronize(session)
            .then(() => setAuthError(""))
            .catch((e) => {
              setAuthError(e.message);
              void authService.synchronize(null);
            });
      }, 0);
    });
    return () => {
      active = false;
      unsubscribe();
      data.subscription.unsubscribe();
    };
  }, []);
  if (!ready)
    return (
      <p role="status" className="p-8">
        Đang kiểm tra phiên đăng nhập…
      </p>
    );
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        {authError && (
          <p role="alert" className="p-3 bg-amber-50 text-amber-900">
            {authError}
          </p>
        )}
        <ChatWidget
          key={authService.getCurrentUser()?.id || "guest"}
          session={authService.getSession()}
        />
        <Routes>
          {/* Public Portal Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quick-scan" element={<QuickScanPage />} />
            <Route path="/solutions" element={<SolutionsCatalogPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/consulting" element={<ConsultingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterChoicePage />} />
            <Route path="/register/buyer" element={<RegisterBuyerPage />} />
            <Route path="/register/seller" element={<RegisterSellerPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<PasswordRecoveryPage />} />
          </Route>

          {/* Buyer Authenticated Workspace */}
          <Route element={<DashboardLayout />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
            <Route path="/buyer/profile" element={<BuyerProfilePage />} />
            <Route
              path="/buyer/assessment"
              element={<BuyerAssessmentWizardPage />}
            />
            <Route
              path="/buyer/results"
              element={<BuyerAssessmentResultsPage />}
            />
            <Route path="/buyer/gaps" element={<BuyerGapsPage />} />
            <Route path="/buyer/solutions" element={<BuyerSolutionsPage />} />
            <Route path="/buyer/compare" element={<BuyerComparePage />} />
            <Route path="/buyer/roi" element={<BuyerRoiSimulatorPage />} />
            <Route
              path="/buyer/connections"
              element={<BuyerConnectionsPage />}
            />
            <Route path="/buyer/reports" element={<BuyerReportsPage />} />
            <Route path="/buyer/consulting" element={<BuyerConsultingPage />} />
            <Route path="/buyer/projects" element={<BuyerProjectsPage />} />
            <Route path="/buyer/history" element={<BuyerHistoryPage />} />
            <Route path="/buyer/settings" element={<BuyerSettingsPage />} />

            <Route
              path="/buyer/roadmap"
              element={<FeaturePage kind="roadmap" />}
            />
            <Route path="/buyer/kpi" element={<FeaturePage kind="kpi" />} />
            <Route
              path="/buyer/support"
              element={<FeaturePage kind="support" />}
            />
            <Route
              path="/seller/support"
              element={<FeaturePage kind="support" />}
            />
            <Route
              path="/admin/support"
              element={<FeaturePage kind="support" />}
            />
            <Route
              path="/admin/knowledge"
              element={<FeaturePage kind="knowledge" />}
            />
            <Route
              path="/admin/support-audit"
              element={<FeaturePage kind="audit" />}
            />

            {/* Seller Authenticated Workspace */}
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/profile" element={<SellerProfilePage />} />
            <Route
              path="/seller/verification"
              element={<SellerVerificationPage />}
            />
            <Route path="/seller/solutions" element={<SellerSolutionsPage />} />
            <Route
              path="/seller/solutions/new"
              element={<SellerNewSolutionPage />}
            />
            <Route path="/seller/requests" element={<SellerRequestsPage />} />
            <Route path="/seller/quotes" element={<SellerQuotesPage />} />
            <Route path="/seller/contracts" element={<SellerContractsPage />} />
            <Route
              path="/seller/commission"
              element={<SellerCommissionPage />}
            />
            <Route
              path="/seller/subscription"
              element={<SellerSubscriptionPage />}
            />
            <Route path="/seller/analytics" element={<SellerAnalyticsPage />} />
            <Route path="/seller/settings" element={<SellerSettingsPage />} />

            {/* Admin Authenticated Workspace */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/sellers" element={<AdminSellersPage />} />
            <Route path="/admin/solutions" element={<AdminSolutionsPage />} />
            <Route path="/admin/experts" element={<AdminExpertsPage />} />
            <Route path="/admin/consulting" element={<AdminConsultingPage />} />
            <Route path="/admin/questions" element={<AdminQuestionsPage />} />
            <Route
              path="/admin/connections"
              element={<AdminConnectionsPage />}
            />
            <Route
              path="/admin/transactions"
              element={<AdminTransactionsPage />}
            />
            <Route path="/admin/articles" element={<AdminArticlesPage />} />
            <Route path="/admin/config" element={<AdminConfigPage />} />
            <Route path="/admin/audit" element={<AdminAuditPage />} />
          </Route>

          <Route path="/workspace" element={<WorkspaceRedirect />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
