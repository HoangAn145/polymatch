import React, { useState } from 'react';
import {
  BRANCHES,
  SCALES,
  questions,
  applicable,
  KPIS,
  type KpiCode,
} from './domain';
import { request } from './client';
import RecordView, { type Stored } from './RecordView';
import { card, input, button, Field, Notice } from './ui';
export default function Diagnostic({ onSaved }: { onSaved: () => void }) {
  const [branch, setBranch] = useState('VT'),
    [scale, setScale] = useState('nho'),
    [budget, setBudget] = useState(100),
    [readiness, setReadiness] = useState(3),
    [answers, setAnswers] = useState<Record<string, number>>({}),
    [values, setValues] = useState<Partial<Record<KpiCode, number>>>({}),
    [targets, setTargets] = useState<Partial<Record<KpiCode, number>>>({}),
    [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)),
    [source, setSource] = useState(''),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [record, setRecord] = useState<Stored | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setRecord(null);
    try {
      const r = await request('assessment', {
        consent,
        input: {
          branch,
          scale,
          budget,
          readiness,
          answers,
          kpis: applicable(branch).map((code) => ({
            code,
            value: values[code],
            target: targets[code],
            period,
            source,
          })),
        },
      });
      setRecord({ ...r, kind: 'assessment' });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold">Diagnostic & Matching</h2>
      <form className={`${card} space-y-5`} onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ngành">
            <select
              className={input}
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                setAnswers({});
                setValues({});
                setTargets({});
              }}
            >
              {BRANCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
          <Field label="Quy mô">
            <select
              className={input}
              value={scale}
              onChange={(e) => setScale(e.target.value)}
            >
              {SCALES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Ngân sách năm (triệu VNĐ)">
            <input
              className={input}
              required
              type="number"
              min="0.01"
              max="100000"
              step=".01"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </Field>
          <Field label="Sẵn sàng nguồn lực (1–5)">
            <input
              className={input}
              required
              type="number"
              min="1"
              max="5"
              value={readiness}
              onChange={(e) => setReadiness(Number(e.target.value))}
            />
          </Field>
        </div>
        <fieldset className="space-y-4">
          <legend className="font-bold">KPI đầu vào và mục tiêu tự đặt</legend>
          <p className="text-sm text-slate-500">
            Chỉ nhập KPI áp dụng cho ngành. Thu thập trước nếu thiếu dữ liệu;
            không dùng 0 để thay thế. Mục tiêu không phải benchmark do hệ thống
            xác nhận.
          </p>
          {applicable(branch).map((code) => (
            <div key={branch + code} className="grid gap-3 sm:grid-cols-2">
              <Field label={`${KPIS[code].label} (%)`}>
                <input
                  className={input}
                  type="number"
                  required
                  min="0"
                  max="100"
                  step=".01"
                  value={values[code] ?? ''}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [code]:
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label={`Mục tiêu ${KPIS[code].label} (%)`}>
                <input
                  className={input}
                  type="number"
                  required
                  min="0"
                  max="100"
                  step=".01"
                  value={targets[code] ?? ''}
                  onChange={(e) =>
                    setTargets({
                      ...targets,
                      [code]:
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
          ))}
          <Field label="Kỳ đo">
            <input
              className={input}
              type="month"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </Field>
          <Field label="Nguồn đối soát">
            <input
              className={input}
              required
              maxLength={300}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </Field>
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="font-bold">
            Câu hỏi năng lực ({Object.keys(answers).length}/
            {questions(branch).length})
          </legend>
          {questions(branch).map((q, i) => (
            <Field key={q.id} label={`${i + 1}. ${q.tieu_de}`}>
              <select
                className={input}
                required
                value={answers[q.id] || ''}
                onChange={(e) =>
                  setAnswers({ ...answers, [q.id]: Number(e.target.value) })
                }
              >
                <option value="">Chọn mức phù hợp</option>
                {q.phuong_an.map((o) => (
                  <option key={o.muc} value={o.muc}>
                    {o.muc} — {o.noi_dung}
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </fieldset>
        <label className="flex gap-3 text-sm">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          Tôi đồng ý gửi câu trả lời và KPI tới hệ thống và Gemini nếu được cấu
          hình để diễn giải. Không nhập thông tin cá nhân nhạy cảm. Đây là dữ
          liệu tự khai, cần đối soát.
        </label>
        <button className={button} disabled={busy || !consent}>
          {busy ? 'Đang xử lý…' : 'Đánh giá & lưu'}
        </button>
        <Notice error={error} />
      </form>
      {record && <RecordView record={record} />}
    </section>
  );
}
