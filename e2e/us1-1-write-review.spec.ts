import { test, expect } from '@playwright/test';
import { mockNextAuthSession, mockUnauthenticatedSession, waitForSession } from './helpers/auth';
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
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  });

  test('shows the Review button only for completed bookings', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      bookings: [COMPLETED_BOOKING, PENDING_BOOKING],
      reviews: [],
    });

    await page.goto('/bookings');
    await waitForSession(page);

    // Wait for booking cards to render: the completed booking has the brand visible
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });

    // Completed booking shows a Review button (yellow CTA)
    const reviewBtn = page.getByRole('button', { name: /^Review$/ });
    await expect(reviewBtn).toBeVisible();

    // Pending booking shows the Return Car button (NOT a Review button)
    await expect(page.getByRole('button', { name: /Return Car/i })).toBeVisible();
  });

  test('opens the review form with star rating, comment textarea, and submit button', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });

    await page.goto('/bookings');
    await waitForSession(page);

    // Wait for the bookings list to render
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Review$/ }).first().click();

    // Dialog header
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    // Star rating inputs (1-5)
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
    await waitForSession(page);
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });
    await page.getByRole('button', { name: /^Review$/ }).first().click();

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

    await page.goto('/bookings');
    await waitForSession(page);
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });

    // Capture the POST request to assert correct payload
    const postPromise = page.waitForRequest(
      (req) =>
        /\/api\/reviews(\?|$)/.test(req.url()) && req.method() === 'POST',
      { timeout: 10000 }
    );

    await page.getByRole('button', { name: /^Review$/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    // Pick rating = 4
    await page.locator('input[name="review-rating"][value="4"]').check({ force: true });

    // Fill comment
    await page.getByLabel('Comment').fill('Loved the car! Would book again.');

    // Submit (alert may appear after success)
    page.on('dialog', (d) => d.accept());
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
    await waitForSession(page);
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: /^Review$/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    // Default rating is 3, leave comment empty, click submit
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
    await waitForSession(page);
    await expect(page.getByRole('heading', { name: /Toyota Camry/i }).first()).toBeVisible({
      timeout: 15000,
    });

    // BookingList uses alert() to surface errors. Capture the alert.
    const dialogPromise = page.waitForEvent('dialog', { timeout: 10000 });

    await page.getByRole('button', { name: /^Review$/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();

    await page.locator('input[name="review-rating"][value="3"]').check({ force: true });
    await page.getByLabel('Comment').fill('This should fail.');

    await page.getByRole('button', { name: 'Submit Review' }).click();

    const dialog = await dialogPromise;
    expect(dialog.message().toLowerCase()).toContain('fail');
    await dialog.accept();
  });

  test('cannot submit review when not authenticated (Access Denied)', async ({ page }) => {
    await mockUnauthenticatedSession(page);
    await mockReviewBackend(page, { bookings: [], reviews: [] });

    await page.goto('/bookings');

    // The /bookings page renders an "Access Denied" gate for unauthenticated users
    await expect(page.getByText(/Access Denied/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });
});
