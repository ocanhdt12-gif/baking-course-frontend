const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController');
const auth = require('../middleware/authMiddleware');

// POST /api/vnpay/create-payment-url — Create VNPay payment URL (authenticated)
router.post('/create-payment-url', auth, vnpayController.createPaymentUrl);

// GET /api/vnpay/return — VNPay redirects user here after payment (public)
router.get('/return', vnpayController.handleReturn);

// GET /api/vnpay/ipn — VNPay server-to-server callback (public)
router.get('/ipn', vnpayController.handleIpn);

module.exports = router;
