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

const fieldStyle = {
  background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '10px',
  padding: '10px 14px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none',
};

export default function PostOffer() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { isPaid: false, openings: 1, stipendCurrency: 'XAF' }
  });
  const [skills,     setSkills]     = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const isPaid = watch('isPaid');

  const addSkill = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) { setSkillInput(''); return; }
    const lc = trimmed.toLowerCase();
    if (!skills.some(s => s.toLowerCase() === lc)) setSkills(prev => [...prev, trimmed]);
    setSkillInput('');
  };

  const handleSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); }
    else if (e.key === 'Backspace' && !skillInput && skills.length) setSkills(prev => prev.slice(0, -1));
  };

  const removeSkill = (skill) => setSkills(prev => prev.filter(s => s !== skill));

  const onSubmit = async (data) => {
    const allSkills = skillInput.trim()
      ? [...skills, ...skillInput.split(',').map(s => s.trim()).filter(Boolean)]
      : skills;
    const paid   = data.isPaid === true || data.isPaid === 'true';
    const amount = paid && data.stipendAmount ? Number(data.stipendAmount) : undefined;
    if (paid && (!amount || isNaN(amount))) { toast.error('Please enter a stipend amount for paid internships'); return; }
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
    <div className="max-w-2xl space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Post New Internship</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Fill in the details to attract the right candidates</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormSection title="Basic Information" icon={Briefcase}>
          <Field label="Internship Title *" error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g. Software Development Intern" />

          <SelectField label="Domain *" error={errors.domain?.message}
            {...register('domain', { required: 'Domain is required' })}>
            <option value="">Select domain…</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </SelectField>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Description *</label>
            <textarea rows={5} placeholder="Describe the internship role and what the intern will be doing…"
              style={{ ...fieldStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'}
              {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Responsibilities</label>
            <textarea rows={3} placeholder="Key responsibilities for this role…"
              style={{ ...fieldStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'}
              {...register('responsibilities')} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Requirements</label>
            <textarea rows={3} placeholder="Candidate requirements and qualifications…"
              style={{ ...fieldStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'}
              {...register('requirements')} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Required Skills</label>
            <div className="min-h-[46px] flex flex-wrap items-center gap-2 rounded-xl px-3 py-2 transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2' }}
              onFocus={() => {}} >
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{ background: '#1E5B45', color: '#fff' }}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity">
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                onBlur={() => skillInput.trim() && addSkill(skillInput)}
                placeholder={skills.length ? '' : 'JavaScript, React, SQL… (Enter or comma to add)'}
                className="flex-1 min-w-[140px] bg-transparent text-sm focus:outline-none py-0.5"
                style={{ color: '#1B1D1A' }} />
            </div>
            <p className="text-[11px]" style={{ color: '#C0BFBA' }}>Press Enter or comma to add each skill</p>
          </div>
        </FormSection>

        <FormSection title="Logistics" icon={MapPin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Location *" error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}>
              <option value="">Select city…</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </SelectField>
            <SelectField label="Duration (weeks) *" error={errors.durationWeeks?.message}
              {...register('durationWeeks', { required: 'Duration is required' })}>
              <option value="">Select…</option>
              {DURATIONS.map(d => <option key={d} value={d}>{d} weeks</option>)}
            </SelectField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Number of Openings" type="number" min="1" {...register('openings', { min: 1 })} />
            <Field label="Application Deadline *" type="date"
              min={new Date().toISOString().split('T')[0]}
              error={errors.deadline?.message}
              {...register('deadline', {
                required: 'Deadline is required',
                validate: v => !v || new Date(v) > new Date() || 'Deadline must be in the future',
              })} />
          </div>
          <Field label="Preferred Start Date" type="date" {...register('startDate')} />
        </FormSection>

        <FormSection title="Compensation" icon={Banknote}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#1E5B45]" {...register('isPaid')} />
            <span className="text-sm" style={{ color: '#1B1D1A' }}>This is a paid internship</span>
          </label>

          {isPaid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <Field label="Stipend Amount (per month)" type="number" {...register('stipendAmount')} placeholder="50000" />
              <SelectField label="Currency" {...register('stipendCurrency')}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </SelectField>
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
    <div className="rounded-2xl p-6 space-y-4" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color: '#1E5B45' }} />
        <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>}
      <input style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = '#1E5B45'}
        onBlur={e => e.target.style.borderColor = '#DDDBD2'}
        {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ label, error, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>}
      <select style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none', appearance: 'none' }}
        onFocus={e => e.target.style.borderColor = '#1E5B45'}
        onBlur={e => e.target.style.borderColor = '#DDDBD2'}
        {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
