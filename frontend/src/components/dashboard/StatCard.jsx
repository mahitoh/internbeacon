import { cn } from '../../lib/utils';

const COLORS = {
  green:  { bg: '#EDF2EE', border: '#C4DBCE', icon: '#1E5B45', text: '#1E5B45' },
  blue:   { bg: '#EEF2FB', border: '#C4CFEB', icon: '#3B5FC0', text: '#3B5FC0' },
  orange: { bg: '#FEF4EC', border: '#F0CFAE', icon: '#C0703E', text: '#C0703E' },
  red:    { bg: '#FDEEED', border: '#F0BDBA', icon: '#C0463E', text: '#C0463E' },
  purple: { bg: '#F3EEFB', border: '#CFBDE8', icon: '#7C4EC0', text: '#7C4EC0' },
  indigo: { bg: '#EEF0FB', border: '#BEC4EB', icon: '#4C5EC0', text: '#4C5EC0' },
  lime:   { bg: '#EDF2EE', border: '#C4DBCE', icon: '#1E5B45', text: '#1E5B45' },
};

export default function StatCard({ label, value, change, icon: Icon, color = 'green', sub, loading = false }) {
  const c = COLORS[color] || COLORS.green;

  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{label}</p>
          {loading ? (
            <div className="mt-2 h-7 w-12 rounded-md animate-pulse" style={{ background: '#EFEEE8' }} />
          ) : (
            <p className="text-3xl font-bold mt-1" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#1B1D1A' }}>{value}</p>
          )}
          {sub && !loading && <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>{sub}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            <Icon size={18} style={{ color: c.icon }} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: change >= 0 ? '#1E5B45' : '#C0463E' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs" style={{ color: '#9A9E97' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
