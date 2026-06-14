import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Clock, SlidersHorizontal, X,
  Banknote, ShieldCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { offersApi } from '../../api/offers';
import { formatDate } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';

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
  const [searchParams] = useSearchParams();

  const [search,          setSearch]          = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [domain,          setDomain]          = useState('');
  const [location,        setLocation]        = useState('');
  const [page,            setPage]            = useState(1);

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

  const rawOffers = data?.offers || [];
  const total     = data?.total  || 0;
  const pages     = Math.ceil(total / LIMIT);

  // Sort by match score descending when the backend returns scores
  const offers = [...rawOffers].sort((a, b) => (b.match?.score ?? -1) - (a.match?.score ?? -1));

  const activeFilters = [
    domain   && { key: 'domain',   label: domain,   clear: () => { setDomain('');   setPage(1); } },
    location && { key: 'location', label: location, clear: () => { setLocation(''); setPage(1); } },
    debouncedSearch && { key: 'search', label: `"${debouncedSearch}"`, clear: () => { setSearch(''); setDebouncedSearch(''); setPage(1); } },
  ].filter(Boolean);

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
        {/* Search */}
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

        <select value={domain} onChange={e => { setDomain(e.target.value); setPage(1); }}
          className={selectCls}
          style={{ background: '#fff', border: `1px solid ${domain ? '#1E5B45' : '#DDDBD2'}`, color: domain ? '#1B1D1A' : '#9A9E97' }}>
          <option value="">All domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={location} onChange={e => { setLocation(e.target.value); setPage(1); }}
          className={selectCls}
          style={{ background: '#fff', border: `1px solid ${location ? '#1E5B45' : '#DDDBD2'}`, color: location ? '#1B1D1A' : '#9A9E97' }}>
          <option value="">All cities</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
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
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setDomain(''); setLocation(''); setPage(1); }}
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
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setDomain(''); setLocation(''); setPage(1); }}
              className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={`grid sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isFetching && data ? 'opacity-60' : 'opacity-100'}`}>
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} onClick={() => navigate(`/student/offers/${offer.id}`)} />
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

function OfferCard({ offer, onClick }) {
  const match = offer.match;

  const deadline       = offer.deadline ? new Date(offer.deadline) : null;
  const daysLeft       = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

  const companyName    = offer.company?.companyName || '';
  const companyInitial = companyName[0]?.toUpperCase() ?? '?';
  const avatarIdx      = (companyInitial.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const avatarColor    = AVATAR_COLORS[avatarIdx];

  const matchStyle = match ? MATCH_STYLE(match.score) : null;

  return (
    <div onClick={onClick}
      className="group rounded-2xl cursor-pointer overflow-hidden transition-all"
      style={{ background: '#fff', border: '1px solid #E7E6DF' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4DBCE'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,91,69,.07)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E6DF'; e.currentTarget.style.boxShadow = 'none'; }}>

      {isExpiringSoon && (
        <div className="h-0.5 animate-pulse" style={{ background: '#F59E0B' }} />
      )}

      <div className="p-5 flex flex-col gap-3">
        {/* Match badge + reason chips */}
        {match && (
          <div className="flex flex-wrap items-center gap-1.5 -mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: matchStyle.bg, border: `1px solid ${matchStyle.border}`, color: matchStyle.text }}>
              {match.score}% · {MATCH_LABEL(match.score)}
            </span>
            {(match.strengths || []).slice(0, 2).map((s, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#6B6F69' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Company + title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: offer.company?.logoUrl ? '#F6F5F1' : avatarColor.bg, border: '1px solid #F0F0EA' }}>
            {offer.company?.logoUrl
              ? <img src={offer.company.logoUrl} alt="" className="w-full h-full object-contain" />
              : <span className="text-sm font-black" style={{ color: avatarColor.text }}>{companyInitial}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs font-medium truncate" style={{ color: '#9A9E97' }}>{companyName}</p>
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
            <span className={`text-xs ${isExpiringSoon ? 'font-semibold' : ''}`}
              style={{ color: isExpiringSoon ? '#D97706' : '#C0BFBA' }}>
              {isExpiringSoon
                ? daysLeft === 0 ? 'Closes today' : `${daysLeft}d left`
                : formatDate(offer.deadline)}
            </span>
          )}
        </div>
      </div>
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
