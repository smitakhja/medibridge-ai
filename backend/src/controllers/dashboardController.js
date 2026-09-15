const User = require('../models/User');
const HealthAssessment = require('../models/HealthAssessment');
const MedicalReport = require('../models/MedicalReport');
const Appointment = require('../models/Appointment');

// GET /api/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [assessments, reports, appointments] = await Promise.all([
      HealthAssessment.find({ userId }).sort({ createdAt: -1 }).limit(10),
      MedicalReport.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Appointment.find({ userId }).sort({ date: 1 }).populate('doctorId', 'name specialty'),
    ]);

    const latest = assessments[0];
    const upcomingAppointments = appointments.filter(a => new Date(a.date) > new Date());

    // Mock health metrics for demo
    const healthMetrics = {
      heartRate: [72, 75, 74, 78, 73, 71, 76],
      sleepHours: [7.2, 6.8, 7.5, 6.5, 8, 7, 7.3],
      steps: [8200, 7500, 9100, 6800, 10200, 8900, 7700],
      weight: [68, 68.2, 67.8, 68.5, 67.9, 67.5, 67.8],
      systolic: [118, 120, 115, 122, 119, 117, 121],
      diastolic: [78, 80, 75, 82, 79, 77, 80],
    };

    res.json({
      success: true,
      dashboard: {
        riskScore: latest?.riskScore || 0,
        riskLevel: latest?.riskLevel || 'low',
        totalChecks: assessments.length,
        upcomingAppointments: upcomingAppointments.slice(0, 3),
        recentAssessments: assessments.slice(0, 5),
        recentReports: reports.slice(0, 3),
        healthMetrics,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAssessments, totalReports, totalAppointments] = await Promise.all([
      User.countDocuments(),
      HealthAssessment.countDocuments(),
      MedicalReport.countDocuments(),
      Appointment.countDocuments(),
    ]);

    const doctors = await User.countDocuments({ role: 'doctor' });
    const emergencies = await HealthAssessment.countDocuments({ riskLevel: 'urgent' });

    // Risk distribution
    const [low, moderate, high, urgent] = await Promise.all([
      HealthAssessment.countDocuments({ riskLevel: 'low' }),
      HealthAssessment.countDocuments({ riskLevel: 'moderate' }),
      HealthAssessment.countDocuments({ riskLevel: 'high' }),
      HealthAssessment.countDocuments({ riskLevel: 'urgent' }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: totalUsers,
        doctors,
        healthAssessments: totalAssessments,
        emergencyAlerts: emergencies,
        reportsAnalyzed: totalReports,
        appointments: totalAppointments,
        riskDistribution: { low, moderate, high, urgent },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getAdminStats };
