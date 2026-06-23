import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Globe, Upload, Save, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import CropModal from '../../components/ui/CropModal';
import SelectField from '../../components/ui/SelectField';
import { profilesApi } from '../../api/profiles';
import { uploadApi } from '../../api/upload';
import toast from 'react-hot-toast';

const SECTORS = ['Information Technology', 'Finance & Banking', 'Telecommunications', 'Marketing & Sales', 'Engineering', 'Healthcare', 'Education', 'Oil & Gas', 'Other'];
const SIZES   = ['1-10', '11-50', '51-200', '201-500', '500+'];
const CITIES  = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Multiple cities'];

function Section({ title, icon: Icon, children }) {
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

function Field({ label, onFocus, onBlur, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>}
      <input
        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
        style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
        {...props}
        onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; onFocus?.(e); }}
        onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; onBlur?.(e); }}
      />
    </div>
  );
}

export default function CompanyProfile() {
  const { user, refetchUser } = useAuth();
  const p        = user?.companyProfile;
  const [logoUrl,       setLogoUrl]       = useState(p?.logoUrl || null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [cropSrc,       setCropSrc]       = useState(null);
  const logoInputRef = useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropConfirm = async (croppedFile) => {
    setCropSrc(null);
    setUploadingLogo(true);
    try {
      const r = await uploadApi.logo(croppedFile);
      setLogoUrl(r.data.data.url);
      await refetchUser();
      toast.success('Logo updated!');
    } catch {
      toast.error('Logo upload failed — max 2 MB image only');
    } finally { setUploadingLogo(false); }
  };

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      companyName:  p?.companyName  || '',
      sector:       p?.sector       || '',
      city:         p?.city         || '',
      description:  p?.description  || '',
      phone:        p?.phone        || '',
      websiteUrl:   p?.websiteUrl   || '',
      address:      p?.address      || '',
      employeeSize: p?.employeeSize || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await profilesApi.updateCompany(data);
      await refetchUser();
      toast.success('Company profile updated!');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="max-w-2xl space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Company Profile</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Keep your profile up to date to attract the best candidates</p>
      </div>

      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
      {cropSrc && (
        <CropModal imageSrc={cropSrc} shape="rect" onConfirm={handleCropConfirm} onCancel={() => setCropSrc(null)} />
      )}

      {/* Logo card */}
      <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
          {logoUrl
            ? <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
            : <Building2 size={32} style={{ color: '#9A9E97' }} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold" style={{ color: '#1B1D1A' }}>{p?.companyName || 'Company Logo'}</p>
            {p?.isVerified && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                <ShieldCheck size={11} /> Verified
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>
            {p?.isVerified
              ? 'Your company is verified by InternBeacon'
              : 'Complete your profile to request verification from the admin'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#C0BFBA' }}>Recommended: 200×200 px, PNG or JPG, max 2 MB</p>
          <Button variant="outline" size="sm" className="mt-3"
            loading={uploadingLogo} onClick={() => logoInputRef.current?.click()}>
            <Upload size={14} /> {uploadingLogo ? 'Uploading…' : 'Upload Logo'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section title="Company Information" icon={Building2}>
          <Field label="Company Name *" {...register('companyName')} placeholder="Your company name" />
          <SelectField label="Industry / Sector" {...register('sector')}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectField>
          <SelectField label="Company Size" {...register('employeeSize')}>
            <option value="">Select size…</option>
            {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
          </SelectField>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>About Company</label>
            <textarea rows={4}
              placeholder="Tell students about your company, culture, and what makes you a great place to intern…"
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              {...register('description')}
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }} />
          </div>
        </Section>

        <Section title="Location & Contact" icon={MapPin}>
          <SelectField label="City" {...register('city')}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectField>
          <Field label="Full Address" {...register('address')} placeholder="123 Avenue Kennedy, Yaoundé" />
          <Field label="Phone Number" {...register('phone')} placeholder="+237 222 000 000" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium flex items-center gap-1.5" style={{ color: '#6B6F69' }}>
              <Globe size={13} /> Website
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              placeholder="https://www.company.cm"
              {...register('websiteUrl')}
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
            />
          </div>
        </Section>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          <Save size={16} /> Save Profile
        </Button>
      </form>
    </div>
  );
}
