import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Shield, Brain, MapPin, FileText,
  Globe, Stethoscope, AlertTriangle, ArrowRight, CheckCircle,
  Mic, TrendingUp, Users, Star, ChevronRight, Play,
  Zap, Lock, Clock, PhoneCall
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// ─── Animated counter ───────────────────────────────────────────────────────
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Heartbeat SVG ──────────────────────────────────────────────────────────
function HeartbeatLine() {
  return (
    <svg viewBox="0 0 400 80" className="w-full h-full" fill="none">
      <motion.path
        d="M0 40 L60 40 L75 10 L90 70 L105 40 L160 40 L175 20 L185 60 L195 40 L260 40 L275 5 L290 75 L305 40 L400 40"
        stroke="url(#hbGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
      />
      <defs>
        <linearGradient id="hbGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Animated AI Dashboard Card ─────────────────────────────────────────────
function AIDashboardDemo() {
  const [score] = useState(42);
  const metrics = [
    { label: 'Heart Rate', value: '78 bpm', trend: '+2', color: 'text-red-500' },
    { label: 'Sleep', value: '7.2 hrs', trend: '-0.3', color: 'text-blue-500' },
    { label: 'Activity', value: '8,240', trend: '+1.2k', color: 'text-green-500' },
  ];

  return (
    <div className="relative">
      {/* Gradient blob behind */}
      <div className="absolute -inset-8 bg-gradient-to-br from-blue-100 via-teal-50 to-purple-100 rounded-[3rem] blur-2xl opacity-60" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI Health Score</p>
            <div className="flex items-end gap-2 mt-1">
              <motion.span
                className="text-4xl font-display font-bold text-amber-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {score}
              </motion.span>
              <span className="text-gray-400 text-sm mb-1">/100</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full mb-1">Moderate</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>

        {/* Heartbeat line */}
        <div className="h-16 mb-6">
          <HeartbeatLine />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-gray-50 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-gray-400 mb-1">{m.label}</p>
              <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
              <p className="text-xs text-gray-400">{m.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* AI recommendation chip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-3 border border-blue-100"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700">AI Recommendation</p>
            <p className="text-xs text-gray-500 truncate">Schedule a doctor consultation within 48h</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100"
      >
        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700">2 Nearby Hospitals</p>
          <p className="text-xs text-gray-400">Within 1.2 km</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gray-100"
      >
        <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
          <Brain className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700">AI Analysis</p>
          <p className="text-xs text-gray-400">Ready in 30s</p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Flow Chart Section ──────────────────────────────────────────────────────
function FlowchartSection() {
  const branches = [
    { color: 'bg-red-500', border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', label: 'Emergency', icon: AlertTriangle, desc: 'Immediate medical attention required', action: 'Find Hospital' },
    { color: 'bg-orange-500', border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-700', label: 'Doctor Consultation', icon: Stethoscope, desc: 'Schedule appointment with specialist', action: 'Find Doctors' },
    { color: 'bg-green-500', border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', label: 'Routine Monitoring', icon: Activity, desc: 'Track health metrics regularly', action: 'Schedule Checkup' },
    { color: 'bg-cyan-500', border: 'border-cyan-200', bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Self-Care Guidance', icon: Heart, desc: 'Home care tips and lifestyle advice', action: 'View Tips' },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="max-w-5xl mx-auto">
      {/* Flow nodes */}
      <div className="flex flex-col items-center">
        {/* Start */}
        {['Start', 'Login / Register', 'Input Health Info', 'AI Analysis', 'Risk Detection'].map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className={`px-6 py-3 rounded-2xl font-semibold text-sm shadow-sm border ${
              i === 0 ? 'bg-blue-600 text-white border-blue-600' :
              i === 4 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent' :
              'bg-white text-gray-700 border-gray-200'
            }`}>
              {step}
            </div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200 my-1" />
          </motion.div>
        ))}

        {/* 4 branches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2">
          {branches.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`${b.bg} border ${b.border} rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <div className={`w-10 h-10 ${b.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <b.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`font-bold text-sm ${b.text} mb-1`}>{b.label}</p>
              <p className="text-gray-500 text-xs mb-3">{b.desc}</p>
              <span className={`text-xs font-semibold ${b.text} flex items-center justify-center gap-1`}>
                {b.action} <ChevronRight className="w-3 h-3" />
              </span>
            </motion.div>
          ))}
        </div>

        {/* Reconverge */}
        <div className="w-0.5 h-8 bg-gradient-to-b from-gray-200 to-gray-300 my-1 mt-4" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1 }}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 text-white rounded-2xl font-bold text-center shadow-lg"
        >
          Personal Health Dashboard → Better Health Outcomes
        </motion.div>
      </div>
    </div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }: {
  icon: React.ElementType; title: string; desc: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 group"
    >
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-display font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const features = [
    { icon: Brain, title: 'AI Risk Assessment', desc: 'Advanced AI analyzes your symptoms, lifestyle, and medical history to generate a personalized health risk score in seconds.', color: 'bg-purple-600', delay: 0 },
    { icon: AlertTriangle, title: 'Emergency Detection', desc: 'Automatically detects high-risk symptoms and provides emergency guidance with nearest hospital locations.', color: 'bg-red-600', delay: 0.1 },
    { icon: Stethoscope, title: 'Doctor Consultation', desc: 'Get matched with the right specialist based on your symptoms. Book appointments instantly.', color: 'bg-orange-500', delay: 0.2 },
    { icon: Activity, title: 'Routine Monitoring', desc: 'Track health metrics over time with beautiful charts. Set reminders and follow-up schedules.', color: 'bg-green-600', delay: 0.3 },
    { icon: Heart, title: 'Self-Care Guidance', desc: 'Personalized home care tips, diet recommendations, and lifestyle advice for everyday wellness.', color: 'bg-cyan-600', delay: 0.4 },
    { icon: FileText, title: 'Report Understanding', desc: 'Upload blood reports and medical documents. AI explains results in simple, understandable language.', color: 'bg-blue-600', delay: 0.5 },
    { icon: MapPin, title: 'Nearby Healthcare', desc: 'Locate hospitals, clinics, pharmacies, and diagnostic centers near you with real-time availability.', color: 'bg-teal-600', delay: 0.6 },
    { icon: Globe, title: 'Multilingual Support', desc: 'Available in 7 languages: English, Hindi, Gujarati, Marathi, Bengali, Tamil, and Telugu.', color: 'bg-indigo-600', delay: 0.7 },
    { icon: Mic, title: 'Voice Input', desc: 'Describe symptoms using voice. Our AI converts speech to text for hands-free health assessment.', color: 'bg-pink-600', delay: 0.8 },
    { icon: Lock, title: 'Secure & Private', desc: 'Your health data is encrypted, protected, and never shared without your explicit consent.', color: 'bg-slate-700', delay: 0.9 },
    { icon: TrendingUp, title: 'Health Timeline', desc: 'View your complete health journey with an interactive timeline of all assessments and consultations.', color: 'bg-emerald-600', delay: 1.0 },
    { icon: Clock, title: 'Medication Reminders', desc: 'Set medication schedules and health reminders. Never miss a dose or appointment again.', color: 'bg-amber-600', delay: 1.1 },
  ];

  const stats = [
    { end: 50000, suffix: '+', label: 'Health Checks' },
    { end: 200, suffix: '+', label: 'Doctors' },
    { end: 98, suffix: '%', label: 'Accuracy Rate' },
    { end: 7, suffix: '', label: 'Languages' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Patient', text: 'MediBridge AI detected my elevated risk early. The doctor consultation recommendation was spot-on!', rating: 5, city: 'Mumbai' },
    { name: 'Rahul Patel', role: 'Patient', text: 'The multilingual support in Gujarati made it so easy for my parents to use. Excellent platform!', rating: 5, city: 'Ahmedabad' },
    { name: 'Dr. Ananya', role: 'Doctor', text: 'As a doctor, I love how the AI pre-screens patients and sends them with organized health summaries.', rating: 5, city: 'Chennai' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900" />
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + ((i * 7) % 60)}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Healthcare Platform</span>
                <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">SMART INDIA</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6"
              >
                {t('hero_title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl"
              >
                {t('hero_sub')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Link to="/register" id="hero-cta-primary"
                  className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-xl text-sm"
                >
                  <Activity className="w-5 h-5" />
                  {t('check_health')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <a href="#features" id="hero-cta-secondary"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-sm"
                >
                  <Play className="w-4 h-4" />
                  {t('explore')}
                </a>
              </motion.div>

              {/* Auth links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 text-sm"
              >
                <Link to="/login" className="text-blue-300 hover:text-white transition-colors font-medium">{t('login')}</Link>
                <span className="text-white/30">•</span>
                <Link to="/register" className="text-blue-300 hover:text-white transition-colors font-medium">{t('register')}</Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-display font-bold text-white">
                      <Counter end={s.end} suffix={s.suffix} />
                    </p>
                    <p className="text-xs text-blue-300 font-medium">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: AI Dashboard Demo */}
            <div className="hidden lg:block">
              <AIDashboardDemo />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-white/40 text-xs">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">How It Works</span>
            <h2 className="section-title mb-4">Simple 4-Step Process</h2>
            <p className="section-subtitle max-w-2xl mx-auto">From registering to receiving personalized care guidance in minutes.</p>
          </motion.div>
        </div>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Users, title: 'Create Account', desc: 'Register securely with your basic health profile. Your data stays private.', color: 'from-blue-500 to-blue-700' },
              { step: '02', icon: Mic, title: 'Report Symptoms', desc: 'Enter symptoms by typing or voice. Add lifestyle and medical history details.', color: 'from-teal-500 to-teal-700' },
              { step: '03', icon: Brain, title: 'AI Analysis', desc: 'Our AI engine analyzes your input and generates a personalized risk assessment.', color: 'from-purple-500 to-purple-700' },
              { step: '04', icon: Heart, title: 'Get Guidance', desc: 'Receive emergency alerts, doctor referrals, monitoring plans, or self-care tips.', color: 'from-green-500 to-green-700' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex flex-col items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 mb-2">{step.step}</div>
                  <h3 className="font-display font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Flowchart ─────────────────────────────────────────── */}
      <section className="py-24 bg-white" id="flowchart">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Care Navigation System</span>
            <h2 className="section-title mb-4">Your Health Journey, Visualized</h2>
            <p className="section-subtitle max-w-2xl mx-auto">MediBridge AI intelligently routes you to the right level of care based on your unique health profile.</p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FlowchartSection />
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Features</span>
            <h2 className="section-title mb-4">Everything You Need for Better Health</h2>
            <p className="section-subtitle max-w-2xl mx-auto">A comprehensive suite of AI-powered tools for complete healthcare navigation.</p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={Math.min(f.delay, 0.4)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Testimonials</span>
            <h2 className="section-title mb-4">Trusted by Patients & Doctors</h2>
          </motion.div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role} · {t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Start Your Health Journey Today
            </h2>
            <p className="text-xl text-blue-200 mb-10 leading-relaxed">
              Join thousands of users who trust MediBridge AI for proactive, intelligent healthcare guidance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" id="final-cta-register"
                className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-xl text-lg"
              >
                <Activity className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" id="final-cta-login"
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-lg"
              >
                Already have an account?
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-10">
              {[
                { icon: Shield, text: 'HIPAA-Ready' },
                { icon: Lock, text: 'Encrypted Data' },
                { icon: PhoneCall, text: '24/7 Emergency Alert' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-blue-200 text-sm">
                  <Icon className="w-4 h-4" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
