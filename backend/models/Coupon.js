const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter coupon code name'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: 1000,
    },
    selectedProduct: {
      type: String,
      default: 'all',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
