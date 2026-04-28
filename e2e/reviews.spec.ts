import { test, expect } from '@playwright/test';
import { loginAndExpectHome } from './helpers/auth';

test.describe('Epic 1 - Review System', () => {
  test.describe.configure({ mode: 'serial' });

  let targetBookingId: string | null = null;
  let createdComment = '';
  let updatedComment = '';
  let submitExecuted = false;

  test('US1-1 · Submit a Review', async ({ page }) => {
    await loginAndExpectHome(page);
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');

    const reviewButtons = page.locator('[id^="booking-review-button-"]');
    const reviewButtonCount = await reviewButtons.count();
    test.skip(reviewButtonCount === 0, 'No completed booking without review found for this account.');

    const firstReviewButton = reviewButtons.first();
    const buttonId = await firstReviewButton.getAttribute('id');
    targetBookingId = buttonId?.replace('booking-review-button-', '') ?? null;
    test.skip(!targetBookingId, 'Could not resolve booking ID from review button.');

    createdComment = `E2E review created ${Date.now()}`;

    await firstReviewButton.click();
    await expect(page.locator('#review-dialog')).toBeVisible();
    await page.fill('#review-comment-input', createdComment);
    await page.click('#review-submit-button');

    await expect(page.locator('#review-dialog')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`#booking-review-comment-${targetBookingId}`)).toContainText(createdComment);
    submitExecuted = true;
  });

  test('US1-2 · View Review History', async ({ page }) => {
    test.skip(!submitExecuted || !targetBookingId, 'Submit review step did not run.');

    await loginAndExpectHome(page);
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');
    await page.click('#reviews-tab-personal-button');

    await expect(page.locator('#reviews-tab-personal-button')).toBeVisible();
    await expect(page.getByText(createdComment)).toBeVisible({ timeout: 10_000 });
  });

  test('US1-3 · Edit a Review', async ({ page }) => {
    test.skip(!submitExecuted || !targetBookingId, 'Submit review step did not run.');

    await loginAndExpectHome(page);
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');

    const editButton = page.locator(`#booking-review-edit-button-${targetBookingId}`);
    await expect(editButton).toBeVisible({ timeout: 10_000 });

    updatedComment = `E2E review updated ${Date.now()}`;
    await editButton.click();
    await expect(page.locator('#review-dialog')).toBeVisible();
    await page.fill('#review-comment-input', updatedComment);
    await page.click('#review-submit-button');

    await expect(page.locator('#review-dialog')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`#booking-review-comment-${targetBookingId}`)).toContainText(updatedComment);
  });

  test('US1-4 · Delete a Review', async ({ page }) => {
    test.skip(!submitExecuted || !targetBookingId, 'Submit review step did not run.');

    await loginAndExpectHome(page);
    await page.goto('/bookings');
    await page.waitForLoadState('networkidle');

    const deleteButton = page.locator(`#booking-review-delete-button-${targetBookingId}`);
    await expect(deleteButton).toBeVisible({ timeout: 10_000 });
    await deleteButton.click();

    await expect(page.locator('#confirm-delete-dialog')).toBeVisible();
    await page.click('#confirm-delete-submit-button');
    await expect(page.locator('#confirm-delete-dialog')).not.toBeVisible({ timeout: 10_000 });

    await expect(page.locator(`#booking-review-button-${targetBookingId}`)).toBeVisible({ timeout: 10_000 });
  });
});
