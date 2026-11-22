import { sandboxMode } from "./demoSandbox";
import { readApiResponse } from "./apiResponse";
import { createClient } from "@supabase/supabase-js";
const env = import.meta.env;
export const demoMode = sandboxMode || env.VITE_DEMO_MODE === "true";
export const supabase =
  !sandboxMode && env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY
    ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
    : null;
export function requireSupabase() {
  if (!supabase)
    throw new Error("Chưa cấu hình Supabase. Vui lòng liên hệ quản trị viên.");
  return supabase;
}
export async function api<T>(path: string, body: unknown): Promise<T> {
  const { data } = await requireSupabase().auth.getSession();
  if (!data.session) throw new Error("Vui lòng đăng nhập.");
  try {
    const res = await fetch(`/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session.access_token}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(path === "chat" ? 55000 : 45000),
    });
    return await readApiResponse<T>(res);
  } catch (error) {
    if (["TimeoutError", "AbortError"].includes((error as Error)?.name))
      throw new Error(
        "Kết nối tới máy chủ đã hết thời gian chờ. Vui lòng thử lại sau một lát.",
      );
    throw error;
  }
}
