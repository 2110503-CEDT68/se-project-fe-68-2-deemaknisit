# E2E Tests - Review and Wishlist

This folder contains a freshly rebuilt Playwright suite focused on two product areas:

- Review system
- Wishlist system

## Coverage

- `reviews.spec.ts`
- Submit review from completed booking
- Review form validation for empty comment
- Edit review from personal reviews tab
- Delete review from personal reviews tab
- Unauthenticated sign-in prompt for personal reviews

- `wishlist.spec.ts`
- Unauthenticated sign-in prompt
- Render wishlist cards for authenticated user
- Remove item from wishlist
- Empty-state rendering

## Architecture

Tests are fully deterministic and do not require a real backend.

- `helpers/auth.ts` mocks NextAuth session endpoints.
- `helpers/fixtures.ts` stores canonical test fixtures.
- `helpers/mocks.ts` mocks backend endpoints used by review and wishlist flows.

## Run commands

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:e2e:debug
npm run test:e2e:report
```

Run a single suite:

```bash
npx playwright test e2e/reviews.spec.ts
npx playwright test e2e/wishlist.spec.ts
```
