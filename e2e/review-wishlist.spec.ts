import { test, expect } from '@playwright/test';

test.describe('Car Rental System E2E', () => {
  
  test('User Login and Wishlist Flow', async ({ page }) => {
    // 1. Go to Login Page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 2. Perform Login
    await page.fill('input[type="email"]', 'user@gmail.com');
    await page.fill('input[type="password"]', '12345678');
    await page.click('button[type="submit"]');
    
    // 3. Verify redirection to home
    await page.waitForURL('**/', { timeout: 10000 });
    await expect(page).toHaveURL(/(?:localhost|127\.0\.0\.1):3000\/?/);
    
    // 4. Navigate to Cars
    await page.click('text=Browse Cars');
    await page.waitForURL('**/car', { timeout: 10000 });

    // 5. Select a Car
    await page.waitForSelector('a[href^="/car/"]', { timeout: 10000 });
    const carCard = page.locator('a[href^="/car/"]').first();
    await carCard.click();

    // 6. Add to Wishlist
    await page.waitForLoadState('networkidle');
    const wishlistBtn = page.getByRole('button').filter({ has: page.locator('svg path[d^="M20.84"]') }).first();
    await expect(wishlistBtn).toBeVisible({ timeout: 10000 });
    await wishlistBtn.click();

    // 7. Verify Success Message
    await expect(page.getByText(/added successfully/i)).toBeVisible({ timeout: 10000 });

    // 8. Navigate to Wishlist Page
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');

    // 9. Verify Wishlist title
    await expect(page.getByRole('heading', { name: /wishlist/i })).toBeVisible();
  });

  test('Reviews Visibility Flow', async ({ page }) => {
    // 1. Navigate to Reviews Page
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');

    // 2. Verify Review Page Header
    await expect(page.getByRole('heading', { name: /reviews/i })).toBeVisible();

    // 3. Check for reviews or empty message
    const noReviews = page.getByText(/no reviews available/i);
    const hasReviews = page.locator('.grid');

    await expect(noReviews.or(hasReviews)).toBeVisible();
  });

});
