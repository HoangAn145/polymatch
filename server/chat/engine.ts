import { CLAIM_LABELS } from "../../src/lib/chatContracts.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatIntent, ChatReply } from "../../src/lib/chatContracts.js";
import {
  routeQuestion,
  requestedSince,
  redactOutboundQuestion,
  type RouterGenerator,
} from "./router.js";
import { liveSources, ragSource, type EvidenceSource } from "./sources.js";
import { composeReply } from "./generator.js";
export interface ChatProviders {
  router?: RouterGenerator;
  generate?: RouterGenerator;
  search?: (
    question: string,
    officialFirst: boolean,
    now: string,
  ) => Promise<unknown>;
  resolveUrl?: (url: string) => Promise<string | null>;
}
const CATEGORIES: Record<Exclude<ChatIntent, "news_policy">, string[]> = {
  customer_support: ["FAQ_CSKH", "FAQ", "customer_support"],
  technology: ["Cong_nghe_CDS", "Technology", "technology"],
  logistics_market: ["Logistics", "Thi_truong", "logistics_market"],
};
const STOP = new Set([
  "là",
  "gì",
  "của",
  "và",
  "có",
  "cho",
  "tôi",
  "thì",
  "nào",
  "các",
  "về",
  "với",
  "như",
  "một",
  "được",
  "không",
  "thế",
  "nên",
  "để",
  "trong",
]);
export async function retrieveKnowledge(
  db: SupabaseClient,
  question: string,
  intent: Exclude<ChatIntent, "news_policy">,
  now: string,
): Promise<EvidenceSource[]> {
  const terms =
    question
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu)
      ?.filter((t) => t.length > 1 && !STOP.has(t))
      .slice(0, 24) || [];
  if (!terms.length) return [];
  const { data, error } = await db
    .from("knowledge_documents")
    .select("id,title,content,source,category,reviewed_at,metadata")
    .eq("status", "approved")
    .in("category", CATEGORIES[intent])
    .textSearch("search_vector", terms.join(" | "), { config: "simple" })
    .limit(16);
  if (error) throw error;
  return (data || [])
    .map((row) => ({
      row,
      score: terms.reduce(
        (score, term) =>
          score +
          (String(row.title).toLowerCase().includes(term) ? 3 : 0) +
          (String(row.content).toLowerCase().includes(term) ? 1 : 0),
        0,
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ row }, index) => ragSource(row, index, now));
}
export async function answerChat(
  question: string,
  mode: unknown,
  db: SupabaseClient,
  providers: ChatProviders = {},
  now = new Date().toISOString(),
): Promise<ChatReply> {
  const route = await routeQuestion(question, mode, providers.router);
  const base = {
    intent: route.intent,
    strategy: route.strategy,
    router: route.router,
    retrievedAt: now,
  };
  const outbound = redactOutboundQuestion(question),
    warnings: string[] = [];
  let evidence: EvidenceSource[] = [];
  const tasks = await Promise.allSettled([
    route.strategy === "live_search"
      ? Promise.resolve([])
      : retrieveKnowledge(
          db,
          question,
          route.intent as Exclude<ChatIntent, "news_policy">,
          now,
        ),
    route.strategy === "rag"
      ? Promise.resolve([])
      : providers.search
        ? providers
            .search(outbound, route.policySensitive, now)
            .then((response) =>
              liveSources(response, now, providers.resolveUrl),
            )
        : Promise.reject(new Error("Live provider unavailable")),
  ]);
  if (tasks[0].status === "fulfilled") evidence.push(...tasks[0].value);
  else warnings.push("Chưa truy xuất được tri thức đã duyệt.");
  if (tasks[1].status === "fulfilled") evidence.push(...tasks[1].value);
  else if (route.strategy !== "rag")
    warnings.push(
      "Tìm kiếm trực tiếp chưa khả dụng; không xác nhận thông tin thời sự từ tài liệu RAG.",
    );
  evidence = evidence.slice(0, 12);
  if (
    route.strategy !== "rag" &&
    !evidence.some((s) => s.public.origin === "live")
  )
    warnings.push("Chưa tìm được nguồn tin trực tiếp có thể dẫn liên kết.");
  if (
    route.policySensitive &&
    !evidence.some(
      (s) => s.public.origin === "live" && s.public.sourceType === "official",
    )
  )
    warnings.push(
      "Chưa đối chiếu được nguồn chính thức; không kết luận số văn bản hoặc các mốc hiệu lực pháp lý.",
    );
  if (!providers.generate)
    warnings.push(
      "Chưa bật Gemini cho chatbot. Quản trị viên cần cấu hình GEMINI_API_KEY phía máy chủ và triển khai lại.",
    );
  const reply = await composeReply(
    outbound,
    evidence,
    base,
    providers.generate,
    warnings,
  );
  const since = requestedSince(question, now);
  if (
    route.strategy !== "rag" &&
    since &&
    !reply.sources.some(
      (s) => s.origin === "live" && s.publishedOn && s.publishedOn >= since,
    )
  ) {
    reply.warnings.push(
      "Chưa xác minh được nguồn có ngày đăng trong khoảng thời gian bạn hỏi; không coi kết quả này là xác nhận tin mới nhất.",
    );
    reply.handoff = true;
    reply.claims = reply.claims.filter(
      (c) =>
        !/hôm nay|tuần này|tháng này|hiện nay|hiện tại|mới nhất/i.test(c.text),
    );
    if (reply.claims.length)
      reply.answer = reply.claims
        .map(
          (c) =>
            `${CLAIM_LABELS[c.kind]}: ${c.text} [${c.sourceIds.join(", ")}]`,
        )
        .join("\n\n");
    if (!reply.claims.length)
      reply.answer =
        "Chưa có đủ nguồn được xác minh đúng khoảng thời gian yêu cầu. Vui lòng đối chiếu nguồn hoặc chuyển chuyên viên.";
  }
  return reply;
}
