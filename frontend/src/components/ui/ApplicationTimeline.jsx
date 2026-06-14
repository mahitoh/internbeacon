import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle, Clock, XCircle, Loader2 } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { formatDate, formatTime } from '../../lib/utils';

const PIPELINE = [
  { status: 'submitted',           label: 'Submitted' },
  { status: 'under_review',        label: 'Under Review' },
  { status: 'shortlisted',         label: 'Shortlisted' },
  { status: 'interview_scheduled', label: 'Interview Scheduled' },
  { status: 'interview_completed', label: 'Interview Completed' },
  { status: 'final_review',        label: 'Final Review' },
  { status: 'accepted',            label: 'Accepted' },
];

const STEP_STYLES = {
  submitted:            { bg: '#DBEAFE', border: '#BFDBFE', icon: '#1E40AF' },
  under_review:         { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706' },
  shortlisted:          { bg: '#EDE9FE', border: '#DDD6FE', icon: '#6D28D9' },
  interview_scheduled:  { bg: '#EEF2FF', border: '#C7D2FE', icon: '#4338CA' },
  interview_completed:  { bg: '#F5F3FF', border: '#DDD6FE', icon: '#5B21B6' },
  final_review:         { bg: '#FFF7ED', border: '#FED7AA', icon: '#C2410C' },
  accepted:             { bg: '#EDF2EE', border: '#C4DBCE', icon: '#1E5B45' },
};

const TYPE_LABELS = { in_person: 'In Person', google_meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', phone: 'Phone Call' };

export default function ApplicationTimeline({ applicationId, currentStatus, interview }) {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['app-history', applicationId],
    queryFn:  () => applicationsApi.getHistory(applicationId).then(r => r.data.data),
    enabled:  !!applicationId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm" style={{ color: '#9A9E97' }}>
        <Loader2 size={14} className="animate-spin" /> Loading timeline…
      </div>
    );
  }

  const historyMap = {};
  history.forEach(h => { if (!historyMap[h.status]) historyMap[h.status] = h; });

  const isRejected  = currentStatus === 'rejected';
  const isWithdrawn = currentStatus === 'withdrawn';
  const lastCompletedIndex = PIPELINE.reduce((acc, s, i) => historyMap[s.status] ? i : acc, -1);

  return (
    <div className="space-y-0">
      {PIPELINE.map((step, index) => {
        const entry     = historyMap[step.status];
        const isDone    = !!entry;
        const isCurrent = step.status === currentStatus;
        const isFuture  = !isDone && !isCurrent;
        const style     = STEP_STYLES[step.status];

        const showRejectedAfter  = isRejected  && index === lastCompletedIndex;
        const showWithdrawnAfter = isWithdrawn && index === lastCompletedIndex;

        return (
          <div key={step.status}>
            <div className="flex items-start gap-3">
              {/* Icon column */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
                <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all"
                  style={isDone
                    ? { background: style.bg, borderColor: style.border, color: style.icon }
                    : isCurrent
                      ? { background: '#EDF2EE', borderColor: '#C4DBCE', color: '#1E5B45' }
                      : { background: '#F6F5F1', borderColor: '#E7E6DF', color: '#DDDBD2' }}>
                  {isDone    ? <CheckCircle2 size={13} className="flex-shrink-0" /> :
                   isCurrent ? <Clock size={12} className="flex-shrink-0" /> :
                                <Circle size={12} className="flex-shrink-0" />}
                </div>
                {index < PIPELINE.length - 1 && (
                  <div className="w-px flex-1 min-h-[20px] mt-1"
                    style={{ background: isDone ? '#DDDBD2' : '#F0F0EA' }} />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1 min-w-0" style={{ opacity: isFuture ? 0.35 : 1 }}>
                <p className="text-sm font-semibold leading-6"
                  style={{ color: isDone ? '#1B1D1A' : isCurrent ? '#1E5B45' : '#9A9E97' }}>
                  {step.label}
                </p>
                {entry && (
                  <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                    {formatDate(entry.createdAt)}
                    {formatTime(entry.createdAt) ? ` · ${formatTime(entry.createdAt)}` : ''}
                  </p>
                )}

                {step.status === 'interview_scheduled' && isDone && interview?.date && (
                  <div className="mt-2 p-3 rounded-lg space-y-1"
                    style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                    <p className="text-xs" style={{ color: '#4338CA' }}>
                      <span style={{ opacity: 0.6 }}>Date: </span>
                      {new Date(interview.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {interview.type && (
                      <p className="text-xs" style={{ color: '#4338CA' }}>
                        <span style={{ opacity: 0.6 }}>Format: </span>
                        {TYPE_LABELS[interview.type] || interview.type}
                      </p>
                    )}
                    {interview.location && (
                      <p className="text-xs" style={{ color: '#4338CA' }}>
                        <span style={{ opacity: 0.6 }}>Location: </span>{interview.location}
                      </p>
                    )}
                    {interview.link && (
                      <p className="text-xs">
                        <a href={interview.link} target="_blank" rel="noopener noreferrer"
                          className="hover:underline break-all" style={{ color: '#4338CA' }}>
                          {interview.link}
                        </a>
                      </p>
                    )}
                    {interview.notes && (
                      <p className="text-xs mt-1 italic" style={{ color: '#6D28D9' }}>"{interview.notes}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(showRejectedAfter || showWithdrawnAfter) && (
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
                  <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0"
                    style={showRejectedAfter
                      ? { background: '#FEE2E2', borderColor: '#FCA5A5', color: '#DC2626' }
                      : { background: '#F6F5F1', borderColor: '#E7E6DF', color: '#6B6F69' }}>
                    <XCircle size={13} />
                  </div>
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-6"
                    style={{ color: showRejectedAfter ? '#DC2626' : '#6B6F69' }}>
                    {showRejectedAfter ? 'Not Selected' : 'Withdrawn'}
                  </p>
                  {historyMap[currentStatus] && (
                    <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                      {formatDate(historyMap[currentStatus].createdAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {currentStatus === 'accepted' && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
          <p className="text-xs font-semibold" style={{ color: '#1E5B45' }}>🎉 Accepted — awaiting student response</p>
        </div>
      )}
      {currentStatus === 'offer_accepted' && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
          <p className="text-xs font-semibold" style={{ color: '#065F46' }}>✓ Offer accepted — internship confirmed</p>
        </div>
      )}
      {currentStatus === 'offer_declined' && (
        <div className="mt-2 p-3 rounded-xl" style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
          <p className="text-xs font-semibold" style={{ color: '#6B6F69' }}>↩ Offer declined</p>
        </div>
      )}
    </div>
  );
}
