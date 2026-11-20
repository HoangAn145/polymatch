import type { ChatSource, SourceDates } from "../../src/lib/chatContracts";
export interface EvidenceSource {
  public: ChatSource;
  material: string;
}
export const EMPTY_DATES: SourceDates = {
  publishedOn: null,
  adoptedOn: null,
  issuedOn: null,
  effectiveOn: null,
  documentNumber: null,
};
export function publicUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 3000) return null;
  try {
    const url = new URL(value);
    const h = url.hostname.toLowerCase();
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !h.includes(".") ||
      /^\d+(?:\.\d+){3}$/.test(h) ||
      h.includes(":") ||
      /(^|\.)(localhost|local|internal|test|invalid)$/.test(h)
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}
function domain(host: string, root: string) {
  return host === root || host.endsWith("." + root);
}
export function sourceAuthority(
  url: string,
): Pick<ChatSource, "sourceType" | "publisherGroup"> {
  const h = new URL(url).hostname.toLowerCase();
  const official = [
    "chinhphu.vn",
    "quochoi.vn",
    "vbpl.vn",
    "europa.eu",
    "wto.org",
    "un.org",
    "unctad.org",
    "imo.org",
    "worldbank.org",
    "imf.org",
  ];
  const root = official.find((r) => domain(h, r));
  if (root) return { sourceType: "official", publisherGroup: root };
  if (/\.(gov|gov\.vn|gov\.uk|gov\.au|go\.jp|go\.kr)$/.test(h))
    return { sourceType: "official", publisherGroup: h.replace(/^www\./, "") };
  const primary = ["freightos.com", "drewry.co.uk", "xeneta.com", "sse.net.cn"];
  const industry = primary.find((root) => domain(h, root));
  if (industry)
    return { sourceType: "primary_source", publisherGroup: industry };
  const media = [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "bbc.co.uk",
    "bloomberg.com",
    "ft.com",
    "vietnamnews.vn",
    "vnexpress.net",
    "vneconomy.vn",
    "baochinhphu.vn",
  ];
  const publisher = media.find((r) => domain(h, r));
  return {
    sourceType: publisher ? "news_media" : "other",
    publisherGroup:
      publisher === "bbc.co.uk"
        ? "bbc.com"
        : publisher || h.replace(/^www\./, ""),
  };
}
export function legalPrimarySource(source: ChatSource) {
  if (source.sourceType !== "official" || !source.url) return false;
  const host = new URL(source.url).hostname.toLowerCase();
  return (
    /\.(gov|gov\.vn|gov\.uk|gov\.au|go\.jp|go\.kr)$/.test(host) ||
    [
      "chinhphu.vn",
      "quochoi.vn",
      "vbpl.vn",
      "europa.eu",
      "wto.org",
      "un.org",
      "imo.org",
    ].some((root) => domain(host, root))
  );
}
export function dateOnly(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function dateInMaterial(day: string, material: string) {
  const [year, month, date] = day.split("-");
  const d = Number(date),
    m = Number(month);
  const lower = material.toLowerCase();
  const english = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ][m - 1];
  return [
    day,
    `${date}/${month}/${year}`,
    `${d}/${m}/${year}`,
    `${d}-${m}-${year}`,
    `${date}-${month}-${year}`,
    `${d}.${m}.${year}`,
    `${d} tháng ${m} năm ${year}`,
    `${english} ${d}, ${year}`,
    `${d} ${english} ${year}`,
  ].some((s) => lower.includes(s));
}
export function eventDateSupported(
  field: keyof SourceDates,
  day: string,
  material: string,
) {
  const text = material
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
  const [year, month, date] = day.split("-");
  const d = Number(date),
    m = Number(month);
  const english = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ][m - 1];
  const forms = [
    day,
    `${english} ${d}, ${year}`,
    `${d} ${english} ${year}`,
    `${date}/${month}/${year}`,
    `${d}/${m}/${year}`,
    `${d}-${m}-${year}`,
    `${date}-${month}-${year}`,
    `${d} thang ${m} nam ${year}`,
  ];
  const markers: Record<string, RegExp> = {
    publishedOn:
      /ngay dang|dang ngay|ngay cong bo|cong bo ngay|published|publication date/g,
    adoptedOn: /thong qua|adopted|passed/g,
    issuedOn: /ban hanh|ngay ky|issued|signed/g,
    effectiveOn: /hieu luc|effective|takes effect/g,
  };
  for (const form of forms) {
    let index = text.indexOf(form);
    while (index >= 0) {
      const prefix = text.slice(Math.max(0, index - 160), index);
      if (
        /du kien|du thao|de xuat|chua (duoc )?(thong qua|ban hanh|co hieu luc)|proposed|draft|expected/.test(
          prefix,
        )
      ) {
        index = text.indexOf(form, index + form.length);
        continue;
      }
      let nearest = "",
        position = -1;
      for (const [key, re] of Object.entries(markers)) {
        for (const match of prefix.matchAll(new RegExp(re.source, "g")))
          if (match.index! > position) {
            nearest = key;
            position = match.index!;
          }
      }
      if (nearest === field) return true;
      index = text.indexOf(form, index + form.length);
    }
  }
  return false;
}
export async function resolveGroundingUrl(
  raw: string,
  fetcher: typeof fetch = fetch,
): Promise<string | null> {
  let url = publicUrl(raw);
  if (!url) return null;
  for (let i = 0; i < 3; i++) {
    const parsed = new URL(url);
    if (parsed.hostname !== "vertexaisearch.cloud.google.com") return url;
    if (
      parsed.protocol !== "https:" ||
      !parsed.pathname.startsWith("/grounding-api-redirect/")
    )
      return url;
    try {
      const response = await fetcher(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(2000),
      });
      void response.body?.cancel();
      const location = response.headers.get("location");
      if (!location || response.status < 300 || response.status >= 400)
        return url;
      url = publicUrl(new URL(location, url).href);
      if (!url) return null;
    } catch {
      return url;
    }
  }
  return url;
}
export async function liveSources(
  response: any,
  retrievedAt: string,
  resolve: (url: string) => Promise<string | null> = resolveGroundingUrl,
): Promise<EvidenceSource[]> {
  const text = typeof response.text === "string" ? response.text : "";
  const metadata = response.candidates?.[0]?.groundingMetadata;
  const chunks = Array.isArray(metadata?.groundingChunks)
    ? metadata.groundingChunks.slice(0, 12)
    : [];
  const supports = Array.isArray(metadata?.groundingSupports)
    ? metadata.groundingSupports
    : [];
  const materialByIndex = new Map<number, string[]>();
  for (const support of supports) {
    const segment = support.segment;
    let part =
      typeof segment?.text === "string" && text.includes(segment.text)
        ? segment.text
        : "";
    if (!part) continue;
    for (const index of support.groundingChunkIndices || [])
      if (Number.isInteger(index) && index >= 0 && index < chunks.length) {
        const items = materialByIndex.get(index) || [];
        items.push(part.slice(0, 1800));
        materialByIndex.set(index, items);
      }
  }
  const result = await Promise.allSettled(
    chunks.map(async (chunk: any, index: number) => {
      const raw = publicUrl(chunk.web?.uri);
      if (!raw) return null;
      const url = await resolve(raw);
      if (!url) return null;
      return {
        public: {
          id: `LIVE-${index + 1}`,
          origin: "live" as const,
          title: String(chunk.web?.title || new URL(url).hostname).slice(
            0,
            500,
          ),
          url,
          ...sourceAuthority(url),
          retrievedAt,
          ...EMPTY_DATES,
        },
        material: [...new Set(materialByIndex.get(index) || [])]
          .join("\n")
          .slice(0, 5000),
      };
    }),
  );
  const out: EvidenceSource[] = [];
  const seen = new Set<string>();
  for (const item of result) {
    if (item.status === "rejected" || !item.value) continue;
    const existing = out.find((e) => e.public.url === item.value!.public.url);
    if (existing) {
      existing.material = (
        existing.material +
        "\n" +
        item.value.material
      ).slice(0, 5000);
      continue;
    }
    seen.add(item.value.public.url!);
    out.push(item.value);
  }
  return out;
}
export function ragSource(
  row: any,
  index: number,
  retrievedAt: string,
): EvidenceSource {
  const urls =
    typeof row.source === "string"
      ? row.source.match(/https?:\/\/[^\s;<>]+/g) || []
      : [];
  const url = urls.map(publicUrl).find(Boolean) || undefined;
  return {
    public: {
      id: `RAG-${index + 1}`,
      origin: "rag",
      title: String(row.title).slice(0, 500),
      source: String(row.source || "").slice(0, 1200),
      ...(url ? { url } : {}),
      sourceType: "approved_knowledge",
      publisherGroup: "approved_knowledge",
      retrievedAt,
      ...(typeof row.reviewed_at === "string"
        ? { reviewedAt: row.reviewed_at }
        : {}),
      ...EMPTY_DATES,
    },
    material: String(row.content).slice(0, 6000),
  };
}
