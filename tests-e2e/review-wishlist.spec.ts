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
    await expect(page).toHaveURL(/.*localhost:3000\/?/ || /.*127.0.0.1:3000\/?/);
    
    // 4. Navigate to Providers
    await page.click('text=Browse Cars');
    await page.waitForURL('**/provider', { timeout: 10000 });
    
    // 5. Select a Provider
    await page.waitForSelector('text=Verified Partner', { timeout: 10000 });
    const providerCard = page.locator('a[href^="/provider/"]').first();
    await providerCard.click();
    
    // 6. Add a Car to Wishlist
    await page.waitForLoadState('networkidle');
    const wishlistBtn = page.locator('button:has-text("Add to Wishlist")').first();
    await expect(wishlistBtn).toBeVisible({ timeout: 10000 });
    await wishlistBtn.click();
    
    // 7. Verify Success Message
    await expect(page.locator('text=Added successfully')).toBeVisible({ timeout: 10000 });
    
    // 8. Navigate to Wishlist Page
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');
    
    // 9. Verify Wishlist title
    await expect(page.locator('h1')).toContainText('Wishlist', { ignoreCase: true });
  });

  test('Reviews Visibility Flow', async ({ page }) => {
    // 1. Navigate to Reviews Page
    await page.goto('/reviews');
    await page.waitForLoadState('networkidle');
    
    // 2. Verify Review Page Header
    await expect(page.locator('h1')).toContainText('Reviews', { ignoreCase: true });
    
    // 3. Check for reviews or empty message
    const noReviews = page.locator('text=No reviews available');
    const hasReviews = page.locator('.grid');
    
    await expect(noReviews.or(hasReviews)).toBeVisible();
  });

});
