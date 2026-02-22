import { test, expect } from '@playwright/test';

test.describe('Layout', () => {
  test('should have correct html lang attribute', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'cs');
  });
});
