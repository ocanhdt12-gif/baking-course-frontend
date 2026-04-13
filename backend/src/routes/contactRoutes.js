const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

// Public route to submit a form
router.post('/', contactController.submitContact);

// Admin routes to read and delete submissions
router.get('/', auth, contactController.getAllContacts);
router.delete('/:id', auth, contactController.deleteContact);

module.exports = router;
