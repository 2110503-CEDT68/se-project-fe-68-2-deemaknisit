import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero banner and CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /rental/i })).toBeVisible();
    await expect(page.getByText(/drive your journey/i)).toBeVisible();

    const browseCars = page.getByRole('link', { name: /browse cars/i }).first();
    await expect(browseCars).toBeVisible();
    await expect(browseCars).toHaveAttribute('href', '/car');
  });

  test('"Browse Cars" CTA navigates to the car gallery', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /browse cars/i }).first().click();
    await page.waitForURL('**/car', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/car$/);
  });
});
