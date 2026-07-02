const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const cleanupController = require('../controllers/cleanupController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

router.get('/', auth, requireRole('ADMIN'), statsController.getDashboardStats);

// Garbage collector: preview then clean orphan uploads
router.get('/orphan-files', auth, requireRole('ADMIN'), cleanupController.getOrphanFiles);
router.delete('/orphan-files', auth, requireRole('ADMIN'), cleanupController.deleteOrphanFiles);

module.exports = router;
