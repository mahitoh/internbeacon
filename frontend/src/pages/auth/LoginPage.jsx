import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LightInput } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) toast.error('Google sign-in failed. Please try again.');
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [authError, setAuthError]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setAuthError('');
    try {
      const role = await login(email, password, remember);
      toast.success('Welcome back!');
      navigate(
        role === 'student' ? '/student/dashboard' :
        role === 'company' ? '/company/dashboard' :
        role === 'admin'   ? '/admin/dashboard'   : '/'
      );
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>

      {/* ── Left editorial panel ── */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-[52px] relative overflow-hidden"
        style={{ background: '#10342A', color: '#fff' }}>

        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '38px 38px',
        }} />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: '#9FE870' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#10342A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polygon points="16 8 11 11 8 16 13 13 16 8" fill="#10342A" stroke="#10342A" />
            </svg>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>InternBeacon</span>
        </Link>

        {/* Testimonial */}
        <div className="relative" style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9FE870', letterSpacing: '0.04em', marginBottom: 22 }}>
            CAMEROON'S INTERNSHIP NETWORK
          </div>
          <blockquote style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 27, lineHeight: 1.42, fontWeight: 500,
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Cameroon's dedicated internship platform — connecting students with opportunities that match their skills and goals.
          </blockquote>
        </div>

        {/* Stats */}
        <div className="relative flex gap-10" style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {['Free for students', 'Verified companies', 'Real-time tracking'].map(text => (
            <div key={text} className="flex items-center gap-2" style={{ fontSize: 13.5 }}>
              <span style={{ color: '#9FE870', fontWeight: 700 }}>✓</span>
              <span style={{ color: '#D7E5DE' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-12" style={{ background: '#F6F5F1' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full" style={{ maxWidth: 400 }}>

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1E5B45' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><polygon points="16 8 11 11 8 16 13 13 16 8" fill="#9FE870" stroke="#9FE870" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#1B1D1A' }}>InternBeacon</span>
          </Link>

          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 6px', color: '#1B1D1A' }}>
            Welcome back
          </h1>
          <p style={{ margin: '0 0 30px', color: '#6B6F69', fontSize: 14.5 }}>Sign in to manage your applications.</p>

          <GoogleButton onClick={signInWithGoogle} />

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: '#E1DFD6' }} />
            <span style={{ fontSize: 12.5, color: '#9A9E97' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: '#E1DFD6' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <LightInput
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@university.cm"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required', onChange: () => setAuthError('') })}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1B1D1A' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: '#1E5B45', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <LightInput
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••••"
                error={errors.password?.message}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-[#A4A89F] hover:text-[#1B1D1A] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password', { required: 'Password is required', onChange: () => setAuthError('') })}
              />
            </div>

            {authError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(192,86,62,0.08)', border: '1px solid rgba(192,86,62,0.2)' }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#C0563E' }} />
                <p style={{ fontSize: 13.5, color: '#C0563E', lineHeight: 1.5 }}>{authError}</p>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 13.5, color: '#6B6F69' }}>
              <input
                type="checkbox"
                className="accent-[#1E5B45]"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              /> Keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
              style={{
                background: isSubmitting ? '#4E8A6E' : '#1E5B45',
                color: '#fff', border: 'none', borderRadius: 11,
                padding: '14px', fontSize: 15, fontWeight: 600,
                fontFamily: 'inherit', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 2px rgba(30,91,69,.3)',
              }}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center mb-3" style={{ fontSize: 13, color: '#8A8E86' }}>New to InternBeacon?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/register/student"
                className="flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', borderRadius: 11, padding: '11px 14px', fontSize: 13.5, fontWeight: 600, color: '#1E5B45', textDecoration: 'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Student
              </Link>
              <Link to="/register/company"
                className="flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', borderRadius: 11, padding: '11px 14px', fontSize: 13.5, fontWeight: 600, color: '#1E5B45', textDecoration: 'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                Company
              </Link>
            </div>
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
      className="w-full flex items-center justify-center gap-3 transition-colors"
      style={{
        background: '#fff', border: '1px solid #DDDBD2', borderRadius: 11,
        padding: '13px', fontSize: 14.5, fontWeight: 600,
        fontFamily: 'inherit', color: '#1B1D1A', cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Continue with Google
    </button>
  );
}
