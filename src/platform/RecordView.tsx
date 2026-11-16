import React from 'react';
import type { Assessment, simulate, roadmap } from './domain';
import { card, Curve, Format } from './ui';
export type Stored = {
  id: string;
  kind: 'assessment' | 'roi' | 'roadmap';
  created_at: string;
  input: unknown;
  result: any;
};
export default function RecordView({
  record,
}: {
  record: Pick<Stored, 'kind' | 'result'>;
}) {
  if (record.kind === 'assessment') {
    const r = record.result as Assessment;
    if (!r?.gaps || !r.matches) return <p>Báo cáo không hợp lệ.</p>;
    return (
      <div className="space-y-4">
        <article className={card}>
          <h3 className="text-xl font-bold">Kết quả đánh giá</h3>
          <p className="my-3">{r.summary}</p>
          <p className="text-xs font-semibold">
            {r.ai?.mode === 'gemini'
              ? 'Diễn giải Gemini — cần kiểm chứng'
              : 'Diễn giải theo quy tắc'}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm">{r.ai?.text}</p>
        </article>
        <article className={card}>
          <h3 className="font-bold">Điểm nghẽn ưu tiên</h3>
          {r.gaps.length ? (
            r.gaps.map((g) => (
              <div key={g.code} className="mt-3">
                <p className="font-semibold">
                  {g.code} · {g.title}
                </p>
                <p className="text-sm">{g.action}</p>
                <p className="text-xs text-slate-500">
                  Tài liệu tham chiếu: {g.sources.join('; ')}
                </p>
              </div>
            ))
          ) : (
            <p>Không có nhóm dưới 80/100; chưa đề xuất điểm nghẽn.</p>
          )}
        </article>
        <article className={card}>
          <h3 className="font-bold">Giải pháp phù hợp ({r.matches.length})</h3>
          {!r.matches.length && (
            <p className="mt-2 text-sm">
              Chưa có giải pháp qua mọi điều kiện. Không tự nới bộ lọc; hãy
              chuyển chuyên viên.
            </p>
          )}
          {r.matches.map((m) => (
            <div className="mt-4 border-t pt-3" key={m.id}>
              <h4 className="font-bold">
                {m.name} · {m.score}/100
              </h4>
              <p className="text-sm">
                {m.provider} · {m.price}
              </p>
              <p className="text-sm">{m.reasons.join(' • ')}</p>
              <p className="text-xs text-slate-500">
                Nhu cầu {m.breakdown.gap}/40 · nguồn lực {m.breakdown.readiness}
                /20 · ngân sách {m.breakdown.budget}/20 · trưởng thành{' '}
                {m.breakdown.maturity}/20
              </p>
              <p className="mt-2 text-sm text-amber-800">
                {m.limitations.join(' ')}
              </p>
            </div>
          ))}
        </article>
        <details className={card}>
          <summary>Giải pháp bị loại ({r.rejected.length})</summary>
          {r.rejected.map((s) => (
            <p className="mt-2 text-sm" key={s.id}>
              {s.name}: {s.reasons.join('; ')}
            </p>
          ))}
        </details>
      </div>
    );
  }
  if (record.kind === 'roi') {
    const r = record.result as ReturnType<typeof simulate>;
    if (!r?.scenarios) return <p>Mô phỏng không hợp lệ.</p>;
    return (
      <article className={`${card} space-y-4`}>
        <h3 className="text-xl font-bold">Mô phỏng tài chính · {r.unit}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>Kịch bản</th>
                <th>ROI</th>
                <th>NPV</th>
                <th>Hoàn vốn (tháng)</th>
              </tr>
            </thead>
            <tbody>
              {r.scenarios.map((s) => (
                <tr key={s.name} className="border-t">
                  <td className="py-3">{s.name}</td>
                  <td>
                    <Format value={s.roi} />%
                  </td>
                  <td>
                    <Format value={s.npv} />
                  </td>
                  <td>
                    {s.payback === null ? (
                      'Chưa hoàn vốn trong kỳ'
                    ) : (
                      <Format value={s.payback} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">Dòng tiền lũy kế kịch bản cơ sở (triệu VNĐ)</p>
        <Curve
          label="Dòng tiền lũy kế theo tháng"
          values={r.scenarios[1].flows.map((f) => f.cumulative)}
        />
        <p className="text-sm text-amber-800">{r.limitations}</p>
      </article>
    );
  }
  const r = record.result as ReturnType<typeof roadmap>;
  if (!r?.phases) return <p>Lộ trình không hợp lệ.</p>;
  return (
    <article className={`${card} space-y-4`}>
      <h3 className="text-xl font-bold">
        Lộ trình dự kiến · {r.totalWeeks} tuần
      </h3>
      <p className="text-sm">
        Trạng thái:{' '}
        {r.status === 'proposed'
          ? 'Đề xuất, cần phê duyệt'
          : 'Cần chuẩn bị nguồn lực'}{' '}
        · Năng lực nhóm: {r.capacity} giờ/tuần
      </p>
      {r.blockers.map((b) => (
        <p
          key={b}
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
        >
          {b}
        </p>
      ))}
      {r.phases.map((p, i) => (
        <section key={p.title} className="border-l-4 border-blue-200 pl-4">
          <h4 className="font-bold">
            {i + 1}. {p.title}
          </h4>
          <p className="text-xs text-slate-500">
            {p.start} → {p.end} · {p.weeks} tuần · {p.owner}
          </p>
          <p className="mt-1 text-sm">{p.goal}</p>
        </section>
      ))}
      <p className="text-sm text-slate-600">{r.limitations}</p>
    </article>
  );
}
