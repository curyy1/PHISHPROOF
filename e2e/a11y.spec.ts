import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/learn",
  "/learn/what-is-phishing",
  "/learn/reading-links/url-anatomy",
  "/learn/what-is-phishing/quiz",
  "/practice",
  "/practice/inbox",
  "/practice/sms",
  "/practice/browser",
  "/practice/urls",
  "/practice/passwords",
  "/dashboard",
  "/leaderboard",
  "/privacy",
  "/login",
  "/signup",
  "/verify",
  "/teach",
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`axe (${theme})`, () => {
    test.use({ colorScheme: theme });
    for (const path of pages) {
      test(`${path} has no serious accessibility violations`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2200); // let entrance fades finish so contrast is measured at full opacity
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(
          serious.map((v) => `${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`),
        ).toEqual([]);
      });
    }
  });
}
