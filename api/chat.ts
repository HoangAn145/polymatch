import type { VercelRequest, VercelResponse } from "@vercel/node";
import { context, fail, textInput, HttpError } from "./_lib/http.js";
import { answerChat } from "../server/chat/engine.js";
import { geminiChatProviders } from "../server/chat/providers.js";
import { saveChatHistory } from "../server/chat/history.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { db, user } = await context(req);
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
      return res.status(200).json({ history: data });
    }
    const question = textInput(req.body?.question);
    const reply = await answerChat(
      question,
      req.body?.mode,
      db,
      geminiChatProviders(),
    );
    return res.status(200).json(await saveChatHistory(db, question, reply));
  } catch (e) {
    return fail(res, e);
  }
}
