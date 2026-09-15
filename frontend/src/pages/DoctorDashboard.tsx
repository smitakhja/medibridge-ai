import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users, Activity, FileText, Calendar, TrendingUp, AlertCircle,
  CheckCircle, Clock, Stethoscope, ChevronRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const UPCOMING_APPOINTMENTS = [
  { name: 'Priya Sharma', time: '10:00 AM', date: 'Today', type: 'online', concern: 'Chest discomfort, Shortness of breath', riskLevel: 'high', score: 62 },
  { name: 'Rahul Mehta', time: '11:30 AM', date: 'Today', type: 'in-person', concern: 'Fever, cough, fatigue', riskLevel: 'moderate', score: 38 },
  { name: 'Sunita Patel', time: '2:00 PM', date: 'Today', type: 'in-person', concern: 'Back pain, joint ache', riskLevel: 'low', score: 21 },
  { name: 'Arjun Singh', time: '9:00 AM', date: 'Tomorrow', type: 'online', concern: 'Anxiety, insomnia, stress', riskLevel: 'moderate', score: 35 },
];

const RECENT_PATIENTS = [
  { name: 'Meera Nair', lastVisit: '2 days ago', condition: 'Hypertension follow-up', status: 'stable' },
  { name: 'Vikram Reddy', lastVisit: '3 days ago', condition: 'Diabetes management', status: 'improving' },
  { name: 'Kavya Krishnan', lastVisit: '5 days ago', condition: 'Respiratory infection', status: 'recovered' },
];

const WEEKLY_DATA = [
  { day: 'Mon', patients: 8, emergency: 1 }, { day: 'Tue', patients: 12, emergency: 2 },
  { day: 'Wed', patients: 9, emergency: 0 }, { day: 'Thu', patients: 15, emergency: 3 },
  { day: 'Fri', patients: 11, emergency: 1 }, { day: 'Sat', patients: 6, emergency: 0 },
  { day: 'Sun', patients: 3, emergency: 0 },
];

const RISK_COLORS = {
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<typeof UPCOMING_APPOINTMENTS[0] | null>(null);

  const stats = [
    { icon: Users, label: "Today's Patients", value: 6, color: 'bg-blue-500', trend: '+2' },
    { icon: Calendar, label: 'Total Appointments', value: 23, color: 'bg-teal-500', trend: '+5' },
    { icon: AlertCircle, label: 'High Risk Cases', value: 3, color: 'bg-red-500', trend: '+1' },
    { icon: CheckCircle, label: 'Completed', value: 3, color: 'bg-green-500', trend: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-blue-700 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{user?.name} — Doctor Dashboard</h1>
                <p className="text-teal-100 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
                <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-display font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
                {s.trend && <p className="text-xs text-green-600 font-semibold mt-1">{s.trend} today</p>}
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Upcoming appointments */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Appointments
              </h2>
              <div className="space-y-3">
                {UPCOMING_APPOINTMENTS.map((appt, i) => {
                  const riskCfg = RISK_COLORS[appt.riskLevel as keyof typeof RISK_COLORS];
                  return (
                    <div key={i}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                      onClick={() => setSelectedAppointment(appt === selectedAppointment ? null : appt)}
                      id={`appt-${i}`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {appt.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{appt.name}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${riskCfg}`}>
                            Risk: {appt.score}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{appt.concern}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {appt.date} {appt.time}
                          <span className="ml-2 capitalize">{appt.type}</span>
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${selectedAppointment === appt ? 'rotate-90' : ''}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly chart */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" /> Weekly Overview
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={WEEKLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="patients" fill="#2563EB" radius={[4, 4, 0, 0]} name="Patients" />
                  <Bar dataKey="emergency" fill="#EF4444" radius={[4, 4, 0, 0]} name="Emergency" />
                </BarChart>
              </ResponsiveContainer>

              {/* Recent patients */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Patients</p>
                <div className="space-y-2">
                  {RECENT_PATIENTS.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.condition}</p>
                      </div>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                        p.status === 'recovered' ? 'text-green-600 bg-green-50' :
                        p.status === 'improving' ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI-powered patient insights */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" /> AI-Powered Patient Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: AlertCircle, label: 'Patients Needing Urgent Follow-Up', count: 2, color: 'text-red-600', bg: 'bg-red-50', action: 'Review Now' },
                { icon: TrendingUp, label: 'Patients Showing Improvement', count: 5, color: 'text-green-600', bg: 'bg-green-50', action: 'View Progress' },
                { icon: FileText, label: 'Reports Awaiting Review', count: 3, color: 'text-blue-600', bg: 'bg-blue-50', action: 'Review Reports' },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-2xl p-4 border border-gray-100`}>
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className={`text-2xl font-display font-bold ${item.color}`}>{item.count}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-2">{item.label}</p>
                  <button className={`text-xs font-semibold ${item.color} flex items-center gap-1 hover:underline`}>
                    {item.action} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
