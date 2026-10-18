const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Posh Puzzle Backend Enterprise API Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK with healthy status and service name', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toContain('Posh Puzzle');
      expect(typeof res.body.uptime).toBe('number');
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve list of products with pagination metadata', async () => {
      const res = await request(app).get('/api/products?limit=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body.page).toBe(1);
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category=Computers and Laptops');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      res.body.products.forEach((p) => {
        expect(p.category.toLowerCase()).toContain('computer');
      });
    });

    it('should retrieve single product details by valid ID', async () => {
      const listRes = await request(app).get('/api/products?limit=1');
      const sampleId = listRes.body.products[0]._id;

      const res = await request(app).get(`/api/products/${sampleId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product._id).toBe(sampleId);
    });

    it('should return 404 for non-existent product ID', async () => {
      const res = await request(app).get('/api/products/non_existent_id_9999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    // REGRESSION DEFENSE: DEF-03 (Regex special characters in search & clamped pagination)
    it('should handle special regex search characters without crashing or ReDoS', async () => {
      const res = await request(app).get('/api/products?search=(*&page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('should safely clamp negative or excessively large pagination parameters', async () => {
      const res = await request(app).get('/api/products?page=-5&limit=99999');
      expect(res.status).toBe(200);
      expect(res.body.page).toBe(1);
      expect(res.body.products.length).toBeLessThanOrEqual(100);
    });
  });

  describe('POST /api/events/validate-coupon', () => {
    it('should validate POSH20 promo code and return 20% discount', async () => {
      const res = await request(app)
        .post('/api/events/validate-coupon')
        .send({ code: 'POSH20', cartTotal: 100 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.coupon.discountPercentage).toBe(20);
      expect(res.body.coupon.discountAmount).toBe(20);
    });

    it('should reject invalid or expired coupon codes', async () => {
      const res = await request(app)
        .post('/api/events/validate-coupon')
        .send({ code: 'INVALID_CODE_123', cartTotal: 100 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should reject request missing coupon code', async () => {
      const res = await request(app)
        .post('/api/events/validate-coupon')
        .send({ cartTotal: 100 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/demo/:role', () => {
    it('should authenticate customer demo account successfully', async () => {
      const res = await request(app).post('/api/auth/demo/customer');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('customer');
      expect(res.body.token).toBeDefined();
    });

    it('should authenticate vendor demo account successfully', async () => {
      const res = await request(app).post('/api/auth/demo/vendor');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('vendor');
      expect(res.body.token).toBeDefined();
    });
  });

  describe('Order Processing & Atomic Inventory Checks', () => {
    it('should reject order creation if cart is empty', async () => {
      const authRes = await request(app).post('/api/auth/demo/customer');
      const token = authRes.body.token;

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cart: [],
          shippingAddress: { address1: '123 Test St', city: 'Metropolis', country: 'USA' },
          totalPrice: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject order if requested quantity exceeds stock', async () => {
      const authRes = await request(app).post('/api/auth/demo/customer');
      const token = authRes.body.token;

      const listRes = await request(app).get('/api/products?limit=1');
      const prod = listRes.body.products[0];

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cart: [
            {
              productId: prod._id,
              name: prod.name,
              qty: 999999, // exceeds available stock
              price: prod.discountPrice,
            },
          ],
          shippingAddress: { address1: '123 Test St', city: 'Metropolis', country: 'USA' },
          totalPrice: 999999 * prod.discountPrice,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Insufficient stock');
    });

    it('should successfully place order and decrement inventory when stock is sufficient', async () => {
      const authRes = await request(app).post('/api/auth/demo/customer');
      const token = authRes.body.token;

      const listRes = await request(app).get('/api/products?limit=1');
      const prod = listRes.body.products[0];
      const initialStock = prod.stock;

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cart: [
            {
              productId: prod._id,
              name: prod.name,
              qty: 1,
              price: prod.discountPrice,
            },
          ],
          shippingAddress: { address1: '123 Test St', city: 'Metropolis', country: 'USA' },
          totalPrice: prod.discountPrice,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.orderNumber).toMatch(/^POSH-\d{6}$/);

      // Verify stock was decremented
      const checkRes = await request(app).get(`/api/products/${prod._id}`);
      expect(checkRes.body.product.stock).toBe(initialStock - 1);
    });

    // REGRESSION DEFENSE: DEF-01 (Client-Side Price Manipulation Prevention)
    it('should prevent client-side price manipulation and authoritatively enforce catalog prices', async () => {
      const authRes = await request(app).post('/api/auth/demo/customer');
      const token = authRes.body.token;

      const listRes = await request(app).get('/api/products?limit=1');
      const prod = listRes.body.products[0];

      // Attacker attempts to buy a $1,299+ item for $0.01
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cart: [
            {
              productId: prod._id,
              name: prod.name,
              qty: 1,
              price: 0.01, // Manipulated line item price
            },
          ],
          shippingAddress: { address1: '123 Hacker Way', city: 'Metropolis', country: 'USA' },
          totalPrice: 0.01, // Manipulated order total
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      // Verify the server enforced the authoritative catalog price, NOT the manipulated price
      expect(res.body.order.cart[0].price).toBe(prod.discountPrice);
      expect(res.body.order.subtotal).toBe(prod.discountPrice);
      expect(res.body.order.totalPrice).toBeGreaterThanOrEqual(prod.discountPrice);
    });

    it('should authoritatively compute and apply verified coupon discount during order creation', async () => {
      const authRes = await request(app).post('/api/auth/demo/customer');
      const token = authRes.body.token;

      const listRes = await request(app).get('/api/products?limit=1');
      const prod = listRes.body.products[0];

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cart: [
            {
              productId: prod._id,
              name: prod.name,
              qty: 1,
              price: prod.discountPrice,
            },
          ],
          shippingAddress: { address1: '450 Mission St', city: 'San Francisco', country: 'USA' },
          totalPrice: prod.discountPrice,
          couponCode: 'POSH20',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.discountAmount).toBeGreaterThan(0);
      expect(res.body.order.totalPrice).toBeLessThan(prod.discountPrice + 15);
    });
  });
});
