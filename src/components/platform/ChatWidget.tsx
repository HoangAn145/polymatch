import { sandboxMode } from "../../lib/demoSandbox";
import { readApiResponse } from "../../lib/apiResponse";
import { ruleIntent, strategyFor } from "../../lib/chatRouting";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { api, demoMode } from "../../lib/supabase";
import { featureStore } from "../../lib/featureStore";
import { authService } from "../../services/authService";
import {
  CHAT_INTENTS,
  type ChatReply as Reply,
  type ChatHistoryItem,
} from "../../lib/chatContracts";
import { ChatResponse } from "./ChatResponse";
async function chatRequest<T>(body: unknown): Promise<T> {
  if (!sandboxMode) return api<T>("chat", body);
  const response = await fetch("/api/demo-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(55000),
  });
  return readApiResponse<T>(response);
}
export function ChatWidget({ session }: { session: Session | null }) {
  const userId =
    session?.user.id || (demoMode ? authService.getCurrentUser()?.id : null);
  const sharedDemo =
    sandboxMode || session?.user.app_metadata?.public_demo === true;
  const [open, setOpen] = useState(false),
    [question, setQuestion] = useState(""),
    [mode, setMode] = useState("auto"),
    [reply, setReply] = useState<Reply | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [ticket, setTicket] = useState("");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  async function loadHistory() {
    setError("");
    try {
      if (demoMode && !sandboxMode) {
        setHistory([]);
        return;
      }
      const result = await chatRequest<{ history: ChatHistoryItem[] }>({
        action: "history",
      });
      setHistory(result.history);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setTicket("");
    try {
      if (demoMode && !sandboxMode) {
        const intent = mode === "news" ? "news_policy" : ruleIntent(question);
        const { data } = await featureStore()
          .from("knowledge_documents")
          .select("*")
          .eq("status", "approved");
        const terms = question
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length > 2);
        const categories =
          intent === "technology"
            ? ["Cong_nghe_CDS", "Technology", "technology"]
            : intent === "logistics_market"
              ? ["Logistics", "Thi_truong", "logistics_market"]
              : ["FAQ_CSKH", "FAQ", "customer_support"];
        const ranked = (data || [])
          .filter((d) => categories.includes(d.category))
          .map((d) => ({
            d,
            score: terms.filter((t) =>
              (d.title + " " + d.content).toLowerCase().includes(t),
            ).length,
          }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score);
        const doc = ranked[0]?.d;
        setReply({
          answer:
            intent === "news_policy"
              ? "Tìm tin tức mới cần phiên đăng nhập Supabase và Gemini đã cấu hình."
              : doc?.content ||
                "Chưa có tài liệu đã duyệt phù hợp. Bạn có thể gửi câu hỏi cho chuyên viên.",
          sources:
            intent !== "news_policy" && doc
              ? [
                  {
                    id: doc.id,
                    title: doc.title,
                    source: doc.source,
                    origin: "rag",
                    sourceType: "approved_knowledge",
                    publisherGroup: "approved_knowledge",
                    retrievedAt: new Date().toISOString(),
                    publishedOn: null,
                    adoptedOn: null,
                    issuedOn: null,
                    effectiveOn: null,
                    documentNumber: null,
                  },
                ]
              : [],
          handoff: !doc || intent === "news_policy",
          mode: "faq",
          intent,
          strategy: strategyFor(intent),
          router: "rules",
          retrievedAt: new Date().toISOString(),
          claims: [],
          warnings: [],
        });
      } else setReply(await chatRequest<Reply>({ question, mode }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function handoff() {
    if (!userId) return;
    setBusy(true);
    setError("");
    try {
      const { data, error } = await featureStore()
        .from("support_tickets")
        .insert({ user_id: userId, question })
        .select("id")
        .single();
      if (error) throw error;
      setTicket(data.id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      {open && (
        <section
          aria-label="Chatbot CSKH"
          className="w-96 max-w-full bg-white shadow-xl border rounded-xl mb-3 p-4 space-y-3 max-h-[75vh] overflow-auto"
        >
          <h2 className="font-bold">Trợ lý POLYMATCH</h2>
          <p className="text-xs text-slate-500">
            FAQ đã duyệt, kiến thức có nguồn và tìm kiếm tin tức.
          </p>
          {!userId ? (
            <p>
              <Link className="text-blue-700 underline" to="/login">
                Đăng nhập
              </Link>{" "}
              để trao đổi và theo dõi yêu cầu.
            </p>
          ) : (
            <>
              <form onSubmit={ask} className="space-y-3">
                <label className="block text-sm">
                  Chế độ
                  <select
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value);
                      setReply(null);
                    }}
                    className="w-full border rounded p-2"
                  >
                    <option value="auto">
                      Tự động nhận diện 4 nhóm thông tin
                    </option>
                    <option value="faq">FAQ & kiến thức</option>
                    <option value="news">
                      Tìm tin tức mới (Google Search)
                    </option>
                  </select>
                </label>
                <label className="block text-sm">
                  Câu hỏi
                  <textarea
                    aria-label="Câu hỏi"
                    required
                    maxLength={2000}
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      setReply(null);
                      setTicket("");
                    }}
                    className="w-full border rounded p-2"
                    placeholder="Ví dụ: TMS là gì? Không gửi mật khẩu hoặc OTP."
                  />
                </label>
                <button
                  disabled={busy}
                  className="bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-50"
                >
                  {busy ? "Đang xử lý…" : "Gửi câu hỏi"}
                </button>
              </form>
              {reply && <ChatResponse reply={reply} />}
              {(!demoMode || sandboxMode) && (
                <details className="text-sm">
                  <summary
                    className="cursor-pointer"
                    onClick={() => void loadHistory()}
                  >
                    {sharedDemo
                      ? "Lịch sử Demo dùng chung"
                      : "Lịch sử truy vấn của tôi"}
                  </summary>
                  <div className="space-y-2 pt-2">
                    {!history.length && (
                      <p className="text-xs text-slate-500">
                        Chưa có lịch sử đã lưu.
                      </p>
                    )}
                    {history.map((item) => (
                      <button
                        key={item.id}
                        className="block text-left w-full border rounded p-2 text-xs"
                        onClick={() => {
                          setQuestion(item.question);
                          setReply({
                            ...item.response,
                            warnings: [
                              ...(item.response.warnings || []),
                              "Kết quả đã lưu; gửi lại câu hỏi để kiểm tra cập nhật mới.",
                            ],
                          });
                          setTicket("");
                        }}
                      >
                        {item.question}
                        <span className="block text-slate-500">
                          {CHAT_INTENTS[item.intent]} ·{" "}
                          {new Date(item.created_at).toLocaleString("vi-VN")}
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
              )}
              {question.trim() && !ticket && (
                <button
                  disabled={busy}
                  onClick={handoff}
                  className="border rounded p-2 text-sm"
                >
                  Đồng ý gửi câu hỏi này cho chuyên viên
                </button>
              )}
              {ticket && (
                <p role="status" className="text-sm text-green-700">
                  Đã tạo yêu cầu: {ticket}. Xem tiến độ trong mục Hỗ trợ CSKH.
                </p>
              )}
              {error && (
                <p role="alert" className="text-red-700 text-sm">
                  {error}
                </p>
              )}
            </>
          )}
        </section>
      )}
      <button
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="bg-blue-700 text-white rounded-full shadow-lg px-5 py-3"
      >
        {open ? "Đóng trợ lý" : "Chat CSKH"}
      </button>
    </aside>
  );
}
