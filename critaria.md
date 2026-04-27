# Acceptance Criteria Summary

---

## EPIC 1 — Review System

### US1-1 · Write a review after booking

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Completed booking → submit rating + comment → saved, shows "Thank you for your feedback!" |
| 2 | **Negative:** No completed booking → attempt to submit → blocked, shows error |

---

### US1-2 · View past review history

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Logged in + reviews exist → review history page shows all submitted reviews |
| 2 | **Empty state:** No reviews submitted → shows "Booking not complete yet. Review will appear here after return" |

---

### US1-3 · Edit a submitted review

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Existing review → update and submit → saved, shows "Review updated successfully" |
| 2 | **Validation:** Update with missing comment → shows "Please share your thoughts - we require your comment!" and changes not saved |

---

### US1-4 · Delete a review

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Confirm delete → review removed, shows "Review deleted successfully" |
| 2 | **Cancel:** Cancel delete → review remains unchanged |

---

## EPIC 2 — Wishlist System

### US2-1 · Add a provider to wishlist

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Logged in → click "Add to Wishlist" on provider page → saved, shows "Added successfully" |
| 2 | **Auth gate:** Not logged in → try to add → prompted to log in with "please log in first" |

---

### US2-2 · View saved wishlist

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Providers saved → "My Wishlist" section shows all providers with name and location |
| 2 | **Empty state:** Wishlist empty → shows "Your wishlist is currently empty." |

---

### US2-3 · Remove a provider from wishlist

| # | Acceptance Criteria |
|---|---|
| 1 | **Happy path:** Click "Remove" icon in wishlist → provider immediately removed from list |
| 2 | **Toggle:** Click "Remove from Wishlist" on provider page → button reverts to "Add to Wishlist" |

---

### US2-4 · See wishlist status on provider

| # | Acceptance Criteria |
|---|---|
| 1 | **Detail page:** Provider already wishlisted → shows "Wishlisted" indicator instead of "Add to Wishlist" |
| 2 | **Listing view:** Wishlisted providers show highlighted heart icon on their preview card |