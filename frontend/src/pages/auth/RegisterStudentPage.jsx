import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth';
import { LightInput } from '../../components/ui/Input';
import SelectField from '../../components/ui/SelectField';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const signInWithGoogle = async () => {
  sessionStorage.setItem('googleOAuthRole', 'student');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) toast.error('Google sign-in failed. Please try again.');
};

const UNIVERSITIES = ['ICT University', 'University of Yaoundé I', 'University of Yaoundé II', 'University of Buea', 'ESSEC Douala', 'IRIC', "SUP'TIC", 'ENSP Yaoundé', 'IUT Douala', 'ISTDI', 'Other'];
const YEARS = [1, 2, 3, 4, 5];

const selectCls = [
  'w-full border bg-white px-4 py-2.5 text-[14px] text-[#1B1D1A] appearance-none',
  'focus:outline-none transition-colors duration-200',
].join(' ');

export default function RegisterStudentPage() {
  const navigate = useNavigate();
  const [regError, setRegError]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setRegError('');
    try {
      await authApi.registerStudent({
        email:      data.email,
        password:   data.password,
        firstName:  data.firstName,
        lastName:   data.lastName,
        university: data.university,
        programme:  data.programme,
        studyYear:  Number(data.studyYear),
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-[52px] relative overflow-hidden"
        style={{ background: '#10342A', color: '#fff' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '38px 38px',
        }} />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, borderRadius: 10, background: '#9FE870' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#10342A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><polygon points="16 8 11 11 8 16 13 13 16 8" fill="#10342A" stroke="#10342A" />
            </svg>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>InternBeacon</span>
        </Link>

        <div className="relative">
          <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 30, fontWeight: 600, lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Start your internship journey today
          </h2>
          <p style={{ fontSize: 14, color: '#A9C4B8', margin: '0 0 24px' }}>
            Join students across Cameroon finding their internship.
          </p>
          <ul className="space-y-2">
            {['Free to join, forever', 'Access verified internship offers', 'Apply in 60 seconds', 'Real-time application tracking', 'Chat directly with recruiters'].map(p => (
              <li key={p} className="flex items-center gap-2" style={{ fontSize: 13.5, color: '#D7E5DE' }}>
                <span style={{ color: '#9FE870', fontWeight: 700 }}>✓</span> {p}
              </li>
            ))}
          </ul>
        </div>

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
      <div className="flex-1 h-full flex items-start justify-center px-8 py-5 overflow-y-auto" style={{ background: '#F6F5F1' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full py-3" style={{ maxWidth: 420 }}>

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="flex items-center justify-center rounded-[9px]" style={{ width: 34, height: 34, background: '#1E5B45' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><polygon points="16 8 11 11 8 16 13 13 16 8" fill="#9FE870" stroke="#9FE870" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#1B1D1A' }}>InternBeacon</span>
          </Link>

          {/* Role switcher */}
          <div className="flex mb-4" style={{ background: '#EFEEE8', borderRadius: 12, padding: 4 }}>
            <span className="flex-1 flex items-center justify-center gap-2"
              style={{ background: '#fff', border: '1px solid #E7E6DF', borderRadius: 9, padding: '9px 14px', fontSize: 13.5, fontWeight: 600, color: '#1B1D1A', boxShadow: '0 1px 2px rgba(24,32,24,.06)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Student
            </span>
            <Link to="/register/company"
              className="flex-1 flex items-center justify-center gap-2 transition-colors"
              style={{ borderRadius: 9, padding: '9px 14px', fontSize: 13.5, fontWeight: 600, color: '#8A8E86', textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              Company
            </Link>
          </div>

          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 4px', color: '#1B1D1A' }}>
            Create student account
          </h1>
          <p style={{ margin: '0 0 14px', color: '#6B6F69', fontSize: 14 }}>Start discovering internship opportunities.</p>

          <GoogleButton onClick={signInWithGoogle} />

          <div className="flex items-center gap-4 my-3">
            <div className="flex-1 h-px" style={{ background: '#E1DFD6' }} />
            <span style={{ fontSize: 12.5, color: '#9A9E97' }}>or register with email</span>
            <div className="flex-1 h-px" style={{ background: '#E1DFD6' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <LightInput label="First name" icon={User} placeholder="Your first name"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Required' })} />
              <LightInput label="Last name" placeholder="Your last name"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Required' })} />
            </div>

            <LightInput label="Email address" type="email" icon={Mail} placeholder="you@university.cm"
              error={errors.email?.message}
              {...register('email', {
                required: 'Required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                onChange: () => setRegError(''),
              })} />

            <LightInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              trailing={
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-[#A4A89F] hover:text-[#1B1D1A] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min. 8 characters' } })} />

            <div className="space-y-1.5">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B1D1A' }}>University</label>
              <SelectField bare
                style={{ borderRadius: 11, borderColor: errors.university ? '#f87171' : '#DDDBD2' }}
                className={selectCls + ' pr-10 border focus:border-[#1E5B45] focus:ring-2 focus:ring-[#1E5B45]/15'}
                {...register('university', { required: 'Required' })}>
                <option value="">Select your university…</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </SelectField>
              {errors.university && <p className="text-xs" style={{ color: '#C0563E' }}>{errors.university.message}</p>}
            </div>

            <LightInput label="Programme / Degree" icon={GraduationCap} placeholder="e.g. BSc Computer Science"
              error={errors.programme?.message}
              {...register('programme', { required: 'Required' })} />

            <div className="space-y-1.5">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1B1D1A' }}>Year of study</label>
              <SelectField bare
                style={{ borderRadius: 11, borderColor: errors.studyYear ? '#f87171' : '#DDDBD2' }}
                className={selectCls + ' pr-10 border focus:border-[#1E5B45] focus:ring-2 focus:ring-[#1E5B45]/15'}
                {...register('studyYear', { required: 'Required' })}>
                <option value="">Select year…</option>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </SelectField>
              {errors.studyYear && <p className="text-xs" style={{ color: '#C0563E' }}>{errors.studyYear.message}</p>}
            </div>

            {regError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(192,86,62,0.08)', border: '1px solid rgba(192,86,62,0.2)' }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#C0563E' }} />
                <div>
                  <p style={{ fontSize: 13.5, color: '#C0563E', lineHeight: 1.5 }}>{regError}</p>
                  {regError.toLowerCase().includes('already exists') && (
                    <Link to="/login" style={{ fontSize: 12, color: '#1E5B45', display: 'inline-block', marginTop: 4 }}>Go to sign in →</Link>
                  )}
                </div>
              </div>
            )}

            <p style={{ fontSize: 12, color: '#8A8E86' }}>
              By registering you agree to our{' '}
              <span style={{ color: '#1E5B45', fontWeight: 600 }}>Terms of Service</span>{' '}and{' '}
              <span style={{ color: '#1E5B45', fontWeight: 600 }}>Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
              style={{
                background: isSubmitting ? '#4E8A6E' : '#1E5B45',
                color: '#fff', border: 'none', borderRadius: 11,
                padding: '11px', fontSize: 14.5, fontWeight: 600,
                fontFamily: 'inherit', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 2px rgba(30,91,69,.3)',
              }}>
              {isSubmitting ? 'Creating account…' : 'Create Account'}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-center mt-3" style={{ fontSize: 13.5, color: '#6B6F69' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1E5B45', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
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
