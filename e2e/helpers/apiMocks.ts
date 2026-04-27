import { Page } from '@playwright/test';
import {
  COMPLETED_BOOKING,
  PENDING_BOOKING,
  SAMPLE_REVIEW,
  SAMPLE_REVIEW_2,
  TEST_PROVIDER,
  TEST_CAR,
} from './mockData';

/**
 * Mocks the backend API endpoints for the review system EPIC.
 * Pass overrides to customize specific endpoint behavior per test.
 */
export interface ReviewApiMocks {
  reviews?: any[]; // initial reviews returned by GET /reviews
  bookings?: any[]; // initial bookings returned by GET /bookings
  postFails?: boolean; // POST /reviews returns error
  putFails?: boolean; // PUT /reviews/:id returns error
  deleteFails?: boolean; // DELETE /reviews/:id returns error
}

export async function mockReviewBackend(page: Page, opts: ReviewApiMocks = {}) {
  const reviewsStore: any[] = [...(opts.reviews ?? [])];
  const bookingsStore: any[] = [...(opts.bookings ?? [COMPLETED_BOOKING])];

  // ---- Providers (used by bookings page when navigating to "new" tab) ----
  await page.route('**/api/providers**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        count: 1,
        data: [{ ...TEST_PROVIDER, cars: [TEST_CAR] }],
      }),
    });
  });

  // ---- Bookings ----
  await page.route('**/api/bookings**', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, count: bookingsStore.length, data: bookingsStore }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: {} }),
      });
    }
  });

  // ---- Reviews collection: GET (list) and POST (create) ----
  // Use a regex so that /reviews and /reviews?all=true both match here, but /reviews/<id> goes to next handler
  await page.route(/\/api\/reviews(\?.*)?$/, async (route) => {
    const method = route.request().method();
    const url = route.request().url();

    if (method === 'GET') {
      // /reviews?all=true is "all reviews"; /reviews is "my reviews".
      // For tests we just return the same store.
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          count: reviewsStore.length,
          data: reviewsStore,
        }),
      });
      return;
    }

    if (method === 'POST') {
      if (opts.postFails) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Failed to submit review' }),
        });
        return;
      }
      const body = JSON.parse(route.request().postData() ?? '{}');
      const newReview = {
        _id: `review-new-${Date.now()}`,
        userId: SAMPLE_REVIEW.userId,
        providerId: TEST_PROVIDER._id,
        bookingId: SAMPLE_REVIEW.bookingId,
        rating: body.rating,
        comment: body.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      reviewsStore.push(newReview);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: newReview }),
      });
      return;
    }

    await route.continue();
  });

  // ---- Single review: PUT and DELETE /reviews/:id ----
  await page.route(/\/api\/reviews\/[^/?]+$/, async (route) => {
    const method = route.request().method();
    const url = route.request().url();
    const id = url.split('/').pop()?.split('?')[0] ?? '';

    if (method === 'PUT') {
      if (opts.putFails) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Failed to update review' }),
        });
        return;
      }
      const body = JSON.parse(route.request().postData() ?? '{}');
      const idx = reviewsStore.findIndex((r) => r._id === id);
      if (idx >= 0) {
        reviewsStore[idx] = { ...reviewsStore[idx], rating: body.rating, comment: body.comment };
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: reviewsStore[idx] }),
      });
      return;
    }

    if (method === 'DELETE') {
      if (opts.deleteFails) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Failed to delete review' }),
        });
        return;
      }
      const idx = reviewsStore.findIndex((r) => r._id === id);
      if (idx >= 0) reviewsStore.splice(idx, 1);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Review deleted' }),
      });
      return;
    }

    if (method === 'GET') {
      const found = reviewsStore.find((r) => r._id === id);
      await route.fulfill({
        status: found ? 200 : 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: !!found, data: found }),
      });
      return;
    }

    await route.continue();
  });

  return {
    getReviews: () => reviewsStore,
    getBookings: () => bookingsStore,
  };
}

export { COMPLETED_BOOKING, PENDING_BOOKING, SAMPLE_REVIEW, SAMPLE_REVIEW_2 };
