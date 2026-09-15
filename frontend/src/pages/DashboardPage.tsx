import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, TrendingUp, Calendar, FileText, AlertCircle,
  Heart, Moon, Footprints, ArrowRight, Bell, Plus, Zap, Shield
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import type { DashboardData } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_DASHBOARD: DashboardData = {
  riskScore: 32,
  riskLevel: 'moderate',
  totalChecks: 7,
  upcomingAppointments: [],
  recentAssessments: [],
  recentReports: [],
  healthMetrics: {
    heartRate: [72, 75, 74, 78, 73, 71, 76],
    sleepHours: [7.2, 6.8, 7.5, 6.5, 8, 7, 7.3],
    steps: [8200, 7500, 9100, 6800, 10200, 8900, 7700],
    weight: [68, 68.2, 67.8, 68.5, 67.9, 67.5, 67.8],
    systolic: [118, 120, 115, 122, 119, 117, 121],
    diastolic: [78, 80, 75, 82, 79, 77, 80],
  },
};

const riskColors = {
  low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100', dot: 'bg-green-500' },
  moderate: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100', dot: 'bg-amber-500' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100', dot: 'bg-orange-500' },
  urgent: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100', dot: 'bg-red-500' },
};

function MetricCard({ icon: Icon, title, value, unit, color, trend, trendUp }: {
  icon: React.ElementType; title: string; value: string | number; unit?: string;
  color: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="metric-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </motion.div>
  );
}

function RiskScoreCard({ score, level }: { score: number; level: string }) {
  const cfg = riskColors[level as keyof typeof riskColors] || riskColors.low;
  const levelLabels = { low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk', urgent: 'Emergency' };

  return (
    <div className={`metric-card ${cfg.bg} ${cfg.border} border`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Health Risk Score</p>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-display font-bold ${cfg.text}`}>{score}</span>
            <span className="text-gray-400 text-sm mb-1">/100</span>
          </div>
        </div>
        <span className={`px-3 py-1.5 ${cfg.badge} ${cfg.text} text-xs font-bold rounded-full border ${cfg.border}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} mr-1.5 animate-pulse`} />
          {levelLabels[level as keyof typeof levelLabels] || 'Unknown'}
        </span>
      </div>
      {/* Score bar */}
      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${cfg.dot}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">Last assessed today</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>(MOCK_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'heartRate' | 'bp' | 'sleep'>('heartRate');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardApi.get();
        if (res.data.dashboard) setData(res.data.dashboard);
      } catch {
        // Use mock data if API unavailable
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = DAYS.map((day, i) => ({
    day,
    heartRate: data.healthMetrics.heartRate[i],
    systolic: data.healthMetrics.systolic[i],
    diastolic: data.healthMetrics.diastolic[i],
    sleep: data.healthMetrics.sleepHours[i],
    steps: data.healthMetrics.steps[i],
    weight: data.healthMetrics.weight[i],
  }));

  const notifications = [
    { icon: Activity, msg: 'Your health check is due. Last check was 3 days ago.', time: '2h ago', type: 'health', color: 'bg-blue-100 text-blue-600' },
    { icon: Calendar, msg: 'Upcoming appointment: Dr. Priya Sharma tomorrow at 10:00 AM.', time: '5h ago', type: 'appointment', color: 'bg-teal-100 text-teal-600' },
    { icon: FileText, msg: 'Your blood report analysis is ready to view.', time: '1d ago', type: 'report', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-display font-bold mb-1"
                >
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
                </motion.h1>
                <p className="text-blue-100 text-sm">Here's your health overview for today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
              <Link to="/health-check" id="start-health-check-btn"
                className="hidden sm:flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg text-sm"
              >
                <Zap className="w-4 h-4" />
                New Health Check
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <RiskScoreCard score={data.riskScore} level={data.riskLevel} />
            <MetricCard icon={Heart} title="Heart Rate" value={data.healthMetrics.heartRate[6]} unit="bpm" color="bg-red-500" trend="2%" trendUp />
            <MetricCard icon={Moon} title="Sleep" value={data.healthMetrics.sleepHours[6]} unit="hrs" color="bg-blue-600" trend="0.3 hrs" trendUp={false} />
            <MetricCard icon={Footprints} title="Steps Today" value={(data.healthMetrics.steps[6]).toLocaleString()} color="bg-green-600" trend="1.2k" trendUp />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Charts */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-gray-900">Health Trends</h2>
                <div className="flex gap-2">
                  {[
                    { key: 'heartRate', label: 'Heart Rate' },
                    { key: 'bp', label: 'Blood Pressure' },
                    { key: 'sleep', label: 'Sleep' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveChart(key as typeof activeChart)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        activeChart === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                {activeChart === 'heartRate' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="heartRate" stroke="#EF4444" strokeWidth={2} fill="url(#hrGrad)" dot={{ fill: '#EF4444', r: 3 }} name="Heart Rate (bpm)" />
                  </AreaChart>
                ) : activeChart === 'bp' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[60, 140]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} name="Diastolic" />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="sleep" fill="#6366F1" radius={[4, 4, 0, 0]} name="Sleep (hours)" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Notifications + Quick Actions */}
            <div className="space-y-4">
              {/* Notifications */}
              <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" /> Notifications
                  </h2>
                  <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
                </div>
                <div className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                        <n.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-snug">{n.msg}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                <h2 className="font-display font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { icon: Activity, label: 'New Health Check', href: '/health-check', color: 'text-blue-600 bg-blue-50', id: 'quick-health-check' },
                    { icon: FileText, label: 'Upload Report', href: '/reports', color: 'text-purple-600 bg-purple-50', id: 'quick-upload-report' },
                    { icon: Calendar, label: 'Book Appointment', href: '/doctors', color: 'text-teal-600 bg-teal-50', id: 'quick-book-appointment' },
                    { icon: AlertCircle, label: 'Emergency Guidance', href: '/nearby-care', color: 'text-red-600 bg-red-50', id: 'quick-emergency' },
                  ].map(({ icon: Icon, label, href, color, id }) => (
                    <Link key={href} to={href} id={id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-gray-900">Recent Health Assessments</h2>
              <Link to="/history" className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Demo timeline items */}
            <div className="space-y-3">
              {[
                { date: 'Today, 11:45 AM', risk: 'moderate', score: 32, action: 'Doctor consultation recommended', symptoms: ['Mild headache', 'Fatigue'] },
                { date: 'Sep 12, 2:30 PM', risk: 'low', score: 18, action: 'Self-care guidance', symptoms: ['Runny nose', 'Mild cough'] },
                { date: 'Sep 5, 10:00 AM', risk: 'low', score: 12, action: 'Routine monitoring', symptoms: ['Stress', 'Insomnia'] },
              ].map((item, i) => {
                const cfg = riskColors[item.risk as keyof typeof riskColors];
                return (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                    <div className={`w-10 h-10 rounded-xl ${cfg.badge} flex items-center justify-center shrink-0`}>
                      <span className={`text-sm font-bold ${cfg.text}`}>{item.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${cfg.text}`}>{item.risk.toUpperCase()}</span>
                        <span className="text-xs text-gray-400">• {item.date}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{item.action}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {item.symptoms.map(s => (
                          <span key={s} className="text-xs bg-white/80 border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <Shield className={`w-4 h-4 ${cfg.text} shrink-0`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Health Checks', value: data.totalChecks, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Reports Uploaded', value: 3, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Appointments', value: 2, icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Days Tracked', value: 18, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
