import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Circular SVG progress ring that animates from 0 to `score` on mount.
 * Colour-coded by verdict tier to match the matching engine thresholds.
 *
 * sizes: 'sm' (32px) — cards and lists
 *        'md' (48px) — kanban cards
 *        'lg' (72px) — offer detail hero
 *
 * If score is undefined/null, renders a neutral grey ring (loading state).
 */

const SIZE_MAP = {
  sm: { diameter: 32, stroke: 2.8, textSize: '10px', fontWeight: 800 },
  md: { diameter: 48, stroke: 3.5, textSize: '13px', fontWeight: 800 },
  lg: { diameter: 72, stroke: 4.5, textSize: '18px', fontWeight: 800 },
};

// Thresholds mirror the matching engine's getVerdict tiers so the ring colour
// always agrees with the verdict label shown next to it.
function scoreColor(score) {
  if (score === undefined || score === null) return { ring: '#DDDBD2', text: 'text-[#9A9E97]' };
  if (score >= 85) return { ring: '#22c55e', text: 'text-emerald-600' };  // Excellent
  if (score >= 70) return { ring: '#eab308', text: 'text-yellow-600' };   // Good
  if (score >= 50) return { ring: '#f97316', text: 'text-orange-600' };   // Moderate
  return { ring: '#ef4444', text: 'text-red-600' };                       // Low
}

export default function ScoreRing({ score, size = 'sm', className = '', animate: shouldAnimate = true }) {
  const { diameter, stroke, textSize, fontWeight } = SIZE_MAP[size] || SIZE_MAP.sm;
  const radius    = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const { ring, text } = scoreColor(score);
  const pct = score !== undefined && score !== null ? Math.min(100, Math.max(0, score)) : 0;

  const dashOffset = useMotionValue(circumference);
  const displayScore = useRef(0);

  useEffect(() => {
    if (!shouldAnimate) {
      dashOffset.set(circumference * (1 - pct / 100));
      displayScore.current = pct;
      return;
    }
    const controls = animate(dashOffset, circumference * (1 - pct / 100), {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1,
    });
    return controls.stop;
  }, [pct]); // eslint-disable-line react-hooks/exhaustive-deps

  const cx = diameter / 2;
  const cy = diameter / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#E7E6DF"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      {/* Label */}
      <span
        className={`absolute inset-0 flex items-center justify-center tabular-nums ${text}`}
        style={{ fontSize: textSize, fontWeight, lineHeight: 1 }}
      >
        {score !== undefined && score !== null ? score : '—'}
      </span>
    </div>
  );
}
