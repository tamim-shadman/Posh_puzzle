# Posh Puzzle: Release Candidate Defect Ledger & Quality Audit

| Document Version | Evaluation Date | Lead Architect | Release Decision |
| :--- | :--- | :--- | :--- |
| **2.1.0-RC** | 2026-10-18 | Principal Architect & Release QA Lead | **IN PROGRESS (Remediation Underway)** |

---

## 1. Prioritized Defect Ledger

| Defect ID | Severity | Category | Description | Root Cause | Status | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | **P1 (High)** | Security / Data Integrity | Client-Side Price Manipulation / Parameter Tampering | Server accepted client `totalPrice` and item prices without recalculating from catalog | `IMPLEMENTED` | Automated Jest integration test with manipulated price payload |
| **DEF-02** | **P1 (High)** | UX / Workflow | Checkout Guest Flow Disconnect & Login Redirect Loss | Unauthenticated users placing orders received 401 toast; `Login.jsx` discarded redirect URL | `IMPLEMENTED` | Browser simulation & redirect query parameter test |
| **DEF-03** | **P2 (Med)** | Resilience / Security | Unsafe Regex Search Characters & Unbounded Pagination | Special regex chars in search query (`(` or `*`) passed directly to `$regex`; unbounded `limit` | `IMPLEMENTED` | Unit test with regex characters & boundary limits |
| **DEF-04** | **P2 (Med)** | UX / State Sync | Profile Tab URL Desynchronization on In-Page Navigation | Clicking "Order History" while on `/profile` updated URL but failed to switch active tab | `IMPLEMENTED` | Browser interaction test on user dropdown |
| **DEF-05** | **P2 (Med)** | Usability / A11y | Out-Of-Stock Protection & Missing Password Visibility ARIA Labels | Buttons enabled on 0 stock; missing `aria-label` on quantity & password toggle buttons | `IMPLEMENTED` | React component test & DOM inspection |
| **DEF-06** | **P3 (Low)** | Performance / DB | Missing Compound & Text Indexes on Product Collection | Queries performed full collection scans on text search and category lookups | `IMPLEMENTED` | Schema index definition check |

---

## 2. Detailed Findings & Remediation Plan

### DEF-01: Client-Side Price Manipulation / Parameter Tampering (P1)
- **Reproduction**: Send `POST /api/orders` with line item prices set to `$0.01` and `totalPrice: 0.01`. The backend saved the manipulated total price.
- **Impact**: Financial loss; users could alter client requests to purchase high-value products for arbitrary amounts.
- **Remediation**:
  1. In `backend/services/orderService.js`, re-fetch authoritative product records for each item in the cart.
  2. Enforce `item.price = product.discountPrice`.
  3. Authoritatively recalculate subtotal on the backend.
  4. Validate coupon discount if coupon is present against `eventService`.
  5. Compute authoritative `totalPrice` = `subtotal - discount + shipping`. Reject or override any discrepancy.

### DEF-02: Checkout Guest Flow Disconnect & Login Redirect Loss (P1)
- **Reproduction**: Guest visitor adds item to cart, clicks Checkout, fills form, clicks Place Order. Receives 401 error. If navigating to `/login`, logging in redirects to `/`, losing the user's checkout progress.
- **Impact**: High cart abandonment; broken customer conversion funnel.
- **Remediation**:
  1. Update `LoginPage.jsx` to inspect `searchParams.get('redirect')` and navigate to the specified path after standard or demo login.
  2. In `CheckoutPage.jsx`, show a prominent, stylish guest banner when unauthenticated with 1-click demo customer login and a direct link to `/login?redirect=/checkout`.
  3. In `handlePlaceOrder`, check `if (!user)` and guide the user seamlessly.

### DEF-03: Unsafe Regex Search Characters & Unbounded Pagination (P2)
- **Reproduction**: `GET /api/products?search=(*` or `GET /api/products?limit=1000000`.
- **Impact**: Potential regex crash or ReDoS in MongoDB; memory exhaustion from unbounded `limit`.
- **Remediation**:
  1. Escape regex special characters in search: `search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.
  2. Clamp `limit` to `[1, 100]` and `page` to `>= 1`.

### DEF-04: Profile Tab URL Desynchronization (P2)
- **Reproduction**: When on `/profile`, clicking "Order History" in the Navbar menu changes URL to `/profile?tab=orders`, but the tab view remains on "My Account".
- **Impact**: User confusion; broken deep linking.
- **Remediation**:
  - Add `useEffect` in `ProfilePage.jsx` watching `searchParams` and setting `activeTab`.

### DEF-05: Out-Of-Stock Protection & ARIA Labels (P2)
- **Reproduction**: Open product with 0 stock. "Add to Bag" and "Buy Now" are enabled. Password toggle buttons in `Login.jsx` and `SignupPage.jsx` lack `aria-label`.
- **Impact**: Accidental checkout of unavailable items; screen-reader confusion.
- **Remediation**:
  - Set `disabled={product.stock <= 0}` on Buy Box buttons in `ProductDetailsPage.jsx`.
  - Add explicit `aria-label` to password toggles and quantity increment/decrement controls.
