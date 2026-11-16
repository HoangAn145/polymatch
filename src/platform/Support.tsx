import React, { useState } from 'react';
import { request } from './client';
import { FAQ } from './domain';
import { card, input, button, Field, Notice } from './ui';
type Source = {
  id?: string;
  external_id?: string;
  title: string;
  url?: string;
  source_references?: string[];
};
type Message = {
  role: string;
  text: string;
  mode?: string;
  sources?: Source[];
};
export default function Support({ onSaved }: { onSaved: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
      {
        role: 'assistant',
        text: 'Xin chào! Tôi hỗ trợ về KPI, đánh giá và giải pháp. Bạn có thể tìm tin tức hoặc tạo yêu cầu chuyển chuyên viên.',
      },
    ]),
    [message, setMessage] = useState(''),
    [news, setNews] = useState(false),
    [department, setDepartment] = useState('CSKH'),
    [requestId, setRequestId] = useState(() => crypto.randomUUID()),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function send(e?: React.FormEvent, handoff = false) {
    e?.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError('');
    try {
      const r = await request(handoff ? 'handoff' : news ? 'news' : 'chat', {
        message,
        requestId,
        department,
      });
      setMessages((ms) => [
        ...ms,
        { role: 'user', text: message },
        {
          role: 'assistant',
          text: handoff
            ? `Đã tạo yêu cầu ${r.ticket.id} · ${r.ticket.department} · ${r.ticket.status}. Đây là hàng đợi, chưa kết nối trực tiếp và chưa có SLA được cam kết.`
            : r.answer,
          mode: handoff ? 'handoff' : r.mode,
          sources: r.sources,
        },
      ]);
      setMessage('');
      setRequestId(crypto.randomUUID());
      if (handoff) onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Chatbot CSKH</h2>
      <p className="text-sm text-slate-600">
        Trả lời từ FAQ và tri thức đã xuất bản; Gemini tổng hợp nếu được cấu
        hình. Tìm web chỉ báo thành công khi có nguồn. Không gửi mật khẩu/OTP
        hay dữ liệu nhạy cảm. Câu hỏi và tài liệu liên quan có thể gửi tới
        Gemini; hội thoại chỉ giữ trong phiên này.
      </p>
      <div className="flex flex-wrap gap-2">
        {FAQ.map((f) => (
          <button
            key={f.id}
            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs"
            onClick={() => setMessage(f.title)}
          >
            {f.title}
          </button>
        ))}
      </div>
      <div
        className={`${card} max-h-[520px] space-y-3 overflow-y-auto`}
        role="log"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <article
            key={i}
            className={`rounded-xl p-4 ${m.role === 'user' ? 'ml-6 bg-blue-50' : 'mr-6 bg-slate-50'}`}
          >
            <p className="text-xs font-bold text-slate-500">
              {m.role === 'user'
                ? 'Bạn'
                : `POLYMATCH${m.mode ? ` · ${m.mode === 'rag' ? 'Gemini + tài liệu' : m.mode === 'web' ? 'Tìm kiếm web' : m.mode === 'internal' ? 'Kho tin nội bộ' : m.mode === 'handoff' ? 'Chuyển chuyên viên' : 'Truy xuất tài liệu'}` : ''}`}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{m.text}</p>
            {!!m.sources?.length && (
              <div className="mt-3 text-xs">
                <p className="font-bold">Nguồn dùng để trả lời</p>
                {m.sources.map((s, j) => (
                  <div key={j} className="mt-1">
                    {s.external_id ? `${s.external_id} · ` : ''}
                    {s.url && /^(https:\/\/|\/platform)/.test(s.url) ? (
                      <a
                        className="text-blue-700 underline"
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                    {(s.source_references || [])
                      .filter((u) => u !== s.url && u.startsWith('https://'))
                      .map((u, k) => (
                        <a
                          key={u}
                          className="ml-2 text-blue-700 underline"
                          href={u}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Nguồn {k + 2}
                        </a>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <form onSubmit={send} className={`${card} space-y-3`}>
        <Field label="Nội dung">
          <textarea
            className={input}
            required
            maxLength={1500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={news}
            onChange={(e) => setNews(e.target.checked)}
          />
          Tìm tin tức logistics
        </label>
        <Field label="Bộ phận tiếp nhận">
          <select
            className={input}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {['CSKH', 'Kỹ thuật', 'Chuyên môn', 'Tài chính'].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <div className="flex flex-wrap gap-3">
          <button className={button} disabled={busy || !message.trim()}>
            {busy ? 'Đang xử lý…' : 'Gửi câu hỏi'}
          </button>
          <button
            className="rounded-lg border border-blue-300 px-4 py-2 text-sm disabled:opacity-50"
            type="button"
            disabled={busy || !message.trim()}
            onClick={() => send(undefined, true)}
          >
            Chuyển chuyên viên
          </button>
        </div>
        <Notice error={error} />
      </form>
    </section>
  );
}
