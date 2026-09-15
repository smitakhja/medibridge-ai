const mongoose = require('mongoose');

const healthcareFacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['hospital', 'clinic', 'pharmacy', 'diagnostic'], required: true },
  address: String,
  city: String,
  state: String,
  phone: String,
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  isOpen24h: { type: Boolean, default: false },
  hasEmergency: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0 },
  specialties: [String],
  beds: Number,
  openHours: String,
  website: String,
  distance: Number, // computed dynamically, not stored
}, { timestamps: true });

module.exports = mongoose.model('HealthcareFacility', healthcareFacilitySchema);
