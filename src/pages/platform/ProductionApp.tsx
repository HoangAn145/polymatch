import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase, requireSupabase } from "../../lib/supabase";
import { ToastProvider } from "../../components/ui/Toast";
import { PublicLayout } from "../../layouts/PublicLayout";
import { HomePage } from "../public/HomePage";
import { AboutPage } from "../public/AboutPage";
import { SolutionsCatalogPage } from "../public/SolutionsCatalogPage";
import { ProvidersPage } from "../public/ProvidersPage";
import { ConsultingPage } from "../public/ConsultingPage";
import { PricingPage } from "../public/PricingPage";
import { InsightsPage } from "../public/InsightsPage";
import { ContactPage } from "../public/ContactPage";
import { PlatformPage } from "./PlatformPage";
import { ChatWidget } from "../../components/platform/ChatWidget";
import { field, primary, panel } from "./styles";
function AuthPage({ session }: { session: Session | null }) {
  const navigate = useNavigate(),
    location = useLocation();
  const register = location.pathname.startsWith("/register"),
    reset = location.pathname === "/forgot-password",
    recovery = location.pathname === "/reset-password";
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [company, setCompany] = useState("");
  const [role, setRole] = useState(
      location.pathname.endsWith("/seller") ? "SELLER" : "BUYER",
    ),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  if (session && !recovery) return <Navigate to="/workspace" replace />;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const db = requireSupabase();
      if (recovery) {
        if (!session) throw new Error("Mở liên kết khôi phục hợp lệ từ email.");
        const { error } = await db.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Đã cập nhật mật khẩu.");
        navigate("/workspace");
      } else if (reset) {
        const { error } = await db.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage(
          "Nếu email có tài khoản, bạn sẽ nhận được liên kết khôi phục.",
        );
      } else if (register) {
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { role, fullName: name, companyName: company },
            emailRedirectTo: `${window.location.origin}/workspace`,
          },
        });
        if (error) throw error;
        if (data.session) navigate("/workspace");
        else
          setMessage(
            "Vui lòng kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.",
          );
      } else {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/workspace");
      }
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="max-w-md mx-auto my-12 px-4">
      <form onSubmit={submit} className={panel}>
        <h1 className="text-2xl font-bold">
          {recovery
            ? "Đặt lại mật khẩu"
            : reset
              ? "Khôi phục tài khoản"
              : register
                ? "Đăng ký POLYMATCH"
                : "Đăng nhập POLYMATCH"}
        </h1>
        {!supabase && <p role="alert">Chưa cấu hình Supabase cho ứng dụng.</p>}
        {register && (
          <>
            <label className="block">
              Họ tên
              <input
                required
                maxLength={200}
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block">
              Doanh nghiệp
              <input
                required
                maxLength={300}
                className={field}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
            <label className="block">
              Vai trò
              <select
                className={field}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="BUYER">Doanh nghiệp có nhu cầu</option>
                <option value="SELLER">Nhà cung cấp (chờ duyệt)</option>
              </select>
            </label>
          </>
        )}
        {!recovery && (
          <label className="block">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        )}
        {!reset && (
          <label className="block">
            Mật khẩu
            <input
              required
              minLength={8}
              type="password"
              autoComplete={
                register || recovery ? "new-password" : "current-password"
              }
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        <button disabled={busy || !supabase} className={primary}>
          {busy
            ? "Đang xử lý…"
            : reset
              ? "Gửi liên kết"
              : register
                ? "Tạo tài khoản"
                : recovery
                  ? "Lưu mật khẩu"
                  : "Đăng nhập"}
        </button>
        {message && <p role="status">{message}</p>}
        <div className="flex gap-4 text-blue-700">
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
      </form>
    </main>
  );
}
export function ProductionApp() {
  const [session, setSession] = useState<Session | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  if (loading)
    return (
      <p className="p-8" role="status">
        Đang kiểm tra phiên đăng nhập…
      </p>
    );
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/solutions" element={<SolutionsCatalogPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/consulting" element={<ConsultingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {[
              "/login",
              "/register",
              "/register/buyer",
              "/register/seller",
              "/forgot-password",
              "/reset-password",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={<AuthPage session={session} />}
              />
            ))}
          </Route>
          <Route
            path="/workspace"
            element={
              session ? (
                <PlatformPage key={session.user.id} session={session} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={session ? "/workspace" : "/login"} replace />
            }
          />
        </Routes>
        <ChatWidget session={session} />
      </BrowserRouter>
    </ToastProvider>
  );
}
