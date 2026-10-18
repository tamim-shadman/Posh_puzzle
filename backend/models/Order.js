const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cart: [
      {
        product: Object,
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
        shopId: String,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Processing', 'Transferred to delivery partner', 'Shipping', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    paymentInfo: {
      id: String,
      status: String,
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
