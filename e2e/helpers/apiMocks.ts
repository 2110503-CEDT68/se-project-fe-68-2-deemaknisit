import { Page, Route } from '@playwright/test';
import {
  COMPLETED_BOOKING,
  PENDING_BOOKING,
  SAMPLE_REVIEW,
  SAMPLE_REVIEW_2,
  TEST_PROVIDER,
  TEST_CAR,
} from './mockData';

/**
 * Helpers for mocking the review system backend in Playwright tests.
 *
 * Strategy:
 *  - Intercept ALL requests that touch /api/* on any host so the real backend
 *    is never reached.
 *  - Always answer with permissive CORS headers + 204 for OPTIONS preflight.
 *  - Route specific endpoints (reviews / bookings / providers) to mock data.
 *  - Anything else under /api/* falls through to a default 200 stub so we
 *    don't fail on incidental requests.
 */

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  'access-control-allow-headers':
    'Content-Type,Authorization,X-Requested-With,Accept',
};

async function fulfillJson(
  route: Route,
  status: number,
  body: unknown
): Promise<void> {
  await route.fulfill({
    status,
    contentType: 'application/json',
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  });
}

export interface ReviewApiMocks {
  reviews?: any[];
  bookings?: any[];
  postFails?: boolean;
  putFails?: boolean;
  deleteFails?: boolean;
}

export async function mockReviewBackend(page: Page, opts: ReviewApiMocks = {}) {
  const reviewsStore: any[] = [...(opts.reviews ?? [])];
  const bookingsStore: any[] = [...(opts.bookings ?? [COMPLETED_BOOKING])];

  // ---------- Catch-all: handle CORS preflight + fall-through stub ----------
  // This must be registered FIRST. Playwright matches the LAST-registered
  // route first, so later routes override this one for specific paths.
  await page.route('**/api/**', async (route) => {
    // Let earlier-registered handlers (e.g. mockNextAuthSession) process
    // NextAuth endpoints like /api/auth/session — otherwise this catch-all
    // would shadow them and the page would never see a valid session.
    if (/\/api\/auth\//.test(route.request().url())) {
      await route.fallback();
      return;
    }
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
        body: '',
      });
      return;
    }
    // Default fallthrough: empty success
    await fulfillJson(route, 200, { success: true, count: 0, data: [] });
  });

  // ---------- Providers ----------
  await page.route('**/api/providers**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    await fulfillJson(route, 200, {
      success: true,
      count: 1,
      data: [{ ...TEST_PROVIDER, cars: [TEST_CAR] }],
    });
  });

  // ---------- Bookings ----------
  await page.route('**/api/bookings**', async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    if (method === 'GET') {
      await fulfillJson(route, 200, {
        success: true,
        count: bookingsStore.length,
        data: bookingsStore,
      });
      return;
    }
    await fulfillJson(route, 200, { success: true, data: {} });
  });

  // ---------- Single review: PUT/DELETE/GET on /api/reviews/:id ----------
  // Register BEFORE the collection route so the more specific pattern wins
  // when multiple routes match.
  await page.route('**/api/reviews/*', async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    const url = route.request().url();
    const id = url.split('/api/reviews/')[1]?.split('?')[0]?.split('/')[0] ?? '';

    if (method === 'PUT') {
      if (opts.putFails) {
        await fulfillJson(route, 400, {
          success: false,
          message: 'Failed to update review',
        });
        return;
      }
      const body = JSON.parse(route.request().postData() ?? '{}');
      const idx = reviewsStore.findIndex((r) => r._id === id);
      if (idx >= 0) {
        reviewsStore[idx] = {
          ...reviewsStore[idx],
          rating: body.rating,
          comment: body.comment,
        };
      }
      await fulfillJson(route, 200, {
        success: true,
        data: reviewsStore[idx] ?? { _id: id, ...body },
      });
      return;
    }

    if (method === 'DELETE') {
      if (opts.deleteFails) {
        await fulfillJson(route, 400, {
          success: false,
          message: 'Failed to delete review',
        });
        return;
      }
      const idx = reviewsStore.findIndex((r) => r._id === id);
      if (idx >= 0) reviewsStore.splice(idx, 1);
      await fulfillJson(route, 200, {
        success: true,
        message: 'Review deleted',
      });
      return;
    }

    if (method === 'GET') {
      const found = reviewsStore.find((r) => r._id === id);
      await fulfillJson(route, found ? 200 : 404, {
        success: !!found,
        data: found,
      });
      return;
    }

    await fulfillJson(route, 200, { success: true });
  });

  // ---------- Reviews collection: GET (list) and POST (create) ----------
  await page.route('**/api/reviews', async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }

    if (method === 'GET') {
      await fulfillJson(route, 200, {
        success: true,
        count: reviewsStore.length,
        data: reviewsStore,
      });
      return;
    }

    if (method === 'POST') {
      if (opts.postFails) {
        await fulfillJson(route, 400, {
          success: false,
          message: 'Failed to submit review',
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
      await fulfillJson(route, 201, { success: true, data: newReview });
      return;
    }

    await fulfillJson(route, 200, { success: true });
  });

  // Same handler for the ?all=true variant — Playwright route patterns
  // already match query strings under the same path, but the explicit
  // pattern below makes intent obvious.
  await page.route(/\/api\/reviews\?.*$/, async (route) => {
    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    await fulfillJson(route, 200, {
      success: true,
      count: reviewsStore.length,
      data: reviewsStore,
    });
  });

  return {
    getReviews: () => reviewsStore,
    getBookings: () => bookingsStore,
  };
}

export { COMPLETED_BOOKING, PENDING_BOOKING, SAMPLE_REVIEW, SAMPLE_REVIEW_2 };
