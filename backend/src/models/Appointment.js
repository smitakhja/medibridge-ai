const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: String,
  type: { type: String, enum: ['in-person', 'online'], default: 'in-person' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  reason: String,
  notes: String,
  doctorNotes: String,
  prescriptions: [String],
  followUpDate: Date,
  isDemoData: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
