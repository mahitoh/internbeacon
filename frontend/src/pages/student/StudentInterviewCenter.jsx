import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';

const TYPE_META = {
  google_meet: { label: 'Google Meet',     icon: Video,  color: 'text-blue-400' },
  zoom:        { label: 'Zoom',            icon: Video,  color: 'text-blue-400' },
  teams:       { label: 'Microsoft Teams', icon: Video,  color: 'text-indigo-400' },
  in_person:   { label: 'In Person',       icon: MapPin, color: 'text-lime-400' },
  phone:       { label: 'Phone Call',      icon: Phone,  color: 'text-yellow-400' },
};

function InterviewCard({ app, isPast }) {
  const { interview, offer } = app;
  const interviewDate = new Date(interview.date);
  const typeMeta = TYPE_META[interview.type] || { label: interview.type, icon: Calendar, color: 'text-white/40' };
  const Icon = typeMeta.icon;

  const daysUntil = Math.ceil((interviewDate - Date.now()) / 86400000);
  let urgencyLabel, urgencyCls;
  if (isPast) {
    urgencyLabel = 'Completed';
    urgencyCls   = 'text-white/30 bg-white/5 border-white/10';
  } else if (daysUntil === 0) {
    urgencyLabel = 'Today';
    urgencyCls   = 'text-lime-300 bg-lime-500/15 border-lime-500/30';
  } else if (daysUntil === 1) {
    urgencyLabel = 'Tomorrow';
    urgencyCls   = 'text-amber-300 bg-amber-500/12 border-amber-500/25';
  } else if (daysUntil <= 7) {
    urgencyLabel = `In ${daysUntil} days`;
    urgencyCls   = 'text-indigo-300 bg-indigo-500/12 border-indigo-500/25';
  } else {
    urgencyLabel = formatDate(interview.date);
    urgencyCls   = 'text-white/40 bg-white/5 border-white/10';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1a1a1a] rounded-2xl border p-5 space-y-4 ${isPast ? 'border-white/5 opacity-70' : 'border-indigo-500/20'}`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-white/30" />
            <h3 className="text-white font-semibold text-sm">{offer?.title}</h3>
          </div>
          <p className="text-white/40 text-xs">{offer?.company?.companyName}</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${urgencyCls}`}>
          {urgencyLabel}
        </span>
      </div>

      {/* Date + time */}
      <div className="flex items-center gap-2 text-sm">
        <Calendar size={14} className="text-indigo-400 flex-shrink-0" />
        <span className="text-white/80">
          {interviewDate.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span className="text-white/40">at</span>
        <span className="text-white/80 font-semibold">
          {interviewDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Format */}
      <div className="flex items-center gap-2 text-sm">
        <Icon size={14} className={`${typeMeta.color} flex-shrink-0`} />
        <span className="text-white/60">{typeMeta.label}</span>
        {interview.location && <span className="text-white/30">— {interview.location}</span>}
      </div>

      {/* Link */}
      {interview.link && (
        <a
          href={interview.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 transition-colors text-sm text-indigo-400 hover:text-indigo-300">
          <Video size={13} />
          Join Interview
        </a>
      )}

      {/* Notes */}
      {interview.notes && (
        <div className="p-3 rounded-xl bg-white/3 border border-white/8">
          <p className="text-xs text-white/30 mb-1 font-semibold uppercase tracking-wide">Instructions</p>
          <p className="text-xs text-white/50 leading-relaxed">{interview.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Link
          to={`/student/messages/${app.id}`}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-lime-400 transition-colors">
          <MessageSquare size={12} /> Message recruiter
        </Link>
        <Link
          to="/student/applications"
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors ml-auto">
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-white">Interview Center</h2>
        <p className="text-white/40 text-sm mt-0.5">All your scheduled and completed interviews in one place</p>
      </div>

      {interviewApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/30 bg-[#1a1a1a] rounded-2xl border border-white/5">
          <Calendar size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No interviews yet</p>
          <p className="text-xs mt-1">When a company schedules an interview, it'll appear here</p>
          <Link to="/student/applications" className="mt-4 text-lime-400 text-xs hover:underline">
            View applications →
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Upcoming ({upcoming.length})</h3>
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
                <CheckCircle2 size={14} className="text-white/30" />
                <h3 className="text-sm font-semibold text-white/50">Completed ({past.length})</h3>
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
