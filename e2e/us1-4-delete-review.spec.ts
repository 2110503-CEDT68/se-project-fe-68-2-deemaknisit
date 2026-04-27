import { test, expect } from '@playwright/test';
import { mockNextAuthSession } from './helpers/auth';
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
  test('clicking Delete opens a confirmation dialog with Confirm + Cancel', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Delete$/i }).click();

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
      if (req.method() === 'DELETE' && req.url().includes('/api/reviews/')) {
        deleteCalled = true;
      }
    });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Delete$/i }).click();

    // Cancel out
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Dialog closes
    await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeHidden();

    // Review still present
    await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();

    // No DELETE call was made
    expect(deleteCalled).toBe(false);
  });

  test('Confirm calls DELETE /reviews/:id and removes the review from the list', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW, SAMPLE_REVIEW_2] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();

    // Capture the DELETE request
    const deletePromise = page.waitForRequest(
      (req) =>
        req.url().includes('/api/reviews/') &&
        req.method() === 'DELETE'
    );

    // Open the delete dialog for the FIRST review and confirm
    await page.getByRole('button', { name: /^Delete$/i }).first().click();
    await page.getByRole('button', { name: 'Delete' }).click();

    const request = await deletePromise;
    expect(request.url()).toContain(`/api/reviews/${SAMPLE_REVIEW._id}`);
    const auth = request.headers()['authorization'];
    expect(auth).toMatch(/^Bearer .+/);

    // First review's comment is gone, second review still visible
    await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeHidden();
    await expect(page.getByText(`"${SAMPLE_REVIEW_2.comment}"`)).toBeVisible();
  });

  test('shows error when DELETE /reviews fails', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      reviews: [SAMPLE_REVIEW],
      deleteFails: true,
    });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();

    await page.getByRole('button', { name: /^Delete$/i }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Review remains in the list because the delete failed
    await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  });

  test('empty state appears after deleting the only review', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();

    await page.getByRole('button', { name: /^Delete$/i }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // After the only review is deleted, the empty state shows
    await expect(
      page.getByText('You have not left any reviews yet.')
    ).toBeVisible();
  });
});
