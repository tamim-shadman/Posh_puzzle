const shopService = require('../services/shopService');

// Get shop details
const getShopById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await shopService.getShopById(id);

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    res.status(200).json({ success: true, shop });
  } catch (error) {
    next(error);
  }
};

// Get shop products
const getShopProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await shopService.getShopProducts(id);

    res.status(200).json({ success: true, products, count: products.length });
  } catch (error) {
    next(error);
  }
};

// Vendor dashboard metrics
const getVendorDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const stats = await shopService.getVendorDashboardStats(userId);

    res.status(200).json({
      success: true,
      ...stats,
    });
  } catch (error) {
    next(error);
  }
};

// Update shop details
const updateShop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await shopService.updateShop(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    res.status(200).json({ success: true, shop: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShopById,
  getShopProducts,
  getVendorDashboardStats,
  updateShop,
};
