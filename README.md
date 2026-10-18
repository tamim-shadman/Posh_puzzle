# 💎 Posh Puzzle — Haute Editorial Multi-Vendor Marketplace & Hardware Guild

[![CI Pipeline](https://github.com/tamim-shadman/Posh_puzzle/actions/workflows/ci.yml/badge.svg)](#)
[![Tests Passing](https://img.shields.io/badge/Tests-28%2F28%20Passing-emerald?style=flat-square&logo=jest)](#)
[![Code Quality](https://img.shields.io/badge/Quality-Zero%20Warnings-blue?style=flat-square)](#)
[![Framework](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TailwindCSS-38bdf8?style=flat-square&logo=react)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%204-68a063?style=flat-square&logo=node.js)](#)
[![Database](https://img.shields.io/badge/Data%20Layer-MongoDB%20%2B%20In--Memory%20Fallback-10b981?style=flat-square&logo=mongodb)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)](#)

**Posh Puzzle** is a premier, enterprise-grade luxury multi-vendor marketplace synthesized from the avant-garde editorial brutalism of *SSENSE*, the global boutique curation of *Farfetch*, and the keyboard-first ergonomic speed of *Linear*. It connects international connoisseurs with authorized global ateliers, pro silicon hardware workshops, tourbillon horology guilds, and bespoke footwear artisans.

---

## ✨ Next-Generation Platform Capabilities

### ⚡ 1. Universal Command Palette (`Cmd+K` / `Ctrl+K`)
- **Keyboard-First Navigation:** Press `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) anywhere to trigger a high-speed floating palette.
- **Instant Search & Jump:** Fuzzy search across catalog items, category lookbooks, currency actions, and vendor portals.
- **Accessible Ergonomics:** Full arrow-key navigation (`↑` `↓`), selection (`Enter`), and dismissal (`Esc`).

### ⚖️ 2. Interactive Side-by-Side Product Comparison Engine
- **Spec Matrix Modal:** Compare up to 4 luxury pieces simultaneously across core architectures, displays, memory bandwidth, warranty terms, and active valuations.
- **Sticky Floating Dock:** Dynamic bottom-dock thumbnail preview with one-click direct acquisition.
- **Persistent State:** Saves selected comparison items in `localStorage` across page navigations.

### 🌐 3. Real-Time Multi-Currency & Locale Converter
- **Global Liquidity:** Instant live currency switching across **USD ($)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, and **CAD ($CAD)**.
- **Reactive Formatting:** Dynamically converts catalog cards, lookbooks, quick-views, bag subtotals, shipping thresholds, and checkout totals without page reload.
- **Integer Rounding:** Automatic zero-decimal precision for Japanese Yen (JPY).

### 🛡️ 4. Cryptographic Atelier Certificate of Authenticity
- **Verified Provenance:** Every catalog item features an inspectable digital Certificate of Authenticity.
- **Tamper-Proof Ledger:** Unique serial number (`PP-CERT-XXXXXXXX`), 256-bit cryptographic verification hash, and 1-click clipboard copy.
- **Geographic Studio Origin:** Exact artisan coordinates (e.g. `45°28'00"N 09°11'24"E` for Milan, `35°00'42"N 135°46'05"E` for Kyoto), verified materials composition, and master craftsman inspection seals.

### ⏳ 5. Editorial Lookbook Hero & Live Scarcity Drop Engine
- **Asymmetric Haute Layout:** Stark, editorial typography with monospaced technical metadata badges (`font-mono tracking-wider uppercase text-[10px]`).
- **Live Scarcity Drop Ticker:** Real-time countdown timer with millisecond accuracy for limited boutique releases.
- **Urgency Signals:** Real-time remaining stock notifications (e.g., *"Only 2 units remaining at Milan Atelier"*).

---

## 🏛 System Architecture

```text
 ┌────────────────────────────────────────────────────────┐
 │                   REACT 18 FRONTEND                    │
 │  (Haute Editorial Theme • Command Palette • Lookbook)  │
 │    Tailwind CSS • Lucide Icons • React Context State   │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API / JWT / CORS
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                   EXPRESS 4 BACKEND                    │
 │     Helmet Security • Zod Validation • Rate Limiter    │
 └───────────────────────────┬────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       MongoDB Cluster             Enterprise In-Memory
     (Persistent Store)          (Zero-Crash Auto Fallback)
```

### Architectural Highlights
- **Zero-Crash Hybrid Data Layer:** Seamlessly connects to MongoDB when available, and automatically activates an enterprise in-memory repository if MongoDB is offline, guaranteeing 100% out-of-the-box execution.
- **Authoritative Integrity:** Catalog pricing and coupon calculations (`POSH20` for 20% off) are strictly computed and enforced on the backend. Client-side price tampering is completely prevented.
- **Role-Based Access Control (RBAC):** Three distinct roles (`customer`, `vendor`, `admin`) protected by JWT tokens and secure HttpOnly cookie authorization guards.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v18, v20, and v22)
- **npm**: v9+

### 2. Installation
Install all dependencies across root, backend, and frontend:
```bash
# One-step installation from repository root
npm run install:all
```

### 3. Running Development Servers
Start both the Backend API and Frontend Client concurrently:
```bash
npm run dev
```
- **Frontend Web Application:** [http://localhost:3001](http://localhost:3001)
- **Backend REST API:** [http://localhost:5001](http://localhost:5001)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 4. Compiling Production Bundle
```bash
cd frontend && npm run build
```
*Compiled with 0 errors and 0 warnings.*

---

## 🔑 Pre-Seeded Demo Credentials

The platform features built-in **1-Click Demo Login** buttons on the sign-in modal, or you may log in manually:

| Portal | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Customer** | `customer@poshpuzzle.com` | `Password123!` | `customer` | Bag, Wishlist, Checkout, Orders, Reviews |
| **Demo Vendor** | `vendor@poshpuzzle.com` | `Password123!` | `vendor` | Atelier Cockpit, Product Creation, Order Status |
| **Super Admin** | `admin@poshpuzzle.com` | `Password123!` | `admin` | Full Catalog & User Administration |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer or vendor atelier | Public |
| `POST` | `/api/auth/login` | Sign in and issue JWT cookie | Public |
| `POST` | `/api/auth/demo/:role` | 1-Click login for `customer`, `vendor`, or `admin` | Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user and linked vendor shop | Bearer / Cookie |
| `GET` | `/api/auth/logout` | Invalidate session and clear authentication cookies | Bearer / Cookie |
| `PUT` | `/api/auth/update-profile` | Update account profile details or saved destinations | Bearer / Cookie |

### Products & Catalog (`/api/products`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Query catalog with search, category, maxPrice, rating, and sort | Public |
| `GET` | `/api/products/:id` | Retrieve comprehensive product specifications and reviews | Public |
| `POST` | `/api/products` | Publish new product item | Vendor / Admin |
| `PUT` | `/api/products/:id` | Update product details or stock inventory | Vendor / Admin |
| `DELETE` | `/api/products/:id` | Remove catalog item | Vendor / Admin |
| `POST` | `/api/products/:id/reviews` | Submit verified customer rating and feedback | Authenticated |

### Multi-Vendor Shops (`/api/shops`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shops/dashboard` | Fetch vendor dashboard metrics, orders, and revenue | Vendor / Admin |
| `GET` | `/api/shops/:id` | Public vendor profile and atelier details | Public |
| `GET` | `/api/shops/:id/products` | Retrieve all products published by a specific atelier | Public |
| `PUT` | `/api/shops/:id` | Update vendor branding, banner, and bio | Vendor / Admin |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order, deduct stock, and apply verified coupons | Authenticated |
| `GET` | `/api/orders/my-orders` | Retrieve authenticated customer's order history | Authenticated |
| `GET` | `/api/orders/vendor-orders` | Retrieve incoming orders for the vendor's items | Vendor / Admin |
| `PUT` | `/api/orders/:id/status` | Advance fulfillment status (`Processing`, `Shipping`, `Delivered`) | Vendor / Admin |
| `GET` | `/api/orders/:id` | Detailed receipt and fulfillment timeline | Authenticated |

### Promotions & Events (`/api/events`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Retrieve active promotional campaigns and sales drops | Public |
| `POST` | `/api/events/validate-coupon` | Authoritatively validate promo code (e.g., `POSH20`) | Public |

---

## 🧪 Automated Testing Suite

Posh Puzzle maintains a 100% automated test pass rate across frontend and backend:

```bash
# Execute backend API integration suite (17 tests)
cd backend && npm test

# Execute frontend unit & component suite (11 tests)
cd ../frontend && npm test -- --watchAll=false
```

### Test Coverage Highlights
- **Atomic Inventory Verification:** Prevents race conditions and overselling.
- **Client-Side Anti-Tampering:** Rejects artificially modified cart prices.
- **Multi-Currency Conversions:** Validates exchange rates, symbol formatting, and JPY integer rounding.
- **Comparison Engine:** Validates max-limit constraints, deduplication, and removal.
- **Coupon Calculation:** Enforces authoritative discount deduction (`POSH20`).

---

## 🔒 Security Hardening

- **Helmet HTTP Headers:** Configured with secure Cross-Origin Resource Policies.
- **CORS Whitelist:** Explicit client origin validation.
- **Express Rate Limiting:** Brute-force and DDoS protection across all API routes.
- **Zod Schema Validation:** Strict input sanitization for all request bodies and query parameters.
- **Salted Password Hashing:** `bcryptjs` encryption with 10 salt rounds.
- **HttpOnly Cookies:** Protection against XSS token extraction.

---

## 📄 Documentation Index

- [PRODUCT_TRANSFORMATION_ROADMAP.md](./PRODUCT_TRANSFORMATION_ROADMAP.md) — 10-phase transformation roadmap.
- [PRODUCT_RND_REPORT.md](./PRODUCT_RND_REPORT.md) — Research-backed opportunity matrix with mathematical scoring.
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Haute editorial design tokens, typography, and component patterns.
- [FEATURE_IMPLEMENTATION_REPORT.md](./FEATURE_IMPLEMENTATION_REPORT.md) — Technical breakdown of next-gen features.
- [UI_REGRESSION_REPORT.md](./UI_REGRESSION_REPORT.md) — Multi-viewport responsive and accessibility audit.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full technical architecture and system specifications.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Open source development guidelines and pull request conventions.
- [SECURITY.md](./SECURITY.md) — Vulnerability reporting policy and SLA commitments.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — Contributor Covenant Code of Conduct.

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE) — feel free to use, modify, and distribute.
