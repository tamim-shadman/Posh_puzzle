# Posh Puzzle: Critical Journey & Regression Test Matrix

| Document Version | Evaluation Date | Test Harness | Suite Outcome |
| :--- | :--- | :--- | :--- |
| **2.1.0-RC** | 2026-10-18 | Jest v29 + Supertest v6 + React Testing Library | **22 / 22 Tests Passing (100%)** |

---

## 1. Critical User Journeys (CUJ)

| Journey ID | Title | Starting State | Actions Performed | Expected Result | Observed Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CUJ-01** | **Customer Catalog Discovery & Filtering** | Guest on Home (`/`) | Click "Catalog", select "Computers and Laptops" category, sort by "Price: High to Low" | Filtered product grid displays matching products with updated pagination and facet chips | `VERIFIED` |
| **CUJ-02** | **Slide-Out Cart & Coupon Calculation** | Catalog with items | Click "Add to Bag", open drawer, apply coupon code `POSH20` | Real-time 20% discount subtracted, free shipping progress bar updates, badge displays coupon name | `VERIFIED` |
| **CUJ-03** | **Guest Checkout with Seamless 1-Click Auth** | Cart with items | Click "Checkout", observe guest banner, click "1-Click Customer Login", proceed through 3 steps | Order placed with unique `POSH-XXXXXX` number, cart cleared, stock decremented | `VERIFIED` |
| **CUJ-04** | **Prevent Client-Side Price Tampering** | Manipulated payload | Attacker sends order request with item price `$0.01` and `totalPrice: 0.01` | Server overrides manipulated input with authoritative catalog price and computes verified total | `VERIFIED` (via automated test) |
| **CUJ-05** | **Atomic Inventory Stock Protection** | Low-stock item (e.g. 5 units) | Client submits order requesting `999,999` units | Server rejects transaction with `400 Bad Request` and descriptive error; inventory unchanged | `VERIFIED` (via automated test) |
| **CUJ-06** | **Vendor Atelier Dashboard & Lifecycle** | Vendor on `/` | 1-Click Vendor Login, navigate to `/vendor/dashboard`, view metrics, update order status | Metrics load (revenue, orders), status updates from `Processing` to `Shipping`, stock intact | `VERIFIED` |

---

## 2. Adversarial & Edge-Case Test Scenarios

| Test Scenario | Input / Vector | Expected Outcome | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Edge-01: ReDoS & Special Regex Search** | `GET /api/products?search=(*` | Regex characters escaped; returns 200 without crashing | Returns 200 OK with empty or matched products | `VERIFIED` |
| **Edge-02: Negative & Oversized Pagination** | `GET /api/products?page=-5&limit=99999` | `page` clamped to 1; `limit` clamped to 100 max | Returns 200 OK with clamped pagination metadata | `VERIFIED` |
| **Edge-03: Empty Cart Order Submission** | `POST /api/orders` with `cart: []` | Zod validator and service reject empty cart | `400 Bad Request`: "Cart cannot be empty" | `VERIFIED` |
| **Edge-04: Expired or Malformed Coupon** | `POST /api/events/validate-coupon` (`INVALID_CODE`) | Rejects code with clear failure response | `404 Not Found`: "Coupon code is invalid or expired" | `VERIFIED` |
| **Edge-05: Missing Coupon Field** | `POST /api/events/validate-coupon` without `code` | Validation fails fast | `400 Bad Request`: "Please provide a coupon code" | `VERIFIED` |
| **Edge-06: Unauthenticated Order Creation** | `POST /api/orders` without Bearer token | Guard middleware prevents unauthenticated write | `401 Unauthorized`: "Please login to access this resource" | `VERIFIED` |
| **Edge-07: Out-of-Stock Product View** | Product with `stock: 0` | UI disables "Add to Bag" and "Buy Now", shows "Out of Stock" | Buttons disabled, counter set to 0 | `VERIFIED` |
| **Edge-08: Deep Linking Tab Synchronization** | Navigate to `/profile?tab=orders` while on profile | UI dynamically synchronizes `activeTab` to "orders" | Orders table renders immediately | `VERIFIED` |

---

## 3. Test Suite Execution Summary

```
PASS backend/tests/api.test.js
  Posh Puzzle Backend Enterprise API Suite
    GET /api/health
      √ should return 200 OK with healthy status and service name (67 ms)
    GET /api/products
      √ should retrieve list of products with pagination metadata (9 ms)
      √ should filter products by category (7 ms)
      √ should retrieve single product details by valid ID (12 ms)
      √ should return 404 for non-existent product ID (7 ms)
      √ should handle special regex search characters without crashing or ReDoS (6 ms)
      √ should safely clamp negative or excessively large pagination parameters (8 ms)
    POST /api/events/validate-coupon
      √ should validate POSH20 promo code and return 20% discount (16 ms)
      √ should reject invalid or expired coupon codes (7 ms)
      √ should reject request missing coupon code (7 ms)
    POST /api/auth/demo/:role
      √ should authenticate customer demo account successfully (10 ms)
      √ should authenticate vendor demo account successfully (7 ms)
    Order Processing & Atomic Inventory Checks
      √ should reject order creation if cart is empty (17 ms)
      √ should reject order if requested quantity exceeds stock (20 ms)
      √ should successfully place order and decrement inventory when stock is sufficient (26 ms)
      √ should prevent client-side price manipulation and authoritatively enforce catalog prices (20 ms)
      √ should authoritatively compute and apply verified coupon discount during order creation (20 ms)

PASS frontend/src/context/CartContext.test.js
  CartContext Unit Suite
    √ initializes with empty cart and zero counts
    √ accurately calculates item count and subtotal when products are added
    √ updates item quantity and recalculates totals correctly
    √ removes product from cart and resets totals

PASS frontend/src/App.test.js
  √ renders Posh Puzzle brand in navbar
```
