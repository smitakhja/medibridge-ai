import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, TrendingUp, Heart, Moon, Footprints, Droplets, Brain, Target, Plus, Info } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const DAYS_HISTORY = ['Sep 1', 'Sep 3', 'Sep 5', 'Sep 7', 'Sep 9', 'Sep 11', 'Sep 13', 'Sep 15'];
const SCORE_HISTORY = [55, 48, 42, 38, 45, 35, 30, 32];

const RADAR_DATA = [
  { subject: 'Heart', A: 85 }, { subject: 'Sleep', A: 72 }, { subject: 'Activity', A: 68 },
  { subject: 'Nutrition', A: 78 }, { subject: 'Mental', A: 60 }, { subject: 'Hydration', A: 80 },
];

const METRICS = [
  { key: 'heartRate', icon: Heart, label: 'Heart Rate', color: '#EF4444', unit: 'bpm', history: [78, 76, 74, 80, 77, 73, 75, 76], target: 75, targetLabel: 'Target: 60–100 bpm' },
  { key: 'sleep', icon: Moon, label: 'Sleep', color: '#6366F1', unit: 'hrs', history: [6.5, 7, 7.5, 6.8, 8, 7.2, 7, 7.3], target: 8, targetLabel: 'Target: 7–9 hrs' },
  { key: 'steps', icon: Footprints, label: 'Daily Steps', color: '#16A34A', unit: 'k', history: [7.8, 8.2, 9.1, 6.8, 10.2, 8.9, 7.7, 8.5], target: 10, targetLabel: 'Target: 10k steps' },
  { key: 'water', icon: Droplets, label: 'Water Intake', color: '#0EA5E9', unit: 'L', history: [1.8, 2.0, 2.2, 1.5, 2.4, 2.1, 1.9, 2.0], target: 2.5, targetLabel: 'Target: 2.5L/day' },
];

function MetricTile({ metric }: { metric: typeof METRICS[0] }) {
  const current = metric.history[metric.history.length - 1];
  const prev = metric.history[metric.history.length - 2];
  const change = ((current - prev) / prev * 100).toFixed(1);
  const isPositive = Number(change) >= 0;
  const chartData = DAYS_HISTORY.map((d, i) => ({ day: d, value: metric.history[i] }));
  const pct = Math.min((current / (metric.target * 1.2)) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: metric.color + '20' }}>
            <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display font-bold text-gray-900">{current}</span>
              <span className="text-xs text-gray-400">{metric.unit}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(Number(change))}%
        </span>
      </div>

      {/* Mini chart */}
      <div className="h-16 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2} fill={`url(#grad-${metric.key})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Progress to target */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{metric.targetLabel}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: metric.color }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: { name: string; current: number; target: number; unit: string; color: string; icon: string } }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <span className="text-2xl">{goal.icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-700">{goal.name}</p>
        <div className="h-2 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
          <motion.div className={`h-full rounded-full ${goal.color}`} initial={{ width: 0 }}
            animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{goal.current} / {goal.target} {goal.unit}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${pct >= 100 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

export default function HealthDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m'>('7d');
  const scoreData = DAYS_HISTORY.map((d, i) => ({ day: d, score: SCORE_HISTORY[i] }));

  const goals = [
    { name: 'Daily Steps', current: 8240, target: 10000, unit: 'steps', color: 'bg-green-500', icon: '🚶' },
    { name: 'Water Intake', current: 2.0, target: 2.5, unit: 'L', color: 'bg-blue-500', icon: '💧' },
    { name: 'Sleep Quality', current: 7.2, target: 8, unit: 'hrs', color: 'bg-purple-500', icon: '😴' },
    { name: 'Meditation', current: 15, target: 30, unit: 'min', color: 'bg-orange-500', icon: '🧘' },
  ];

  const recommendations = [
    { icon: '💧', text: 'You\'re 0.5L below your water goal. Try to drink 2 more glasses.', color: 'bg-blue-50 border-blue-200' },
    { icon: '🚶', text: 'Need 1,760 more steps to hit your daily goal. Take a short walk!', color: 'bg-green-50 border-green-200' },
    { icon: '😴', text: 'Your sleep average improved by 12 min this week. Keep it up!', color: 'bg-purple-50 border-purple-200' },
    { icon: '🧠', text: 'High stress detected this week. Try 10 minutes of mindfulness meditation.', color: 'bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-3">
                <TrendingUp className="w-7 h-7" /> Health Dashboard
              </h1>
              <p className="text-emerald-100 text-sm">Track your wellness metrics and progress over time</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '3m'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${period === p ? 'bg-white text-emerald-700' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overall Score trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-gray-900">Risk Score Trend</h2>
                <div className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> Improving
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scoreData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} formatter={(v: number) => [`${v}/100`, 'Risk Score']} />
                  <Area type="monotone" dataKey="score" stroke="#0D9488" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#0D9488', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-5">Health Radar</h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <Radar dataKey="A" stroke="#0D9488" fill="#0D9488" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics tiles */}
          <h2 className="font-display font-bold text-gray-900 mb-4">Vital Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {METRICS.map(m => <MetricTile key={m.key} metric={m} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" /> Health Goals
                </h2>
                <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                  <Plus className="w-3 h-3" /> Add Goal
                </button>
              </div>
              <div className="space-y-3">
                {goals.map((g, i) => <GoalCard key={i} goal={g} />)}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" /> AI Health Insights
              </h2>
              <div className="space-y-3 mb-5">
                {recommendations.map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${r.color}`}>
                    <span className="text-lg shrink-0">{r.icon}</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/health-check" className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                <Activity className="w-4 h-4" /> Start New Health Check
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
