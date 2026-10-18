const eventService = require('../services/eventService');

// Get all promotional events
const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getEvents();
    res.status(200).json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

// Validate coupon code
const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    const result = await eventService.validateCoupon({ code, cartTotal });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getEvents,
  validateCoupon,
};
