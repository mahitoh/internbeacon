import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CvViewerModal({ isOpen, onClose, url, candidateName }) {
  const [state,    setState]    = useState('idle'); // idle | loading | ready | error
  const [blobUrl,  setBlobUrl]  = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !url) return;
    const controller = new AbortController();
    setState('loading');
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setBlobUrl(null);
    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('Failed to fetch PDF'); return r.blob(); })
      .then(blob => {
        const oru = URL.createObjectURL(blob);
        objectUrlRef.current = oru;
        setBlobUrl(oru);
        setState('ready');
      })
      .catch(err => { if (err.name !== 'AbortError') setState('error'); });
    return () => controller.abort();
  }, [url, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setState('idle');
      setBlobUrl(null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [isOpen]);

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
        /* Backdrop */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-4xl sm:mx-auto flex flex-col bg-[#111] sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl border border-white/8"
            style={{ maxHeight: 'calc(100vh - 2rem)', height: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/12 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={17} className="text-red-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{displayName}</p>
                  <p className="text-white/30 text-xs mt-0.5">PDF Resume</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={url}
                  download
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500/12 hover:bg-lime-500/22 border border-lime-500/25 text-lime-300 text-xs font-semibold transition-all"
                >
                  <Download size={13} /> Download
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all"
                >
                  <ExternalLink size={13} /> Open tab
                </a>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* PDF area */}
            <div className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
              {state === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <Loader2 size={28} className="text-lime-400 animate-spin" />
                  <p className="text-white/40 text-sm">Loading CV…</p>
                </div>
              )}

              {state === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle size={24} className="text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 font-semibold text-sm">Could not load CV</p>
                    <p className="text-white/30 text-xs mt-1">The preview link may have expired</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setState('idle'); setBlobUrl(null); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm transition-all"
                    >
                      <RefreshCw size={14} /> Retry
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/25 text-lime-300 text-sm transition-all"
                    >
                      <ExternalLink size={14} /> Open directly
                    </a>
                  </div>
                </div>
              )}

              {state === 'ready' && blobUrl && (
                <object
                  data={blobUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  aria-label="CV PDF"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                    <p className="text-white/50 text-sm text-center">Your browser can't display PDFs inline.</p>
                    <a
                      href={blobUrl}
                      download="cv.pdf"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold transition-all"
                    >
                      <Download size={14} /> Download CV
                    </a>
                  </div>
                </object>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
