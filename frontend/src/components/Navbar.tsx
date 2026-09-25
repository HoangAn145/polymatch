import React from 'react';
import { storage, UserProfile } from '../lib/storage';
import { 
  BarChart3, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  LogIn, 
  LogOut, 
  User, 
  ShieldCheck, 
  Building2, 
  Compass, 
  FileText,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (defaultMode?: 'login' | 'register') => void;
  onOpenQuickScan: () => void;
  onOpenGeminiDiagnosis?: () => void;
  currentUser: UserProfile | null;
  onUserChange: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth,
  onOpenQuickScan,
  onOpenGeminiDiagnosis,
  currentUser,
  onUserChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  P
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                    POLYMATCH
                  </span>
                  <span className="text-xs font-semibold tracking-wider text-blue-700 ml-1">
                    LOGISTICS
                  </span>
                </div>
              </div>
            </button>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'home' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Trang chủ
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'assessment' || currentTab === 'assessment-run' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Bài đánh giá
              </button>

              <button
                onClick={() => onNavigate('solutions')}
                className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'solutions' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Danh mục giải pháp
              </button>

              <button
                onClick={() => onNavigate('insights')}
                className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'insights' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Logistics Insights
              </button>

              <button
                onClick={() => onNavigate('vendor-info')}
                className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'vendor-info' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Dành cho nhà cung cấp
              </button>

              {/* Role-specific Nav Links */}
              {currentUser?.role === 'buyer' && (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'dashboard' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    Bảng điều khiển
                  </button>
                  <button
                    onClick={() => onNavigate('requests')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'requests' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    Hồ sơ nhu cầu
                  </button>
                </>
              )}

              {currentUser?.role === 'vendor' && (
                <button
                  onClick={() => onNavigate('vendor-portal')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'vendor-portal' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  Cổng Nhà Cung Cấp
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${currentTab === 'admin' ? 'text-blue-700 font-semibold bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  Quản trị hệ thống
                </button>
              )}
            </nav>
          </div>

          {/* Zone 3: Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini AI Diagnosis Action Button */}
            {onOpenGeminiDiagnosis && (
              <button
                onClick={onOpenGeminiDiagnosis}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap shadow-2xs"
                title="Chẩn đoán vấn đề gặp phải bằng Gemini API"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Chẩn đoán</span> AI
              </button>
            )}

            {/* Quick Scan CTA (Always accessible without login) */}
            <button
              onClick={onOpenQuickScan}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" />
              Quick Scan (2 phút)
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* User badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      {currentUser.role === 'buyer' && <span className="text-blue-600 font-medium">Doanh nghiệp</span>}
                      {currentUser.role === 'vendor' && (
                        <span className="text-amber-600 font-medium flex items-center gap-0.5">
                          NCC ({currentUser.credits} tr)
                        </span>
                      )}
                      {currentUser.role === 'admin' && <span className="text-rose-600 font-medium">Admin</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (currentUser.role === 'buyer') onNavigate('dashboard');
                      else if (currentUser.role === 'vendor') onNavigate('vendor-portal');
                      else onNavigate('admin');
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Trang cá nhân"
                  >
                    <User className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      storage.logout();
                      onUserChange();
                      onNavigate('home');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Fast Demo Role Switcher for Evaluation testing */}
            <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Demo:</span>
              <button
                onClick={() => { storage.loginAs('buyer'); onUserChange(); onNavigate('dashboard'); }}
                className={`text-[11px] px-2 py-0.5 rounded ${currentUser?.role === 'buyer' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title="Đăng nhập mẫu Doanh nghiệp logistics"
              >
                Người mua
              </button>
              <button
                onClick={() => { storage.loginAs('vendor'); onUserChange(); onNavigate('vendor-portal'); }}
                className={`text-[11px] px-2 py-0.5 rounded ${currentUser?.role === 'vendor' ? 'bg-amber-600 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title="Đăng nhập mẫu Nhà cung cấp công nghệ"
              >
                Nhà cung cấp
              </button>
              <button
                onClick={() => { storage.loginAs('admin'); onUserChange(); onNavigate('admin'); }}
                className={`text-[11px] px-2 py-0.5 rounded ${currentUser?.role === 'admin' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title="Đăng nhập mẫu Quản trị viên"
              >
                Admin
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
