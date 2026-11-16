import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { api, requireSupabase } from "../../lib/supabase";
import {
  questionsFor,
  makeRoadmap,
  simulateRoi,
  type DiagnosticInput,
  type DiagnosticResult,
} from "../../lib/diagnostic";
import { field, primary, panel } from "./styles";
type Profile = {
  id: string;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  status: string;
  full_name: string;
  company_name: string;
};
type Assessment = { id: string; created_at: string; result: DiagnosticResult };
const initial: DiagnosticInput = {
  branch: "VT",
  scale: "nho",
  budget: 100,
  people: 3,
  data: 3,
  leadership: 3,
  answers: {},
  baseline: { name: "Tỷ lệ giao đúng hạn", value: 0, unit: "%" },
};
function errorText(e: unknown) {
  return e instanceof Error
    ? e.message
    : String((e as { message?: string })?.message || "Không thể lưu dữ liệu.");
}
export function PlatformPage({ session }: { session: Session }) {
  const [profile, setProfile] = useState<Profile | null>(null),
    [tab, setTab] = useState("diagnostic"),
    [error, setError] = useState(""),
    [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    requireSupabase()
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error.message);
        else {
          setProfile(data);
          if (data.role === "ADMIN") setTab("knowledge");
          if (data.role === "SELLER") setTab("tickets");
        }
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [session.user.id]);
  const admin = profile?.role === "ADMIN";
  const tabs = admin
    ? [
        ["knowledge", "Quản lý tri thức"],
        ["tickets", "Quản lý yêu cầu"],
        ["users", "Quản lý tài khoản"],
        ["audit", "Nhật ký quản trị"],
      ]
    : profile?.role === "SELLER"
      ? [["tickets", "Yêu cầu CSKH"]]
      : [
          ["diagnostic", "Diagnostic & Matching"],
          ["roadmap", "Lộ trình & nguồn lực"],
          ["roi", "Mô phỏng ROI"],
          ["kpi", "Lịch sử KPI & cảnh báo"],
          ["tickets", "Yêu cầu CSKH"],
        ];
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b p-4 flex flex-wrap gap-4 items-center justify-between">
        <Link to="/" className="font-bold text-xl text-blue-700">
          POLYMATCH
        </Link>
        <p>
          {profile?.company_name} · {profile?.role}
        </p>
        <button
          onClick={async () => {
            await requireSupabase().auth.signOut();
          }}
          className="border rounded px-3 py-2"
        >
          Đăng xuất
        </button>
      </header>
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Không gian làm việc</h1>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        {!ready ? (
          <p>Đang tải hồ sơ…</p>
        ) : profile?.status === "locked" ? (
          <p>Tài khoản đã khóa. Vui lòng liên hệ quản trị viên.</p>
        ) : !profile ? (
          <p>Chưa có hồ sơ. Kiểm tra migration Supabase và trigger đăng ký.</p>
        ) : (
          <>
            {profile.status === "pending" && (
              <p className="bg-amber-50 p-4 rounded">
                Hồ sơ nhà cung cấp đang chờ quản trị viên duyệt. Bạn có thể gửi
                yêu cầu CSKH.
              </p>
            )}
            <nav aria-label="Chức năng" className="flex gap-2 flex-wrap">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  aria-current={tab === id ? "page" : undefined}
                  onClick={() => setTab(id)}
                  className={`rounded-lg px-4 py-2 border ${tab === id ? "bg-blue-700 text-white" : "bg-white"}`}
                >
                  {label}
                </button>
              ))}
            </nav>
            {tab === "diagnostic" && <Diagnostic userId={session.user.id} />}
            {tab === "roadmap" && <Roadmap userId={session.user.id} />}
            {tab === "roi" && <Roi />}
            {tab === "kpi" && <Kpi userId={session.user.id} />}
            {tab === "tickets" && (
              <Tickets userId={session.user.id} admin={admin} />
            )}
            {tab === "knowledge" && admin && (
              <Knowledge userId={session.user.id} />
            )}
            {tab === "users" && admin && <Users />}
            {tab === "audit" && admin && <Audit />}
          </>
        )}
      </main>
    </div>
  );
}
function Diagnostic({ userId }: { userId: string }) {
  const [input, setInput] = useState<DiagnosticInput>(initial),
    [history, setHistory] = useState<Assessment[]>([]),
    [selected, setSelected] = useState<Assessment | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    Promise.all([
      requireSupabase()
        .from("enterprises")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle(),
      requireSupabase()
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30),
    ]).then(([p, h]) => {
      if (!alive) return;
      if (p.error || h.error) setMessage((p.error || h.error)!.message);
      if (p.data) setInput(p.data.data);
      setHistory(h.data || []);
      setSelected(h.data?.[0] || null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [userId]);
  function change<K extends keyof DiagnosticInput>(
    k: K,
    v: DiagnosticInput[K],
  ) {
    setInput((prev) => ({ ...prev, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const { error } = await requireSupabase().from("enterprises").upsert({
        user_id: userId,
        data: input,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      const result = await api<Assessment>("diagnostic", input);
      setSelected(result);
      setHistory((prev) => [result, ...prev]);
      setMessage("Đã lưu đánh giá và giải thích kết quả.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <p>Đang tải đánh giá…</p>;
  return (
    <div className="space-y-6">
      <form onSubmit={submit} className={panel}>
        <h2 className="text-xl font-bold">Hồ sơ, KPI đầu vào & đánh giá</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <label>
            Loại hình
            <select
              className={field}
              value={input.branch}
              onChange={(e) =>
                setInput({
                  ...input,
                  branch: e.target.value as DiagnosticInput["branch"],
                  answers: {},
                })
              }
            >
              {[
                ["VT", "Vận tải"],
                ["KB", "Kho bãi"],
                ["FF", "Giao nhận quốc tế"],
                ["3PL", "3PL"],
                ["LM", "Giao hàng cuối"],
                ["KH", "Khác"],
              ].map(([id, t]) => (
                <option key={id} value={id}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quy mô
            <select
              className={field}
              value={input.scale}
              onChange={(e) =>
                change("scale", e.target.value as DiagnosticInput["scale"])
              }
            >
              {[
                ["sieu_nho", "Siêu nhỏ"],
                ["nho", "Nhỏ"],
                ["vua", "Vừa"],
                ["lon", "Lớn"],
              ].map(([id, t]) => (
                <option key={id} value={id}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ngân sách 12 tháng (triệu đồng)
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              className={field}
              value={input.budget}
              onChange={(e) => change("budget", e.target.valueAsNumber)}
            />
          </label>
          {(
            [
              ["people", "Sẵn sàng nhân sự"],
              ["data", "Sẵn sàng dữ liệu"],
              ["leadership", "Cam kết lãnh đạo"],
            ] as const
          ).map(([id, label]) => (
            <label key={id}>
              {label}
              <select
                className={field}
                value={input[id]}
                onChange={(e) => change(id, Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}/5
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Tên KPI gốc
            <input
              required
              maxLength={200}
              className={field}
              value={input.baseline.name}
              onChange={(e) =>
                change("baseline", { ...input.baseline, name: e.target.value })
              }
            />
          </label>
          <label>
            Giá trị hiện tại
            <input
              required
              min="0"
              type="number"
              step="any"
              className={field}
              value={input.baseline.value}
              onChange={(e) =>
                change("baseline", {
                  ...input.baseline,
                  value: e.target.valueAsNumber,
                })
              }
            />
          </label>
          <label>
            Đơn vị
            <input
              required
              maxLength={30}
              className={field}
              value={input.baseline.unit}
              onChange={(e) =>
                change("baseline", { ...input.baseline, unit: e.target.value })
              }
            />
          </label>
        </div>
        <p className="text-sm text-slate-500">
          Trả lời đủ câu hỏi. Điểm được tính trên máy chủ; câu bỏ trống không
          được tự điền điểm.
        </p>
        {questionsFor(input.branch).map((q, i) => (
          <label key={q.id} className="block border-t pt-3">
            {i + 1}. {q.tieu_de}
            <select
              required
              className={field}
              value={input.answers[q.id] ?? ""}
              onChange={(e) =>
                change("answers", {
                  ...input.answers,
                  [q.id]: Number(e.target.value),
                })
              }
            >
              <option value="">Chọn mức phù hợp</option>
              {q.phuong_an.map((o) => (
                <option key={o.muc} value={o.muc}>
                  {o.muc}. {o.noi_dung}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button disabled={busy} className={primary}>
          {busy ? "Đang chẩn đoán…" : "Lưu & chẩn đoán"}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
      <section className={panel}>
        <h2 className="font-bold text-xl">Lịch sử đánh giá</h2>
        {!history.length ? (
          <p>Chưa có đánh giá.</p>
        ) : (
          <select
            aria-label="Chọn lần đánh giá"
            className={field}
            value={selected?.id || ""}
            onChange={(e) =>
              setSelected(history.find((h) => h.id === e.target.value) || null)
            }
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {new Date(h.created_at).toLocaleString("vi-VN")} · DBI{" "}
                {h.result.dbi} · LDMI {h.result.ldmi}
              </option>
            ))}
          </select>
        )}
        {selected && (
          <>
            <p className="whitespace-pre-wrap">
              {selected.result.interpretation}
            </p>
            <h3 className="font-bold">Khoảng trống ưu tiên</h3>
            {selected.result.gaps.map((g) => (
              <div key={g.id} className="border rounded p-3">
                <b>{g.title}</b>
                <p>{g.next}</p>
                <p>KPI: {g.kpi}</p>
              </div>
            ))}
            <h3 className="font-bold">Matching & lý do</h3>
            <p className="text-sm">
              Danh mục giải pháp kế thừa là dữ liệu tham khảo, cần xác minh giá
              và năng lực trước mua sắm. Giá tối thiểu trong danh mục đã quy đổi
              theo 12 tháng.
            </p>
            {!selected.result.matches.length && (
              <p>
                Không có giải pháp đáp ứng bộ lọc. Điều chỉnh nguồn lực hoặc
                ngân sách sau khi trao đổi với chuyên viên.
              </p>
            )}
            {selected.result.matches.map((m) => (
              <article className="border rounded p-4 space-y-2" key={m.id}>
                <h4 className="font-bold">
                  {m.title} · {m.score}/100
                </h4>
                <p>{m.reasons.join(" ")}</p>
                <p className="text-sm">
                  Điểm thành phần:{" "}
                  {Object.entries(m.breakdown)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")}
                </p>
                <p>Nguồn lực: {m.resources.join("; ")}</p>
                <p className="text-amber-800 text-sm">{m.caveats.join(" ")}</p>
              </article>
            ))}
            <details>
              <summary>
                Giải pháp bị loại ({selected.result.excluded.length})
              </summary>
              {selected.result.excluded.map((m) => (
                <p key={m.id}>
                  {m.title}: {m.reasons.join(" ")}
                </p>
              ))}
            </details>
          </>
        )}
      </section>
    </div>
  );
}
function Roadmap({ userId }: { userId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null),
    [saved, setSaved] = useState<any[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([
      requireSupabase()
        .from("assessments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1),
      requireSupabase()
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
      const { data, error } = await requireSupabase()
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
function Roi() {
  const [values, setValues] = useState({
    initial: 100,
    monthlyCost: 5,
    monthlyBenefit: 15,
    months: 36,
    discount: 10,
  });
  let scenarios: ReturnType<typeof simulateRoi> = [],
    error = "";
  try {
    scenarios = simulateRoi(
      values.initial,
      values.monthlyCost,
      values.monthlyBenefit,
      values.months,
      values.discount,
    );
  } catch (e) {
    error = errorText(e);
  }
  return (
    <section className={panel}>
      <h2 className="text-xl font-bold">Mô phỏng tài chính</h2>
      <p>
        Đơn vị: triệu đồng. Lợi ích là tổng tiền tiết kiệm hoặc lợi nhuận tăng
        thêm, chưa trừ chi phí vận hành công nghệ. Ba kịch bản thay đổi lợi ích
        ±30%, giữ chi phí cố định.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {(
          [
            ["initial", "Đầu tư ban đầu"],
            ["monthlyCost", "Chi phí mỗi tháng"],
            ["monthlyBenefit", "Lợi ích mỗi tháng"],
            ["months", "Số tháng (1–120)"],
            ["discount", "Chiết khấu năm (%)"],
          ] as const
        ).map(([k, t]) => (
          <label key={k}>
            {t}
            <input
              type="number"
              min={k === "months" ? 1 : 0}
              max={k === "months" ? 120 : k === "discount" ? 100 : undefined}
              step={k === "months" ? 1 : "any"}
              value={values[k]}
              onChange={(e) =>
                setValues({ ...values, [k]: e.target.valueAsNumber })
              }
              className={field}
            />
          </label>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["Kịch bản", "ROI kỳ mô phỏng", "NPV", "Hoàn vốn"].map((t) => (
                <th key={t} className="p-3">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.name}>
                <td className="p-3">{s.name}</td>
                <td>
                  {s.roi === null ? "Không xác định" : `${s.roi.toFixed(1)}%`}
                </td>
                <td>{s.npv.toFixed(2)}</td>
                <td>
                  {s.payback === null
                    ? "Chưa hoàn vốn trong kỳ"
                    : `${s.payback} tháng`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details>
        <summary>Dòng tiền kịch bản cơ sở (triệu đồng)</summary>
        <div className="max-h-64 overflow-auto">
          {scenarios[1]?.cashflows.map((c) => (
            <p key={c.month}>
              Tháng {c.month}: {c.cash.toFixed(2)} · Lũy kế{" "}
              {c.cumulative.toFixed(2)}
            </p>
          ))}
        </div>
      </details>
      <p className="text-sm text-slate-500">
        Mô phỏng theo giả định tự nhập, chưa tính thuế, lạm phát hoặc giá trị
        thanh lý; không phải cam kết hiệu quả đầu tư.
      </p>
    </section>
  );
}
function Kpi({ userId }: { userId: string }) {
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
    const { data, error } = await requireSupabase()
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
      const { error } = await requireSupabase()
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
function Tickets({ userId, admin }: { userId: string; admin: boolean }) {
  const [rows, setRows] = useState<any[]>([]),
    [question, setQuestion] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    let query = requireSupabase()
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
      const { error } = await requireSupabase()
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
      const { error } = await requireSupabase()
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
function Knowledge({ userId }: { userId: string }) {
  const [rows, setRows] = useState<any[]>([]),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<any | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    const { data, error } = await requireSupabase()
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
      const { error } = await requireSupabase()
        .from("knowledge_documents")
        .update({
          title: selected.title,
          content: selected.content,
          source: selected.source,
          status: selected.status,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
      if (error) throw error;
      await load();
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
function Users() {
  const [rows, setRows] = useState<Profile[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    requireSupabase()
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setRows(data || []);
      });
  }, []);
  async function save(p: Profile) {
    setBusy(true);
    try {
      const { error } = await requireSupabase()
        .from("profiles")
        .update({ status: p.status })
        .eq("id", p.id);
      if (error) throw error;
      setMessage("Đã cập nhật trạng thái tài khoản.");
    } catch (e) {
      setMessage(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panel}>
      <h2 className="font-bold text-xl">Tài khoản & duyệt nhà cung cấp</h2>
      {rows.map((p) => (
        <div
          key={p.id}
          className="border rounded p-3 flex flex-wrap gap-3 items-center"
        >
          <span className="grow">
            {p.email} · {p.company_name} · {p.role}
          </span>
          <select
            aria-label={`Trạng thái ${p.email}`}
            className="border p-2"
            value={p.status}
            onChange={(e) =>
              setRows(
                rows.map((x) =>
                  x.id === p.id ? { ...x, status: e.target.value } : x,
                ),
              )
            }
          >
            <option value="active">Hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="locked">Khóa</option>
          </select>
          <button disabled={busy} onClick={() => save(p)} className={primary}>
            Lưu
          </button>
        </div>
      ))}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
function Audit() {
  const [rows, setRows] = useState<any[]>([]),
    [message, setMessage] = useState("");
  useEffect(() => {
    requireSupabase()
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
