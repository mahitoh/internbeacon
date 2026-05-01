"use client";

import { useEffect, useMemo, useState } from "react";
import InternshipCard from "@/components/InternshipCard";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import { FiSearch, FiFilter, FiArrowDown } from "react-icons/fi";
import { fetchInternshipOffers, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import type { Internship } from "@/types";

export default function ListingsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const offers = await fetchInternshipOffers();
        if (!mounted) return;
        const mapped = offers.map(mapOfferToInternship);
        // If API returns data, use it but pad with mock data if it's too few (for visualization)
        if (mapped.length > 0) {
          setInternships([...mapped, ...MOCK_INTERNSHIPS.slice(0, Math.max(0, 12 - mapped.length))]);
        } else {
          setInternships(MOCK_INTERNSHIPS);
        }
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load offers"));
        setInternships(MOCK_INTERNSHIPS);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOffers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredInternships = useMemo(() => {
    return internships.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [internships, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-10">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-24 lg:mb-40 gap-12">
        <div className="space-y-8 lg:w-2/3">
          <div className="text-secondary font-black uppercase tracking-[0.6em] text-[10px]">Registry Protocol V.0.2</div>
          <h1 className="font-display font-black text-6xl lg:text-[9rem] tracking-tighter leading-[0.8] text-on-surface uppercase">
            THE GLOBAL <br /><span className="text-secondary">OPPORTUNITY</span> <br />INDEX.
          </h1>
        </div>

        <div className="lg:w-1/3 flex flex-col items-end text-right">
          <p className="text-sm font-bold text-outline leading-relaxed max-w-[320px] mb-10 uppercase tracking-tight">
            Systematically tracking {internships.length} high-fidelity positions across five continents. Refreshed in real-time.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-primary group cursor-pointer">
            Begin Exploration <FiArrowDown className="animate-bounce group-hover:translate-y-2 transition-transform" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        {loading ? <p className="text-[10px] font-black uppercase tracking-widest text-outline animate-pulse">Syncing positions...</p> : null}
        {!loading && error ? (
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 p-4 rounded-xl inline-block border border-amber-100">Live API unavailable ({error}). fallback mode.</div>
        ) : null}
      </div>

      <div className="mb-24 lg:mb-40 relative">
        <div className="flex flex-col md:flex-row items-center gap-0 bg-surface-container-lowest rounded-[2rem] shadow-editorial overflow-hidden">
          <div className="flex-grow w-full flex items-center px-10 py-10 gap-8">
            <FiSearch className="text-3xl text-outline/30" />
            <input
              type="text"
              placeholder="SEARCH BY ROLE, FIRM, OR CORE DOMAIN..."
              className="w-full bg-transparent border-none outline-none font-display font-black text-2xl tracking-tighter placeholder:text-outline/10 text-on-surface uppercase"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto px-16 py-10 flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[10px] bg-black text-white hover:bg-secondary transition-all whitespace-nowrap">
            <FiFilter className="text-lg" />
            Refine Index
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-24 lg:mb-40">
        {["ENGINEERING", "DESIGN", "MARKETING", "FINANCE", "LEGAL", "STRATEGY"].map((cat) => (
          <button key={cat} className="bg-surface-container-low py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-outline hover:text-white hover:bg-secondary transition-all shadow-sm">
            {cat}
          </button>
        ))}
      </div>


      {filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-20 gap-x-12">
          {filteredInternships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      ) : (
        <div className="py-20 sm:py-40 text-center space-y-8">
          <h3 className="font-display font-black text-4xl tracking-tighter text-on-surface/20 uppercase">No Data Matches Queries</h3>
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary font-black uppercase tracking-[0.2em] text-xs pb-1 border-b-2 border-primary/20 hover:border-primary transition-all"
          >
            Reset Search Index
          </button>
        </div>
      )}
    </div>
  );
}
