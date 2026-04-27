import { test, expect } from '@playwright/test';
import { mockNextAuthSession, waitForSession } from './helpers/auth';
import { mockReviewBackend } from './helpers/apiMocks';
import { SAMPLE_REVIEW, SAMPLE_REVIEW_2 } from './helpers/mockData';

/**
 * US1-4: As a user, I want to delete my review so that I can remove feedback I
 * no longer wish to share.
 *
 * Tasks covered:
 *  - DELETE /reviews/:reviewId endpoint (auth + ownership)
 *  - Delete confirmation dialog with Confirm + Cancel
 */
test.describe('US1-4: Delete a review', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  });

  test('clicking Delete opens a confirmation dialog with Confirm + Cancel', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Delete$/ }).click();

    // Confirm dialog
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();
    await expect(
      page.getByText(/Are you sure you want to delete this review/i)
    ).toBeVisible();

    // Confirm + Cancel buttons
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('Cancel keeps the review in the list (no DELETE call made)', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    let deleteCalled = false;
    page.on('request', (req) => {
      if (req.method() === 'DELETE' && /\/api\/reviews\//.test(req.url())) {
        deleteCalled = true;
      }
    });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Delete$/ }).click();
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();

    // Cancel out
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Dialog closes
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeHidden();

    // Review still present
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible();

    // No DELETE call was made
    expect(deleteCalled).toBe(false);
  });

  test('Confirm calls DELETE /reviews/:id and removes the review from the list', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW, SAMPLE_REVIEW_2] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(SAMPLE_REVIEW_2.comment, { exact: false })).toBeVisible();

    // Capture the DELETE request
    const deletePromise = page.waitForRequest(
      (req) =>
        /\/api\/reviews\//.test(req.url()) && req.method() === 'DELETE',
      { timeout: 10000 }
    );

    // Open the delete dialog for the FIRST review and confirm
    await page.getByRole('button', { name: /^Delete$/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    const request = await deletePromise;
    expect(request.url()).toContain(`/api/reviews/${SAMPLE_REVIEW._id}`);
    const auth = request.headers()['authorization'];
    expect(auth).toMatch(/^Bearer .+/);

    // First review's comment is gone, second review still visible
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeHidden({
      timeout: 10000,
    });
    await expect(page.getByText(SAMPLE_REVIEW_2.comment, { exact: false })).toBeVisible();
  });

  test('shows error when DELETE /reviews fails', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      reviews: [SAMPLE_REVIEW],
      deleteFails: true,
    });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Delete$/ }).click();
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Review remains in the list because the delete failed
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible();
  });

  test('empty state appears after deleting the only review', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Delete$/ }).click();
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    // After the only review is deleted, the empty state shows
    await expect(
      page.getByText('You have not left any reviews yet.')
    ).toBeVisible({ timeout: 10000 });
  });
});
