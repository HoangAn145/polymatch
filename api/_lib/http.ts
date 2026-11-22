import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function context(req: VercelRequest) {
  if (req.method !== "POST")
    throw new HttpError(405, "Phương thức không được hỗ trợ.");
  // The browser and function use the same public project identity. Never fall
  // back to service_role: requests must still run under the user's JWT/RLS.
  const url =
      process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim(),
    key =
      process.env.SUPABASE_ANON_KEY?.trim() ||
      process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key)
    throw new HttpError(
      503,
      "Chưa cấu hình kết nối Supabase cho API. Cần SUPABASE_URL và SUPABASE_ANON_KEY (hoặc cặp VITE_SUPABASE tương ứng) ở môi trường của deployment, sau đó triển khai lại.",
    );
  const token = req.headers.authorization;
  if (!token?.startsWith("Bearer "))
    throw new HttpError(401, "Vui lòng đăng nhập.");
  const db = createClient(url, key, {
    global: { headers: { Authorization: token } },
    auth: { persistSession: false },
  });
  const { data, error } = await db.auth.getUser(token.slice(7));
  if (error || !data.user)
    throw new HttpError(401, "Phiên đăng nhập không hợp lệ.");
  const { data: profile, error: pe } = await db
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (pe || !profile || profile.status === "locked")
    throw new HttpError(403, "Tài khoản không có quyền truy cập.");
  if (JSON.stringify(req.body ?? {}).length > 40000)
    throw new HttpError(413, "Nội dung quá dài.");
  const { data: allowed, error: rateError } = await db.rpc("consume_api_quota");
  if (rateError) throw new HttpError(503, "Chưa sẵn sàng kiểm tra hạn mức.");
  if (!allowed)
    throw new HttpError(
      429,
      "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau một phút.",
    );
  return { db, user: data.user, profile };
}
export function fail(res: VercelResponse, error: unknown) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(error instanceof HttpError ? error.status : 500).json({
    error:
      error instanceof HttpError
        ? error.message
        : "Không thể xử lý yêu cầu. Vui lòng thử lại.",
  });
}
export function textInput(value: unknown, max = 2000) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new HttpError(400, "Nội dung không hợp lệ.");
  return value.trim();
}
