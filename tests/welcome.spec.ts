import { test, expect } from '@playwright/test';

test('Welcome component renders correctly', async ({ page }) => {
  await page.goto('/test-welcome');

  // Check for the main hero section
  await expect(page.locator('#hero')).toBeVisible();

  // Check for the heading text
  await expect(page.locator('h1')).toContainText('To get started');

  // Check for the Astro logo
  const logo = page.locator('img[alt="Astro Homepage"]');
  await expect(logo).toBeVisible();

  // Check for the "Read our docs" button
  const docsLink = page.getByRole('link', { name: 'Read our docs' });
  await expect(docsLink).toBeVisible();
  await expect(docsLink).toHaveAttribute('href', 'https://docs.astro.build');
});
