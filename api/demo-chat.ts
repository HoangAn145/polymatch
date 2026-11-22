import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError, fail } from "./_lib/http.js";
import { configuredDemoSession } from "../server/demo/config.js";
import { chatPayload } from "../server/chat/payload.js";
import { withDeadline } from "../server/chat/deadline.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method !== "POST")
      throw new HttpError(405, "Phương thức không được hỗ trợ.");
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).some(
        (k) => !["question", "mode", "action"].includes(k),
      ) ||
      JSON.stringify(req.body).length > 10000
    )
      throw new HttpError(400, "Yêu cầu Demo không hợp lệ.");
    const payload = await withDeadline(48000, async (signal) => {
      const session = await configuredDemoSession();
      signal.throwIfAborted();
      // Service role is used only to obtain the dedicated Demo identity.
      // Knowledge retrieval runs under its ordinary Buyer JWT and all RLS/quota checks.
      const scoped = {
        ...req,
        headers: {
          ...req.headers,
          authorization: `Bearer ${session.access_token}`,
        },
      } as VercelRequest;
      return chatPayload(scoped, signal, true);
    });
    return res.status(200).json(payload);
  } catch (e) {
    return fail(
      res,
      (e as Error)?.name === "TimeoutError"
        ? new HttpError(504, "Chatbot Demo phản hồi chậm. Vui lòng thử lại.")
        : e,
    );
  }
}
