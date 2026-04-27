import { Page, expect } from '@playwright/test';

export const TEST_USER = {
  email: process.env.E2E_USER_EMAIL ?? 'user@gmail.com',
  password: process.env.E2E_USER_PASSWORD ?? '12345678',
};

export async function login(
  page: Page,
  email: string = TEST_USER.email,
  password: string = TEST_USER.password,
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
