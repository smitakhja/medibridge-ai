import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Navigation, Info, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmergencyAlert({ onDismiss }: { onDismiss?: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-red-600 to-red-800 text-white rounded-3xl p-6 shadow-emergency overflow-hidden"
    >
      {/* Pulsing background rings */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full animate-ping" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full animate-pulse" />

      {/* Dismiss button */}
      {onDismiss && (
        <button onClick={onDismiss} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all">
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative">
        <div className="relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-bounce" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Potential Emergency Detected</h2>
          <p className="text-red-200 text-sm">Immediate attention may be required</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
        <p className="text-sm leading-relaxed">
          Based on your reported symptoms, our AI has detected indicators that may require
          <strong> immediate medical attention</strong>. Please take this seriously.
        </p>
      </div>

      {/* Warning signs */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-red-200 uppercase tracking-wide mb-2">Serious Warning Signs:</p>
        <ul className="space-y-1.5">
          {[
            'Chest pain or pressure',
            'Difficulty breathing or shortness of breath',
            'Loss of consciousness or fainting',
            'Sudden severe headache',
            'Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty)',
          ].map((sign, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-300 mt-0.5 shrink-0">⚠</span>
              {sign}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => navigate('/nearby-care')}
          className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-all active:scale-95"
          id="find-hospital-btn"
        >
          <Navigation className="w-4 h-4" />
          Find Hospital
        </button>

        {!confirmed ? (
          <button
            onClick={() => setConfirmed(true)}
            className="flex items-center justify-center gap-2 bg-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/30 transition-all active:scale-95 border border-white/30"
            id="call-emergency-btn"
          >
            <Phone className="w-4 h-4" />
            Call 112
          </button>
        ) : (
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 animate-pulse"
          >
            <Phone className="w-4 h-4" />
            Calling 112...
          </a>
        )}

        <button
          className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all active:scale-95 border border-white/20"
          id="first-aid-btn"
        >
          <Info className="w-4 h-4" />
          First Aid Guide
        </button>
      </div>

      {/* Legal note */}
      <p className="text-xs text-red-200 mt-4 text-center">
        This alert does not replace calling emergency services. If in immediate danger, call 112.
      </p>
    </motion.div>
  );
}
