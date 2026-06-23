import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Video, Phone, MessageSquare, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import { externalHref } from '../../lib/url';

const TYPE_META = {
  google_meet: { label: 'Google Meet',     icon: Video,  color: '#3B82F6' },
  zoom:        { label: 'Zoom',            icon: Video,  color: '#3B82F6' },
  teams:       { label: 'Microsoft Teams', icon: Video,  color: '#6366F1' },
  in_person:   { label: 'In Person',       icon: MapPin, color: '#1E5B45' },
  phone:       { label: 'Phone Call',      icon: Phone,  color: '#D97706' },
};

function InterviewCard({ app, isPast }) {
  const { interview, offer } = app;
  const interviewDate = new Date(interview.date);
  const typeMeta = TYPE_META[interview.type] || { label: interview.type, icon: Calendar, color: '#9A9E97' };
  const Icon = typeMeta.icon;

  const daysUntil = Math.ceil((interviewDate - Date.now()) / 86400000);
  let urgencyLabel, urgencyStyle;
  if (isPast)            { urgencyLabel = 'Completed';              urgencyStyle = { background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#9A9E97' }; }
  else if (daysUntil === 0) { urgencyLabel = 'Today';              urgencyStyle = { background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }; }
  else if (daysUntil === 1) { urgencyLabel = 'Tomorrow';           urgencyStyle = { background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }; }
  else if (daysUntil <= 7)  { urgencyLabel = `In ${daysUntil} days`; urgencyStyle = { background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3' }; }
  else                      { urgencyLabel = formatDate(interview.date); urgencyStyle = { background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#6B6F69' }; }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: '#fff',
        border: `1px solid ${isPast ? '#E7E6DF' : '#C7D2FE'}`,
        opacity: isPast ? 0.8 : 1,
      }}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} style={{ color: '#9A9E97' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>{offer?.title}</h3>
          </div>
          <p className="text-xs" style={{ color: '#9A9E97' }}>{offer?.company?.companyName}</p>
        </div>
        <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={urgencyStyle}>
          {urgencyLabel}
        </span>
      </div>

      {/* Date + time */}
      <div className="flex items-center gap-2 text-sm">
        <Calendar size={14} style={{ color: '#6366F1', flexShrink: 0 }} />
        <span style={{ color: '#1B1D1A' }}>
          {interviewDate.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span style={{ color: '#9A9E97' }}>at</span>
        <span className="font-semibold" style={{ color: '#1B1D1A' }}>
          {interviewDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Format */}
      <div className="flex items-center gap-2 text-sm">
        <Icon size={14} style={{ color: typeMeta.color, flexShrink: 0 }} />
        <span style={{ color: '#6B6F69' }}>{typeMeta.label}</span>
        {interview.location && <span style={{ color: '#9A9E97' }}>— {interview.location}</span>}
      </div>

      {/* Join link */}
      {interview.link && (
        <a href={externalHref(interview.link)} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}>
          <Video size={13} />
          Join Interview
        </a>
      )}

      {/* Notes */}
      {interview.notes && (
        <div className="p-3 rounded-xl" style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9A9E97' }}>Instructions</p>
          <p className="text-xs leading-relaxed" style={{ color: '#6B6F69' }}>{interview.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Link to={`/student/messages/${app.id}`}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: '#6B6F69', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1E5B45'}
          onMouseLeave={e => e.currentTarget.style.color = '#6B6F69'}>
          <MessageSquare size={12} /> Message recruiter
        </Link>
        <Link to="/student/applications"
          className="flex items-center gap-1.5 text-xs transition-colors ml-auto"
          style={{ color: '#9A9E97', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
          onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
          View application →
        </Link>
      </div>
    </motion.div>
  );
}

export default function StudentInterviewCenter() {
  const { data: rawApps, isLoading } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my({ limit: 100 }).then(r => r.data.data),
  });

  const apps = rawApps || [];
  const interviewApps = apps.filter(a =>
    ['interview_scheduled', 'interview_completed'].includes(a.status) && a.interview?.date
  );

  const now = Date.now();
  const upcoming = interviewApps
    .filter(a => a.status === 'interview_scheduled' && new Date(a.interview.date) >= now)
    .sort((a, b) => new Date(a.interview.date) - new Date(b.interview.date));

  const past = interviewApps
    .filter(a => a.status === 'interview_completed' || new Date(a.interview.date) < now)
    .sort((a, b) => new Date(b.interview.date) - new Date(a.interview.date));

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-2xl" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Interview Center</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
          All your scheduled and completed interviews in one place
        </p>
      </div>

      {interviewApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
          <Calendar size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No interviews yet</p>
          <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>
            When a company schedules an interview, it'll appear here
          </p>
          <Link to="/student/applications" className="mt-4 text-xs font-semibold" style={{ color: '#1E5B45' }}>
            View applications →
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} style={{ color: '#6366F1' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>
                  Upcoming ({upcoming.length})
                </h3>
              </div>
              {upcoming.map((app, i) => (
                <motion.div key={app.id} transition={{ delay: i * 0.05 }}>
                  <InterviewCard app={app} isPast={false} />
                </motion.div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} style={{ color: '#9A9E97' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#9A9E97' }}>
                  Completed ({past.length})
                </h3>
              </div>
              {past.map((app, i) => (
                <motion.div key={app.id} transition={{ delay: i * 0.05 }}>
                  <InterviewCard app={app} isPast />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
