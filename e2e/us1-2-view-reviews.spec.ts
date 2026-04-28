import { test, expect } from '@playwright/test';
import { mockNextAuthSession, mockUnauthenticatedSession, waitForSession } from './helpers/auth';
import { mockReviewBackend } from './helpers/apiMocks';
import { SAMPLE_REVIEW, SAMPLE_REVIEW_2 } from './helpers/mockData';

/**
 * US1-2: As a user, I want to view all my past reviews for rental car providers
 * so that I can keep track of my feedback history.
 *
 * Tasks covered:
 *  - GET /reviews endpoint (auth middleware)
 *  - Review Card component (provider name, stars, comment, date)
 *  - My Reviews page (list of review cards)
 *  - Empty state UI when no reviews exist
 */
test.describe('US1-2: View past reviews', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  });

  test('My Reviews page renders all review cards from GET /reviews', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, {
      reviews: [SAMPLE_REVIEW, SAMPLE_REVIEW_2],
    });

    await page.goto('/reviews');
    await waitForSession(page);

    // Switch to "My Posts" tab (personal reviews)
    await page.getByRole('button', { name: /My Posts/i }).click();

    // Each review's comment text appears as a card (rendered inside quotes)
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(SAMPLE_REVIEW_2.comment, { exact: false })).toBeVisible();

    // Car description (brand + model) is rendered on the card
    await expect(page.getByRole('heading', { name: /Toyota Camry/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Honda Civic/i })).toBeVisible();
  });

  test('review cards display rating value and comment', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();

    // Comment is rendered (wrapped in quotes by ReviewListCard)
    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    // Rating value text is shown next to the stars (e.g. "4.0")
    await expect(page.getByText(SAMPLE_REVIEW.rating.toFixed(1)).first()).toBeVisible();
  });

  test('review cards display date in expected format', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();

    await expect(page.getByText(SAMPLE_REVIEW.comment, { exact: false })).toBeVisible({
      timeout: 15000,
    });

    // ReviewListCard renders the date as 'D MMM YYYY' (en-GB)
    const expectedDate = new Date(SAMPLE_REVIEW.createdAt).toLocaleDateString(
      'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
    await expect(page.getByText(expectedDate).first()).toBeVisible();
  });

  test('shows empty state UI when the user has no reviews', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [] });

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();

    await expect(page.getByText('You have not left any reviews yet.')).toBeVisible({
      timeout: 15000,
    });
  });

  test('All Feedbacks tab is visible when not logged in but personal tab requires sign-in', async ({ page }) => {
    await mockUnauthenticatedSession(page);
    await mockReviewBackend(page, { reviews: [] });

    await page.goto('/reviews');

    // All Feedbacks tab works for unauthenticated users
    await expect(page.getByRole('button', { name: /All Feedbacks/i })).toBeVisible({
      timeout: 15000,
    });

    // Switch to My Posts (personal) - should show login prompt
    await page.getByRole('button', { name: /My Posts/i }).click();
    await expect(page.getByText(/Sign in to view your reviews/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible();
  });

  test('GET /reviews is called with the auth token in the Authorization header', async ({ page }) => {
    await mockNextAuthSession(page);
    await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });

    const requestPromise = page.waitForRequest(
      (req) =>
        /\/api\/reviews(\?|$)/.test(req.url()) &&
        req.method() === 'GET' &&
        !!req.headers()['authorization'],
      { timeout: 15000 }
    );

    await page.goto('/reviews');
    await waitForSession(page);
    await page.getByRole('button', { name: /My Posts/i }).click();

    const request = await requestPromise;
    const auth = request.headers()['authorization'];
    expect(auth).toMatch(/^Bearer .+/);
  });
});
