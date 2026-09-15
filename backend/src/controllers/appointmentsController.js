const Appointment = require('../models/Appointment');

// POST /api/appointments
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, type, reason } = req.body;
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date,
      time,
      type: type || 'in-person',
      reason,
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// GET /api/appointments
const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name specialty hospital location photo')
      .sort({ date: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

// PUT /api/appointments/:id
const updateAppointment = async (req, res, next) => {
  try {
    const { status, doctorNotes, followUpDate } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status, doctorNotes, followUpDate },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment };
