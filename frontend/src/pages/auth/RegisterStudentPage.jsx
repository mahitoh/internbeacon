import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Compass, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/auth';
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

const UNIVERSITIES = ['ICT University', 'University of Yaoundé I', 'University of Yaoundé II', 'ESSEC Douala', 'IRIC', 'SUP\'TIC', 'ENSP Yaoundé', 'IUT Douala', 'ISTDI', 'Other'];
const YEARS        = [1, 2, 3, 4, 5];

export default function RegisterStudentPage() {
  const navigate = useNavigate();
  const [regError, setRegError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setRegError('');
    try {
      await authApi.registerStudent({
        email:       data.email,
        password:    data.password,
        firstName:   data.firstName,
        lastName:    data.lastName,
        university:  data.university,
        programme:   data.programme,
        studyYear:   Number(data.studyYear),
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-forest-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#2a7a4a 1px,transparent 1px),linear-gradient(90deg,#2a7a4a 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="w-9 h-9 bg-lime-500 rounded-lg flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">InternBeacon</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-black text-white leading-tight">Start your internship journey today</h2>
          <p className="mt-4 text-white/50">Join 2,400+ students who found their dream internship through InternBeacon.</p>
          <ul className="mt-6 space-y-2">
            {['Free to join, forever', 'Access 500+ verified offers', 'Apply in 60 seconds', 'Real-time application tracking', 'Chat directly with recruiters'].map(p => (
              <li key={p} className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-lime-400">✓</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-white/20 text-xs relative">© 2024 InternBeacon</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">InternBeacon</span>
          </Link>

          <h1 className="text-3xl font-black text-white">Create student account</h1>
          <p className="text-white/40 mt-2 text-sm">Start discovering internship opportunities</p>

          <div className="mt-6">
            <GoogleButton onClick={() => signInWithGoogle('student')} />
          </div>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or register with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <DarkInput label="First Name" icon={User} placeholder="Collins"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Required' })} />
              <DarkInput label="Last Name" placeholder="Nkem"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Required' })} />
            </div>

            <DarkInput label="Email address" type="email" icon={Mail} placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                onChange: () => setRegError(''),
              })} />

            <DarkInput label="Password" type="password" icon={Lock} placeholder="Min. 8 characters"
              error={errors.password?.message}
              {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min. 8 characters' } })} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">University</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                {...register('university', { required: 'Required' })}>
                <option value="" className="bg-[#1a1a1a]">Select your university…</option>
                {UNIVERSITIES.map(u => <option key={u} value={u} className="bg-[#1a1a1a]">{u}</option>)}
              </select>
              {errors.university && <p className="text-xs text-red-400">{errors.university.message}</p>}
            </div>

            <DarkInput label="Programme / Degree" icon={GraduationCap} placeholder="BSc Information Technology"
              error={errors.programme?.message}
              {...register('programme', { required: 'Required' })} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">Year of Study</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                {...register('studyYear', { required: 'Required' })}>
                <option value="" className="bg-[#1a1a1a]">Select year…</option>
                {YEARS.map(y => <option key={y} value={y} className="bg-[#1a1a1a]">Year {y}</option>)}
              </select>
              {errors.studyYear && <p className="text-xs text-red-400">{errors.studyYear.message}</p>}
            </div>

            {regError && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-300 leading-snug">{regError}</p>
                  {regError.toLowerCase().includes('already exists') && (
                    <Link to="/login" className="text-xs text-lime-400 hover:text-lime-300 mt-1 inline-block">
                      Go to sign in →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <p className="text-white/30 text-xs">
              By registering you agree to our{' '}
              <a href="#" className="text-lime-400 hover:underline">Terms of Service</a>{' '}and{' '}
              <a href="#" className="text-lime-400 hover:underline">Privacy Policy</a>.
            </p>

            <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
              Create Account <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-lime-400 hover:text-lime-300 font-medium">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-white/30 text-xs">
            Are you a company?{' '}
            <Link to="/register/company" className="text-white/50 hover:text-white">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleButton({ onClick }) {
  return (
    <button type="button" onClick={onClick}
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
