import { cn } from '../../lib/utils';

function getInitials(name) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
}

const COLORS = [
  'bg-lime-500',   'bg-brand-600', 'bg-blue-600',
  'bg-purple-600', 'bg-orange-500','bg-pink-600',
];

function colorFor(name) {
  let hash = 0;
  for (const c of name || '') hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const sizes = { xs: 'w-7 h-7 text-xs', sm: 'w-9 h-9 text-sm', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };

export default function Avatar({ name, src, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white/10', sizes[size], className)}
      />
    );
  }
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/10',
      colorFor(name),
      sizes[size],
      className
    )}>
      {getInitials(name)}
    </div>
  );
}
