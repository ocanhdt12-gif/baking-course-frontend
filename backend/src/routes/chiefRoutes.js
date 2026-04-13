const express = require('express');
const router = express.Router();
const chiefController = require('../controllers/chiefController');
const auth = require('../middleware/authMiddleware');

router.get('/', chiefController.getAllChiefs);
router.post('/', auth, chiefController.createChief);
router.put('/:id', auth, chiefController.updateChief);
router.delete('/:id', auth, chiefController.deleteChief);

module.exports = router;

router.get('/:id', chiefController.getChiefById);
