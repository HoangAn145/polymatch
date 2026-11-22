import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { HttpError, fail } from "./_lib/http.js";
import { demoSession } from "../server/demo/session.js";
import { withDeadline } from "../server/chat/deadline.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method !== "POST")
      throw new HttpError(405, "Phương thức không được hỗ trợ.");
    if (process.env.DEMO_LOGIN_ENABLED === "false")
      throw new HttpError(403, "Tài khoản Demo đang tạm dừng.");
    if (Object.keys(req.body || {}).length)
      throw new HttpError(
        400,
        "Đăng nhập Demo không nhận email, vai trò hoặc mật khẩu.",
      );
    const url =
      process.env.SUPABASE_URL?.trim() || process.env.VITE_SUPABASE_URL?.trim();
    const publicKey =
      process.env.SUPABASE_ANON_KEY?.trim() ||
      process.env.VITE_SUPABASE_ANON_KEY?.trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !publicKey || !serviceKey)
      throw new HttpError(
        503,
        "Chưa bật tài khoản Demo trên máy chủ. Cần cấu hình Supabase service role cho Production.",
      );
    const options = {
      auth: { persistSession: false, autoRefreshToken: false },
    };
    const session = await withDeadline(25000, () =>
      demoSession(
        createClient(url, serviceKey, options),
        createClient(url, publicKey, options),
      ),
    );
    return res.status(200).json(session);
  } catch (e) {
    return fail(
      res,
      (e as Error)?.name === "TimeoutError"
        ? new HttpError(504, "Đăng nhập Demo phản hồi chậm. Vui lòng thử lại.")
        : e,
    );
  }
}
