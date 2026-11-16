import { test, expect } from "@playwright/test";
test("production requires real auth, hides demo identity switching, and protects workspace", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Đăng nhập POLYMATCH" }),
  ).toBeVisible();
  await expect(
    page.getByText("Chưa cấu hình Supabase cho ứng dụng."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText("Điền nhanh tài khoản diễn tập (Demo)"),
  ).toHaveCount(0);
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/admin/users");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Chat CSKH" }).click();
  await expect(
    page.getByRole("region", { name: "Chatbot CSKH" }),
  ).toBeVisible();
  await expect(
    page.getByText("để trao đổi và theo dõi yêu cầu."),
  ).toBeVisible();
});
test("mobile auth fits viewport and registration requires password", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/register");
  await expect(
    page.getByRole("heading", { name: "Đăng ký POLYMATCH" }),
  ).toBeVisible();
  await expect(page.getByLabel("Mật khẩu", { exact: true })).toHaveAttribute(
    "minlength",
    "8",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
