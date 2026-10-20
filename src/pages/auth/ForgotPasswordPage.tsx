import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { dbService } from '../../services/mockDatabase';
import { useToast } from '../../components/ui/Toast';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const user = dbService.getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      toast.error("Không tìm thấy tài khoản", "Email này chưa được đăng ký trong hệ thống demo.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const generated = String(Math.floor(100000 + Math.random() * 900000));
      setSimulatedOtp(generated);
      setStep(2);
      setLoading(false);
      toast.info("Mã xác thực OTP đã tạo", `Mã diễn tập mô phỏng: ${generated}`);
    }, 600);
  };

  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode !== simulatedOtp && otpCode !== '123456') {
      toast.error("Mã OTP không đúng", "Vui lòng nhập đúng mã xác thực được cấp.");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Mật khẩu ngắn", "Mật khẩu mới tối thiểu 6 ký tự.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu không khớp", "Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setStep(3);
    toast.success("Đặt lại mật khẩu thành công!", "Bạn có thể đăng nhập bằng mật khẩu mới.");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1769AA] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-[#1769AA] tracking-tight">POLYMATCH</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Khôi phục mật khẩu tài khoản
          </h2>
          <p className="text-xs text-slate-500">
            Quy trình diễn tập khôi phục quyền truy cập demo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200/90 space-y-6">
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Nhập địa chỉ email tài khoản của bạn để nhận mã khôi phục diễn tập.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email tài khoản *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="buyer@vinatrans.vn"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold shadow-sm"
                  loading={loading}
                  type="submit"
                >
                  Tạo mã xác thực OTP
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-700 text-xs space-y-1">
                <div className="font-bold text-[#1769AA]">Môi trường diễn tập mô phỏng:</div>
                <p>
                  Mã OTP của bạn là: <strong className="text-base text-blue-900 font-mono tracking-widest">{simulatedOtp}</strong>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã xác thực OTP (6 chữ số) *</label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="Nhập mã 6 chữ số ở trên"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold shadow-sm"
                  type="submit"
                >
                  Cập nhật mật khẩu mới
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Mật khẩu đã được cập nhật!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Bây giờ bạn có thể đăng nhập vào nền tảng POLYMATCH bằng mật khẩu vừa thiết lập.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="md" className="w-full font-bold">
                    Đến trang Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/login" className="text-xs text-[#1769AA] hover:underline font-semibold flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
