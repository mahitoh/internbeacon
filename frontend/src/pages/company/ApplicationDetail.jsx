import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, FileText, MessageSquare, CheckCircle2, XCircle,
  Star, Calendar, Video, Phone, MapPin, ClipboardCheck, Eye, ChevronRight,
  ChevronDown, Search, Loader2, Save, Lock, Gauge,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ApplicationTimeline from '../../components/ui/ApplicationTimeline';
import api from '../../api/axios';
import { applicationsApi } from '../../api/applications';
import { uploadApi } from '../../api/upload';
import CvViewerModal from '../../components/ui/CvViewerModal';
import SelectField from '../../components/ui/SelectField';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const WORKFLOW = [
  { status: 'under_review',        label: 'Move to Review',      icon: Eye,          color: '#D97706', from: ['submitted'] },
  { status: 'shortlisted',         label: 'Shortlist Candidate',  icon: Star,         color: '#7C3AED', from: ['submitted', 'under_review'] },
  { status: 'interview_scheduled', label: 'Schedule Interview',   icon: Calendar,     color: '#4338CA', from: ['submitted', 'under_review', 'shortlisted'], hasForm: true },
  { status: 'interview_completed', label: 'Mark Interview Done',  icon: ClipboardCheck, color: '#6D28D9', from: ['interview_scheduled'] },
  { status: 'final_review',        label: 'Move to Final Review', icon: Search,       color: '#B45309', from: ['interview_completed', 'shortlisted'] },
  { status: 'accepted',            label: 'Accept',               icon: CheckCircle2, color: '#1E5B45', from: ['under_review', 'shortlisted', 'interview_completed', 'final_review'] },
  { status: 'rejected',            label: 'Reject',               icon: XCircle,      color: '#DC2626', from: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interview_completed', 'final_review'] },
];

// Role-based button styling: exactly one primary (the recommended next step),
// quiet neutral secondaries, and a clearly-separated danger action. Replaces the
// old per-status rainbow so the recruiter's eye lands on the obvious next move.
const ACTION_BTN = {
  primary: {
    base:   { background: '#1E5B45', border: '1px solid #1E5B45', color: '#fff' },
    active: { background: '#10342A', border: '1px solid #10342A', color: '#fff' },
  },
  neutral: {
    base:   { background: '#fff',    border: '1px solid #DDDBD2', color: '#6B6F69' },
    active: { background: '#1B1D1A', border: '1px solid #1B1D1A', color: '#fff' },
  },
  danger: {
    base:   { background: '#fff',    border: '1px solid #F0BDBA', color: '#C0463E' },
    active: { background: '#DC2626', border: '1px solid #DC2626', color: '#fff' },
  },
};

const INTERVIEW_TYPES = [
  { value: 'google_meet', label: 'Google Meet', icon: Video  },
  { value: 'zoom',        label: 'Zoom',         icon: Video  },
  { value: 'teams',       label: 'Microsoft Teams', icon: Video },
  { value: 'in_person',   label: 'In Person',    icon: MapPin },
  { value: 'phone',       label: 'Phone Call',   icon: Phone  },
];

const TYPE_LABELS = { in_person: 'In Person', google_meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', phone: 'Phone Call' };

const scoreColor = (s) => s >= 85 ? '#1E5B45' : s >= 70 ? '#B45309' : s >= 50 ? '#C2410C' : '#9A9E97';
const MATCH_FACTORS = [
  { key: 'skills',   label: 'Skills',         weight: 35, color: '#1E5B45' },
  { key: 'domain',   label: 'Programme',      weight: 30, color: '#6B9FD4' },
  { key: 'location', label: 'Location',       weight: 15, color: '#4EC0A0' },
  { key: 'level',    label: 'Academic level', weight: 15, color: '#9B7FD4' },
  { key: 'language', label: 'Language',       weight: 5,  color: '#D4A07F' },
];

const inputStyle = { background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none', colorScheme: 'light' };
const taStyle    = { ...inputStyle, resize: 'none' };

export default function ApplicationDetail() {
  const { appId }   = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();
  const qc          = useQueryClient();

  const [loading,          setLoading]          = useState('');
  const [cvLoading,        setCvLoading]        = useState(false);
  const [cvViewerOpen,     setCvViewerOpen]     = useState(false);
  const [cvViewerUrl,      setCvViewerUrl]      = useState('');
  const [showTimeline,     setShowTimeline]     = useState(false);
  const [companyNote,      setCompanyNote]      = useState('');
  const [internalNote,     setInternalNote]     = useState('');
  const [showNoteFor,      setShowNoteFor]      = useState(null);
  const [notesDraft,       setNotesDraft]       = useState({ internal: '', public: '' });
  const [notesInitialised, setNotesInitialised] = useState(false);
  const [notesSaving,      setNotesSaving]      = useState(false);
  const [interviewForm,    setInterviewForm]    = useState({ date: '', type: 'google_meet', location: '', link: '', notes: '' });

  const { data: app, isLoading } = useQuery({
    queryKey: ['application', appId],
    queryFn:  () => applicationsApi.getOne(appId).then(r => r.data.data),
  });

  // Algorithmic match breakdown for this candidate vs the offer they applied to.
  const { data: match } = useQuery({
    queryKey: ['applicant-match', appId],
    queryFn:  () => api.get(`/ai/match-applicant/${appId}`).then(r => r.data.data),
    enabled:  !!appId,
    staleTime: 5 * 60 * 1000,
  });

  // ── Prev/next review queue ────────────────────────────────────────────────
  // Preferred source: the exact ordered list the applicants table was showing,
  // passed via navigation state. Fallback (direct link / refresh): all of this
  // company's applications for the same offer, newest first.
  const queueFromState = location.state?.queue;
  const { data: companyApps } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll({ limit: 500 }).then(r => r.data.data),
    staleTime: 60_000,
    enabled:  !queueFromState?.length,
  });
  const queue = useMemo(() => {
    if (queueFromState?.length) return queueFromState;
    if (!companyApps || !app) return [];
    const offerId = app.offerId || app.offer?.id;
    return companyApps
      .filter(a => (a.offerId || a.offer?.id) === offerId)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .map(a => a.id);
  }, [queueFromState, companyApps, app]);

  const queueIdx = queue.indexOf(appId);
  const prevId   = queueIdx > 0 ? queue[queueIdx - 1] : null;
  const nextId   = queueIdx >= 0 && queueIdx < queue.length - 1 ? queue[queueIdx + 1] : null;
  const goToApp  = (id) => navigate(`/company/applications/${id}`, { state: { queue } });

  if (app && !notesInitialised) {
    setNotesDraft({ internal: app.internalNote || '', public: app.companyNote || '' });
    setNotesInitialised(true);
  }

  const viewCv = async () => {
    // Resolve the student's user id robustly — older/snapshot records can leave
    // app.student.userId empty, which would hit /cv-url/undefined and 403.
    const studentUserId = app.student?.userId || app.student?.user_id;
    if (!studentUserId) { toast.error("This candidate's account is unavailable, so their CV can't be opened."); return; }
    setCvLoading(true);
    try {
      const r = await uploadApi.getCvUrl(studentUserId, app.cvSnapshotUrl || undefined);
      setCvViewerUrl(r.data.data.url);
      setCvViewerOpen(true);
    } catch (err) {
      // Surface the backend's specific reason (e.g. "CV not found", "No shared
      // application") instead of a generic failure, so issues are diagnosable.
      toast.error(err?.response?.data?.message || 'Could not retrieve CV');
    } finally { setCvLoading(false); }
  };

  const saveNotes = async () => {
    setNotesSaving(true);
    try {
      await applicationsApi.patchNotes(appId, { internalNote: notesDraft.internal || null, companyNote: notesDraft.public || null });
      qc.invalidateQueries({ queryKey: ['application', appId] });
      toast.success('Notes saved');
    } catch { toast.error('Failed to save notes'); }
    finally { setNotesSaving(false); }
  };

  const handleAction = async (action) => {
    setLoading(action.status);
    try {
      const payload = { status: action.status, companyNote: companyNote || undefined, internalNote: internalNote || undefined };
      if (action.status === 'interview_scheduled') {
        if (!interviewForm.date) return toast.error('Please set an interview date');
        Object.assign(payload, {
          interviewDate:     interviewForm.date,
          interviewType:     interviewForm.type,
          interviewLocation: interviewForm.location || undefined,
          interviewLink:     interviewForm.link     || undefined,
          interviewNotes:    interviewForm.notes    || undefined,
        });
      }
      await applicationsApi.updateStatus(appId, payload);
      qc.invalidateQueries({ queryKey: ['application', appId] });
      qc.invalidateQueries({ queryKey: ['company-apps'] });
      qc.invalidateQueries({ queryKey: ['app-history', appId] });
      setCompanyNote(''); setInternalNote(''); setShowNoteFor(null); setNotesInitialised(false);
      toast.success(`Status updated to: ${action.label}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
    finally { setLoading(''); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!app)      return <p className="text-sm" style={{ color: '#9A9E97' }}>Application not found.</p>;

  const studentName     = [app.student?.firstName, app.student?.lastName].filter(Boolean).join(' ') || 'Candidate';
  const currentStatus   = app.status;
  const isTerminal      = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'].includes(currentStatus);
  const availableActions = WORKFLOW.filter(a => a.from.includes(currentStatus));
  // The recommended next step = first forward (non-reject) action by workflow order.
  const primaryStatus = availableActions.find(a => a.status !== 'rejected')?.status;

  return (
    <div className="max-w-3xl space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <CvViewerModal isOpen={cvViewerOpen} onClose={() => setCvViewerOpen(false)} url={cvViewerUrl} candidateName={studentName} />

      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate('/company/applications')}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#9A9E97' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
          onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
          <ArrowLeft size={16} /> Back to applications
        </button>

        {queue.length > 1 && queueIdx >= 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums mr-1" style={{ color: '#9A9E97' }}>{queueIdx + 1} of {queue.length}</span>
            <button onClick={() => prevId && goToApp(prevId)} disabled={!prevId}
              title="Previous candidate"
              className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
              style={{ border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { if (prevId) e.currentTarget.style.borderColor = '#1E5B45'; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
              <ArrowLeft size={14} />
            </button>
            <button onClick={() => nextId && goToApp(nextId)} disabled={!nextId}
              title="Next candidate"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30"
              style={{ border: '1px solid #DDDBD2', color: '#1E5B45' }}
              onMouseEnter={e => { if (nextId) e.currentTarget.style.borderColor = '#1E5B45'; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Candidate header */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {app.student?.avatarUrl
              ? <img src={app.student.avatarUrl} alt={studentName} className="w-14 h-14 rounded-full object-cover" style={{ boxShadow: '0 0 0 2px #E7E6DF' }} referrerPolicy="no-referrer" />
              : <Avatar name={studentName} size="lg" />}
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#1B1D1A' }}>{studentName}</h2>
              <p className="text-sm" style={{ color: '#6B6F69' }}>
                {app.student?.university}{app.student?.programme ? ` · ${app.student.programme}` : ''}
                {app.student?.studyYear ? ` · Year ${app.student.studyYear}` : ''}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#C0BFBA' }}>Applied {formatRelativeTime(app.appliedAt)}</p>
            </div>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {app.student?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {app.student.skills.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#6B6F69' }}>{s}</span>
            ))}
          </div>
        )}
        {app.student?.bio && (
          <p className="mt-4 text-sm leading-relaxed" style={{ color: '#6B6F69' }}>{app.student.bio}</p>
        )}
        <div className="flex gap-3 mt-4 flex-wrap items-center">
          {(app.cvSnapshotUrl || app.student?.cvUrl) && (
            <button onClick={viewCv} disabled={cvLoading}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all disabled:opacity-60"
              style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#DDDBD2'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E6DF'; }}>
              <div className="w-9 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                {cvLoading ? <Loader2 size={14} className="animate-spin" style={{ color: '#EF4444' }} /> : <FileText size={15} style={{ color: '#EF4444' }} />}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold leading-tight" style={{ color: '#1B1D1A' }}>{studentName} — CV</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#9A9E97' }}>
                  {app.cvSnapshotUrl
                    ? <span className="flex items-center gap-1"><Lock size={9} className="inline" /> Snapshot at application time</span>
                    : 'PDF · Click to preview'}
                </p>
              </div>
              <Eye size={12} style={{ color: '#9A9E97', marginLeft: 4 }} />
            </button>
          )}
          {app.student?.linkedinUrl && (
            <a href={app.student.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E5B45'; e.currentTarget.style.color = '#1E5B45'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDDBD2'; e.currentTarget.style.color = '#6B6F69'; }}>
              LinkedIn <ChevronRight size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Match analysis — the algorithmic fit, surfaced where the decision is made */}
      {match && (
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Gauge size={15} style={{ color: '#1E5B45' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Match analysis</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>Algorithmic</span>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black leading-none tabular-nums"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: scoreColor(match.score) }}>{match.score}%</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#9A9E97' }}>{match.verdict}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {MATCH_FACTORS.map(f => {
              const pct = Math.round((match.breakdown?.[f.key]?.score ?? 0) * 100);
              return (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#6B6F69' }}>
                      {f.label} <span style={{ color: '#C0BFBA' }}>· {f.weight}%</span>
                    </span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: '#1B1D1A' }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: f.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {(match.breakdown?.skills?.matched?.length > 0 || match.breakdown?.skills?.missing?.length > 0) && (
            <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: '1px solid #F0F0EA' }}>
              {match.breakdown.skills.matched?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide mr-1" style={{ color: '#9A9E97' }}>Matched</span>
                  {match.breakdown.skills.matched.map((s, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>{s}</span>
                  ))}
                </div>
              )}
              {match.breakdown.skills.missing?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide mr-1" style={{ color: '#9A9E97' }}>Missing</span>
                  {match.breakdown.skills.missing.map((s, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: '#FEF4EC', border: '1px solid #F0CFAE', color: '#C0703E' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Position */}
      <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <h3 className="font-semibold text-sm mb-2" style={{ color: '#1B1D1A' }}>Applied For</h3>
        <p style={{ color: '#6B6F69' }}>{app.offer?.title}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
          {app.offer?.location}{app.offer?.durationWeeks ? ` · ${app.offer.durationWeeks} weeks` : ''}
        </p>
      </div>

      {/* Cover letter */}
      {app.coverLetter && (
        <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Cover Letter</h3>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#6B6F69' }}>{app.coverLetter}</p>
        </div>
      )}

      {/* Recruiter notes */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Recruiter Notes</h3>
          <button onClick={saveNotes} disabled={notesSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
            style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}
            onMouseEnter={e => e.currentTarget.style.background = '#C4DBCE'}
            onMouseLeave={e => e.currentTarget.style.background = '#EDF2EE'}>
            {notesSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save Notes
          </button>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#D97706' }}>
            Internal note <span className="font-normal normal-case" style={{ color: '#C0BFBA' }}>(private — only your team sees this)</span>
          </label>
          <textarea rows={3} value={notesDraft.internal}
            onChange={e => setNotesDraft(d => ({ ...d, internal: e.target.value }))}
            placeholder="Strong React skills. Weak on databases. Good communication…"
            style={{ ...taStyle, borderColor: '#FDE68A', background: '#FFFBEB' }}
            onFocus={e => e.target.style.borderColor = '#F59E0B'}
            onBlur={e => e.target.style.borderColor = '#FDE68A'} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#1E5B45' }}>
            Note for candidate <span className="font-normal normal-case" style={{ color: '#C0BFBA' }}>(student will see this)</span>
          </label>
          <textarea rows={2} value={notesDraft.public}
            onChange={e => setNotesDraft(d => ({ ...d, public: e.target.value }))}
            placeholder="We were impressed with your profile and look forward to the next step…"
            style={{ ...taStyle, borderColor: '#C4DBCE', background: '#EDF2EE' }}
            onFocus={e => e.target.style.borderColor = '#1E5B45'}
            onBlur={e => e.target.style.borderColor = '#C4DBCE'} />
        </div>
      </div>

      {/* Interview details */}
      {['interview_scheduled', 'interview_completed'].includes(currentStatus) && app.interview?.date && (
        <div className="rounded-2xl p-5" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: '#4338CA' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#4338CA' }}>Interview Details</h3>
          </div>
          <div className="space-y-1.5 text-sm">
            <p style={{ color: '#4338CA' }}><span style={{ opacity: 0.6 }}>Date: </span>
              {new Date(app.interview.date).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
            {app.interview.type && <p style={{ color: '#4338CA' }}><span style={{ opacity: 0.6 }}>Format: </span>{TYPE_LABELS[app.interview.type] ?? app.interview.type}</p>}
            {app.interview.location && <p style={{ color: '#4338CA' }}><span style={{ opacity: 0.6 }}>Location: </span>{app.interview.location}</p>}
            {app.interview.link && <p><a href={app.interview.link} target="_blank" rel="noopener noreferrer" className="hover:underline break-all" style={{ color: '#4338CA' }}>{app.interview.link}</a></p>}
            {app.interview.notes && <p className="italic mt-1" style={{ color: '#6D28D9', opacity: 0.8 }}>"{app.interview.notes}"</p>}
          </div>
        </div>
      )}

      {/* Workflow actions */}
      {!isTerminal && availableActions.length > 0 && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Update Status</h3>

          {showNoteFor === 'interview_scheduled' && (
            <div className="space-y-3 p-4 rounded-xl" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4338CA' }}>Interview Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#6B6F69' }}>Date &amp; Time *</label>
                  <input type="datetime-local" value={interviewForm.date}
                    onChange={e => setInterviewForm(f => ({ ...f, date: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4338CA'}
                    onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#6B6F69' }}>Format</label>
                  <SelectField bare value={interviewForm.type} onChange={e => setInterviewForm(f => ({ ...f, type: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2.25rem', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#4338CA'}
                    onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                    {INTERVIEW_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </SelectField>
                </div>
              </div>
              {interviewForm.type === 'in_person' ? (
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#6B6F69' }}>Location</label>
                  <input value={interviewForm.location} onChange={e => setInterviewForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Office address or meeting room…" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4338CA'}
                    onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
                </div>
              ) : interviewForm.type !== 'phone' ? (
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#6B6F69' }}>Meeting Link</label>
                  <input value={interviewForm.link} onChange={e => setInterviewForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="https://meet.google.com/…" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4338CA'}
                    onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
                </div>
              ) : null}
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B6F69' }}>Instructions for candidate (optional)</label>
                <textarea rows={2} value={interviewForm.notes} onChange={e => setInterviewForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="What should the candidate prepare? Dress code? Documents to bring?"
                  style={taStyle}
                  onFocus={e => e.target.style.borderColor = '#4338CA'}
                  onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
              </div>
            </div>
          )}

          {showNoteFor && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#9A9E97' }}>
                  Internal note <span style={{ color: '#C0BFBA' }}>(private — only you see this)</span>
                </label>
                <textarea rows={2} value={internalNote} onChange={e => setInternalNote(e.target.value)}
                  placeholder="Strong React skills. Weak on databases…"
                  style={{ ...taStyle, borderColor: '#FDE68A', background: '#FFFBEB' }}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = '#FDE68A'} />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#9A9E97' }}>
                  Note for candidate <span style={{ color: '#C0BFBA' }}>(optional — student will see this)</span>
                </label>
                <textarea rows={2} value={companyNote} onChange={e => setCompanyNote(e.target.value)}
                  placeholder="We were impressed with your profile…"
                  style={{ ...taStyle, borderColor: '#C4DBCE', background: '#EDF2EE' }}
                  onFocus={e => e.target.style.borderColor = '#1E5B45'}
                  onBlur={e => e.target.style.borderColor = '#C4DBCE'} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {availableActions.map(action => {
              const isConfirming  = showNoteFor === action.status;
              const isLoadingThis = loading === action.status;
              const role = action.status === 'rejected' ? 'danger'
                : action.status === primaryStatus ? 'primary' : 'neutral';
              const st = ACTION_BTN[role][isConfirming ? 'active' : 'base'];
              return (
                <button key={action.status}
                  onClick={() => {
                    if (isConfirming) handleAction(action);
                    else { setShowNoteFor(action.status); setCompanyNote(''); }
                  }}
                  disabled={!!loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ ...st, ...(role === 'danger' ? { marginLeft: 'auto' } : {}) }}>
                  <action.icon size={14} />
                  {isLoadingThis ? 'Updating…' : isConfirming ? `Confirm ${action.label}` : action.label}
                </button>
              );
            })}
            {showNoteFor && (
              <button onClick={() => { setShowNoteFor(null); setCompanyNote(''); setInternalNote(''); }}
                className="px-4 py-2 rounded-xl text-sm transition-colors"
                style={{ border: '1px solid #DDDBD2', color: '#9A9E97' }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminal state */}
      {isTerminal && (() => {
        const map = {
          offer_accepted: { bg: '#EDF2EE', border: '#C4DBCE', text: '#1E5B45', msg: '✓ The student has accepted the offer — internship confirmed.' },
          accepted:       { bg: '#EDF2EE', border: '#C4DBCE', text: '#1E5B45', msg: '🎉 Offer sent — awaiting student response.' },
          rejected:       { bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626', msg: '✗ This application has not been selected.' },
          offer_declined: { bg: '#F6F5F1', border: '#E7E6DF', text: '#6B6F69', msg: '↩ The student has declined the offer.' },
          withdrawn:      { bg: '#F6F5F1', border: '#E7E6DF', text: '#6B6F69', msg: '↩ The student has withdrawn this application.' },
        };
        const s = map[currentStatus] || map.withdrawn;
        return (
          <div className="rounded-2xl p-4 text-sm font-medium" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
            {s.msg}
          </div>
        );
      })()}

      {/* Application Timeline */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <button onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between px-5 py-4 transition-colors"
          style={{ color: '#1B1D1A' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Application Timeline</h3>
          <ChevronDown size={14} className={`transition-transform ${showTimeline ? 'rotate-180' : ''}`} style={{ color: '#C0BFBA' }} />
        </button>
        {showTimeline && (
          <div className="px-5 pb-5 pt-4" style={{ borderTop: '1px solid #E7E6DF' }}>
            <ApplicationTimeline applicationId={appId} currentStatus={currentStatus} interview={app.interview} />
          </div>
        )}
      </div>

      <Button variant="outline" size="md" onClick={() => navigate(`/company/messages/${appId}`)}>
        <MessageSquare size={16} /> Open Chat with Candidate
      </Button>
    </div>
  );
}
