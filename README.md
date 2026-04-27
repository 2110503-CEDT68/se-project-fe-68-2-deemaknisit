FE vercel: https://se-project-fe-68-2-deemaknisit.vercel.app/

## E2E Selector Convention (Step 1)

For Playwright tests, use `id` selectors as the primary strategy:

- Prefer: `page.locator('#login-submit-button')`
- Avoid: text-only selectors for critical actions
- Keep naming stable and semantic

### Naming format

Use kebab-case with this structure:

`<scope>-<element>-<role>`

Examples:

- `login-email-input`
- `register-submit-button`
- `review-error-message`
- `bookings-provider-select`

For dynamic list items:

`<scope>-<action>-<entity>-${id}`

Examples:

- `booking-delete-button-${booking._id}`
- `car-card-link-${id}`
- `review-list-edit-button-${review.reviewId}`

### Rule of thumb by element type

- Forms: `*-form`
- Inputs/selects/date fields: `*-input` / `*-select`
- Buttons/links: `*-button` / `*-link`
- Feedback text: `*-message`
- Dialog wrappers: `*-dialog`, `*-dialog-title`, `*-dialog-actions`

## Selector Map (Step 2)

See the full selector map for current IDs:

- [`docs/testing/SELECTOR_MAP.md`](docs/testing/SELECTOR_MAP.md)