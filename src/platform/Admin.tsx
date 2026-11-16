import React, { useEffect, useState } from 'react';
import { supabase, query } from './client';
import { card, input, button, Field, Notice } from './ui';
type Row = Record<string, any>;
const TABLES = {
  pm_knowledge: 'Tri thức chatbot',
  pm_tickets: 'Yêu cầu hỗ trợ',
  pm_profiles: 'Tài khoản',
  pm_solutions: 'Danh mục giải pháp',
  pm_reference: 'Nguồn & mẫu CSKH',
};
export default function Admin({ userId }: { userId: string }) {
  const [table, setTable] = useState<keyof typeof TABLES>('pm_knowledge'),
    [rows, setRows] = useState<Row[]>([]),
    [page, setPage] = useState(0),
    [more, setMore] = useState(false),
    [draft, setDraft] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0),
    [fresh, setFresh] = useState({
      title: '',
      content: '',
      url: '',
      kind: 'knowledge',
    });
  useEffect(() => {
    let live = true;
    setBusy(true);
    setError('');
    void (async () => {
      try {
        let q = supabase!
          .from(table)
          .select('*')
          .order(table === 'pm_reference' ? 'external_id' : 'id')
          .range(page * 25, page * 25 + 25);
        if (table === 'pm_knowledge' && draft) q = q.eq('published', false);
        const data = await query(q);
        if (live) {
          setRows((data || []).slice(0, 25));
          setMore((data || []).length > 25);
        }
      } catch (e) {
        if (live) setError((e as Error).message);
      } finally {
        if (live) setBusy(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [table, page, draft, revision]);
  async function change(row: Row, payload: Row) {
    setBusy(true);
    setError('');
    try {
      await query(
        supabase!
          .from(table)
          .update(payload)
          .eq(
            table === 'pm_reference' ? 'external_id' : 'id',
            row.id || row.external_id,
          ),
      );
      setRevision((n) => n + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function edit(id: string, key: string, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await query(
        supabase!
          .from('pm_knowledge')
          .insert({ ...fresh, url: fresh.url || null, published: false }),
      );
      setFresh({ title: '', content: '', url: '', kind: 'knowledge' });
      setRevision((n) => n + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Quản trị</h2>
      <p className="text-sm text-slate-600">
        Kiểm tra nguồn, giá và nội dung trước khi xuất bản. Bản nháp không được
        chatbot sử dụng. Trạng thái trong file nguồn chỉ là dữ liệu tham khảo,
        không tự tạo chính sách hay cam kết.
      </p>
      <Field label="Nhóm quản trị">
        <select
          className={input}
          value={table}
          onChange={(e) => {
            setTable(e.target.value as keyof typeof TABLES);
            setPage(0);
            setRows([]);
          }}
        >
          {Object.entries(TABLES).map(([t, l]) => (
            <option key={t} value={t}>
              {l}
            </option>
          ))}
        </select>
      </Field>
      {table === 'pm_knowledge' && (
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => {
              setDraft(e.target.checked);
              setPage(0);
            }}
          />
          Chỉ bản nháp
        </label>
      )}
      <Notice error={error} />
      {busy && <p role="status">Đang tải/lưu…</p>}
      {!busy && !rows.length && <p className={card}>Không có mục phù hợp.</p>}
      {rows.map((r) => (
        <article key={r.id || r.external_id} className={card}>
          {table === 'pm_knowledge' ? (
            <details>
              <summary className="cursor-pointer font-semibold">
                {r.external_id || 'Nội dung mới'} · {r.title} ·{' '}
                {r.published ? 'Đã xuất bản' : r.review_status}
              </summary>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void change(r, {
                    title: r.title,
                    content: r.content,
                    url: r.url || null,
                    published: true,
                    review_status: 'Đã duyệt',
                    updated_at: new Date().toISOString(),
                  });
                }}
              >
                <Field label="Tiêu đề">
                  <input
                    className={input}
                    required
                    maxLength={300}
                    value={r.title}
                    onChange={(e) => edit(r.id, 'title', e.target.value)}
                  />
                </Field>
                <Field label="Nội dung tri thức">
                  <textarea
                    className={input + ' min-h-48'}
                    required
                    maxLength={15000}
                    value={r.content}
                    onChange={(e) => edit(r.id, 'content', e.target.value)}
                  />
                </Field>
                <Field label="URL nguồn">
                  <input
                    className={input}
                    type="url"
                    pattern="https://.*"
                    value={r.url || ''}
                    onChange={(e) => edit(r.id, 'url', e.target.value)}
                  />
                </Field>
                <p className="text-xs text-slate-500">
                  Nguồn khác:{' '}
                  {(r.source_references || []).join('; ') || 'Chưa có URL'}
                </p>
                <details>
                  <summary className="cursor-pointer text-sm">
                    Dữ liệu gốc và provenance
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(r.metadata, null, 2)}
                  </pre>
                </details>
                <div className="flex flex-wrap gap-3">
                  <button className={button} disabled={busy}>
                    Xác nhận đã kiểm chứng & xuất bản
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2 text-sm"
                    disabled={busy}
                    onClick={() =>
                      change(r, {
                        title: r.title,
                        content: r.content,
                        url: r.url || null,
                        published: false,
                        review_status: 'Bản nháp',
                        updated_at: new Date().toISOString(),
                      })
                    }
                  >
                    Lưu nháp / Ẩn
                  </button>
                </div>
              </form>
            </details>
          ) : table === 'pm_tickets' ? (
            <>
              <h3 className="font-bold">{r.id}</h3>
              <p className="my-2 text-sm">{r.subject}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Trạng thái yêu cầu">
                  <select
                    className={input}
                    disabled={busy}
                    value={r.status}
                    onChange={(e) =>
                      change(r, { status: e.target.value, assigned_to: userId })
                    }
                  >
                    {['open', 'assigned', 'resolved'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Bộ phận xử lý">
                  <select
                    className={input}
                    disabled={busy}
                    value={r.department}
                    onChange={(e) => change(r, { department: e.target.value })}
                  >
                    {['CSKH', 'Kỹ thuật', 'Chuyên môn', 'Tài chính'].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </Field>
              </div>
            </>
          ) : table === 'pm_profiles' ? (
            <>
              <h3 className="font-bold">
                {r.full_name || r.id} · {r.company}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Trạng thái tài khoản">
                  <select
                    className={input}
                    value={r.status}
                    disabled={busy || r.id === userId}
                    onChange={(e) => change(r, { status: e.target.value })}
                  >
                    {['active', 'pending', 'locked'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Quyền tài khoản">
                  <select
                    className={input}
                    value={r.role}
                    disabled={busy || r.id === userId}
                    onChange={(e) => change(r, { role: e.target.value })}
                  >
                    {['BUYER', 'SELLER', 'ADMIN'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </>
          ) : table === 'pm_solutions' ? (
            <>
              <h3 className="font-bold">{r.data.ten}</h3>
              <p className="my-2 text-sm">
                {r.approved && r.published
                  ? 'Đã duyệt và xuất bản'
                  : 'Bản nháp'}{' '}
                · Nguồn: {r.data.trang_thai_nguon}
              </p>
              <p className="mb-3 text-xs text-slate-500">
                Dữ liệu nguồn tham khảo cần được kiểm chứng độc lập; chỉ duyệt
                sau khi xác nhận giá, phạm vi và nhà cung cấp.
              </p>
              <details>
                <summary className="cursor-pointer text-sm">
                  Chi tiết giải pháp
                </summary>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              </details>
              <button
                className={button + ' mt-3'}
                disabled={busy}
                onClick={() => {
                  const active = !(r.approved && r.published);
                  void change(r, { approved: active, published: active });
                }}
              >
                {r.approved && r.published
                  ? 'Ẩn giải pháp'
                  : 'Duyệt & xuất bản'}
              </button>
            </>
          ) : (
            <>
              <h3 className="font-bold">
                {r.external_id} ·{' '}
                {r.category === 'source' ? 'Nguồn tin' : 'Mẫu CSKH'}
              </h3>
              <pre className="mt-3 whitespace-pre-wrap text-xs">
                {JSON.stringify(r.data, null, 2)}
              </pre>
              <p className="mt-2 text-xs text-slate-500">
                Tham khảo, chưa tự kích hoạt crawler hoặc SLA.
              </p>
            </>
          )}
        </article>
      ))}
      <div className="flex gap-4 text-sm">
        <button
          className="rounded border px-3 py-2 disabled:opacity-50"
          disabled={busy || page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Trang trước
        </button>
        <span className="py-2">Trang {page + 1}</span>
        <button
          className="rounded border px-3 py-2 disabled:opacity-50"
          disabled={busy || !more}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang sau
        </button>
      </div>
      {table === 'pm_knowledge' && (
        <form className={`${card} space-y-3`} onSubmit={create}>
          <h3 className="font-bold">Tạo tri thức hoặc tin tức mới</h3>
          <Field label="Tiêu đề mới">
            <input
              className={input}
              required
              maxLength={300}
              value={fresh.title}
              onChange={(e) => setFresh({ ...fresh, title: e.target.value })}
            />
          </Field>
          <Field label="Nội dung mới">
            <textarea
              className={input}
              required
              maxLength={15000}
              value={fresh.content}
              onChange={(e) => setFresh({ ...fresh, content: e.target.value })}
            />
          </Field>
          <Field label="URL nguồn mới">
            <input
              className={input}
              type="url"
              pattern="https://.*"
              value={fresh.url}
              onChange={(e) => setFresh({ ...fresh, url: e.target.value })}
            />
          </Field>
          <Field label="Loại nội dung">
            <select
              className={input}
              value={fresh.kind}
              onChange={(e) => setFresh({ ...fresh, kind: e.target.value })}
            >
              <option value="knowledge">Tri thức RAG</option>
              <option value="news">Tin tức</option>
            </select>
          </Field>
          <button className={button} disabled={busy}>
            Tạo bản nháp
          </button>
        </form>
      )}
    </section>
  );
}
