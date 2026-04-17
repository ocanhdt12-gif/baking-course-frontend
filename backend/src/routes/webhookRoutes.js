const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// No auth middleware — authenticated by webhook secret in body
router.post('/payment', webhookController.handlePaymentWebhook);

module.exports = router;
