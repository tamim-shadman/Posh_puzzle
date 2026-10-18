const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderDetails,
} = require('../controllers/orderController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { orderSchema } = require('../utils/validators');

router.post('/', isAuthenticated, validate(orderSchema), createOrder);
router.get('/my-orders', isAuthenticated, getMyOrders);
router.get('/vendor-orders', isAuthenticated, authorizeRoles('vendor', 'admin'), getVendorOrders);
router.put('/:id/status', isAuthenticated, authorizeRoles('vendor', 'admin'), updateOrderStatus);
router.get('/:id', isAuthenticated, getOrderDetails);

module.exports = router;
