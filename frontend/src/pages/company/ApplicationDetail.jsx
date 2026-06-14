import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, FileText, MessageSquare, CheckCircle2, XCircle,
  Star, Calendar, Video, Phone, MapPin, ClipboardCheck, Eye, ChevronRight,
  ChevronDown, Search, Loader2, Save, Lock,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ApplicationTimeline from '../../components/ui/ApplicationTimeline';
import { applicationsApi } from '../../api/applications';
import { uploadApi } from '../../api/upload';
import CvViewerModal from '../../components/ui/CvViewerModal';
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

const BTN_STYLES = {
  '#D97706': { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', activeBg: '#F59E0B', activeText: '#fff' },
  '#7C3AED': { bg: '#EDE9FE', border: '#DDD6FE', text: '#7C3AED', activeBg: '#7C3AED', activeText: '#fff' },
  '#4338CA': { bg: '#EEF2FF', border: '#C7D2FE', text: '#4338CA', activeBg: '#4338CA', activeText: '#fff' },
  '#6D28D9': { bg: '#EDE9FE', border: '#DDD6FE', text: '#6D28D9', activeBg: '#6D28D9', activeText: '#fff' },
  '#B45309': { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', activeBg: '#B45309', activeText: '#fff' },
  '#1E5B45': { bg: '#EDF2EE', border: '#C4DBCE', text: '#1E5B45', activeBg: '#1E5B45', activeText: '#fff' },
  '#DC2626': { bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626', activeBg: '#DC2626', activeText: '#fff' },
};

const INTERVIEW_TYPES = [
  { value: 'google_meet', label: 'Google Meet', icon: Video  },
  { value: 'zoom',        label: 'Zoom',         icon: Video  },
  { value: 'teams',       label: 'Microsoft Teams', icon: Video },
  { value: 'in_person',   label: 'In Person',    icon: MapPin },
  { value: 'phone',       label: 'Phone Call',   icon: Phone  },
];

const TYPE_LABELS = { in_person: 'In Person', google_meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', phone: 'Phone Call' };

const inputStyle = { background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none' };
const taStyle    = { ...inputStyle, resize: 'none' };

export default function ApplicationDetail() {
  const { appId }   = useParams();
  const navigate    = useNavigate();
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

  if (app && !notesInitialised) {
    setNotesDraft({ internal: app.internalNote || '', public: app.companyNote || '' });
    setNotesInitialised(true);
  }

  const viewCv = async () => {
    setCvLoading(true);
    try {
      const r = await uploadApi.getCvUrl(app.student?.userId, app.cvSnapshotUrl || undefined);
      setCvViewerUrl(r.data.data.url);
      setCvViewerOpen(true);
    } catch { toast.error('Could not retrieve CV'); }
    finally { setCvLoading(false); }
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

  return (
    <div className="max-w-3xl space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <CvViewerModal isOpen={cvViewerOpen} onClose={() => setCvViewerOpen(false)} url={cvViewerUrl} candidateName={studentName} />

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm transition-colors"
        style={{ color: '#9A9E97' }}
        onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
        <ArrowLeft size={16} /> Back to applications
      </button>

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
                  <select value={interviewForm.type} onChange={e => setInterviewForm(f => ({ ...f, type: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#4338CA'}
                    onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                    {INTERVIEW_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
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

          <div className="flex flex-wrap gap-2">
            {availableActions.map(action => {
              const isConfirming  = showNoteFor === action.status;
              const isLoadingThis = loading === action.status;
              const styles        = BTN_STYLES[action.color];
              return (
                <button key={action.status}
                  onClick={() => {
                    if (isConfirming) handleAction(action);
                    else { setShowNoteFor(action.status); setCompanyNote(''); }
                  }}
                  disabled={!!loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                  style={isConfirming
                    ? { background: styles.activeBg, border: `1px solid ${styles.activeBg}`, color: styles.activeText }
                    : { background: styles.bg, border: `1px solid ${styles.border}`, color: styles.text }}>
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
