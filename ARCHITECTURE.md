# Posh Puzzle System Architecture & Design Specification

## 1. Executive Architecture Overview

**Posh Puzzle** is an enterprise-grade multi-vendor e-commerce marketplace platform engineered for luxury apparel, high-performance computing, audio hardware, and artisan accessories. The system implements a decoupled client-server architecture with an emphasis on visual prestige, sub-second latency, zero-crash fault tolerance, and atomic data integrity.

```
+-----------------------------------------------------------------------------------+
|                              Client Layer (Browser)                               |
|                                                                                   |
|  [ React 18 SPA ] -- [ Tailwind CSS Design Tokens ] -- [ Lucide Iconography ]     |
|         |                                                                         |
|         +--> Theme Context (Dark / Light Theme Token Persistence)                 |
|         +--> Auth Context (Role-Based JWT Session & 1-Click Demo Profiles)        |
|         +--> Cart Context (Real-Time Subtotal, Promo Calculation, Free Shipping)  |
|         +--> Wishlist Context (Local Storage Synced Saved Items)                  |
|         +--> Toast Notification System (Action Confirmations & Alerts)            |
|         +--> ErrorBoundary Hierarchy (Graceful Recovery & Fallback Views)         |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS / REST JSON (CORS-Gated)
                                         v
+-----------------------------------------------------------------------------------+
|                              Server Layer (Node/Express)                          |
|                                                                                   |
|  [ Express 4 Engine ]                                                             |
|         |                                                                         |
|         +--> Security Core: Helmet, CORS Whitelisting, Express Rate Limiter       |
|         +--> Middleware: Cookie Parser, JWT Bearer Extraction, Morgan Logger      |
|         +--> Request Validation: Zod Schema Validators (Fail-Fast Boundary)       |
|         |                                                                         |
|         +--> Controllers (HTTP Transport & Status Code Mapping):                  |
|         |      AuthController, ProductController, OrderController,                |
|         |      ShopController, EventController                                    |
|         |                                                                         |
|         +--> Domain Service Layer (Pure Business Logic):                          |
|                authService, productService, orderService, shopService,            |
|                eventService                                                       |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Abstracted Data Gateway
                                         v
+-----------------------------------------------------------------------------------+
|                             Persistence Layer (Dual Engine)                       |
|                                                                                   |
|   +------------------------------------+    +---------------------------------+   |
|   | Primary: MongoDB via Mongoose      |    | Failover: Enterprise In-Memory  |   |
|   | Connection Timeout: 3000ms         | OR | Zero-Dependency Data Store      |   |
|   | Indexes: Text search, Shop, Status |    | Deep Clone & Seed Pre-Loaded    |   |
|   +------------------------------------+    +---------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture & State Management

### 2.1 Route Code-Splitting & Lazy Loading
The client application leverages `React.lazy()` and `Suspense` with an accessible `LoadingFallback` component to dynamically load route bundles on demand. This drastically reduces the initial JavaScript bundle footprint and optimizes Largest Contentful Paint (LCP):
- `/` -> `Home.jsx`
- `/products` -> `ProductsPage.jsx`
- `/product/:id` -> `ProductDetailsPage.jsx`
- `/checkout` -> `CheckoutPage.jsx`
- `/shop/:id` -> `ShopDetailsPage.jsx`
- `/vendor/dashboard` -> `VendorDashboardPage.jsx`
- `/profile` -> `ProfilePage.jsx`
- `/login` -> `Login.jsx`
- `/signup` -> `SignupPage.jsx`

### 2.2 Global Context Providers
State is partitioned into single-responsibility React contexts:
1. **`ThemeContext`**: Detects system dark/light preference, toggles root `.dark` class, and syncs preference to `localStorage`.
2. **`AuthContext`**: Manages user session state, JWT tokens, login/register mutations, and 1-click demo persona logins (`customer`, `vendor`, `admin`).
3. **`CartContext`**: Maintains cart items array, item count badges, dynamic subtotal, coupon discount application, and shipping threshold calculations.
4. **`WishlistContext`**: Persists saved product IDs in `localStorage` and exposes toggle, count, and drawer triggers.
5. **`ToastContext`**: Emits self-dismissing feedback notifications for cart additions, wishlist updates, and authentication events.

### 2.3 Resilient Error Boundaries
The UI is protected at multiple levels by `ErrorBoundary.jsx`, catching unhandled JavaScript runtime exceptions, displaying an elegant brand-aligned error card, and providing one-click recovery actions (`Reload Page`, `Back to Home`).

---

## 3. Backend Architecture & Service Layer

### 3.1 Controller-Service Separation
To decouple HTTP transport details from domain rules, the backend adheres to a strict Service Layer architecture:
- **`authService.js`**: Handles credential hashing via `bcryptjs`, email uniqueness checks, demo persona hydration, and profile/address mutation.
- **`productService.js`**: Orchestrates multi-facet filtering (search, category, price range, rating, vendor shop), pagination, review recalculation, and atelier ownership authorization on update/delete.
- **`orderService.js`**: Executes atomic inventory validation, transactional stock decrements, status transition lifecycles, and rollback on cancellation.
- **`shopService.js`**: Aggregates vendor atelier profiles, catalog counts, recent orders, and real-time revenue analytics.
- **`eventService.js`**: Validates promotional campaigns and computes percentage-based coupon discounts against cart totals.

### 3.2 Atomic Inventory Management
Checkout operations in `orderService.js` enforce inventory integrity:
1. **Pre-Validation**: Every line item in `cart` is verified against current catalog stock (`stock >= requested_qty`). If any item is depleted, the transaction aborts with a descriptive `400 Bad Request`.
2. **Atomic Execution**: In MongoDB, updates utilize `{ _id: id, stock: { $gte: qty } }` with `$inc: { stock: -qty, soldCount: qty }`. If any condition fails during multi-item checkouts, previous decrements are rolled back immediately. In the In-Memory store, state mutations are applied in synchronized batches.
3. **Cancellation Reversal**: Transitioning an order status to `'Cancelled'` automatically replenishes the product inventory and decrements the `soldCount`.

---

## 4. Hybrid Persistence & Failover Engine

To guarantee zero deployment failure regardless of whether a local MongoDB daemon is provisioned:
1. **Startup Probe**: On launch, `config/db.js` probes the MongoDB URI with a 3000ms connection timeout.
2. **Seamless Fallback**: If MongoDB is unreachable, the system automatically activates `data/store.js`, an in-memory replica with identical query semantics (`find`, `findOne`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`).
3. **Data Hydration**: The store pre-loads realistic seed data (`data/seeds.js`) encompassing 8 luxury products across 4 categories, 2 vendor shops, promotional coupons (`POSH20`), and test customer/vendor accounts.

---

## 5. Security Architecture

1. **Helmet**: Sets secure HTTP response headers (`X-DNS-Prefetch-Control`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`).
2. **CORS Boundary**: Configured strictly to whitelist client origins (`http://localhost:3000`, `http://localhost:3001`).
3. **Rate Limiting**: Rate limiter restricts incoming API traffic to 1,000 requests per 15-minute window per IP.
4. **Input Sanitization & Schema Validation**: `zod` schemas validate incoming payloads on `/api/auth/register`, `/api/auth/login`, `/api/products`, and `/api/orders` before reaching controller logic.
5. **Role-Based Access Control (RBAC)**: `authorizeRoles('vendor', 'admin')` guards vendor management, status transitions, and atelier settings.
