import React from "react";
import {
  KPI_DEFINITIONS,
  type OperationalKpiCode,
  type OperationalKpiInput,
} from "../../lib/diagnosticEvidence";
const field = "w-full border border-slate-300 rounded-lg p-2 bg-white";
export function OperationalKpiEditor({
  value,
  onChange,
}: {
  value: OperationalKpiInput[];
  onChange: (value: OperationalKpiInput[]) => void;
}) {
  function update(index: number, patch: Partial<OperationalKpiInput>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  function numeric(raw: string) {
    return raw === "" ? undefined : Number(raw);
  }
  return (
    <section
      aria-label="KPI vận hành thực tế"
      className="bg-white border rounded-2xl p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="font-bold">KPI vận hành thực tế</h2>
          <p className="text-xs text-slate-500">
            Bổ sung số liệu để AI lập giả thuyết có bằng chứng. Không nhập số
            giả định; để trống khi chưa có dữ liệu.
          </p>
        </div>
        <button
          type="button"
          disabled={value.length >= 12}
          className="border border-blue-700 text-blue-700 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => {
            const code = (Object.keys(KPI_DEFINITIONS).find(
              (k) => !value.some((v) => v.code === k),
            ) || "empty_running_rate") as OperationalKpiCode;
            onChange([...value, { code }]);
          }}
        >
          Thêm KPI vận hành
        </button>
      </div>
      {!value.length && (
        <p className="text-sm text-slate-500">
          Chưa bổ sung KPI vận hành. Hệ thống vẫn tính điểm DBI/LDMI và nêu rõ
          giới hạn phân tích nguyên nhân.
        </p>
      )}
      {value.map((row, index) => {
        const def = KPI_DEFINITIONS[row.code],
          percent = def.unit === "%";
        return (
          <fieldset
            key={index}
            className="border rounded-xl p-4 space-y-3"
            data-testid="operational-kpi"
          >
            <legend className="px-2 font-semibold">
              KPI {index + 1}: {def.name}
            </legend>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <label>
                Chỉ số
                <select
                  aria-label={`Chỉ số KPI ${index + 1}`}
                  className={field}
                  value={row.code}
                  onChange={(e) =>
                    update(index, {
                      code: e.target.value as OperationalKpiCode,
                      definition: undefined,
                      numerator: undefined,
                      denominator: undefined,
                    })
                  }
                >
                  {Object.entries(KPI_DEFINITIONS).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Giá trị ({def.unit})
                <input
                  aria-label={`Giá trị KPI ${index + 1}`}
                  type="number"
                  min="0"
                  max={percent ? 100 : undefined}
                  step="any"
                  value={row.value ?? ""}
                  placeholder={
                    row.code === "empty_running_rate"
                      ? "Ví dụ: 32"
                      : row.code === "on_time_delivery_rate"
                        ? "Ví dụ: 82"
                        : ""
                  }
                  onChange={(e) =>
                    update(index, { value: numeric(e.target.value) })
                  }
                  className={field}
                />
              </label>
              <label>
                Mục tiêu ({def.unit}, tùy chọn)
                <input
                  aria-label={`Mục tiêu KPI ${index + 1}`}
                  type="number"
                  min="0"
                  max={percent ? 100 : undefined}
                  step="any"
                  value={row.target ?? ""}
                  onChange={(e) =>
                    update(index, { target: numeric(e.target.value) })
                  }
                  className={field}
                />
              </label>
              <label>
                Từ ngày
                <input
                  aria-label={`KPI ${index + 1} từ ngày`}
                  type="date"
                  value={row.period?.start ?? ""}
                  onChange={(e) =>
                    update(index, {
                      period:
                        e.target.value || row.period?.end
                          ? {
                              start: e.target.value,
                              end: row.period?.end ?? "",
                            }
                          : undefined,
                    })
                  }
                  className={field}
                />
              </label>
              <label>
                Đến ngày
                <input
                  aria-label={`KPI ${index + 1} đến ngày`}
                  type="date"
                  value={row.period?.end ?? ""}
                  onChange={(e) =>
                    update(index, {
                      period:
                        e.target.value || row.period?.start
                          ? {
                              start: row.period?.start ?? "",
                              end: e.target.value,
                            }
                          : undefined,
                    })
                  }
                  className={field}
                />
              </label>
              <label>
                Phạm vi đo
                <input
                  aria-label={`Phạm vi KPI ${index + 1}`}
                  maxLength={300}
                  value={row.scope ?? ""}
                  placeholder="Đội xe, tuyến, kho hoặc nhóm đơn"
                  onChange={(e) => update(index, { scope: e.target.value })}
                  className={field}
                />
              </label>
              <label className="sm:col-span-2">
                Nguồn số liệu
                <input
                  aria-label={`Nguồn KPI ${index + 1}`}
                  maxLength={500}
                  value={row.source ?? ""}
                  placeholder="Tên báo cáo TMS/WMS, GPS hoặc sổ vận hành"
                  onChange={(e) => update(index, { source: e.target.value })}
                  className={field}
                />
              </label>
              <label>
                Cỡ mẫu (số chuyến/đơn)
                <input
                  aria-label={`Cỡ mẫu KPI ${index + 1}`}
                  type="number"
                  min="1"
                  step="1"
                  value={row.sampleSize ?? ""}
                  onChange={(e) =>
                    update(index, { sampleSize: numeric(e.target.value) })
                  }
                  className={field}
                />
              </label>
              {percent && (
                <>
                  <label>
                    Tử số
                    <input
                      aria-label={`Tử số KPI ${index + 1}`}
                      type="number"
                      min="0"
                      step="any"
                      value={row.numerator ?? ""}
                      onChange={(e) =>
                        update(index, { numerator: numeric(e.target.value) })
                      }
                      className={field}
                    />
                  </label>
                  <label>
                    Mẫu số
                    <input
                      aria-label={`Mẫu số KPI ${index + 1}`}
                      type="number"
                      min="0.000001"
                      step="any"
                      value={row.denominator ?? ""}
                      onChange={(e) =>
                        update(index, { denominator: numeric(e.target.value) })
                      }
                      className={field}
                    />
                  </label>
                  <p className="text-xs text-slate-500 self-center">
                    Có thể để trống giá trị nếu nhập đủ tử số/mẫu số. Tỷ lệ sẽ
                    được tính lại trên máy chủ.
                  </p>
                </>
              )}
              <label className="sm:col-span-3">
                Định nghĩa và ngoại lệ KPI
                <textarea
                  aria-label={`Định nghĩa KPI ${index + 1}`}
                  maxLength={700}
                  value={row.definition ?? ""}
                  placeholder={def.definition}
                  onChange={(e) =>
                    update(index, { definition: e.target.value })
                  }
                  className={field}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="text-sm text-blue-700 underline"
                onClick={() => update(index, { definition: def.definition })}
              >
                Xác nhận dùng công thức gợi ý
              </button>
              <button
                type="button"
                className="text-sm text-red-700 underline"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                Xóa KPI này
              </button>
            </div>
          </fieldset>
        );
      })}
    </section>
  );
}
