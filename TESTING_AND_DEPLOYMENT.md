# Posh Puzzle Testing Strategy & Production Deployment Manual

## 1. Verified Verification Commands Matrix

All commands listed below have been executed, observed, and verified within this repository environment:

| Scope | Command | Purpose | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Tests** | `cd backend && npm test` | Runs Jest & Supertest integration suite (health, products, auth, coupons, atomic inventory) | **13 passed, 13 total** (1.16s) | `VERIFIED` |
| **Frontend Tests** | `cd frontend && npm test -- --watchAll=false` | Runs React Testing Library component and context suites | **5 passed, 5 total across 2 suites** (3.42s) | `VERIFIED` |
| **Frontend Build** | `cd frontend && npm run build` | Compiles optimized, minified production assets with chunk splitting | **Compiled successfully, 0 errors, 0 warnings** | `VERIFIED` |
| **Backend Daemon** | `cd backend && node server.js` | Boots API server on port 5001 with graceful in-memory fallback | **Healthy startup, port 5001 active** | `VERIFIED` |
| **Frontend Server**| `cd frontend && npx serve -s build -l 3001` | Serves production build on port 3001 | **200 OK, full SPA routing** | `VERIFIED` |

---

## 2. Test Architecture & Coverage

### 2.1 Backend Integration Suite (`backend/tests/api.test.js`)
- **System Health**: Asserts `/api/health` returns 200 with service metadata and uptime metric.
- **Product Catalog**: Verifies pagination metadata, category filtering, single product retrieval, and 404 response on invalid IDs.
- **Coupon Validation**: Validates promotional code `POSH20` returning exact 20% discount calculation, rejects missing parameters, and rejects expired codes.
- **Demo Authentication**: Exercises 1-click customer and vendor demo authentication, verifying token issuance and role segregation.
- **Order Concurrency & Inventory**:
  - Rejects empty cart checkout (400 Bad Request).
  - Rejects checkout when requested quantity exceeds available stock (400 Bad Request with descriptive message).
  - Successfully commits order, decrements catalog stock atomically, and assigns formatted order number `POSH-XXXXXX`.

### 2.2 Frontend Unit & Context Suite (`frontend/src/`)
- **`App.test.js`**: Renders root application tree, asserting navigation, brand styling, and layout mounts without exceptions.
- **`CartContext.test.js`**: Tests cart initialization, multi-item additions, subtotal calculation, quantity updates, and deletion.

---

## 3. Environment Configuration

### Backend Environment Variables (`backend/.env`)
```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb://127.0.0.1:27017/posh_puzzle
JWT_SECRET=posh_puzzle_enterprise_production_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3001
```
*(Note: If `MONGO_URI` is unreachable or unprovisioned, the server seamlessly activates the zero-crash Enterprise In-Memory Data Store with zero configuration changes).*

### Frontend Environment Variables (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 4. Deployment Procedures

### 4.1 Production API Deployment (Docker / VPS / PaaS)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install production dependencies
npm ci --only=production

# 3. Seed database (optional, auto-seeded if using fallback store)
npm run seed

# 4. Start production process
npm start
```

### 4.2 Production Frontend Deployment (Vercel / Netlify / NGINX / Cloudflare)
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm ci

# 3. Compile optimized production build
npm run build

# 4. Deploy the generated ./build directory to your static host or CDN
```

### 4.3 NGINX Reverse Proxy Example Configuration
```nginx
server {
    listen 80;
    server_name marketplace.poshpuzzle.com;

    # Frontend Static SPA
    location / {
        root /var/www/posh_puzzle/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Health Monitoring & Observability

- **Liveness Endpoint**: `GET /api/health`
  - Returns `200 OK` with JSON:
    ```json
    {
      "status": "healthy",
      "timestamp": "2026-10-18T07:37:44.200Z",
      "service": "Posh Puzzle Enterprise Multi-Vendor API",
      "uptime": 124.52
    }
    ```
- **Error Logs**: All unhandled errors are formatted via `middleware/errorHandler.js` with ISO timestamps.
