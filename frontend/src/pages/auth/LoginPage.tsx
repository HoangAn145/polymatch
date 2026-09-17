import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { SAMPLE_USERS } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { navigate, setCurrentUser } = useApp();
  const [email, setEmail] = useState('ceo@dongnamphat.vn');
  const [password, setPassword] = useState('password123');
  const [loginNotice, setLoginNotice] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('dbi_login_notice') : null;
  });

  React.useEffect(() => {
    const notice = sessionStorage.getItem('dbi_login_notice');
    if (notice) {
      setLoginNotice(notice);
      sessionStorage.removeItem('dbi_login_notice');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Match sample or find by role
    const matched = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || SAMPLE_USERS[0];
    setCurrentUser(matched);
    if (matched.role === 'VENDOR') {
      navigate('/vendor');
    } else if (matched.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickDemoLogin = (role: 'BUYER' | 'VENDOR' | 'ADMIN') => {
    if (role === 'BUYER') {
      setEmail(SAMPLE_USERS[0].email);
      setCurrentUser(SAMPLE_USERS[0]);
      navigate('/dashboard');
    } else if (role === 'VENDOR') {
      setEmail(SAMPLE_USERS[1].email);
      setCurrentUser(SAMPLE_USERS[1]);
      navigate('/vendor');
    } else {
      setEmail(SAMPLE_USERS[3].email);
      setCurrentUser(SAMPLE_USERS[3]);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Đăng nhập Hệ thống DBI</h2>
          <p className="text-xs text-slate-500">
            Truy cập cổng đánh giá mức độ số hóa và sàn công nghệ
          </p>
        </div>

        {loginNotice && (
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 animate-in fade-in">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <strong className="block font-bold text-amber-900">Yêu cầu đăng nhập</strong>
              <p className="text-amber-800 leading-relaxed">{loginNotice}</p>
            </div>
          </div>
        )}

        {/* Demo Fast Logins for localhost testing */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            ⚡ Đăng nhập nhanh tài khoản mẫu (Demo test)
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('BUYER')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 font-semibold transition-all text-center"
            >
              Doanh nghiệp Mua
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('VENDOR')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 font-semibold transition-all text-center"
            >
              Nhà cung cấp
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-slate-200 font-semibold transition-all text-center"
            >
              Quản trị viên
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email công vụ hoặc Số điện thoại
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đăng nhập</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
          Chưa có tài khoản doanh nghiệp?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-teal-700 hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};
