import { Page, expect } from '@playwright/test';
import { TEST_USER as MOCK_USER } from './mockData';

const JSON_HEADERS = { 'content-type': 'application/json' };

// Real user credentials for actual login tests
export const LOGIN_CREDENTIALS = {
  email: process.env.E2E_USER_EMAIL ?? 'user@gmail.com',
  password: process.env.E2E_USER_PASSWORD ?? '12345678',
};

/**
 * --- MOCKING HELPERS ---
 * Set up a NextAuth-style session by intercepting the /api/auth/session
 * endpoint so the page treats the test user as logged in without hitting the DB.
 */
export async function mockNextAuthSession(page: Page, user = MOCK_USER) {
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
 * Wait for the NextAuth session fetch to complete.
 */
export async function waitForSession(page: Page) {
  await page
    .waitForResponse(
      (resp) => /\/api\/auth\/session/.test(resp.url()) && resp.status() === 200,
      { timeout: 15000 }
    )
    .catch(() => {
      // session might already be in cache
    });
}

/**
 * --- REAL LOGIN HELPERS ---
 * Performs a real UI login.
 */
export async function login(
  page: Page,
  email: string = LOGIN_CREDENTIALS.email,
  password: string = LOGIN_CREDENTIALS.password,
) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
}

export async function loginAndExpectHome(page: Page) {
  await login(page);
  await page.waitForURL((url) => url.pathname === '/' || url.pathname === '', {
    timeout: 10_000,
  });
  await expect(page).toHaveURL(/\/$/);
}
