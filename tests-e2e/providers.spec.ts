import { test, expect } from '@playwright/test';

test.describe('Providers page (/provider)', () => {
  test('renders the page header', async ({ page }) => {
    await page.goto('/provider');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /providers/i })).toBeVisible();
    await expect(page.getByText(/premium selection/i)).toBeVisible();
  });

  test('shows verified-partner count or an error/empty state', async ({ page }) => {
    await page.goto('/provider');
    await page.waitForLoadState('networkidle');

    const verifiedBadge = page.getByText(/verified partners/i);
    const errorState = page.locator('text=/failed to load|error/i');

    await expect(verifiedBadge.or(errorState)).toBeVisible({ timeout: 15_000 });
  });

  test('clicking a provider card navigates to its detail page', async ({ page }) => {
    await page.goto('/provider');
    await page.waitForLoadState('networkidle');

    const providerLinks = page.locator('a[href^="/provider/"]');
    const count = await providerLinks.count();
    test.skip(count === 0, 'No providers rendered — skipping detail navigation check.');

    await providerLinks.first().click();
    await page.waitForURL(/\/provider\/[^/]+/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/provider\/[^/]+/);
  });
});
