import { test, expect } from '@playwright/test';

test.describe('Car gallery (/car)', () => {
  test('renders the page header', async ({ page }) => {
    await page.goto('/car');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /premium/i })).toBeVisible();
    await expect(page.getByText(/our fleet/i)).toBeVisible();
    await expect(page.getByText(/active inventory/i)).toBeVisible();
  });

  test('shows either a car list or an empty state', async ({ page }) => {
    await page.goto('/car');
    await page.waitForLoadState('networkidle');

    const carLinks = page.locator('a[href^="/car/"]');
    const emptyState = page.getByText(/no vehicles currently in stock/i);

    // Either some cars are listed, or the empty-state placeholder is shown.
    const hasCars = (await carLinks.count()) > 0;
    if (hasCars) {
      await expect(carLinks.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test('alerts when guest tries to add to wishlist', async ({ page }) => {
    await page.goto('/car');
    await page.waitForLoadState('networkidle');

    const wishlistButtons = page
      .locator('button')
      .filter({ has: page.locator('svg path[d^="M20.84 4.61"]') });

    const count = await wishlistButtons.count();
    test.skip(count === 0, 'No cars rendered — skipping guest wishlist alert check.');

    let alertMessage: string | null = null;
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    await wishlistButtons.first().click();
    await expect.poll(() => alertMessage, { timeout: 5_000 }).toMatch(/log in|please/i);
  });
});
