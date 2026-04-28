import { expect, test } from '@playwright/test';
import { WISHLIST_ITEM } from './helpers/fixtures';
import { mockAppApi } from './helpers/mocks';

test.describe('Wishlist system', () => {
  test('shows sign-in prompt when unauthenticated', async ({ page }) => {
    await mockAppApi(page, { authenticated: false });

    await page.goto('/wishlist');

    await expect(page.locator('#wishlist-auth-signin-link')).toBeVisible();
    await expect(page.getByText('Please sign in first')).toBeVisible();
  });

  test('renders saved wishlist cards for authenticated user', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      wishlist: [WISHLIST_ITEM],
    });

    await page.goto('/wishlist');

    await expect(page.getByRole('heading', { name: /My Wishlist/i })).toBeVisible();
    await expect(page.locator('#wishlist-card-link-car-e2e-001')).toBeVisible();
    await expect(page.locator('#wishlist-remove-button-car-e2e-001')).toBeVisible();
  });

  test('removes an item from wishlist and shows success notification', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      wishlist: [WISHLIST_ITEM],
    });

    await page.goto('/wishlist');
    await page.click('#wishlist-remove-button-car-e2e-001');

    await expect(page.locator('#notification-dialog')).toBeVisible();
    await expect(page.locator('#notification-dialog-message')).toContainText('removed from your wishlist');
  });

  test('shows error notification when remove fails', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      wishlist: [WISHLIST_ITEM],
      failWishlistDelete: true,
    });

    await page.goto('/wishlist');
    await page.click('#wishlist-remove-button-car-e2e-001');

    await expect(page.locator('#notification-dialog')).toBeVisible();
    await expect(page.locator('#notification-dialog-message')).toContainText('Failed to remove item');
  });

  test('wishlist card view link points to car detail', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      wishlist: [WISHLIST_ITEM],
    });

    await page.goto('/wishlist');

    const viewLink = page.locator('#wishlist-view-car-link-car-e2e-001');
    await expect(viewLink).toBeVisible();
    await expect(viewLink).toHaveAttribute('href', '/car/car-e2e-001');
  });

  test('shows empty state when wishlist has no items', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      wishlist: [],
    });

    await page.goto('/wishlist');

    await expect(page.getByText('Your wishlist is currently empty.')).toBeVisible();
    await expect(page.locator('#wishlist-browse-cars-link')).toBeVisible();
  });
});