import { Page } from '@playwright/test';

type SessionUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

export async function mockAuthenticatedSession(page: Page, user: SessionUser) {
  await page.route('**/api/auth/session*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user,
        expires: '2099-12-31T23:59:59.999Z',
      }),
    });
  });

  await page.route('**/api/auth/providers*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ credentials: { id: 'credentials', name: 'Credentials' } }),
    });
  });

  await page.route('**/api/auth/csrf*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'e2e-csrf-token' }),
    });
  });

  await page.route('**/api/auth/_log*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/api/auth/session*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  await page.route('**/api/auth/providers*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ credentials: { id: 'credentials', name: 'Credentials' } }),
    });
  });

  await page.route('**/api/auth/csrf*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'e2e-csrf-token' }),
    });
  });

  await page.route('**/api/auth/_log*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

export async function waitForSession(page: Page) {
  await page.waitForResponse((response) => {
    return response.url().includes('/api/auth/session') && response.status() === 200;
  });
}
