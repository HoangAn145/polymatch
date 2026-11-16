import { createClient } from '@supabase/supabase-js';
export const supabase = (() => {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL,
      key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key) : null;
  } catch {
    return null;
  }
})();
export async function request(
  action: string,
  payload: Record<string, unknown>,
) {
  const session = await supabase?.auth.getSession();
  if (!session?.data.session) throw Error('Vui lòng đăng nhập.');
  const response = await fetch('/api/platform', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.data.session.access_token}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const value = await response.json();
  if (!response.ok) throw Error(value.error || 'Không thể xử lý yêu cầu.');
  return value;
}
export async function query<T>(
  promise: PromiseLike<{ data: T; error: { message: string } | null }>,
) {
  const r = await promise;
  if (r.error) throw Error(r.error.message);
  return r.data;
}
