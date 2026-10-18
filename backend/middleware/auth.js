const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwtToken');
const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const store = require('../data/store');

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (getDBStatus()) {
      user = await User.findById(decoded.id);
    } else {
      user = await store.users.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource. Required: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  authorizeRoles,
};
