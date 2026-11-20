import type { ChatIntent, ChatStrategy } from "./chatContracts.js";
function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}
export function internalSupportQuestion(question: string) {
  return /\b(tai khoan|dang ky|dang nhap|mat khau|otp|hoan tien|doi soat|cskh|chinh sach bao mat|dieu khoan su dung)\b/.test(
    normalize(question),
  );
}
export function policyQuestion(question: string) {
  const publicPart = normalize(question).replace(
    /chinh sach bao mat|chinh sach hoan tien|dieu khoan su dung/g,
    "",
  );
  return /\b(luat|nghi dinh|thong tu|quyet dinh so|hieu luc|ban hanh|quoc hoi|hai quan|thue quan|tariff|customs|sanctions|trung phat|chinh sach)\b/.test(
    publicPart,
  );
}
export function requestedSince(question: string, now: string): string | null {
  const q = normalize(question);
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
  }).format(new Date(now));
  if (/hom nay|today/.test(q)) return day;
  if (/thang nay/.test(q)) return day.slice(0, 7) + "-01";
  if (/tuan nay|this week/.test(q)) {
    const date = new Date(day + "T00:00:00Z");
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    return date.toISOString().slice(0, 10);
  }
  return null;
}
export function temporalQuestion(question: string) {
  return /\b(moi nhat|hom nay|tuan nay|thang nay|hien nay|hien tai|cap nhat|tin moi|thoi su|latest|today|this week|current)\b/.test(
    normalize(question),
  );
}
export function ruleIntent(question: string): ChatIntent {
  const q = normalize(question);
  if (
    policyQuestion(question) ||
    /\b(xung dot|chien tranh|trung dong|bien do|suez|hormuz|chinh tri|election|conflict|war)\b/.test(
      q,
    )
  )
    return "news_policy";
  if (
    /\b(gia cuoc|cuoc van tai|cuoc bien|thi truong|bao cao nganh|xuat khau|nhap khau|lpi|freight|market|chi so logistics)\b/.test(
      q,
    )
  )
    return "logistics_market";
  if (internalSupportQuestion(question)) return "customer_support";
  if (temporalQuestion(question)) return "news_policy";
  if (
    /\b(tai khoan|dang ky|dang nhap|mat khau|hoan tien|doi soat|cskh|huong dan su dung)\b/.test(
      q,
    )
  )
    return "customer_support";
  if (
    /\b(tms|wms|erp|oms|rfid|iot|blockchain|api|phan mem|cong nghe|tri tue nhan tao|ai|ocr)\b/.test(
      q,
    )
  )
    return "technology";
  return "customer_support";
}
export function strategyFor(intent: ChatIntent): ChatStrategy {
  return intent === "logistics_market"
    ? "rag_search"
    : intent === "news_policy"
      ? "live_search"
      : "rag";
}
export function redactOutboundQuestion(question: string) {
  return question
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email]")
    .replace(/\beyJ[A-Za-z0-9_-]{15,}(?:\.[A-Za-z0-9_-]+){1,2}\b/g, "[token]")
    .replace(/\b(?:sk-|sb_secret_)[A-Za-z0-9_-]{12,}\b/g, "[secret]")
    .replace(
      /(?:mật khẩu|mat khau|password|otp)\s*[:=]\s*\S+/gi,
      "[thông tin xác thực đã ẩn]",
    );
}
