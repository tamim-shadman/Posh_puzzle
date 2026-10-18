const { getDBStatus } = require('../config/db');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const store = require('../data/store');

class OrderService {
  /**
   * Creates an order with atomic stock verification, authoritative price enforcement,
   * and rollback protection.
   */
  async createOrder({ user, cart, shippingAddress, paymentInfo, totalPrice, couponCode }) {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      const err = new Error('Order cart cannot be empty');
      err.statusCode = 400;
      throw err;
    }

    const userId = user._id || user.id;
    const orderNumber = `POSH-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Authoritative Price & Stock Pre-validation
    let authoritativeSubtotal = 0;
    const verifiedCart = [];

    for (const item of cart) {
      if (!item.productId) continue;
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);

      let product = null;
      if (getDBStatus()) {
        product = await Product.findById(item.productId);
      } else {
        product = await store.products.findById(item.productId);
      }

      if (!product) {
        const err = new Error(`Product not found (ID: ${item.productId})`);
        err.statusCode = 404;
        throw err;
      }

      if (product.stock < qty) {
        const err = new Error(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`
        );
        err.statusCode = 400;
        throw err;
      }

      // Enforce server-side authoritative price
      const unitPrice = product.discountPrice;
      authoritativeSubtotal += unitPrice * qty;

      verifiedCart.push({
        productId: item.productId,
        name: product.name,
        price: unitPrice,
        qty,
        image: product.images?.[0] || item.image || '',
        shopId: product.shopId || '',
      });
    }

    if (verifiedCart.length === 0) {
      const err = new Error('No valid items found in order cart');
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate optional coupon discount
    let discountAmount = 0;
    if (couponCode) {
      const eventService = require('./eventService');
      const couponResult = await eventService.validateCoupon({
        code: couponCode,
        cartTotal: authoritativeSubtotal,
      });
      discountAmount = couponResult.coupon?.discountAmount || 0;
    }

    // 3. Authoritative shipping calculation: Free over $100, else $15
    const shipping = authoritativeSubtotal >= 100 ? 0 : 15;
    const authoritativeTotal = Math.max(
      0,
      Math.round((authoritativeSubtotal - discountAmount + shipping) * 100) / 100
    );

    const orderPayload = {
      orderNumber,
      cart: verifiedCart,
      shippingAddress,
      user: {
        _id: userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      userId,
      totalPrice: authoritativeTotal,
      subtotal: authoritativeSubtotal,
      discountAmount,
      shipping,
      paymentInfo: paymentInfo || { status: 'Paid', type: 'Credit Card' },
      status: 'Processing',
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      // Perform atomic decrements with rollback tracking
      const decrementedItems = [];
      try {
        for (const item of verifiedCart) {
          const updatedProd = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty, soldCount: item.qty } },
            { new: true }
          );

          if (!updatedProd) {
            throw new Error(
              `Inventory conflict: Stock changed during checkout for product ${item.name || item.productId}`
            );
          }
          decrementedItems.push(item);
        }

        const order = await Order.create(orderPayload);
        return order;
      } catch (atomicErr) {
        // Rollback already decremented stocks
        for (const rollbackItem of decrementedItems) {
          await Product.findByIdAndUpdate(rollbackItem.productId, {
            $inc: { stock: rollbackItem.qty, soldCount: -rollbackItem.qty },
          });
        }
        atomicErr.statusCode = atomicErr.statusCode || 400;
        throw atomicErr;
      }
    } else {
      // In-Memory store atomic check and decrement
      for (const item of verifiedCart) {
        const prod = await store.products.findById(item.productId);
        if (prod) {
          await store.products.findByIdAndUpdate(item.productId, {
            stock: Math.max(0, (prod.stock || 0) - item.qty),
            soldCount: (prod.soldCount || 0) + item.qty,
          });
        }
      }

      const order = await store.orders.create(orderPayload);
      return order;
    }
  }

  async getMyOrders(userId) {
    if (getDBStatus()) {
      return await Order.find({ userId }).sort({ createdAt: -1 });
    }
    const orders = await store.orders.find({ userId });
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return orders;
  }

  async getVendorOrders(userId) {
    let shop = null;
    let shopId = '';

    if (getDBStatus()) {
      shop = await Shop.findOne({ ownerId: userId });
      if (!shop) shop = await Shop.findOne();
      shopId = shop ? shop._id.toString() : '';

      const allOrders = await Order.find().sort({ createdAt: -1 });
      return allOrders.filter((ord) =>
        ord.cart.some((item) => item.shopId === shopId || !item.shopId)
      );
    } else {
      shop = await store.shops.findOne({ ownerId: userId });
      if (!shop) shop = (await store.shops.find())[0];
      shopId = shop ? shop._id : '';

      const allOrders = await store.orders.find();
      const vendorOrders = allOrders.filter((ord) =>
        ord.cart.some((item) => item.shopId === shopId || !item.shopId)
      );
      vendorOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return vendorOrders;
    }
  }

  async updateOrderStatus(id, status) {
    const validStatuses = [
      'Processing',
      'Transferred to delivery partner',
      'Shipping',
      'Delivered',
      'Cancelled',
    ];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid order status transition: ${status}`);
      err.statusCode = 400;
      throw err;
    }

    const updates = { status };
    if (status === 'Delivered') {
      updates.deliveredAt = new Date();
    }

    let existingOrder = null;
    if (getDBStatus()) {
      existingOrder = await Order.findById(id);
    } else {
      existingOrder = await store.orders.findById(id);
    }

    if (!existingOrder) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    // If order was cancelled and was not already cancelled, restore stock
    if (status === 'Cancelled' && existingOrder.status !== 'Cancelled') {
      for (const item of existingOrder.cart || []) {
        if (item.productId) {
          if (getDBStatus()) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: item.qty, soldCount: -item.qty },
            });
          } else {
            const prod = await store.products.findById(item.productId);
            if (prod) {
              await store.products.findByIdAndUpdate(item.productId, {
                stock: (prod.stock || 0) + item.qty,
                soldCount: Math.max(0, (prod.soldCount || 0) - item.qty),
              });
            }
          }
        }
      }
    }

    let updated = null;
    if (getDBStatus()) {
      updated = await Order.findByIdAndUpdate(id, updates, { new: true });
    } else {
      updated = await store.orders.findByIdAndUpdate(id, updates);
    }

    return updated;
  }

  async getOrderDetails(id) {
    let order = null;
    if (getDBStatus()) {
      order = await Order.findById(id);
    } else {
      order = await store.orders.findById(id);
    }
    return order;
  }
}

module.exports = new OrderService();
