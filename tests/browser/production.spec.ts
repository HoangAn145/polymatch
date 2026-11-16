import { test, expect } from "@playwright/test";
test("original auth UI remains, missing configuration fails closed, and protected routes stay protected", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Đăng nhập Cổng thông tin POLYMATCH" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Chưa cấu hình Supabase");
  await expect(page.locator("form button[type=submit]")).toBeDisabled();
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
});
test("original registration choice and both full registration forms remain", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/register");
  await expect(
    page.getByRole("heading", { name: "Chọn loại tài khoản đăng ký" }),
  ).toBeVisible();
  await page.goto("/register/buyer");
  await expect(
    page.locator("form input[type=password]").first(),
  ).toHaveAttribute("minlength", "8");
  await expect(
    page.getByText("Mã số thuế", { exact: false }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/register/seller");
  await expect(
    page.locator("form input[type=password]").first(),
  ).toHaveAttribute("minlength", "8");
  await expect(
    page.getByRole("heading", { name: /Đăng ký tài khoản Nhà cung cấp/ }),
  ).toBeVisible();
});
