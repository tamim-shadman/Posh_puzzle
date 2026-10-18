const { getDBStatus } = require('../config/db');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const store = require('../data/store');

class ShopService {
  async getShopById(id) {
    if (getDBStatus()) {
      return await Shop.findById(id);
    }
    return await store.shops.findById(id);
  }

  async getShopProducts(shopId) {
    if (getDBStatus()) {
      return await Product.find({ shopId });
    }
    return await store.products.find({ shopId });
  }

  async getVendorDashboardStats(userId) {
    let shop = null;
    let products = [];
    let orders = [];

    if (getDBStatus()) {
      shop = await Shop.findOne({ ownerId: userId });
      if (!shop) shop = await Shop.findOne();
      const shopId = shop ? shop._id.toString() : '';

      products = await Product.find({ shopId });
      const allOrders = await Order.find().sort({ createdAt: -1 });

      orders = allOrders.filter((ord) =>
        ord.cart.some((item) => item.shopId === shopId || !item.shopId)
      );
    } else {
      shop = await store.shops.findOne({ ownerId: userId });
      if (!shop) {
        shop = (await store.shops.find())[0];
      }
      const shopId = shop ? shop._id : '';

      products = await store.products.find({ shopId });
      const allOrders = await store.orders.find();

      orders = allOrders.filter((ord) =>
        ord.cart.some((item) => item.shopId === shopId || !item.shopId)
      );
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    return {
      shop,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        rating: shop?.ratings || 4.9,
      },
      recentOrders: orders.slice(0, 5),
    };
  }

  async updateShop(id, updateData) {
    if (getDBStatus()) {
      return await Shop.findByIdAndUpdate(id, updateData, { new: true });
    }
    return await store.shops.findByIdAndUpdate(id, updateData);
  }
}

module.exports = new ShopService();
