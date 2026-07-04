import { test, expect } from "@playwright/test";

test.describe("Social links page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("is linked from the Czech desktop navbar", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile === true, "Desktop navigation is not visible on mobile");

    await page.goto("/");

    const socialLink = page
      .locator("nav.hidden.lg\\:flex")
      .getByRole("link", { name: "Sítě" });

    await expect(socialLink).toBeVisible();
    await expect(socialLink).toHaveAttribute("href", "/socialni-site");
  });

  test("shows Czech social links", async ({ page }) => {
    await page.goto("/socialni-site");

    await expect(page).toHaveTitle(/Sociální sítě \| Telperion/);
    await expect(page.locator("body")).toContainText(
      "Jsme na sociálních sítích",
    );

    await expect(
      page.getByRole("link", { name: /Instagram CZ/ }),
    ).toHaveAttribute("href", "https://www.instagram.com/telperion.cz/");
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/telperion-nonprofit/",
    );
    await expect(page.getByRole("link", { name: /YouTube/ })).toHaveAttribute(
      "href",
      "https://www.youtube.com/@telperion-cz/",
    );
  });

  test("shows English social links and hreflang route", async ({ page }) => {
    await page.goto("/en/social-media");

    await expect(page).toHaveTitle(/Social Media \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const csAlternate = page.locator('link[rel="alternate"][hreflang="cs"]');
    await expect(csAlternate).toHaveAttribute(
      "href",
      "https://www.telperion.cz/socialni-site",
    );
  });
});
