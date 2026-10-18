# 💎 Posh Puzzle — Flagship Multi-Vendor E-Commerce Platform

[![Production Ready](https://img.shields.io/badge/Status-Production%20Grade-emerald?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TailwindCSS%20%7C%20Express%20%7C%20MongoDB-indigo?style=flat-square)](#)
[![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20CORS%20%7C%20RateLimit%20%7C%20Zod-blue?style=flat-square)](#)

**Posh Puzzle** is a premier, enterprise-grade multi-vendor marketplace connecting verified global luxury ateliers, pro silicon hardware providers, and artisan footwear creators with discerning customers worldwide. Built to flagship design and architectural standards on par with Stripe, Linear, and Shopify.

---

## 🏛 System Architecture

```text
 ┌────────────────────────────────────────────────────────┐
 │                   REACT 18 FRONTEND                    │
 │  (Storefront / Ateliers / Vendor Portal / Bag Drawer)  │
 │            Styled with Tailwind CSS & Lucide           │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API / JWT / CORS
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                   EXPRESS BACKEND                      │
 │     Helmet Security • Zod Validation • Rate Limiter    │
 └───────────────────────────┬────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       MongoDB Cluster             Enterprise In-Memory
     (Persistent Store)          (Zero-Crash Auto Fallback)
```

### Key Technical Highlights
- **Hybrid Data Layer:** Connects natively to MongoDB, with an automated fallback to an enterprise In-Memory repository if MongoDB is offline, guaranteeing 100% out-of-the-box zero-crash execution.
- **Strict Role-Based Access Control (RBAC):** Three distinct user roles (`customer`, `vendor`, `admin`) with middleware authorization guards.
- **Glassmorphic Design System:** Fluid dark/light themes, HSL color tokens, micro-interactions, responsive drawers, and accessible modal dialogs.
- **Multi-Vendor Isolation:** Vendors manage independent storefronts, catalog items, revenue analytics, and fulfillment statuses.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **npm**: v9+

### 2. Installation
Install all dependencies across the root, backend, and frontend:
```bash
# Option A: One-step command from repository root
npm run install:all

# Option B: Manual directory installs
cd backend && npm install
cd ../frontend && npm install
```

### 3. Launching Services
Run the backend and frontend concurrently:
```bash
# Start both Backend (Port 5001) and Frontend (Port 3000/3001)
npm run dev

# Or run independently:
npm run server    # Starts Express API on http://localhost:5001
npm run client    # Starts React Client on http://localhost:3001
```

### 4. Database Seeding (Optional)
If connecting to a local or cloud MongoDB instance:
```bash
npm run seed
```

---

## 🔑 Pre-Seeded Demo Credentials

The platform features built-in **1-Click Demo Login** buttons on the sign-in modal, or you may log in manually:

| Portal | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `customer@poshpuzzle.com` | `Password123!` | Customer |
| **Demo Vendor** | `vendor@poshpuzzle.com` | `Password123!` | Vendor Atelier |
| **Super Admin** | `admin@poshpuzzle.com` | `Password123!` | System Administrator |

---

## 🛍 Marketplace Feature Tour

### Customer Storefront
- **Top Notification Bar:** Live promotional alerts, currency toggles, and instant dark/light mode switching.
- **Live Autocomplete Search:** Debounced instant product dropdown preview as users type.
- **Hero Showcase Carousel:** High-impact luxury banners with quick CTA routing.
- **Flash Deals of the Day:** Real-time countdown timer (Hours:Minutes:Seconds) with discount tags.
- **Multi-Facet Catalog Filters:** Filter by Department, Price Range slider ($100 - $3,500), Customer Star Ratings, and instant sorting (Low to High, High to Low, Rating, Best Selling).
- **Product Details:** Multi-image gallery with zoom/thumbnail selector, stock indicator, dynamic discount calculation, verified customer review submission, and related picks.
- **Slide-Over Bag & Wishlist Drawers:** Real-time item counters, Free Express Shipping progress bar (`$100` threshold), and coupon redemption (`POSH20` for 20% off).
- **Multi-Step Checkout:** Shipping destination address picker, simulated Stripe 256-bit card/COD/PayPal payment selection, and celebratory order confirmation modal.
- **User Profile:** Real-time order fulfillment timeline stepper (`Placed` ➔ `Processing` ➔ `Shipping` ➔ `Delivered`), saved destinations, and wishlist management.

### Multi-Vendor Atelier Portal
- **Vendor Dashboard (`/vendor/dashboard`):** Real-time financial metrics (Total Revenue, Orders, Products, Vendor Rating).
- **Fulfillment Status Manager:** Update incoming customer orders through fulfillment stages.
- **Product Publishing Modal:** Add new products with title, category, MSRP, discount price, stock, and high-resolution images.
- **Public Atelier Storefront (`/shop/:id`):** Dedicated vendor landing page showcasing atelier bio, location, customer rating, and product catalog.

---

## 📡 Core API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer or vendor atelier.
- `POST /api/auth/login` — Sign in and issue HttpOnly JWT cookie.
- `POST /api/auth/demo/:role` — 1-Click login for `customer`, `vendor`, or `admin`.
- `GET /api/auth/me` — Retrieve current authenticated user and linked vendor shop.
- `GET /api/auth/logout` — Invalidate session and clear auth cookies.
- `PUT /api/auth/update-profile` — Update account profile details or saved addresses.

### Products (`/api/products`)
- `GET /api/products` — Query catalog with search, category, min/max price, ratings, and sort.
- `GET /api/products/:id` — Retrieve comprehensive product specifications and reviews.
- `POST /api/products` — Create new product (Vendor / Admin only, Zod validated).
- `PUT /api/products/:id` — Update product details or stock (Vendor / Admin only).
- `DELETE /api/products/:id` — Remove catalog item (Vendor / Admin only).
- `POST /api/products/:id/reviews` — Submit verified customer rating and feedback.

### Multi-Vendor Shops (`/api/shops`)
- `GET /api/shops/dashboard` — Fetch vendor dashboard analytics, metrics, and orders.
- `GET /api/shops/:id` — Public vendor profile and atelier details.
- `GET /api/shops/:id/products` — Retrieve all products published by a specific atelier.
- `PUT /api/shops/:id` — Update vendor branding, banner, and bio.

### Orders (`/api/orders`)
- `POST /api/orders` — Submit new order, deduct product inventory, and notify vendors.
- `GET /api/orders/my-orders` — Retrieve authenticated user's order history.
- `GET /api/orders/vendor-orders` — Retrieve incoming orders for the vendor's items.
- `PUT /api/orders/:id/status` — Advance order status (`Processing`, `Shipping`, `Delivered`).
- `GET /api/orders/:id` — Detailed receipt and shipping timeline for an order.

### Promotions & Events (`/api/events`)
- `GET /api/events` — Retrieve active promotional campaigns and sales events.
- `POST /api/events/validate-coupon` — Validate discount code (e.g., `POSH20`) and calculate savings.

---

## 🔒 Security & Performance Hardening
- **Helmet HTTP Headers:** Configured with cross-origin resource policy.
- **CORS Whitelist:** Explicit client domain validation.
- **Express Rate Limiting:** Brute-force and DDoS protection across all `/api` endpoints.
- **Input Sanitization & Schema Validation:** Strict Zod validation schemas for all mutations.
- **Password Hashing:** Salted `bcryptjs` encryption.
- **Bundle Optimization:** Gzip-compressed production assets with responsive image delivery.

---

## 👥 Contributors & Credits
Crafted with precision by **Backbencher's Binary Solution**.
Licensed under the ISC License.
