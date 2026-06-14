import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Clock, Banknote, Building2, Calendar,
  Users, Bookmark, Share2, CheckCircle2,
  TrendingUp, TrendingDown, Lightbulb, FileCheck, Upload, ShieldCheck,
  Check, X, AlertTriangle,
} from 'lucide-react';
import { offersApi }        from '../../api/offers';
import { applicationsApi }  from '../../api/applications';
import { uploadApi }        from '../../api/upload';
import { useAuth }          from '../../context/AuthContext';
import Spinner              from '../../components/ui/Spinner';
import { formatDate }       from '../../lib/utils';
import toast                from 'react-hot-toast';
import { motion }           from 'framer-motion';

const FACTORS = [
  { key: 'skills',   label: 'Skills Match',    weight: '35%' },
  { key: 'domain',   label: 'Programme Match', weight: '30%' },
  { key: 'location', label: 'Location Match',  weight: '15%' },
  { key: 'level',    label: 'Study Year',      weight: '15%' },
  { key: 'language', label: 'Language',        weight: '5%'  },
];

const barColor = (v) =>
  v >= 0.85 ? '#1E5B45' : v >= 0.70 ? '#B45309' : v >= 0.50 ? '#C2410C' : '#9A9E97';

export default function StudentOfferDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc       = useQueryClient();

  const [coverLetter, setCoverLetter] = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const [applying,    setApplying]    = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [newCvFile,   setNewCvFile]   = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const cvInputRef = useRef(null);

  const hasProfileCv = !!user?.studentProfile?.cvUrl;

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn:  () => offersApi.getOne(id).then(r => r.data.data),
  });

  const { data: myApps } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my({ limit: 100 }).then(r => r.data.data || []),
  });
  const existingApp = myApps?.find(a => a.offerId === id || a.offer?.id === id);

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  () => offersApi.bookmarks().then(r => r.data.data || []),
  });
  const bookmarked = bookmarksData?.some(o => o.id === id) ?? false;

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))
      { toast.error('Only PDF files accepted'); e.target.value = ''; return; }
    if (file.size > 5 * 1024 * 1024)
      { toast.error('CV must be under 5 MB'); e.target.value = ''; return; }
    setNewCvFile(file);
    e.target.value = '';
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      let cvSnapshotUrl;
      if (newCvFile) {
        setCvUploading(true);
        const r = await uploadApi.cvSnapshot(newCvFile);
        setCvUploading(false);
        cvSnapshotUrl = r.data.data.path;
      } else if (hasProfileCv) {
        cvSnapshotUrl = user.studentProfile.cvUrl;
      }
      await applicationsApi.apply({ offerId: id, coverLetter, cvSnapshotUrl });
      qc.invalidateQueries({ queryKey: ['my-apps'] });
      toast.success('Application submitted!');
      setShowForm(false);
      setNewCvFile(null);
    } catch (err) {
      setCvUploading(false);
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      bookmarked ? await offersApi.unbookmark(id) : await offersApi.bookmark(id);
      toast.success(bookmarked ? 'Removed from saved' : 'Offer saved!');
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    } catch { toast.error('Could not update saved offers'); }
    finally { setBookmarking(false); }
  };

  const handleShare = () =>
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Could not copy'));

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!offer)    return <p className="text-sm" style={{ color: '#9A9E97' }}>Offer not found.</p>;

  const match = offer?.match || null;

  return (
    <div className="max-w-5xl" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: '#6B6F69' }}
        onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
        onMouseLeave={e => e.currentTarget.style.color = '#6B6F69'}>
        <ArrowLeft size={16} /> Back to offers
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
                {offer.company?.logoUrl
                  ? <img src={offer.company.logoUrl} alt="" className="w-full h-full object-contain" />
                  : <Building2 size={24} style={{ color: '#DDDBD2' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black leading-snug" style={{ color: '#1B1D1A' }}>{offer.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {offer.company?.id
                    ? <Link to={`/student/companies/${offer.company.id}`}
                        className="text-sm transition-colors" style={{ color: '#9A9E97', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1E5B45'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                        {offer.company?.companyName}
                      </Link>
                    : <span className="text-sm" style={{ color: '#9A9E97' }}>{offer.company?.companyName}</span>}
                  {offer.company?.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                      <ShieldCheck size={9} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Chip icon={MapPin}>{offer.location}</Chip>
                  <Chip icon={Clock}>{offer.durationWeeks} weeks</Chip>
                  {offer.isPaid && <Chip icon={Banknote}>{offer.stipendCurrency} {Number(offer.stipendAmount).toLocaleString()}/mo</Chip>}
                  <Chip icon={Users}>{offer.openings} opening{offer.openings !== 1 ? 's' : ''}</Chip>
                  <Chip icon={Calendar}>Deadline {formatDate(offer.deadline)}</Chip>
                </div>
              </div>
            </div>
          </div>

          {/* Match breakdown */}
          {match && <MatchPanel match={match} />}

          {/* Description */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
            <Section title="About the role" first>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6F69' }}>{offer.description}</p>
            </Section>
            {offer.responsibilities && (
              <Section title="Responsibilities">
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6F69' }}>{offer.responsibilities}</p>
              </Section>
            )}
            {offer.requirements && (
              <Section title="Requirements">
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6F69' }}>{offer.requirements}</p>
              </Section>
            )}
            {offer.requiredSkills?.length > 0 && (
              <Section title="Required Skills">
                <div className="flex flex-wrap gap-2">
                  {offer.requiredSkills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>{s}</span>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Apply form */}
          {showForm && (
            <div className="rounded-2xl p-6 space-y-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
              <h3 className="font-semibold text-base" style={{ color: '#1B1D1A' }}>Complete Your Application</h3>
              <input ref={cvInputRef} type="file" accept=".pdf" className="hidden" onChange={handleCvFileChange} />

              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: '#1B1D1A' }}>CV / Resume</label>
                {newCvFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                    <FileCheck size={16} style={{ color: '#1E5B45', flexShrink: 0 }} />
                    <span className="text-sm flex-1 truncate" style={{ color: '#1E5B45' }}>{newCvFile.name}</span>
                    <button type="button" onClick={() => setNewCvFile(null)}
                      className="text-xs transition-colors" style={{ color: '#9A9E97' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>Remove</button>
                  </div>
                ) : hasProfileCv ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
                    <FileCheck size={16} style={{ color: '#1E5B45', flexShrink: 0 }} />
                    <span className="text-sm flex-1" style={{ color: '#6B6F69' }}>Your profile CV will be included</span>
                    <button type="button" onClick={() => cvInputRef.current?.click()}
                      className="text-xs font-semibold transition-colors" style={{ color: '#1E5B45' }}>Replace</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => cvInputRef.current?.click()}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-colors group"
                    style={{ borderColor: '#DDDBD2' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#1E5B45'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                    <Upload size={18} style={{ color: '#BDBBB3' }} />
                    <div className="text-left">
                      <p className="text-sm" style={{ color: '#6B6F69' }}>Attach your CV</p>
                      <p className="text-xs" style={{ color: '#9A9E97' }}>PDF only, max 5 MB — highly recommended</p>
                    </div>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold" style={{ color: '#1B1D1A' }}>
                    Cover Letter <span className="font-normal" style={{ color: '#9A9E97' }}>(optional)</span>
                  </label>
                  <span className={`text-xs tabular-nums ${coverLetter.length > 1800 ? coverLetter.length >= 2000 ? 'text-red-500' : 'text-yellow-600' : ''}`}
                    style={{ color: coverLetter.length <= 1800 ? '#9A9E97' : undefined }}>
                    {coverLetter.length}/2000
                  </span>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value.slice(0, 2000))}
                  rows={4}
                  maxLength={2000}
                  placeholder="Tell the company why you're the right candidate…"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                  style={{ border: '1px solid #DDDBD2', color: '#1B1D1A', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#1E5B45'}
                  onBlur={e => e.target.style.borderColor = '#DDDBD2'}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={handleApply} disabled={applying || cvUploading}
                  className="px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  style={{ background: '#1E5B45' }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#10342A'; }}
                  onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
                  {cvUploading ? 'Uploading CV…' : applying ? 'Submitting…' : 'Submit Application'}
                </button>
                <button onClick={() => { setShowForm(false); setNewCvFile(null); }}
                  className="px-6 py-2.5 text-sm font-medium rounded-xl transition-colors"
                  style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EFEEE8'; e.currentTarget.style.color = '#1B1D1A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right sidebar ─────────────────────────────── */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 space-y-3 sticky top-6"
            style={{ background: '#fff', border: '1px solid #E7E6DF' }}>

            {existingApp ? (
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                <CheckCircle2 size={16} /> Applied — {existingApp.status}
              </div>
            ) : !showForm ? (
              <button onClick={() => setShowForm(true)}
                className="w-full py-3 text-white font-bold rounded-xl text-sm transition-colors"
                style={{ background: '#1E5B45' }}
                onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
                onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
                Apply Now
              </button>
            ) : null}

            <button onClick={handleBookmark} disabled={bookmarking}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all"
              style={bookmarked
                ? { background: '#EDF2EE', borderColor: '#C4DBCE', color: '#1E5B45' }
                : { background: '#F6F5F1', borderColor: '#DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { if (!bookmarked) { e.currentTarget.style.background = '#EFEEE8'; e.currentTarget.style.color = '#1B1D1A'; } }}
              onMouseLeave={e => { if (!bookmarked) { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; } }}>
              <Bookmark size={15} className={bookmarked ? 'fill-current' : ''} />
              {bookmarked ? 'Saved' : 'Save Offer'}
            </button>

            <button onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all"
              style={{ background: '#F6F5F1', borderColor: '#DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EFEEE8'; e.currentTarget.style.color = '#1B1D1A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F6F5F1'; e.currentTarget.style.color = '#6B6F69'; }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
              }}>
              <Share2 size={15} /> Share
            </button>

            <div className="pt-4 mt-1 space-y-3" style={{ borderTop: '1px solid #F0F0EA' }}>
              <InfoRow label="Domain"       value={offer.domain} />
              <InfoRow label="Duration"     value={`${offer.durationWeeks} weeks`} />
              <InfoRow label="Location"     value={offer.location} />
              <InfoRow label="Openings"     value={offer.openings} />
              <InfoRow label="Start Date"   value={offer.startDate ? formatDate(offer.startDate) : 'Flexible'} />
              <InfoRow label="Deadline"     value={formatDate(offer.deadline)} />
              <InfoRow label="Compensation" value={offer.isPaid ? `${offer.stipendCurrency} ${Number(offer.stipendAmount).toLocaleString()}/mo` : 'Unpaid'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inline match breakdown panel ──────────────────────────────────────────────

function MatchPanel({ match }) {
  const { score, verdict, strengths, gaps, tip, breakdown, warning } = match;
  const scoreNum = Math.round(score);
  const verdictColor =
    score >= 85 ? '#1E5B45' :
    score >= 70 ? '#B45309' :
    score >= 50 ? '#C2410C' : '#6B6F69';
  const scoreBg =
    score >= 85 ? { bg: '#EDF2EE', border: '#C4DBCE' } :
    score >= 70 ? { bg: '#FFFBEB', border: '#FDE68A' } :
    score >= 50 ? { bg: '#FFF7ED', border: '#FED7AA' } :
                  { bg: '#F6F5F1', border: '#E7E6DF' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: '#fff', border: '1px solid #E7E6DF' }}
    >
      {/* Blocking condition warning */}
      {warning && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
          <p className="text-xs leading-relaxed font-medium" style={{ color: '#92400E' }}>{warning}</p>
        </div>
      )}

      {/* Hero row */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl"
          style={{ background: scoreBg.bg, border: `1px solid ${scoreBg.border}` }}>
          <span className="text-2xl font-black tabular-nums" style={{ color: verdictColor }}>{scoreNum}%</span>
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: verdictColor, opacity: 0.7 }}>match</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9A9E97' }}>Why this matches you</p>
          <p className="text-lg font-black" style={{ color: verdictColor }}>{verdict}</p>
          {tip && <p className="text-xs mt-1 leading-snug max-w-xs" style={{ color: '#6B6F69' }}>{tip}</p>}
        </div>
      </div>

      {/* Per-factor bars */}
      {breakdown && (
        <div className="space-y-2.5">
          {FACTORS.map(({ key, label, weight }) => {
            const v = Math.max(0, Math.min(1, breakdown[key]?.score ?? 0));
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: '#6B6F69' }}>
                    {label} <span style={{ color: '#BDBBB3' }}>· {weight}</span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: '#1B1D1A' }}>{Math.round(v * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: barColor(v) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Skill chips */}
      {(breakdown?.skills?.matched?.length > 0 || breakdown?.skills?.missing?.length > 0) && (
        <div className="flex flex-wrap gap-1.5 pt-1" style={{ borderTop: '1px solid #F0F0EA' }}>
          {(breakdown.skills.matched || []).map(s => (
            <span key={`m-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
              <Check size={9} /> {s}
            </span>
          ))}
          {(breakdown.skills.missing || []).map(s => (
            <span key={`x-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{ border: '1px solid #DDDBD2', color: '#9A9E97' }}>
              <X size={9} /> {s}
            </span>
          ))}
        </div>
      )}

      {/* Strengths + gaps */}
      {(strengths?.length > 0 || gaps?.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4 pt-1" style={{ borderTop: '1px solid #F0F0EA' }}>
          {strengths?.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#BDBBB3' }}>Strengths</p>
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: '#6B6F69' }}>
                  <TrendingUp size={11} className="mt-0.5 flex-shrink-0" style={{ color: '#1E5B45' }} />{s}
                </div>
              ))}
            </div>
          )}
          {gaps?.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#BDBBB3' }}>Gaps</p>
              {gaps.map((g, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: '#6B6F69' }}>
                  <TrendingDown size={11} className="mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />{g}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tip && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl"
          style={{ background: '#FFFDF0', border: '1px solid #F0E8BE' }}>
          <Lightbulb size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#6B6F69' }}>{tip}</p>
        </div>
      )}
    </motion.div>
  );
}

function Section({ title, children, first = false }) {
  return (
    <div className={`space-y-2 ${first ? '' : 'pt-4'}`}
      style={first ? {} : { borderTop: '1px solid #F0F0EA' }}>
      <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>{title}</h3>
      {children}
    </div>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#6B6F69' }}>
      <Icon size={11} style={{ color: '#9A9E97' }} />{children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span style={{ color: '#9A9E97' }}>{label}</span>
      <span className="font-medium" style={{ color: '#1B1D1A' }}>{value}</span>
    </div>
  );
}
