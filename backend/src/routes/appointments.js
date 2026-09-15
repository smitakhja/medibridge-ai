const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment } = require('../controllers/appointmentsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id', updateAppointment);

module.exports = router;
