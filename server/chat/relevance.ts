import { normalize } from "../../src/lib/chatRouting.js";
import { knowledgeSections } from "./knowledge.js";
const STOP = new Set(
  "la gi cua va co cho toi thi nao cac ve voi nhu mot duoc khong the nen de trong can lam muon hoi hay ban minh xin the nao tai sao vui long".split(
    " ",
  ),
);
export function queryTerms(question: string) {
  return [...new Set(normalize(question).match(/[a-z0-9]+/g) || [])]
    .filter((t) => t.length > 1 && !STOP.has(t))
    .slice(0, 24);
}
function searchText(row: any) {
  const content = String(row.content || "");
  const fields = knowledgeSections(content);
  const useful = Object.entries(fields)
    .filter(
      ([k]) =>
        ![
          "id",
          "nhóm",
          "nguồn",
          "url nguồn",
          "người duyệt",
          "ngày cập nhật",
          "trạng thái",
        ].includes(k),
    )
    .map(([, v]) => v)
    .join(" ");
  return normalize(`${row.title || ""} ${useful || content}`);
}
export function rankKnowledge(question: string, rows: any[]) {
  const terms = queryTerms(question);
  if (!terms.length) return [];
  return rows
    .map((row) => {
      const text = searchText(row);
      const words = new Set(text.match(/[a-z0-9]+/g) || []);
      const titleWords = new Set(
        normalize(String(row.title || "")).match(/[a-z0-9]+/g) || [],
      );
      const matched = terms.filter((t) => words.has(t));
      const coverage = matched.length / terms.length;
      const phrase = text.includes(normalize(question).trim());
      const score =
        coverage +
        matched.filter((t) => titleWords.has(t)).length / terms.length +
        (phrase ? 1 : 0);
      return { row, coverage, score, matched: matched.length };
    })
    .filter((r) => r.coverage >= 0.6 && r.matched >= Math.min(2, terms.length))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.row);
}
