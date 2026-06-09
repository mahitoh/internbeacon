import { cn } from '../../lib/utils';

const STATUS = {
  // ── Application statuses ──────────────────────────────────────────────────
  submitted:            { label: 'Submitted',           cls: 'bg-blue-500/10    text-blue-400    border-blue-500/20' },
  under_review:         { label: 'Under Review',        cls: 'bg-yellow-500/10  text-yellow-400  border-yellow-500/20' },
  shortlisted:          { label: 'Shortlisted',         cls: 'bg-purple-500/10  text-purple-400  border-purple-500/20' },
  interview_scheduled:  { label: 'Interview Scheduled', cls: 'bg-indigo-500/10  text-indigo-400  border-indigo-500/20' },
  interview_completed:  { label: 'Interview Done',      cls: 'bg-violet-500/10  text-violet-400  border-violet-500/20' },
  final_review:         { label: 'Final Review',        cls: 'bg-orange-500/10  text-orange-400  border-orange-500/20' },
  accepted:             { label: 'Accepted',            cls: 'bg-lime-500/10    text-lime-400    border-lime-500/20' },
  offer_accepted:       { label: 'Offer Accepted',      cls: 'bg-lime-500/20    text-lime-300    border-lime-500/30' },
  offer_declined:       { label: 'Offer Declined',      cls: 'bg-gray-500/10    text-gray-400    border-gray-500/20' },
  rejected:             { label: 'Not Selected',        cls: 'bg-red-500/10     text-red-400     border-red-500/20' },
  withdrawn:            { label: 'Withdrawn',           cls: 'bg-gray-500/10    text-gray-400    border-gray-500/20' },
  // ── Legacy (backward compat with any pre-migration data) ──────────────────
  pending:              { label: 'Submitted',           cls: 'bg-blue-500/10    text-blue-400    border-blue-500/20' },
  reviewing:            { label: 'Under Review',        cls: 'bg-yellow-500/10  text-yellow-400  border-yellow-500/20' },
  // ── Offer statuses ────────────────────────────────────────────────────────
  open:                 { label: 'Open',                cls: 'bg-lime-500/10    text-lime-400    border-lime-500/20' },
  closed:               { label: 'Closed',              cls: 'bg-gray-500/10    text-gray-400    border-gray-500/20' },
  draft:                { label: 'Draft',               cls: 'bg-orange-500/10  text-orange-400  border-orange-500/20' },
};

export function StatusBadge({ status, className }) {
  const cfg = STATUS[status] || { label: status, cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
      cfg.cls, className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {cfg.label}
    </span>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    green:   'bg-lime-100 text-lime-700',
    blue:    'bg-blue-100 text-blue-700',
    red:     'bg-red-100  text-red-700',
  };
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium',
      variants[variant], className
    )}>
      {children}
    </span>
  );
}

export default StatusBadge;
