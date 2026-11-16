import React, { useState } from 'react';
import { request } from './client';
import RecordView, { type Stored } from './RecordView';
import { card, input, button, Field, Notice } from './ui';
export default function Planning({
  records,
  onSaved,
}: {
  records: Stored[];
  onSaved: () => void;
}) {
  const [mode, setMode] = useState('roadmap'),
    [assessmentId, setAssessmentId] = useState(''),
    [solutionId, setSolutionId] = useState(''),
    [people, setPeople] = useState(1),
    [hours, setHours] = useState(20),
    [budget, setBudget] = useState(100),
    [data, setData] = useState(3),
    [start, setStart] = useState(new Date().toISOString().slice(0, 10)),
    [roi, setRoi] = useState({
      initial: 50,
      monthlyCost: 4.5,
      monthlySavings: 10,
      months: 24,
      annualDiscount: 10,
      rampMonths: 3,
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [result, setResult] = useState<Stored | null>(null);
  const assessments = records.filter((r) => r.kind === 'assessment'),
    selected = assessments.find((r) => r.id === assessmentId);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const r = await request(mode, {
        input:
          mode === 'roi'
            ? roi
            : {
                assessmentId,
                solutionId,
                people,
                hoursPerWeek: hours,
                budget,
                dataReadiness: data,
                startDate: start,
              },
      });
      setResult({ ...r, kind: mode });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Roadmap & ROI</h2>
      <div className="flex gap-3">
        {[
          ['roadmap', 'Tạo lộ trình'],
          ['roi', 'Mô phỏng tài chính'],
        ].map(([key, label]) => (
          <button
            className={
              mode === key
                ? button
                : 'rounded-lg border bg-white px-4 py-2 text-sm'
            }
            key={key}
            onClick={() => {
              setMode(key);
              setResult(null);
              setError('');
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className={`${card} space-y-4`}>
        {mode === 'roadmap' ? (
          <>
            <p className="text-sm text-slate-600">
              Chọn đánh giá đã lưu. Hệ thống kiểm tra lại điều kiện giải pháp
              hiện tại, thời gian nhóm và ngân sách; các mốc là đề xuất cần phê
              duyệt.
            </p>
            <Field label="Đánh giá nguồn">
              <select
                className={input}
                required
                value={assessmentId}
                onChange={(e) => {
                  setAssessmentId(e.target.value);
                  setSolutionId('');
                }}
              >
                <option value="">Chọn đánh giá đã lưu</option>
                {assessments.map((r) => (
                  <option key={r.id} value={r.id}>
                    {new Date(r.created_at).toLocaleString('vi-VN')} · {r.id}
                  </option>
                ))}
              </select>
            </Field>
            {!assessments.length && <p>Hãy tạo đánh giá trước.</p>}
            <Field label="Giải pháp dự kiến">
              <select
                className={input}
                value={solutionId}
                onChange={(e) => setSolutionId(e.target.value)}
              >
                <option value="">Chưa chọn / cần chuyên viên</option>
                {(selected?.result.matches || []).map(
                  (s: { id: string; name: string }) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ),
                )}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Nhân sự', people, setPeople, 0, 100],
                ['Giờ mỗi tuần mỗi người', hours, setHours, 0, 60],
                ['Ngân sách năm (triệu VNĐ)', budget, setBudget, 0, 100000],
                ['Sẵn sàng dữ liệu (1–5)', data, setData, 1, 5],
              ].map(([label, value, set, min, max]) => (
                <Field label={label as string} key={label as string}>
                  <input
                    className={input}
                    required
                    type="number"
                    min={min as number}
                    max={max as number}
                    value={value as number}
                    onChange={(e) =>
                      (set as React.Dispatch<React.SetStateAction<number>>)(
                        Number(e.target.value),
                      )
                    }
                  />
                </Field>
              ))}
            </div>
            <Field label="Ngày bắt đầu">
              <input
                className={input}
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Đơn vị tiền: triệu VNĐ. Nhập giả định của doanh nghiệp; không suy
              ra tiết kiệm tự động từ kết quả đánh giá.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ['initial', 'Đầu tư ban đầu', 0.01, 1000000],
                  ['monthlyCost', 'Chi phí vận hành mỗi tháng', 0, 1000000],
                  [
                    'monthlySavings',
                    'Tiết kiệm mỗi tháng khi ổn định',
                    0,
                    1000000,
                  ],
                  ['months', 'Thời hạn (tháng)', 1, 120],
                  ['annualDiscount', 'Chiết khấu năm (%)', 0, 100],
                  ['rampMonths', 'Số tháng làm quen', 0, 24],
                ] as const
              ).map(([key, label, min, max]) => (
                <Field label={label} key={key}>
                  <input
                    className={input}
                    type="number"
                    required
                    min={min}
                    max={max}
                    step={key === 'months' || key === 'rampMonths' ? 1 : 0.01}
                    value={roi[key]}
                    onChange={(e) =>
                      setRoi({ ...roi, [key]: Number(e.target.value) })
                    }
                  />
                </Field>
              ))}
            </div>
          </>
        )}
        <button
          className={button}
          disabled={busy || (mode === 'roadmap' && !assessmentId)}
        >
          {busy
            ? 'Đang tính và lưu…'
            : mode === 'roi'
              ? 'Mô phỏng & lưu'
              : 'Tạo lộ trình & lưu'}
        </button>
        <Notice error={error} />
      </form>
      {result && <RecordView record={result} />}
    </section>
  );
}
