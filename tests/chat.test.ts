import { test } from "node:test";
import assert from "node:assert/strict";
import {
  routeQuestion,
  ruleIntent,
  redactOutboundQuestion,
} from "../server/chat/router";
import {
  publicUrl,
  sourceAuthority,
  liveSources,
  EMPTY_DATES,
  eventDateSupported,
  type EvidenceSource,
} from "../server/chat/sources";
import { validateGeneratedReply, composeReply } from "../server/chat/generator";
import { answerChat, retrieveKnowledge } from "../server/chat/engine";
import { saveChatHistory } from "../server/chat/history";
const now = "2026-11-21T06:00:00.000Z";
const base = {
  intent: "news_policy" as const,
  strategy: "live_search" as const,
  router: "llm" as const,
  retrievedAt: now,
};
function source(id: string, url: string, material: string): EvidenceSource {
  return {
    public: {
      id,
      title: "Synthetic source",
      url,
      origin: "live",
      retrievedAt: now,
      ...sourceAuthority(url),
      ...EMPTY_DATES,
    },
    material,
  };
}
const official = source(
  "LIVE-1",
  "https://vanban.chinhphu.vn/example",
  "Văn bản số 01/2026/TEST. Ngày đăng: 2026-11-18; ngày thông qua: 2026-11-10; ngày ban hành: 2026-11-15; ngày hiệu lực: 2027-01-01. Văn bản điều chỉnh quy trình khai báo.",
);
function response(
  kind = "reported_fact",
  text = "Văn bản điều chỉnh quy trình khai báo.",
  ids = ["LIVE-1"],
  attribution: string | null = null,
) {
  return {
    claims: [{ kind, text, sourceIds: ids, attribution }],
    sourceDates: [],
    limitations: [],
  };
}
function fakeDb(rows: any[] = []) {
  const calls: any[] = [];
  const query: any = {
    select() {
      return this;
    },
    eq(key: string, value: unknown) {
      calls.push(["eq", key, value]);
      return this;
    },
    in(key: string, value: unknown) {
      calls.push(["in", key, value]);
      return this;
    },
    textSearch(_key: string, value: unknown) {
      calls.push(["search", value]);
      return this;
    },
    limit() {
      return Promise.resolve({ data: rows, error: null });
    },
  };
  return {
    calls,
    from: (table: string) => {
      calls.push(["from", table]);
      return query;
    },
  };
}
test("four intents select distinct strategies, including Vietnamese registration and private support exceptions", async () => {
  const cases: [string, string, string][] = [
    ["Tôi đăng ký tài khoản POLYMATCH thế nào?", "customer_support", "rag"],
    ["TMS tích hợp ERP thế nào?", "technology", "rag"],
    [
      "Giá cước vận tải quốc tế đang có xu hướng thế nào?",
      "logistics_market",
      "rag_search",
    ],
    ["Thủ tục hải quan thay đổi tuần này?", "news_policy", "live_search"],
    [
      "Xung đột Trung Đông ảnh hưởng tuyến biển nào?",
      "news_policy",
      "live_search",
    ],
    [
      "Chính sách bảo mật tài khoản POLYMATCH mới nhất",
      "customer_support",
      "rag",
    ],
  ];
  for (const [q, intent, strategy] of cases) {
    const r = await routeQuestion(q, "auto");
    assert.equal(r.intent, intent, q);
    assert.equal(r.strategy, strategy, q);
  }
  assert.equal(
    ruleIntent("Tôi không đăng nhập được sau cập nhật"),
    "customer_support",
  );
});
test("LLM router is used, but cannot downgrade freshness or law to FAQ; invalid router falls back", async () => {
  const route = await routeQuestion(
    "Chính sách thuế quan Mỹ mới nhất?",
    "faq",
    async () => '{"intent":"technology"}',
  );
  assert.equal(route.router, "llm");
  assert.equal(route.strategy, "live_search");
  const tech = await routeQuestion(
    "Tài liệu kỹ thuật",
    "auto",
    async () => '{"intent":"technology"}',
  );
  assert.equal(tech.intent, "technology");
  const invalid = await routeQuestion(
    "TMS là gì?",
    "auto",
    async () => "{broken",
  );
  assert.equal(invalid.router, "rules");
  assert.equal(invalid.intent, "technology");
  assert(
    !redactOutboundQuestion("email a@example.com password: secret123").includes(
      "a@example.com",
    ),
  );
});
test("RAG reads only approved documents in the intended categories", async () => {
  const db = fakeDb([
    {
      id: "TEC-1",
      category: "Cong_nghe_CDS",
      title: "TMS",
      content: "TMS giúp điều phối.",
      source: "Approved source",
    },
  ]);
  const docs = await retrieveKnowledge(
    db as any,
    "TMS là gì?",
    "technology",
    now,
  );
  assert.equal(docs.length, 1);
  assert(
    db.calls.some(
      (c) => c[0] === "eq" && c[1] === "status" && c[2] === "approved",
    ),
  );
  assert.deepEqual(db.calls.find((c) => c[0] === "in")[2], [
    "Cong_nghe_CDS",
    "Technology",
    "technology",
  ]);
});
test("policy does not query RAG; market combines RAG and live search", async () => {
  const db = fakeDb();
  let searches = 0;
  await answerChat(
    "Thủ tục hải quan tuần này?",
    "faq",
    db as any,
    {
      search: async () => {
        searches++;
        return { text: "", candidates: [] };
      },
    },
    now,
  );
  assert.equal(searches, 1);
  assert(!db.calls.some((c) => c[0] === "from"));
  await answerChat(
    "Giá cước vận tải quốc tế?",
    "auto",
    db as any,
    {
      search: async () => {
        searches++;
        return { text: "", candidates: [] };
      },
    },
    now,
  );
  assert.equal(searches, 2);
  assert(db.calls.some((c) => c[0] === "in" && c[2].includes("Thi_truong")));
});
test("source URLs reject local/private/credential URLs, and official-domain lookalikes are not official", () => {
  for (const url of [
    "file:///tmp/x",
    "http://127.0.0.1/x",
    "http://169.254.169.254/",
    "https://user:pass@example.com",
    "http://localhost/x",
  ])
    assert.equal(publicUrl(url), null);
  assert.equal(
    sourceAuthority("https://customs.gov.vn/example").sourceType,
    "official",
  );
  assert.equal(
    sourceAuthority("https://customs.gov.vn.evil.com/example").sourceType,
    "other",
  );
  assert.equal(
    sourceAuthority("https://vietnamnews.vn/example").sourceType,
    "news_media",
  );
});
test("grounding sources retain only provider-supported segments; raw article text is not fetched", async () => {
  const text = "Theo Reuters, luồng tàu đã thay đổi.";
  let resolves = 0;
  const docs = await liveSources(
    {
      text,
      candidates: [
        {
          groundingMetadata: {
            groundingChunks: [
              { web: { uri: "https://reuters.com/example", title: "Reuters" } },
            ],
            groundingSupports: [
              { segment: { text }, groundingChunkIndices: [0] },
            ],
          },
        },
      ],
    },
    now,
    async (url) => {
      resolves++;
      return url;
    },
  );
  assert.equal(docs.length, 1);
  assert.equal(docs[0].material, text);
  assert.equal(docs[0].public.publishedOn, null);
  assert.equal(resolves, 1);
});
test("publication, adoption, issuance and effective dates remain distinct and tied to the right event", () => {
  const output: any = response(
    "confirmed_fact",
    "Văn bản số 01/2026/TEST điều chỉnh quy trình khai báo.",
  );
  output.sourceDates = [
    {
      sourceId: "LIVE-1",
      publishedOn: "2026-11-18",
      adoptedOn: "2026-11-10",
      issuedOn: "2026-11-15",
      effectiveOn: "2027-01-01",
      documentNumber: "01/2026/TEST",
    },
  ];
  const reply = validateGeneratedReply(
    JSON.stringify(output),
    [official],
    base,
  );
  assert.equal(reply.sources[0].publishedOn, "2026-11-18");
  assert.equal(reply.sources[0].adoptedOn, "2026-11-10");
  assert.equal(reply.sources[0].issuedOn, "2026-11-15");
  assert.equal(reply.sources[0].effectiveOn, "2027-01-01");
  assert(eventDateSupported("effectiveOn", "2027-01-01", official.material));
  assert(!eventDateSupported("effectiveOn", "2026-11-10", official.material));
  assert(
    !eventDateSupported(
      "effectiveOn",
      "2027-01-01",
      "Dự thảo dự kiến có hiệu lực: 2027-01-01.",
    ),
  );
  output.sourceDates[0].effectiveOn = "2026-11-10";
  assert.throws(() =>
    validateGeneratedReply(JSON.stringify(output), [official], base),
  );
});
test("legal dates from news media, invented figures and unknown references are rejected", () => {
  const media = source(
    "LIVE-2",
    "https://vietnamnews.vn/example",
    official.material,
  );
  const date: any = response(
    "reported_fact",
    "Văn bản điều chỉnh quy trình khai báo.",
    ["LIVE-2"],
  );
  date.sourceDates = [
    {
      sourceId: "LIVE-2",
      publishedOn: null,
      adoptedOn: null,
      issuedOn: null,
      effectiveOn: "2027-01-01",
      documentNumber: null,
    },
  ];
  assert.throws(() =>
    validateGeneratedReply(JSON.stringify(date), [media], base),
  );
  for (const r of [
    response("reported_fact", "Giá cước tăng 99%."),
    response("reported_fact", "Thông tin mới.", ["unknown"]),
    response("confirmed_fact", "Một bên tuyên bố đã kiểm soát khu vực."),
  ])
    assert.throws(() =>
      validateGeneratedReply(JSON.stringify(r), [official], base),
    );
});
test("party statements, expert views and uncertainty retain labels; one official military assertion is not confirmation", () => {
  const news = source(
    "LIVE-2",
    "https://reuters.com/example",
    "Bên A tuyên bố kiểm soát khu vực. Chuyên gia B cho rằng tác động cần theo dõi.",
  );
  for (const [kind, text, attribution] of [
    ["party_statement", "Bên A tuyên bố kiểm soát khu vực.", "Bên A"],
    ["expert_assessment", "Tác động cần theo dõi.", "Chuyên gia B"],
    [
      "unverified_information",
      "Thông tin kiểm soát khu vực chưa được xác minh.",
      null,
    ],
  ] as const) {
    const r = validateGeneratedReply(
      JSON.stringify(response(kind, text, ["LIVE-2"], attribution)),
      [news],
      base,
    );
    assert.equal(r.claims[0].kind, kind);
  }
  assert.throws(() =>
    validateGeneratedReply(
      JSON.stringify(response("confirmed_fact", "Khu vực đã được kiểm soát.")),
      [
        source(
          "LIVE-1",
          "https://defense.gov/example",
          "Khu vực đã được kiểm soát.",
        ),
      ],
      base,
    ),
  );
  assert.throws(() =>
    validateGeneratedReply(
      JSON.stringify(
        response(
          "expert_assessment",
          "Có tác động.",
          ["LIVE-2"],
          "Chuyên gia không tồn tại",
        ),
      ),
      [news],
      base,
    ),
  );
});
test("confirmation requires independent trusted publishers, and impact analysis remains conditional", () => {
  const a = source(
      "LIVE-1",
      "https://reuters.com/a",
      "Luồng tàu thay đổi. Chi phí vận hành có thể tăng.",
    ),
    b = source("LIVE-2", "https://apnews.com/b", "Luồng tàu thay đổi.");
  const confirmed = validateGeneratedReply(
    JSON.stringify(
      response("confirmed_fact", "Luồng tàu thay đổi.", ["LIVE-1", "LIVE-2"]),
    ),
    [a, b],
    base,
  );
  assert.equal(confirmed.claims[0].verification, "corroborated_sources");
  assert.throws(() =>
    validateGeneratedReply(
      JSON.stringify(response("confirmed_fact", "Luồng tàu thay đổi.")),
      [a],
      base,
    ),
  );
  assert.equal(
    validateGeneratedReply(
      JSON.stringify(
        response("logistics_impact", "Chi phí vận hành có thể tăng."),
      ),
      [a],
      base,
    ).claims[0].verification,
    "analysis",
  );
  assert.throws(() =>
    validateGeneratedReply(
      JSON.stringify(
        response("logistics_impact", "Chi phí vận hành chắc chắn tăng."),
      ),
      [a],
      base,
    ),
  );
});
test("invalid model output and unavailable search return explicit uncertainty without fabricating current facts", async () => {
  const reply = await composeReply(
    "Tin mới?",
    [official],
    base,
    async () => "{invalid",
  );
  assert(reply.handoff);
  assert.equal(reply.claims.length, 0);
  assert(reply.sources.length);
  assert(reply.warnings.length);
  const noSearch = await answerChat(
    "Chính sách thuế quan mới nhất?",
    "auto",
    fakeDb() as any,
    {},
    now,
  );
  assert(noSearch.handoff);
  assert.equal(noSearch.claims.length, 0);
  assert(noSearch.warnings.some((w) => w.includes("trực tiếp")));
});
test("history stores generated summaries and metadata, never grounding/article material, and handles missing migration", async () => {
  const reply = validateGeneratedReply(
    JSON.stringify(response()),
    [official],
    base,
  );
  let args: any;
  const db: any = {
    rpc: async (_name: string, body: any) => {
      args = body;
      return { data: "query-id", error: null };
    },
  };
  const saved = await saveChatHistory(db, "Câu hỏi", reply);
  assert(saved.historySaved);
  assert.equal(args.p_sources[0].summary, reply.claims[0].text);
  assert(!JSON.stringify(args).includes("material"));
  assert(!JSON.stringify(args).includes("groundingSupports"));
  const failed = await saveChatHistory(
    { rpc: async () => ({ error: { code: "PGRST202" } }) } as any,
    "Câu hỏi",
    reply,
  );
  assert.equal(failed.historySaved, false);
  assert(failed.warnings.some((w) => w.includes("003_chat_history.sql")));
});

