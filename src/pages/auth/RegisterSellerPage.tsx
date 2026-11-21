import { demoMode, supabase } from '../../lib/supabase';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useToast } from '../../components/ui/Toast';

export const RegisterSellerPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [techGroups, setTechGroups] = useState<string[]>(['TMS', 'WMS']);
  const [servedBranches, setServedBranches] = useState<string[]>(['VT', 'KB']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const availableTechs = ['TMS', 'WMS', 'OMS', 'ePOD', 'FMS', 'GPS & Nhiên liệu', 'Khai hải quan', 'Logistics Xanh'];
  const availableBranches = [
    { id: 'VT', name: 'Vận tải (VT)' },
    { id: 'KB', name: 'Kho bãi (KB)' },
    { id: 'FF', name: 'Giao nhận (FF)' },
    { id: '3PL', name: 'Logistics tích hợp (3PL)' },
    { id: 'LM', name: 'Chặng cuối (LM)' }
  ];

  const toggleTech = (tech: string) => {
    setTechGroups(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleBranch = (b: string) => {
    setServedBranches(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName || !taxId || !fullName || !email || !phone || !password) {
      toast.warning("Thiếu thông tin", "Vui lòng điền đủ các trường bắt buộc (*).");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp", "Xác nhận mật khẩu không trùng khớp.");
      return;
    }

    if (techGroups.length === 0) {
      toast.warning("Chưa chọn nhóm công nghệ", "Vui lòng chọn ít nhất 1 nhóm giải pháp công nghệ.");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.registerSeller({
        password,
        companyName,
        taxId,
        fullName,
        email,
        phone,
        city: "Việt Nam",
        address: address || "Hồ Chí Minh, Việt Nam",
        website: website || "https://company.vn",
        techGroups,
        servedBranches
      });

      if (!user) {
        toast.info("Kiểm tra email xác nhận", "Tài khoản đã được gửi đăng ký. Vui lòng xác nhận email rồi đăng nhập.");
        navigate('/login');
        return;
      }

      toast.info(
        "Hồ sơ đã gửi thành công!",
        "Tài khoản Nhà cung cấp đã được tạo ở trạng thái Chờ duyệt. Ban Quản trị sẽ kiểm tra hồ sơ trước khi kích hoạt."
      );

      navigate('/seller/verification');
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-emerald-800 tracking-tight">POLYMATCH</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đăng ký tài khoản Nhà cung cấp công nghệ (Seller)
          </h2>
          <p className="text-xs text-slate-500">
            Giới thiệu giải pháp và kết nối doanh nghiệp có nhu cầu số hóa thực tế
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-md space-y-6">
          {!demoMode && !supabase && <p role="alert" className="text-amber-800">Chưa cấu hình Supabase cho ứng dụng. Vui lòng cấu hình biến môi trường và redeploy.</p>}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Nhà cung cấp *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Công ty CP Giải pháp Công nghệ..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã số thuế doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                  placeholder="0316956049 (Kiểm tra đối soát tự động)"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Người liên hệ phụ trách *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Lê Văn B"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email công vụ *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contact@techvendor.vn"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0918888999"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, quận/huyện, tỉnh thành..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website chính thức</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Tech groups selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Nhóm giải pháp công nghệ cung cấp *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTechs.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      techGroups.includes(tech)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {techGroups.includes(tech) ? '✓ ' : '+ '}
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Served branches */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Phân khúc ngành logistics phục vụ
              </label>
              <div className="flex flex-wrap gap-2">
                {availableBranches.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleBranch(b.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      servedBranches.includes(b.id)
                        ? 'bg-blue-50 border-blue-500 text-[#1769AA] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {servedBranches.includes(b.id) ? '✓ ' : '+ '}
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  minLength={demoMode ? 6 : 8}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  minLength={demoMode ? 6 : 8}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Terms notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Quy chế xét duyệt Nhà cung cấp:</span>
              </div>
              <p>
                Sau khi đăng ký, tài khoản sẽ ở trạng thái <strong>Chờ duyệt (Pending)</strong> để Admin thẩm định mã số thuế trên cổng Đăng ký kinh doanh quốc gia. Trong thời gian này, bạn có thể xem trang trạng thái nhưng chưa được đăng giải pháp công khai.
              </p>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="seller-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="seller-terms" className="ml-2 block text-xs text-slate-600">
                Tôi đồng ý với Quy chế hoạt động & Biểu phí đối soát hoa hồng của POLYMATCH.
              </label>
            </div>

            <div className="pt-2">
              <Button
                variant="success"
                size="md"
                className="w-full font-bold shadow-sm bg-emerald-700 hover:bg-emerald-800"
                disabled={!demoMode && !supabase}
                loading={loading}
                type="submit"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Gửi hồ sơ đăng ký Nhà cung cấp
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
