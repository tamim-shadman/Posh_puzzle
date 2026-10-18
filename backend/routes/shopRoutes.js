const express = require('express');
const router = express.Router();
const {
  getShopById,
  getShopProducts,
  getVendorDashboardStats,
  updateShop,
} = require('../controllers/shopController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, authorizeRoles('vendor', 'admin'), getVendorDashboardStats);
router.get('/:id', getShopById);
router.get('/:id/products', getShopProducts);
router.put('/:id', isAuthenticated, authorizeRoles('vendor', 'admin'), updateShop);

module.exports = router;
