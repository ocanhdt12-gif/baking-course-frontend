const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const payosController = require('../controllers/payosController');
const auth = require('../middleware/authMiddleware');

// Rate limit chỉ cho create-payment-url — PayOS webhook phải public, không bị limit
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,                   // 10 lần tạo link / 15 phút / IP
  message: { error: 'Quá nhiều yêu cầu tạo link thanh toán. Vui lòng thử lại sau.' },
});


// POST /api/payos/create-payment-url — Create PayOS payment URL (authenticated, rate-limited)
router.post('/create-payment-url', auth, createUrlLimiter, payosController.createPaymentUrl);

// POST /api/payos/webhook — PayOS server callback (public, NO rate limit — PayOS retries)
router.post('/webhook', payosController.handleWebhook);

// POST /api/payos/cancel — Called by frontend when user cancels on PayOS page (authenticated)
router.post('/cancel', auth, payosController.handleCancelRedirect);

module.exports = router;
