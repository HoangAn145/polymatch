import { createClient } from "@supabase/supabase-js";
import { HttpError } from "../../api/_lib/http.js";
import { demoSession } from "./session.js";
export async function configuredDemoSession() {
  if (process.env.DEMO_LOGIN_ENABLED === "false")
    throw new HttpError(403, "Tài khoản Demo đang tạm dừng.");
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
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  return demoSession(
    createClient(url, serviceKey, options),
    createClient(url, publicKey, options),
  );
}
