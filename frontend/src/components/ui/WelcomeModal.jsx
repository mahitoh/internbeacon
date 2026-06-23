import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, ArrowRight, Sparkles,
  User, Upload, Search,
  Building2, Plus, Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// One-time, role-aware welcome shown on a user's first arrival at their dashboard.
// Deterministic: visibility is a single localStorage flag (no fragile tour engine),
// so it's safe to demo and never nags a returning user. Clear the key to replay it.
const FLAG = (userId) => `ib:welcome:${userId}`;

const CONTENT = {
  student: {
    accent: '#1E5B45',
    greeting: (name) => `Welcome${name ? `, ${name}` : ''} 👋`,
    tagline: 'Land your internship in three steps.',
    steps: [
      { icon: User,   title: 'Complete your profile',  desc: 'Add your programme, city and skills so we can match you accurately.' },
      { icon: Upload, title: 'Upload your CV',          desc: 'We read it automatically and pull out your skills and experience.' },
      { icon: Search, title: 'Browse & apply',          desc: 'Every internship shows a fit score — apply and track it all in one place.' },
    ],
    cta: { label: 'Complete my profile', to: '/student/profile' },
  },
  company: {
    accent: '#1E5B45',
    greeting: (name) => `Welcome${name ? `, ${name}` : ''} 👋`,
    tagline: 'Find your next intern in three steps.',
    steps: [
      { icon: Building2, title: 'Complete your company profile', desc: 'A complete profile builds trust with candidates.' },
      { icon: Plus,      title: 'Post an internship',            desc: 'Describe the role and the skills you need.' },
      { icon: Users,     title: 'Review ranked applicants',      desc: 'Candidates are scored by fit, with their CVs attached.' },
    ],
    cta: { label: 'Post an internship', to: '/company/offers/post' },
  },
};

export default function WelcomeModal({ role }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userId  = user?.id;
  const content = CONTENT[role];

  // Decide once, after the user is loaded. Only student/company get a welcome.
  useEffect(() => {
    if (!userId || !content) return;
    try {
      if (!localStorage.getItem(FLAG(userId))) setOpen(true);
    } catch { /* storage unavailable — just skip the welcome */ }
  }, [userId, content]);

  const dismiss = () => {
    try { if (userId) localStorage.setItem(FLAG(userId), '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!content) return null;

  const name = role === 'student'
    ? user?.studentProfile?.firstName
    : user?.companyProfile?.companyName;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: 'rgba(24,32,24,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #E7E6DF', boxShadow: '0 24px 64px rgba(24,32,24,.22)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header band */}
            <div className="relative px-6 pt-6 pb-5" style={{ background: '#10342A' }}>
              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                <X size={15} />
              </button>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(159,232,112,0.15)', border: '1px solid rgba(159,232,112,0.25)' }}>
                <Sparkles size={20} style={{ color: '#9FE870' }} />
              </div>
              <h2 className="text-white" style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {content.greeting(name)}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{content.tagline}</p>
            </div>

            {/* Steps */}
            <div className="px-6 py-5 space-y-4">
              {content.steps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                      <Icon size={16} style={{ color: content.accent }} />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ background: content.accent }}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>{title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9A9E97' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center gap-2">
              <button
                onClick={() => { dismiss(); navigate(content.cta.to); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
                style={{ background: content.accent }}
                onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
                onMouseLeave={e => e.currentTarget.style.background = content.accent}
              >
                {content.cta.label} <ArrowRight size={15} />
              </button>
              <button
                onClick={dismiss}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1B1D1A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; }}
              >
                Explore first
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
