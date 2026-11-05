import { expect, test, type Page } from "@playwright/test";

const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

async function completeFirstLesson(page: Page) {
  await page.goto("/learn/what-is-phishing/phishing-101");
  await expect(page.getByRole("heading", { level: 1, name: "Phishing in one minute" })).toBeVisible();
  await page.getByTestId("complete-lesson").click();
  await page.waitForURL("**/learn/what-is-phishing/why-phishing-works");
}

async function expectProgressOnDashboard(page: Page) {
  await page.goto("/dashboard");
  await expect(page.getByTestId("xp-total")).toContainText("20");
  await expect(page.getByText("Finished “Phishing in one minute”")).toBeVisible();
  await expect(page.getByTestId("continue")).toHaveAttribute("href", "/learn/what-is-phishing/why-phishing-works");
}

test.describe("smoke: learn → progress", () => {
  test("guest completes a lesson and sees progress", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Don’t take");
    await completeFirstLesson(page);
    await expectProgressOnDashboard(page);
  });

  test("sign up → complete a lesson → see progress (real Supabase)", async ({ page }) => {
    test.skip(!supabaseConfigured, "Set NEXT_PUBLIC_SUPABASE_URL/keys (with email confirmation off) to run against Supabase");
    const email = `e2e+${Date.now()}@example.com`;
    await page.goto("/signup?next=/dashboard");
    await page.getByLabel("Display name").fill("E2E Tester");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("orbit maple crayon thunder sofa");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Create free account" }).click();
    await page.waitForURL("**/dashboard**");
    await completeFirstLesson(page);
    await expectProgressOnDashboard(page);
    // Clean up: delete the test account.
    await page.goto("/account");
    await page.getByLabel(/Type "DELETE"/).fill("DELETE");
    await page.getByRole("button", { name: "Delete my account" }).click();
    await page.waitForURL("**/?deleted=1");
  });
});

test("Spot the Phish grades an email and shows found/missed flags", async ({ page }) => {
  await page.goto("/practice/inbox");
  await page.locator('[data-flag-id="from"]').click();
  await page.getByTestId("verdict-phish").click();
  const fb = page.getByTestId("drill-feedback");
  await expect(fb).toContainText("Correct");
  await expect(fb).toContainText("Red flags you found (1/5)");
  await expect(fb).toContainText("Red flags you missed (4)");
});

test("module quiz shows explanations and a score", async ({ page }) => {
  await page.goto("/learn/what-is-phishing/quiz");
  await page.getByTestId("start-quiz").click();
  for (let i = 0; i < 6; i++) {
    await page.getByTestId("option-1").click();
    await expect(page.getByRole("status").filter({ hasText: /Correct!|Not quite/ })).toBeVisible();
    await page.getByTestId("next-question").click();
  }
  await expect(page.getByRole("heading", { name: /passed|Almost there|Perfect/ })).toBeVisible();
});

test("Password Lab never sends typed passwords over the network", async ({ page }) => {
  const secret = "correct-horse-UNIQUE-7731";
  const leaks: string[] = [];
  page.on("request", (r) => {
    const body = r.postData() ?? "";
    if (r.url().includes(secret) || body.includes(secret)) leaks.push(r.url());
  });
  await page.goto("/practice/passwords");
  await page.getByLabel("Try a password or passphrase").fill(secret);
  await expect(page.getByText(/Very weak|Weak|Fair|Strong|Very strong/).first()).toBeVisible();
  await page.waitForTimeout(1500);
  expect(leaks).toEqual([]);
});

test("simulated login pages can't submit anything", async ({ page }) => {
  await page.goto("/practice/browser");
  if (await page.getByText("Sign in to use").isVisible()) test.skip(true, "gated without an account");
  await expect(page.getByText("Training simulation").first()).toBeVisible();
  await expect(page.getByLabel("Password (disabled in simulation)")).toBeDisabled();
  await expect(page.getByLabel("Email (disabled in simulation)")).toBeDisabled();
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("verify page rejects unknown certificates", async ({ page }) => {
  await page.goto("/verify/PP-AAAA-BBBB-CCCC");
  await expect(page.getByText("No certificate found")).toBeVisible();
});
