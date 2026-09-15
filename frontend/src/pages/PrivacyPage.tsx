import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, AlertTriangle, Heart, Mail, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const sections = [
  {
    icon: AlertTriangle,
    title: 'Medical Disclaimer',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    content: `MediBridge AI provides health risk indicators and care navigation guidance for INFORMATIONAL PURPOSES ONLY.

This platform:
• Does NOT provide medical diagnoses
• Does NOT prescribe medications or treatments  
• Does NOT replace consultation with qualified healthcare professionals
• Is NOT suitable for emergency medical situations

The AI-generated risk scores are based on user-reported data and rule-based analysis. They represent probabilistic indicators, NOT clinical assessments.

ALWAYS consult a registered medical professional for any health concerns. In case of a medical emergency, call 112 (India) or your local emergency number immediately.

By using MediBridge AI, you acknowledge that you understand these limitations.`,
  },
  {
    icon: Shield,
    title: 'Privacy Policy',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    content: `We respect your privacy and are committed to protecting your personal health information.

What we collect:
• Basic profile information (name, email, age, gender)
• Health symptoms and lifestyle information you voluntarily provide
• Uploaded medical reports
• Usage data and interactions with our platform

How we use your data:
• To provide AI health risk assessments
• To match you with appropriate healthcare providers
• To improve our AI models (anonymized and aggregated only)
• To send health reminders and notifications (only with your consent)

Data sharing:
• We NEVER sell your personal health data to third parties
• Data is shared with healthcare providers only with your explicit consent
• Anonymized, aggregated data may be used for research purposes`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    color: 'text-green-600',
    bg: 'bg-green-50',
    content: `Your health data security is our highest priority.

Security measures we implement:
• AES-256 encryption for data at rest
• TLS 1.3 for all data in transit
• JWT-based authentication with secure token expiry
• bcrypt password hashing (12 salt rounds)
• Rate limiting to prevent abuse
• CORS protection
• HTTP security headers (Helmet.js)
• MongoDB Atlas with IP whitelisting

We do NOT store:
• Plain-text passwords
• Credit card or payment information
• Your exact GPS location
• Biometric data

Data retention: Health assessments are stored for 2 years and can be deleted upon request.`,
  },
  {
    icon: Eye,
    title: 'Your Rights',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    content: `Under applicable data protection regulations, you have the right to:

• Access: Request a complete copy of your health data
• Rectification: Correct inaccurate personal information
• Erasure: Request deletion of your account and health data ("Right to be forgotten")
• Portability: Download your health data in a machine-readable format
• Objection: Opt out of specific data processing activities
• Restriction: Limit how we process your data

To exercise any of these rights, contact us at:
privacy@medibridge.ai

We will respond to all requests within 30 days.`,
  },
  {
    icon: Database,
    title: 'Data We Collect',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    content: `Types of data collected through MediBridge AI:

1. Account Information:
   Name, email address, phone number (optional), date of birth, gender

2. Health Information (user-provided):
   Symptoms, medical history, existing conditions, medications, allergies, family health history, lifestyle data

3. Uploaded Documents:
   Blood reports, diagnostic reports, prescriptions (stored securely, processed by OCR AI)

4. Usage Data:
   Pages visited, features used, time spent (for improving the product — anonymized)

5. Technical Data:
   IP address, browser type, device type (standard server logs — auto-deleted after 30 days)

Health data is classified as sensitive and is protected with the highest security standards.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Privacy & Legal</h1>
              <p className="text-gray-300 max-w-xl mx-auto">
                Your health data is sensitive. We take privacy and security seriously.
                This page covers our privacy policy, medical disclaimer, and your rights.
              </p>
              <p className="text-gray-500 text-sm mt-3">Last updated: September 15, 2026</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Medical disclaimer highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-display font-bold text-amber-900">⚠️ Important Medical Disclaimer</h2>
            </div>
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>MediBridge AI is NOT a medical diagnostic tool.</strong> It provides AI-assisted health risk indicators
              for informational purposes only. All assessments should be reviewed by a qualified healthcare professional.
              This platform does not diagnose, prescribe, or treat any medical condition.
              In an emergency, call <strong>112</strong> immediately.
            </p>
          </motion.div>

          {/* Policy sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
              >
                <div className={`flex items-center gap-3 p-5 border-b border-gray-100 ${section.bg}`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                  <h2 className={`font-display font-bold text-lg ${section.color}`}>{section.title}</h2>
                </div>
                <div className="p-5">
                  <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {section.content}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-teal-600 text-white rounded-3xl p-8 mt-8 text-center"
          >
            <Heart className="w-10 h-10 text-white/80 mx-auto mb-4" fill="white" />
            <h2 className="text-2xl font-display font-bold mb-2">Questions About Your Privacy?</h2>
            <p className="text-blue-100 text-sm mb-6">Our data protection team is here to help.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:privacy@medibridge.ai"
                className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all">
                <Mail className="w-4 h-4" /> privacy@medibridge.ai
              </a>
              <Link to="/"
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
