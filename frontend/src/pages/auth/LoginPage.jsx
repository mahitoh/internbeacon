import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Compass, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DarkInput } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const signInWithGoogle = async (preferredRole) => {
  if (preferredRole) sessionStorage.setItem('googleOAuthRole', preferredRole);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) toast.error('Google sign-in failed. Please try again.');
};

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [authError, setAuthError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setAuthError('');
    try {
      const role = await login(email, password);
      toast.success('Welcome back!');
      navigate(
        role === 'student' ? '/student/dashboard' :
        role === 'company' ? '/company/dashboard' :
        role === 'admin'   ? '/admin/dashboard'   : '/'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setAuthError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-forest-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#2a7a4a 1px,transparent 1px),linear-gradient(90deg,#2a7a4a 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative">
          <div className="w-9 h-9 bg-lime-500 rounded-lg flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">InternBeacon</span>
        </Link>

        <div className="relative">
          <blockquote className="text-white/80 text-lg leading-relaxed italic">
            "InternBeacon helped me land my internship at MTN Cameroon in just 3 weeks. The dashboard made tracking so easy."
          </blockquote>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400 font-bold text-sm">AB</div>
            <div>
              <p className="text-white font-semibold text-sm">Amina Bello</p>
              <p className="text-white/40 text-xs">Computer Science · ICT University</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          <div><p className="text-2xl font-black text-white">2,400+</p><p className="text-white/40 text-xs">Students placed</p></div>
          <div><p className="text-2xl font-black text-white">850+</p><p className="text-white/40 text-xs">Companies</p></div>
          <div><p className="text-2xl font-black text-white">95%</p><p className="text-white/40 text-xs">Satisfaction</p></div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">InternBeacon</span>
          </Link>

          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="text-white/40 mt-2 text-sm">Sign in to your InternBeacon account</p>

          {/* Google sign-in */}
          <div className="mt-6">
            <GoogleButton onClick={() => signInWithGoogle()} />
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DarkInput
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                onChange: () => setAuthError(''),
              })}
            />
            <DarkInput
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                onChange: () => setAuthError(''),
              })}
            />

            {authError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 leading-snug">{authError}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                <input type="checkbox" className="accent-lime-500" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-lime-400 hover:text-lime-300">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
              Sign In <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{' '}
              <Link to="/register/student" className="text-lime-400 hover:text-lime-300 font-medium">Register as Student</Link>
              {' '}or{' '}
              <Link to="/register/company" className="text-lime-400 hover:text-lime-300 font-medium">as Company</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors border border-white/10">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}
