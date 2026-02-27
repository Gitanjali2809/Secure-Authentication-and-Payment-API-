const express = require('express');
const router = express.Router();

const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Only logged-in users can start a payment!
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);


module.exports = router;