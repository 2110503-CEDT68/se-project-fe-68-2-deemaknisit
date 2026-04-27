# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: us1-4-delete-review.spec.ts >> US1-4: Delete a review >> clicking Delete opens a confirmation dialog with Confirm + Cancel
- Location: e2e/us1-4-delete-review.spec.ts:15:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^Delete$/i })

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
  2   | import { mockNextAuthSession } from './helpers/auth';
  3   | import { mockReviewBackend } from './helpers/apiMocks';
  4   | import { SAMPLE_REVIEW, SAMPLE_REVIEW_2 } from './helpers/mockData';
  5   | 
  6   | /**
  7   |  * US1-4: As a user, I want to delete my review so that I can remove feedback I
  8   |  * no longer wish to share.
  9   |  *
  10  |  * Tasks covered:
  11  |  *  - DELETE /reviews/:reviewId endpoint (auth + ownership)
  12  |  *  - Delete confirmation dialog with Confirm + Cancel
  13  |  */
  14  | test.describe('US1-4: Delete a review', () => {
  15  |   test('clicking Delete opens a confirmation dialog with Confirm + Cancel', async ({ page }) => {
  16  |     await mockNextAuthSession(page);
  17  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  18  | 
  19  |     await page.goto('/reviews');
  20  |     await page.getByRole('button', { name: /My Posts/i }).click();
> 21  |     await page.getByRole('button', { name: /^Delete$/i }).click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  22  | 
  23  |     // Confirm dialog
  24  |     await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeVisible();
  25  |     await expect(
  26  |       page.getByText(/Are you sure you want to delete this review/i)
  27  |     ).toBeVisible();
  28  | 
  29  |     // Confirm + Cancel buttons
  30  |     await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  31  |     await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  32  |   });
  33  | 
  34  |   test('Cancel keeps the review in the list (no DELETE call made)', async ({ page }) => {
  35  |     await mockNextAuthSession(page);
  36  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  37  | 
  38  |     let deleteCalled = false;
  39  |     page.on('request', (req) => {
  40  |       if (req.method() === 'DELETE' && req.url().includes('/api/reviews/')) {
  41  |         deleteCalled = true;
  42  |       }
  43  |     });
  44  | 
  45  |     await page.goto('/reviews');
  46  |     await page.getByRole('button', { name: /My Posts/i }).click();
  47  |     await page.getByRole('button', { name: /^Delete$/i }).click();
  48  | 
  49  |     // Cancel out
  50  |     await page.getByRole('button', { name: 'Cancel' }).click();
  51  | 
  52  |     // Dialog closes
  53  |     await expect(page.getByRole('heading', { name: 'Delete Review' })).toBeHidden();
  54  | 
  55  |     // Review still present
  56  |     await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  57  | 
  58  |     // No DELETE call was made
  59  |     expect(deleteCalled).toBe(false);
  60  |   });
  61  | 
  62  |   test('Confirm calls DELETE /reviews/:id and removes the review from the list', async ({ page }) => {
  63  |     await mockNextAuthSession(page);
  64  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW, SAMPLE_REVIEW_2] });
  65  | 
  66  |     await page.goto('/reviews');
  67  |     await page.getByRole('button', { name: /My Posts/i }).click();
  68  | 
  69  |     // Capture the DELETE request
  70  |     const deletePromise = page.waitForRequest(
  71  |       (req) =>
  72  |         req.url().includes('/api/reviews/') &&
  73  |         req.method() === 'DELETE'
  74  |     );
  75  | 
  76  |     // Open the delete dialog for the FIRST review and confirm
  77  |     await page.getByRole('button', { name: /^Delete$/i }).first().click();
  78  |     await page.getByRole('button', { name: 'Delete' }).click();
  79  | 
  80  |     const request = await deletePromise;
  81  |     expect(request.url()).toContain(`/api/reviews/${SAMPLE_REVIEW._id}`);
  82  |     const auth = request.headers()['authorization'];
  83  |     expect(auth).toMatch(/^Bearer .+/);
  84  | 
  85  |     // First review's comment is gone, second review still visible
  86  |     await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeHidden();
  87  |     await expect(page.getByText(`"${SAMPLE_REVIEW_2.comment}"`)).toBeVisible();
  88  |   });
  89  | 
  90  |   test('shows error when DELETE /reviews fails', async ({ page }) => {
  91  |     await mockNextAuthSession(page);
  92  |     await mockReviewBackend(page, {
  93  |       reviews: [SAMPLE_REVIEW],
  94  |       deleteFails: true,
  95  |     });
  96  | 
  97  |     await page.goto('/reviews');
  98  |     await page.getByRole('button', { name: /My Posts/i }).click();
  99  | 
  100 |     await page.getByRole('button', { name: /^Delete$/i }).click();
  101 |     await page.getByRole('button', { name: 'Delete' }).click();
  102 | 
  103 |     // Review remains in the list because the delete failed
  104 |     await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  105 |   });
  106 | 
  107 |   test('empty state appears after deleting the only review', async ({ page }) => {
  108 |     await mockNextAuthSession(page);
  109 |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  110 | 
  111 |     await page.goto('/reviews');
  112 |     await page.getByRole('button', { name: /My Posts/i }).click();
  113 | 
  114 |     await page.getByRole('button', { name: /^Delete$/i }).click();
  115 |     await page.getByRole('button', { name: 'Delete' }).click();
  116 | 
  117 |     // After the only review is deleted, the empty state shows
  118 |     await expect(
  119 |       page.getByText('You have not left any reviews yet.')
  120 |     ).toBeVisible();
  121 |   });
```