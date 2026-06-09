import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Circle, Clock, XCircle, Loader2 } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { formatDate, formatTime } from '../../lib/utils';

// Ordered steps in the normal happy-path
const PIPELINE = [
  { status: 'submitted',           label: 'Submitted' },
  { status: 'under_review',        label: 'Under Review' },
  { status: 'shortlisted',         label: 'Shortlisted' },
  { status: 'interview_scheduled', label: 'Interview Scheduled' },
  { status: 'interview_completed', label: 'Interview Completed' },
  { status: 'final_review',        label: 'Final Review' },
  { status: 'accepted',            label: 'Accepted' },
];

const STEP_COLORS = {
  submitted:            'text-blue-400   border-blue-500/30   bg-blue-500/10',
  under_review:         'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  shortlisted:          'text-purple-400 border-purple-500/30 bg-purple-500/10',
  interview_scheduled:  'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  interview_completed:  'text-violet-400 border-violet-500/30 bg-violet-500/10',
  final_review:         'text-orange-400 border-orange-500/30 bg-orange-500/10',
  accepted:             'text-lime-400   border-lime-500/30   bg-lime-500/10',
};

export default function ApplicationTimeline({ applicationId, currentStatus, interview }) {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['app-history', applicationId],
    queryFn:  () => applicationsApi.getHistory(applicationId).then(r => r.data.data),
    enabled:  !!applicationId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-white/30 text-sm">
        <Loader2 size={14} className="animate-spin" /> Loading timeline…
      </div>
    );
  }

  // Build a lookup: status → history entry (first occurrence)
  const historyMap = {};
  history.forEach(h => { if (!historyMap[h.status]) historyMap[h.status] = h; });

  const isRejected  = currentStatus === 'rejected';
  const isWithdrawn = currentStatus === 'withdrawn';
  const isTerminal  = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'].includes(currentStatus);

  // Find where rejection/withdrawal happened in the pipeline
  const rejectedAfterIndex = isRejected
    ? PIPELINE.findIndex(s => historyMap[s.status]) // last completed step index
    : -1;

  const lastCompletedIndex = PIPELINE.reduce((acc, s, i) => historyMap[s.status] ? i : acc, -1);

  return (
    <div className="space-y-0">
      {PIPELINE.map((step, index) => {
        const entry    = historyMap[step.status];
        const isDone   = !!entry;
        const isCurrent = step.status === currentStatus;
        const isFuture  = !isDone && !isCurrent;

        // For rejected: show X icon after the last completed step
        const showRejectedAfter = isRejected && index === lastCompletedIndex;
        const showWithdrawnAfter = isWithdrawn && index === lastCompletedIndex;

        return (
          <div key={step.status}>
            <div className="flex items-start gap-3">
              {/* Icon column */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone    ? STEP_COLORS[step.status] :
                  isCurrent ? 'text-lime-400 border-lime-500/50 bg-lime-500/10 animate-pulse' :
                               'text-white/15 border-white/10 bg-white/3'
                }`}>
                  {isDone    ? <CheckCircle2 size={13} className="flex-shrink-0" /> :
                   isCurrent ? <Clock size={12} className="flex-shrink-0" /> :
                                <Circle size={12} className="flex-shrink-0" />}
                </div>
                {/* Connector line */}
                {index < PIPELINE.length - 1 && (
                  <div className={`w-px flex-1 min-h-[20px] mt-1 ${isDone ? 'bg-white/20' : 'bg-white/5'}`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-4 flex-1 min-w-0 ${isFuture ? 'opacity-30' : ''}`}>
                <p className={`text-sm font-semibold leading-6 ${
                  isDone    ? 'text-white' :
                  isCurrent ? 'text-lime-400' :
                               'text-white/40'
                }`}>
                  {step.label}
                </p>
                {entry && (
                  <p className="text-xs text-white/30 mt-0.5">
                    {formatDate(entry.createdAt)}
                    {formatTime(entry.createdAt) ? ` · ${formatTime(entry.createdAt)}` : ''}
                  </p>
                )}
                {/* Interview details shown inline for interview_scheduled */}
                {step.status === 'interview_scheduled' && isDone && interview?.date && (
                  <div className="mt-2 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/15 space-y-1">
                    {interview.date && (
                      <p className="text-xs text-white/60">
                        <span className="text-white/30">Date: </span>
                        {new Date(interview.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    )}
                    {interview.type && (
                      <p className="text-xs text-white/60">
                        <span className="text-white/30">Format: </span>
                        {{ in_person: 'In Person', google_meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', phone: 'Phone Call' }[interview.type] || interview.type}
                      </p>
                    )}
                    {interview.location && (
                      <p className="text-xs text-white/60"><span className="text-white/30">Location: </span>{interview.location}</p>
                    )}
                    {interview.link && (
                      <p className="text-xs">
                        <a href={interview.link} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 underline break-all">
                          {interview.link}
                        </a>
                      </p>
                    )}
                    {interview.notes && (
                      <p className="text-xs text-white/50 mt-1 italic">"{interview.notes}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rejection / Withdrawal marker — inserted after last completed step */}
            {(showRejectedAfter || showWithdrawnAfter) && (
              <div className="flex items-start gap-3 ml-0">
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    showRejectedAfter ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-gray-400 border-gray-500/30 bg-gray-500/10'
                  }`}>
                    <XCircle size={13} />
                  </div>
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-6 ${showRejectedAfter ? 'text-red-400' : 'text-gray-400'}`}>
                    {showRejectedAfter ? 'Not Selected' : 'Withdrawn'}
                  </p>
                  {historyMap[currentStatus] && (
                    <p className="text-xs text-white/30 mt-0.5">
                      {formatDate(historyMap[currentStatus].createdAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Accepted — waiting for student response */}
      {currentStatus === 'accepted' && (
        <div className="mt-2 p-3 rounded-xl bg-lime-500/5 border border-lime-500/20">
          <p className="text-xs text-lime-400 font-semibold">🎉 Accepted — awaiting your response</p>
        </div>
      )}

      {/* Offer accepted terminal */}
      {currentStatus === 'offer_accepted' && (
        <div className="mt-2 p-3 rounded-xl bg-lime-500/10 border border-lime-500/30">
          <p className="text-xs text-lime-300 font-semibold">✓ Offer accepted — internship confirmed</p>
        </div>
      )}

      {/* Offer declined terminal */}
      {currentStatus === 'offer_declined' && (
        <div className="mt-2 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
          <p className="text-xs text-gray-400 font-semibold">↩ Offer declined</p>
        </div>
      )}
    </div>
  );
}
