import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

// Demo credentials for judges/hackathon
const DEMO_CREDS = [
  { label: 'User', email: 'demo@medibridge.ai', password: 'demo1234', role: 'user' },
  { label: 'Doctor', email: 'doctor@medibridge.ai', password: 'demo1234', role: 'doctor' },
  { label: 'Admin', email: 'admin@medibridge.ai', password: 'demo1234', role: 'admin' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { error?: string } } };
      setError(axErr.response?.data?.error || 'Invalid email or password. Try demo credentials below.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (creds: typeof DEMO_CREDS[0]) => {
    setValue('email', creds.email);
    setValue('password', creds.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">MediBridge AI</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white mb-1">Welcome back</h1>
            <p className="text-blue-100 text-sm">Sign in to your health account</p>
          </div>

          <div className="p-8">
            {/* Demo credential chips */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">🎯 Demo Login (Hackathon)</p>
              <div className="flex gap-2 flex-wrap">
                {DEMO_CREDS.map((c) => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => fillDemo(c)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-all"
                    id={`demo-${c.role}-btn`}
                  >
                    {c.label} Demo
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  className="form-input"
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    id="login-password"
                    placeholder="••••••••"
                    className="form-input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">Create one free</Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-200 text-sm hover:text-white transition-colors">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
}
