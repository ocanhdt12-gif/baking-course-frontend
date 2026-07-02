const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

// Public route to submit an enrollment
router.post('/', enrollmentController.submitEnrollment);

// Admin routes
router.get('/', auth, requireRole('ADMIN'), enrollmentController.getAllEnrollments);
router.patch('/:id', auth, requireRole('ADMIN'), enrollmentController.updateEnrollmentStatus);
router.delete('/:id', auth, requireRole('ADMIN'), enrollmentController.deleteEnrollment);

module.exports = router;
