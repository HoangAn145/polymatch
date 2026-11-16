import React, { useState } from 'react';
import { request } from './client';
import { KPIS, alerts, type Measurement, type KpiCode } from './domain';
import { card, input, button, Field, Notice, Format, Curve } from './ui';
export default function Kpi({
  rows,
  onSaved,
}: {
  rows: Measurement[];
  onSaved: () => void;
}) {
  const [code, setCode] = useState<KpiCode>('otif'),
    [value, setValue] = useState(''),
    [target, setTarget] = useState(''),
    [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)),
    [source, setSource] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await request('kpi', {
        input: {
          code,
          value: Number(value),
          target: Number(target),
          period,
          source,
        },
      });
      setNotice('Đã lưu KPI. Cùng chỉ số và kỳ đo sẽ cập nhật số đo hiện tại.');
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const series = rows
    .filter((r) => r.code === code)
    .sort((a, b) => a.period.localeCompare(b.period));
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">KPI & cảnh báo</h2>
      <p className="text-sm text-slate-600">
        Cảnh báo so với mục tiêu doanh nghiệp tự nhập; chưa phải benchmark
        ngành. Số đo của các kỳ khác nhau được giữ lại.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {alerts(rows).map((a) => (
          <article key={a.code} className={card}>
            <h3 className="font-bold">{a.label}</h3>
            <p className="mt-2 text-2xl">
              <Format value={a.latest.value} />%
            </p>
            <p className="text-xs text-slate-500">
              Kỳ {a.latest.period} · Mục tiêu {a.latest.target}%
            </p>
            <p
              className={`mt-2 text-sm ${a.missed ? 'text-red-700' : 'text-emerald-700'}`}
            >
              {a.missed ? 'Chưa đạt mục tiêu tự đặt' : 'Đạt mục tiêu tự đặt'}
            </p>
            <p className="text-sm">
              {a.delta === null
                ? 'Chưa có kỳ trước để so sánh'
                : `${a.delta >= 0 ? '+' : ''}${a.delta.toFixed(2)} điểm % so với kỳ trước${a.worsening ? ' · Xu hướng xấu đi' : ''}`}
            </p>
          </article>
        ))}
      </div>
      <form className={`${card} space-y-4`} onSubmit={submit}>
        <h3 className="font-bold">Ghi nhận hoặc hiệu chỉnh KPI</h3>
        <Field label="Chỉ số">
          <select
            className={input}
            value={code}
            onChange={(e) => setCode(e.target.value as KpiCode)}
          >
            {Object.entries(KPIS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Giá trị (%)">
            <input
              className={input}
              required
              type="number"
              min="0"
              max="100"
              step=".01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Field>
          <Field label="Mục tiêu (%)">
            <input
              className={input}
              required
              type="number"
              min="0"
              max="100"
              step=".01"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </Field>
          <Field label="Kỳ đo">
            <input
              className={input}
              required
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Nguồn số liệu">
          <input
            className={input}
            required
            maxLength={300}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </Field>
        <button className={button} disabled={busy}>
          {busy ? 'Đang lưu…' : 'Lưu KPI'}
        </button>
        <Notice error={error} />
        {notice && (
          <p role="status" className="text-sm text-emerald-800">
            {notice}
          </p>
        )}
      </form>
      <article className={card}>
        <h3 className="font-bold">Lịch sử {KPIS[code].label}</h3>
        {!series.length ? (
          <p>Chưa có số đo.</p>
        ) : (
          <>
            <Curve
              label={`Lịch sử ${KPIS[code].label}`}
              values={series.map((r) => r.value)}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th>Kỳ đo</th>
                    <th>Giá trị</th>
                    <th>Mục tiêu</th>
                    <th>Nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((r) => (
                    <tr key={r.period} className="border-t">
                      <td className="py-3">{r.period}</td>
                      <td>{r.value}%</td>
                      <td>{r.target}%</td>
                      <td>{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </article>
    </section>
  );
}
