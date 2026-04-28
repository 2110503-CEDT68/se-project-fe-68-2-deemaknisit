import { expect, test } from '@playwright/test';
import { COMPLETED_BOOKING, REVIEW_ITEM } from './helpers/fixtures';
import { mockAppApi } from './helpers/mocks';

test.describe('Review system', () => {
  test('submits a review from completed booking', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      bookings: [{ ...COMPLETED_BOOKING, review: null }],
      reviews: [],
    });

    await page.goto('/bookings');
    await expect(page.getByText('Toyota Camry')).toBeVisible();

    await page.click('#booking-review-button-booking-e2e-001');
    await expect(page.locator('#review-dialog')).toBeVisible();

    await page.fill('#review-comment-input', 'Great booking experience.');
    await page.click('#review-submit-button');

    await expect(page.locator('#review-dialog')).not.toBeVisible();
    await expect(page.locator('#booking-review-comment-booking-e2e-001')).toContainText(
      'Great booking experience.'
    );
  });

  test('validates empty comment before submit', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      bookings: [{ ...COMPLETED_BOOKING, review: null }],
      reviews: [],
    });

    await page.goto('/bookings');
    await page.click('#booking-review-button-booking-e2e-001');
    await page.click('#review-submit-button');

    await expect(page.locator('#review-comment-helper')).toContainText(
      'Please share your thoughts - we require your comment!'
    );
  });

  test('edits review from personal reviews tab', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      reviews: [REVIEW_ITEM],
    });

    await page.goto('/reviews');
    await page.click('#reviews-tab-personal-button');

    await expect(page.locator('#review-list-edit-button-review-e2e-001')).toBeVisible();
    await page.click('#review-list-edit-button-review-e2e-001');

    await page.fill('#review-comment-input', 'Updated review from Playwright.');
    await page.click('#review-submit-button');

    await expect(page.locator('#notification-dialog')).toBeVisible();
    await expect(page.locator('#notification-dialog-message')).toContainText('updated successfully');
  });

  test('deletes review from personal reviews tab', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      reviews: [REVIEW_ITEM],
    });

    await page.goto('/reviews');
    await page.click('#reviews-tab-personal-button');

    await expect(page.locator('#review-list-delete-button-review-e2e-001')).toBeVisible();
    await page.click('#review-list-delete-button-review-e2e-001');

    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();

    await expect(page.locator('#notification-dialog')).toBeVisible();
    await expect(page.locator('#notification-dialog-message')).toContainText('removed successfully');
  });

  test('cancel delete keeps review visible', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      reviews: [REVIEW_ITEM],
    });

    await page.goto('/reviews');
    await page.click('#reviews-tab-personal-button');

    await page.click('#review-list-delete-button-review-e2e-001');
    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.locator('#review-list-comment-review-e2e-001')).toContainText(
      'Smooth pickup and clean car.'
    );
  });

  test('shows review card in all feedback tab', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: true,
      reviews: [REVIEW_ITEM],
    });

    await page.goto('/reviews');

    await expect(page.locator('#reviews-tab-all-button')).toBeVisible();
    await expect(page.locator('#review-list-comment-review-e2e-001')).toContainText(
      'Smooth pickup and clean car.'
    );
  });

  test('asks unauthenticated users to sign in for personal reviews', async ({ page }) => {
    await mockAppApi(page, {
      authenticated: false,
      reviews: [REVIEW_ITEM],
    });

    await page.goto('/reviews');
    await page.click('#reviews-tab-personal-button');

    await expect(page.locator('#reviews-signin-link')).toBeVisible();
    await expect(page.getByText('Sign in to view your reviews')).toBeVisible();
  });
});
