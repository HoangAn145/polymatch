export const CHAT_INTENTS = {
  customer_support: "Chăm sóc khách hàng",
  logistics_market: "Thị trường logistics",
  technology: "Công nghệ",
  news_policy: "Tin tức & Chính sách",
} as const;
export type ChatIntent = keyof typeof CHAT_INTENTS;
export type ChatStrategy = "rag" | "rag_search" | "live_search";
export type ClaimKind =
  | "confirmed_fact"
  | "reported_fact"
  | "party_statement"
  | "expert_assessment"
  | "unverified_information"
  | "logistics_impact";
export const CLAIM_LABELS: Record<ClaimKind, string> = {
  confirmed_fact: "Thông tin đã đối chiếu nguồn",
  reported_fact: "Thông tin nguồn ghi nhận",
  party_statement: "Tuyên bố của bên liên quan",
  expert_assessment: "Nhận định chuyên gia",
  unverified_information: "Thông tin chưa kiểm chứng",
  logistics_impact: "Phân tích tác động logistics (giả định)",
};
export interface SourceDates {
  publishedOn: string | null;
  adoptedOn: string | null;
  issuedOn: string | null;
  effectiveOn: string | null;
  documentNumber: string | null;
}
export interface ChatSource extends SourceDates {
  id: string;
  origin: "rag" | "live";
  title: string;
  url?: string;
  source?: string;
  sourceType:
    | "approved_knowledge"
    | "official"
    | "news_media"
    | "primary_source"
    | "other";
  publisherGroup: string;
  retrievedAt: string;
  reviewedAt?: string;
}
export interface ChatClaim {
  kind: ClaimKind;
  text: string;
  sourceIds: string[];
  attribution: string | null;
  verification:
    | "official_record"
    | "corroborated_sources"
    | "reported_only"
    | "not_verified"
    | "analysis";
}
export interface ChatReply {
  answer: string;
  sources: ChatSource[];
  claims: ChatClaim[];
  handoff: boolean;
  mode: "faq" | "rag" | "news" | "hybrid";
  intent: ChatIntent;
  strategy: ChatStrategy;
  router: "llm" | "rules";
  retrievedAt: string;
  warnings: string[];
  historySaved?: boolean;
  historyId?: string;
}
export interface ChatHistoryItem {
  id: string;
  question: string;
  intent: ChatIntent;
  strategy: ChatStrategy;
  response: ChatReply;
  created_at: string;
}
