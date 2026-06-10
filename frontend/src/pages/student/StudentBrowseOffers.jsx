import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Building2, SlidersHorizontal, X, Sparkles, Loader2, HelpCircle } from 'lucide-react';
import { offersApi } from '../../api/offers';
import { aiApi } from '../../api/ai';
import { formatDate } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const DOMAINS    = ['Information Technology', 'Finance & Banking', 'Telecommunications', 'Marketing & Sales', 'Engineering', 'Human Resources', 'Healthcare', 'Agriculture', 'Other'];
const LOCATIONS  = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Remote'];

export default function StudentBrowseOffers() {
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();
  const matchCache      = useRef({});
  const [search,         setSearch]         = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [domain,         setDomain]         = useState('');
  const [location,       setLocation]       = useState('');
  const [page,           setPage]           = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['offers-browse', debouncedSearch, domain, location, page],
    queryFn:  () => offersApi.list({
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(domain   ? { domain }   : {}),
      ...(location ? { location } : {}),
      page, limit: LIMIT,
    }).then(r => ({ offers: r.data.data || [], total: r.data.meta?.total || 0 })),
    keepPreviousData: true,
  });

  const offers    = data?.offers || [];
  const total     = data?.total  || 0;
  const pages     = Math.ceil(total / LIMIT);
  const hasFilter = search || domain || location;

  const clearFilters = () => { setSearch(''); setDebouncedSearch(''); setDomain(''); setLocation(''); setPage(1); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Browse Internships</h2>
        <p className="text-white/40 text-sm mt-0.5">{total > 0 ? `${total} open position${total !== 1 ? 's' : ''}` : 'Find your next internship'}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[160px] bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5">
          <Search size={15} className="text-white/30 flex-shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or keyword…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>

        <select
          value={domain}
          onChange={e => { setDomain(e.target.value); setPage(1); }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none min-w-[160px]">
          <option value="" className="bg-[#1a1a1a]">All domains</option>
          {DOMAINS.map(d => <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>)}
        </select>

        <select
          value={location}
          onChange={e => { setLocation(e.target.value); setPage(1); }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none min-w-[140px]">
          <option value="" className="bg-[#1a1a1a]">All cities</option>
          {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
        </select>

        {hasFilter && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white bg-[#1a1a1a] border border-white/10 transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/20">
          <SlidersHorizontal size={36} className="mb-3" />
          <p className="text-sm">No internships found</p>
          {hasFilter && <button onClick={clearFilters} className="mt-3 text-lime-400 text-xs hover:underline">Clear filters</button>}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} matchCache={matchCache} onClick={() => navigate(`/student/offers/${offer.id}`)} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white bg-[#1a1a1a] border border-white/10 disabled:opacity-30 transition-colors">
                Previous
              </button>
              <span className="text-sm text-white/40">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white bg-[#1a1a1a] border border-white/10 disabled:opacity-30 transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OfferCard({ offer, matchCache, onClick }) {
  const cached = matchCache.current[offer.id] ?? null;
  const [match,   setMatch]   = useState(cached);   // null | 'loading' | result obj
  const [showTip, setShowTip] = useState(false);

  const deadline       = offer.deadline ? new Date(offer.deadline) : null;
  const daysLeft       = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  const isExpired      = daysLeft !== null && daysLeft < 0;

  const handleCheckMatch = async (e) => {
    e.stopPropagation();
    if (match === 'loading') return;
    setMatch('loading');
    try {
      const r = await aiApi.matchOffer(offer.id);
      const result = r.data.data;
      matchCache.current[offer.id] = result;
      setMatch(result);
    } catch (err) {
      setMatch(null);
      toast.error(err.response?.data?.message || 'Match check failed — make sure your CV is uploaded');
    }
  };

  const scoreColor = (s) =>
    s >= 70 ? 'text-lime-400 bg-lime-500/10 border-lime-500/20'
    : s >= 45 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';

  const companyInitial = offer.company?.companyName?.[0]?.toUpperCase() ?? '?';
  const initBgColors   = ['bg-violet-500/20','bg-blue-500/20','bg-lime-500/20','bg-orange-500/20','bg-pink-500/20'];
  const initColor      = initBgColors[(companyInitial.charCodeAt(0) || 0) % initBgColors.length];

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-lime-500/20 hover:bg-[#1f1f1f] transition-all cursor-pointer p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${offer.company?.logoUrl ? 'bg-white/5' : initColor}`}>
          {offer.company?.logoUrl
            ? <img src={offer.company.logoUrl} alt="" className="w-full h-full object-contain" />
            : <span className="text-sm font-black text-white/80">{companyInitial}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{offer.title}</h3>
          <p className="text-white/40 text-xs mt-0.5 truncate">{offer.company?.companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Tag icon={MapPin}>{offer.location}</Tag>
        <Tag icon={Clock}>{offer.durationWeeks}w</Tag>
        {offer.isPaid && <span className="px-2 py-0.5 bg-lime-500/10 text-lime-400 text-xs rounded-md font-medium">Paid</span>}
        {isExpiringSoon && !isExpired && (
          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 text-xs rounded-md font-semibold">
            {daysLeft === 0 ? 'Closes today' : `${daysLeft}d left`}
          </span>
        )}
      </div>

      {/* AI match score — shown after check, stays visible */}
      {match && match !== 'loading' && (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreColor(match.score)}`}>
            <Sparkles size={10} />
            {match.score}% match
          </span>
          <span className="text-xs text-white/40 truncate flex-1">{match.verdict}</span>
          <button
            onClick={handleCheckMatch}
            className="text-white/20 hover:text-violet-400 transition-colors flex-shrink-0"
            title="Re-check match"
          >
            <Sparkles size={11} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-xs text-white/30">{offer.domain}</span>

        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {/* Deadline always visible */}
          {deadline && !isExpired && (
            <span className={`text-xs ${isExpiringSoon ? 'text-amber-400 font-semibold' : 'text-white/30'}`}>
              {formatDate(offer.deadline)}
            </span>
          )}

          {match === 'loading' ? (
            <span className="flex items-center gap-1 text-xs text-violet-400">
              <Loader2 size={11} className="animate-spin" /> Checking…
            </span>
          ) : !match ? (
            <div className="relative flex items-center gap-1">
              <button
                onClick={handleCheckMatch}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 text-xs font-semibold transition-all"
              >
                <Sparkles size={10} /> Check Match
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowTip(v => !v); }}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <HelpCircle size={13} />
              </button>
              {showTip && (
                <div className="absolute bottom-8 right-0 w-52 p-2.5 rounded-xl bg-[#252525] border border-white/10 text-[11px] text-white/60 leading-relaxed z-10 shadow-xl">
                  AI compares your profile — skills, programme, experience — against this offer's requirements and gives a compatibility score from 0–100.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-white/50 text-xs rounded-md">
      <Icon size={10} />{children}
    </span>
  );
}
