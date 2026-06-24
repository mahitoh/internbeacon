import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Right-side slide-over panel for detail views (admin drill-downs, quick views).
 * Backdrop click + Esc close it; the body scrolls on a soft canvas so the white
 * content cards stand out. Header/footer stay pinned.
 */
export default function SlideOver({ open, onClose, eyebrow, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40" style={{ background: 'rgba(24,32,24,0.40)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={`fixed inset-y-0 right-0 z-50 w-full ${width} flex flex-col`}
            style={{ background: '#F7F6F1', boxShadow: '-12px 0 40px rgba(24,32,24,.16)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between gap-3 px-5 h-14 flex-shrink-0"
              style={{ borderBottom: '1px solid #E7E6DF', background: '#fff' }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#9A9E97' }}>
                {eyebrow}
              </span>
              <button
                onClick={onClose} aria-label="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ color: '#9A9E97' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F0F0EA'; e.currentTarget.style.color = '#1B1D1A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9A9E97'; }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 dashboard-scroll">{children}</div>

            {footer && (
              <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid #E7E6DF', background: '#fff' }}>{footer}</div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Shared detail bits ─────────────────────────────────────────────────────── */

const AVATAR_PALETTE = [
  { bg: '#EDF2EE', text: '#1E5B45' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#E0F2FE', text: '#075985' },
];

// Avatar — image if provided, else coloured initials, else an icon tile.
export function DAvatar({ name = '', src, icon: Icon, size = 56 }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const palette  = AVATAR_PALETTE[(name.charCodeAt(0) || 0) % AVATAR_PALETTE.length];
  const dim = { width: size, height: size };
  if (src) {
    return <img src={src} alt={name} className="rounded-2xl object-cover flex-shrink-0" style={{ ...dim, border: '1px solid #E7E6DF' }} />;
  }
  return (
    <div className="rounded-2xl flex items-center justify-center flex-shrink-0 font-black"
      style={{ ...dim, background: Icon ? '#EDF2EE' : palette.bg, color: Icon ? '#1E5B45' : palette.text, fontSize: size * 0.32, letterSpacing: '0.02em' }}>
      {Icon ? <Icon size={size * 0.4} /> : (initials || '?')}
    </div>
  );
}

// Hero card — avatar + title + subtitle + a row of badges/pills.
export function DHero({ avatar, title, subtitle, badges }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <div className="flex items-start gap-4">
        {avatar}
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-bold leading-tight" style={{ fontSize: 18, color: '#1B1D1A', letterSpacing: '-0.01em' }}>{title}</h3>
          {subtitle && <p className="text-sm mt-1 break-words" style={{ color: '#9A9E97' }}>{subtitle}</p>}
          {badges && <div className="flex flex-wrap gap-1.5 mt-3">{badges}</div>}
        </div>
      </div>
    </div>
  );
}

export function DBadge({ children, tone = 'green' }) {
  const tones = {
    green:  { background: '#EDF2EE', color: '#1E5B45', border: '1px solid #C4DBCE' },
    blue:   { background: '#EEF2FB', color: '#3B5FC0', border: '1px solid #C4CFEB' },
    purple: { background: '#F3EEFB', color: '#5B21B6', border: '1px solid #CFBDE8' },
    amber:  { background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' },
    red:    { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
    grey:   { background: '#F6F5F1', color: '#6B6F69', border: '1px solid #E7E6DF' },
  };
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={tones[tone] || tones.grey}>
      {children}
    </span>
  );
}

// Section card with an icon-led title.
export function DSection({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={13} style={{ color: '#1E5B45' }} />}
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#9A9E97' }}>{title}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// Definition row with a hairline separator (skips empties).
export function DRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 first:pt-0 last:pb-0" style={{ borderTop: '1px solid #F4F3EE' }}>
      <span className="text-sm flex-shrink-0" style={{ color: '#9A9E97' }}>{label}</span>
      <span className="text-sm text-right font-semibold break-words" style={{ color: '#1B1D1A' }}>{value}</span>
    </div>
  );
}

// Compact stat tiles for key facts (icon + label + value).
export function DStatGrid({ children }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

export function DStat({ icon: Icon, label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: '#F8F7F3', border: '1px solid #EFEEE8' }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        {Icon && <Icon size={11} style={{ color: '#9A9E97' }} />}
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{label}</span>
      </div>
      <p className="text-sm font-bold truncate" style={{ color: '#1B1D1A' }}>{value}</p>
    </div>
  );
}

export function DChips({ items, empty = '—' }) {
  if (!items || items.length === 0) return <p className="text-sm" style={{ color: '#C0BFBA' }}>{empty}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => (
        <span key={`${s}-${i}`} className="text-xs px-2.5 py-1 rounded-lg font-medium"
          style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
          {typeof s === 'string' ? s : (s.language || s.name || JSON.stringify(s))}
        </span>
      ))}
    </div>
  );
}
