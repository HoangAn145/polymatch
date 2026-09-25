import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { BranchCode } from '../data/questions';
import { kiemTraMaSoThue, traCuuMstMoPhong } from '../lib/scoring';
import { 
  X, 
  Lock, 
  Mail, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Cpu, 
  AlertCircle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess: () => void;
  actionReason?: string; // Optional context why modal opened (e.g. "Vui lòng đăng nhập để làm bài đánh giá đầy đủ")
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
  actionReason,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>(defaultMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register fields
  const [regRole, setRegRole] = useState<'buyer' | 'vendor'>('buyer');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('123456');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTaxCode, setRegTaxCode] = useState('');
  const [regBranch, setRegBranch] = useState<BranchCode>('VT');
  const [taxError, setTaxError] = useState<string | null>(null);
  const [taxLookupInfo, setTaxLookupInfo] = useState<string | null>(null);

  // OTP Verification state (M02.02)
  const [otpCode, setOtpCode] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Pending registered payload
  const [pendingUser, setPendingUser] = useState<any>(null);

  if (!isOpen) return null;

  const quickScanSession = storage.getQuickScan();

  // Validate Tax Code in real-time when user types (R25/R26)
  const handleTaxCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setRegTaxCode(val);
    setTaxLookupInfo(null);

    if (val.length >= 10) {
      const check = kiemTraMaSoThue(val);
      if (!check.hop_le) {
        setTaxError(check.loi || 'Mã số thuế không hợp lệ theo thuật toán R25.');
      } else {
        setTaxError(null);
        const lookup = traCuuMstMoPhong(val);
        setTaxLookupInfo(`Đã tra cứu (${lookup.nguon}): ${lookup.ten} - ${lookup.tinh_trang}`);
        if (!regCompanyName) {
          setRegCompanyName(lookup.ten);
        }
      }
    } else {
      setTaxError(null);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('Vui lòng nhập email đăng nhập.');
      return;
    }
    // Simulate login
    if (loginEmail.includes('smartlog') || loginEmail.includes('vendor')) {
      storage.loginAs('vendor');
    } else if (loginEmail.includes('admin')) {
      storage.loginAs('admin');
    } else {
      storage.loginAs('buyer');
    }
    onSuccess();
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regName || !regCompanyName || !regTaxCode) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const check = kiemTraMaSoThue(regTaxCode);
    if (!check.hop_le) {
      setTaxError(check.loi || 'Mã số thuế không hợp lệ.');
      return;
    }

    // Prepare pending registration and trigger OTP step (M02.02)
    setPendingUser({
      email: regEmail,
      name: regName,
      role: regRole,
      companyName: regCompanyName,
      taxCode: regTaxCode,
      branch: regBranch,
    });
    setMode('otp');
    setOtpAttempts(0);
    setOtpError(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Default simulated OTP is 123456 or any 6 digits
    if (otpCode.length !== 6) {
      setOtpError('Mã OTP phải bao gồm đúng 6 chữ số.');
      return;
    }

    if (otpCode === '123456' || otpCode === '888888' || otpAttempts >= 1) {
      if (pendingUser) {
        storage.registerUser(
          pendingUser.email,
          pendingUser.name,
          pendingUser.role,
          pendingUser.companyName,
          pendingUser.taxCode,
          pendingUser.branch
        );
      }
      onSuccess();
      onClose();
    } else {
      const nextAtt = otpAttempts + 1;
      setOtpAttempts(nextAtt);
      if (nextAtt >= 5) {
        setOtpError('Đã vượt quá 5 lần nhập sai mã OTP (M02.02). Vui lòng yêu cầu gửi lại mã.');
      } else {
        setOtpError(`Mã OTP không đúng. Bạn có thể nhập "123456" cho tài khoản thử nghiệm. (Lần sai: ${nextAtt}/5)`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'login' && 'Đăng nhập tài khoản'}
              {mode === 'register' && 'Đăng ký tài khoản mới'}
              {mode === 'otp' && 'Xác thực OTP qua Email'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống đánh giá trưởng thành số & ghép nối POLYMATCH
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Reason Banner (Contextual Prompt) */}
        {actionReason && (
          <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{actionReason}</span>
          </div>
        )}

        {/* Quick Scan Linking Notice (M02.06) */}
        {quickScanSession && mode === 'register' && (
          <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100 flex items-start gap-2 text-xs text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Đã lưu kết quả Quick Scan:</strong> Sau khi đăng ký, kết quả quét nhánh {quickScanSession.branch} sẽ tự động được liên kết vào hồ sơ doanh nghiệp của bạn!
            </span>
          </div>
        )}

        <div className="p-6">
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email hoặc Số điện thoại
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: giamdoc@achau-logistics.vn"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mật khẩu
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Link đặt lại mật khẩu đã được gửi đến email đăng ký.'); }} className="text-xs text-blue-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Đăng nhập
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>

              {/* 1-Click Fast Demo Logins */}
              <div className="pt-4 border-t border-slate-200 mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2">
                  Đăng nhập nhanh tài khoản mẫu (Demo)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { storage.loginAs('buyer'); onSuccess(); onClose(); }}
                    className="p-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-left transition-all text-xs"
                  >
                    <div className="font-semibold text-slate-900">Người mua</div>
                    <div className="text-[10px] text-slate-500">Á Châu Logistics</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { storage.loginAs('vendor'); onSuccess(); onClose(); }}
                    className="p-2 border border-slate-200 hover:border-amber-500 hover:bg-amber-50 rounded-lg text-left transition-all text-xs"
                  >
                    <div className="font-semibold text-slate-900">Người bán</div>
                    <div className="text-[10px] text-slate-500">Smartlog Vina</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { storage.loginAs('admin'); onSuccess(); onClose(); }}
                    className="p-2 border border-slate-200 hover:border-rose-500 hover:bg-rose-50 rounded-lg text-left transition-all text-xs"
                  >
                    <div className="font-semibold text-slate-900">Admin</div>
                    <div className="text-[10px] text-slate-500">Quản trị viên</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role Selection (M02.03) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chọn vai trò tài khoản:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2 ${regRole === 'buyer' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Truck className={`w-4 h-4 mt-0.5 ${regRole === 'buyer' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Doanh nghiệp Logistics</div>
                      <div className="text-[10px] text-slate-500">Cần đánh giá & tìm công nghệ</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('vendor')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2 ${regRole === 'vendor' ? 'border-amber-600 bg-amber-50 text-amber-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Cpu className={`w-4 h-4 mt-0.5 ${regRole === 'vendor' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Nhà Cung Cấp Công Nghệ</div>
                      <div className="text-[10px] text-slate-500">Cung cấp phần mềm, giải pháp</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tax Code with Verification (R25/R26) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mã số thuế (Bắt buộc)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Thuật toán R25</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0316956049 hoặc 0101248141"
                  value={regTaxCode}
                  onChange={handleTaxCodeChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none ${taxError ? 'border-rose-400 bg-rose-50' : 'border-slate-300 focus:ring-2 focus:ring-blue-600'}`}
                />
                {taxError && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    {taxError}
                  </p>
                )}
                {taxLookupInfo && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {taxLookupInfo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên doanh nghiệp
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tên đầy đủ theo ĐKKD"
                  value={regCompanyName}
                  onChange={(e) => setRegCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Người liên hệ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhánh hoạt động chính
                  </label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value as BranchCode)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="VT">Vận tải nội địa (VT)</option>
                    <option value="KB">Kho bãi (KB)</option>
                    <option value="FF">Giao nhận quốc tế (FF)</option>
                    <option value="3PL">3PL/4PL Logistics</option>
                    <option value="LM">Chặng cuối (LM)</option>
                    <option value="KH">Khác (KH)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email công vụ
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Tiếp tục: Nhận mã xác thực OTP
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION STEP (M02.02) */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <KeyRound className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">
                  Mã xác thực OTP đã được gửi đến email:
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {pendingUser?.email}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã có hiệu lực trong 5 phút. Tối đa 5 lần thử sai (M02.02).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  Nhập mã 6 chữ số:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-48 mx-auto block px-4 py-2.5 text-center text-xl font-mono tracking-widest border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {otpError && (
                  <p className="text-xs text-rose-600 text-center mt-2">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Xác thực & Hoàn tất đăng ký
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Quay lại chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode('123456');
                    alert('Mã OTP mô phỏng: 123456 đã được tự động điền.');
                  }}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Gửi lại mã OTP
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
