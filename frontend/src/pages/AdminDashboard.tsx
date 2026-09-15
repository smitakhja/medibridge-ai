import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, FileText, TrendingUp, Shield, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const RISK_DISTRIBUTION = [
  { name: 'Low', value: 45, color: '#16A34A' },
  { name: 'Moderate', value: 30, color: '#D97706' },
  { name: 'High', value: 18, color: '#EA580C' },
  { name: 'Urgent', value: 7, color: '#DC2626' },
];

const DAILY_CHECKS = [
  { day: 'Mon', checks: 145 }, { day: 'Tue', checks: 178 }, { day: 'Wed', checks: 162 },
  { day: 'Thu', checks: 195 }, { day: 'Fri', checks: 210 }, { day: 'Sat', checks: 130 },
  { day: 'Sun', checks: 95 },
];

const RECENT_ALERTS = [
  { user: 'User #4821', message: 'Urgent risk detected — chest pain + shortness of breath', time: '5 min ago', type: 'urgent' },
  { user: 'User #3947', message: 'High risk assessment — requesting doctor consultation', time: '23 min ago', type: 'high' },
  { user: 'User #5612', message: 'New report upload failed (server error)', time: '1 hr ago', type: 'error' },
  { user: 'System', message: 'AI model v2.3 successfully updated and deployed', time: '3 hrs ago', type: 'info' },
];

const ALERT_CONFIG = {
  urgent: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  high: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
  error: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
  info: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: CheckCircle },
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'Total Users', value: '12,847', change: '+234 this week', color: 'bg-blue-600' },
    { icon: Activity, label: 'Health Checks Today', value: '1,043', change: '+12%', color: 'bg-teal-600' },
    { icon: FileText, label: 'Reports Analyzed', value: '3,421', change: '+89 today', color: 'bg-purple-600' },
    { icon: TrendingUp, label: 'AI Accuracy', value: '97.8%', change: 'v2.3 deployed', color: 'bg-green-600' },
    { icon: Users, label: 'Active Doctors', value: '203', change: '+5 this month', color: 'bg-orange-600' },
    { icon: AlertTriangle, label: 'Urgent Alerts', value: '7', change: '3 handled', color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm">System overview for {user?.name} • MediBridge AI Platform</p>
            </div>
            <button className="ml-auto flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
                <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-display font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">{s.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Daily checks chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-5">Daily Health Checks (This Week)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DAILY_CHECKS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="checks" fill="#2563EB" radius={[6, 6, 0, 0]} name="Health Checks" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-5">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={RISK_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value">
                    {RISK_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {RISK_DISTRIBUTION.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-gray-600">{r.name}</span>
                    <span className="font-bold text-gray-900 ml-auto">{r.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts + System health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent alerts */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-4">System Alerts</h2>
              <div className="space-y-3">
                {RECENT_ALERTS.map((alert, i) => {
                  const cfg = ALERT_CONFIG[alert.type as keyof typeof ALERT_CONFIG];
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                      <cfg.icon className={`w-4 h-4 ${cfg.color} mt-0.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${cfg.color}`}>{alert.user}</p>
                        <p className="text-xs text-gray-700 mt-0.5">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{alert.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System status */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-4">
                {[
                  { name: 'AI Health Engine', status: 'operational', uptime: '99.9%', version: 'v2.3' },
                  { name: 'MongoDB Atlas', status: 'operational', uptime: '99.7%', version: 'Atlas M10' },
                  { name: 'OCR Service', status: 'operational', uptime: '98.2%', version: 'Tesseract v5' },
                  { name: 'Email Notifications', status: 'degraded', uptime: '95.1%', version: 'SMTP' },
                  { name: 'SMS Alerts', status: 'operational', uptime: '99.5%', version: 'Twilio' },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${svc.status === 'operational' ? 'bg-green-500' : svc.status === 'degraded' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium text-gray-700">{svc.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{svc.version}</span>
                      <span className="font-semibold text-green-600">{svc.uptime}</span>
                      <span className={`capitalize font-semibold ${svc.status === 'operational' ? 'text-green-600' : 'text-amber-600'}`}>{svc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All critical services operational. Last checked 2 minutes ago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
