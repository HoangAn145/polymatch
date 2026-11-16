import { test, expect, type Page } from "@playwright/test";
import { diagnose, questionsFor } from "../../src/lib/diagnostic";
const id = "00000000-0000-0000-0000-000000000001";
async function login(page: Page, role = "BUYER") {
  const user = {
    id,
    aud: "authenticated",
    role: "authenticated",
    email: "buyer@example.test",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  await page.addInitScript(() =>
    localStorage.setItem(
      "polymatch_database_v3",
      '{"sentinel":"original-data-kept"}',
    ),
  );
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
  let assessments: unknown[] = [];
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
        created_at: user.created_at,
      };
    if (url.pathname === "/rest/v1/enterprises") data = null;
    if (url.pathname === "/rest/v1/assessments") data = assessments;
    await route.fulfill({
      json: data,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
      },
    });
  });
  await page.route("**/api/diagnostic", async (route) => {
    const result = diagnose(route.request().postDataJSON());
    const row = {
      id: "00000000-0000-0000-0000-000000000010",
      created_at: "2026-11-16T12:00:00Z",
      result,
    };
    assessments = [row];
    await route.fulfill({ json: row });
  });
}
test("buyer uses the original wizard, results, matching, history, roadmap and ROI", async ({
  page,
}) => {
  await login(page);
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/buyer\/dashboard$/);
  expect(
    await page.evaluate(() => localStorage.getItem("polymatch_database_v3")),
  ).toBe('{"sentinel":"original-data-kept"}');
  for (const path of [
    "/buyer/profile",
    "/buyer/compare",
    "/buyer/connections",
    "/buyer/reports",
    "/buyer/consulting",
    "/buyer/projects",
    "/buyer/settings",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await expect(page.locator("main")).toBeVisible();
  }
  await page.goto("/buyer/results");
  await expect(page.getByText("Chưa có đánh giá của bạn.")).toBeVisible();
  await page.goto("/buyer/assessment");
  await expect(page.getByRole("region", { name: "KPI đầu vào" })).toBeVisible();
  await page.getByText("Chuyển đổi số chung (DBI)", { exact: true }).click();
  for (const q of questionsFor("VT").filter((q) => q.phan === "dbi"))
    await page
      .locator(`[data-question-id="${q.id}"]`)
      .getByRole("button")
      .nth(2)
      .click();
  await page.getByText("Năng lực Logistics (LDMI)", { exact: true }).click();
  for (const q of questionsFor("VT").filter((q) => q.phan === "ldmi"))
    await page
      .locator(`[data-question-id="${q.id}"]`)
      .getByRole("button")
      .nth(2)
      .click();
  await page.getByText("Kiểm tra & Nộp bài", { exact: true }).click();
  await page
    .getByRole("button", { name: "Xác nhận Nộp bài đánh giá", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Đồng ý nộp bài", exact: true })
    .click();
  await expect(page).toHaveURL(/\/buyer\/results$/);
  await expect(
    page.getByRole("heading", {
      name: "Báo cáo Chẩn đoán Mức độ Trưởng thành số & Điểm nghẽn",
    }),
  ).toBeVisible();
  await page.goto("/buyer/solutions");
  await expect(page.getByText(/Giải thích bộ lọc:/)).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Giải pháp công nghệ được đề xuất theo điểm nghẽn",
    }),
  ).toBeVisible();
  await page.goto("/buyer/history");
  await expect(page.getByText("Lần đánh giá thứ 1")).toBeVisible();
  await page.goto("/buyer/roadmap");
  await expect(
    page.getByRole("heading", { name: "Lộ trình triển khai 12 tuần" }),
  ).toBeVisible();
  await expect(
    page.getByText("Tuần 1–2: Chuẩn hóa dữ liệu & nguồn lực"),
  ).toBeVisible();
  await page.goto("/buyer/roi");
  await expect(
    page.getByRole("heading", {
      name: "Mô phỏng Hiệu quả Đầu tư (ROI Simulator)",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Cơ sở", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".recharts-responsive-container")).toBeVisible();
});
test("seller retains the original dashboards, quotes, contracts and solution pages", async ({
  page,
}) => {
  await login(page, "SELLER");
  for (const path of [
    "/seller/dashboard",
    "/seller/profile",
    "/seller/verification",
    "/seller/solutions",
    "/seller/solutions/new",
    "/seller/requests",
    "/seller/quotes",
    "/seller/contracts",
    "/seller/commission",
    "/seller/subscription",
    "/seller/analytics",
    "/seller/settings",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await expect(page.locator("main")).toBeVisible();
  }
  await page.goto("/buyer/dashboard");
  await expect(page).toHaveURL(/\/seller\/dashboard$/);
});
test("admin retains old administration and gains knowledge and customer support", async ({
  page,
}) => {
  await login(page, "ADMIN");
  for (const path of [
    "/admin/dashboard",
    "/admin/users",
    "/admin/sellers",
    "/admin/solutions",
    "/admin/experts",
    "/admin/consulting",
    "/admin/questions",
    "/admin/connections",
    "/admin/transactions",
    "/admin/articles",
    "/admin/config",
    "/admin/audit",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await expect(page.locator("main")).toBeVisible();
  }
  await page.goto("/admin/knowledge");
  await expect(
    page.getByRole("heading", { name: "Tri thức chatbot" }),
  ).toBeVisible();
  await page.goto("/admin/support");
  await expect(
    page.getByRole("heading", { name: "Quản lý yêu cầu" }),
  ).toBeVisible();
  await page.goto("/buyer/assessment");
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
});
