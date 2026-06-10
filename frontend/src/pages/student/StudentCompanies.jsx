import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, MapPin, Briefcase, Search, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { companiesApi } from '../../api/companies';
import Spinner from '../../components/ui/Spinner';

const SECTORS = [
  'Information Technology', 'Finance & Banking', 'Telecommunications',
  'Marketing & Sales', 'Engineering', 'Healthcare', 'Education',
  'Oil & Gas', 'Agriculture', 'Other',
];
const CITIES = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Bamenda', 'Ngaoundéré', 'Bertoua', 'Maroua'];

const INITIAL_COLORS = [
  'bg-violet-500/20 text-violet-300', 'bg-blue-500/20 text-blue-300',
  'bg-lime-500/20 text-lime-300',     'bg-orange-500/20 text-orange-300',
  'bg-pink-500/20 text-pink-300',     'bg-indigo-500/20 text-indigo-300',
];
const initColor = (name) => INITIAL_COLORS[(name || '?').charCodeAt(0) % INITIAL_COLORS.length];

export default function StudentCompanies() {
  const [searchParams] = useSearchParams();
  const [search,   setSearch]   = useState(searchParams.get('search')  || '');
  const [sector,   setSector]   = useState(searchParams.get('sector')  || '');
  const [city,     setCity]     = useState(searchParams.get('city')    || '');
  const [verified, setVerified] = useState(false);
  const [page,     setPage]     = useState(1);
  const [debounced, setDebounced] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [sector, city, verified]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['companies', { search: debounced, sector, city, verified, page }],
    queryFn:  () => companiesApi.list({
      search:   debounced  || undefined,
      sector:   sector     || undefined,
      city:     city       || undefined,
      verified: verified   || undefined,
      page,
      limit: 12,
    }).then(r => r.data.data),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });

  const companies  = data?.companies || [];
  const total      = data?.total     || 0;
  const totalPages = data?.pages     || 1;

  const hasFilter = search || sector || city || verified;
  const resetFilters = () => { setSearch(''); setSector(''); setCity(''); setVerified(false); };

  return (
    <div className="space-y-5">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/40"
          />
        </div>
        <select value={sector} onChange={e => setSector(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/40 appearance-none">
          <option value="" className="bg-[#1a1a1a]">All sectors</option>
          {SECTORS.map(s => <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>)}
        </select>
        <select value={city} onChange={e => setCity(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/40 appearance-none">
          <option value="" className="bg-[#1a1a1a]">All cities</option>
          {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
        </select>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors select-none">
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} className="accent-lime-500" />
          <ShieldCheck size={13} className={verified ? 'text-lime-400' : 'text-white/30'} />
          Verified
        </label>
        {hasFilter && (
          <button onClick={resetFilters}
            className="px-3 py-2.5 rounded-xl border border-white/10 text-sm text-white/40 hover:text-white transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* Count line */}
      {!isLoading && (
        <p className="text-white/30 text-xs">
          {total} {total === 1 ? 'company' : 'companies'}{hasFilter ? ' matching filters' : ''}
          {isFetching && ' · refreshing…'}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30 bg-[#1a1a1a] rounded-2xl border border-white/5">
          <Building2 size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No companies found</p>
          {hasFilter && <button onClick={resetFilters} className="mt-3 text-lime-400 text-xs hover:underline">Clear filters</button>}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map(company => {
              const initial   = (company.companyName || '?')[0].toUpperCase();
              const colorCls  = initColor(company.companyName);
              return (
                <Link
                  key={company.id}
                  to={`/student/companies/${company.id}`}
                  className="group bg-[#1a1a1a] border border-white/5 hover:border-lime-500/25 rounded-2xl p-5 transition-all hover:bg-white/2 space-y-3">

                  {/* Header */}
                  <div className="flex items-start gap-3">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.companyName}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 flex-shrink-0"
                        referrerPolicy="no-referrer" />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${colorCls}`}>
                        {initial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-white font-semibold text-sm leading-tight truncate">{company.companyName}</h3>
                        {company.isVerified && <ShieldCheck size={13} className="text-lime-400 flex-shrink-0" title="Verified" />}
                      </div>
                      {company.sector && <p className="text-white/40 text-xs mt-0.5 truncate">{company.sector}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{company.description}</p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-xs text-white/30 flex-wrap">
                    {company.city && (
                      <span className="flex items-center gap-1"><MapPin size={11} />{company.city}</span>
                    )}
                    <span className={`flex items-center gap-1 font-semibold ml-auto ${company.openOffers > 0 ? 'text-lime-400' : 'text-white/20'}`}>
                      <Briefcase size={11} />
                      {company.openOffers > 0 ? `${company.openOffers} open` : 'No openings'}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white/30 group-hover:text-lime-400 transition-colors flex items-center gap-1">
                      View profile <ChevronRight size={11} />
                    </span>
                    {company.openOffers > 0 && (
                      <span className="text-[10px] text-lime-400/70 bg-lime-500/8 border border-lime-500/15 px-2 py-0.5 rounded-full">
                        Hiring
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-sm text-white/40">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white disabled:opacity-30 transition-colors">
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
