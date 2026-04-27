import { Page } from '@playwright/test';
import { TEST_USER } from './mockData';

const JSON_HEADERS = { 'content-type': 'application/json' };

/**
 * Set up a NextAuth-style session by intercepting the /api/auth/session
 * endpoint so the page treats the test user as logged in.
 */
export async function mockNextAuthSession(page: Page, user = TEST_USER) {
  await page.route('**/api/auth/session*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.token,
        },
        expires: '2099-12-31T23:59:59.999Z',
      }),
    });
  });

  await page.route('**/api/auth/csrf*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'mock-csrf-token' }),
    });
  });

  await page.route('**/api/auth/providers*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        credentials: {
          id: 'credentials',
          name: 'Credentials',
          type: 'credentials',
          signinUrl: '/api/auth/signin/credentials',
          callbackUrl: '/api/auth/callback/credentials',
        },
      }),
    });
  });

  // NextAuth telemetry/logging endpoint
  await page.route('**/api/auth/_log*', async (route) => {
    await route.fulfill({ status: 200, headers: JSON_HEADERS, body: '{}' });
  });
}

/**
 * Set up an unauthenticated NextAuth session.
 */
export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/api/auth/session*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  await page.route('**/api/auth/csrf*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'mock-csrf-token' }),
    });
  });

  await page.route('**/api/auth/_log*', async (route) => {
    await route.fulfill({ status: 200, headers: JSON_HEADERS, body: '{}' });
  });
}

/**
 * Wait for the NextAuth session fetch to complete so the page is
 * fully hydrated as authenticated/unauthenticated before further
 * interactions.
 */
export async function waitForSession(page: Page) {
  // The session endpoint may be hit multiple times; wait at least once.
  await page
    .waitForResponse(
      (resp) => /\/api\/auth\/session/.test(resp.url()) && resp.status() === 200,
      { timeout: 15000 }
    )
    .catch(() => {
      // session might already be in cache — fall through
    });
}
