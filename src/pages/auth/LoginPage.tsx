import { readApiResponse } from "../../lib/apiResponse";
import { demoMode, supabase } from "../../lib/supabase";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { authService } from "../../services/authService";
import { useToast } from "../../components/ui/Toast";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState(demoMode ? "buyer@vinatrans.vn" : "");
  const [password, setPassword] = useState(demoMode ? "123456" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning(
        "Chưa nhập email",
        "Vui lòng nhập địa chỉ email hoặc tài khoản demo.",
      );
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      toast.success(
        "Đăng nhập thành công!",
        `Chào mừng ${user.fullName} (${user.companyName})`,
      );

      if (user.role === "BUYER") {
        navigate("/buyer/dashboard");
      } else if (user.role === "SELLER") {
        navigate("/seller/dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(
        "Đăng nhập thất bại",
        err.message || "Email không đúng hoặc tài khoản bị khóa.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const response = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        signal: AbortSignal.timeout(30000),
      });
      const tokens = await readApiResponse<{
        access_token: string;
        refresh_token: string;
      }>(response);
      const { data, error } = await supabase.auth.setSession(tokens);
      if (error) throw error;
      await authService.synchronize(data.session);
      toast.success(
        "Đã vào tài khoản Demo",
        "Bạn có thể trải nghiệm tính năng và chatbot.",
      );
      navigate("/buyer/dashboard");
    } catch (error) {
      toast.error("Chưa đăng nhập được Demo", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("123456");
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
            <span className="font-extrabold text-2xl text-[#1769AA] tracking-tight">
              POLYMATCH
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Đăng nhập Cổng thông tin POLYMATCH
          </h2>
          <p className="text-xs text-slate-500">
            Dành cho Doanh nghiệp, Nhà cung cấp & Ban Quản trị
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200/90 space-y-6">
          {!demoMode && !supabase && (
            <p role="alert" className="text-amber-800">
              Chưa cấu hình Supabase cho ứng dụng. Vui lòng cấu hình biến môi
              trường và redeploy.
            </p>
          )}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email hoặc Số điện thoại *
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@doanhnghiep.vn"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  Mật khẩu *
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#1769AA] hover:underline text-[11px] font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-slate-600 cursor-pointer"
              >
                Ghi nhớ đăng nhập trên thiết bị này
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                disabled={!demoMode && !supabase}
                loading={loading}
                type="submit"
              >
                Đăng nhập hệ thống
              </Button>
            </div>
          </form>

          {!demoMode && supabase && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="font-semibold text-sm text-center">
                Chọn tài khoản Demo
              </h3>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                loading={loading}
                onClick={handleDemoLogin}
              >
                Demo Buyer – Doanh nghiệp
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={loading}
                onClick={() =>
                  window.location.assign("/seller/dashboard?demo=seller")
                }
              >
                Demo Seller – Nhà cung cấp
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={loading}
                onClick={() =>
                  window.location.assign("/admin/dashboard?demo=admin")
                }
              >
                Demo Admin – Quản trị
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Không cần đăng ký. Cả ba Demo có chatbot tra tri thức đã duyệt.
                Dữ liệu nghiệp vụ Seller/Admin vẫn là giả lập.
              </p>
            </div>
          )}

          {/* Quick-fill section for Evaluators / Testers */}
          {demoMode && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                Điền nhanh tài khoản diễn tập (Demo)
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill("buyer@vinatrans.vn")}
                  className="p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-[#1769AA] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> 1. Buyer
                  </div>
                  <div className="text-slate-500 truncate">
                    VinaTrans Logistics
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("seller@smartlog.vn")}
                  className="p-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> 2. Seller Duyệt
                  </div>
                  <div className="text-slate-500 truncate">
                    Smartlog (Active)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("pending@logitech.vn")}
                  className="p-2 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-amber-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3. Seller Chờ
                  </div>
                  <div className="text-slate-500 truncate">
                    LogiTech (Pending)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill("admin@polymatch.vn")}
                  className="p-2 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/60 text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-purple-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 4. Admin
                  </div>
                  <div className="text-slate-500 truncate">Quản trị viên</div>
                </button>
              </div>
            </div>
          )}
          {/* Registration link */}
          <div className="text-center pt-2 text-xs text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-bold text-[#1769AA] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Return home link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            &larr; Quay về trang chủ POLYMATCH
          </Link>
        </div>
      </div>
    </div>
  );
};
