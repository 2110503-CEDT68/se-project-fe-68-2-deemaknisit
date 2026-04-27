import { test, expect } from '@playwright/test';
import { loginAndExpectHome } from './helpers/auth';

test.describe('Wishlist page (/wishlist)', () => {
  test('guests are prompted to sign in', async ({ page }) => {
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: /please sign in first/i }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('link', { name: /sign in to continue/i })).toBeVisible();
  });

  test('logged-in user lands on the wishlist page', async ({ page }) => {
    await loginAndExpectHome(page);
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /wishlist/i })).toBeVisible({
      timeout: 10_000,
    });

    const emptyState = page.getByText(/your wishlist is currently empty/i);
    const wishlistCards = page.locator('article');
    await expect(emptyState.or(wishlistCards.first())).toBeVisible({
      timeout: 10_000,
    });
  });
});
