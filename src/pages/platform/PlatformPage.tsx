import React, { useEffect, useState } from "react";
import { featureStore } from "../../lib/featureStore";
import { makeRoadmap, type DiagnosticResult } from "../../lib/diagnostic";
import { field, primary, panel } from "./styles";
type Assessment = { id: string; created_at: string; result: DiagnosticResult };
function errorText(e: unknown) {
  return e instanceof Error
    ? e.message
    : String((e as { message?: string })?.message || "Không thể lưu dữ liệu.");
}
export function Roadmap({ userId }: { userId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null),
    [saved, setSaved] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([
      featureStore()
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1),
      featureStore()
        .from("roadmaps")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]).then(([a, r]) => {
      setAssessment(a.data?.[0] || null);
      setSaved(r.data || []);
      if (a.error || r.error) setMessage((a.error || r.error)!.message);
    });
  }, [userId]);
  const plan = assessment ? makeRoadmap(assessment.result) : null;
  async function save() {
    if (!assessment || !plan) return;
    setBusy(true);
    try {
      const { data, error } = await featureStore()
        .from("roadmaps")
        .insert({ user_id: userId, assessment_id: assessment.id, data: plan })
        .select()
        .single();
      if (error) throw error;
      setSaved([data, ...saved]);
      setMessage("Đã lưu lộ trình.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panel}>
      <h2 className="text-xl font-bold">Lộ trình triển khai 12 tuần</h2>
      {!plan ? (
        <p>Hoàn thành đánh giá để tạo lộ trình.</p>
      ) : (
        <>
          <p className={plan.ready ? "text-green-700" : "text-amber-800"}>
            {plan.ready
              ? "Nguồn lực tự khai đạt điều kiện để lập kế hoạch thử nghiệm."
              : "Cần xử lý điều kiện nguồn lực trước thử nghiệm."}
          </p>
          {plan.blockers.map((b) => (
            <p key={b}>⚠ {b}</p>
          ))}
          <div className="grid md:grid-cols-3 gap-4">
            {plan.phases.map((p) => (
              <div key={p.weeks} className="border p-4 rounded">
                <h3 className="font-bold">
                  Tuần {p.weeks}: {p.title}
                </h3>
                <ul className="list-disc pl-5">
                  {p.tasks.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className={primary} disabled={busy} onClick={save}>
            Lưu lộ trình
          </button>
        </>
      )}
      {message && <p role="status">{message}</p>}
      <h3 className="font-bold">Lộ trình đã lưu: {saved.length}</h3>
      {saved.map((p) => (
        <details key={p.id}>
          <summary>{new Date(p.created_at).toLocaleString("vi-VN")}</summary>
          {p.data.phases.map((x: any) => (
            <p key={x.weeks}>
              Tuần {x.weeks}: {x.title}
            </p>
          ))}
        </details>
      ))}
    </section>
  );
}

export function Kpi({ userId }: { userId: string }) {
  const [rows, setRows] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [v, setV] = useState({
      name: "Tỷ lệ giao đúng hạn",
      unit: "%",
      value: 0,
      target: 95,
      direction: "higher",
      measured_on: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Bangkok",
      }),
    });
  async function load() {
    const { data, error } = await featureStore()
      .from("kpi_entries")
      .select("*")
      .eq("user_id", userId)
      .order("measured_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setMessage(error.message);
    else setRows(data || []);
  }
  useEffect(() => {
    void load();
  }, [userId]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (!Number.isFinite(v.value) || !Number.isFinite(v.target))
        throw new Error("Nhập số KPI hợp lệ.");
      const { error } = await featureStore()
        .from("kpi_entries")
        .insert({ ...v, user_id: userId });
      if (error) throw error;
      await load();
      setMessage("Đã ghi nhận KPI.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const latest = rows.filter(
      (r, i) =>
        rows.findIndex((x) => x.name === r.name && x.unit === r.unit) === i,
    ),
    alerts = latest.filter((r) =>
      r.direction === "higher" ? r.value < r.target : r.value > r.target,
    );
  return (
    <section className={panel}>
      <h2 className="text-xl font-bold">KPI & cảnh báo</h2>
      <p className="text-amber-800">
        {alerts.length} KPI mới nhất chưa đạt mục tiêu.
      </p>
      {alerts.map((r) => (
        <p key={r.id}>
          ⚠ {r.name}: {r.value}
          {r.unit}, mục tiêu {r.direction === "higher" ? "≥" : "≤"} {r.target}
          {r.unit}
        </p>
      ))}
      <form onSubmit={save} className="grid sm:grid-cols-3 gap-4">
        <label>
          Tên KPI
          <input
            required
            maxLength={200}
            value={v.name}
            onChange={(e) => setV({ ...v, name: e.target.value })}
            className={field}
          />
        </label>
        <label>
          Đơn vị
          <input
            required
            maxLength={30}
            value={v.unit}
            onChange={(e) => setV({ ...v, unit: e.target.value })}
            className={field}
          />
        </label>
        <label>
          Ngày đo
          <input
            required
            type="date"
            value={v.measured_on}
            onChange={(e) => setV({ ...v, measured_on: e.target.value })}
            className={field}
          />
        </label>
        {(["value", "target"] as const).map((k) => (
          <label key={k}>
            {k === "value" ? "Giá trị" : "Mục tiêu"}
            <input
              required
              type="number"
              min="0"
              step="any"
              value={v[k]}
              onChange={(e) => setV({ ...v, [k]: e.target.valueAsNumber })}
              className={field}
            />
          </label>
        ))}
        <label>
          Chiều tốt
          <select
            value={v.direction}
            onChange={(e) => setV({ ...v, direction: e.target.value })}
            className={field}
          >
            <option value="higher">Càng cao càng tốt</option>
            <option value="lower">Càng thấp càng tốt</option>
          </select>
        </label>
        <button disabled={busy} className={primary}>
          Ghi nhận KPI
        </button>
      </form>
      {message && <p role="status">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["Ngày", "KPI", "Giá trị", "Mục tiêu"].map((t) => (
                <th className="p-2" key={t}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-2">{r.measured_on}</td>
                <td>{r.name}</td>
                <td>
                  {r.value} {r.unit}
                </td>
                <td>
                  {r.direction === "higher" ? "≥" : "≤"} {r.target} {r.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p>Chưa có dữ liệu KPI.</p>}
    </section>
  );
}

export function Tickets({ userId, admin }: { userId: string; admin: boolean }) {
  const [rows, setRows] = useState<any[]>([]),
    [question, setQuestion] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    let query = featureStore()
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!admin) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) setMessage(error.message);
    else setRows(data || []);
  }
  useEffect(() => {
    void load();
  }, [userId, admin]);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await featureStore()
        .from("support_tickets")
        .insert({ user_id: userId, question });
      if (error) throw error;
      setQuestion("");
      await load();
      setMessage("Đã gửi yêu cầu.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function update(row: any) {
    setBusy(true);
    try {
      const { error } = await featureStore()
        .from("support_tickets")
        .update({
          status: row.status,
          department: row.department,
          response: row.response,
        })
        .eq("id", row.id);
      if (error) throw error;
      setMessage("Đã cập nhật yêu cầu.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panel}>
      <h2 className="text-xl font-bold">
        {admin ? "Quản lý yêu cầu" : "Yêu cầu CSKH"}
      </h2>
      {!admin && (
        <form onSubmit={create} className="space-y-3">
          <label className="block">
            Nội dung yêu cầu
            <textarea
              required
              maxLength={6000}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={field}
            />
          </label>
          <p className="text-sm">
            Khi gửi, bạn đồng ý chuyển nội dung này tới bộ phận phụ trách. Không
            gửi mật khẩu, OTP hoặc dữ liệu thẻ.
          </p>
          <button disabled={busy} className={primary}>
            Gửi yêu cầu
          </button>
        </form>
      )}
      {message && <p role="status">{message}</p>}
      {!rows.length && <p>Chưa có yêu cầu.</p>}
      {rows.map((r) => (
        <article key={r.id} className="border rounded p-4 space-y-3">
          <p className="text-sm">
            {r.id} · {new Date(r.created_at).toLocaleString("vi-VN")}
          </p>
          <p className="whitespace-pre-wrap">{r.question}</p>
          {admin ? (
            <>
              <label className="block">
                Bộ phận
                <input
                  maxLength={200}
                  value={r.department}
                  onChange={(e) =>
                    setRows(
                      rows.map((x) =>
                        x.id === r.id
                          ? { ...x, department: e.target.value }
                          : x,
                      ),
                    )
                  }
                  className={field}
                />
              </label>
              <label className="block">
                Trạng thái
                <select
                  className={field}
                  value={r.status}
                  onChange={(e) =>
                    setRows(
                      rows.map((x) =>
                        x.id === r.id ? { ...x, status: e.target.value } : x,
                      ),
                    )
                  }
                >
                  {[
                    ["new", "Mới"],
                    ["assigned", "Đang xử lý"],
                    ["resolved", "Đã giải quyết"],
                  ].map(([id, t]) => (
                    <option key={id} value={id}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Phản hồi
                <textarea
                  maxLength={6000}
                  value={r.response}
                  onChange={(e) =>
                    setRows(
                      rows.map((x) =>
                        x.id === r.id ? { ...x, response: e.target.value } : x,
                      ),
                    )
                  }
                  className={field}
                />
              </label>
              <button
                disabled={busy}
                onClick={() => update(r)}
                className={primary}
              >
                Lưu xử lý
              </button>
            </>
          ) : (
            <>
              <p>
                Trạng thái: {r.status} · {r.department}
              </p>
              <p className="whitespace-pre-wrap">
                {r.response || "Chưa có phản hồi từ chuyên viên."}
              </p>
            </>
          )}
        </article>
      ))}
    </section>
  );
}

export function Knowledge({ userId }: { userId: string }) {
  const [rows, setRows] = useState<any[]>([]),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<any | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    const { data, error } = await featureStore()
      .from("knowledge_documents")
      .select("*")
      .order("id")
      .limit(500);
    if (error) setMessage(error.message);
    else setRows(data || []);
  }
  useEffect(() => {
    void load();
  }, []);
  async function save() {
    if (!selected) return;
    setBusy(true);
    try {
      if (
        !selected.title.trim() ||
        !selected.content.trim() ||
        (selected.status === "approved" && !selected.source.trim())
      )
        throw new Error("Cần tiêu đề, nội dung và nguồn trước khi duyệt.");
      const payload = {
        title: selected.title,
        content: selected.content,
        source: selected.source,
        status: selected.status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      };
      const query = featureStore().from("knowledge_documents");
      const { error } = selected._new
        ? await query.insert({ id: selected.id, category: "FAQ", ...payload })
        : await query.update(payload).eq("id", selected.id);
      if (error) throw error;
      await load();
      setSelected({ ...selected, _new: false });
      setMessage("Đã lưu nội dung và trạng thái duyệt.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panel}>
      <h2 className="text-xl font-bold">Tri thức chatbot</h2>
      <button
        className={primary}
        onClick={() => {
          setSelected({
            id: `KB-${crypto.randomUUID()}`,
            title: "",
            content: "",
            source: "",
            status: "pending",
            _new: true,
          });
          setMessage("");
        }}
      >
        Thêm tài liệu
      </button>
      <p>
        Nội dung FAQ, logistics, công nghệ và thị trường được nhập riêng từ
        Excel ở trạng thái chờ duyệt. Chỉ nội dung được duyệt mới được truy xuất
        để trả lời. Các sheet nguồn tin, kiểm thử và chuyển tiếp được giữ trong
        dữ liệu gốc.
      </p>
      <label className="block">
        Tìm tài liệu
        <input
          className={field}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ID hoặc tiêu đề"
        />
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="max-h-[70vh] overflow-auto space-y-2">
          {rows
            .filter((r) =>
              (r.id + " " + r.title)
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelected({ ...r });
                  setMessage("");
                }}
                className={`block w-full text-left p-3 border rounded ${selected?.id === r.id ? "bg-blue-50" : ""}`}
              >
                {r.id} · {r.title}
                <span className="block text-sm text-slate-500">
                  {r.status} · Excel: {r.source_status}
                </span>
              </button>
            ))}
        </div>
        {selected && (
          <div className="space-y-3">
            <h3 className="font-bold">{selected.id}</h3>
            <label className="block">
              Tiêu đề
              <input
                value={selected.title}
                onChange={(e) =>
                  setSelected({ ...selected, title: e.target.value })
                }
                className={field}
              />
            </label>
            <label className="block">
              Nội dung
              <textarea
                rows={12}
                value={selected.content}
                onChange={(e) =>
                  setSelected({ ...selected, content: e.target.value })
                }
                className={field}
              />
            </label>
            <label className="block">
              Nguồn
              <textarea
                value={selected.source}
                onChange={(e) =>
                  setSelected({ ...selected, source: e.target.value })
                }
                className={field}
              />
            </label>
            <label className="block">
              Duyệt
              <select
                value={selected.status}
                onChange={(e) =>
                  setSelected({ ...selected, status: e.target.value })
                }
                className={field}
              >
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </label>
            <button disabled={busy} onClick={save} className={primary}>
              Lưu tài liệu
            </button>
          </div>
        )}
      </div>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

export function Audit() {
  const [rows, setRows] = useState<any[]>([]),
    [message, setMessage] = useState("");
  useEffect(() => {
    featureStore()
      .from("admin_audit")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setRows(data || []);
      });
  }, []);
  return (
    <section className={panel}>
      <h2 className="font-bold text-xl">Nhật ký quản trị</h2>
      {message && <p role="alert">{message}</p>}
      {rows.map((r) => (
        <details key={r.id}>
          <summary>
            {new Date(r.created_at).toLocaleString("vi-VN")} · {r.table_name} ·{" "}
            {r.action} · {r.record_id}
          </summary>
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify(
              { actor: r.actor_id, before: r.before, after: r.after },
              null,
              2,
            )}
          </pre>
        </details>
      ))}
      {!rows.length && <p>Chưa có thay đổi quản trị.</p>}
    </section>
  );
}
