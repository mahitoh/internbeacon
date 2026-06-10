import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, Briefcase, ShieldCheck, X } from 'lucide-react';
import { companiesApi } from '../../api/companies';
import Spinner from '../../components/ui/Spinner';

const SECTORS = [
  'Information Technology', 'Finance & Banking', 'Telecommunications',
  'Engineering', 'Marketing & Sales', 'Human Resources', 'Healthcare',
  'Agriculture', 'Education', 'Legal',
];
const CITIES = ['Yaounde', 'Douala', 'Bafoussam', 'Garoua', 'Buea', 'Remote'];

const COLORS = ['bg-violet-500/20', 'bg-blue-500/20', 'bg-lime-500/20', 'bg-orange-500/20', 'bg-pink-500/20'];

function avatarBg(name) {
  return COLORS[((name?.charCodeAt(0) ?? 0)) % COLORS.length];
}

export default function CompaniesPage() {
  const [search,   setSearch]   = useState('');
  const [sector,   setSector]   = useState('');
  const [city,     setCity]     = useState('');
  const [verified, setVerified] = useState(false);
  const [page,     setPage]     = useState(1);
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['companies-public', { search: debounced, sector, city, verified, page }],
    queryFn: () => companiesApi.list({
      ...(debounced  ? { search: debounced } : {}),
      ...(sector     ? { sector }            : {}),
      ...(city       ? { city }              : {}),
      ...(verified   ? { verified: 'true' }  : {}),
      page, limit: 12,
    }).then(r => r.data.data),
    staleTime: 60_000,
  });

  const companies = data?.companies || [];
  const totalPages = data?.pages || 1;
  const hasFilters = sector || city || verified;

  function clearFilters() { setSector(''); setCity(''); setVerified(false); setPage(1); }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white">Companies</h1>
          <p className="mt-1 text-sm text-white/40">Browse companies offering internships in Cameroon</p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-white/25 focus:outline-none focus:border-lime-500/50 transition-colors"
            />
          </div>

          <select
            value={sector}
            onChange={e => { setSector(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white/70 focus:outline-none focus:border-lime-500/50 transition-colors"
          >
            <option value="">All sectors</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={city}
            onChange={e => { setCity(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white/70 focus:outline-none focus:border-lime-500/50 transition-colors"
          >
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button
            onClick={() => { setVerified(v => !v); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              verified
                ? 'bg-lime-500/10 border-lime-500/30 text-lime-400'
                : 'bg-white/5 border-white/8 text-white/50 hover:text-white/70'
            }`}
          >
            <ShieldCheck size={14} /> Verified
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/20">
            <Building2 size={40} className="mb-3" />
            <p className="text-sm">No companies found</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-xs text-lime-400 hover:text-lime-300 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company, i) => (
                <CompanyCard key={company.id} company={company} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white/50 disabled:opacity-30 hover:bg-white/8 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-white/30">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white/50 disabled:opacity-30 hover:bg-white/8 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CompanyCard({ company, index }) {
  const initial = company.companyName?.[0]?.toUpperCase() ?? '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/companies/${company.id}`}
        className="block p-5 bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-lime-500/20 hover:bg-[#1e1e1e] transition-all group"
      >
        {/* Logo + name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${company.logoUrl ? 'bg-white/5' : avatarBg(company.companyName)}`}>
            {company.logoUrl
              ? <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-contain" />
              : <span className="text-lg font-black text-white/80">{initial}</span>}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-white group-hover:text-lime-400 transition-colors truncate">
                {company.companyName}
              </p>
              {company.isVerified && (
                <ShieldCheck size={12} className="text-lime-400 flex-shrink-0" />
              )}
            </div>
            {company.sector && (
              <p className="text-xs text-white/40 truncate">{company.sector}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-4">
            {company.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.city && (
              <span className="flex items-center gap-1 text-xs text-white/30">
                <MapPin size={10} /> {company.city}
              </span>
            )}
          </div>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            company.openOffers > 0
              ? 'text-lime-400 bg-lime-500/10 border border-lime-500/20'
              : 'text-white/25 bg-white/5 border border-white/8'
          }`}>
            <Briefcase size={9} />
            {company.openOffers > 0 ? `${company.openOffers} open` : 'No openings'}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
