import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Cpu, Check, X } from 'lucide-react';

/**
 * "Why this match?" — explainable matching popover.
 *
 * Fed ONLY by the unified { breakdown, method } object that both the AI path
 * and the algorithmic fallback return. No conditional rendering on method
 * except the footer attribution line.
 *
 * breakdown shape:
 * {
 *   skills:   { score: 0-1, matched: [...], missing: [...] },
 *   domain:   { score: 0-1 },
 *   level:    { score: 0-1 },
 *   language: { score: 0-1 },
 * }
 */

const FACTORS = [
  { key: 'skills',   label: 'Skills',         weight: '45%' },
  { key: 'domain',   label: 'Domain',          weight: '25%' },
  { key: 'level',    label: 'Study level',     weight: '15%' },
  { key: 'language', label: 'Language',        weight: '15%' },
];

const barColor = (v) => v >= 0.75 ? 'bg-lime-500' : v >= 0.5 ? 'bg-yellow-500' : v >= 0.3 ? 'bg-orange-500' : 'bg-red-500';

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
          <span className="flex items-center gap-1 text-[11px] text-white/40 group-hover/why:text-white/70 transition-colors">
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
            className={`absolute top-full mt-2 z-50 w-72 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl p-4 space-y-3 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <p className="text-xs font-semibold text-white">Why this match?</p>

            {/* Per-factor bars */}
            <div className="space-y-2">
              {FACTORS.map(({ key, label, weight }) => {
                const v = Math.max(0, Math.min(1, breakdown[key]?.score ?? 0));
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/50">{label} <span className="text-white/25">· {weight}</span></span>
                      <span className="text-[11px] font-semibold text-white/70">{Math.round(v * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
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
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
                {(breakdown.skills.matched || []).map(s => (
                  <span key={`m-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-500/15 border border-lime-500/25 text-lime-400 text-[10px] font-semibold">
                    <Check size={9} /> {s}
                  </span>
                ))}
                {(breakdown.skills.missing || []).map(s => (
                  <span key={`x-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/15 text-white/40 text-[10px] font-medium">
                    <X size={9} /> {s}
                  </span>
                ))}
              </div>
            )}

            {/* Method attribution */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
              {method === 'ai'
                ? <Sparkles size={10} className="text-violet-400" />
                : <Cpu size={10} className="text-yellow-400" />}
              <span className="text-[10px] text-white/35">
                {method === 'ai' ? 'Scored by AI' : 'Scored locally (AI unavailable)'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
