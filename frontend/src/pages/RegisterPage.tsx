import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  age: z.coerce.number().min(1, 'Enter a valid age').max(120).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  phone: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      await authRegister(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { error?: string } } };
      setError(axErr.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">MediBridge AI</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-white mb-1">Create Your Account</h1>
            <p className="text-blue-100 text-sm">Start your personalized health journey</p>
          </div>

          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-5"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: CheckCircle, text: 'AI Health Analysis', color: 'text-green-600' },
                { icon: CheckCircle, text: 'Secure & Private', color: 'text-blue-600' },
                { icon: CheckCircle, text: '100% Free', color: 'text-purple-600' },
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input {...register('name')} id="reg-name" placeholder="Your full name" className="form-input" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input {...register('email')} id="reg-email" type="email" placeholder="you@example.com" className="form-input" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                  <input {...register('age')} id="reg-age" type="number" placeholder="25" className="form-input" min="1" max="120" />
                  {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select {...register('gender')} id="reg-gender" className="form-input">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input {...register('phone')} id="reg-phone" type="tel" placeholder="+91 98765 43210" className="form-input" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className="form-input pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                <input {...register('confirmPassword')} id="reg-confirm-password" type="password" placeholder="Re-enter password" className="form-input" />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400">
                By creating an account, you agree to our{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>{' '}
                and acknowledge that MediBridge AI provides risk guidance, not medical diagnoses.
              </p>

              <button type="submit" id="register-submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-blue-200 text-sm hover:text-white transition-colors">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
}
