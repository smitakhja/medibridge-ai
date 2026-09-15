import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, CheckCircle, AlertCircle, TrendingUp,
  TrendingDown, Minus, Info, X, Eye, Download, Loader2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { reportsApi } from '../services/api';
import type { MedicalReport, ReportEntry, AbnormalValue } from '../types';

const DEMO_REPORTS: MedicalReport[] = [
  {
    _id: 'r1',
    userId: 'demo',
    fileName: 'blood_test_sep15.pdf',
    fileType: 'pdf',
    status: 'analyzed',
    extractedData: [
      { testName: 'Hemoglobin', result: '11.2', unit: 'g/dL', referenceRange: '12.0 – 16.0', status: 'low' },
      { testName: 'WBC Count', result: '7.8', unit: '×10³/μL', referenceRange: '4.5 – 11.0', status: 'normal' },
      { testName: 'Platelet Count', result: '180', unit: '×10³/μL', referenceRange: '150 – 400', status: 'normal' },
      { testName: 'Blood Glucose (Fasting)', result: '126', unit: 'mg/dL', referenceRange: '70 – 100', status: 'high' },
      { testName: 'Total Cholesterol', result: '195', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
      { testName: 'Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7 – 1.2', status: 'normal' },
    ],
    abnormalValues: [
      { testName: 'Hemoglobin', result: '11.2 g/dL', referenceRange: '12.0 – 16.0 g/dL', explanation: 'Hemoglobin is below normal, which may indicate mild anemia. This can cause fatigue, weakness, and shortness of breath. Common causes include iron deficiency, vitamin B12 deficiency, or chronic disease. Consult your doctor for further evaluation.' },
      { testName: 'Blood Glucose (Fasting)', result: '126 mg/dL', referenceRange: '70 – 100 mg/dL', explanation: 'Fasting blood glucose is elevated. A value of 126 mg/dL or higher may suggest diabetes mellitus. Regular monitoring, dietary changes, and medical consultation are recommended.' },
    ],
    aiSummary: 'Your blood report shows two values outside the normal range: mild anemia (low hemoglobin) and elevated fasting glucose. These findings warrant medical consultation. The remaining parameters are within normal limits.\n\n⚠️ This analysis is for educational purposes only and does not replace professional medical advice.',
    reportDate: '2026-09-15T00:00:00Z',
    labName: 'SRL Diagnostics',
    createdAt: '2026-09-15T10:30:00Z',
  },
];

const STATUS_CONFIG = {
  normal: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Normal' },
  low: { icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Below Range' },
  high: { icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Above Range' },
  critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' },
};

function ResultRow({ entry }: { entry: ReportEntry }) {
  const cfg = STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.normal;
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border} mb-2`}>
      <Icon className={`w-4 h-4 ${cfg.color} shrink-0`} />
      <div className="flex-1 min-w-0 grid grid-cols-4 gap-2 text-sm">
        <span className="font-semibold text-gray-800 col-span-1">{entry.testName}</span>
        <span className={`font-bold ${cfg.color} col-span-1`}>{entry.result} {entry.unit}</span>
        <span className="text-gray-400 text-xs col-span-1 self-center">{entry.referenceRange}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color} border ${cfg.border} col-span-1`}>{cfg.label}</span>
      </div>
    </div>
  );
}

