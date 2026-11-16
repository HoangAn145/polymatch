import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { api, demoMode } from "../../lib/supabase";
import { featureStore } from "../../lib/featureStore";
import { authService } from "../../services/authService";
type Reply = {
  answer: string;
  sources: { id?: string; title: string; source?: string; url?: string }[];
  handoff: boolean;
  mode: string;
};
export function ChatWidget({ session }: { session: Session | null }) {
  const userId =
    session?.user.id || (demoMode ? authService.getCurrentUser()?.id : null);
  const [open, setOpen] = useState(false),
    [question, setQuestion] = useState(""),
    [mode, setMode] = useState("faq"),
    [reply, setReply] = useState<Reply | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [ticket, setTicket] = useState("");
  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setTicket("");
    try {
      if (demoMode) {
        const { data } = await featureStore()
          .from("knowledge_documents")
          .select("*")
          .eq("status", "approved");
        const terms = question
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => t.length > 2);
        const ranked = (data || [])
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
            mode === "news"
              ? "Tìm tin tức mới cần phiên đăng nhập Supabase và Gemini đã cấu hình."
              : doc?.content ||
                "Chưa có tài liệu đã duyệt phù hợp. Bạn có thể gửi câu hỏi cho chuyên viên.",
          sources: doc
            ? [{ id: doc.id, title: doc.title, source: doc.source }]
            : [],
          handoff: !doc,
          mode: "faq",
        });
      } else setReply(await api<Reply>("chat", { question, mode }));
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
                    <option value="faq">FAQ & kiến thức</option>
                    <option value="news">
                      Tìm tin tức mới (Google Search)
                    </option>
                  </select>
                </label>
                <label className="block text-sm">
                  Câu hỏi
                  <textarea
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
              {reply && (
                <div aria-live="polite" className="space-y-2">
                  <p className="text-xs text-slate-500">
                    {reply.mode === "rag"
                      ? "Diễn giải Gemini + tài liệu đã duyệt"
                      : reply.mode === "news"
                        ? "Tìm kiếm thời sự"
                        : "Tra cứu tài liệu"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm">{reply.answer}</p>
                  {reply.sources.map((s, i) => (
                    <p key={i} className="text-xs">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 underline"
                        >
                          {s.title}
                        </a>
                      ) : (
                        <span>
                          {s.id} · {s.title}
                          <br />
                          {s.source}
                        </span>
                      )}
                    </p>
                  ))}
                </div>
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
                  Đã tạo yêu cầu: {ticket}. Xem tiến độ trong Không gian làm
                  việc → Yêu cầu CSKH.
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
