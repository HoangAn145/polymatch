import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại của bạn');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456' || otpCode.length === 6) {
      setOtpVerified(true);
      setErrorMsg('');
      setTimeout(() => {
        navigate('/register/role');
      }, 600);
    } else {
      setErrorMsg('Mã OTP không chính xác. Gợi ý mã thử nghiệm: 123456');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Tạo tài khoản Doanh nghiệp</h2>
          <p className="text-xs text-slate-500">
            Xác thực OTP an toàn để truy cập hệ thống DBI
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email công việc hoặc Số điện thoại đại diện <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="ceo@doanhnghiep.vn hoặc 0912..."
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu đăng nhập <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 8 ký tự..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Gửi mã xác thực OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800">
              Mã xác thực 6 chữ số đã được gửi tới <strong>{emailOrPhone}</strong>. (Mã thử nghiệm demo: <strong>123456</strong>)
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nhập mã OTP (6 chữ số) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-extrabold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {otpVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác thực thành công! Đang chuyển tiếp...</span>
                </>
              ) : (
                <span>Xác nhận & Tiếp tục chọn Vai trò</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Thay đổi email/số điện thoại khác
            </button>
          </div>
        )}

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
          Đã có tài khoản DBI?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-teal-700 hover:underline"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
};
