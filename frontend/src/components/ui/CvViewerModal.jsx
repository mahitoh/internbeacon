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
  // Browsers have no built-in inline renderer for .docx the way <embed> renders
  // PDFs — detect it from the signed URL's path so we can skip straight to a
  // download/open prompt instead of showing a blank pane.
  const isDocx   = /\.docx(\?|$)/i.test(url || '');
  const fileExt  = isDocx ? 'docx' : 'pdf';
  const fileName = candidateName ? `${candidateName}_CV.${fileExt}` : `CV.${fileExt}`;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: 'rgba(24,32,24,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 48, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-4xl sm:mx-auto flex flex-col sm:rounded-2xl rounded-t-3xl overflow-hidden"
            style={{ height: '92vh', maxHeight: 'calc(100vh - 1.5rem)', background: '#fff', border: '1px solid #E7E6DF', boxShadow: '0 24px 64px rgba(24,32,24,.22)' }}
            onClick={e => e.stopPropagation()}
          >

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #E7E6DF', background: '#FAFAF7' }}>
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                <FileText size={16} style={{ color: '#DC2626' }} />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: '#1B1D1A' }}>{displayName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px]" style={{ color: '#9A9E97' }}>{isDocx ? 'Word Document' : 'PDF'}</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: '#DDDBD2' }} />
                  {state === 'loading' && <span className="text-[11px]" style={{ color: '#9A9E97' }}>Loading…</span>}
                  {state === 'ready'   && <span className="text-[11px] font-medium" style={{ color: '#1E5B45' }}>Ready to view</span>}
                  {state === 'error'   && <span className="text-[11px] font-medium" style={{ color: '#DC2626' }}>Failed to load</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {state === 'ready' && (
                  <>
                    <a
                      href={blobUrl || url}
                      download={fileName}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}
                    >
                      <Download size={12} /> Download
                    </a>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                    >
                      <ExternalLink size={12} /> Open
                    </a>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#9A9E97' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F0F0EA'; e.currentTarget.style.color = '#1B1D1A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#9A9E97'; }}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── PDF area ── */}
            <div className="flex-1 relative overflow-hidden" style={{ background: '#F6F5F1' }}>

              {/* Loading skeleton */}
              {state === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
                    <Loader2 size={24} className="animate-spin" style={{ color: '#1E5B45' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: '#6B6F69' }}>Loading CV…</p>
                    <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>Fetching the document securely</p>
                  </div>
                  {/* Skeleton sheet */}
                  <div className="w-full max-w-sm rounded-xl p-5 mt-2 space-y-2" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
                    {[100, 90, 95, 70, 85, 60, 80].map((w, i) => (
                      <div key={i} className="h-2.5 rounded-full animate-pulse" style={{ width: `${w}%`, background: '#F0F0EA' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error state */}
              {state === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10 p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#FEE2E2', border: '1px solid #FECACA' }}>
                    <AlertCircle size={26} style={{ color: '#DC2626' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: '#1B1D1A' }}>Could not load the CV</p>
                    <p className="text-sm mt-1 max-w-xs" style={{ color: '#9A9E97' }}>The preview link may have expired. Try refreshing or open it directly.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { retryRef.current++; setState('idle'); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                    >
                      <RefreshCw size={14} /> Retry
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}
                    >
                      <ExternalLink size={14} /> Open in new tab
                    </a>
                  </div>
                </div>
              )}

              {/* PDF — <embed> renders inline, better cross-browser than <object> */}
              {state === 'ready' && blobUrl && !isDocx && (
                <embed
                  src={blobUrl}
                  type="application/pdf"
                  className="w-full h-full block"
                  title={displayName}
                />
              )}

              {/* .docx has no browser-native inline renderer — prompt download/open
                  instead of showing a blank pane. */}
              {state === 'ready' && blobUrl && isDocx && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                    <FileText size={26} style={{ color: '#1E5B45' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: '#1B1D1A' }}>Word documents can't be previewed in-browser</p>
                    <p className="text-sm mt-1 max-w-xs" style={{ color: '#9A9E97' }}>Download it or open it in a new tab to view this CV.</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={blobUrl} download={fileName}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{ background: '#1E5B45', color: '#fff' }}>
                      <Download size={14} /> Download
                    </a>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}>
                      <ExternalLink size={14} /> Open in new tab
                    </a>
                  </div>
                </div>
              )}

              {/* Mobile browsers that can't render <embed> show a blank pane; JS is
                  always on so a <noscript> fallback never fires. Show a persistent,
                  tappable download/open bar on small screens instead. */}
              {state === 'ready' && blobUrl && !isDocx && (
                <div className="sm:hidden absolute bottom-3 inset-x-3 flex items-center gap-2 z-10">
                  <a href={blobUrl} download={fileName}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg"
                    style={{ background: '#1E5B45' }}>
                    <Download size={14} /> Download
                  </a>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
                    style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#1B1D1A' }}>
                    <ExternalLink size={14} /> Open
                  </a>
                </div>
              )}
            </div>

            {/* ── Footer bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0" style={{ borderTop: '1px solid #E7E6DF', background: '#FAFAF7' }}>
              <p className="text-[11px]" style={{ color: '#9A9E97' }}>Press Esc to close</p>
              {state === 'ready' && (
                <p className="text-[11px]" style={{ color: '#9A9E97' }}>Secure preview · link expires in 1h</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
