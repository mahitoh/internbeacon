import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Globe, Upload, Save, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import CropModal from '../../components/ui/CropModal';
import { profilesApi } from '../../api/profiles';
import { uploadApi } from '../../api/upload';
import toast from 'react-hot-toast';

const SECTORS = ['Information Technology', 'Finance & Banking', 'Telecommunications', 'Marketing & Sales', 'Engineering', 'Healthcare', 'Education', 'Oil & Gas', 'Other'];
const SIZES   = ['1-10', '11-50', '51-200', '201-500', '500+'];
const CITIES  = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Multiple cities'];

export default function CompanyProfile() {
  const { user, refetchUser } = useAuth();
  const p        = user?.companyProfile;
  const [logoUrl,        setLogoUrl]        = useState(p?.logoUrl || null);
  const [uploadingLogo,  setUploadingLogo]  = useState(false);
  const [cropSrc,        setCropSrc]        = useState(null);
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
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Company Profile</h2>
        <p className="text-white/40 text-sm mt-0.5">Keep your profile up to date to attract the best candidates</p>
      </div>

      {/* Logo upload */}
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
      {cropSrc && (
        <CropModal imageSrc={cropSrc} shape="rect" onConfirm={handleCropConfirm} onCancel={() => setCropSrc(null)} />
      )}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-brand-800/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          {logoUrl
            ? <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
            : <Building2 size={32} className="text-brand-400" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold">{p?.companyName || 'Company Logo'}</p>
            {p?.isVerified && (
              <span className="flex items-center gap-1 text-xs text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full">
                <ShieldCheck size={11} /> Verified
              </span>
            )}
          </div>
          {p?.isVerified
            ? <p className="text-white/30 text-xs mt-1">Your company is verified by InternBeacon</p>
            : <p className="text-white/30 text-xs mt-1">Complete your profile to request verification from the admin</p>
          }
          <p className="text-white/20 text-xs mt-0.5">Recommended: 200×200 px, PNG or JPG, max 2 MB</p>
          <Button variant="outline" size="sm" className="mt-3"
            loading={uploadingLogo} onClick={() => logoInputRef.current?.click()}>
            <Upload size={14} /> {uploadingLogo ? 'Uploading…' : 'Upload Logo'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Section title="Company Information" icon={Building2}>
          <DarkField label="Company Name *" {...register('companyName')} placeholder="MTN Cameroon" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Industry / Sector</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
              {...register('sector')}>
              {SECTORS.map(s => <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Company Size</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
              {...register('employeeSize')}>
              <option value="" className="bg-[#1a1a1a]">Select size…</option>
              {SIZES.map(s => <option key={s} value={s} className="bg-[#1a1a1a]">{s} employees</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">About Company</label>
            <textarea rows={4}
              placeholder="Tell students about your company, culture, and what makes you a great place to intern…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
              {...register('description')} />
          </div>
        </Section>

        <Section title="Location & Contact" icon={MapPin}>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">City</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
              {...register('city')}>
              {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
            </select>
          </div>
          <DarkField label="Full Address" {...register('address')} placeholder="123 Avenue Kennedy, Yaoundé" />
          <DarkField label="Phone Number" {...register('phone')} placeholder="+237 222 000 000" />
          <DarkField label="Website" {...register('websiteUrl')} placeholder="https://www.company.cm" icon={Globe} />
        </Section>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          <Save size={16} /> Save Profile
        </Button>
      </form>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
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

function DarkField({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/60">{label}</label>}
      <input className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 transition-colors" {...props} />
    </div>
  );
}
