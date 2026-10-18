const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      name: String,
      avatar: String,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
    },
    tags: [String],
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter product price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      default: 1,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    shopId: {
      type: String,
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    soldCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFlashDeal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// High-performance search and query indexes
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ shopId: 1, createdAt: -1 });
productSchema.index({ isFlashDeal: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
