import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, CheckCircle, AlertTriangle, Stethoscope, Activity,
  Heart, ArrowRight, Home, Shield, Calendar, FileText, Info
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import RiskMeter from '../components/health/RiskMeter';
import EmergencyAlert from '../components/health/EmergencyAlert';
import { healthApi } from '../services/api';
import type { HealthAssessment } from '../types';
import { calculateDemoRisk } from '../utils/riskEngine';

const ANALYSIS_STEPS = [
  'Collecting health information...',
  'Understanding symptoms...',
  'Analyzing medical history...',
  'Checking risk factors...',
  'Calculating urgency level...',
  'Generating personalized guidance...',
];

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'risks' | 'tips' | 'doctor'>('summary');

  useEffect(() => {
    let stepTimer: ReturnType<typeof setInterval>;
    stepTimer = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    const loadResult = async () => {
      await new Promise(res => setTimeout(res, ANALYSIS_STEPS.length * 600 + 400));
      clearInterval(stepTimer);

      try {
        if (id?.startsWith('demo-')) {
          const pendingData = sessionStorage.getItem('pendingAnalysis');
          const input = pendingData ? JSON.parse(pendingData) : {};
          const result = calculateDemoRisk(input);
          setAssessment(result as unknown as HealthAssessment);
        } else if (id) {
          const { data } = await healthApi.getAssessment(id);
          setAssessment(data.assessment);
        }
      } catch {
        const result = calculateDemoRisk({});
        setAssessment(result as unknown as HealthAssessment);
      } finally {
        setAnalyzing(false);
      }
    };

    loadResult();
    return () => clearInterval(stepTimer);
  }, [id]);

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4">
        <Navbar />
        <div className="text-center pt-16">
          {/* AI Brain animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="absolute inset-4 bg-blue-500/30 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                <Brain className="w-12 h-12 text-white animate-heartbeat" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">AI Health Analysis</h2>
          <p className="text-blue-200 mb-8">Analyzing your health profile...</p>

          {/* Steps */}
          <div className="space-y-3 max-w-sm mx-auto">
            {ANALYSIS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={i <= analysisStep ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  i < analysisStep ? 'bg-green-500' :
                  i === analysisStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'
                }`}>
                  {i < analysisStep ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-sm ${i <= analysisStep ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-8 h-1.5 bg-white/10 rounded-full max-w-xs mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
              animate={{ width: `${((analysisStep + 1) / ANALYSIS_STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <p className="text-gray-500 mb-4">Could not load assessment results.</p>
          <Link to="/health-check" className="btn-primary">Try Again</Link>
        </div>
      </div>
    );
  }

  const { riskScore, riskLevel, recommendations, aiSummary } = assessment;
  const action = recommendations?.action || 'self-care';

  const actionConfig = {
    emergency: {
      color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200',
      label: 'Emergency Action Required', icon: AlertTriangle, gradient: 'from-red-600 to-red-800',
    },
    doctor: {
      color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200',
      label: 'Doctor Consultation Recommended', icon: Stethoscope, gradient: 'from-orange-500 to-orange-700',
    },
    routine: {
      color: 'bg-green-600', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200',
      label: 'Routine Monitoring', icon: Activity, gradient: 'from-green-600 to-teal-600',
    },
    'self-care': {
      color: 'bg-cyan-600', text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200',
      label: 'Self-Care Guidance', icon: Heart, gradient: 'from-cyan-600 to-blue-600',
    },
  };
  const cfg = actionConfig[action as keyof typeof actionConfig] || actionConfig['self-care'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Result header */}
        <div className={`bg-gradient-to-r ${cfg.gradient} text-white px-4 py-8`}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <cfg.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{cfg.label}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">AI Health Assessment Complete</h1>
              <p className="text-white/80 text-sm">Based on your reported symptoms and health profile</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Emergency alert (if urgent) */}
          {action === 'emergency' && (
            <div className="mb-6">
              <EmergencyAlert />
            </div>
          )}

          {/* Main result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden mb-6"
          >
            <div className="p-6 md:p-8">
              {/* Risk meter + action grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Health Risk Score</p>
                  <RiskMeter score={riskScore} level={riskLevel} size="lg" animated />
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <div className={`p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <cfg.icon className={`w-5 h-5 ${cfg.text}`} />
                      <p className={`font-bold text-sm ${cfg.text}`}>Recommended Action</p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {action === 'emergency' && 'Seek immediate emergency medical care. Call 112 or go to the nearest hospital emergency.'}
                      {action === 'doctor' && `Schedule an appointment with a ${recommendations.specialty || 'General Physician'} within 24-48 hours.`}
                      {action === 'routine' && 'Schedule a routine health checkup within 1-2 weeks. Monitor your symptoms daily.'}
                      {action === 'self-care' && 'Continue home care with healthy lifestyle habits. Monitor for any changes.'}
                    </p>
                  </div>

                  {recommendations.specialty && action !== 'emergency' && (
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Suggested Specialty</p>
                      <p className="font-bold text-gray-900">{recommendations.specialty}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    {action === 'doctor' || action === 'emergency' ? (
                      <Link to="/doctors" id="find-doctors-btn" className={`${action === 'emergency' ? 'btn-emergency' : 'btn-primary'} flex items-center justify-center gap-2 py-3`}>
                        <Stethoscope className="w-4 h-4" />
                        {action === 'emergency' ? 'Find Nearest Hospital' : 'Find Doctors'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : null}
                    {action === 'routine' && (
                      <Link to="/health-dashboard" id="health-dashboard-btn" className="btn-teal flex items-center justify-center gap-2 py-3">
                        <Activity className="w-4 h-4" /> Go to Health Dashboard
                      </Link>
                    )}
                    {action === 'self-care' && (
                      <Link to="/dashboard" id="go-dashboard-btn" className="btn-primary flex items-center justify-center gap-2 py-3">
                        <Home className="w-4 h-4" /> Go to Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-100 mb-6">
                <div className="flex gap-1 -mb-px">
                  {[
                    { key: 'summary', label: 'AI Summary', icon: Brain },
                    { key: 'risks', label: 'Risk Factors', icon: AlertTriangle },
                    { key: 'tips', label: 'Care Tips', icon: Heart },
                    { key: 'doctor', label: "Doctor's Q's", icon: Stethoscope },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as typeof activeTab)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                        activeTab === key
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line bg-gray-50 rounded-2xl p-5">
                      {aiSummary || 'AI analysis complete. Please review your risk score and recommendations above.'}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'risks' && (
                  <motion.div key="risks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="space-y-3 mb-5">
                      <p className="text-sm font-semibold text-gray-600">Identified Risk Factors:</p>
                      {(recommendations.possibleRiskFactors || []).length > 0 ? (
                        recommendations.possibleRiskFactors.map((risk, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">{risk}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No major risk factors identified.</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-3">Warning Signs to Watch:</p>
                      {(recommendations.warningSigns || []).map((sign, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl mb-2">
                          <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{sign}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tips' && (
                  <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {(recommendations.homecareTips || []).length > 0 && (
                      <div className="mb-5">
                        <p className="text-sm font-semibold text-gray-600 mb-3">🏠 Home Care Tips:</p>
                        {recommendations.homecareTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-100 rounded-xl mb-2">
                            <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {(recommendations.lifestyleTips || []).length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-3">🌱 Lifestyle Improvements:</p>
                        {recommendations.lifestyleTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl mb-2">
                            <Heart className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'doctor' && (
                  <motion.div key="doctor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className="text-sm text-gray-500 mb-4">Suggested questions to ask your healthcare provider:</p>
                    {(recommendations.doctorQuestions || []).length > 0 ? (
                      recommendations.doctorQuestions.map((q, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2">
                          <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                          <p className="text-sm text-gray-700">{q}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">For general wellness, ask your doctor about routine screenings appropriate for your age.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation suggestions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Navigation, label: 'Nearby Hospitals', href: '/nearby-care', color: 'bg-red-50 text-red-600', id: 'result-nearby' },
              { icon: Calendar, label: 'Book Appointment', href: '/doctors', color: 'bg-orange-50 text-orange-600', id: 'result-appointment' },
              { icon: Activity, label: 'Health Dashboard', href: '/health-dashboard', color: 'bg-green-50 text-green-600', id: 'result-dashboard' },
              { icon: FileText, label: 'Upload Report', href: '/reports', color: 'bg-purple-50 text-purple-600', id: 'result-report' },
            ].map(({ icon: Icon, label, href, color, id }) => (
              <Link key={id} to={href} id={id}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 ${color} hover:shadow-md transition-all text-center group`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{label}</span>
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 mb-1">⚠️ Important Medical Disclaimer</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This AI assessment provides risk indicators for <strong>informational purposes only</strong>.
                  It is <strong>NOT a medical diagnosis</strong> and does not replace professional medical advice.
                  Always consult a qualified healthcare professional for any health concerns.
                  In case of a medical emergency, call <strong>112</strong> immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
