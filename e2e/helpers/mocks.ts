import { Page, Route } from '@playwright/test';
import { mockAuthenticatedSession, mockUnauthenticatedSession } from './auth';
import {
  COMPLETED_BOOKING,
  REVIEW_ITEM,
  TEST_PROVIDER,
  TEST_USER,
  WISHLIST_ITEM,
} from './fixtures';

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'access-control-allow-headers': 'Content-Type,Authorization',
};

async function json(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    headers: CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

type MockOptions = {
  authenticated?: boolean;
  bookings?: any[];
  reviews?: any[];
  wishlist?: any[];
  failReviewCreate?: boolean;
  failWishlistDelete?: boolean;
};

export async function mockAppApi(page: Page, options: MockOptions = {}) {
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
  const authenticated = options.authenticated ?? true;
  const bookings = clone(options.bookings ?? [COMPLETED_BOOKING]);
  const reviews = clone(options.reviews ?? [REVIEW_ITEM]);
  const wishlist = clone(options.wishlist ?? [WISHLIST_ITEM]);

  if (authenticated) {
    await mockAuthenticatedSession(page, TEST_USER);
  } else {
    await mockUnauthenticatedSession(page);
  }

  await page.route('**/api/**', async (route) => {
    if (route.request().url().includes('/api/auth/')) {
      await route.fallback();
      return;
    }

    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }

    await json(route, 200, { success: true, data: [] });
  });

  await page.route('**/api/providers**', async (route) => {
    await json(route, 200, {
      success: true,
      count: 1,
      data: [{ ...TEST_PROVIDER, cars: [] }],
    });
  });

  await page.route('**/api/bookings**', async (route) => {
    if (route.request().method() === 'GET') {
      await json(route, 200, {
        success: true,
        count: bookings.length,
        data: bookings,
      });
      return;
    }

    await json(route, 200, { success: true, data: {} });
  });

  await page.route('**/api/reviews**', async (route) => {
    const method = route.request().method();

    if (method === 'GET') {
      await json(route, 200, {
        success: true,
        count: reviews.length,
        data: reviews,
      });
      return;
    }

    if (method === 'POST') {
      if (options.failReviewCreate) {
        await json(route, 400, { success: false, message: 'Failed to submit review' });
        return;
      }

      const payload = JSON.parse(route.request().postData() ?? '{}');
      const newReview = {
        _id: `review-e2e-${Date.now()}`,
        userId: {
          _id: TEST_USER._id,
          name: TEST_USER.name,
        },
        bookingId: {
          _id: payload.bookingId,
          car: REVIEW_ITEM.bookingId.car,
        },
        providerId: TEST_PROVIDER._id,
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      reviews.push(newReview);
      const booking = bookings.find((item) => item._id === payload.bookingId);
      if (booking) {
        booking.review = {
          _id: newReview._id,
          rating: newReview.rating,
          comment: newReview.comment,
        };
      }

      await json(route, 201, { success: true, data: newReview });
      return;
    }

    await json(route, 200, { success: true });
  });

  await page.route('**/api/reviews/*', async (route) => {
    const method = route.request().method();
    const reviewId = route.request().url().split('/api/reviews/')[1]?.split('?')[0] ?? '';

    if (method === 'PUT') {
      const payload = JSON.parse(route.request().postData() ?? '{}');
      const review = reviews.find((item) => item._id === reviewId);

      if (review) {
        review.rating = payload.rating;
        review.comment = payload.comment;
      }

      await json(route, 200, { success: true, data: review });
      return;
    }

    if (method === 'DELETE') {
      const index = reviews.findIndex((item) => item._id === reviewId);
      if (index >= 0) {
        reviews.splice(index, 1);
      }

      await json(route, 200, { success: true, message: 'Review deleted' });
      return;
    }

    await json(route, 200, { success: true });
  });

  await page.route('**/api/wishlist', async (route) => {
    if (route.request().method() === 'GET') {
      await json(route, 200, {
        success: true,
        count: wishlist.length,
        data: wishlist,
      });
      return;
    }

    await json(route, 200, { success: true });
  });

  await page.route('**/api/wishlist/*', async (route) => {
    if (route.request().method() !== 'DELETE') {
      await json(route, 200, { success: true });
      return;
    }

    if (options.failWishlistDelete) {
      await json(route, 400, { success: false, message: 'Failed to remove item' });
      return;
    }

    const itemId = route.request().url().split('/api/wishlist/')[1]?.split('?')[0] ?? '';
    const index = wishlist.findIndex((item) => item.wishlistItemId === itemId);

    if (index >= 0) {
      wishlist.splice(index, 1);
    }

    await json(route, 200, { success: true, data: {} });
  });
}