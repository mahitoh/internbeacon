import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Compass, GraduationCap, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { DarkInput } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const UNIVERSITIES = ['ICT University', 'University of Yaoundé I', 'University of Yaoundé II', 'ESSEC Douala', 'IRIC', "SUP'TIC", 'ENSP Yaoundé', 'IUT Douala', 'ISTDI', 'Other'];
const SECTORS      = ['Information Technology', 'Finance & Banking', 'Telecommunications', 'Marketing & Sales', 'Engineering', 'Healthcare', 'Education', 'Oil & Gas', 'Agriculture', 'Other'];
const CITIES       = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Ngaoundéré', 'Bertoua', 'Maroua'];

export default function OnboardingPage() {
  const navigate            = useNavigate();
  const { refetchUser }     = useAuth();
  const preferredRole       = sessionStorage.getItem('googleOAuthRole') || '';

  const [step, setStep]     = useState(preferredRole ? 'profile' : 'role');
  const [role, setRole]     = useState(preferredRole || '');
  const [googleUser, setGoogleUser] = useState(null);
  const [googleName, setGoogleName] = useState({ firstName: '', lastName: '' });

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  // Fetch Google user metadata
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate('/login', { replace: true }); return; }
      setGoogleUser(user);
      const meta = user.user_metadata || {};
      let firstName = '', lastName = '';
      if (meta.full_name || meta.name) {
        const parts = (meta.full_name || meta.name || '').split(' ');
        firstName = parts[0] || '';
        lastName  = parts.slice(1).join(' ') || '';
      } else {
        firstName = meta.given_name  || '';
        lastName  = meta.family_name || '';
      }
      setGoogleName({ firstName, lastName });
    });
  }, []);

  // Pre-fill name fields once the profile step is rendered and fields are registered
  useEffect(() => {
    if (step === 'profile' && googleName.firstName) {
      setValue('firstName', googleName.firstName, { shouldValidate: false });
      setValue('lastName',  googleName.lastName,  { shouldValidate: false });
    }
  }, [step, googleName]);

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep('profile');
    sessionStorage.removeItem('googleOAuthRole');
  };

  const onSubmit = async (data) => {
    try {
      await authApi.completeProfile({ role, ...data });

      // Refresh the Supabase session so the token carries the new role
      const { data: { session } } = await supabase.auth.refreshSession();
      if (session) {
        localStorage.setItem('accessToken',  session.access_token);
        localStorage.setItem('refreshToken', session.refresh_token);
      }

      await refetchUser();
      toast.success('Welcome to InternBeacon!');
      navigate(role === 'student' ? '/student/dashboard' : '/company/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete setup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#F6F5F1', fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #DEDCD2 1px, transparent 0)',
        backgroundSize: '26px 26px',
        opacity: .5,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 9, background: '#1E5B45' }}>
            <Compass size={19} className="text-white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#1B1D1A' }}>InternBeacon</span>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #E7E6DF', borderRadius: 18, padding: '36px 32px', boxShadow: '0 4px 24px rgba(24,32,24,.05)' }}>
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div key="role"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>One last step</h1>
              <p style={{ fontSize: 14, color: '#6B6F69', margin: '0 0 28px', lineHeight: 1.5 }}>
                {googleUser?.email && <span>Signed in as <strong style={{ color: '#1B1D1A' }}>{googleUser.email}</strong>. </span>}
                How will you use InternBeacon?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all group text-left"
                  style={{ background: '#F6F5F1', border: '1.5px solid #E7E6DF' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5B45'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E7E6DF'}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDF2EE' }}>
                    <GraduationCap size={22} style={{ color: '#1E5B45' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#1B1D1A' }}>I'm a Student</p>
                    <p className="text-sm mt-0.5" style={{ color: '#6B6F69' }}>Find internships that match my skills</p>
                  </div>
                  <ArrowRight size={18} className="ml-auto" style={{ color: '#A4A89F' }} />
                </button>

                <button
                  onClick={() => handleRoleSelect('company')}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all group text-left"
                  style={{ background: '#F6F5F1', border: '1.5px solid #E7E6DF' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5B45'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E7E6DF'}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDF2EE' }}>
                    <Building2 size={22} style={{ color: '#1E5B45' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#1B1D1A' }}>I'm a Company</p>
                    <p className="text-sm mt-0.5" style={{ color: '#6B6F69' }}>Post internship offers and hire interns</p>
                  </div>
                  <ArrowRight size={18} className="ml-auto" style={{ color: '#A4A89F' }} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'profile' && role === 'student' && (
            <motion.div key="student-profile"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('role')} className="text-sm mb-6 transition-colors" style={{ color: '#9A9E97' }}>← Back</button>
              <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Student profile</h1>
              <p style={{ fontSize: 14, color: '#6B6F69', margin: '0 0 24px', lineHeight: 1.5 }}>Tell us about your studies</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <DarkInput label="First Name" placeholder="Collins"
                    error={errors.firstName?.message}
                    {...register('firstName', { required: 'Required' })} />
                  <DarkInput label="Last Name" placeholder="Nkem"
                    error={errors.lastName?.message}
                    {...register('lastName', { required: 'Required' })} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold" style={{ color: '#1B1D1A' }}>University</label>
                  <select className="w-full rounded-[11px] px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 appearance-none"
                    style={{ border: '1px solid #DDDBD2', background: '#F6F5F1', color: '#1B1D1A' }}
                    {...register('university', { required: 'Required' })}>
                    <option value="">Select your university…</option>
                    {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  {errors.university && <p className="text-xs text-red-500">{errors.university.message}</p>}
                </div>

                <DarkInput label="Programme / Degree" placeholder="BSc Information Technology"
                  error={errors.programme?.message}
                  {...register('programme', { required: 'Required' })} />

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold" style={{ color: '#1B1D1A' }}>Year of Study</label>
                  <select className="w-full rounded-[11px] px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 appearance-none"
                    style={{ border: '1px solid #DDDBD2', background: '#F6F5F1', color: '#1B1D1A' }}
                    {...register('studyYear', { required: 'Required', valueAsNumber: true, min: { value: 1, message: 'Required' } })}>
                    <option value="">Select year…</option>
                    {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                  {errors.studyYear && <p className="text-xs text-red-500">{errors.studyYear.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
                  Complete Setup <ArrowRight size={16} />
                </Button>
              </form>
            </motion.div>
          )}

          {step === 'profile' && role === 'company' && (
            <motion.div key="company-profile"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('role')} className="text-sm mb-6 transition-colors" style={{ color: '#9A9E97' }}>← Back</button>
              <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Company profile</h1>
              <p style={{ fontSize: 14, color: '#6B6F69', margin: '0 0 24px', lineHeight: 1.5 }}>Tell us about your organisation</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DarkInput label="Company Name" placeholder="MTN Cameroon"
                  error={errors.companyName?.message}
                  {...register('companyName', { required: 'Required' })} />

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold" style={{ color: '#1B1D1A' }}>Sector / Industry</label>
                  <select className="w-full rounded-[11px] px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 appearance-none"
                    style={{ border: '1px solid #DDDBD2', background: '#F6F5F1', color: '#1B1D1A' }}
                    {...register('sector', { required: 'Required' })}>
                    <option value="">Select your industry…</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.sector && <p className="text-xs text-red-500">{errors.sector.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-semibold" style={{ color: '#1B1D1A' }}>City</label>
                  <select className="w-full rounded-[11px] px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 appearance-none"
                    style={{ border: '1px solid #DDDBD2', background: '#F6F5F1', color: '#1B1D1A' }}
                    {...register('city', { required: 'Required' })}>
                    <option value="">Select city…</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
                  Complete Setup <ArrowRight size={16} />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
