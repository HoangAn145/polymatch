import { test, expect, type Page } from "@playwright/test";
import { diagnose } from "../../src/lib/diagnostic";
async function login(page: Page, role = "BUYER") {
  const id = "00000000-0000-0000-0000-000000000001";
  const user = {
    id,
    aud: "authenticated",
    role: "authenticated",
    email: "buyer@example.test",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  await page.addInitScript(
    ({ user }) =>
      localStorage.setItem(
        "sb-unit-auth-token",
        JSON.stringify({
          access_token: "mock-token",
          refresh_token: "mock-refresh",
          expires_at: 4000000000,
          expires_in: 3600,
          token_type: "bearer",
          user,
        }),
      ),
    { user },
  );
  await page.route("https://unit.supabase.co/**", async (route) => {
    const url = new URL(route.request().url());
    let data: unknown = [];
    if (url.pathname === "/rest/v1/profiles")
      data = {
        id,
        role,
        status: "active",
        full_name: "Test User",
        company_name: "Test Logistics",
        email: user.email,
      };
    if (url.pathname === "/rest/v1/enterprises") data = null;
    await route.fulfill({
      json: data,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
      },
    });
  });
}
test("buyer completes diagnostic, sees matching, roadmap gating, and ROI", async ({
  page,
}) => {
  await login(page);
  await page.route("**/api/diagnostic", async (route) => {
    const result = diagnose(route.request().postDataJSON());
    await route.fulfill({
      json: { id: "assessment-1", created_at: "2026-11-16T12:00:00Z", result },
    });
  });
  await page.goto("/workspace");
  await expect(
    page.getByRole("heading", { name: "Hồ sơ, KPI đầu vào & đánh giá" }),
  ).toBeVisible();
  for (const select of await page.locator("select[required]").all())
    await select.selectOption("3");
  await page.getByRole("button", { name: "Lưu & chẩn đoán" }).click();
  await expect(
    page.getByText("Đã lưu đánh giá và giải thích kết quả."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Matching & lý do" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lộ trình & nguồn lực" }).click();
  await expect(
    page.getByText("Hoàn thành đánh giá để tạo lộ trình."),
  ).toBeVisible(); // mock server has no persisted rows
  await page.getByRole("button", { name: "Mô phỏng ROI" }).click();
  await expect(
    page.getByRole("cell", { name: "Cơ sở", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "10 tháng", exact: true }),
  ).toBeVisible();
});
test("admin sees knowledge management and no buyer diagnostic tab", async ({
  page,
}) => {
  await login(page, "ADMIN");
  await page.goto("/workspace");
  await expect(
    page.getByRole("heading", { name: "Tri thức chatbot" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Diagnostic & Matching", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Quản lý yêu cầu" }).click();
  await expect(page.getByText("Chưa có yêu cầu.")).toBeVisible();
});
