const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../utils/validators');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', isAuthenticated, authorizeRoles('vendor', 'admin'), validate(productSchema), createProduct);
router.put('/:id', isAuthenticated, authorizeRoles('vendor', 'admin'), updateProduct);
router.delete('/:id', isAuthenticated, authorizeRoles('vendor', 'admin'), deleteProduct);
router.post('/:id/reviews', isAuthenticated, addReview);

module.exports = router;
