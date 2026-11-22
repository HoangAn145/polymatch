import { sandboxMode } from "./demoSandbox";
import type { SupabaseClient } from "@supabase/supabase-js";
import { demoMode, requireSupabase } from "./supabase";
// Additional demo features have their own storage; the original database stays intact.
const KEY = sandboxMode
  ? "polymatch_public_demo_features_v1"
  : "polymatch_additional_features_v1";
type Row = Record<string, any>;
function load(): Record<string, Row[]> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
class LocalQuery implements PromiseLike<any> {
  private filters: [string, unknown][] = [];
  private sorts: { key: string; asc: boolean }[] = [];
  private max = Infinity;
  private operation = "select";
  private values: Row[] = [];
  private singular = false;
  private optional = false;
  constructor(private table: string) {}
  select(_columns?: string) {
    return this;
  }
  eq(key: string, value: unknown) {
    this.filters.push([key, value]);
    return this;
  }
  order(key: string, options: { ascending?: boolean } = {}) {
    this.sorts.push({ key, asc: options.ascending !== false });
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  insert(values: Row | Row[]) {
    this.operation = "insert";
    this.values = Array.isArray(values) ? values : [values];
    return this;
  }
  upsert(values: Row | Row[]) {
    this.operation = "upsert";
    this.values = Array.isArray(values) ? values : [values];
    return this;
  }
  update(values: Row) {
    this.operation = "update";
    this.values = [values];
    return this;
  }
  single() {
    this.singular = true;
    return this;
  }
  maybeSingle() {
    this.singular = true;
    this.optional = true;
    return this;
  }
  then<TResult1 = any, TResult2 = never>(
    yes?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    no?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve()
      .then(() => this.execute())
      .then(yes, no);
  }
  private execute() {
    const db = load(),
      rows = db[this.table] || [];
    const matches = (r: Row) => this.filters.every(([k, v]) => r[k] === v);
    let result = rows.filter(matches);
    if (this.operation === "insert" || this.operation === "upsert") {
      result = this.values.map((v) => ({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...(this.table === "support_tickets"
          ? { status: "new", department: "CSKH", response: "" }
          : {}),
        ...v,
      }));
      db[this.table] = [...rows, ...result];
    } else if (this.operation === "update") {
      result = [];
      db[this.table] = rows.map((r) => {
        if (!matches(r)) return r;
        const next = { ...r, ...this.values[0] };
        result.push(next);
        return next;
      });
    }
    if (this.operation !== "select")
      localStorage.setItem(KEY, JSON.stringify(db));
    result.sort((a, b) => {
      for (const sort of this.sorts) {
        const n =
          a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0;
        if (n) return sort.asc ? n : -n;
      }
      return 0;
    });
    result = result.slice(0, this.max);
    if (this.singular && result.length !== 1 && !this.optional)
      return { data: null, error: { message: "Không tìm thấy bản ghi." } };
    return { data: this.singular ? (result[0] ?? null) : result, error: null };
  }
}
export function featureStore(): SupabaseClient {
  return demoMode
    ? ({
        from: (table: string) => new LocalQuery(table),
      } as unknown as SupabaseClient)
    : requireSupabase();
}
