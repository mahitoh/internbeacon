import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { User, GraduationCap, Code2, Upload, Globe, Github, Linkedin, Save, FileCheck, Loader2, Sparkles, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import CropModal from '../../components/ui/CropModal';
import CvViewerModal from '../../components/ui/CvViewerModal';
import { profilesApi } from '../../api/profiles';
import { uploadApi } from '../../api/upload';
import { aiApi } from '../../api/ai';
import toast from 'react-hot-toast';

const SKILLS_LIST = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'Machine Learning', 'Data Analysis', 'Excel', 'Figma', 'Marketing', 'Finance'];

export default function StudentProfile() {
  const { user, refetchUser } = useAuth();
  const profile  = user?.studentProfile;
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);
  const [parsingCv,      setParsingCv]      = useState(false);
  const [uploadingCv,    setUploadingCv]    = useState(false);
  const [cvViewerOpen,   setCvViewerOpen]   = useState(false);
  const [cvViewerUrl,    setCvViewerUrl]    = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cvUploaded,     setCvUploaded]     = useState(!!profile?.cvUrl);
  const googleAvatarUrl  = user?.avatarUrl || null;
  const [avatarUrl,      setAvatarUrl]      = useState(profile?.avatarUrl || googleAvatarUrl || null);
  const isGoogleAvatar   = !profile?.avatarUrl && !!googleAvatarUrl && avatarUrl === googleAvatarUrl;
  const [cropSrc,        setCropSrc]        = useState(null);
  const cvInputRef    = useRef(null);
  const photoInputRef = useRef(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName:   profile?.firstName  || '',
      lastName:    profile?.lastName   || '',
      phone:       profile?.phone      || '',
      university:  profile?.university || '',
      faculty:     profile?.faculty    || '',
      programme:   profile?.programme  || '',
      studyYear:   profile?.studyYear  || 1,
      bio:         profile?.bio        || '',
      linkedinUrl: profile?.linkedinUrl || '',
      githubUrl:   profile?.githubUrl  || '',
    },
  });

  const toggleSkill = (s) => {
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleParseCv = async () => {
    setParsingCv(true);
    try {
      const r = await aiApi.parseCv();
      const data = r.data.data;
      if (data.skills?.length) {
        setSelectedSkills(data.skills.slice(0, 15));
        toast.success(`AI extracted ${data.skills.length} skills from your CV!`);
      } else {
        toast.success('CV analysed — no skills found. Try adding them manually.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'CV analysis failed';
      toast.error(msg);
    } finally { setParsingCv(false); }
  };

  const handlePreviewCv = async () => {
    try {
      const r = await uploadApi.getCvUrl(user?.id);
      setCvViewerUrl(r.data.data.url);
      setCvViewerOpen(true);
    } catch {
      toast.error('Could not load CV preview');
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    try {
      await uploadApi.cv(file);
      setCvUploaded(true);
      toast.success('CV uploaded!');
    } catch {
      toast.error('CV upload failed — max 5 MB PDF only');
    } finally { setUploadingCv(false); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    // reset so selecting same file again triggers onChange
    e.target.value = '';
  };

  const handleCropConfirm = async (croppedFile) => {
    setCropSrc(null);
    setUploadingPhoto(true);
    try {
      const r = await uploadApi.avatar(croppedFile);
      setAvatarUrl(r.data.data.url);
      await refetchUser();
      toast.success('Photo updated!');
    } catch {
      toast.error('Photo upload failed — max 2 MB image only');
    } finally { setUploadingPhoto(false); }
  };

  const onSubmit = async (data) => {
    try {
      await profilesApi.updateStudent({ ...data, skills: selectedSkills });
      await refetchUser();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const completion  = [profile?.bio, profile?.cvUrl, profile?.skills?.length, profile?.phone].filter(Boolean).length;
  const pct         = Math.round((completion / 4) * 100);

  return (
    <div className="max-w-3xl space-y-6">
      <CvViewerModal
        isOpen={cvViewerOpen}
        onClose={() => setCvViewerOpen(false)}
        url={cvViewerUrl}
        candidateName={displayName || undefined}
      />

      {/* hidden inputs */}
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      <input ref={cvInputRef}    type="file" accept=".pdf"    className="hidden" onChange={handleCvChange} />

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          shape="round"
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {/* Profile header */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
              : <Avatar name={displayName} size="xl" />}
            {isGoogleAvatar && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm" title="Google profile photo">
                <svg viewBox="0 0 24 24" className="w-3 h-3"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{displayName || 'Your Profile'}</h2>
            <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
            {isGoogleAvatar && (
              <p className="text-white/25 text-xs mt-0.5">Using Google profile photo — upload a custom photo to replace it</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                <div className="h-full bg-lime-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-white/40">{pct}% complete</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} loading={uploadingPhoto}>
            <Upload size={14} /> {uploadingPhoto ? 'Uploading…' : 'Upload Photo'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Personal Info */}
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DarkField label="First Name" {...register('firstName')} />
            <DarkField label="Last Name"  {...register('lastName')} />
          </div>
          <DarkField label="Phone Number" {...register('phone')} placeholder="+237 6XX XXX XXX" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Bio</label>
            <textarea rows={3} placeholder="Tell companies a bit about yourself…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
              {...register('bio')} />
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon={GraduationCap}>
          <DarkField label="University"   {...register('university')} />
          <DarkField label="Faculty"      {...register('faculty')}    placeholder="Faculty of Science" />
          <DarkField label="Programme"    {...register('programme')}  placeholder="BSc Information Technology" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Year of Study</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none"
              {...register('studyYear', { valueAsNumber: true })}>
              {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-[#1a1a1a]">Year {y}</option>)}
            </select>
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={Code2}>
          <div className="flex flex-wrap gap-2">
            {SKILLS_LIST.map(s => (
              <button type="button" key={s} onClick={() => toggleSkill(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSkills.includes(s) ? 'bg-lime-500 text-white' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input placeholder="Add custom skill…"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const v = e.target.value.trim(); if (v && !selectedSkills.includes(v)) { setSelectedSkills(p => [...p, v]); e.target.value = ''; } } }}
            />
          </div>
        </Section>

        {/* Links */}
        <Section title="Links & Social" icon={Globe}>
          <DarkField label="LinkedIn" icon={Linkedin} {...register('linkedinUrl')} placeholder="https://linkedin.com/in/yourprofile" />
          <DarkField label="GitHub"   icon={Github}   {...register('githubUrl')}   placeholder="https://github.com/yourusername" />
        </Section>

        {/* CV Upload */}
        <Section title="CV / Resume" icon={Upload}>
          <div
            onClick={() => cvInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-lime-500/30 transition-colors cursor-pointer">
            {uploadingCv
              ? <Loader2 size={24} className="text-lime-400 mx-auto mb-2 animate-spin" />
              : cvUploaded
              ? <FileCheck size={24} className="text-lime-400 mx-auto mb-2" />
              : <Upload size={24} className="text-white/30 mx-auto mb-2" />}
            <p className="text-white/50 text-sm">
              {uploadingCv ? 'Uploading…' : cvUploaded ? 'CV uploaded — click to replace' : 'Click to upload your CV'}
            </p>
            <p className="text-white/30 text-xs mt-1">PDF only, max 5 MB</p>
          </div>
          {cvUploaded && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleParseCv}
                disabled={parsingCv}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/20 text-lime-400 text-sm font-semibold transition-all disabled:opacity-50">
                {parsingCv
                  ? <><Loader2 size={15} className="animate-spin" /> Analysing CV…</>
                  : <><Sparkles size={15} /> Analyse with AI</>}
              </button>
              <button
                type="button"
                onClick={handlePreviewCv}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all">
                <Eye size={15} /> Preview
              </button>
            </div>
          )}
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
      <label className="block text-sm font-medium text-white/60">{label}</label>
      <input className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 transition-colors" {...props} />
    </div>
  );
}
