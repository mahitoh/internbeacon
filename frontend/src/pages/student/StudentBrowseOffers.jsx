import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, SlidersHorizontal, X, Check, Users, Calendar,
  Banknote, ShieldCheck, ChevronLeft, ChevronRight, Building2,
  Bookmark, ExternalLink, CheckCircle2,
} from 'lucide-react';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import { formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import SelectField from '../../components/ui/SelectField';
import toast from 'react-hot-toast';

const DOMAINS   = ['Information Technology','Finance & Banking','Telecommunications','Marketing & Sales','Engineering','Human Resources','Healthcare','Agriculture','Other'];
const LOCATIONS = ['Yaoundé','Douala','Bafoussam','Garoua','Bamenda','Remote'];
const LIMIT     = 12;

const MATCH_STYLE = (score) => {
  if (score >= 85) return { bg: '#EDF2EE', border: '#C4DBCE', text: '#1E5B45' };
  if (score >= 70) return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' };
  if (score >= 50) return { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' };
  return { bg: '#F6F5F1', border: '#E7E6DF', text: '#6B6F69' };
};

const MATCH_LABEL = (score) => {
  if (score >= 85) return 'Excellent fit';
  if (score >= 70) return 'Good fit';
  if (score >= 50) return 'Moderate fit';
  return 'Low fit';
};

export default function StudentBrowseOffers() {
  const navigate       = useNavigate();
  const qc             = useQueryClient();
  const [searchParams] = useSearchParams();

  const [search,          setSearch]          = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [domain,          setDomain]          = useState('');
  const [location,        setLocation]        = useState('');
  const [page,            setPage]            = useState(1);
  const [quickViewId,     setQuickViewId]     = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['offers-browse', debouncedSearch, domain, location, page],
    queryFn: () => offersApi.list({
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(domain   ? { domain }   : {}),
      ...(location ? { location } : {}),
      page, limit: LIMIT,
    }).then(r => ({ offers: r.data.data || [], total: r.data.meta?.total || 0 })),
    placeholderData: prev => prev,
  });

  // Backend already ranks best-match-first across the whole result set.
  const offers = data?.offers || [];
  const total  = data?.total  || 0;
  const pages  = Math.ceil(total / LIMIT);

  const { data: myApps } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my({ limit: 100 }).then(r => r.data.data || []),
    staleTime: 60_000,
  });
  const appliedIds = new Set((myApps || []).map(a => a.offerId || a.offer?.id));

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  () => offersApi.bookmarks().then(r => r.data.data || []),
  });
  const isBookmarked = (id) => bookmarksData?.some(o => o.id === id) ?? false;

  const toggleBookmark = async (id, e) => {
    e?.stopPropagation();
    const wasSaved = isBookmarked(id);
    try {
      wasSaved ? await offersApi.unbookmark(id) : await offersApi.bookmark(id);
      toast.success(wasSaved ? 'Removed from saved' : 'Offer saved!');
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    } catch { toast.error('Could not update saved offers'); }
  };

  const activeFilters = [
    domain   && { key: 'domain',   label: domain,   clear: () => { setDomain('');   setPage(1); } },
    location && { key: 'location', label: location, clear: () => { setLocation(''); setPage(1); } },
    debouncedSearch && { key: 'search', label: `"${debouncedSearch}"`, clear: () => { setSearch(''); setDebouncedSearch(''); setPage(1); } },
  ].filter(Boolean);

  const clearAll = () => { setSearch(''); setDebouncedSearch(''); setDomain(''); setLocation(''); setPage(1); };
  const selectCls = 'rounded-xl px-4 py-2.5 text-sm focus:outline-none appearance-none min-w-[160px] transition-colors pr-8';

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Browse Internships</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
          {total > 0
            ? <><span className="font-semibold" style={{ color: '#1B1D1A' }}>{total}</span> open position{total !== 1 ? 's' : ''}</>
            : 'Find your next internship'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] rounded-xl px-4 py-2.5 transition-colors"
          style={{ background: '#fff', border: '1px solid #DDDBD2' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#1E5B45'}
          onBlurCapture={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
          <Search size={14} style={{ color: '#A4A89F', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, company, keyword…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#1B1D1A' }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(1); }}
              style={{ color: '#C0BFBA' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
              onMouseLeave={e => e.currentTarget.style.color = '#C0BFBA'}>
              <X size={13} />
            </button>
          )}
        </div>

        <SelectField bare value={domain} onChange={e => { setDomain(e.target.value); setPage(1); }}
          className={selectCls}
          style={{ background: '#fff', border: `1px solid ${domain ? '#1E5B45' : '#DDDBD2'}`, color: domain ? '#1B1D1A' : '#9A9E97' }}>
          <option value="">All domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </SelectField>

        <SelectField bare value={location} onChange={e => { setLocation(e.target.value); setPage(1); }}
          className={selectCls}
          style={{ background: '#fff', border: `1px solid ${location ? '#1E5B45' : '#DDDBD2'}`, color: location ? '#1B1D1A' : '#9A9E97' }}>
          <option value="">All cities</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </SelectField>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium" style={{ color: '#9A9E97' }}>Filtered by:</span>
          {activeFilters.map(f => (
            <button key={f.key} onClick={f.clear}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#FECACA'; e.currentTarget.style.color = '#DC2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#EDF2EE'; e.currentTarget.style.borderColor = '#C4DBCE'; e.currentTarget.style.color = '#1E5B45'; }}>
              {f.label} <X size={10} />
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button onClick={clearAll}
              className="text-xs underline underline-offset-2"
              style={{ color: '#9A9E97' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
              onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {isLoading && !data ? (
        <div className="flex justify-center py-24"><Spinner /></div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24" style={{ color: '#C0BFBA' }}>
          <SlidersHorizontal size={36} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No internships match your filters</p>
          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={`grid sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isFetching && data ? 'opacity-60' : 'opacity-100'}`}>
            {offers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                applied={appliedIds.has(offer.id)}
                bookmarked={isBookmarked(offer.id)}
                onBookmark={(e) => toggleBookmark(offer.id, e)}
                onClick={() => setQuickViewId(offer.id)}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-30 transition-colors"
                style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = '#1E5B45'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-sm px-2" style={{ color: '#9A9E97' }}>{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-30 transition-colors"
                style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#6B6F69' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.borderColor = '#1E5B45'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Quick-view drawer */}
      <QuickViewDrawer
        offerId={quickViewId}
        onClose={() => setQuickViewId(null)}
        applied={quickViewId ? appliedIds.has(quickViewId) : false}
        appliedStatus={quickViewId ? (myApps || []).find(a => (a.offerId || a.offer?.id) === quickViewId)?.status : null}
        bookmarked={quickViewId ? isBookmarked(quickViewId) : false}
        onBookmark={(e) => quickViewId && toggleBookmark(quickViewId, e)}
        onOpenFull={() => { if (quickViewId) { const id = quickViewId; setQuickViewId(null); navigate(`/student/offers/${id}`); } }}
      />
    </div>
  );
}

const AVATAR_COLORS = [
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#D1FAE5', text: '#065F46' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EDE9FE', text: '#4C1D95' },
  { bg: '#FEE2E2', text: '#991B1B' },
  { bg: '#E0F2FE', text: '#075985' },
];

function CompanyLogo({ company, size = 10 }) {
  const name    = company?.companyName || '';
  const initial = name[0]?.toUpperCase() ?? '?';
  const color   = AVATAR_COLORS[(initial.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const dim     = `${size * 4}px`;
  return (
    <div className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: dim, height: dim, background: company?.logoUrl ? '#F6F5F1' : color.bg, border: '1px solid #F0F0EA' }}>
      {company?.logoUrl
        ? <img src={company.logoUrl} alt="" className="w-full h-full object-contain" />
        : <span className="font-black" style={{ color: color.text, fontSize: size > 11 ? 18 : 14 }}>{initial}</span>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function OfferCard({ offer, applied, bookmarked, onBookmark, onClick }) {
  const match    = offer.match;
  const ms        = match ? MATCH_STYLE(match.score) : null;
  const deadline = offer.deadline ? new Date(offer.deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
  const expiring = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

  return (
    <div onClick={onClick}
      className="group relative rounded-2xl cursor-pointer overflow-hidden transition-all"
      style={{ background: '#fff', border: '1px solid #E7E6DF' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4DBCE'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,91,69,.07)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E6DF'; e.currentTarget.style.boxShadow = 'none'; }}>

      {expiring && <div className="h-0.5 animate-pulse" style={{ background: '#F59E0B' }} />}

      {/* Save quick-action */}
      <button onClick={onBookmark}
        title={bookmarked ? 'Saved' : 'Save offer'}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={bookmarked
          ? { background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }
          : { background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}
        onMouseEnter={e => { if (!bookmarked) { e.currentTarget.style.color = '#1E5B45'; e.currentTarget.style.borderColor = '#C4DBCE'; } }}
        onMouseLeave={e => { if (!bookmarked) { e.currentTarget.style.color = '#C0BFBA'; e.currentTarget.style.borderColor = '#E7E6DF'; } }}>
        <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
      </button>

      <div className="p-5 flex flex-col gap-3">
        {/* Match + applied row */}
        <div className="flex flex-wrap items-center gap-1.5 pr-10">
          {match && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: ms.bg, border: `1px solid ${ms.border}`, color: ms.text }}>
              {match.score}% · {MATCH_LABEL(match.score)}
            </span>
          )}
          {applied && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
              <CheckCircle2 size={10} /> Applied
            </span>
          )}
        </div>

        {/* Company + title */}
        <div className="flex items-start gap-3">
          <CompanyLogo company={offer.company} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs font-medium truncate" style={{ color: '#9A9E97' }}>{offer.company?.companyName}</p>
              {offer.company?.isVerified && <ShieldCheck size={11} style={{ color: '#1E5B45', flexShrink: 0 }} />}
            </div>
            <h3 className="font-bold text-[15px] leading-snug line-clamp-2" style={{ color: '#1B1D1A' }}>
              {offer.title}
            </h3>
          </div>
        </div>

        {/* Key facts */}
        <div className="flex flex-wrap gap-1.5">
          <Chip icon={MapPin}>{offer.location}</Chip>
          <Chip icon={Clock}>{offer.durationWeeks}w</Chip>
          {offer.isPaid && (
            <Chip icon={Banknote} accent>
              {offer.stipendCurrency} {Number(offer.stipendAmount || 0).toLocaleString()}/mo
            </Chip>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F0F0EA' }}>
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
            style={{ background: '#F6F5F1', color: '#9A9E97' }}>
            {offer.domain}
          </span>
          {deadline && (
            <span className={`text-xs ${expiring ? 'font-semibold' : ''}`}
              style={{ color: expiring ? '#D97706' : '#C0BFBA' }}>
              {expiring
                ? daysLeft === 0 ? 'Closes today' : `${daysLeft}d left`
                : formatDate(offer.deadline)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quick-view slide-over ─────────────────────────────────────────────────────
function QuickViewDrawer({ offerId, onClose, applied, appliedStatus, bookmarked, onBookmark, onOpenFull }) {
  const { data: offer, isLoading } = useQuery({
    queryKey: ['offer', offerId],
    queryFn:  () => offersApi.getOne(offerId).then(r => r.data.data),
    enabled:  !!offerId,
  });

  // Close on Escape
  useEffect(() => {
    if (!offerId) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [offerId, onClose]);

  const match = offer?.match;
  const ms     = match ? MATCH_STYLE(match.score) : null;

  return (
    <AnimatePresence>
      {offerId && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(24,32,24,0.35)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col"
            style={{ background: '#fff', boxShadow: '-8px 0 32px rgba(24,32,24,.12)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}>

            {/* Header bar */}
            <div className="flex items-center justify-between px-5 h-14 flex-shrink-0" style={{ borderBottom: '1px solid #E7E6DF' }}>
              <span className="text-sm font-semibold" style={{ color: '#9A9E97' }}>Quick view</span>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: '#9A9E97' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F0F0EA'; e.currentTarget.style.color = '#1B1D1A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9A9E97'; }}>
                <X size={18} />
              </button>
            </div>

            {isLoading || !offer ? (
              <div className="flex-1 flex items-center justify-center"><Spinner /></div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-5 dashboard-scroll">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <CompanyLogo company={offer.company} size={13} />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-black leading-snug" style={{ color: '#1B1D1A' }}>{offer.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm" style={{ color: '#9A9E97' }}>{offer.company?.companyName}</span>
                        {offer.company?.isVerified && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                            <ShieldCheck size={9} /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key facts */}
                  <div className="flex flex-wrap gap-2">
                    <Chip icon={MapPin}>{offer.location}</Chip>
                    <Chip icon={Clock}>{offer.durationWeeks} weeks</Chip>
                    {offer.isPaid && <Chip icon={Banknote}>{offer.stipendCurrency} {Number(offer.stipendAmount || 0).toLocaleString()}/mo</Chip>}
                    <Chip icon={Users}>{offer.openings} opening{offer.openings !== 1 ? 's' : ''}</Chip>
                    <Chip icon={Calendar}>Deadline {formatDate(offer.deadline)}</Chip>
                  </div>

                  {/* Match summary */}
                  {match && (
                    <div className="rounded-xl p-4" style={{ background: ms.bg, border: `1px solid ${ms.border}` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black tabular-nums" style={{ color: ms.text }}>{match.score}%</span>
                        <div>
                          <p className="text-sm font-bold" style={{ color: ms.text }}>{MATCH_LABEL(match.score)}</p>
                          {match.verdict && <p className="text-xs" style={{ color: '#6B6F69' }}>{match.verdict}</p>}
                        </div>
                      </div>
                      {(match.breakdown?.skills?.matched?.length > 0 || match.breakdown?.skills?.missing?.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(match.breakdown.skills.matched || []).slice(0, 6).map(s => (
                            <span key={`m-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                              style={{ background: '#fff', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                              <Check size={9} /> {s}
                            </span>
                          ))}
                          {(match.breakdown.skills.missing || []).slice(0, 4).map(s => (
                            <span key={`x-${s}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                              style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#9A9E97' }}>
                              <X size={9} /> {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-4">
                    <Section title="About the role" first>
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6F69' }}>{offer.description}</p>
                    </Section>
                    {offer.requirements && (
                      <Section title="Requirements">
                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6F69' }}>{offer.requirements}</p>
                      </Section>
                    )}
                    {offer.requiredSkills?.length > 0 && (
                      <Section title="Required Skills">
                        <div className="flex flex-wrap gap-2">
                          {offer.requiredSkills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                              style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>{s}</span>
                          ))}
                        </div>
                      </Section>
                    )}
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex items-center gap-2 p-4 flex-shrink-0" style={{ borderTop: '1px solid #E7E6DF' }}>
                  {applied ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                      <CheckCircle2 size={15} /> Applied {appliedStatus && <StatusBadge status={appliedStatus} />}
                    </div>
                  ) : (
                    <button onClick={onOpenFull}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white text-sm font-bold rounded-xl transition-colors"
                      style={{ background: '#1E5B45' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
                      onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
                      View details & apply <ExternalLink size={14} />
                    </button>
                  )}
                  <button onClick={onBookmark}
                    title={bookmarked ? 'Saved' : 'Save offer'}
                    className="flex items-center justify-center w-11 h-11 rounded-xl border transition-all flex-shrink-0"
                    style={bookmarked
                      ? { background: '#EDF2EE', borderColor: '#C4DBCE', color: '#1E5B45' }
                      : { background: '#F6F5F1', borderColor: '#DDDBD2', color: '#6B6F69' }}>
                    <Bookmark size={16} className={bookmarked ? 'fill-current' : ''} />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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

function Chip({ icon: Icon, children, accent = false }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
      style={accent
        ? { background: '#EDF2EE', color: '#1E5B45', border: '1px solid #C4DBCE' }
        : { background: '#F6F5F1', color: '#6B6F69', border: '1px solid #E7E6DF' }}>
      <Icon size={10} />{children}
    </span>
  );
}
