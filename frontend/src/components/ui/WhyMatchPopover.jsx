import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Cpu, Check, X } from 'lucide-react';

const FACTORS = [
  { key: 'skills',   label: 'Skills',       weight: '40%' },
  { key: 'domain',   label: 'Programme',    weight: '20%' },
  { key: 'location', label: 'Location',     weight: '15%' },
  { key: 'level',    label: 'Study level',  weight: '15%' },
  { key: 'language', label: 'Language',     weight: '10%' },
];

const barColor = (v) => v >= 0.75 ? 'bg-emerald-500' : v >= 0.5 ? 'bg-yellow-500' : v >= 0.3 ? 'bg-orange-500' : 'bg-red-500';

export default function WhyMatchPopover({ breakdown, method, children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey  = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  if (!breakdown) return children || null;

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="inline-flex items-center gap-1 cursor-pointer group/why"
        title="Why this match?"
      >
        {children || (
          <span className="flex items-center gap-1 text-[11px] transition-colors" style={{ color: '#9A9E97' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
            onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
            <HelpCircle size={11} /> Why?
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className={`absolute top-full mt-2 z-50 w-72 rounded-2xl p-4 space-y-3 ${align === 'right' ? 'right-0' : 'left-0'}`}
            style={{ background: '#fff', border: '1px solid #E7E6DF', boxShadow: '0 8px 32px rgba(24,32,24,.10)' }}
          >
            <p className="text-xs font-semibold" style={{ color: '#1B1D1A' }}>Why this match?</p>

            {/* Per-factor bars */}
            <div className="space-y-2">
              {FACTORS.map(({ key, label, weight }) => {
                const v = Math.max(0, Math.min(1, breakdown[key]?.score ?? 0));
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px]" style={{ color: '#6B6F69' }}>
                        {label} <span style={{ color: '#BDBBB3' }}>· {weight}</span>
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: '#1B1D1A' }}>{Math.round(v * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v * 100}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className={`h-full rounded-full ${barColor(v)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matched / missing skill chips */}
            {(breakdown.skills?.matched?.length > 0 || breakdown.skills?.missing?.length > 0) && (
              <div className="flex flex-wrap gap-1.5 pt-1" style={{ borderTop: '1px solid #F0F0EA' }}>
                {(breakdown.skills.matched || []).map(s => (
                  <span key={`m-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                    <Check size={9} /> {s}
                  </span>
                ))}
                {(breakdown.skills.missing || []).map(s => (
                  <span key={`x-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ border: '1px solid #DDDBD2', color: '#9A9E97' }}>
                    <X size={9} /> {s}
                  </span>
                ))}
              </div>
            )}

            {/* Method attribution */}
            <div className="flex items-center gap-1.5 pt-2" style={{ borderTop: '1px solid #F0F0EA' }}>
              <Cpu size={10} style={{ color: '#1E5B45', opacity: 0.6 }} />
              <span className="text-[10px]" style={{ color: '#9A9E97' }}>
                5-factor weighted matching engine
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
