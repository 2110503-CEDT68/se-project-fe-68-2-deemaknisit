# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: us1-3-edit-review.spec.ts >> US1-3: Edit a previously submitted review >> shows error message when PUT /reviews fails
- Location: e2e/us1-3-edit-review.spec.ts:102:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^Edit$/i })

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
  8   |  * correct or update my feedback.
  9   |  *
  10  |  * Tasks covered:
  11  |  *  - PUT /reviews/:reviewId endpoint (auth + ownership)
  12  |  *  - Edit Review modal pre-fills existing rating + comment
  13  |  *  - Validation error display for missing required fields
  14  |  */
  15  | test.describe('US1-3: Edit a previously submitted review', () => {
  16  |   test('Edit button is visible on the user\'s own review card', async ({ page }) => {
  17  |     await mockNextAuthSession(page);
  18  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  19  | 
  20  |     await page.goto('/reviews');
  21  |     await page.getByRole('button', { name: /My Posts/i }).click();
  22  | 
  23  |     // Edit + Delete buttons are owner-only
  24  |     await expect(page.getByRole('button', { name: /^Edit$/i })).toBeVisible();
  25  |     await expect(page.getByRole('button', { name: /^Delete$/i })).toBeVisible();
  26  |   });
  27  | 
  28  |   test('Edit modal pre-fills the existing rating and comment', async ({ page }) => {
  29  |     await mockNextAuthSession(page);
  30  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  31  | 
  32  |     await page.goto('/reviews');
  33  |     await page.getByRole('button', { name: /My Posts/i }).click();
  34  |     await page.getByRole('button', { name: /^Edit$/i }).click();
  35  | 
  36  |     // Dialog opens
  37  |     await expect(page.getByRole('heading', { name: 'Submit Your Review' })).toBeVisible();
  38  | 
  39  |     // Existing rating is pre-selected
  40  |     const checkedStar = page.locator(
  41  |       `input[name="review-rating"][value="${SAMPLE_REVIEW.rating}"]`
  42  |     );
  43  |     await expect(checkedStar).toBeChecked();
  44  | 
  45  |     // Existing comment is pre-filled
  46  |     await expect(page.getByLabel('Comment')).toHaveValue(SAMPLE_REVIEW.comment);
  47  |   });
  48  | 
  49  |   test('successfully updates a review (PUT /reviews/:id)', async ({ page }) => {
  50  |     await mockNextAuthSession(page);
  51  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  52  | 
  53  |     await page.goto('/reviews');
  54  |     await page.getByRole('button', { name: /My Posts/i }).click();
  55  |     await page.getByRole('button', { name: /^Edit$/i }).click();
  56  | 
  57  |     // Capture the PUT request
  58  |     const putPromise = page.waitForRequest(
  59  |       (req) =>
  60  |         req.url().includes(`/api/reviews/${SAMPLE_REVIEW._id}`) &&
  61  |         req.method() === 'PUT'
  62  |     );
  63  | 
  64  |     // Change rating to 2 and update the comment
  65  |     await page.locator('input[name="review-rating"][value="2"]').check({ force: true });
  66  |     await page.getByLabel('Comment').fill('Updated: was actually not great after all.');
  67  | 
  68  |     await page.getByRole('button', { name: 'Submit Review' }).click();
  69  | 
  70  |     const request = await putPromise;
  71  |     const body = JSON.parse(request.postData() || '{}');
  72  |     expect(body.rating).toBe(2);
  73  |     expect(body.comment).toBe('Updated: was actually not great after all.');
  74  | 
  75  |     // Auth header attached
  76  |     const auth = request.headers()['authorization'];
  77  |     expect(auth).toMatch(/^Bearer .+/);
  78  | 
  79  |     // After save, list reflects the new comment
  80  |     await expect(
  81  |       page.getByText('"Updated: was actually not great after all."')
  82  |     ).toBeVisible();
  83  |   });
  84  | 
  85  |   test('shows validation error when comment is cleared on edit', async ({ page }) => {
  86  |     await mockNextAuthSession(page);
  87  |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  88  | 
  89  |     await page.goto('/reviews');
  90  |     await page.getByRole('button', { name: /My Posts/i }).click();
  91  |     await page.getByRole('button', { name: /^Edit$/i }).click();
  92  | 
  93  |     // Clear the comment, then try to save
  94  |     await page.getByLabel('Comment').fill('');
  95  |     await page.getByRole('button', { name: 'Submit Review' }).click();
  96  | 
  97  |     await expect(
  98  |       page.getByText('Please share your thoughts - we require your comment!')
  99  |     ).toBeVisible();
  100 |   });
  101 | 
  102 |   test('shows error message when PUT /reviews fails', async ({ page }) => {
  103 |     await mockNextAuthSession(page);
  104 |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW], putFails: true });
  105 | 
  106 |     await page.goto('/reviews');
  107 |     await page.getByRole('button', { name: /My Posts/i }).click();
> 108 |     await page.getByRole('button', { name: /^Edit$/i }).click();
      |                                                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  109 | 
  110 |     await page.getByLabel('Comment').fill('Trying to update with a failing API.');
  111 |     await page.getByRole('button', { name: 'Submit Review' }).click();
  112 | 
  113 |     // The dialog renders a generic error indicator
  114 |     await expect(page.getByText('error', { exact: true })).toBeVisible();
  115 |   });
  116 | 
  117 |   test('Cancel closes the edit modal without saving', async ({ page }) => {
  118 |     await mockNextAuthSession(page);
  119 |     await mockReviewBackend(page, { reviews: [SAMPLE_REVIEW] });
  120 | 
  121 |     await page.goto('/reviews');
  122 |     await page.getByRole('button', { name: /My Posts/i }).click();
  123 |     await page.getByRole('button', { name: /^Edit$/i }).click();
  124 | 
  125 |     await page.getByLabel('Comment').fill('Trying to type something I will discard');
  126 |     await page.getByRole('button', { name: 'Cancel' }).click();
  127 | 
  128 |     // Dialog goes away
  129 |     await expect(
  130 |       page.getByRole('heading', { name: 'Submit Your Review' })
  131 |     ).toBeHidden();
  132 | 
  133 |     // Original comment is still there in the list
  134 |     await expect(page.getByText(`"${SAMPLE_REVIEW.comment}"`)).toBeVisible();
  135 |   });
  136 | });
  137 | 
```