test("grounding redirect resolution never downloads publisher pages or follows private destinations", async () => {
  const { resolveGroundingUrl } = await import("../server/chat/sources");
  let calls = 0;
  const publisherFetch: typeof fetch = async () => {
    calls++;
    return new Response(null, {
      status: 302,
      headers: { location: "https://reuters.com/example" },
    });
  };
  const toPublisher = await resolveGroundingUrl(
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/synthetic",
    publisherFetch,
  );
  assert.equal(toPublisher, "https://reuters.com/example");
  assert.equal(calls, 1);
  const privateFetch: typeof fetch = async () =>
    new Response(null, {
      status: 302,
      headers: { location: "http://169.254.169.254/latest" },
    });
  const toPrivate = await resolveGroundingUrl(
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/synthetic",
    privateFetch,
  );
  assert.equal(toPrivate, null);
});

test("private support does not hide legal questions, and explicit week requests identify the correct local window", async () => {
  const { requestedSince } = await import("../server/chat/router");
  assert.equal(
    (
      await routeQuestion(
        "Chính sách bảo mật POLYMATCH có tuân luật mới không?",
        "auto",
      )
    ).strategy,
    "live_search",
  );
  assert.equal(
    requestedSince("Thay đổi hải quan tuần này?", now),
    "2026-11-16",
  );
  const reply = await answerChat(
    "Thủ tục hải quan tuần này?",
    "auto",
    fakeDb() as any,
    {},
    now,
  );
  assert(reply.warnings.some((w) => w.includes("khoảng thời gian")));
});

test("two media reports repeating a party claim do not establish the claimed event as a fact", () => {
  const a = source(
    "LIVE-1",
    "https://reuters.com/statement",
    "Bên A tuyên bố kiểm soát khu vực.",
  );
  const b = source(
    "LIVE-2",
    "https://apnews.com/statement",
    "Bên A tuyên bố kiểm soát khu vực.",
  );
  for (const kind of ["confirmed_fact", "reported_fact"])
    assert.throws(() =>
      validateGeneratedReply(
        JSON.stringify(
          response(kind, "Khu vực đã được kiểm soát.", ["LIVE-1", "LIVE-2"]),
        ),
        [a, b],
        base,
      ),
    );
});
