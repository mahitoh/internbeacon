import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Loader2, ExternalLink, Users } from 'lucide-react';

// Derives a stable Jitsi room name from the application ID.
// Both company and student use the same derivation so they land in the same room.
function roomName(appId) {
  return `InternBeacon-${appId.replace(/-/g, '').slice(0, 16)}`;
}

export default function VideoInterviewModal({ isOpen, onClose, appId, title, subtitle }) {
  const [loading, setLoading] = useState(true);
  const room = appId ? roomName(appId) : null;
  const jitsiUrl = room
    ? `https://meet.jit.si/${room}#config.prejoinPageEnabled=false&config.startWithVideoMuted=false&config.startWithAudioMuted=false&interfaceConfig.SHOW_JITSI_WATERMARK=false`
    : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoading(true);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-5 py-3 bg-[#111] border-b border-white/8 flex-shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Video size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">
                  {title || 'Video Interview'}
                </p>
                {subtitle && <p className="text-white/30 text-xs mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {jitsiUrl && (
                <a
                  href={jitsiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all"
                >
                  <ExternalLink size={13} />
                  Open in new tab
                </a>
              )}
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all ml-1"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>

          {/* Video area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0d0d0d] z-10">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                  <Users size={28} className="text-indigo-400" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Loader2 size={14} className="text-indigo-400 animate-spin" />
                    <p className="text-white/60 text-sm">Connecting to video room…</p>
                  </div>
                  <p className="text-white/25 text-xs">Powered by Jitsi Meet</p>
                </div>
              </div>
            )}
            {jitsiUrl && (
              <iframe
                src={jitsiUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                title="Video Interview"
                className="w-full h-full border-0 bg-[#0d0d0d]"
                onLoad={() => setLoading(false)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
