import { test, expect } from '@playwright/test';

test.describe('Top navigation', () => {
  test('shows brand and core nav items when logged out', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /ratatouille/i })).toBeVisible();

    for (const label of ['Providers', 'Cars', 'Bookings', 'Reviews', 'Wishlist']) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }

    await expect(nav.getByRole('link', { name: /login/i })).toBeVisible();
  });

  test('Providers nav item navigates to /provider', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').first().getByText('Providers', { exact: true }).click();
    await page.waitForURL('**/provider', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/provider$/);
  });

  test('Cars nav item navigates to /car', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').first().getByText('Cars', { exact: true }).click();
    await page.waitForURL('**/car', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/car$/);
  });

  test('Reviews nav item navigates to /reviews', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav').first().getByText('Reviews', { exact: true }).click();
    await page.waitForURL('**/reviews', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/reviews$/);
  });
});
