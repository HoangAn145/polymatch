import React, { useState, useEffect } from 'react';
import { storage, UserProfile, AssessmentRecord } from './lib/storage';
import { BranchCode } from './data/questions';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { QuickScanModal } from './components/QuickScanModal';
import { HomeView } from './components/HomeView';
import { AssessmentRunner } from './components/AssessmentRunner';
import { ResultsDashboard } from './components/ResultsDashboard';
import { GapsAndRoadmapView } from './components/GapsAndRoadmapView';
import { SolutionsMatchingView } from './components/SolutionsMatchingView';
import { SolutionsCatalogPublicView } from './components/SolutionsCatalogPublicView';
import { RfqManagementView } from './components/RfqManagementView';
import { BuyerDashboardView } from './components/BuyerDashboardView';
import { VendorPortal } from './components/VendorPortal';
import { VendorInfoView } from './components/VendorInfoView';
import { AdminPortal } from './components/AdminPortal';
import { MethodologyView } from './components/MethodologyView';
import { AssessmentView } from './components/AssessmentView';
import { InsightsView } from './components/InsightsView';
import { GeminiProblemDiagnosisModal } from './components/GeminiProblemDiagnosisModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(storage.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('home');
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);
  const [isQuickScanOpen, setIsQuickScanOpen] = useState<boolean>(false);
  const [isGeminiDiagnosisModalOpen, setIsGeminiDiagnosisModalOpen] = useState<boolean>(false);

  // Active Assessment State
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  // Sync state on user change
  const handleUserChange = () => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      setCurrentTab('home');
    }
  };

  // Helper: Trigger protected action check for Guests
  const requireAuth = (actionCallback: () => void, reasonText: string) => {
    if (!currentUser) {
      setAuthModalReason(reasonText);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      actionCallback();
    }
  };

  // Handlers
  const handleStartQuickScan = (branch?: BranchCode) => {
    setIsQuickScanOpen(true);
  };

  const handleStartFullAssessment = () => {
    requireAuth(() => {
      setCurrentTab('assessment');
    }, 'Vui lòng đăng nhập hoặc đăng ký tài khoản Doanh nghiệp để làm bài Đánh giá đầy đủ (10–12 phút).');
  };

  const handleAssessmentFinished = (assessmentId: string) => {
    setActiveAssessmentId(assessmentId);
    setCurrentTab('results');
  };

  // Load latest assessment if available
  const latestAssessment: AssessmentRecord | undefined = currentUser
    ? activeAssessmentId
      ? storage.getAssessment(activeAssessmentId) || storage.getLatestAssessment(currentUser.id)
      : storage.getLatestAssessment(currentUser.id)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          // Check role restrictions on private routes
          if (tab === 'dashboard' || tab === 'requests') {
            requireAuth(() => setCurrentTab(tab), 'Vui lòng đăng nhập để truy cập Bảng điều khiển Doanh nghiệp.');
          } else if (tab === 'vendor-portal') {
            requireAuth(() => setCurrentTab(tab), 'Vui lòng đăng nhập tài khoản Nhà cung cấp công nghệ để truy cập Cổng đối tác.');
          } else if (tab === 'admin') {
            requireAuth(() => setCurrentTab(tab), 'Khu vực quản trị chỉ dành cho Admin hệ thống.');
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setAuthModalReason(undefined);
          setIsAuthModalOpen(true);
        }}
        onOpenQuickScan={() => setIsQuickScanOpen(true)}
        onOpenGeminiDiagnosis={() => setIsGeminiDiagnosisModalOpen(true)}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Main Viewport Routing */}
      <main className="flex-1">
        {/* PUBLIC HOME */}
        {currentTab === 'home' && (
          <HomeView
            onStartQuickScan={handleStartQuickScan}
            onStartFullAssessment={handleStartFullAssessment}
            onNavigateToSolutions={() => setCurrentTab('solutions')}
            onNavigateToVendorInfo={() => setCurrentTab('vendor-info')}
            onNavigateToInsights={() => setCurrentTab('insights')}
          />
        )}

        {/* ASSESSMENT VIEW (TRANG BÀI ĐÁNH GIÁ THAY THẾ TRANG CÁCH CHẤM ĐIỂM) */}
        {(currentTab === 'assessment' || currentTab === 'methodology' || currentTab === 'assessment-run') && (
          <AssessmentView
            currentUser={currentUser}
            latestAssessment={latestAssessment}
            onRequireAuth={(reason) => {
              setAuthModalReason(reason);
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onOpenQuickScan={() => setIsQuickScanOpen(true)}
            onOpenGeminiDiagnosis={() => setIsGeminiDiagnosisModalOpen(true)}
            onFinishAssessment={handleAssessmentFinished}
            onViewResults={() => setCurrentTab('results')}
            initialMode={currentTab === 'methodology' ? 'methodology' : 'runner'}
          />
        )}

        {/* LOGISTICS INSIGHTS */}
        {currentTab === 'insights' && (
          <InsightsView
            onStartQuickScan={handleStartQuickScan}
            onExploreSolutions={() => setCurrentTab('solutions')}
          />
        )}

        {/* VENDOR INFO LANDING */}
        {currentTab === 'vendor-info' && (
          <VendorInfoView
            onRegisterVendor={() => {
              setAuthModalMode('register');
              setAuthModalReason('Đăng ký tài khoản Nhà cung cấp công nghệ để nhận Hồ sơ nhu cầu từ doanh nghiệp logistics.');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* RESULTS DASHBOARD */}
        {currentTab === 'results' && latestAssessment && (
          <ResultsDashboard
            assessment={latestAssessment}
            onViewGaps={() => setCurrentTab('gaps')}
            onViewSolutions={() => setCurrentTab('solutions-match')}
          />
        )}

        {/* 3 GAPS & ROADMAP */}
        {currentTab === 'gaps' && latestAssessment && (
          <GapsAndRoadmapView
            assessment={latestAssessment}
            onProceedToSolutions={() => setCurrentTab('solutions-match')}
            onBackToResults={() => setCurrentTab('results')}
          />
        )}

        {/* MATCHED SOLUTIONS (SPECIFIC TO ASSESSMENT) */}
        {currentTab === 'solutions-match' && latestAssessment && (
          <SolutionsMatchingView
            assessment={latestAssessment}
            onNavigateToRequests={() => setCurrentTab('requests')}
            onBackToGaps={() => setCurrentTab('gaps')}
          />
        )}

        {/* PUBLIC OR GENERAL SOLUTIONS CATALOG */}
        {currentTab === 'solutions' && (
          <SolutionsCatalogPublicView
            onSelectSolution={(sol) => {
              requireAuth(() => {
                if (latestAssessment) {
                  setCurrentTab('solutions-match');
                } else {
                  setCurrentTab('assessment-run');
                }
              }, 'Vui lòng hoàn thành bài đánh giá để nhận bảng tính điểm phù hợp 7 thành phần cho giải pháp này.');
            }}
            onProtectedAction={(reason) => {
              setAuthModalReason(reason);
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            isLoggedIn={currentUser !== null}
          />
        )}

        {/* BUYER DASHBOARD */}
        {currentTab === 'dashboard' && currentUser && (
          <BuyerDashboardView
            currentUser={currentUser}
            latestAssessment={latestAssessment}
            onStartAssessment={() => setCurrentTab('assessment')}
            onViewResults={(id) => {
              setActiveAssessmentId(id);
              setCurrentTab('results');
            }}
            onViewRfqs={() => setCurrentTab('requests')}
            onViewSolutions={() => {
              if (latestAssessment) setCurrentTab('solutions-match');
              else setCurrentTab('solutions');
            }}
          />
        )}

        {/* BUYER RFQ MANAGEMENT & CHAT */}
        {currentTab === 'requests' && currentUser && (
          <RfqManagementView
            currentUser={currentUser}
            onNavigateToSolutions={() => {
              if (latestAssessment) setCurrentTab('solutions-match');
              else setCurrentTab('solutions');
            }}
          />
        )}

        {/* VENDOR PORTAL */}
        {currentTab === 'vendor-portal' && currentUser && (
          <VendorPortal
            currentUser={currentUser}
            onUserUpdate={handleUserChange}
          />
        )}

        {/* ADMIN PORTAL */}
        {currentTab === 'admin' && currentUser && (
          <AdminPortal
            currentUser={currentUser}
            onRefresh={handleUserChange}
          />
        )}
      </main>

      {/* QUICK SCAN MODAL (Available to Guests without login M01.02) */}
      <QuickScanModal
        isOpen={isQuickScanOpen}
        onClose={() => setIsQuickScanOpen(false)}
        onCompleteAndRegister={() => {
          setAuthModalMode('register');
          setAuthModalReason('Đăng ký tài khoản để chuyển thẳng sang bài Đánh giá đầy đủ (kết quả Quick Scan sẽ được giữ nguyên M02.06)!');
          setIsAuthModalOpen(true);
        }}
        onStartFullAssessment={handleStartFullAssessment}
      />

      {/* GUEST INTERCEPTOR & AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
        actionReason={authModalReason}
        onSuccess={() => {
          handleUserChange();
          // After logging in or registering:
          const user = storage.getCurrentUser();
          if (user?.role === 'buyer') {
            setCurrentTab('dashboard');
          } else if (user?.role === 'vendor') {
            setCurrentTab('vendor-portal');
          } else if (user?.role === 'admin') {
            setCurrentTab('admin');
          }
        }}
      />

      {/* GEMINI AI PROBLEM DIAGNOSIS MODAL */}
      <GeminiProblemDiagnosisModal
        isOpen={isGeminiDiagnosisModalOpen}
        onClose={() => setIsGeminiDiagnosisModalOpen(false)}
        latestAssessment={latestAssessment}
      />

    </div>
  );
}
