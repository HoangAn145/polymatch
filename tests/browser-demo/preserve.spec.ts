import { test, expect } from "@playwright/test";
test("original demo data survives alongside KPI, knowledge, chatbot and support additions", async ({
  page,
}) => {
  await page.goto("/buyer/dashboard");
  await expect(page.getByText("MÔI TRƯỜNG DEMO 3 ACTOR")).toBeVisible();
  await page.goto("/buyer/assessment");
  await page.getByRole("button", { name: "Lưu nháp" }).click();
  await page.goto("/buyer/kpi");
  await page.getByLabel("Giá trị", { exact: true }).fill("80");
  await page.getByRole("button", { name: "Ghi nhận KPI" }).click();
  await expect(
    page.getByText("1 KPI mới nhất chưa đạt mục tiêu."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Chat CSKH" }).click();
  await page
    .getByLabel("Câu hỏi", { exact: true })
    .fill("Cần chuyên viên hỗ trợ thử nghiệm");
  await page
    .getByRole("button", { name: "Đồng ý gửi câu hỏi này cho chuyên viên" })
    .click();
  await expect(page.getByText(/Đã tạo yêu cầu:/)).toBeVisible();
  await page.getByRole("button", { name: "Đóng trợ lý" }).click();
  await page.goto("/buyer/support");
  await expect(
    page.getByText("Cần chuyên viên hỗ trợ thử nghiệm"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đổi vai trò demo" }).click();
  await page.getByRole("button", { name: /4\. ADMIN – Quản trị viên/ }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await page.goto("/admin/knowledge");
  await page.getByRole("button", { name: "Thêm tài liệu" }).click();
  await page
    .getByLabel("Tiêu đề", { exact: true })
    .fill("Mã thử nghiệm tích hợp");
  await page
    .getByLabel("Nội dung", { exact: true })
    .fill("Mã thử nghiệm tích hợp hoạt động với giao diện cũ.");
  await page.getByLabel("Nguồn", { exact: true }).fill("https://example.test");
  await page
    .getByRole("combobox", { name: "Duyệt", exact: true })
    .selectOption("approved");
  await page.getByRole("button", { name: "Lưu tài liệu" }).click();
  await expect(
    page.getByText("Đã lưu nội dung và trạng thái duyệt."),
  ).toBeVisible();
  await page.goto("/admin/support");
  await expect(
    page.getByText("Cần chuyên viên hỗ trợ thử nghiệm"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đổi vai trò demo" }).click();
  await page.getByRole("button", { name: /1\. BUYER – Doanh nghiệp/ }).click();
  await page.goto("/buyer/history");
  await expect(page.getByText("Lần đánh giá thứ 1")).toBeVisible();
  await page.getByRole("button", { name: "Chat CSKH" }).click();
  await page
    .getByLabel("Câu hỏi", { exact: true })
    .fill("Mã thử nghiệm tích hợp");
  await page.getByRole("button", { name: "Gửi câu hỏi", exact: true }).click();
  await expect(
    page.getByText("Mã thử nghiệm tích hợp hoạt động với giao diện cũ."),
  ).toBeVisible();
});
