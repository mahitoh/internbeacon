import { cn } from '../../lib/utils';

export default function StatCard({ label, value, change, icon: Icon, color = 'lime', sub }) {
  const colors = {
    lime:   'text-lime-400   bg-lime-400/10',
    blue:   'text-blue-400   bg-blue-400/10',
    orange: 'text-orange-400 bg-orange-400/10',
    red:    'text-red-400    bg-red-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    indigo: 'text-indigo-400 bg-indigo-400/10',
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[color])}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn('text-xs font-medium', change >= 0 ? 'text-lime-400' : 'text-red-400')}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-white/30 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
}
