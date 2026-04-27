import { test, expect } from '@playwright/test';
import { mockNextAuthSession, mockUnauthenticatedSession } from './helpers/auth';
import { mockReviewBackend } from './helpers/apiMocks';
import { COMPLETED_BOOKING, PENDING_BOOKING } from './helpers/mockData';

/**
 * US1-1: As a user, I want to write a review for a rental car provider after my
 * booking is completed so that I can share my experience with other users.
 *
 * Tasks covered:
 *  - Star Rating component (1-5, interactive)
 *  - Review Form UI (star rating + comment textarea + submit button)
 *  - Submit review logic + success/error message handling
 *  - POST /reviews endpoint validation (booking must be completed)
 */
test.describe('US1-1: Write a review for a completed booking', () => {
  test('shows the Review button only for completed bookings', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      bookings: [COMPLETED_BOOKING, PENDING_BOOKING],
      reviews: [],
    });

    await page.goto('/bookings');

    // Completed booking shows a Review button
    await expect(
      page.getByRole('button', { name: /^Review$/i }).first()
    ).toBeVisible();

    // Pending booking shows the Return Car button (NOT a Review button)
    await expect(page.getByRole('button', { name: /Return Car/i })).toBeVisible();
  });

  test('opens the review form with star rating, comment textarea, and submit button', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });

    await page.goto('/bookings');
    await page.getByRole('button', { name: /^Review$/i }).first().click();

    // Dialog header
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    // Star rating component (MUI Rating renders 5 radio inputs labelled 1-5 stars)
    const stars = page.locator('input[name="review-rating"]');
    await expect(stars).toHaveCount(5);

    // Comment textarea
    await expect(page.getByLabel('Comment')).toBeVisible();

    // Submit + Cancel buttons
    await expect(page.getByRole('button', { name: 'Submit Review' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('star rating is interactive (1-5 stars)', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });

    await page.goto('/bookings');
    await page.getByRole('button', { name: /^Review$/i }).first().click();

    // Click on the 5-star option
    const fiveStar = page.locator('input[name="review-rating"][value="5"]');
    await fiveStar.check({ force: true });
    await expect(fiveStar).toBeChecked();

    // Click on the 1-star option
    const oneStar = page.locator('input[name="review-rating"][value="1"]');
    await oneStar.check({ force: true });
    await expect(oneStar).toBeChecked();
  });

  test('successfully submits a review with rating + comment (POST /reviews)', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });

    // Capture the POST request to assert correct payload
    const postPromise = page.waitForRequest(
      (req) =>
        req.url().includes('/api/reviews') &&
        req.method() === 'POST'
    );

    await page.goto('/bookings');
    await page.getByRole('button', { name: /^Review$/i }).first().click();

    // Pick rating = 4
    await page.locator('input[name="review-rating"][value="4"]').check({ force: true });

    // Fill comment
    await page.getByLabel('Comment').fill('Loved the car! Would book again.');

    // Submit
    await page.getByRole('button', { name: 'Submit Review' }).click();

    const request = await postPromise;
    const body = JSON.parse(request.postData() || '{}');
    expect(body.rating).toBe(4);
    expect(body.comment).toBe('Loved the car! Would book again.');
    expect(body.bookingId).toBeTruthy();
  });

  test('shows error message when submitting with empty comment', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });

    await page.goto('/bookings');
    await page.getByRole('button', { name: /^Review$/i }).first().click();

    // Leave rating at default (3) and comment blank, then click submit
    await page.getByRole('button', { name: 'Submit Review' }).click();

    // Required-field helper text appears
    await expect(
      page.getByText('Please share your thoughts - we require your comment!')
    ).toBeVisible();
  });

  test('shows error message when POST /reviews fails (server error)', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      bookings: [COMPLETED_BOOKING],
      reviews: [],
      postFails: true,
    });

    await page.goto('/bookings');
    await page.getByRole('button', { name: /^Review$/i }).first().click();

    await page.locator('input[name="review-rating"][value="3"]').check({ force: true });
    await page.getByLabel('Comment').fill('This should fail.');

    // The component uses alert() on failure when called from BookingList
    page.once('dialog', async (dialog) => {
      expect(dialog.message().toLowerCase()).toContain('failed');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Submit Review' }).click();
  });

  test('cannot submit review when not authenticated (redirected to login)', async ({ page }) => {
    await mockUnauthenticatedSession(page);

    await page.goto('/bookings');

    // The /bookings page renders an "Access Denied" gate for unauthenticated users
    await expect(page.getByText(/Access Denied/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});
