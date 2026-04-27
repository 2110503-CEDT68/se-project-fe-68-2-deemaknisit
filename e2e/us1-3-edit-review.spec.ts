import { test, expect } from '@playwright/test';
import { mockNextAuthSession } from './helpers/auth';
import { mockReviewBackend } from './helpers/apiMocks';
import { SAMPLE_REVIEW } from './helpers/mockData';

/**
 * US1-3: As a user, I want to edit my previously submitted review so that I can
 * correct or update my feedback.
 *
 * Tasks covered:
 *  - PUT /reviews/:reviewId endpoint (auth + ownership)
 *  - Edit Review modal pre-fills existing rating + comment
 *  - Validation error display for missing required fields
 */
test.describe('US1-3: Edit a previously submitted review', () => {
  test('Edit button is visible on the user\'s own review card', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();

    // Edit + Delete buttons are owner-only
    await expect(page.getByRole('button', { name: /^Edit$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Delete$/i })).toBeVisible();
  });

  test('Edit modal pre-fills the existing rating and comment', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Edit$/i }).click();

    // Dialog opens
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    // Existing rating is pre-selected
    const checkedStar = page.locator(
      `input[name="review-rating"][value="${SAMPLE_REVIEW.rating}"]`
    );
    await expect(checkedStar).toBeChecked();

    // Existing comment is pre-filled
    await expect(page.getByLabel('Comment')).toHaveValue(SAMPLE_REVIEW.comment);
  });

  test('successfully updates a review (PUT /reviews/:id)', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Edit$/i }).click();

    // Capture the PUT request
    const putPromise = page.waitForRequest(
      (req) =>
        req.url().includes(`/api/reviews/${SAMPLE_REVIEW._id}`) &&
        req.method() === 'PUT'
    );

    // Change rating to 2 and update the comment
    await page.locator('input[name="review-rating"][value="2"]').check({ force: true });
    await page.getByLabel('Comment').fill('Updated: was actually not great after all.');

    await page.getByRole('button', { name: 'Submit Review' }).click();

    const request = await putPromise;
    const body = JSON.parse(request.postData() || '{}');
    expect(body.rating).toBe(2);
    expect(body.comment).toBe('Updated: was actually not great after all.');

    // Auth header attached
    const auth = request.headers()['authorization'];
    expect(auth).toMatch(/^Bearer .+/);

    // After save, list reflects the new comment
    await expect(
      page.getByText('"Updated: was actually not great after all."')
    ).toBeVisible();
  });

  test('shows validation error when comment is cleared on edit', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Edit$/i }).click();

    // Clear the comment, then try to save
    await page.getByLabel('Comment').fill('');
    await page.getByRole('button', { name: 'Submit Review' }).click();

    await expect(
      page.getByText('Please share your thoughts - we require your comment!')
    ).toBeVisible();
  });

  test('shows error message when PUT /reviews fails', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW], putFails: true });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Edit$/i }).click();

    await page.getByLabel('Comment').fill('Trying to update with a failing API.');
    await page.getByRole('button', { name: 'Submit Review' }).click();

    // The dialog renders a generic error indicator
    await expect(page.getByText('error', { exact: true })).toBeVisible();
  });

  test('Cancel closes the edit modal without saving', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await page.getByRole('button', { name: /My Posts/i }).click();
    await page.getByRole('button', { name: /^Edit$/i }).click();

    await page.getByLabel('Comment').fill('Trying to type something I will discard');
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Dialog goes away
    await expect(
      page.getByRole('heading', { name: 'Submit Your Review' })
    ).toBeHidden();

    // Original comment is still there in the list
    await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  });
});
