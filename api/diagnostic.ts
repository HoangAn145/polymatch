import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { analyzeDiagnostic } from "../server/analyze.js";
import { context, fail, HttpError } from "./_lib/http.js";
import { generateStructuredAnalysis } from "./_lib/gemini.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { user, profile } = await context(req);
    if (profile.role !== "BUYER")
      throw new HttpError(403, "Chỉ doanh nghiệp được tạo chẩn đoán.");
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
      throw new HttpError(
        503,
        "Chưa cấu hình quyền lưu chẩn đoán phía máy chủ.",
      );
    let result;
    try {
      result = await analyzeDiagnostic(
        req.body,
        process.env.GEMINI_API_KEY ? generateStructuredAnalysis : undefined,
      );
    } catch (e) {
      throw new HttpError(400, (e as Error).message);
    }
    const admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const { data, error } = await admin
      .from("assessments")
      .insert({ user_id: user.id, result })
      .select("id,created_at")
      .single();
    if (error) throw error;
    return res.status(200).json({ ...data, result });
  } catch (e) {
    return fail(res, e);
  }
}
