/** Only allowlisted diagnostics reach the UI/logs; never echo provider request bodies or keys. */
export function geminiFailure(error: unknown) {
  const e = error as {
    status?: unknown;
    statusCode?: unknown;
    code?: unknown;
    name?: unknown;
    message?: unknown;
  } | null;
  const status = Number(e?.status ?? e?.statusCode ?? e?.code);
  const message = typeof e?.message === "string" ? e.message : "";
  let code = "GEMINI_UNAVAILABLE",
    detail = "Chưa kết nối được Gemini; kiểm tra dịch vụ và thử lại.";
  if (status === 401 || /API_KEY_INVALID|API key not valid/i.test(message)) {
    code = "GEMINI_KEY_INVALID";
    detail =
      "Khóa Gemini không hợp lệ; kiểm tra GEMINI_API_KEY của deployment.";
  } else if (status === 403) {
    code = "GEMINI_ACCESS_DENIED";
    detail =
      "Google từ chối quyền gọi API; kiểm tra project, quyền API và giới hạn của khóa.";
  } else if (status === 429 || /RESOURCE_EXHAUSTED/i.test(message)) {
    code = "GEMINI_QUOTA";
    detail =
      "Gemini đã hết hạn mức hoặc đang bị giới hạn tốc độ; kiểm tra quota và thanh toán trong project Google.";
  } else if (status === 404) {
    code = "GEMINI_MODEL_NOT_FOUND";
    detail =
      "Không tìm thấy model hoặc model không hỗ trợ API này; kiểm tra GEMINI_MODEL.";
  } else if (status === 400) {
    code = "GEMINI_REQUEST_INVALID";
    detail =
      "Google không chấp nhận cấu hình yêu cầu; cần kiểm tra model, JSON schema và công cụ Search.";
  } else if (
    e?.name === "AbortError" ||
    e?.name === "TimeoutError" ||
    /timeout|timed out|aborted/i.test(message)
  ) {
    code = "GEMINI_TIMEOUT";
    detail = "Gemini phản hồi quá lâu; vui lòng thử lại.";
  } else if (/Empty Gemini response/.test(message)) {
    code = "GEMINI_EMPTY_RESPONSE";
    detail =
      "Gemini trả về nội dung rỗng; cần kiểm tra giới hạn output hoặc bộ lọc của model.";
  }
  return { code, detail };
}
