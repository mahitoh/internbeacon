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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-lime-500 rounded-lg flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">InternBeacon</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div key="role"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-3xl font-black text-white">One last step</h1>
              <p className="text-white/40 mt-2 text-sm mb-8">
                {googleUser?.email && <span>Signed in as <strong className="text-white/70">{googleUser.email}</strong>. </span>}
                How will you use InternBeacon?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full flex items-center gap-4 p-5 bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-lime-500/40 hover:bg-[#1e1e1e] transition-all group text-left">
                  <div className="w-12 h-12 rounded-xl bg-lime-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-lime-500/20 transition-colors">
                    <GraduationCap size={22} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">I'm a Student</p>
                    <p className="text-white/40 text-sm mt-0.5">Find internships that match my skills</p>
                  </div>
                  <ArrowRight size={18} className="text-white/20 ml-auto group-hover:text-lime-400 transition-colors" />
                </button>

                <button
                  onClick={() => handleRoleSelect('company')}
                  className="w-full flex items-center gap-4 p-5 bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-lime-500/40 hover:bg-[#1e1e1e] transition-all group text-left">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                    <Building2 size={22} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">I'm a Company</p>
                    <p className="text-white/40 text-sm mt-0.5">Post internship offers and hire interns</p>
                  </div>
                  <ArrowRight size={18} className="text-white/20 ml-auto group-hover:text-violet-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'profile' && role === 'student' && (
            <motion.div key="student-profile"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('role')} className="text-white/30 hover:text-white text-sm mb-6 transition-colors">← Back</button>
              <h1 className="text-3xl font-black text-white">Student profile</h1>
              <p className="text-white/40 mt-2 text-sm mb-6">Tell us about your studies</p>

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
                  <label className="block text-sm font-medium text-white/70">University</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                    {...register('university', { required: 'Required' })}>
                    <option value="" className="bg-[#1a1a1a]">Select your university…</option>
                    {UNIVERSITIES.map(u => <option key={u} value={u} className="bg-[#1a1a1a]">{u}</option>)}
                  </select>
                  {errors.university && <p className="text-xs text-red-400">{errors.university.message}</p>}
                </div>

                <DarkInput label="Programme / Degree" placeholder="BSc Information Technology"
                  error={errors.programme?.message}
                  {...register('programme', { required: 'Required' })} />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">Year of Study</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                    {...register('studyYear', { required: 'Required', valueAsNumber: true, min: { value: 1, message: 'Required' } })}>
                    <option value="" className="bg-[#1a1a1a]">Select year…</option>
                    {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-[#1a1a1a]">Year {y}</option>)}
                  </select>
                  {errors.studyYear && <p className="text-xs text-red-400">{errors.studyYear.message}</p>}
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
              <button onClick={() => setStep('role')} className="text-white/30 hover:text-white text-sm mb-6 transition-colors">← Back</button>
              <h1 className="text-3xl font-black text-white">Company profile</h1>
              <p className="text-white/40 mt-2 text-sm mb-6">Tell us about your organisation</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DarkInput label="Company Name" placeholder="MTN Cameroon"
                  error={errors.companyName?.message}
                  {...register('companyName', { required: 'Required' })} />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">Sector / Industry</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                    {...register('sector', { required: 'Required' })}>
                    <option value="" className="bg-[#1a1a1a]">Select your industry…</option>
                    {SECTORS.map(s => <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>)}
                  </select>
                  {errors.sector && <p className="text-xs text-red-400">{errors.sector.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/70">City</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                    {...register('city', { required: 'Required' })}>
                    <option value="" className="bg-[#1a1a1a]">Select city…</option>
                    {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                  </select>
                  {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-2">
                  Complete Setup <ArrowRight size={16} />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
