const bcrypt = require('bcryptjs');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const Shop = require('../models/Shop');
const store = require('../data/store');
const { seedUsers } = require('../data/seeds');

class AuthService {
  async register({ name, email, password, phoneNumber, role = 'customer', shopName, shopDescription, shopAddress }) {
    if (getDBStatus()) {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error('User already exists with this email address');
      }

      const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        role,
      });

      let shop = null;
      if (role === 'vendor' && shopName) {
        shop = await Shop.create({
          name: shopName,
          description: shopDescription || `Welcome to ${shopName}`,
          address: shopAddress || 'Atelier Headquarters',
          phoneNumber,
          ownerId: user._id.toString(),
          ratings: 5.0,
          balance: 0,
        });
      }

      return { user: user.toObject(), shop };
    } else {
      const existing = await store.users.findOne({ email });
      if (existing) {
        throw new Error('User already exists with this email address');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await store.users.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        addresses: [],
      });

      let shop = null;
      if (role === 'vendor' && shopName) {
        shop = await store.shops.create({
          name: shopName,
          description: shopDescription || `Welcome to ${shopName}`,
          address: shopAddress || 'Atelier Headquarters',
          phoneNumber,
          ownerId: user._id,
          ratings: 5.0,
          balance: 0,
        });
      }

      return { user, shop };
    }
  }

  async login({ email, password }) {
    let user = null;
    let isMatch = false;

    if (getDBStatus()) {
      user = await User.findOne({ email }).select('+password');
      if (!user) throw new Error('Invalid email or password credentials');

      isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error('Invalid email or password credentials');

      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } else {
      user = await store.users.findOne({ email });
      if (!user) throw new Error('Invalid email or password credentials');

      isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid email or password credentials');

      const userObj = { ...user };
      delete userObj.password;
      return userObj;
    }
  }

  async getDemoUser(role) {
    const targetEmail =
      role === 'vendor'
        ? 'vendor@poshpuzzle.com'
        : role === 'admin'
        ? 'admin@poshpuzzle.com'
        : 'customer@poshpuzzle.com';

    let user = null;
    if (getDBStatus()) {
      user = await User.findOne({ email: targetEmail });
      if (!user) {
        const seed = seedUsers.find((u) => u.email === targetEmail);
        user = await User.create(seed);
      }
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } else {
      user = await store.users.findOne({ email: targetEmail });
      if (!user) throw new Error(`Demo user for role ${role} not found`);
      const userObj = { ...user };
      delete userObj.password;
      return userObj;
    }
  }

  async getUserById(id) {
    let user = null;
    if (getDBStatus()) {
      user = await User.findById(id);
      return user ? user.toObject() : null;
    } else {
      user = await store.users.findById(id);
      return user ? { ...user } : null;
    }
  }

  async updateProfile(id, { name, phoneNumber, address }) {
    if (getDBStatus()) {
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');

      if (name) user.name = name;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.addresses.push(address);

      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } else {
      const user = await store.users.findById(id);
      if (!user) throw new Error('User not found');

      const updates = {};
      if (name) updates.name = name;
      if (phoneNumber) updates.phoneNumber = phoneNumber;
      if (address) {
        const addresses = user.addresses || [];
        addresses.push({ _id: `addr_${Date.now()}`, ...address });
        updates.addresses = addresses;
      }

      const updated = await store.users.findByIdAndUpdate(id, updates);
      delete updated.password;
      return updated;
    }
  }
}

module.exports = new AuthService();
