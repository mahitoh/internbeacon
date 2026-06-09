import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm',
          'placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          'transition-colors duration-200',
          Icon && 'pl-10',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const DarkInput = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          <Icon size={16} />
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white',
          'placeholder:text-white/30 focus:border-lime-500/50 focus:outline-none focus:ring-2 focus:ring-lime-500/20',
          'transition-colors duration-200',
          Icon && 'pl-10',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

DarkInput.displayName = 'DarkInput';

export default Input;
