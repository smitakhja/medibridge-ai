const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  location: {
    address: String,
    city: String,
    state: String,
    lat: Number,
    lng: Number,
  },
  availability: [{
    day: String,
    slots: [String],
  }],
  consultationType: [{ type: String, enum: ['in-person', 'online', 'both'] }],
  hospital: String,
  bio: String,
  education: [String],
  languages: [String],
  photo: String,
  isAvailableNow: { type: Boolean, default: false },
  fee: { type: Number },
  registrationNumber: String,
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
