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
