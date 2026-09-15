const MedicalReport = require('../models/MedicalReport');

// Mock OCR analyzer — returns realistic demo data
function mockOCRAnalysis(fileName) {
  return {
    extractedData: [
      { testName: 'Hemoglobin', result: '11.2', unit: 'g/dL', referenceRange: '12.0 – 16.0', status: 'low' },
      { testName: 'WBC Count', result: '7.8', unit: '×10³/μL', referenceRange: '4.5 – 11.0', status: 'normal' },
      { testName: 'Platelet Count', result: '180', unit: '×10³/μL', referenceRange: '150 – 400', status: 'normal' },
      { testName: 'Blood Glucose (Fasting)', result: '126', unit: 'mg/dL', referenceRange: '70 – 100', status: 'high' },
      { testName: 'Total Cholesterol', result: '195', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
      { testName: 'Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7 – 1.2', status: 'normal' },
    ],
    abnormalValues: [
      {
        testName: 'Hemoglobin',
        result: '11.2 g/dL',
        referenceRange: '12.0 – 16.0 g/dL',
        explanation: 'Hemoglobin is below the normal range, which may indicate mild anemia. This can cause fatigue, weakness, and shortness of breath. Common causes include iron deficiency, vitamin B12 deficiency, or chronic disease. Consult your doctor for further evaluation.',
      },
      {
        testName: 'Blood Glucose (Fasting)',
        result: '126 mg/dL',
        referenceRange: '70 – 100 mg/dL',
        explanation: 'Fasting blood glucose is elevated above normal. A value of 126 mg/dL or higher on two separate tests suggests diabetes mellitus. Regular monitoring, dietary changes, and medical consultation are recommended.',
      },
    ],
    aiSummary: 'Your blood report shows two values outside the normal range: mild anemia (low hemoglobin) and elevated fasting glucose. These findings warrant medical consultation. The remaining parameters are within normal limits.\n\n⚠️ This analysis is for educational purposes only and does not replace professional medical advice.',
  };
}

// POST /api/reports/upload
const uploadReport = async (req, res, next) => {
  try {
    const { reportDate, labName } = req.body;
    const file = req.file;

    let fileUrl = '';
    let fileName = 'demo_report.pdf';

    if (file) {
      fileUrl = `/uploads/${file.filename}`;
      fileName = file.originalname;
    }

    const report = await MedicalReport.create({
      userId: req.user._id,
      fileName,
      fileUrl,
      fileType: (fileName.split('.').pop() || 'pdf').toLowerCase(),
      status: 'processing',
      reportDate: reportDate || new Date(),
      labName: labName || 'Unknown Lab',
      isDemoData: !file,
    });

    // Simulate async OCR processing
    setTimeout(async () => {
      try {
        const ocr = mockOCRAnalysis(fileName);
        await MedicalReport.findByIdAndUpdate(report._id, {
          status: 'analyzed',
          ...ocr,
        });
      } catch (_) {}
    }, 2000);

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const reports = await MedicalReport.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/:id
const getReport = async (req, res, next) => {
  try {
    const report = await MedicalReport.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadReport, getReports, getReport };
