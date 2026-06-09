import { cn } from '../../lib/utils';

const variants = {
  primary:   'bg-forest-900 hover:bg-forest-800 text-white shadow-sm hover:shadow',
  secondary: 'bg-white hover:bg-[#f2f1ea] text-forest-950 border border-gray-200 shadow-sm hover:shadow',
  accent:    'bg-lime-500 hover:bg-lime-400 text-forest-950 shadow-sm hover:shadow',
  dark:      'bg-forest-950 hover:bg-forest-900 text-white',
  ghost:     'bg-transparent hover:bg-forest-900/5 text-forest-950',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  outline:   'bg-transparent border border-forest-200/60 hover:border-forest-300 text-forest-950',
};

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-6 py-3 text-sm',
  lg:  'px-8 py-3.5 text-base',
  xl:  'px-10 py-5 text-lg',
  icon:'p-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
        'transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
