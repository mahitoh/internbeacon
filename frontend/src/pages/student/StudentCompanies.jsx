import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, MapPin, Briefcase, Search, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { companiesApi } from '../../api/companies';
import Spinner from '../../components/ui/Spinner';
import SelectField from '../../components/ui/SelectField';
import { CAMEROON_CITIES } from '../../constants/locations';

const SECTORS = [
  'Information Technology', 'Finance & Banking', 'Telecommunications',
  'Marketing & Sales', 'Engineering', 'Healthcare', 'Education',
  'Oil & Gas', 'Agriculture', 'Other',
];
const CITIES = CAMEROON_CITIES;

const AVATAR_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#EDF2EE', text: '#1E5B45' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EEF2FF', text: '#3730A3' },
  { bg: '#FEE2E2', text: '#991B1B' },
];
const avatarColor = (name) => AVATAR_COLORS[(name || '?').charCodeAt(0) % AVATAR_COLORS.length];

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

  const selectStyle = (hasValue) => ({
    background: '#fff',
    border: `1px solid ${hasValue ? '#1E5B45' : '#DDDBD2'}`,
    borderRadius: '12px',
    padding: '10px 32px 10px 12px',
    fontSize: '14px',
    color: hasValue ? '#1B1D1A' : '#9A9E97',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  });

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9A9E97' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies…"
            className="w-full pl-9 pr-4 py-2.5 text-sm focus:outline-none rounded-xl transition-all"
            style={{ background: '#fff', border: `1px solid ${search ? '#1E5B45' : '#DDDBD2'}`, color: '#1B1D1A' }}
          />
        </div>
        <SelectField bare value={sector} onChange={e => setSector(e.target.value)} style={selectStyle(!!sector)}>
          <option value="">All sectors</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </SelectField>
        <SelectField bare value={city} onChange={e => setCity(e.target.value)} style={selectStyle(!!city)}>
          <option value="">All cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </SelectField>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl text-sm select-none transition-colors"
          style={{ background: verified ? '#EDF2EE' : '#fff', border: `1px solid ${verified ? '#C4DBCE' : '#DDDBD2'}`, color: verified ? '#1E5B45' : '#6B6F69' }}>
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} className="accent-emerald-600" />
          <ShieldCheck size={13} style={{ color: verified ? '#1E5B45' : '#9A9E97' }} />
          Verified
        </label>
        {hasFilter && (
          <button onClick={resetFilters}
            className="px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ border: '1px solid #DDDBD2', color: '#9A9E97' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
            onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
            Clear
          </button>
        )}
      </div>

      {!isLoading && (
        <p className="text-xs" style={{ color: '#9A9E97' }}>
          {total} {total === 1 ? 'company' : 'companies'}{hasFilter ? ' matching filters' : ''}
          {isFetching && ' · refreshing…'}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
          <Building2 size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-medium" style={{ color: '#9A9E97' }}>No companies found</p>
          {hasFilter && (
            <button onClick={resetFilters} className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.map(company => {
              const initial   = (company.companyName || '?')[0].toUpperCase();
              const colors    = avatarColor(company.companyName);
              return (
                <Link
                  key={company.id}
                  to={`/student/companies/${company.id}`}
                  className="group rounded-2xl p-5 space-y-3 transition-all"
                  style={{ background: '#fff', border: '1px solid #E7E6DF', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4DBCE'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,91,69,.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E6DF'; e.currentTarget.style.boxShadow = 'none'; }}>

                  <div className="flex items-start gap-3">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.companyName}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        style={{ border: '1px solid #E7E6DF' }}
                        referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{ background: colors.bg, color: colors.text }}>
                        {initial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: '#1B1D1A' }}>{company.companyName}</h3>
                        {company.isVerified && <ShieldCheck size={13} style={{ color: '#1E5B45', flexShrink: 0 }} title="Verified" />}
                      </div>
                      {company.sector && <p className="text-xs mt-0.5 truncate" style={{ color: '#9A9E97' }}>{company.sector}</p>}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#6B6F69' }}>{company.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: '#9A9E97' }}>
                    {company.city && (
                      <span className="flex items-center gap-1"><MapPin size={11} />{company.city}</span>
                    )}
                    <span className="flex items-center gap-1 font-semibold ml-auto"
                      style={{ color: company.openOffers > 0 ? '#1E5B45' : '#C0BFBA' }}>
                      <Briefcase size={11} />
                      {company.openOffers > 0 ? `${company.openOffers} open` : 'No openings'}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-between" style={{ borderTop: '1px solid #F0F0EA' }}>
                    <span className="text-xs flex items-center gap-1 transition-colors" style={{ color: '#9A9E97' }}>
                      View profile <ChevronRight size={11} />
                    </span>
                    {company.openOffers > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                        Hiring
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-30"
                style={{ border: '1px solid #DDDBD2', color: '#6B6F69', background: '#fff' }}
                onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor = '#1E5B45'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-sm" style={{ color: '#9A9E97' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-30"
                style={{ border: '1px solid #DDDBD2', color: '#6B6F69', background: '#fff' }}
                onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.borderColor = '#1E5B45'; }}
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
