import React from "react";
import {
  CHAT_INTENTS,
  CLAIM_LABELS,
  type ChatReply,
} from "../../lib/chatContracts";
const dates = [
  ["publishedOn", "Ngày đăng"],
  ["adoptedOn", "Ngày thông qua"],
  ["issuedOn", "Ngày ban hành"],
  ["effectiveOn", "Ngày hiệu lực"],
] as const;
export function ChatResponse({ reply }: { reply: ChatReply }) {
  const conversational =
    reply.sources.every((s) => s.origin === "rag") &&
    reply.claims?.every((c) => c.kind === "reported_fact" && !c.attribution);
  return (
    <div aria-live="polite" className="space-y-3">
      <p className="text-xs text-slate-500">
        {CHAT_INTENTS[reply.intent] || "Tra cứu tài liệu"} · Tra cứu lúc{" "}
        {reply.retrievedAt
          ? new Date(reply.retrievedAt).toLocaleString("vi-VN")
          : ""}
      </p>
      {reply.claims?.length ? (
        <div className="space-y-3">
          {reply.claims.map((claim, index) => (
            <article
              key={index}
              className={
                conversational
                  ? "text-sm space-y-1"
                  : "border rounded-lg p-3 text-sm space-y-1"
              }
            >
              {!conversational && (
                <h3 className="font-semibold">{CLAIM_LABELS[claim.kind]}</h3>
              )}
              {claim.attribution && (
                <p className="text-xs">Theo: {claim.attribution}</p>
              )}
              <p className="whitespace-pre-wrap">{claim.text}</p>
              {!conversational && (
                <p className="text-xs text-blue-700">
                  Nguồn: {claim.sourceIds.join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm">{reply.answer}</p>
      )}
      <div className="space-y-3">
        {reply.sources.map((source, index) => (
          <div
            key={source.id || index}
            className="text-xs border-t pt-2 space-y-1"
          >
            <p>
              {source.id} ·{" "}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </p>
            {source.source && <p>{source.source}</p>}
            <p>
              {source.origin === "live"
                ? "Nguồn tìm kiếm trực tiếp"
                : "Tài liệu đã duyệt"}
              {source.sourceType === "official"
                ? " · Trang cơ quan/tổ chức chính thức"
                : source.sourceType === "primary_source"
                  ? " · Nguồn dữ liệu ngành"
                  : source.origin === "live" && source.sourceType === "other"
                    ? " · Chưa xác minh loại nguồn"
                    : ""}
            </p>
            {source.documentNumber && (
              <p>Số văn bản: {source.documentNumber}</p>
            )}
            {source.origin === "live" &&
              dates.map(([key, label]) => (
                <p key={key}>
                  {label}: {source[key] || "Chưa xác minh"}
                </p>
              ))}
            {source.reviewedAt && (
              <p>
                Duyệt tài liệu:{" "}
                {new Date(source.reviewedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        ))}
      </div>
      {!!reply.warnings?.length && (
        <div className="bg-amber-50 text-amber-900 p-2 rounded text-xs space-y-1">
          {reply.warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      )}
    </div>
  );
}
