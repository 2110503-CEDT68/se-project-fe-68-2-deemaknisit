# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: us1-1-write-review.spec.ts >> US1-1: Write a review for a completed booking >> shows error message when POST /reviews fails (server error)
- Location: e2e/us1-1-write-review.spec.ts:121:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^Review$/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - heading "Access Denied" [level=1] [ref=e19]
      - paragraph [ref=e20]: Please sign in to manage your bookings.
      - button "Sign In" [ref=e21]
```

# Test source

```ts
  30  | 
  31  |     // Pending booking shows the Return Car button (NOT a Review button)
  32  |     await expect(page.getByRole('button', { name: /Return Car/i })).toBeVisible();
  33  |   });
  34  | 
  35  |   test('opens the review form with star rating, comment textarea, and submit button', async ({ page }) => {
  36  |     await mockNextAuthSession(page);
  37  |     await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });
  38  | 
  39  |     await page.goto('/bookings');
  40  |     await page.getByRole('button', { name: /^Review$/i }).first().click();
  41  | 
  42  |     // Dialog header
  43  |     await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();
  44  | 
  45  |     // Star rating component (MUI Rating renders 5 radio inputs labelled 1-5 stars)
  46  |     const stars = page.locator('input[name="review-rating"]');
  47  |     await expect(stars).toHaveCount(5);
  48  | 
  49  |     // Comment textarea
  50  |     await expect(page.getByLabel('Comment')).toBeVisible();
  51  | 
  52  |     // Submit + Cancel buttons
  53  |     await expect(page.getByRole('button', { name: 'Submit Review' })).toBeVisible();
  54  |     await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  55  |   });
  56  | 
  57  |   test('star rating is interactive (1-5 stars)', async ({ page }) => {
  58  |     await mockNextAuthSession(page);
  59  |     await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });
  60  | 
  61  |     await page.goto('/bookings');
  62  |     await page.getByRole('button', { name: /^Review$/i }).first().click();
  63  | 
  64  |     // Click on the 5-star option
  65  |     const fiveStar = page.locator('input[name="review-rating"][value="5"]');
  66  |     await fiveStar.check({ force: true });
  67  |     await expect(fiveStar).toBeChecked();
  68  | 
  69  |     // Click on the 1-star option
  70  |     const oneStar = page.locator('input[name="review-rating"][value="1"]');
  71  |     await oneStar.check({ force: true });
  72  |     await expect(oneStar).toBeChecked();
  73  |   });
  74  | 
  75  |   test('successfully submits a review with rating + comment (POST /reviews)', async ({ page }) => {
  76  |     await mockNextAuthSession(page);
  77  |     await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });
  78  | 
  79  |     // Capture the POST request to assert correct payload
  80  |     const postPromise = page.waitForRequest(
  81  |       (req) =>
  82  |         req.url().includes('/api/reviews') &&
  83  |         req.method() === 'POST'
  84  |     );
  85  | 
  86  |     await page.goto('/bookings');
  87  |     await page.getByRole('button', { name: /^Review$/i }).first().click();
  88  | 
  89  |     // Pick rating = 4
  90  |     await page.locator('input[name="review-rating"][value="4"]').check({ force: true });
  91  | 
  92  |     // Fill comment
  93  |     await page.getByLabel('Comment').fill('Loved the car! Would book again.');
  94  | 
  95  |     // Submit
  96  |     await page.getByRole('button', { name: 'Submit Review' }).click();
  97  | 
  98  |     const request = await postPromise;
  99  |     const body = JSON.parse(request.postData() || '{}');
  100 |     expect(body.rating).toBe(4);
  101 |     expect(body.comment).toBe('Loved the car! Would book again.');
  102 |     expect(body.bookingId).toBeTruthy();
  103 |   });
  104 | 
  105 |   test('shows error message when submitting with empty comment', async ({ page }) => {
  106 |     await mockNextAuthSession(page);
  107 |     await mockReviewBackend(page, { bookings: [COMPLETED_BOOKING], reviews: [] });
  108 | 
  109 |     await page.goto('/bookings');
  110 |     await page.getByRole('button', { name: /^Review$/i }).first().click();
  111 | 
  112 |     // Leave rating at default (3) and comment blank, then click submit
  113 |     await page.getByRole('button', { name: 'Submit Review' }).click();
  114 | 
  115 |     // Required-field helper text appears
  116 |     await expect(
  117 |       page.getByText('Please share your thoughts - we require your comment!')
  118 |     ).toBeVisible();
  119 |   });
  120 | 
  121 |   test('shows error message when POST /reviews fails (server error)', async ({ page }) => {
  122 |     await mockNextAuthSession(page);
  123 |     await mockReviewBackend(page, {
  124 |       bookings: [COMPLETED_BOOKING],
  125 |       reviews: [],
  126 |       postFails: true,
  127 |     });
  128 | 
  129 |     await page.goto('/bookings');
> 130 |     await page.getByRole('button', { name: /^Review$/i }).first().click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  131 | 
  132 |     await page.locator('input[name="review-rating"][value="3"]').check({ force: true });
  133 |     await page.getByLabel('Comment').fill('This should fail.');
  134 | 
  135 |     // The component uses alert() on failure when called from BookingList
  136 |     page.once('dialog', async (dialog) => {
  137 |       expect(dialog.message().toLowerCase()).toContain('failed');
  138 |       await dialog.accept();
  139 |     });
  140 | 
  141 |     await page.getByRole('button', { name: 'Submit Review' }).click();
  142 |   });
  143 | 
  144 |   test('cannot submit review when not authenticated (redirected to login)', async ({ page }) => {
  145 |     await mockUnauthenticatedSession(page);
  146 | 
  147 |     await page.goto('/bookings');
  148 | 
  149 |     // The /bookings page renders an "Access Denied" gate for unauthenticated users
  150 |     await expect(page.getByText(/Access Denied/i)).toBeVisible();
  151 |     await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  152 |   });
  153 | });
  154 | 
```