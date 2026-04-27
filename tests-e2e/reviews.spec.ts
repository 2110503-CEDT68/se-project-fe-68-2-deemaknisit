import { test, expect } from '@playwright/test';

test.describe('Reviews page (/reviews)', () => {
  test('renders the reviews page header for guests', async ({ page }) => {
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /reviews/i })).toBeVisible();
    await expect(page.getByText(/community feedback/i)).toBeVisible();
  });

  test('shows All Feedbacks and My Posts tabs', async ({ page }) => {
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: /all feedbacks/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /my posts/i })).toBeVisible();
  });

  test('"My Posts" tab prompts guests to sign in', async ({ page }) => {
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /my posts/i }).click();

    await expect(
      page.getByText(/sign in to view your reviews/i),
    ).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('shows reviews list or an empty/error state on All tab', async ({ page }) => {
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');

    const reviewsGrid = page.locator('div.grid').first();
    const noReviews = page.getByText(/no reviews available/i);
    const errorState = page.getByText(/error loading reviews/i);

    await expect(reviewsGrid.or(noReviews).or(errorState)).toBeVisible({
      timeout: 15_000,
    });
  });
});
