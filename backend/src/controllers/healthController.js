const HealthAssessment = require('../models/HealthAssessment');
const { calculateRiskScore } = require('../services/aiService');

// POST /api/health/analyze
const analyzeHealth = async (req, res, next) => {
  try {
    const { symptoms, symptomsText, lifestyle, medicalHistory, basicInfo } = req.body;

    const aiResult = calculateRiskScore({
      symptoms, symptomsText, lifestyle, medicalHistory, basicInfo,
    });

    const assessment = await HealthAssessment.create({
      userId: req.user._id,
      symptoms,
      symptomsText,
      lifestyle,
      medicalHistory,
      basicInfo,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      recommendations: aiResult.recommendations,
      aiSummary: aiResult.aiSummary,
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

// GET /api/health/history
const getHistory = async (req, res, next) => {
  try {
    const assessments = await HealthAssessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, assessments });
  } catch (error) {
    next(error);
  }
};

// GET /api/health/:id
const getAssessment = async (req, res, next) => {
  try {
    const assessment = await HealthAssessment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }
    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeHealth, getHistory, getAssessment };
