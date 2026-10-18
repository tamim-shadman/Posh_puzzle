const { getDBStatus } = require('../config/db');
const Event = require('../models/Event');
const Coupon = require('../models/Coupon');
const store = require('../data/store');

class EventService {
  async getEvents() {
    if (getDBStatus()) {
      return await Event.find().sort({ createdAt: -1 });
    }
    return await store.events.find();
  }

  async validateCoupon({ code, cartTotal }) {
    if (!code) {
      const err = new Error('Please provide a coupon code');
      err.statusCode = 400;
      throw err;
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon = null;

    if (getDBStatus()) {
      coupon = await Coupon.findOne({ name: cleanCode });
    } else {
      coupon = await store.coupons.findOne({ name: cleanCode });
    }

    if (!coupon) {
      const err = new Error(`Coupon code '${code}' is invalid or expired`);
      err.statusCode = 404;
      throw err;
    }

    if (cartTotal && cartTotal < (coupon.minAmount || 0)) {
      const err = new Error(
        `Coupon requires a minimum order amount of $${coupon.minAmount}. Current total is $${cartTotal}`
      );
      err.statusCode = 400;
      throw err;
    }

    const discountPercentage = coupon.value;
    const calculatedDiscount = cartTotal
      ? Math.min((cartTotal * discountPercentage) / 100, coupon.maxDiscount || 1000)
      : 0;

    return {
      coupon: {
        code: coupon.name,
        discountPercentage,
        discountAmount: Math.round(calculatedDiscount * 100) / 100,
        minAmount: coupon.minAmount,
      },
      message: `Coupon applied: ${discountPercentage}% discount!`,
    };
  }
}

module.exports = new EventService();
