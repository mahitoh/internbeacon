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
    {label && <label className="block text-[13px] font-semibold" style={{ color: '#1B1D1A' }}>{label}</label>}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9A9E97' }}>
          <Icon size={16} />
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-[11px] px-4 py-2.5 text-[14px] transition-colors duration-200 focus:outline-none focus:ring-2',
          Icon && 'pl-10',
          className
        )}
        style={{
          border: error ? '1px solid #EF4444' : '1px solid #DDDBD2',
          background: '#F6F5F1',
          color: '#1B1D1A',
        }}
        {...props}
      />
    </div>
    {error && <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>}
  </div>
));

DarkInput.displayName = 'DarkInput';

export const LightInput = forwardRef(({ label, error, icon: Icon, trailing, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-[13px] font-semibold text-[#1B1D1A]">{label}</label>}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A4A89F]">
          <Icon size={16} />
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-[11px] border border-[#DDDBD2] bg-white px-4 py-2.5 text-[14px] text-[#1B1D1A]',
          'placeholder:text-[#A4A89F] focus:border-[#1E5B45] focus:outline-none focus:ring-2 focus:ring-[#1E5B45]/15',
          'transition-colors duration-200',
          Icon && 'pl-10',
          trailing && 'pr-11',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
          className
        )}
        {...props}
      />
      {trailing && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
          {trailing}
        </span>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

LightInput.displayName = 'LightInput';

export default Input;
