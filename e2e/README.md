# E2E Tests — EPIC1: Review System

Playwright tests covering every user story in the Review System EPIC.

## Coverage

| User Story | File | What it tests |
|---|---|---|
| **US1-1** Write review for completed booking | `us1-1-write-review.spec.ts` | Review button visibility on completed bookings, review form UI (star rating + comment + submit), 1–5 interactive star rating, successful POST `/reviews` with correct payload, error message on empty comment, error handling on backend failure, auth gate on `/bookings` |
| **US1-2** View past reviews | `us1-2-view-reviews.spec.ts` | GET `/reviews` is called with auth bearer token, review cards render provider/car name + rating + comment + date, empty state UI when no reviews, sign-in prompt for personal tab when unauthenticated |
| **US1-3** Edit submitted review | `us1-3-edit-review.spec.ts` | Edit button is owner-only, modal pre-fills existing rating + comment, PUT `/reviews/:id` is called with correct payload + auth, validation error on empty required field, error handling on PUT failure, Cancel discards changes |
| **US1-4** Delete review | `us1-4-delete-review.spec.ts` | Delete confirmation dialog (confirm/cancel), Cancel does not call DELETE, Confirm calls DELETE `/reviews/:id` with auth and removes from list, error handling on DELETE failure, empty state after deleting last review |

## How tests work (no real backend needed)

The tests don't depend on the actual backend. Instead they:

1. **Mock the NextAuth session** (`helpers/auth.ts`) by intercepting `/api/auth/session` so the page treats the user as logged-in.
2. **Mock the backend REST API** (`helpers/apiMocks.ts`) using `page.route()` to intercept calls to `/api/reviews`, `/api/reviews/:id`, `/api/bookings`, and `/api/providers`.

This makes the tests fast, deterministic, and runnable in CI without spinning up the backend.

## Running

```bash
# Run all e2e tests (headless)
npm run test:e2e

# Open Playwright's UI mode for development
npm run test:e2e:ui

# Run with a visible browser
npm run test:e2e:headed

# Run only one user story
npx playwright test e2e/us1-1-write-review.spec.ts

# Open the HTML report after a run
npm run test:e2e:report
```

The Playwright config (`playwright.config.ts`) automatically runs `npm run build && npm run start` on `http://127.0.0.1:3000` before the tests start.

## File layout

```
e2e/
├── README.md                        ← this file
├── helpers/
│   ├── auth.ts                      ← mockNextAuthSession / mockUnauthenticatedSession
│   ├── apiMocks.ts                  ← mockReviewBackend (intercepts /api/reviews, /api/bookings, /api/providers)
│   └── mockData.ts                  ← shared fixtures (TEST_USER, COMPLETED_BOOKING, SAMPLE_REVIEW, ...)
├── us1-1-write-review.spec.ts
├── us1-2-view-reviews.spec.ts
├── us1-3-edit-review.spec.ts
└── us1-4-delete-review.spec.ts
```
