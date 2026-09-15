const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  fileUrl: String,
  fileType: { type: String, enum: ['pdf', 'jpg', 'jpeg', 'png'] },
  status: { type: String, enum: ['uploaded', 'processing', 'analyzed', 'failed'], default: 'uploaded' },
  extractedData: [{
    testName: String,
    result: String,
    unit: String,
    referenceRange: String,
    status: { type: String, enum: ['normal', 'low', 'high', 'critical'] },
  }],
  aiSummary: String,
  abnormalValues: [{
    testName: String,
    result: String,
    referenceRange: String,
    explanation: String,
  }],
  reportDate: Date,
  labName: String,
  isDemoData: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
