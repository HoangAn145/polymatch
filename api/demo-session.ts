import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError, fail } from "./_lib/http.js";
import { configuredDemoSession } from "../server/demo/config.js";
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
    const session = await withDeadline(25000, () => configuredDemoSession());
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
