const express = require('express');
const router = express.Router();
const { analyzeHealth, getHistory, getAssessment } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/analyze', analyzeHealth);
router.get('/history', getHistory);
router.get('/:id', getAssessment);

module.exports = router;
