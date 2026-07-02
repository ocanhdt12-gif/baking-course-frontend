const express = require('express');
const router = express.Router();
const chiefController = require('../controllers/chiefController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

router.get('/', chiefController.getAllChiefs);
router.get('/:id', chiefController.getChiefById);
router.post('/', auth, requireRole('ADMIN'), chiefController.createChief);
router.put('/:id', auth, requireRole('ADMIN'), chiefController.updateChief);
router.delete('/:id', auth, requireRole('ADMIN'), chiefController.deleteChief);

module.exports = router;
