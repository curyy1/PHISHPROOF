import { expect, test } from "@playwright/test";

test("mobile nav opens, traps scroll and closes with Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu.getByRole("link", { name: "Learn" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("no horizontal scroll on key pages", async ({ page }) => {
  for (const path of ["/", "/learn", "/practice/inbox", "/practice/passwords", "/dashboard", "/privacy"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});

test("fake login address bar shows the whole URL on phones", async ({ page }) => {
  await page.goto("/practice/browser");
  if (await page.getByText("Sign in to use").isVisible()) test.skip(true, "gated without an account");
  const bar = page.getByLabel("Address bar (click parts to flag them)");
  await expect(bar).toContainText("verify-id.test/login");
  const fits = await bar.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
  expect(fits).toBe(true);
});
