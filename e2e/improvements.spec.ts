import { expect, test } from "@playwright/test";

test("branded 404 page", async ({ page }) => {
  const res = await page.goto("/definitely-not-here");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This link went nowhere." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to the course" })).toBeVisible();
});

test("quiz Exit returns to the current module", async ({ page }) => {
  await page.goto("/learn/what-is-phishing/quiz");
  await page.getByTestId("start-quiz").click();
  await expect(page.getByRole("link", { name: "Exit" })).toHaveAttribute("href", "/learn/what-is-phishing");
});

test("tapping a simulated link previews its real destination", async ({ page }) => {
  await page.goto("/practice/inbox");
  await page.locator('[data-flag-id="l1"] span').first().click();
  await expect(page.getByText("lumenbank.example.verify-id.test/login")).toBeVisible();
});

test("flash message after redirects", async ({ page }) => {
  await page.goto("/?deleted=1");
  await expect(page.getByText("Account deleted")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("sitemap, robots and share image", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const og = await request.get("/opengraph-image");
  expect(og.headers()["content-type"]).toContain("image/png");
});
