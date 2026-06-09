import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Clock, Banknote, Building2, Calendar,
  Users, Bookmark, Share2, CheckCircle2, Sparkles, Loader2,
  TrendingUp, TrendingDown, Lightbulb, FileCheck, Upload, FileText, ShieldCheck,
} from 'lucide-react';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import { uploadApi } from '../../api/upload';
import { aiApi } from '../../api/ai';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function StudentOfferDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const qc        = useQueryClient();

  const [coverLetter,   setCoverLetter]   = useState('');
  const [showForm,      setShowForm]      = useState(false);
  const [applying,      setApplying]      = useState(false);
  const [bookmarking,   setBookmarking]   = useState(false);
  const [aiMatch,       setAiMatch]       = useState(null);
  const [loadingMatch,  setLoadingMatch]  = useState(false);
  const [newCvFile,     setNewCvFile]     = useState(null);
  const [cvUploading,   setCvUploading]   = useState(false);
  const cvInputRef = useRef(null);

  const hasProfileCv = !!user?.studentProfile?.cvUrl;

  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn:  () => offersApi.getOne(id).then(r => r.data.data),
  });

  // Determine if already applied
  const { data: myApps } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my().then(r => r.data.data || []),
  });
  const existingApp = myApps?.find(a => a.offerId === id || a.offer?.id === id);

  // Bookmark status — derived from query data (onSuccess removed in TanStack Query v5)
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  () => offersApi.bookmarks().then(r => r.data.data || []),
  });
  const bookmarked = bookmarksData?.some(o => o.id === id) ?? false;

  const handleCvFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewCvFile(file);
    e.target.value = '';
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      let cvSnapshotUrl;
      if (newCvFile) {
        setCvUploading(true);
        await uploadApi.cv(newCvFile);
        setCvUploading(false);
        cvSnapshotUrl = `${user.id}.pdf`;
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
      if (bookmarked) {
        await offersApi.unbookmark(id);
        toast.success('Removed from saved');
      } else {
        await offersApi.bookmark(id);
        toast.success('Offer saved!');
      }
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    } catch { toast.error('Could not update saved offers'); }
    finally { setBookmarking(false); }
  };

  const handleAiMatch = async () => {
    setLoadingMatch(true);
    try {
      const r = await aiApi.matchOffer(id);
      setAiMatch(r.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI match failed');
    } finally { setLoadingMatch(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Could not copy'));
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!offer)    return <p className="text-white/40 text-sm">Offer not found.</p>;

  return (
    <div className="max-w-5xl space-y-0">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} /> Back to offers
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-brand-800/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {offer.company?.logoUrl
                  ? <img src={offer.company.logoUrl} alt="" className="w-full h-full object-contain" />
                  : <Building2 size={24} className="text-brand-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-white leading-snug">{offer.title}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-white/50 text-sm">{offer.company?.companyName}</p>
                  {offer.company?.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] text-lime-400 bg-lime-500/10 px-1.5 py-0.5 rounded-full font-semibold border border-lime-500/20">
                      <ShieldCheck size={9} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Chip icon={MapPin}>{offer.location}</Chip>
                  <Chip icon={Clock}>{offer.durationWeeks} weeks</Chip>
                  {offer.isPaid && (
                    <Chip icon={Banknote}>
                      {offer.stipendCurrency} {Number(offer.stipendAmount).toLocaleString()}/mo
                    </Chip>
                  )}
                  <Chip icon={Users}>{offer.openings} opening{offer.openings !== 1 ? 's' : ''}</Chip>
                  <Chip icon={Calendar}>Deadline {formatDate(offer.deadline)}</Chip>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 space-y-5">
            <Section title="About the role">
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{offer.description}</p>
            </Section>
            {offer.responsibilities && (
              <Section title="Responsibilities">
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{offer.responsibilities}</p>
              </Section>
            )}
            {offer.requirements && (
              <Section title="Requirements">
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{offer.requirements}</p>
              </Section>
            )}
            {offer.requiredSkills?.length > 0 && (
              <Section title="Required Skills">
                <div className="flex flex-wrap gap-2">
                  {offer.requiredSkills.map(s => (
                    <span key={s} className="px-3 py-1 bg-lime-500/10 text-lime-400 border border-lime-500/20 rounded-lg text-xs font-medium">{s}</span>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Apply form */}
          {showForm && (
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 space-y-5">
              <h3 className="font-semibold text-white text-base">Complete Your Application</h3>

              {/* CV section */}
              <input ref={cvInputRef} type="file" accept=".pdf" className="hidden" onChange={handleCvFileChange} />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">CV / Resume</label>
                {newCvFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-lime-500/10 border border-lime-500/20">
                    <FileCheck size={16} className="text-lime-400 flex-shrink-0" />
                    <span className="text-sm text-lime-400 flex-1 truncate">{newCvFile.name}</span>
                    <button type="button" onClick={() => setNewCvFile(null)}
                      className="text-xs text-white/30 hover:text-white transition-colors">Remove</button>
                  </div>
                ) : hasProfileCv ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <FileCheck size={16} className="text-lime-400 flex-shrink-0" />
                    <span className="text-sm text-white/70 flex-1">Your profile CV will be included</span>
                    <button type="button" onClick={() => cvInputRef.current?.click()}
                      className="text-xs text-lime-400 hover:text-lime-300 transition-colors">Replace</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => cvInputRef.current?.click()}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-lime-500/30 transition-colors group">
                    <Upload size={18} className="text-white/30 group-hover:text-lime-400 transition-colors" />
                    <div className="text-left">
                      <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">Attach your CV</p>
                      <p className="text-xs text-white/25">PDF only, max 5 MB — highly recommended</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Cover letter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  Cover Letter <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Tell the company why you're the right candidate for this role…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={handleApply} disabled={applying || cvUploading}
                  className="px-6 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                  {cvUploading ? 'Uploading CV…' : applying ? 'Submitting…' : 'Submit Application'}
                </button>
                <button onClick={() => { setShowForm(false); setNewCvFile(null); }}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5 space-y-3 sticky top-6">

            {/* Apply / Applied button */}
            {existingApp ? (
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 text-sm font-semibold">
                <CheckCircle2 size={16} />
                Applied — {existingApp.status}
              </div>
            ) : !showForm ? (
              <button onClick={() => setShowForm(true)}
                className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl transition-colors text-sm">
                Apply Now
              </button>
            ) : null}

            {/* Bookmark */}
            <button onClick={handleBookmark} disabled={bookmarking}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all ${bookmarked ? 'bg-lime-500/10 border-lime-500/20 text-lime-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
              <Bookmark size={15} className={bookmarked ? 'fill-lime-400' : ''} />
              {bookmarked ? 'Saved' : 'Save Offer'}
            </button>

            {/* Share */}
            <button onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm font-medium transition-all">
              <Share2 size={15} /> Share
            </button>

            {/* Info rows */}
            <div className="pt-4 mt-2 border-t border-white/5 space-y-3">
              <InfoRow label="Domain"       value={offer.domain} />
              <InfoRow label="Duration"     value={`${offer.durationWeeks} weeks`} />
              <InfoRow label="Location"     value={offer.location} />
              <InfoRow label="Openings"     value={offer.openings} />
              <InfoRow label="Start Date"   value={offer.startDate ? formatDate(offer.startDate) : 'Flexible'} />
              <InfoRow label="Deadline"     value={formatDate(offer.deadline)} />
              <InfoRow label="Compensation" value={offer.isPaid ? `${offer.stipendCurrency} ${Number(offer.stipendAmount).toLocaleString()}/mo` : 'Unpaid'} />
            </div>

            {/* AI Match */}
            <div className="pt-4 border-t border-white/5">
              {!aiMatch ? (
                <button onClick={handleAiMatch} disabled={loadingMatch}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-xs font-semibold transition-all disabled:opacity-50">
                  {loadingMatch
                    ? <><Loader2 size={13} className="animate-spin" /> Analysing…</>
                    : <><Sparkles size={13} /> Check AI Match Score</>}
                </button>
              ) : (
                <AiMatchPanel match={aiMatch} onReset={() => setAiMatch(null)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCORE_COLOR = (s) => s >= 75 ? 'text-lime-400' : s >= 50 ? 'text-yellow-400' : s >= 30 ? 'text-orange-400' : 'text-red-400';
const SCORE_BG    = (s) => s >= 75 ? 'bg-lime-500/10 border-lime-500/20' : s >= 50 ? 'bg-yellow-500/10 border-yellow-500/20' : s >= 30 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-red-500/10 border-red-500/20';

function AiMatchPanel({ match, onReset }) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${SCORE_BG(match.score)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className={SCORE_COLOR(match.score)} />
          <span className="text-xs font-semibold text-white/70">AI Match Score</span>
        </div>
        <button onClick={onReset} className="text-white/20 hover:text-white/50 text-xs transition-colors">↻</button>
      </div>

      <div className="flex items-end gap-2">
        <span className={`text-3xl font-black ${SCORE_COLOR(match.score)}`}>{match.score}</span>
        <span className="text-white/30 text-sm mb-1">/100</span>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${SCORE_BG(match.score)} ${SCORE_COLOR(match.score)}`}>
          {match.verdict}
        </span>
      </div>

      {/* Score bar */}
      <div className="h-1.5 bg-white/10 rounded-full">
        <div className={`h-full rounded-full transition-all ${match.score >= 75 ? 'bg-lime-500' : match.score >= 50 ? 'bg-yellow-500' : match.score >= 30 ? 'bg-orange-500' : 'bg-red-500'}`}
          style={{ width: `${match.score}%` }} />
      </div>

      {match.strengths?.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide">Strengths</p>
          {match.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-white/60">
              <TrendingUp size={11} className="text-lime-400 mt-0.5 flex-shrink-0" />{s}
            </div>
          ))}
        </div>
      )}

      {match.gaps?.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide">Gaps</p>
          {match.gaps.map((g, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-white/60">
              <TrendingDown size={11} className="text-red-400 mt-0.5 flex-shrink-0" />{g}
            </div>
          ))}
        </div>
      )}

      {match.tip && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
          <Lightbulb size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">{match.tip}</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2 pt-4 first:pt-0 border-t border-white/5 first:border-t-0">
      <h3 className="font-semibold text-white text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 text-white/60 rounded-lg text-xs font-medium">
      <Icon size={11} className="text-white/30" />{children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white/30">{label}</span>
      <span className="font-medium text-white/70">{value}</span>
    </div>
  );
}
