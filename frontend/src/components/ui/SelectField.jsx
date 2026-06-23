import { ChevronDown } from 'lucide-react';

/**
 * Shared <select> control with a real chevron affordance and composed focus/blur
 * handlers. `appearance-none` removes the browser arrow, so every select needs a
 * drawn chevron — this component is the single source of that.
 *
 * It also composes the caller's onFocus/onBlur instead of letting them be
 * clobbered by the spread. react-hook-form's register() supplies an onBlur; if a
 * field set its border-reset on an inline onBlur placed *before* {...register},
 * RHF's onBlur won and the border stayed green after blur. Routing both through
 * here fixes that everywhere at once.
 *
 * Modes:
 *  - default ("form"): label-above field on the sand surface (#F6F5F1). Focus
 *    turns the border green + background white; blur resets (error-aware).
 *  - `bare`: no built-in field styling — the caller supplies className/style for
 *    compact toolbar/filter selects. The chevron and composed handlers still
 *    apply, so those keep their exact look but gain the missing arrow.
 */
export default function SelectField({
  label,
  labelIcon: LabelIcon,
  hint,
  error,
  children,
  bare = false,
  className = '',
  style,
  wrapperClassName = '',
  chevronSize = 16,
  chevronClassName = 'right-3',
  onFocus,
  onBlur,
  ...props
}) {
  const restBorder = error ? '#F87171' : '#DDDBD2';

  const formClassName =
    'w-full rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none transition-colors appearance-none cursor-pointer';
  const formStyle = { background: '#F6F5F1', border: `1px solid ${restBorder}`, color: '#1B1D1A' };

  const handleFocus = (e) => {
    if (!bare) {
      e.target.style.borderColor = '#1E5B45';
      e.target.style.background = '#fff';
    }
    onFocus?.(e);
  };
  const handleBlur = (e) => {
    if (!bare) {
      e.target.style.borderColor = restBorder;
      e.target.style.background = '#F6F5F1';
    }
    onBlur?.(e);
  };

  const control = (
    <div className={`relative ${bare ? wrapperClassName : ''}`.trim()}>
      <select
        className={bare ? className : `${formClassName} ${className}`.trim()}
        style={bare ? style : { ...formStyle, ...style }}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </select>
      <ChevronDown
        size={chevronSize}
        className={`absolute ${chevronClassName} top-1/2 -translate-y-1/2 pointer-events-none`}
        style={{ color: '#9A9E97' }}
      />
    </div>
  );

  // Bare mode (compact toolbar/filter selects) renders just the control + chevron,
  // so it slots straight into a flex row without an extra wrapper. The caller owns
  // its own label/error. Form mode wraps with label/hint/error.
  if (bare) return control;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`.trim()}>
      {label && (
        <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#6B6F69' }}>
          {LabelIcon && <LabelIcon size={12} />} {label}
        </label>
      )}
      {control}
      {hint && <p className="text-xs" style={{ color: '#9A9E97' }}>{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
