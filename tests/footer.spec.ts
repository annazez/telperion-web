import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the footer with correct copyright text", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const currentYear = new Date().getFullYear().toString();
    const copyrightText = footer.locator("p");

    await expect(copyrightText).toContainText(currentYear);
    await expect(copyrightText).toContainText("Telperion z.s");
  });

  test("should have the glass-card styling class", async ({ page }) => {
    const glassCard = page.locator("footer .glass-card");
    await expect(glassCard).toBeVisible();

    await expect(glassCard).toHaveClass(/glass-card/);
  });

  test("should show privacy link without social links", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();

    const privacyLink = footer.getByRole("link", { name: "Soukromí" });

    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute(
      "href",
      "/ochrana-osobnich-udaju",
    );

    await expect(footer.getByRole("link", { name: "Instagram" })).toHaveCount(
      0,
    );
    await expect(footer.getByRole("link", { name: "YouTube" })).toHaveCount(0);
  });
});
