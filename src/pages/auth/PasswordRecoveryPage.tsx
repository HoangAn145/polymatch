import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requireSupabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
export function PasswordRecoveryPage() {
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (password !== confirm)
        throw new Error("Mật khẩu xác nhận không khớp.");
      const db = requireSupabase();
      const { data } = await db.auth.getSession();
      if (!data.session)
        throw new Error("Vui lòng mở liên kết khôi phục hợp lệ từ email.");
      const { error } = await db.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Đã cập nhật mật khẩu.");
      navigate("/workspace");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="max-w-md mx-auto my-12 p-6 bg-white border rounded-2xl">
      <h1 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          Mật khẩu mới
          <input
            required
            minLength={8}
            type="password"
            autoComplete="new-password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="block">
          Xác nhận mật khẩu
          <input
            required
            minLength={8}
            type="password"
            autoComplete="new-password"
            className="w-full p-3 border rounded-lg"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        <Button type="submit" loading={busy}>
          Lưu mật khẩu
        </Button>
        {message && <p role="status">{message}</p>}
        <Link to="/login">Đăng nhập</Link>
      </form>
    </main>
  );
}
