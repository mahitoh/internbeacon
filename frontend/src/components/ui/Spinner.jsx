import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('animate-spin rounded-full border-2', sizes[size], className)}
      style={{ borderColor: '#E7E6DF', borderTopColor: '#1E5B45' }} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#F6F5F1' }}>
      <Spinner size="lg" />
    </div>
  );
}
