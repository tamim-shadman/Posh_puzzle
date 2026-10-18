const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your shop name'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter shop description'],
    },
    address: {
      type: String,
      required: [true, 'Please enter shop address'],
    },
    phoneNumber: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=256&q=80',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    },
    ratings: {
      type: Number,
      default: 5.0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);
