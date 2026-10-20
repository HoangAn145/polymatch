import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const RegisterBuyerPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState<'VT' | 'FF' | 'KB' | '3PL' | 'LM' | 'KH'>('VT');
  const [scale, setScale] = useState<'sieu_nho' | 'nho' | 'vua' | 'lon'>('nho');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName || !taxId || !fullName || !email || !phone || !password) {
      toast.warning("Thiếu thông tin", "Vui lòng điền đầy đủ các trường thông tin bắt buộc (*).");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp", "Xác nhận mật khẩu phải trùng khớp với mật khẩu đã nhập.");
      return;
    }

    if (!agreeTerms) {
      toast.warning("Điều khoản dịch vụ", "Vui lòng đồng ý với Điều khoản sử dụng & Quy chế bảo vệ dữ liệu.");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.registerBuyer({
        companyName,
        taxId,
        fullName,
        email,
        phone,
        city,
        address: address || `${city}, Việt Nam`,
        branch,
        scale
      });

      toast.success(
        "Đăng ký tài khoản Doanh nghiệp thành công!",
        `Chào mừng ${user.fullName} (${user.companyName}) tham gia nền tảng POLYMATCH.`
      );

      navigate('/buyer/dashboard');
    } catch (err: any) {
      toast.error("Đăng ký không thành công", err.message || "Email đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1769AA] flex items-center justify-center text-white shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-[#1769AA] tracking-tight">POLYMATCH</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đăng ký tài khoản Doanh nghiệp (Buyer)
          </h2>
          <p className="text-xs text-slate-500">
            Đánh giá mức độ trưởng thành số và kết nối giải pháp công nghệ phù hợp
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Công ty CP Logistics Việt Nam"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã số thuế doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  placeholder="0312345678 (10 hoặc 13 số)"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Người đại diện / liên hệ *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email liên hệ *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@company.vn"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tỉnh / Thành phố *</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngành hoạt động chính *</label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
                >
                  <option value="VT">Vận tải đường bộ (VT)</option>
                  <option value="KB">Kho bãi & Phân phối (KB)</option>
                  <option value="FF">Giao nhận quốc tế (FF)</option>
                  <option value="3PL">Logistics tích hợp (3PL)</option>
                  <option value="LM">Giao hàng chặng cuối (LM)</option>
                  <option value="KH">Khác</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quy mô doanh nghiệp *</label>
                <select
                  value={scale}
                  onChange={e => setScale(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 bg-white"
                >
                  <option value="sieu_nho">Siêu nhỏ (≤ 10 lao động)</option>
                  <option value="nho">Nhỏ (10 - 50 lao động)</option>
                  <option value="vua">Vừa (50 - 100 lao động)</option>
                  <option value="lon">Lớn (&gt; 100 lao động)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30"
                />
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-slate-600">
                Tôi đồng ý với Điều khoản sử dụng và Quy chế bảo mật dữ liệu của POLYMATCH.
              </label>
            </div>

            <div className="pt-3">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                loading={loading}
                type="submit"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Hoàn tất đăng ký & Vào bảng điều khiển
              </Button>
            </div>
          </form>

          <div className="text-center pt-6 text-xs text-slate-500 border-t border-slate-100 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-[#1769AA] hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
