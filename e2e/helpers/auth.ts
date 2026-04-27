import { Page, BrowserContext } from '@playwright/test';
import { TEST_USER } from './mockData';

/**
 * Set up a NextAuth-style session by intercepting the /api/auth/session endpoint.
 * Avoids needing a real backend for login flow.
 */
export async function mockNextAuthSession(page: Page, user = TEST_USER) {
  // Intercept the NextAuth session endpoint and return a logged-in user.
  await page.route('**/api/auth/session', async (route) => {
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

  // Intercept CSRF and providers endpoints just to keep next-auth happy.
  await page.route('**/api/auth/csrf', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'mock-csrf-token' }),
    });
  });

  await page.route('**/api/auth/providers', async (route) => {
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
}

/**
 * Set up an unauthenticated NextAuth session.
 */
export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
}
