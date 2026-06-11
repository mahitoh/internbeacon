import { cn } from '../../lib/utils';

/**
 * The application journey line — Applied → Reviewing → Interview → Decision.
 * One consistent visual language for "where is this application?" used next
 * to (not instead of) the status badge across student, company, and admin views.
 */
const STAGES = ['Applied', 'Reviewing', 'Interview', 'Decision'];

// status → { stage: 0-3, outcome: 'pending' | 'ok' | 'bad' | 'void' }
const MAP = {
  submitted:           { stage: 0, outcome: 'pending' },
  pending:             { stage: 0, outcome: 'pending' },
  under_review:        { stage: 1, outcome: 'pending' },
  reviewing:           { stage: 1, outcome: 'pending' },
  shortlisted:         { stage: 1, outcome: 'pending' },
  interview_scheduled: { stage: 2, outcome: 'pending' },
  interview_completed: { stage: 2, outcome: 'pending' },
  final_review:        { stage: 3, outcome: 'pending' },
  accepted:            { stage: 3, outcome: 'ok' },
  offer_accepted:      { stage: 3, outcome: 'ok' },
  offer_declined:      { stage: 3, outcome: 'void' },
  rejected:            { stage: 3, outcome: 'bad' },
  withdrawn:           { stage: 0, outcome: 'void' },
};

export default function ApplicationJourney({ status, className }) {
  const cfg = MAP[status] || { stage: 0, outcome: 'pending' };
  const { stage, outcome } = cfg;
  const voided = outcome === 'void';

  const label = `Application stage: ${STAGES[stage]}${voided ? ' (closed)' : ''}`;

  return (
    <div
      className={cn('flex items-center', className)}
      role="img"
      aria-label={label}
      title={label}
    >
      {STAGES.map((name, i) => {
        const reached = i <= stage;
        const isCurrent = i === stage;
        const isDecision = i === 3;

        let dotCls = 'bg-line-strong';                      // unreached
        if (reached) dotCls = voided ? 'bg-ink-3' : 'bg-accent';
        if (isCurrent && !voided) dotCls = 'bg-accent ring-[3px] ring-accent-soft';
        if (isDecision && reached && outcome === 'ok')  dotCls = 'bg-ok ring-[3px] ring-ok-soft';
        if (isDecision && reached && outcome === 'bad') dotCls = 'bg-bad ring-[3px] ring-bad-soft';

        return (
          <div key={name} className="flex items-center">
            {i > 0 && (
              <span
                className={cn(
                  'h-px w-4',
                  i <= stage ? (voided ? 'bg-ink-3' : 'bg-accent') : 'bg-line-strong'
                )}
              />
            )}
            <span className={cn('w-1.5 h-1.5 rounded-full transition-colors duration-300', dotCls)} />
          </div>
        );
      })}
    </div>
  );
}
