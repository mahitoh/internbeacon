import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-white/10 border-t-lime-400', sizes[size], className)} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-950">
      <Spinner size="lg" />
    </div>
  );
}
