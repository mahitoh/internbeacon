import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CvViewerModal({ isOpen, onClose, url, candidateName }) {
  const [state,    setState]    = useState('idle'); // idle | loading | ready | error
  const [blobUrl,  setBlobUrl]  = useState(null);
  const objectUrlRef = useRef(null);

  // Fetch and create a blob URL when the signed URL changes
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
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch PDF');
        return r.blob();
      })
      .then(blob => {
        const oru = URL.createObjectURL(blob);
        objectUrlRef.current = oru;
        setBlobUrl(oru);
        setState('ready');
      })
      .catch(err => {
        if (err.name !== 'AbortError') setState('error');
      });

    return () => controller.abort();
  }, [url, isOpen]);

  // Clean up blob URL on close
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

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
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
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Header bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-5 py-3 bg-[#111] border-b border-white/8 flex-shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">
                  {candidateName ? `${candidateName} — CV` : 'Curriculum Vitae'}
                </p>
                <p className="text-white/30 text-xs mt-0.5">PDF Resume</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={url}
                download
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/25 text-lime-300 text-xs font-semibold transition-all"
              >
                <Download size={13} /> Download
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all"
              >
                <ExternalLink size={13} /> Open tab
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all ml-1"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>

          {/* PDF area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="flex-1 flex flex-col relative overflow-hidden bg-[#1a1a1a]"
            onClick={e => e.stopPropagation()}
          >
            {state === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <Loader2 size={28} className="text-lime-400 animate-spin" />
                <p className="text-white/40 text-sm">Loading CV…</p>
              </div>
            )}

            {state === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <div className="text-center">
                  <p className="text-white/70 font-semibold text-sm">Could not load CV</p>
                  <p className="text-white/30 text-xs mt-1">The preview link may have expired</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setState('idle') || setBlobUrl(null)}
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
                {/* Fallback for browsers that don't support PDF objects */}
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-white/50 text-sm">Your browser can't display PDFs inline.</p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
