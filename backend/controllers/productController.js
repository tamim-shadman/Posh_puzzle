const productService = require('../services/productService');

// Get all products with multi-facet filters & sort
const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product details
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Create product (Vendor)
const createProduct = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const product = await productService.createProduct(req.body, userId);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product (Vendor)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const updated = await productService.updateProduct(id, req.body, userId);

    res.status(200).json({
      success: true,
      product: updated,
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Delete product (Vendor)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    await productService.deleteProduct(id, userId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Add product review
const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    const product = await productService.addReview(id, { user, rating, comment });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
