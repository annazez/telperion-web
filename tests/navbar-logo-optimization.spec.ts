import { test, expect } from "@playwright/test";

test.describe("Navbar Logo Optimization", () => {
  test('should have fetchpriority="high" and loading="eager" on the navbar logo', async ({
    page,
  }) => {
    await page.goto("/");

    // Locate the logo image in the Navbar
    const navbarLogo = page.locator('header img[alt="Telperion Logo"]');

    await expect(navbarLogo).toBeVisible();

    // These are expected to fail before implementation
    await expect(navbarLogo).toHaveAttribute("fetchpriority", "high");
    await expect(navbarLogo).toHaveAttribute("loading", "eager");
  });
});
