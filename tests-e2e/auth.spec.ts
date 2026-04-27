import { test, expect } from '@playwright/test';
import { login, loginAndExpectHome } from './helpers/auth';

test.describe('Login page', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
  });

  test('blocks submission when fields are empty (HTML5 required)', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /^login$/i }).click();

    // Browser-native validation prevents navigation; URL must remain on /login.
    await expect(page).toHaveURL(/\/login$/);
  });

  test('shows error message for invalid credentials', async ({ page }) => {
    await login(page, 'no-such-user@example.com', 'wrong-password');

    const error = page.getByText(/invalid email or password|error occurred/i);
    await expect(error).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects to register page from the footer link', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /register/i }).click();
    await page.waitForURL('**/register', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/register$/);
  });

  test('valid credentials redirect to home', async ({ page }) => {
    await loginAndExpectHome(page);
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible({
      timeout: 10_000,
    });
  });
});

test.describe('Register page', () => {
  test('renders the registration form', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /^register$/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
  });

  test('shows mismatch error when passwords do not match', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[type="tel"]', '0800000000');
    await page.fill('input[type="email"]', `e2e-${Date.now()}@example.com`);

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('password123');
    await passwordInputs.nth(1).fill('password999');

    await page.getByRole('button', { name: /register/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible({
      timeout: 5_000,
    });
  });

  test('navigates back to login from the footer link', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: /login/i }).click();
    await page.waitForURL('**/login', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login$/);
  });
});