function AbnormalCard({ item }: { item: AbnormalValue }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div className="border border-orange-200 bg-orange-50 rounded-2xl p-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-orange-800 text-sm">{item.testName}</p>
            <p className="text-orange-600 text-xs">{item.result} <span className="text-orange-400">| Normal: {item.referenceRange}</span></p>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="shrink-0 text-xs text-orange-700 font-semibold flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg border border-orange-200">
          {expanded ? 'Less' : 'Explain'} <Info className="w-3 h-3" />
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3 pt-3 border-t border-orange-200">
            <p className="text-sm text-orange-800 leading-relaxed">{item.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ReportCard({ report, onView }: { report: MedicalReport; onView: (r: MedicalReport) => void }) {
  const statusConfig = {
    analyzed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Analyzed' },
    processing: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing...' },
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Uploaded' },
    failed: { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
  };
  const cfg = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.uploaded;
  const abnormalCount = (report.abnormalValues || []).length;

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${cfg.bg} rounded-2xl flex items-center justify-center shrink-0`}>
          {report.status === 'processing' ? <Loader2 className={`w-6 h-6 ${cfg.color} animate-spin`} /> : <FileText className={`w-6 h-6 ${cfg.color}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{report.fileName}</p>
          <p className="text-xs text-gray-400 mt-0.5">{report.labName} • {report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-IN') : new Date(report.createdAt).toLocaleDateString('en-IN')}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
            {abnormalCount > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">{abnormalCount} Abnormal</span>}
          </div>
        </div>
        <button onClick={() => onView(report)} id={`view-report-${report._id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-all shrink-0">
          <Eye className="w-3.5 h-3.5" /> View
        </button>
      </div>
    </motion.div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<MedicalReport[]>(DEMO_REPORTS);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await reportsApi.getAll();
        if (data.reports?.length > 0) setReports(data.reports);
      } catch { /* Use demo */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('labName', 'User Uploaded');

    try {
      const { data } = await reportsApi.upload(formData);
      setReports(prev => [data.report, ...prev]);
      // Poll for analysis completion
      const pollTimer = setInterval(async () => {
        try {
          const res = await reportsApi.getOne(data.report._id);
          if (res.data.report.status === 'analyzed') {
            setReports(prev => prev.map(r => r._id === data.report._id ? res.data.report : r));
            clearInterval(pollTimer);
          }
        } catch { clearInterval(pollTimer); }
      }, 2000);
      setTimeout(() => clearInterval(pollTimer), 30000);
    } catch {
      // Demo: add a fake processing report
      const demoReport: MedicalReport = { ...DEMO_REPORTS[0], _id: 'new-' + Date.now(), fileName: file.name, status: 'processing', createdAt: new Date().toISOString() };
      setReports(prev => [demoReport, ...prev]);
      setTimeout(() => {
        setReports(prev => prev.map(r => r._id === demoReport._id ? { ...DEMO_REPORTS[0], _id: demoReport._id, fileName: file.name } : r));
      }, 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1 flex items-center gap-3">
              <FileText className="w-7 h-7" /> Health Reports
            </h1>
            <p className="text-purple-100 text-sm">Upload blood reports and medical documents for AI-powered analysis</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Upload + Reports list */}
            <div className="lg:col-span-1 space-y-5">
              {/* Upload box */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'}`}
                onClick={() => fileInputRef.current?.click()}
                id="upload-drop-zone"
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="report-file-input"
                  onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-sm font-semibold text-blue-700">Uploading & analyzing...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">Drop report here or click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, PNG • Max 10MB</p>
                    </div>
                    <div className="flex gap-2">
                      {['PDF', 'JPG', 'PNG'].map(ext => (
                        <span key={ext} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{ext}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">This analysis is for educational purposes only and should not replace professional medical advice.</p>
                </div>
              </div>

              {/* Reports list */}
              <div>
                <h2 className="font-display font-bold text-gray-900 mb-3">Your Reports ({reports.length})</h2>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map(r => <ReportCard key={r._id} report={r} onView={setSelectedReport} />)}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Report detail view */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                  {/* Report header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 flex items-start justify-between">
                    <div>
                      <p className="text-white/70 text-xs">AI Analysis Report</p>
                      <h2 className="text-white font-bold text-lg">{selectedReport.fileName}</h2>
                      <p className="text-purple-100 text-xs">{selectedReport.labName} • {selectedReport.reportDate ? new Date(selectedReport.reportDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelectedReport(null)} className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Abnormal values */}
                    {(selectedReport.abnormalValues || []).length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500" /> Abnormal Values — AI Explanation
                        </h3>
                        {selectedReport.abnormalValues!.map((item, i) => (
                          <AbnormalCard key={i} item={item} />
                        ))}
                      </div>
                    )}

                    {/* All results */}
                    {(selectedReport.extractedData || []).length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-display font-bold text-gray-900 mb-3">All Test Results</h3>
                        {/* Column headers */}
                        <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-gray-50 rounded-xl mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          <span>Test</span><span>Result</span><span>Reference</span><span>Status</span>
                        </div>
                        {selectedReport.extractedData!.map((entry, i) => <ResultRow key={i} entry={entry} />)}
                      </div>
                    )}

                    {/* AI Summary */}
                    {selectedReport.aiSummary && (
                      <div>
                        <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" /> AI Summary
                        </h3>
                        <div className="bg-blue-50 rounded-2xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-blue-100">
                          {selectedReport.aiSummary}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 h-full min-h-[400px] flex items-center justify-center">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Select a report to view AI analysis</p>
                    <p className="text-gray-300 text-sm mt-1">or upload a new medical report</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
