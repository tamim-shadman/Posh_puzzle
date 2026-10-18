const { getDBStatus } = require('../config/db');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const store = require('../data/store');

class ProductService {
  async getProducts({
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    shopId,
    isFeatured,
    isFlashDeal,
    sort = 'newest',
    page = 1,
    limit = 20,
  } = {}) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const safeSearch = search ? String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
    const safeCategory =
      category && category !== 'All'
        ? String(category).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        : '';

    if (getDBStatus()) {
      const query = {};

      if (safeSearch) {
        query.$or = [
          { name: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { category: { $regex: safeSearch, $options: 'i' } },
        ];
      }

      if (safeCategory) {
        query.category = { $regex: new RegExp(`^${safeCategory}$`, 'i') };
      }

      if (shopId) query.shopId = shopId;
      if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true' || isFeatured === true;
      if (isFlashDeal !== undefined) query.isFlashDeal = isFlashDeal === 'true' || isFlashDeal === true;

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.discountPrice = {};
        if (minPrice) query.discountPrice.$gte = Number(minPrice);
        if (maxPrice) query.discountPrice.$lte = Number(maxPrice);
      }

      if (rating) query.ratings = { $gte: Number(rating) };

      let sortOption = { createdAt: -1 };
      if (sort === 'price-asc') sortOption = { discountPrice: 1 };
      if (sort === 'price-desc') sortOption = { discountPrice: -1 };
      if (sort === 'rating') sortOption = { ratings: -1 };
      if (sort === 'popular') sortOption = { soldCount: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort(sortOption)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit);

      return {
        products,
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit) || 1,
      };
    } else {
      let products = await store.products.find();

      if (search) {
        const s = String(search).trim().toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s)
        );
      }

      if (category && category !== 'All') {
        const cat = String(category).trim().toLowerCase();
        products = products.filter((p) => p.category.toLowerCase() === cat);
      }

      if (shopId) products = products.filter((p) => p.shopId === shopId);
      if (isFeatured !== undefined) {
        const flag = isFeatured === 'true' || isFeatured === true;
        products = products.filter((p) => Boolean(p.isFeatured) === flag);
      }
      if (isFlashDeal !== undefined) {
        const flag = isFlashDeal === 'true' || isFlashDeal === true;
        products = products.filter((p) => Boolean(p.isFlashDeal) === flag);
      }

      if (minPrice) products = products.filter((p) => p.discountPrice >= Number(minPrice));
      if (maxPrice) products = products.filter((p) => p.discountPrice <= Number(maxPrice));
      if (rating) products = products.filter((p) => p.ratings >= Number(rating));

      if (sort === 'price-asc') products.sort((a, b) => a.discountPrice - b.discountPrice);
      else if (sort === 'price-desc') products.sort((a, b) => b.discountPrice - a.discountPrice);
      else if (sort === 'rating') products.sort((a, b) => b.ratings - a.ratings);
      else if (sort === 'popular') products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      else products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = products.length;
      const startIndex = (safePage - 1) * safeLimit;
      const paginated = products.slice(startIndex, startIndex + safeLimit);

      return {
        products: paginated,
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit) || 1,
      };
    }
  }

  async getProductById(id) {
    if (getDBStatus()) {
      return await Product.findById(id);
    } else {
      return await store.products.findById(id);
    }
  }

  async createProduct(productData, userId) {
    let shop = null;

    if (getDBStatus()) {
      shop = await Shop.findOne({ ownerId: userId });
      if (!shop) shop = await Shop.findOne(); // fallback default shop

      return await Product.create({
        ...productData,
        shopId: shop ? shop._id.toString() : 'shop_001',
        shop: shop ? shop.toObject() : {},
      });
    } else {
      shop = await store.shops.findOne({ ownerId: userId });
      if (!shop) shop = (await store.shops.find())[0];

      return await store.products.create({
        ...productData,
        shopId: shop._id,
        shop,
        ratings: 5.0,
        soldCount: 0,
        reviews: [],
      });
    }
  }

  async updateProduct(id, updates, userId) {
    if (getDBStatus()) {
      const product = await Product.findById(id);
      if (!product) throw new Error('Product not found');

      // Authorization check: verify owner if vendor
      if (userId && product.shop?.ownerId && product.shop.ownerId !== userId) {
        throw new Error('Not authorized to modify products belonging to another atelier');
      }

      return await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    } else {
      const product = await store.products.findById(id);
      if (!product) throw new Error('Product not found');

      if (userId && product.shop?.ownerId && product.shop.ownerId !== userId) {
        throw new Error('Not authorized to modify products belonging to another atelier');
      }

      return await store.products.findByIdAndUpdate(id, updates);
    }
  }

  async deleteProduct(id, userId) {
    if (getDBStatus()) {
      const product = await Product.findById(id);
      if (!product) throw new Error('Product not found');

      if (userId && product.shop?.ownerId && product.shop.ownerId !== userId) {
        throw new Error('Not authorized to delete products belonging to another atelier');
      }

      return await Product.findByIdAndDelete(id);
    } else {
      const product = await store.products.findById(id);
      if (!product) throw new Error('Product not found');

      if (userId && product.shop?.ownerId && product.shop.ownerId !== userId) {
        throw new Error('Not authorized to delete products belonging to another atelier');
      }

      return await store.products.findByIdAndDelete(id);
    }
  }

  async addReview(id, { user, rating, comment }) {
    const review = {
      _id: `rev_${Date.now()}`,
      user: {
        name: user.name,
        avatar: user.avatar,
      },
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      const product = await Product.findById(id);
      if (!product) throw new Error('Product not found');

      product.reviews.push(review);
      const totalRatings = product.reviews.reduce((acc, item) => acc + item.rating, 0);
      product.ratings = Number((totalRatings / product.reviews.length).toFixed(1));

      await product.save();
      return product;
    } else {
      const product = await store.products.findById(id);
      if (!product) throw new Error('Product not found');

      const reviews = product.reviews || [];
      reviews.push(review);
      const totalRatings = reviews.reduce((acc, item) => acc + item.rating, 0);
      const avgRating = Number((totalRatings / reviews.length).toFixed(1));

      return await store.products.findByIdAndUpdate(id, {
        reviews,
        ratings: avgRating,
      });
    }
  }
}

module.exports = new ProductService();
