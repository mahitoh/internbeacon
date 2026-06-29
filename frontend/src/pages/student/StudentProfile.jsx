import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { User, GraduationCap, Code2, Upload, Globe, Github, Linkedin, Save, FileText, Loader2, Eye, Bell, MapPin, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import CropModal from '../../components/ui/CropModal';
import CvViewerModal from '../../components/ui/CvViewerModal';
import SelectField from '../../components/ui/SelectField';
import Combobox from '../../components/ui/Combobox';
import { profilesApi } from '../../api/profiles';
import { uploadApi } from '../../api/upload';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CAMEROON_CITIES } from '../../constants/locations';

const SKILLS_LIST = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'Machine Learning', 'Data Analysis', 'Excel', 'Figma', 'Marketing', 'Finance'];
// Matches the languages the CV parser can detect (backend extractLanguagesFromText)
// and the ones offers can require (matchingEngine.js LANGUAGE_TOKENS).
const LANGUAGES_LIST = ['English', 'French', 'Fulfulde', 'Spanish', 'German'];
const CITIES = CAMEROON_CITIES;

// Suggestion lists for the education combo-boxes. These are hints only —
// the field stays a free-text input so a student can type anything not listed.
const UNIVERSITIES = ['ICT University', 'University of Yaoundé I', 'University of Yaoundé II', 'University of Buea', 'University of Douala', 'University of Dschang', 'University of Bamenda', 'University of Ngaoundéré', 'University of Maroua', 'ESSEC Douala', 'IRIC', "SUP'TIC", 'ENSP Yaoundé', 'IUT Douala', 'ISTDI', 'Other'];
const FACULTIES = ['Faculty of Science', 'Faculty of Engineering', 'College of Technology', 'Faculty of Economics & Management', 'Faculty of Arts, Letters & Social Sciences', 'Faculty of Law & Political Science', 'Faculty of Health Sciences', 'Faculty of Agriculture', 'Business School', 'FICT', 'Other'];
const PROGRAMMES = ['BSc Computer Science', 'BSc Software Engineering', 'BSc Information Technology', 'BEng Telecommunications', 'BEng Electrical Engineering', 'BEng Civil Engineering', 'BEng Mechanical Engineering', 'BSc Banking & Finance', 'BSc Accounting', 'BSc Economics', 'BSc Management', 'BSc Marketing', 'BSc Human Resource Management', 'LLB Law', 'BSc Communication', 'BSc Nursing', 'BSc Agriculture', 'Other'];

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

// Shared focus/blur styling. Composed with any handler the caller passes (e.g.
// react-hook-form's register().onBlur) so the border/background reset isn't
// clobbered by the spread — previously RHF's onBlur won and fields stayed
// highlighted green after you clicked away.
const focusStyle = (extra) => (e) => {
  e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; extra?.(e);
};
const blurStyle = (extra) => (e) => {
  e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; extra?.(e);
};

function Field({ label, onFocus, onBlur, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>
      <input
        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
        style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
        {...props}
        onFocus={focusStyle(onFocus)}
        onBlur={blurStyle(onBlur)}
      />
    </div>
  );
}


