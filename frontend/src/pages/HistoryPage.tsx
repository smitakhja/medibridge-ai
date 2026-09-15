import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, ChevronRight, Filter, Download, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import RiskMeter from '../components/health/RiskMeter';
import type { RiskLevel } from '../types';

const DEMO_HISTORY = [
  {
    _id: 'h1', date: '2026-09-15T11:45:00Z', riskScore: 32, riskLevel: 'moderate' as RiskLevel,
    symptoms: ['Headache', 'Fatigue', 'Dizziness'],
    action: 'doctor', summary: 'Moderate risk detected. Doctor consultation recommended within 48 hours.',
    specialty: 'General Physician',
  },
  {
    _id: 'h2', date: '2026-09-12T14:30:00Z', riskScore: 18, riskLevel: 'low' as RiskLevel,
    symptoms: ['Runny Nose', 'Mild Cough'],
    action: 'self-care', summary: 'Low risk. Self-care recommended with adequate rest and hydration.',
    specialty: null,
  },
  {
    _id: 'h3', date: '2026-09-05T10:00:00Z', riskScore: 12, riskLevel: 'low' as RiskLevel,
    symptoms: ['Stress', 'Insomnia'],
    action: 'self-care', summary: 'Low risk. Lifestyle adjustments recommended.',
    specialty: null,
  },
  {
    _id: 'h4', date: '2026-08-28T16:20:00Z', riskScore: 55, riskLevel: 'high' as RiskLevel,
    symptoms: ['Chest Discomfort', 'Shortness of Breath', 'Fatigue'],
    action: 'doctor', summary: 'High risk. Immediate cardiologist consultation recommended.',
    specialty: 'Cardiologist',
  },
  {
    _id: 'h5', date: '2026-08-15T09:10:00Z', riskScore: 25, riskLevel: 'low' as RiskLevel,
    symptoms: ['Back Pain', 'Joint Pain'],
    action: 'routine', summary: 'Low-moderate risk. Routine orthopedic consultation suggested.',
    specialty: 'Orthopedic Specialist',
  },
  {
    _id: 'h6', date: '2026-08-02T13:45:00Z', riskScore: 8, riskLevel: 'low' as RiskLevel,
    symptoms: ['Mild Fever'],
    action: 'self-care', summary: 'Very low risk. Rest and hydration recommended.',
    specialty: null,
  },
];

const ACTION_CONFIG = {
  emergency: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Emergency' },
  doctor: { icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Doctor Visit' },
  routine: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Routine' },
  'self-care': { icon: CheckCircle, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', label: 'Self-Care' },
};

function HistoryItem({ item, index }: { item: typeof DEMO_HISTORY[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTION_CONFIG[item.action as keyof typeof ACTION_CONFIG] || ACTION_CONFIG['self-care'];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all"
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 p-5 text-left"
        id={`history-item-${item._id}`}
      >
        {/* Risk score badge */}
        <div className={`w-14 h-14 shrink-0 ${cfg.bg} ${cfg.border} border rounded-2xl flex flex-col items-center justify-center`}>
          <span className={`text-lg font-display font-bold ${cfg.color}`}>{item.riskScore}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`flex items-center gap-1 text-xs font-bold ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-full`}>
              <Icon className="w-3 h-3" /> {cfg.label}
            </span>
            <span className="text-xs font-semibold text-gray-500 capitalize">{item.riskLevel} risk</span>
            {item.specialty && <span className="text-xs text-gray-400">• {item.specialty}</span>}
          </div>
          <p className="text-xs text-gray-500 mb-1.5">
            {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {item.symptoms.slice(0, 3).map(s => (
              <span key={s} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {item.symptoms.length > 3 && <span className="text-xs text-gray-400">+{item.symptoms.length - 3} more</span>}
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-gray-100"
        >
          <div className="p-5 bg-gray-50">
            <div className="flex gap-6 items-start">
              <div className="shrink-0">
                <RiskMeter score={item.riskScore} level={item.riskLevel} size="sm" animated={false} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{item.summary}</p>
                <div className="flex gap-2">
                  <Link to={`/analysis/${item._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-all">
                    <Activity className="w-3.5 h-3.5" /> View Full Report
                  </Link>
                  {item.specialty && (
                    <Link to="/doctors"
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-700 text-xs font-semibold rounded-xl hover:bg-orange-100 transition-all">
                      Find {item.specialty}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'urgent'>('all');

  const filtered = DEMO_HISTORY.filter(h => filter === 'all' || h.riskLevel === filter);

  const stats = {
    total: DEMO_HISTORY.length,
    avgScore: Math.round(DEMO_HISTORY.reduce((s, h) => s + h.riskScore, 0) / DEMO_HISTORY.length),
    improvements: DEMO_HISTORY.filter((h, i, arr) => i > 0 && h.riskScore < arr[i - 1].riskScore).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-blue-700 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-3">
                <History className="w-7 h-7" /> Health History
              </h1>
              <p className="text-blue-200 text-sm">Your complete health assessment timeline</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
              <Download className="w-4 h-4" /> Export History
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Checks', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Avg Risk Score', value: stats.avgScore, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Improvements', value: stats.improvements, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
              <Filter className="w-4 h-4" /> Filter:
            </div>
            {(['all', 'low', 'moderate', 'high', 'urgent'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} id={`history-filter-${f}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>
                {f === 'all' ? 'All' : f + ' risk'}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent" />
            <div className="space-y-4 pl-1">
              {filtered.map((item, i) => (
                <div key={item._id} className="relative pl-12">
                  <div className={`absolute left-4 top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    item.riskLevel === 'urgent' ? 'bg-red-500' :
                    item.riskLevel === 'high' ? 'bg-orange-500' :
                    item.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  <HistoryItem item={item} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* New check CTA */}
          <div className="mt-8 text-center">
            <Link to="/health-check" id="new-health-check-history-btn"
              className="inline-flex items-center gap-2 btn-primary px-8 py-3 text-base">
              <Activity className="w-5 h-5" /> Start New Health Check
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
