const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

router.get('/', testimonialController.getAllTestimonials);
router.post('/', auth, requireRole('ADMIN'), testimonialController.createTestimonial);
router.put('/:id', auth, requireRole('ADMIN'), testimonialController.updateTestimonial);
router.delete('/:id', auth, requireRole('ADMIN'), testimonialController.deleteTestimonial);

module.exports = router;
