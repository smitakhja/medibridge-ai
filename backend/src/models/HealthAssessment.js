const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: [String],
  symptomsText: String,
  lifestyle: {
    diet: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    sleep: { type: Number }, // hours per night
    exercise: { type: String, enum: ['daily', 'weekly', 'rarely', 'never'] },
    smoking: { type: Boolean, default: false },
    alcohol: { type: String, enum: ['none', 'occasional', 'moderate', 'heavy'] },
    stressLevel: { type: Number, min: 1, max: 10 },
  },
  medicalHistory: {
    existingConditions: [String],
    previousSurgeries: [String],
    allergies: [String],
    currentMedications: [String],
    familyHistory: [String],
  },
  basicInfo: {
    age: Number,
    gender: String,
    height: Number, // cm
    weight: Number, // kg
  },
  riskScore: { type: Number, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high', 'urgent'] },
  recommendations: {
    action: { type: String, enum: ['self-care', 'routine', 'doctor', 'emergency'] },
    specialty: String,
    warningSigns: [String],
    possibleRiskFactors: [String],
    doctorQuestions: [String],
    homecareTips: [String],
    lifestyleTips: [String],
  },
  aiSummary: String,
  followUpDate: Date,
  isDemoData: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);
