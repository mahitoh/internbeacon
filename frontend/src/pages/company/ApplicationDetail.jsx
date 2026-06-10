import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, FileText, MessageSquare, CheckCircle2, XCircle,
  Star, Calendar, Video, Phone, MapPin, ClipboardCheck, Eye, ChevronRight,
  ChevronDown, Search, Loader2,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ApplicationTimeline from '../../components/ui/ApplicationTimeline';
import { applicationsApi } from '../../api/applications';
import { uploadApi } from '../../api/upload';
import CvViewerModal from '../../components/ui/CvViewerModal';
import { formatRelativeTime, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

// ── Workflow definition ───────────────────────────────────────────────────────
const WORKFLOW = [
  {
    status: 'under_review',
    label:  'Move to Review',
    icon:   Eye,
    color:  'yellow',
    from:   ['submitted'],
  },
  {
    status: 'shortlisted',
    label:  'Shortlist Candidate',
    icon:   Star,
    color:  'purple',
    from:   ['submitted', 'under_review'],
  },
  {
    status:  'interview_scheduled',
    label:   'Schedule Interview',
    icon:    Calendar,
    color:   'indigo',
    from:    ['submitted', 'under_review', 'shortlisted'],
    hasForm: true,
  },
  {
    status: 'interview_completed',
    label:  'Mark Interview Done',
    icon:   ClipboardCheck,
    color:  'violet',
    from:   ['interview_scheduled'],
  },
  {
    status: 'final_review',
    label:  'Move to Final Review',
    icon:   Search,
    color:  'orange',
    from:   ['interview_completed', 'shortlisted'],
  },
  {
    status: 'accepted',
    label:  'Accept',
    icon:   CheckCircle2,
    color:  'lime',
    from:   ['under_review', 'shortlisted', 'interview_completed', 'final_review'],
  },
  {
    status: 'rejected',
    label:  'Reject',
    icon:   XCircle,
    color:  'red',
    from:   ['submitted', 'under_review', 'shortlisted',
             'interview_scheduled', 'interview_completed', 'final_review'],
  },
];

const BTN_COLORS = {
  cyan:   'bg-cyan-500/15   hover:bg-cyan-500/25   border-cyan-500/30   text-cyan-300',
  yellow: 'bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/30 text-yellow-300',
  purple: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/30 text-purple-300',
  indigo: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-300',
  violet: 'bg-violet-500/15 hover:bg-violet-500/25 border-violet-500/30 text-violet-300',
  orange: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-300',
  lime:   'bg-lime-500/15   hover:bg-lime-500/25   border-lime-500/30   text-lime-300',
  red:    'bg-red-500/15    hover:bg-red-500/25    border-red-500/30    text-red-300',
};

const INTERVIEW_TYPES = [
  { value: 'google_meet',  label: 'Google Meet',      icon: Video },
  { value: 'zoom',         label: 'Zoom',             icon: Video },
  { value: 'teams',        label: 'Microsoft Teams',  icon: Video },
  { value: 'in_person',    label: 'In Person',        icon: MapPin },
  { value: 'phone',        label: 'Phone Call',       icon: Phone },
];

const TYPE_LABELS = {
  in_person:   'In Person',
  google_meet: 'Google Meet',
  zoom:        'Zoom',
  teams:       'Microsoft Teams',
  phone:       'Phone Call',
};

export default function ApplicationDetail() {
  const { appId }   = useParams();
  const navigate    = useNavigate();
  const qc          = useQueryClient();

  const [loading,        setLoading]        = useState('');
  const [cvLoading,      setCvLoading]      = useState(false);
  const [cvViewerOpen,   setCvViewerOpen]   = useState(false);
  const [cvViewerUrl,    setCvViewerUrl]    = useState('');
  const [showTimeline,   setShowTimeline]   = useState(false);
  const [companyNote,    setCompanyNote]    = useState('');
  const [internalNote,   setInternalNote]   = useState('');
  const [showNoteFor,    setShowNoteFor]    = useState(null);

  // Interview form state
  const [interviewForm, setInterviewForm] = useState({
    date: '', type: 'google_meet', location: '', link: '', notes: '',
  });

  const { data: app, isLoading } = useQuery({
    queryKey: ['application', appId],
    queryFn:  () => applicationsApi.getOne(appId).then(r => r.data.data),
  });

  const viewCv = async () => {
    setCvLoading(true);
    try {
      const r = await uploadApi.getCvUrl(app.student?.userId);
      setCvViewerUrl(r.data.data.url);
      setCvViewerOpen(true);
    } catch { toast.error('Could not retrieve CV'); }
    finally { setCvLoading(false); }
  };

  const handleAction = async (action) => {
    setLoading(action.status);
    try {
      const payload = {
        status:       action.status,
        companyNote:  companyNote  || undefined,
        internalNote: internalNote || undefined,
      };
      if (action.status === 'interview_scheduled') {
        if (!interviewForm.date)
          return toast.error('Please set an interview date');
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
      setCompanyNote('');
      setInternalNote('');
      setShowNoteFor(null);
      toast.success(`Status updated to: ${action.label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally { setLoading(''); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!app)      return <p className="text-white/40 text-sm">Application not found.</p>;

  const studentName  = [app.student?.firstName, app.student?.lastName].filter(Boolean).join(' ') || 'Candidate';
  const currentStatus = app.status;
  const isTerminal   = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'].includes(currentStatus);

  // Only show actions valid from the current status
  const availableActions = WORKFLOW.filter(a => a.from.includes(currentStatus));

  return (
    <div className="max-w-3xl space-y-5">
      <CvViewerModal
        isOpen={cvViewerOpen}
        onClose={() => setCvViewerOpen(false)}
        url={cvViewerUrl}
        candidateName={studentName}
      />

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to applications
      </button>

      {/* Candidate header */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {app.student?.avatarUrl
              ? <img src={app.student.avatarUrl} alt={studentName} className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
              : <Avatar name={studentName} size="lg" />}
            <div>
              <h2 className="text-xl font-bold text-white">{studentName}</h2>
              <p className="text-white/50 text-sm">
                {app.student?.university}{app.student?.programme ? ` · ${app.student.programme}` : ''}
                {app.student?.studyYear ? ` · Year ${app.student.studyYear}` : ''}
              </p>
              <p className="text-white/30 text-xs mt-0.5">Applied {formatRelativeTime(app.appliedAt)}</p>
            </div>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {app.student?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {app.student.skills.map(s => (
              <span key={s} className="px-2.5 py-1 bg-white/5 rounded-lg text-xs text-white/60 font-medium">{s}</span>
            ))}
          </div>
        )}
        {app.student?.bio && (
          <p className="mt-4 text-sm text-white/50 leading-relaxed">{app.student.bio}</p>
        )}
        <div className="flex gap-3 mt-4 flex-wrap items-center">
          {app.student?.cvUrl && (
            <button
              onClick={viewCv}
              disabled={cvLoading}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all group disabled:opacity-60"
            >
              <div className="w-9 h-10 rounded-lg bg-red-500/12 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                {cvLoading
                  ? <Loader2 size={14} className="text-red-400 animate-spin" />
                  : <FileText size={15} className="text-red-400" />}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">{studentName} — CV</p>
                <p className="text-[10px] text-white/30 mt-0.5">PDF · Click to preview</p>
              </div>
              <Eye size={12} className="text-white/20 group-hover:text-white/50 transition-colors ml-1" />
            </button>
          )}
          {app.student?.linkedinUrl && (
            <a href={app.student.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white transition-colors">
              LinkedIn <ChevronRight size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Position */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
        <h3 className="font-semibold text-white text-sm mb-2">Applied For</h3>
        <p className="text-white/70">{app.offer?.title}</p>
        <p className="text-white/40 text-xs mt-0.5">
          {app.offer?.location}{app.offer?.durationWeeks ? ` · ${app.offer.durationWeeks} weeks` : ''}
        </p>
      </div>

      {/* Cover letter */}
      {app.coverLetter && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Cover Letter</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
        </div>
      )}

      {/* Existing company note */}
      {app.companyNote && (
        <div className="bg-white/3 rounded-xl border border-white/8 p-4">
          <p className="text-xs text-white/30 mb-1">Note visible to student</p>
          <p className="text-sm text-white/70">{app.companyNote}</p>
        </div>
      )}

      {/* Interview details (shown when scheduled) */}
      {['interview_scheduled', 'interview_completed'].includes(currentStatus) && app.interview?.date && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-indigo-400" />
            <h3 className="font-semibold text-white text-sm">Interview Details</h3>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="text-white/60"><span className="text-white/30">Date: </span>
              {new Date(app.interview.date).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
            {app.interview.type && (
              <p className="text-white/60"><span className="text-white/30">Format: </span>
                {TYPE_LABELS[app.interview.type] ?? app.interview.type}
              </p>
            )}
            {app.interview.location && (
              <p className="text-white/60"><span className="text-white/30">Location: </span>{app.interview.location}</p>
            )}
            {app.interview.link && (
              <p><a href={app.interview.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">{app.interview.link}</a></p>
            )}
            {app.interview.notes && (
              <p className="text-white/50 italic mt-1">"{app.interview.notes}"</p>
            )}
          </div>
        </div>
      )}

      {/* ── Workflow actions ─────────────────────────────────────────────────── */}
      {!isTerminal && availableActions.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Update Status</h3>

          {/* Interview scheduling form */}
          {showNoteFor === 'interview_scheduled' && (
            <div className="space-y-3 p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">Interview Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    value={interviewForm.date}
                    onChange={e => setInterviewForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Format</label>
                  <select
                    value={interviewForm.type}
                    onChange={e => setInterviewForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none">
                    {INTERVIEW_TYPES.map(t => (
                      <option key={t.value} value={t.value} className="bg-[#1a1a1a]">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {interviewForm.type === 'in_person' ? (
                <div>
                  <label className="block text-xs text-white/40 mb-1">Location</label>
                  <input
                    value={interviewForm.location}
                    onChange={e => setInterviewForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Office address or meeting room…"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              ) : interviewForm.type !== 'phone' ? (
                <div>
                  <label className="block text-xs text-white/40 mb-1">Meeting Link</label>
                  <input
                    value={interviewForm.link}
                    onChange={e => setInterviewForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="https://meet.google.com/…"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              ) : null}
              <div>
                <label className="block text-xs text-white/40 mb-1">Instructions for candidate (optional)</label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={e => setInterviewForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="What should the candidate prepare? Dress code? Documents to bring?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* Notes fields */}
          {showNoteFor && showNoteFor !== null && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Internal note <span className="text-white/20">(private — only you see this)</span>
                </label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  placeholder="Strong React skills. Weak on databases. Consider for frontend role…"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  Note for candidate <span className="text-white/20">(optional — student will see this)</span>
                </label>
                <textarea
                  rows={2}
                  value={companyNote}
                  onChange={e => setCompanyNote(e.target.value)}
                  placeholder="We were impressed with your profile…"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-lime-500/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {availableActions.map(action => {
              const isConfirming = showNoteFor === action.status;
              const isLoading    = loading === action.status;
              const isDestructive = action.status === 'rejected';
              const isPrimary     = action.status === 'accepted';

              let cls;
              if (isDestructive) {
                cls = isConfirming
                  ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white'
                  : 'bg-red-500/15 hover:bg-red-500/30 border-red-500/40 text-red-300';
              } else if (isPrimary) {
                cls = isConfirming
                  ? 'bg-lime-500 hover:bg-lime-600 border-lime-500 text-white'
                  : 'bg-lime-500/15 hover:bg-lime-500/30 border-lime-500/40 text-lime-300';
              } else {
                cls = BTN_COLORS[action.color];
              }

              return (
                <button
                  key={action.status}
                  onClick={() => {
                    if (isConfirming) {
                      handleAction(action);
                    } else {
                      setShowNoteFor(action.status);
                      setCompanyNote('');
                    }
                  }}
                  disabled={!!loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 ${cls}`}
                >
                  <action.icon size={14} />
                  {isLoading ? 'Updating…' : isConfirming ? `Confirm ${action.label}` : action.label}
                </button>
              );
            })}
            {showNoteFor && (
              <button
                onClick={() => { setShowNoteFor(null); setCompanyNote(''); setInternalNote(''); }}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminal state */}
      {isTerminal && (
        <div className={`rounded-2xl border p-4 text-sm font-medium ${
          currentStatus === 'offer_accepted' ? 'bg-lime-500/15  border-lime-500/30  text-lime-300'  :
          currentStatus === 'accepted'       ? 'bg-lime-500/10  border-lime-500/20  text-lime-400'  :
          currentStatus === 'rejected'       ? 'bg-red-500/10   border-red-500/20   text-red-400'   :
          currentStatus === 'offer_declined' ? 'bg-gray-500/10  border-gray-500/20  text-gray-400'  :
                                               'bg-gray-500/10  border-gray-500/20  text-gray-400'
        }`}>
          {currentStatus === 'offer_accepted' && '✓ The student has accepted the offer — internship confirmed.'}
          {currentStatus === 'accepted'       && '🎉 Offer sent — awaiting student response.'}
          {currentStatus === 'rejected'       && '✗ This application has not been selected.'}
          {currentStatus === 'offer_declined' && '↩ The student has declined the offer.'}
          {currentStatus === 'withdrawn'      && '↩ The student has withdrawn this application.'}
        </div>
      )}

      {/* Existing internal note */}
      {app.internalNote && (
        <div className="bg-yellow-500/5 rounded-xl border border-yellow-500/15 p-4">
          <p className="text-xs text-yellow-400/60 mb-1 font-semibold uppercase tracking-wide">Internal Note</p>
          <p className="text-sm text-white/60">{app.internalNote}</p>
        </div>
      )}

      {/* Application Timeline (collapsible) */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors">
          <h3 className="font-semibold text-white text-sm">Application Timeline</h3>
          <ChevronDown size={14} className={`text-white/30 transition-transform ${showTimeline ? 'rotate-180' : ''}`} />
        </button>
        {showTimeline && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4">
            <ApplicationTimeline
              applicationId={appId}
              currentStatus={currentStatus}
              interview={app.interview}
            />
          </div>
        )}
      </div>

      <Button variant="outline" size="md" onClick={() => navigate(`/company/messages/${appId}`)}>
        <MessageSquare size={16} /> Open Chat with Candidate
      </Button>
    </div>
  );
}
