# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: us1-2-view-reviews.spec.ts >> US1-2: View past reviews >> shows empty state UI when the user has no reviews
- Location: e2e/us1-2-view-reviews.spec.ts:66:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('You have not left any reviews yet.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('You have not left any reviews yet.')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - navigation [ref=e3]:
    - link "R Ratatouille" [ref=e4] [cursor=pointer]:
      - /url: /
      - generic [ref=e5]:
        - generic [ref=e7]: R
        - generic [ref=e8]: Ratatouille
    - generic [ref=e9]:
      - link "Providers" [ref=e10] [cursor=pointer]:
        - /url: /provider
      - link "Cars" [ref=e11] [cursor=pointer]:
        - /url: /car
      - link "Bookings" [ref=e12] [cursor=pointer]:
        - /url: /bookings
      - link "Reviews" [ref=e13] [cursor=pointer]:
        - /url: /reviews
      - link "Wishlist" [ref=e14] [cursor=pointer]:
        - /url: /wishlist
    - link "Login" [ref=e16] [cursor=pointer]:
      - /url: /login
  - main [ref=e17]:
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]: Community Feedback
          - heading "Customer Reviews" [level=1] [ref=e22]
        - generic [ref=e23]:
          - button "All Feedbacks" [ref=e24]
          - button "My Posts" [active] [ref=e25]
      - generic [ref=e26]:
        - paragraph [ref=e27]: Sign in to view your reviews
        - paragraph [ref=e28]: You need to be logged in to view your personal reviews.
        - link "Sign In" [ref=e29] [cursor=pointer]:
          - /url: /login
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { mockNextAuthSession, mockUnauthenticatedSession } from './helpers/auth';
  3   | import { mockReviewBackend } from './helpers/apiMocks';
  4   | import { SAMPLE_REVIEW, SAMPLE_REVIEW_2 } from './helpers/mockData';
  5   | 
  6   | /**
  7   |  * US1-2: As a user, I want to view all my past reviews for rental car providers
  8   |  * so that I can keep track of my feedback history.
  9   |  *
  10  |  * Tasks covered:
  11  |  *  - GET /reviews endpoint (auth middleware)
  12  |  *  - Review Card component (provider name, stars, comment, date)
  13  |  *  - My Reviews page (list of review cards)
  14  |  *  - Empty state UI when no reviews exist
  15  |  */
  16  | test.describe('US1-2: View past reviews', () => {
  17  |   test('My Reviews page renders all review cards from GET /reviews', async ({ page }) => {
  18  |     await mockNextAuthSession(page);
  19  |     await mockReviewBackend(page, {
  20  |       reviews: [SAMPLE_REVIEW, SAMPLE_REVIEW_2],
  21  |     });
  22  | 
  23  |     await page.goto('/reviews');
  24  | 
  25  |     // Switch to "My Posts" tab (personal reviews)
  26  |     await page.getByRole('button', { name: /My Posts/i }).click();
  27  | 
  28  |     // Each review's comment text appears as a card
  29  |     await expect(page.getByText(SAMPLE_REVIEW.comment)).toBeVisible();
  30  |     await expect(page.getByText(SAMPLE_REVIEW_2.comment)).toBeVisible();
  31  | 
  32  |     // Car description (brand + model) is rendered on the card
  33  |     await expect(page.getByRole('heading', { name: /Toyota Camry/i })).toBeVisible();
  34  |     await expect(page.getByRole('heading', { name: /Honda Civic/i })).toBeVisible();
  35  |   });
  36  | 
  37  |   test('review cards display rating value and comment', async ({ page }) => {
  38  |     await mockNextAuthSession(page);
  39  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  40  | 
  41  |     await page.goto('/reviews');
  42  |     await page.getByRole('button', { name: /My Posts/i }).click();
  43  | 
  44  |     // Comment is rendered (wrapped in quotes by ReviewListCard)
  45  |     await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  46  | 
  47  |     // Rating value text is shown next to the stars (e.g. "4.0")
  48  |     await expect(page.getByText(SAMPLE_REVIEW.rating.toFixed(1)).first()).toBeVisible();
  49  |   });
  50  | 
  51  |   test('review cards display date in expected format', async ({ page }) => {
  52  |     await mockNextAuthSession(page);
  53  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  54  | 
  55  |     await page.goto('/reviews');
  56  |     await page.getByRole('button', { name: /My Posts/i }).click();
  57  | 
  58  |     // ReviewListCard renders the date as 'D MMM YYYY' (en-GB)
  59  |     const expectedDate = new Date(SAMPLE_REVIEW.createdAt).toLocaleDateString(
  60  |       'en-GB',
  61  |       { day: 'numeric', month: 'short', year: 'numeric' }
  62  |     );
  63  |     await expect(page.getByText(expectedDate).first()).toBeVisible();
  64  |   });
  65  | 
  66  |   test('shows empty state UI when the user has no reviews', async ({ page }) => {
  67  |     await mockNextAuthSession(page);
  68  |     await mockReviewBackend(page, { reviews: [] });
  69  | 
  70  |     await page.goto('/reviews');
  71  |     await page.getByRole('button', { name: /My Posts/i }).click();
  72  | 
> 73  |     await expect(page.getByText('You have not left any reviews yet.')).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  74  |   });
  75  | 
  76  |   test('All Feedbacks tab is visible when not logged in but personal tab requires sign-in', async ({ page }) => {
  77  |     await mockUnauthenticatedSession(page);
  78  |     await mockReviewBackend(page, { reviews: [] });
  79  | 
  80  |     await page.goto('/reviews');
  81  | 
  82  |     // All Feedbacks tab works for unauthenticated users
  83  |     await expect(page.getByRole('button', { name: /All Feedbacks/i })).toBeVisible();
  84  | 
  85  |     // Switch to My Posts (personal) - should show login prompt
  86  |     await page.getByRole('button', { name: /My Posts/i }).click();
  87  |     await expect(page.getByText(/Sign in to view your reviews/i)).toBeVisible();
  88  |     await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible();
  89  |   });
  90  | 
  91  |   test('GET /reviews is called with the auth token in the Authorization header', async ({ page }) => {
  92  |     await mockNextAuthSession(page);
  93  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  94  | 
  95  |     const requestPromise = page.waitForRequest(
  96  |       (req) => req.url().includes('/api/reviews') && req.method() === 'GET'
  97  |     );
  98  | 
  99  |     await page.goto('/reviews');
  100 |     await page.getByRole('button', { name: /My Posts/i }).click();
  101 | 
  102 |     const request = await requestPromise;
  103 |     const auth = request.headers()['authorization'];
  104 |     expect(auth).toMatch(/^Bearer .+/);
  105 |   });
  106 | });
  107 | 
```