import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-teal-600 to-blue-600 p-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">MediBridge AI</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white mb-1">Reset Password</h1>
            <p className="text-teal-100 text-sm">We'll send you a reset link</p>
          </div>
          <div className="p-8">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-500 text-sm mb-6">If <strong>{email}</strong> is registered, you'll receive a reset link shortly.</p>
                <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 mb-2">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-sm text-blue-700">Enter your registered email and we'll send you a secure password reset link.</p>
                </div>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    autoFocus
                  />
                </div>
                <button type="submit" id="forgot-submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Remember your password? <Link to="/login" className="text-blue-600 font-semibold">Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-200 text-sm hover:text-white transition-colors">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
}
