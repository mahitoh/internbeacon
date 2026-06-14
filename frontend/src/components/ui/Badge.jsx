import { cn } from '../../lib/utils';

const STATUS = {
  submitted:            { label: 'Submitted',           bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  under_review:         { label: 'Under Review',        bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  shortlisted:          { label: 'Shortlisted',         bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  interview_scheduled:  { label: 'Interview Scheduled', bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  interview_completed:  { label: 'Interview Done',      bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  final_review:         { label: 'Final Review',        bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  accepted:             { label: 'Accepted',            bg: '#EDF2EE', text: '#1E5B45', border: '#C4DBCE' },
  offer_accepted:       { label: 'Offer Accepted',      bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  offer_declined:       { label: 'Offer Declined',      bg: '#F6F5F1', text: '#6B6F69', border: '#E7E6DF' },
  rejected:             { label: 'Not Selected',        bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  withdrawn:            { label: 'Withdrawn',           bg: '#F6F5F1', text: '#6B6F69', border: '#E7E6DF' },
  pending:              { label: 'Submitted',           bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  reviewing:            { label: 'Under Review',        bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  open:                 { label: 'Open',                bg: '#EDF2EE', text: '#1E5B45', border: '#C4DBCE' },
  closed:               { label: 'Closed',              bg: '#F6F5F1', text: '#6B6F69', border: '#E7E6DF' },
  draft:                { label: 'Draft',               bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
};

export function StatusBadge({ status, className }) {
  const cfg = STATUS[status] || { label: status, bg: '#F6F5F1', text: '#6B6F69', border: '#E7E6DF' };
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap', className)}
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0" style={{ background: cfg.text, opacity: 0.7 }} />
      {cfg.label}
    </span>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: { bg: '#F6F5F1', text: '#6B6F69' },
    green:   { bg: '#EDF2EE', text: '#1E5B45' },
    blue:    { bg: '#DBEAFE', text: '#1E40AF' },
    red:     { bg: '#FEE2E2', text: '#991B1B' },
  };
  const v = variants[variant] || variants.default;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium', className)}
      style={{ background: v.bg, color: v.text }}>
      {children}
    </span>
  );
}

export default StatusBadge;
