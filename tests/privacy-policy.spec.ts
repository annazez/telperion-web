import { test, expect } from "@playwright/test";

test.describe("Privacy policy", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("shows Czech privacy policy and footer link", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const privacyLink = footer.getByRole("link", { name: "Soukromí" });
    await expect(privacyLink).toHaveAttribute(
      "href",
      "/ochrana-osobnich-udaju",
    );

    await page.goto("/ochrana-osobnich-udaju");
    await expect(page).toHaveURL(/\/ochrana-osobnich-udaju\/?$/);
    await expect(page).toHaveTitle(/Ochrana osobních údajů \| Telperion/);
    await expect(page.locator("body")).toContainText("Správce údajů");
    await expect(page.locator("body")).toContainText("Telperion, z.s.");
    await expect(page.locator("body")).toContainText("Sentry");
    await expect(page.locator("body")).toContainText(
      "nezobrazujeme cookie banner s volbou souhlasu",
    );
  });

  test("shows English privacy policy and hreflang route", async ({ page }) => {
    await page.goto("/en/privacy-policy");

    await expect(page).toHaveTitle(/Privacy Policy \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const csAlternate = page.locator('link[rel="alternate"][hreflang="cs"]');
    await expect(csAlternate).toHaveAttribute(
      "href",
      "https://www.telperion.cz/ochrana-osobnich-udaju",
    );
  });
});
