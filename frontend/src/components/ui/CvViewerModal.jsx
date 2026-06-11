import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CvViewerModal({ isOpen, onClose, url, candidateName }) {
  const [state,   setState]   = useState('idle'); // idle | loading | ready | error
  const [blobUrl, setBlobUrl] = useState(null);
  const objectUrlRef = useRef(null);
  const retryRef     = useRef(0);

  /* ── Fetch PDF as blob so signed URLs don't expire mid-view ── */
  useEffect(() => {
    if (!isOpen || !url) return;
    const controller = new AbortController();
    setState('loading');
    setBlobUrl(null);
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('fetch-failed'); return r.blob(); })
      .then(blob => {
        const oru = URL.createObjectURL(blob);
        objectUrlRef.current = oru;
        setBlobUrl(oru);
        setState('ready');
      })
      .catch(err => { if (err.name !== 'AbortError') setState('error'); });

    return () => controller.abort();
  }, [url, isOpen, retryRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Cleanup on close ── */
  useEffect(() => {
    if (!isOpen) {
      setState('idle');
      setBlobUrl(null);
      if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    }
  }, [isOpen]);

  /* ── Scroll lock + keyboard ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const displayName = candidateName ? `${candidateName} — CV` : 'Curriculum Vitae';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 48, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-4xl sm:mx-auto flex flex-col bg-[#111] sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl border border-white/8"
            style={{ height: '92vh', maxHeight: 'calc(100vh - 1.5rem)' }}
            onClick={e => e.stopPropagation()}
          >

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 flex-shrink-0 bg-[#0f0f0f]">
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/18 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-red-400" />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight truncate">{displayName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/30 text-[11px]">PDF</span>
                  <span className="w-1 h-1 rounded-full bg-white/15" />
                  {state === 'loading' && <span className="text-white/30 text-[11px]">Loading…</span>}
                  {state === 'ready'   && <span className="text-lime-400/70 text-[11px]">Ready to view</span>}
                  {state === 'error'   && <span className="text-red-400/70 text-[11px]">Failed to load</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {state === 'ready' && (
                  <>
                    <a
                      href={blobUrl || url}
                      download={candidateName ? `${candidateName}_CV.pdf` : 'CV.pdf'}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 border border-lime-500/22 text-lime-400 text-xs font-semibold transition-all"
                    >
                      <Download size={12} /> Download
                    </a>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-semibold transition-all"
                    >
                      <ExternalLink size={12} /> Open
                    </a>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/12 border border-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── PDF area ── */}
            <div className="flex-1 relative overflow-hidden bg-[#181818]">

              {/* Loading skeleton */}
              {state === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-1">
                    <Loader2 size={24} className="text-lime-400 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/50 text-sm font-medium">Loading CV…</p>
                    <p className="text-white/25 text-xs mt-1">Fetching the document securely</p>
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-full max-w-sm space-y-2 mt-4">
                    {[100, 90, 95, 70, 85, 60].map((w, i) => (
                      <div key={i} className="h-2 rounded-full bg-white/5 animate-pulse" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error state */}
              {state === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle size={26} className="text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 font-semibold">Could not load the CV</p>
                    <p className="text-white/35 text-sm mt-1 max-w-xs">The preview link may have expired. Try refreshing or open it directly.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { retryRef.current++; setState('idle'); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
                    >
                      <RefreshCw size={14} /> Retry
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500/12 hover:bg-lime-500/22 border border-lime-500/25 text-lime-400 text-sm font-medium transition-all"
                    >
                      <ExternalLink size={14} /> Open in new tab
                    </a>
                  </div>
                </div>
              )}

              {/* PDF iframe — better cross-browser than <object> */}
              {state === 'ready' && blobUrl && (
                <embed
                  src={blobUrl}
                  type="application/pdf"
                  className="w-full h-full block"
                  title={displayName}
                />
              )}

              {/* Download fallback shown when embed can't render (Firefox mobile, some iOS) */}
              {state === 'ready' && blobUrl && (
                <noscript>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                    <p className="text-white/50 text-sm text-center">Your browser cannot display PDFs inline.</p>
                    <a href={blobUrl} download="cv.pdf"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold">
                      <Download size={14} /> Download CV
                    </a>
                  </div>
                </noscript>
              )}
            </div>

            {/* ── Footer bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-[#0f0f0f] flex-shrink-0">
              <p className="text-white/20 text-[11px]">Press Esc to close</p>
              {state === 'ready' && (
                <p className="text-white/20 text-[11px]">Secure preview · link expires in 1h</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
