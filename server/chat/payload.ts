import type { VercelRequest } from "@vercel/node";
import { context, textInput, HttpError } from "../../api/_lib/http.js";
import { answerChat } from "./engine.js";
import { geminiChatProviders } from "./providers.js";
import { saveChatHistory } from "./history.js";
export async function chatPayload(
  req: VercelRequest,
  signal: AbortSignal,
  demoOnly = false,
) {
  const { db, user, profile } = await context(req);
  signal.throwIfAborted();
  if (
    demoOnly &&
    (user.email !== "demo-buyer@polymatch.example" ||
      user.app_metadata?.public_demo !== true ||
      profile.role !== "BUYER")
  )
    throw new HttpError(403, "Chỉ tài khoản Demo được dùng cổng này.");
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
}
