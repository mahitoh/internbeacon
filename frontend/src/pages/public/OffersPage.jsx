import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Briefcase, Diamond } from 'lucide-react';
import { offersApi } from '../../api/offers';
import OfferCard from '../../components/offers/OfferCard';
import Spinner from '../../components/ui/Spinner';

const DOMAINS    = ['IT', 'Finance', 'Marketing', 'Engineering', 'HR', 'Telecommunications', 'Legal', 'Health'];
const LOCATIONS  = ['Yaounde', 'Douala', 'Bafoussam', 'Garoua', 'Remote'];
const DURATIONS  = [{ label: 'Any', value: '' }, { label: '4–8 weeks', value: '4' }, { label: '8–12 weeks', value: '8' }, { label: '3+ months', value: '12' }];

export default function OffersPage() {
  const [search,   setSearch]   = useState('');
  const [domain,   setDomain]   = useState('');
  const [location, setLocation] = useState('');
  const [paid,     setPaid]     = useState('');
  const [page,     setPage]     = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['offers', { domain, location, paid, page }],
    queryFn:  () => offersApi.list({ domain, location, paid, page, limit: 12 }).then(r => ({
      offers: r.data.data || [],
      total:  r.data.meta?.total  || 0,
      pages:  Math.ceil((r.data.meta?.total || 0) / 12) || 1,
    })),
  });

  const offers = data?.offers || [];
  const total  = data?.total  || 0;
  const pages  = data?.pages  || 1;

  const clearFilters = () => { setDomain(''); setLocation(''); setPaid(''); setPage(1); };
  const hasFilters = domain || location || paid;

  const filteredOffers = offers.filter(o => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      o.title.toLowerCase().includes(term) ||
      o.domain.toLowerCase().includes(term) ||
      o.company?.companyName?.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-forest-950 py-16 text-white border-b border-forest-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#b4f05b]">
            <Diamond size={8} className="fill-lime-500 text-lime-500" /> Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Browse Internships</h1>
          <p className="text-white/60 text-sm">Discover {total} opportunities across Cameroon</p>

          {/* Search */}
          <div className="mt-6 flex items-center gap-3 max-w-2xl pt-2">
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-lime-500/50 focus-within:ring-2 focus-within:ring-lime-500/10">
              <Search size={16} className="text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, domain, or company…"
                className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white text-sm transition-colors active:scale-95">
              <SlidersHorizontal size={16} />
              <span className="hidden sm:block font-bold">Filters</span>
              {hasFilters && <span className="w-2 h-2 bg-lime-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border  p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b ">
                <h3 className="font-bold text-forest-950 text-sm">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs font-bold text-forest-900 hover:text-forest-750">Clear all</button>
                )}
              </div>

              <FilterGroup label="Domain">
                <div className="space-y-2">
                  {DOMAINS.map(d => (
                    <label key={d} className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-forest-950 hover:text-forest-750 font-medium">
                      <input type="radio" name="domain" value={d} checked={domain === d}
                        onChange={() => { setDomain(d); setPage(1); }}
                        className="accent-forest-900 w-4 h-4" />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
                {domain && (
                  <button onClick={() => setDomain('')} className="text-[10px] font-bold text-forest-800/40 hover:text-forest-950 pt-1">
                    Clear Domain
                  </button>
                )}
              </FilterGroup>

              <FilterGroup label="Location">
                <div className="space-y-2">
                  {LOCATIONS.map(l => (
                    <label key={l} className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-forest-950 hover:text-forest-750 font-medium">
                      <input type="radio" name="location" value={l} checked={location === l}
                        onChange={() => { setLocation(l); setPage(1); }}
                        className="accent-forest-900 w-4 h-4" />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
                {location && (
                  <button onClick={() => setLocation('')} className="text-[10px] font-bold text-forest-800/40 hover:text-forest-950 pt-1">
                    Clear Location
                  </button>
                )}
              </FilterGroup>

              <FilterGroup label="Compensation">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-forest-950 hover:text-forest-750 font-medium">
                  <input type="checkbox" checked={paid === 'true'} onChange={e => { setPaid(e.target.checked ? 'true' : ''); setPage(1); }} className="accent-forest-900 w-4 h-4 rounded" />
                  <span>Paid only</span>
                </label>
              </FilterGroup>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-forest-800/60">
                {isLoading ? 'Loading…' : `${filteredOffers.length} internships found`}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-bold text-forest-850 hover:text-forest-950">
                  <X size={13} /> Clear filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner /></div>
            ) : isError ? (
              <div className="text-center py-20 text-forest-800/50 font-medium">Failed to load offers. Please try again.</div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border  p-8 shadow-sm">
                <Briefcase size={36} className="text-forest-800/30 mx-auto mb-4" />
                <p className="text-forest-950 font-bold">No internships match your filters.</p>
                <button onClick={clearFilters} className="mt-3 text-xs font-bold text-forest-900 hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOffers.map((offer, i) => (
                  <motion.div key={offer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}>
                    <OfferCard offer={offer} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${p === page ? 'bg-forest-950 text-white' : 'bg-white text-forest-850 border  hover:border-forest-300'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-forest-800/40">{label}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
