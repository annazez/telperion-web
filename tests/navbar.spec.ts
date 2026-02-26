import { test, expect } from '@playwright/test';

test.describe('Navbar Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

  test('should toggle mobile menu and icons correctly', async ({ page }) => {
    await page.goto('/test/navbar-test');

    const menuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    // Initial state
    await expect(mobileMenu).toBeHidden();

    // Check for aria-expanded (new requirement)
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    // Check icons visibility (assuming new implementation classes)
    const hamburger = menuBtn.locator('svg.hamburger-icon');
    const close = menuBtn.locator('svg.close-icon');

    await expect(hamburger).toBeVisible();
    await expect(close).toBeHidden();

    // Click to open
    await menuBtn.click();

    await expect(mobileMenu).toBeVisible();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(hamburger).toBeHidden();
    await expect(close).toBeVisible();

    // Click to close
    await menuBtn.click();

    await expect(mobileMenu).toBeHidden();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(hamburger).toBeVisible();
    await expect(close).toBeHidden();
  });
});
