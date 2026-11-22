import { withDeadline } from "../server/chat/deadline.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fail, HttpError } from "./_lib/http.js";
import { chatPayload } from "../server/chat/payload.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const payload = await withDeadline(48000, async (signal) => {
      return chatPayload(req, signal);
    });
    return res.status(200).json(payload);
  } catch (e) {
    return fail(
      res,
      (e as Error)?.name === "TimeoutError"
        ? new HttpError(
            504,
            "Chatbot chưa hoàn tất trong thời gian cho phép. Vui lòng thử lại; không cần gửi liên tục.",
          )
        : e,
    );
  }
}
