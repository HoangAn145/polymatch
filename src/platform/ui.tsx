import React from 'react';
export const card =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
export const input =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm disabled:bg-slate-100';
export const button =
  'rounded-lg bg-[#1769aa] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
export function Notice({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
      {error}
    </p>
  ) : null;
}
export function Format({ value }: { value: number | null }) {
  return (
    <>
      {value === null
        ? '—'
        : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(
            value,
          )}
    </>
  );
}
export function Curve({ values, label }: { values: number[]; label: string }) {
  if (!values.length) return null;
  const min = Math.min(0, ...values),
    max = Math.max(0, ...values),
    range = max - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${20 + (i * 600) / Math.max(1, values.length - 1)},${160 - ((v - min) / range) * 140}`,
    )
    .join(' ');
  return (
    <svg
      viewBox="0 0 640 185"
      role="img"
      aria-label={label}
      className="w-full max-w-2xl"
    >
      <line
        x1="20"
        x2="620"
        y1={160 - ((0 - min) / range) * 140}
        y2={160 - ((0 - min) / range) * 140}
        stroke="#cbd5e1"
      />
      <polyline points={points} fill="none" stroke="#1769aa" strokeWidth="3" />
      <text x="20" y="180" fontSize="11">
        Kỳ đầu
      </text>
      <text x="560" y="180" fontSize="11">
        Kỳ cuối
      </text>
    </svg>
  );
}
