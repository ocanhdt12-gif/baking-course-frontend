const express = require('express');
const router = express.Router();
const paymentConfigController = require('../controllers/paymentConfigController');
const auth = require('../middleware/authMiddleware');

// Public: get active payment config (bank info + QR, no secret)
router.get('/', paymentConfigController.getPaymentConfig);

// Admin: get full config including webhook secret
router.get('/admin', auth, paymentConfigController.getPaymentConfigAdmin);

// Admin: update payment config
router.put('/', auth, paymentConfigController.updatePaymentConfig);

module.exports = router;
