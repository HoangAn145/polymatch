import React, { useState } from 'react';
import { supabase } from './client';
import { card, input, button, Field, Notice } from './ui';
export default function Auth({
  recovery,
  onDone,
}: {
  recovery: boolean;
  onDone: () => void;
}) {
  const [mode, setMode] = useState('login'),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [name, setName] = useState(''),
    [company, setCompany] = useState(''),
    [role, setRole] = useState('BUYER'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      let r;
      if (recovery) {
        r = await supabase!.auth.updateUser({ password });
        if (r.error) throw r.error;
        onDone();
        setNotice('Đã đổi mật khẩu.');
      } else if (mode === 'login') {
        r = await supabase!.auth.signInWithPassword({ email, password });
        if (r.error) throw r.error;
      } else if (mode === 'signup') {
        r = await supabase!.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: location.origin + '/platform',
            data: { full_name: name, company, role },
          },
        });
        if (r.error) throw r.error;
        setNotice(
          'Đã gửi đăng ký. Kiểm tra email để xác nhận nếu được yêu cầu.',
        );
      } else {
        r = await supabase!.auth.resetPasswordForEmail(email, {
          redirectTo: location.origin + '/platform',
        });
        if (r.error) throw r.error;
        setNotice('Nếu email tồn tại, bạn sẽ nhận hướng dẫn khôi phục.');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={`${card} mx-auto max-w-md space-y-4`}>
      <h1 className="text-2xl font-bold">
        {recovery
          ? 'Đặt mật khẩu mới'
          : mode === 'login'
            ? 'Đăng nhập POLYMATCH'
            : mode === 'signup'
              ? 'Tạo tài khoản'
              : 'Khôi phục tài khoản'}
      </h1>
      <form onSubmit={submit} className="space-y-4">
        {!recovery && (
          <Field label="Email">
            <input
              className={input}
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        )}
        {(recovery || mode !== 'reset') && (
          <Field label="Mật khẩu">
            <input
              className={input}
              required
              type="password"
              minLength={8}
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        )}
        {mode === 'signup' && !recovery && (
          <>
            <Field label="Họ tên">
              <input
                className={input}
                required
                maxLength={150}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Doanh nghiệp">
              <input
                className={input}
                required
                maxLength={200}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </Field>
            <Field label="Vai trò">
              <select
                className={input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="BUYER">Doanh nghiệp</option>
                <option value="SELLER">Nhà cung cấp (chờ duyệt)</option>
              </select>
            </Field>
          </>
        )}
        <button className={button} disabled={busy}>
          {busy
            ? 'Đang xử lý…'
            : recovery
              ? 'Lưu mật khẩu'
              : mode === 'login'
                ? 'Đăng nhập'
                : mode === 'signup'
                  ? 'Đăng ký'
                  : 'Gửi hướng dẫn'}
        </button>
      </form>
      <Notice error={error} />
      {notice && (
        <p role="status" className="text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {!recovery && (
        <div className="flex flex-wrap gap-4 text-sm">
          {['login', 'signup', 'reset']
            .filter((m) => m !== mode)
            .map((m) => (
              <button
                key={m}
                className="text-blue-700 underline"
                onClick={() => {
                  setMode(m);
                  setError('');
                  setNotice('');
                }}
              >
                {m === 'login'
                  ? 'Đăng nhập'
                  : m === 'signup'
                    ? 'Đăng ký'
                    : 'Quên mật khẩu'}
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