export default function StudentProfile() {
  const { user, refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const profile  = user?.studentProfile;
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);
  const [selectedLanguages, setSelectedLanguages] = useState(profile?.languages || []);
  const [uploadingCv,    setUploadingCv]    = useState(false);
  const [removingCv,     setRemovingCv]     = useState(false);
  const [cvViewerOpen,   setCvViewerOpen]   = useState(false);
  const [cvViewerUrl,    setCvViewerUrl]    = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cvUploaded,     setCvUploaded]     = useState(!!profile?.cvUrl);
  const cvExt = profile?.cvUrl?.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf';
  const googleAvatarUrl  = user?.avatarUrl || null;
  const [avatarUrl,      setAvatarUrl]      = useState(profile?.avatarUrl || googleAvatarUrl || null);
  const isGoogleAvatar   = !profile?.avatarUrl && !!googleAvatarUrl && avatarUrl === googleAvatarUrl;
  const [cropSrc,        setCropSrc]        = useState(null);
  const cvInputRef    = useRef(null);
  const photoInputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const [isDraggingCv,     setIsDraggingCv]     = useState(false);
  const [analyzingCv,      setAnalyzingCv]      = useState(false);

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

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
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

  // The profile arrives asynchronously (AuthContext fetch). useState/useForm only
  // read their initial value on first render, so when the profile loads later we
  // must sync it into local state — otherwise the editor opens blank and saving
  // would wipe existing skills/fields back to empty.
  useEffect(() => {
    if (!profile) return;
    setSelectedSkills(profile.skills || []);
    setSelectedLanguages(profile.languages || []);
    setCvUploaded(!!profile.cvUrl);
    setAvatarUrl(profile.avatarUrl || googleAvatarUrl || null);
    reset({
      firstName:   profile.firstName  || '',
      lastName:    profile.lastName   || '',
      phone:       profile.phone      || '',
      city:        profile.city       || '',
      university:  profile.university || '',
      faculty:     profile.faculty    || '',
      programme:   profile.programme  || '',
      studyYear:   profile.studyYear  || 1,
      bio:         profile.bio        || '',
      linkedinUrl: profile.linkedinUrl || '',
      githubUrl:   profile.githubUrl  || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggleSkill = (s) => {
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleLanguage = (l) => {
    setSelectedLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
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

  // Parse the stored CV, merge the detected skills into the profile, and surface
  // clear feedback. The backend persists the merge, so it works even before Save.
  const analyzeCv = useCallback(async () => {
    setAnalyzingCv(true);
    const tid = toast.loading('Analyzing your CV…');
    try {
      const r = await api.post('/ai/parse-cv');
      const extracted      = r.data.data?.skills || [];
      const extractedLangs = r.data.data?.languages || [];
      if (extracted.length) {
        // Replace with the CV's skills (the backend does the same) so each upload
        // reflects THAT CV instead of piling skills up across uploads.
        const deduped = [];
        const lower = new Set();
        extracted.forEach(s => {
          const k = String(s).toLowerCase().trim();
          if (k && !lower.has(k)) { lower.add(k); deduped.push(s); }
        });
        setSelectedSkills(deduped);
        if (extractedLangs.length) setSelectedLanguages(extractedLangs);
        await refetchUser();
        toast.success(`Loaded ${deduped.length} skill${deduped.length !== 1 ? 's' : ''} from your CV`, { id: tid });
      } else {
        toast('No skills detected — add them manually below', { id: tid, icon: 'ℹ️' });
      }
    } catch (err) {
      // Surface the backend's specific guidance (e.g. "scanned image — upload a
      // text-based PDF") instead of a generic failure. 503 = all AI providers busy.
      const status    = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      const msg = status === 503
        ? 'CV analysis is busy right now — click "Re-analyze CV" in a moment'
        : (serverMsg || 'Could not analyze CV');
      toast.error(msg, { id: tid });
    } finally {
      setAnalyzingCv(false);
    }
  }, [refetchUser]);

  const ALLOWED_CV_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleCvFile = useCallback(async (file) => {
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    const okType = ALLOWED_CV_TYPES.includes(file.type) || lowerName.endsWith('.pdf') || lowerName.endsWith('.docx');
    if (!okType) { toast.error('Only PDF or Word (.docx) files are accepted'); return; }
    if (file.size > 5 * 1024 * 1024)          { toast.error('File too large — max 5 MB');   return; }
    setUploadingCv(true);
    try {
      await uploadApi.cv(file);
      setCvUploaded(true);
      await refetchUser();
      toast.success('CV uploaded!');
      await analyzeCv();
    } catch {
      toast.error('CV upload failed — max 5 MB, PDF or Word (.docx) only');
    } finally { setUploadingCv(false); }
  }, [refetchUser, analyzeCv]);

  const handleCvChange = (e) => handleCvFile(e.target.files?.[0]);

  // Remove the stored CV. Curated skills stay on the profile (they're the source
  // of truth the student manages); only the file + parsed summary are cleared.
  const handleRemoveCv = useCallback(async () => {
    if (!window.confirm('Remove your CV? Your skills stay on your profile and you can upload a new CV anytime.')) return;
    setRemovingCv(true);
    try {
      await uploadApi.removeCv();
      setCvUploaded(false);
      await refetchUser();
      toast.success('CV removed');
    } catch {
      toast.error('Could not remove CV');
    } finally { setRemovingCv(false); }
  }, [refetchUser]);

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
      await profilesApi.updateStudent({ ...data, skills: selectedSkills, languages: selectedLanguages });
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
  // Use the backend-computed completion score (single source of truth) so the
  // Profile page and the Dashboard always agree.
  const pct         = profile?.completionScore ?? 0;

  // CV parse status, surfaced on the upload card so the student can see at a
  // glance whether the CV was actually read and what it produced. `method`
  // ('ai' | 'keyword') and the narrative blob come from the parse-cv endpoint.
  const cvAnalysed  = !!profile?.aiSummary;
  const cvMethod    = profile?.aiSummary?.method;        // 'ai' | 'keyword' | undefined
  const cvLangCount = profile?.languages?.length || 0;

  return (
    <div className="max-w-3xl space-y-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <CvViewerModal isOpen={cvViewerOpen} onClose={() => setCvViewerOpen(false)} url={cvViewerUrl} candidateName={displayName || undefined} />

      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      <input ref={cvInputRef}    type="file" accept=".pdf,.docx" className="hidden" onChange={handleCvChange} />

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
            <SelectField label="City / Location" labelIcon={MapPin} hint="Used for location matching" {...register('city')}>
              <option value="">Select your city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectField>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>Bio</label>
            <textarea rows={3} placeholder="Tell companies a bit about yourself…"
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
              {...register('bio')}
              onFocus={focusStyle()}
              onBlur={blurStyle()} />
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon={GraduationCap}>
          <Combobox label="University" options={UNIVERSITIES}
            value={watch('university') || ''}
            onChange={v => setValue('university', v, { shouldDirty: true })}
            placeholder="Pick from the list or type your own" />
          <Combobox label="Faculty" options={FACULTIES}
            value={watch('faculty') || ''}
            onChange={v => setValue('faculty', v, { shouldDirty: true })}
            placeholder="Pick from the list or type your own" />
          <Combobox label="Programme" options={PROGRAMMES}
            value={watch('programme') || ''}
            onChange={v => setValue('programme', v, { shouldDirty: true })}
            placeholder="Pick from the list or type your own" />
          <SelectField label="Year of Study" {...register('studyYear', { valueAsNumber: true })}>
            {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
          </SelectField>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={Code2}>
          <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9A9E97' }}>
            Your <span style={{ color: '#1E5B45', fontWeight: 600 }}>CV</span> fills in your skills and languages.
            Your <span style={{ fontWeight: 600, color: '#6B6F69' }}>programme, city, and study year</span> complete your match score.
          </p>
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

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F0F0EA' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6B6F69' }}>Languages</label>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#9A9E97' }}>
              Detected automatically from your CV — review and adjust if anything's missing or wrong.
              Companies score this separately from technical skills.
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_LIST.map(l => {
                const isSelected = selectedLanguages.includes(l);
                return (
                  <button type="button" key={l} onClick={() => toggleLanguage(l)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={isSelected
                      ? { background: '#B45309', color: '#fff', border: '1px solid #92400E' }
                      : { background: '#F6F5F1', color: '#6B6F69', border: '1px solid #E7E6DF' }}>
                    {l}
                  </button>
                );
              })}
            </div>
            {selectedLanguages.length === 0 && (
              <p className="text-xs mt-2" style={{ color: '#C0BFBA' }}>No languages detected yet — upload a CV or select them manually.</p>
            )}
          </div>
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
              {...register('linkedinUrl')}
              onFocus={focusStyle()}
              onBlur={blurStyle()}
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
              {...register('githubUrl')}
              onFocus={focusStyle()}
              onBlur={blurStyle()}
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
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1B1D1A' }}>
                    {displayName ? `${displayName} — CV.${cvExt}` : `Resume.${cvExt}`}
                  </p>
                  {cvAnalysed && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={cvMethod === 'keyword'
                        ? { background: '#FEF3E2', border: '1px solid #FAD8A8', color: '#B45309' }
                        : { background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                      {cvMethod === 'keyword' ? 'Keyword scan' : 'Analysed'}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                  {cvAnalysed
                    ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} · ${cvLangCount} language${cvLangCount !== 1 ? 's' : ''} detected`
                    : `${cvExt.toUpperCase()} uploaded · click "Re-analyze CV" to read it`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button type="button" onClick={() => cvInputRef.current?.click()} disabled={removingCv}
                  className="text-xs px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  style={{ color: '#6B6F69', border: '1px solid #DDDBD2', background: '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5B45'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                  Replace
                </button>
                <button type="button" onClick={handleRemoveCv} disabled={removingCv} title="Remove CV"
                  className="text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                  style={{ color: '#B91C1C', border: '1px solid #F3D2D2', background: '#fff' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#F3D2D2'; }}>
                  {removingCv ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Remove
                </button>
              </div>
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
                {uploadingCv ? 'Uploading…' : isDraggingCv ? 'Drop your file here' : 'Drag & drop your CV here'}
              </p>
              {!uploadingCv && (
                <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>
                  {isDraggingCv ? '' : 'or click to browse — '}PDF or Word (.docx), max 5 MB
                </p>
              )}
            </div>
          )}
          {cvUploaded && (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={handlePreviewCv}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1B1D1A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; }}>
                <Eye size={15} /> Preview CV
              </button>
              <button type="button" onClick={analyzeCv} disabled={analyzingCv}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                {analyzingCv ? <Loader2 size={15} className="animate-spin" /> : <Code2 size={15} />}
                {analyzingCv ? 'Analyzing…' : 'Re-analyze CV'}
              </button>
            </div>
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
              <SelectField
                bare
                value={prefs?.minMatchScore ?? 50}
                onChange={e => prefsMutation.mutate({ minMatchScore: Number(e.target.value) })}
                className="rounded-lg pl-3 pr-9 py-1.5 text-sm focus:outline-none appearance-none transition-colors cursor-pointer"
                style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
                chevronSize={14}
                chevronClassName="right-2.5"
                onFocus={e => e.target.style.borderColor = '#1E5B45'}
                onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                {[40, 50, 60, 70, 80].map(v => (
                  <option key={v} value={v}>{v}% or higher</option>
                ))}
              </SelectField>
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
