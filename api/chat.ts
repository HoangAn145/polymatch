import { withDeadline } from "../server/chat/deadline.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { context, fail, textInput, HttpError } from "./_lib/http.js";
import { answerChat } from "../server/chat/engine.js";
import { geminiChatProviders } from "../server/chat/providers.js";
import { saveChatHistory } from "../server/chat/history.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const payload = await withDeadline(48000, async (signal) => {
      const { db, user } = await context(req);
      signal.throwIfAborted();
      if (req.body?.action === "history") {
        const { data, error } = await db
          .from("chat_queries")
          .select("id,question,intent,strategy,response,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (error)
          throw new HttpError(
            503,
            "Chưa đọc được lịch sử; cần kiểm tra migration 003_chat_history.sql.",
          );
        return { history: data };
      }
      const question = textInput(req.body?.question);
      const reply = await answerChat(
        question,
        req.body?.mode,
        db,
        geminiChatProviders(),
      );
      signal.throwIfAborted();
      return saveChatHistory(db, question, reply);
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
