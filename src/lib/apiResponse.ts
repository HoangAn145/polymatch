/** Vercel can return plain text/HTML before a function's JSON handler starts. */
export async function readApiResponse<T>(res: Response): Promise<T> {
  const raw = await res.text();
  let value: any;
  try {
    value = JSON.parse(raw);
  } catch {
    const message =
      res.status === 504
        ? "Máy chủ phản hồi quá lâu. Vui lòng thử lại."
        : "Dịch vụ chưa phản hồi đúng định dạng. Vui lòng thử lại hoặc liên hệ quản trị viên.";
    throw new Error(`${message} (HTTP ${res.status})`);
  }
  if (!res.ok)
    throw new Error(
      typeof value?.error === "string"
        ? value.error
        : "Không thể xử lý yêu cầu.",
    );
  return value as T;
}
