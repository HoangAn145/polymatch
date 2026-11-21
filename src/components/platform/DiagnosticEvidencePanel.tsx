import React from "react";
import type { DiagnosticAnalysis } from "../../lib/diagnosticEvidence";
export function DiagnosticEvidencePanel({
  analysis,
}: {
  analysis?: DiagnosticAnalysis;
}) {
  if (!analysis) return null;
  return (
    <section
      aria-label="Phân tích bằng chứng KPI"
      className="bg-white rounded-2xl border p-5 sm:p-6 space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold">
          Phân tích KPI vận hành & Bằng chứng
        </h2>
        <p className="text-xs text-slate-500">
          {analysis.generatedBy === "gemini"
            ? "Diễn giải Gemini đã kiểm tra cấu trúc và tham chiếu bằng chứng"
            : "Phân tích theo quy tắc; giả thuyết chưa được xác minh"}
        </p>
      </div>
      <p>{analysis.summary}</p>
      {analysis.issues.map((issue) => (
        <article
          key={issue.id}
          className="border rounded-xl p-4 space-y-4"
          data-testid="diagnostic-issue"
        >
          <div>
            <h3 className="font-bold">
              {issue.title}: {issue.comparison.observed}
              {issue.evidence[0].unit === "%"
                ? "%"
                : ` ${issue.evidence[0].unit}`}
            </h3>
            {issue.comparison.target === null ? (
              <p className="text-sm text-amber-800">
                Chưa có mục tiêu cùng phạm vi; chưa kết luận cao/thấp.
              </p>
            ) : (
              <p className="text-sm">
                Mục tiêu: {issue.comparison.target} {issue.evidence[0].unit}.{" "}
                {issue.comparison.status === "meets_target"
                  ? "Đạt mục tiêu tự khai."
                  : `Lệch ${Math.abs(issue.comparison.gap!)} ${issue.comparison.unit} so với mục tiêu tự khai.`}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Độ đầy đủ bằng chứng:{" "}
              {issue.confidence.level === "medium" ? "Trung bình" : "Thấp"}.{" "}
              {issue.confidence.basis}
            </p>
          </div>
          <details>
            <summary className="cursor-pointer font-semibold">
              Bằng chứng đầu vào ({issue.evidence.length})
            </summary>
            <div className="space-y-3 pt-3">
              {issue.evidence.map((e) => (
                <div key={e.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                  <p>
                    <b>{e.id}</b> · {e.label}: {e.value} {e.unit}
                  </p>
                  <p>
                    Nguồn: {e.source || "Chưa cung cấp"} ·{" "}
                    {e.provenance === "calculated_from_self_reported"
                      ? "Tính lại từ dữ liệu tự khai"
                      : "Do doanh nghiệp tự khai"}{" "}
                    · Chưa xác minh độc lập.
                  </p>
                  <p>
                    Kỳ đo:{" "}
                    {e.period
                      ? `${e.period.start} đến ${e.period.end}`
                      : "Chưa cung cấp"}{" "}
                    · Phạm vi: {e.scope || "Chưa cung cấp"}
                  </p>
                  <p>Định nghĩa: {e.definition}</p>
                  {e.denominator !== undefined && (
                    <p>
                      Tử số/mẫu số: {e.numerator}/{e.denominator}
                    </p>
                  )}
                  {e.sampleSize !== undefined && <p>Cỡ mẫu: {e.sampleSize}</p>}
                </div>
              ))}
            </div>
          </details>
          <div className="space-y-3">
            <h4 className="font-semibold">
              Giả thuyết nguyên nhân cần kiểm tra
            </h4>
            {!issue.hypotheses.length && (
              <p className="text-sm">
                Chỉ số đạt mục tiêu tự khai; chưa có cơ sở nêu vấn đề vận hành
                từ chỉ số này.
              </p>
            )}
            {issue.hypotheses.map((h) => (
              <div
                key={h.id}
                className="bg-blue-50/60 rounded-lg p-3 space-y-2"
              >
                <p className="text-sm">{h.statement}</p>
                <p className="text-xs text-amber-800">
                  Giả thuyết chưa xác minh · Mức tin cậy: thấp.{" "}
                  {h.confidence.basis}
                </p>
                <p className="text-xs">
                  Tham chiếu: {h.supportingEvidenceIds.join(", ")}
                </p>
                <ul className="list-disc pl-5 text-sm">
                  {h.verificationRequests.map((v, i) => (
                    <li key={i}>
                      <b>{v.question}</b>
                      <p>Cần: {v.requiredData}</p>
                      <p>Cách kiểm tra: {v.method}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-600">
                  Bằng chứng phản bác cần tìm:{" "}
                  {h.counterEvidenceToCheck.join(" ")}
                </p>
              </div>
            ))}
          </div>
          {!!issue.missingData.length && (
            <div>
              <h4 className="font-semibold">Dữ liệu còn thiếu</h4>
              <ul className="list-disc pl-5 text-sm">
                {issue.missingData.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <details>
            <summary className="cursor-pointer font-semibold">
              Yêu cầu xác minh vấn đề
            </summary>
            {issue.verificationRequests.map((v, i) => (
              <div key={i} className="text-sm pt-2">
                <p>{v.question}</p>
                <p>Cần: {v.requiredData}</p>
                <p>Cách kiểm tra: {v.method}</p>
              </div>
            ))}
          </details>
        </article>
      ))}
      <div className="text-xs text-slate-500 space-y-1">
        {analysis.dataLimitations.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}
