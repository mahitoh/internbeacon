import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Searchable dropdown that looks and behaves like the app's SelectField, but
 * still allows a free-typed value (universities/programmes are too many to
 * enumerate). Click — or focus — opens a panel of options; typing filters them;
 * picking one (mouse or keyboard) sets the value; any typed text is kept even if
 * it isn't in the list.
 *
 * Controlled: pass `value` + `onChange(nextValue)`. Designed to be driven by
 * react-hook-form's setValue/watch rather than register (a custom control can't
 * be register-spread like a native input).
 */
export default function Combobox({
  label,
  value = '',
  onChange,
  options = [],
  placeholder,
  maxHeight = 240,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const q = String(value || '').trim().toLowerCase();
  const exact = options.some(o => o.toLowerCase() === q);
  // Empty or an exact match → show everything (so the user can still switch);
  // partial text → filter to matches.
  const list = (!q || exact) ? options : options.filter(o => o.toLowerCase().includes(q));

  // Close when clicking outside the control.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const choose = (opt) => {
    onChange?.(opt);
    setOpen(false);
    setHighlight(-1);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlight(h => Math.min(h + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && highlight >= 0 && list[highlight]) { e.preventDefault(); choose(list[highlight]); }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium" style={{ color: '#6B6F69' }}>{label}</label>}
      <div className="relative" ref={wrapRef}>
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={e => { onChange?.(e.target.value); setOpen(true); setHighlight(-1); }}
          onFocus={e => { e.target.style.borderColor = '#1E5B45'; e.target.style.background = '#fff'; setOpen(true); }}
          onBlur={e => { e.target.style.borderColor = '#DDDBD2'; e.target.style.background = '#F6F5F1'; }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none transition-colors"
          style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle options"
          onMouseDown={e => { e.preventDefault(); setOpen(o => !o); inputRef.current?.focus(); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5"
        >
          <ChevronDown
            size={16}
            style={{ color: '#9A9E97', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
          />
        </button>

        {open && list.length > 0 && (
          <ul
            className="absolute z-30 mt-1 w-full overflow-auto rounded-lg py-1 dashboard-scroll"
            style={{ background: '#fff', border: '1px solid #E7E6DF', maxHeight, boxShadow: '0 8px 24px rgba(24,32,24,.10)' }}
          >
            {list.map((opt, i) => (
              <li key={opt}>
                <button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); choose(opt); }}
                  onMouseEnter={() => setHighlight(i)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors"
                  style={{ background: highlight === i ? '#F0F0EA' : 'transparent', color: '#1B1D1A' }}
                >
                  <span>{opt}</span>
                  {opt === value && <Check size={14} style={{ color: '#1E5B45' }} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
