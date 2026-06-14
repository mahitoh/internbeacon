import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { User, GraduationCap, Code2, Upload, Globe, Github, Linkedin, Save, FileText, Loader2, Eye, Bell, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import CropModal from '../../components/ui/CropModal';
import CvViewerModal from '../../components/ui/CvViewerModal';
import { profilesApi } from '../../api/profiles';
import { uploadApi } from '../../api/upload';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SKILLS_LIST = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'Machine Learning', 'Data Analysis', 'Excel', 'Figma', 'Marketing', 'Finance'];
const CITIES = ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Buea', 'Limbé'];

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

function Field({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>
      <input
        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
        style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
        onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
        onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
        {...props}
      />
    </div>
  );
}

export default function StudentProfile() {
  const { user, refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const profile  = user?.studentProfile;
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);
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
  const dragCounterRef = useRef(0);
  const [isDraggingCv,     setIsDraggingCv]     = useState(false);
  const [suggestedSkills,  setSuggestedSkills]  = useState([]);

  const { data: prefs } = useQuery({
    queryKey: ['notification-prefs'],
    queryFn:  () => profilesApi.getPreferences().then(r => r.data.data),
    staleTime: 60_000,
  });

  const prefsMutation = useMutation({
    mutationFn: (updates) => profilesApi.updatePreferences(updates).then(r => r.data.data),
    onSuccess:  (data) => queryClient.setQueryData(['notification-prefs'], data),
    onError:    () => toast.error('Failed to save alert preferences'),
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName:   profile?.firstName  || '',
      lastName:    profile?.lastName   || '',
      phone:       profile?.phone      || '',
      city:        profile?.city       || '',
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

  const handlePreviewCv = async () => {
    try {
      const r = await uploadApi.getCvUrl(user?.id);
      setCvViewerUrl(r.data.data.url);
      setCvViewerOpen(true);
    } catch {
      toast.error('Could not load CV preview');
    }
  };

  const handleCvFile = useCallback(async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are accepted'); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error('File too large — max 5 MB');   return; }
    setUploadingCv(true);
    try {
      await uploadApi.cv(file);
      setCvUploaded(true);
      await refetchUser();
      toast.success('CV uploaded!');
      // Silently parse CV and suggest skills not already in the student's list
      api.post('/ai/parse-cv').then(r => {
        const extracted = r.data.data?.skills || [];
        setSuggestedSkills(prev => {
          const current = selectedSkills;
          const newOnes = extracted.filter(s => !current.includes(s) && !prev.includes(s));
          return newOnes.length ? newOnes : prev;
        });
      }).catch(() => {});
    } catch {
      toast.error('CV upload failed — max 5 MB PDF only');
    } finally { setUploadingCv(false); }
  }, [refetchUser, selectedSkills]);

  const handleCvChange = (e) => handleCvFile(e.target.files?.[0]);

  const handleDragEnter = (e) => { e.preventDefault(); dragCounterRef.current++; if (dragCounterRef.current === 1) setIsDraggingCv(true); };
  const handleDragLeave = (e) => { e.preventDefault(); dragCounterRef.current--; if (dragCounterRef.current === 0) setIsDraggingCv(false); };
  const handleDragOver  = (e) => { e.preventDefault(); };
  const handleDrop = (e) => { e.preventDefault(); dragCounterRef.current = 0; setIsDraggingCv(false); handleCvFile(e.dataTransfer.files?.[0]); };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
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
      // Invalidate all offer/recommendation caches so match scores
      // recalculate immediately with the updated profile
      queryClient.invalidateQueries({ queryKey: ['offers-browse'] });
      queryClient.invalidateQueries({ queryKey: ['offers-rec'] });
      queryClient.invalidateQueries({ queryKey: ['offer'] });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const displayName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const completion  = [profile?.bio, profile?.cvUrl, profile?.skills?.length, profile?.phone, profile?.city, profile?.programme].filter(Boolean).length;
  const pct         = Math.round((completion / 6) * 100);

  return (
    <div className="max-w-3xl space-y-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <CvViewerModal isOpen={cvViewerOpen} onClose={() => setCvViewerOpen(false)} url={cvViewerUrl} candidateName={displayName || undefined} />

      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      <input ref={cvInputRef}    type="file" accept=".pdf"    className="hidden" onChange={handleCvChange} />

      {cropSrc && (
        <CropModal imageSrc={cropSrc} shape="round" onConfirm={handleCropConfirm} onCancel={() => setCropSrc(null)} />
      )}

      {/* Profile header */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover"
                  style={{ border: '2px solid #E7E6DF' }} referrerPolicy="no-referrer" />
              : <Avatar name={displayName} size="xl" />}
            {isGoogleAvatar && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: '#fff', border: '1px solid #E7E6DF' }} title="Google profile photo">
                <svg viewBox="0 0 24 24" className="w-3 h-3">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: '#1B1D1A' }}>{displayName || 'Your Profile'}</h2>
            <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>{user?.email}</p>
            {isGoogleAvatar && (
              <p className="text-xs mt-0.5" style={{ color: '#C0BFBA' }}>Using Google profile photo — upload a custom photo to replace it</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: '#E7E6DF' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#1E5B45' }} />
              </div>
              <span className="text-xs" style={{ color: '#9A9E97' }}>{pct}% complete</span>
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
            <Field label="First Name" {...register('firstName')} />
            <Field label="Last Name"  {...register('lastName')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Number" {...register('phone')} placeholder="+237 6XX XXX XXX" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium flex items-center gap-1.5" style={{ color: '#6B6F69' }}>
                <MapPin size={12} /> City / Location
              </label>
              <select
                className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors appearance-none"
                style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
                onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
                {...register('city')}>
                <option value="">Select your city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-xs" style={{ color: '#9A9E97' }}>Used for location matching</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Bio</label>
            <textarea rows={3} placeholder="Tell companies a bit about yourself…"
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
              {...register('bio')} />
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon={GraduationCap}>
          <Field label="University" {...register('university')} />
          <Field label="Faculty"    {...register('faculty')}    placeholder="Faculty of Science" />
          <Field label="Programme"  {...register('programme')}  placeholder="BSc Information Technology" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Year of Study</label>
            <select
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors appearance-none"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
              {...register('studyYear', { valueAsNumber: true })}>
              {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={Code2}>
          <div className="flex flex-wrap gap-2">
            {SKILLS_LIST.map(s => {
              const isSelected = selectedSkills.includes(s);
              return (
                <button type="button" key={s} onClick={() => toggleSkill(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={isSelected
                    ? { background: '#1E5B45', color: '#fff', border: '1px solid #10342A' }
                    : { background: '#F6F5F1', color: '#6B6F69', border: '1px solid #E7E6DF' }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 mt-2">
            <input placeholder="Add custom skill…"
              className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const v = e.target.value.trim();
                  if (v && !selectedSkills.includes(v)) { setSelectedSkills(p => [...p, v]); e.target.value = ''; }
                }
              }}
            />
          </div>
          {selectedSkills.filter(s => !SKILLS_LIST.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.filter(s => !SKILLS_LIST.includes(s)).map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                  {s}
                  <button type="button" onClick={() => setSelectedSkills(p => p.filter(x => x !== s))}
                    className="ml-0.5 opacity-60 hover:opacity-100">×</button>
                </span>
              ))}
            </div>
          )}

          {/* CV-extracted skill suggestions */}
          {suggestedSkills.length > 0 && (
            <div className="rounded-xl p-3 space-y-2" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold" style={{ color: '#1E5B45' }}>
                  Skills detected in your CV — click to add
                </p>
                <button type="button" onClick={() => setSuggestedSkills([])}
                  className="text-xs" style={{ color: '#6B6F69' }}>
                  Dismiss
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map(s => (
                  <button type="button" key={s}
                    onClick={() => {
                      if (!selectedSkills.includes(s)) setSelectedSkills(p => [...p, s]);
                      setSuggestedSkills(p => p.filter(x => x !== s));
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{ background: '#fff', border: '1px solid #C4DBCE', color: '#1E5B45' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F5FAF7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Links */}
        <Section title="Links & Social" icon={Globe}>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium flex items-center gap-1.5" style={{ color: '#6B6F69' }}>
              <Linkedin size={13} /> LinkedIn
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              placeholder="https://linkedin.com/in/yourprofile"
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
              {...register('linkedinUrl')}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium flex items-center gap-1.5" style={{ color: '#6B6F69' }}>
              <Github size={13} /> GitHub
            </label>
            <input
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              placeholder="https://github.com/yourusername"
              onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
              {...register('githubUrl')}
            />
          </div>
        </Section>

        {/* CV Upload */}
        <Section title="CV / Resume" icon={Upload}>
          {cvUploaded ? (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
              <div className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                {uploadingCv
                  ? <Loader2 size={16} className="animate-spin" style={{ color: '#DC2626' }} />
                  : <FileText size={18} style={{ color: '#DC2626' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#1B1D1A' }}>
                  {displayName ? `${displayName} — CV.pdf` : 'Resume.pdf'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>PDF document · uploaded</p>
              </div>
              <button type="button" onClick={() => cvInputRef.current?.click()}
                className="text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                style={{ color: '#6B6F69', border: '1px solid #DDDBD2', background: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5B45'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                Replace
              </button>
            </div>
          ) : (
            <div
              onClick={() => !uploadingCv && cvInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer select-none"
              style={isDraggingCv
                ? { borderColor: '#1E5B45', background: '#EDF2EE', transform: 'scale(1.01)' }
                : { borderColor: '#DDDBD2', background: '#F6F5F1' }}>
              {uploadingCv ? (
                <Loader2 size={28} className="mx-auto mb-3 animate-spin" style={{ color: '#1E5B45' }} />
              ) : isDraggingCv ? (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                  <Upload size={22} style={{ color: '#1E5B45' }} />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
                  <Upload size={22} style={{ color: '#9A9E97' }} />
                </div>
              )}
              <p className="text-sm font-medium" style={{ color: isDraggingCv ? '#1E5B45' : '#6B6F69' }}>
                {uploadingCv ? 'Uploading…' : isDraggingCv ? 'Drop your PDF here' : 'Drag & drop your CV here'}
              </p>
              {!uploadingCv && (
                <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>
                  {isDraggingCv ? '' : 'or click to browse — '}PDF only, max 5 MB
                </p>
              )}
            </div>
          )}
          {cvUploaded && (
            <button type="button" onClick={handlePreviewCv}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1B1D1A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; }}>
              <Eye size={15} /> Preview CV
            </button>
          )}
        </Section>

        {/* Alert Preferences */}
        <Section title="Offer Alerts" icon={Bell}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>Notify me about matching internships</p>
              <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>Get in-app alerts when new offers match your profile</p>
            </div>
            <button type="button"
              onClick={() => prefsMutation.mutate({ offerAlerts: !(prefs?.offerAlerts ?? true) })}
              className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
              style={{ background: (prefs?.offerAlerts ?? true) ? '#1E5B45' : '#E7E6DF' }}>
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200"
                style={{ transform: (prefs?.offerAlerts ?? true) ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>
          {(prefs?.offerAlerts ?? true) && (
            <div className="flex items-center justify-between pt-1">
              <label className="text-sm" style={{ color: '#6B6F69' }}>Minimum match score</label>
              <select
                value={prefs?.minMatchScore ?? 50}
                onChange={e => prefsMutation.mutate({ minMatchScore: Number(e.target.value) })}
                className="rounded-lg px-3 py-1.5 text-sm focus:outline-none appearance-none transition-colors"
                style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
                onFocus={e => e.target.style.borderColor = '#1E5B45'}
                onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                {[40, 50, 60, 70, 80].map(v => (
                  <option key={v} value={v}>{v}% or higher</option>
                ))}
              </select>
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
