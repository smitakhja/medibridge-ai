const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor } = require('../controllers/doctorsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDoctors);
router.get('/:id', protect, getDoctor);

module.exports = router;
