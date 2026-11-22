import { test, expect } from "@playwright/test";
test("Production login offers Buyer, Seller and Admin without registration", async ({
  page,
}) => {
  await page.goto("/login");
  for (const name of [
    "Demo Buyer – Doanh nghiệp",
    "Demo Seller – Nhà cung cấp",
    "Demo Admin – Quản trị",
  ])
    await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
});
for (const role of ["seller", "admin"] as const) {
  test(`${role} demo is isolated, survives refresh and never calls live data APIs`, async ({
    page,
  }) => {
    const remote: string[] = [];
    page.on("request", (r) => {
      if (
        r.url().includes("unit.supabase.co") ||
        new URL(r.url()).pathname.startsWith("/api/")
      )
        remote.push(r.url());
    });
    await page.addInitScript(() => {
      localStorage.setItem(
        "polymatch_database_v3",
        JSON.stringify({ privateSentinel: "private" }),
      );
      localStorage.setItem("polymatch_active_session_user", "private-session");
    });
    await page.goto(`/${role}/dashboard?demo=${role}`);
    await expect(
      page.getByRole("button", { name: "Thoát Demo", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("DEMO 3 VAI TRÒ · DỮ LIỆU GIẢ LẬP", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`/${role}/dashboard`));
    expect(remote).toEqual([]);
    expect(
      await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("polymatch_database_v3")!)
            .privateSentinel,
      ),
    ).toBe("private");
    expect(
      await page.evaluate(() =>
        localStorage.getItem("polymatch_active_session_user"),
      ),
    ).toBe("private-session");
    // Exit must remove the sandbox marker and return to ordinary Production login.
    await page.getByRole("button", { name: "Thoát Demo", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(
      await page.evaluate(() =>
        sessionStorage.getItem("polymatch_public_demo_role_v1"),
      ),
    ).toBeNull();
  });
}

for (const role of ["seller", "admin"] as const) {
  test(`${role} chatbot reads shared approved knowledge through the limited Demo chat endpoint`, async ({
    page,
  }) => {
    let queried = false;
    await page.route("**/api/demo-chat", async (route) => {
      const body = route.request().postDataJSON();
      expect(body.question).toBe("TMS là gì?");
      queried = true;
      await route.fulfill({
        json: {
          answer: "TMS giúp điều phối vận tải từ tài liệu chung.",
          intent: "technology",
          strategy: "rag",
          router: "rules",
          mode: "rag",
          retrievedAt: "2026-11-22T10:00:00Z",
          sources: [],
          claims: [],
          warnings: [],
          handoff: false,
        },
      });
    });
    await page.goto(`/${role}/dashboard?demo=${role}`);
    await page.getByRole("button", { name: "Chat CSKH", exact: true }).click();
    await page
      .getByRole("textbox", { name: "Câu hỏi", exact: true })
      .fill("TMS là gì?");
    await page
      .getByRole("button", { name: "Gửi câu hỏi", exact: true })
      .click();
    await expect(
      page.getByText("TMS giúp điều phối vận tải từ tài liệu chung.", {
        exact: true,
      }),
    ).toBeVisible();
    expect(queried).toBe(true);
  });
}
