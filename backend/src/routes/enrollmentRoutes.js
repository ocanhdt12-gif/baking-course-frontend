const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middleware/authMiddleware');

// Public route to submit an enrollment
router.post('/', enrollmentController.submitEnrollment);

// Admin routes
router.get('/', auth, enrollmentController.getAllEnrollments);
router.patch('/:id', auth, enrollmentController.updateEnrollmentStatus);
router.delete('/:id', auth, enrollmentController.deleteEnrollment);

module.exports = router;
