import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatReply } from "../../src/lib/chatContracts.js";
export async function saveChatHistory(
  db: SupabaseClient,
  question: string,
  reply: ChatReply,
): Promise<ChatReply> {
  const news = reply.sources
    .filter((s) => s.origin === "live")
    .map((source) => ({
      title: source.title,
      url: source.url,
      summary: reply.claims
        .filter((c) => c.sourceIds.includes(source.id))
        .map((c) => c.text)
        .join(" ")
        .slice(0, 1200),
      published_on: source.publishedOn,
      adopted_on: source.adoptedOn,
      issued_on: source.issuedOn,
      effective_on: source.effectiveOn,
      source_type: source.sourceType,
      retrieved_at: source.retrievedAt,
    }));
  try {
    const { data, error } = await db.rpc("record_chat_response", {
      p_question: question,
      p_intent: reply.intent,
      p_strategy: reply.strategy,
      p_response: reply,
      p_sources: news,
    });
    if (error || typeof data !== "string")
      throw error || new Error("History unavailable");
    return { ...reply, historySaved: true, historyId: data };
  } catch {
    return {
      ...reply,
      historySaved: false,
      warnings: [
        ...reply.warnings,
        "Chưa lưu được lịch sử truy vấn; quản trị viên cần kiểm tra migration 003_chat_history.sql.",
      ],
    };
  }
}
