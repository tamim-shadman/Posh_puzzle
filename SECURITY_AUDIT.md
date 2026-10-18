# Posh Puzzle Enterprise Security Audit & Threat Model

## 1. Executive Security Summary

An exhaustive security evaluation was performed on the **Posh Puzzle** multi-vendor marketplace platform. The assessment covered authentication workflows, authorization boundaries, session management, input validation, transport security, data integrity, and denial-of-service resilience.

| Security Domain | Posture | Status |
| :--- | :--- | :--- |
| **Authentication & Credentials** | `bcryptjs` (salt factor 10), constant-time verification, demo isolation | `VERIFIED` |
| **Authorization (RBAC)** | Strict role gating (`customer`, `vendor`, `admin`), server-side ownership checks | `VERIFIED` |
| **Input Validation** | Strict Zod boundary schemas on all mutation routes | `VERIFIED` |
| **Transport Security** | Helmet HTTP headers, CORS origin whitelisting, HTTP-only cookies | `VERIFIED` |
| **Abuse & DoS Prevention** | Express rate limiter (1000 req / 15 min per IP), payload limits (10MB) | `VERIFIED` |
| **Inventory Concurrency** | Atomic conditional stock decrements with rollback | `VERIFIED` |

---

## 2. Threat Modeling (STRIDE Analysis)

### 2.1 Spoofing Identity
- **Risk**: Attackers forging JWT tokens or guessing credentials to impersonate users or vendors.
- **Controls**:
  - JWT tokens signed with a dedicated secret key (`JWT_SECRET`) and a 7-day expiration lifespan (`JWT_EXPIRES_IN`).
  - Passwords hashed using `bcryptjs` with salt round 10 before storage.
  - Constant-time password comparisons preventing timing attacks.
  - User passwords excluded from API response payloads (`select: false` in Mongoose and sanitized in service layer).

### 2.2 Tampering with Data
- **Risk**: Modifying order totals, tampering with item prices, or manipulating inventory quantities during checkout.
- **Controls**:
  - Server-side order calculation: `orderService.js` and `orderController.js` validate product IDs and stock against the authoritative catalog rather than trusting client-submitted quantities or prices.
  - Atomic stock verification prevents negative stock levels.
  - Zod schemas enforce positive numbers and non-empty cart constraints.

### 2.3 Repudiation
- **Risk**: Users or vendors denying placed orders or updated delivery statuses.
- **Controls**:
  - Unique, unguessable order identifier generated server-side: `POSH-XXXXXX`.
  - Timestamped audit stamps (`createdAt`, `deliveredAt`).
  - Structured request logging with Morgan recording HTTP verbs, paths, response codes, and response times.

### 2.4 Information Disclosure
- **Risk**: Leaking database stack traces, internal IDs, or sensitive environment variables in error responses.
- **Controls**:
  - Centralized `errorHandler.js` intercepts all exceptions. In production (`NODE_ENV === 'production'`), error details and stack traces are suppressed, returning clean, generic messages to the client.
  - No secrets, database connection strings, or credentials exposed in frontend environment variables.

### 2.5 Denial of Service (DoS)
- **Risk**: Rapid automated requests exhausting server threads or database connections.
- **Controls**:
  - `express-rate-limit` enforces a threshold of 1,000 requests per 15-minute window per IP address across all `/api` endpoints.
  - Express JSON and URL-encoded body parsers capped at `10mb`.

### 2.6 Elevation of Privilege
- **Risk**: A standard `customer` updating vendor order statuses, deleting other vendors' products, or accessing admin metrics.
- **Controls**:
  - Role-based authorization middleware `authorizeRoles('vendor', 'admin')` protects vendor routes.
  - `productService.js` verifies that the requesting vendor owns the product's associated atelier before allowing `updateProduct` or `deleteProduct` mutations.

---

## 3. Vulnerability Findings & Verification Matrix

| Vulnerability ID | Description | Severity | Remediation Implemented | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Missing server-side stock check during checkout | **HIGH** | Implemented atomic stock validation & rollback in `orderService.js` | `VERIFIED` (via automated test suite) |
| **SEC-02** | Unbounded input payloads on user registration | **MEDIUM** | Enforced Zod validation schema on name, email, password | `VERIFIED` |
| **SEC-03** | Missing CORS boundary allowing arbitrary origin requests | **MEDIUM** | Whitelisted specific client origins in CORS middleware | `VERIFIED` |
| **SEC-04** | Potential server crash when MongoDB is offline | **HIGH** | Engineered seamless failover to in-memory store in `config/db.js` | `VERIFIED` |
| **SEC-05** | Missing accessible labels on icon-only interactive controls | **LOW** | Added explicit `aria-label` to all buttons across UI | `VERIFIED` |

---

## 4. Production Security Checklist

- [x] All API endpoints protected with rate limiting.
- [x] Passwords hashed with bcrypt before persistence.
- [x] JWT secrets loaded strictly from environment configuration.
- [x] CORS origin restricted to trusted domains.
- [x] Helmet security headers active.
- [x] Production builds stripped of sourcemaps.
- [x] Database fallback isolates in-memory state cleanly per instance.
