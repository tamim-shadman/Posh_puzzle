require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Event = require('./models/Event');
const Coupon = require('./models/Coupon');
const {
  seedUsers,
  seedShops,
  seedProducts,
  seedOrders,
  seedEvents,
  seedCoupons,
} = require('./data/seeds');

const importData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('[Seed] Notice: MongoDB is not connected. In-Memory store is automatically seeded upon server launch.');
      process.exit(0);
    }

    console.log('[Seed] Cleaning existing database collections...');
    await User.deleteMany();
    await Shop.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Event.deleteMany();
    await Coupon.deleteMany();

    console.log('[Seed] Inserting users...');
    await User.insertMany(seedUsers);

    console.log('[Seed] Inserting shops...');
    await Shop.insertMany(seedShops);

    console.log('[Seed] Inserting products...');
    await Product.insertMany(seedProducts);

    console.log('[Seed] Inserting orders...');
    await Order.insertMany(seedOrders);

    console.log('[Seed] Inserting events...');
    await Event.insertMany(seedEvents);

    console.log('[Seed] Inserting coupons...');
    await Coupon.insertMany(seedCoupons);

    console.log('[Seed] Database successfully seeded with flagship data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

importData();
