import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Banknote, X } from 'lucide-react';
import { offersApi } from '../../api/offers';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const DOMAINS    = ['Information Technology', 'Finance & Banking', 'Telecommunications', 'Marketing & Sales', 'Engineering', 'Human Resources', 'Legal', 'Healthcare', 'Agriculture', 'Other'];
const LOCATIONS  = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Remote'];
const DURATIONS  = [4, 8, 12, 16, 24];
const CURRENCIES = ['XAF', 'USD', 'EUR'];

export default function PostOffer() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { isPaid: false, openings: 1, stipendCurrency: 'XAF' }
  });
  const [skills,      setSkills]      = useState([]);
  const [skillInput,  setSkillInput]  = useState('');

  const isPaid = watch('isPaid');

  const addSkill = (raw) => {
    const trimmed = raw.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed]);
    setSkillInput('');
  };

  const handleSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === 'Backspace' && !skillInput && skills.length) {
      setSkills(prev => prev.slice(0, -1));
    }
  };

  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill));

  const onSubmit = async (data) => {
    // Flush any partially-typed skill before submitting
    const allSkills = skillInput.trim()
      ? [...skills, ...skillInput.split(',').map(s => s.trim()).filter(Boolean)]
      : skills;

    const paid = data.isPaid === true || data.isPaid === 'true';
    const amount = paid && data.stipendAmount ? Number(data.stipendAmount) : undefined;
    if (paid && (!amount || isNaN(amount))) {
      toast.error('Please enter a stipend amount for paid internships');
      return;
    }
    try {
      await offersApi.create({
        title:            data.title,
        domain:           data.domain,
        description:      data.description,
        responsibilities: data.responsibilities || undefined,
        requirements:     data.requirements || undefined,
        location:         data.location,
        durationWeeks:    Number(data.durationWeeks),
        openings:         data.openings ? Number(data.openings) : undefined,
        deadline:         data.deadline,
        startDate:        data.startDate || undefined,
        isPaid:           paid,
        stipendAmount:    amount,
        stipendCurrency:  paid ? (data.stipendCurrency || 'XAF') : undefined,
        requiredSkills:   allSkills,
      });
      toast.success('Internship offer posted!');
      navigate('/company/offers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post offer');
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Post New Internship</h2>
        <p className="text-white/40 text-sm mt-0.5">Fill in the details to attract the right candidates</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <FormSection title="Basic Information" icon={Briefcase}>
          <DarkField label="Internship Title *" error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g. Software Development Intern" />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Domain *</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
              {...register('domain', { required: 'Domain is required' })}>
              <option value="" className="bg-[#1a1a1a]">Select domain…</option>
              {DOMAINS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
            </select>
            {errors.domain && <p className="text-xs text-red-400">{errors.domain.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Description *</label>
            <textarea rows={5} placeholder="Describe the internship role and what the intern will be doing…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
              {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Responsibilities</label>
            <textarea rows={3} placeholder="Key responsibilities for this role…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
              {...register('responsibilities')} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Requirements</label>
            <textarea rows={3} placeholder="Candidate requirements and qualifications…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
              {...register('requirements')} />
          </div>

          {/* Tag input for required skills */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Required Skills</label>
            <div className="min-h-[46px] flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 focus-within:border-lime-500/50 transition-colors">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 px-2.5 py-1 bg-lime-500/15 border border-lime-500/25 text-lime-300 text-xs rounded-lg font-medium">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-lime-400/60 hover:text-lime-300 transition-colors ml-0.5">
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                placeholder={skills.length ? '' : 'JavaScript, React, SQL… (Enter or comma to add)'}
                className="flex-1 min-w-[140px] bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none py-0.5"
              />
            </div>
            <p className="text-[11px] text-white/25">Press Enter or comma to add each skill</p>
          </div>
        </FormSection>

        {/* Logistics */}
        <FormSection title="Logistics" icon={MapPin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Location *</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                {...register('location', { required: 'Location is required' })}>
                <option value="" className="bg-[#1a1a1a]">Select city…</option>
                {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
              </select>
              {errors.location && <p className="text-xs text-red-400">{errors.location.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/60">Duration (weeks) *</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                {...register('durationWeeks', { required: 'Duration is required' })}>
                <option value="" className="bg-[#1a1a1a]">Select…</option>
                {DURATIONS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d} weeks</option>)}
              </select>
              {errors.durationWeeks && <p className="text-xs text-red-400">{errors.durationWeeks.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DarkField label="Number of Openings" type="number" min="1"
              {...register('openings', { min: 1 })} />
            <DarkField label="Application Deadline *" type="date"
              error={errors.deadline?.message}
              {...register('deadline', { required: 'Deadline is required' })} />
          </div>

          <DarkField label="Preferred Start Date" type="date" {...register('startDate')} />
        </FormSection>

        {/* Compensation */}
        <FormSection title="Compensation" icon={Banknote}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-lime-500 w-4 h-4"
              {...register('isPaid')} />
            <span className="text-sm text-white">This is a paid internship</span>
          </label>

          {isPaid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <DarkField label="Stipend Amount (per month)" type="number"
                {...register('stipendAmount')} placeholder="50000" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/60">Currency</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
                  {...register('stipendCurrency')}>
                  {CURRENCIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </FormSection>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
            Publish Internship
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/company/offers')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-lime-400" />
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DarkField({ label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/60">{label}</label>}
      <input className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 transition-colors" {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
