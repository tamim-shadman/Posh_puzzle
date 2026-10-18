const orderService = require('../services/orderService');

// Create new order with atomic inventory validation
const createOrder = async (req, res, next) => {
  try {
    const { cart, shippingAddress, paymentInfo, totalPrice, couponCode } = req.body;
    const user = req.user;

    const order = await orderService.createOrder({
      user,
      cart,
      shippingAddress,
      paymentInfo,
      totalPrice,
      couponCode,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get current user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await orderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get orders for vendor's shop
const getVendorOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await orderService.getVendorOrders(userId);

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (Vendor / Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await orderService.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      order: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get single order details
const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderDetails(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderDetails,
};
