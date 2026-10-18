const authService = require('../services/authService');
const { sendToken } = require('../utils/jwtToken');
const { getDBStatus } = require('../config/db');
const Shop = require('../models/Shop');
const store = require('../data/store');

// Register user / vendor
const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role, shopName, shopDescription, shopAddress } = req.body;

    const { user } = await authService.register({
      name,
      email,
      password,
      phoneNumber,
      role: role || 'customer',
      shopName,
      shopDescription,
      shopAddress,
    });

    return sendToken(user, 201, res, 'Registered successfully');
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const user = await authService.login({ email, password });
    return sendToken(user, 200, res, 'Logged in successfully');
  } catch (error) {
    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    next(error);
  }
};

// Demo login for quick testing
const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.params;
    const user = await authService.getDemoUser(role);
    return sendToken(user, 200, res, `Logged in as Demo ${role}`);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get current user profile
const getMe = async (req, res, next) => {
  try {
    const userPayload = { ...req.user };
    delete userPayload.password;

    let shop = null;
    if (userPayload.role === 'vendor') {
      const ownerId = userPayload._id || userPayload.id;
      if (getDBStatus()) {
        shop = await Shop.findOne({ ownerId });
      } else {
        shop = await store.shops.findOne({ ownerId });
      }
    }

    res.status(200).json({
      success: true,
      user: userPayload,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = async (req, res, next) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update profile / add address
const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, address } = req.body;
    const userId = req.user._id || req.user.id;

    const updatedUser = await authService.updateProfile(userId, { name, phoneNumber, address });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  logout,
  updateProfile,
};
