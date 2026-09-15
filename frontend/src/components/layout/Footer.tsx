import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Medi<span className="text-blue-400">Bridge</span>{' '}
                <span className="text-sm font-semibold text-purple-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Intelligent Early Health Risk & Care Navigation System.
              From symptom reporting to intelligent care navigation — before the condition becomes critical.
            </p>
            <div className="flex items-start gap-2 text-sm mb-2">
              <Mail className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
              <a href="mailto:support@medibridge.ai" className="hover:text-blue-400 transition-colors">support@medibridge.ai</a>
            </div>
            <div className="flex items-start gap-2 text-sm mb-2">
              <Phone className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <span>+91 1800-MEDI-AI</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-purple-400 shrink-0" />
              <span>India — Serving patients nationwide</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5">
              {[
                ['Health Check', '/health-check'],
                ['Find Doctors', '/doctors'],
                ['Nearby Care', '/nearby-care'],
                ['Health Reports', '/reports'],
                ['Health History', '/history'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Legal & Support</h4>
            <ul className="space-y-2.5">
              {[
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/privacy'],
                ['Medical Disclaimer', '/privacy'],
                ['Contact Us', '/privacy'],
                ['Help Center', '/privacy'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Medical disclaimer banner */}
        <div className="border border-amber-900/50 bg-amber-900/20 rounded-xl p-4 mb-8">
          <p className="text-amber-400 text-xs leading-relaxed">
            <strong className="font-semibold">⚠️ Medical Disclaimer:</strong>{' '}
            MediBridge AI provides health risk indicators and care navigation guidance for informational purposes only.
            It does NOT provide medical diagnoses, prescriptions, or replace professional medical advice.
            Always consult a qualified healthcare professional for medical concerns.
            In case of emergency, call your local emergency number immediately.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {year} MediBridge AI. All rights reserved. Built with ❤️ for better healthcare.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Operational
            </span>
            <span className="text-xs text-gray-600">v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
