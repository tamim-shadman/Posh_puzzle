const express = require('express');
const router = express.Router();
const { getEvents, validateCoupon } = require('../controllers/eventController');

router.get('/', getEvents);
router.post('/validate-coupon', validateCoupon);

module.exports = router;
