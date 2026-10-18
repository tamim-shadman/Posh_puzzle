const express = require('express');
const router = express.Router();
const {
  register,
  login,
  demoLogin,
  getMe,
  logout,
  updateProfile,
} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validators');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/demo/:role', demoLogin);
router.get('/me', isAuthenticated, getMe);
router.get('/logout', logout);
router.put('/update-profile', isAuthenticated, updateProfile);

module.exports = router;
