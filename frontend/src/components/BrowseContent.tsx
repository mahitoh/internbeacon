"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getOffers, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import type { Internship } from "@/types";

const CATEGORIES = ["All", "Technology", "Design", "Finance", "Marketing", "Operations"];
const LOCATIONS = ["All locations", "Remote", "Yaoundé", "Douala", "Bafoussam"];

export default function BrowseContent() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All locations");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const offers = await getOffers();
        if (!mounted) return;
        const mapped = offers.map(mapOfferToInternship);
        setInternships(mapped.length ? mapped : MOCK_INTERNSHIPS);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err));
        setInternships(MOCK_INTERNSHIPS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCat = category === "All" || i.tags.includes(category);
      const matchesLoc =
        location === "All locations" ||
        i.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesCat && matchesLoc;
    });
  }, [internships, query, category, location]);

  return (
    <div className="w-full max-w-7xl">
      {/* Header */}
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-secondary mb-3 block font-headline">
          Discovery Engine
        </span>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-on-background font-headline leading-[0.9] mb-4">
          Explore <br /><span className="text-secondary">Opportunities</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl text-base font-medium leading-relaxed">
          Curated internship positions from high-growth companies actively scouting for academic excellence.
        </p>
      </header>

      {/* Search bar */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-4 flex flex-col md:flex-row items-center gap-4 mb-12 shadow-editorial border-none">
        <div className="flex items-center flex-1 px-6 gap-4">
          <span className="material-symbols-outlined text-outline text-2xl">search</span>
          <input
            className="flex-1 bg-transparent outline-none text-base font-bold placeholder:text-outline/40 py-4"
            placeholder="Search by role, company or domain..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hidden md:block w-px h-8 bg-outline-variant/20" />
        <select
          className="bg-transparent outline-none text-xs font-black uppercase tracking-widest text-on-surface-variant py-4 px-6 cursor-pointer hover:text-secondary transition-colors"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATIONS.map((l) => <option key={l} className="bg-white">{l}</option>)}
        </select>
        <button className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all active:scale-[0.98] shadow-editorial w-full md:w-auto">
          Filter
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-3 flex-wrap mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              category === cat
                ? "bg-secondary text-white shadow-editorial"
                : "bg-surface-container-low text-outline hover:bg-surface-container-high"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center gap-4 text-sm font-bold text-outline py-24 justify-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-secondary">progress_activity</span>
          Indexing opportunities...
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-error-container text-on-error-container rounded-3xl mb-8 flex items-center gap-4 text-xs font-bold">
          <span className="material-symbols-outlined">error</span>
          {error} — showing fallback results.
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-32 text-outline">
          <span className="material-symbols-outlined text-7xl mb-6 block opacity-10">search_off</span>
          <p className="text-xl font-black text-on-primary-fixed uppercase tracking-tight">No positions found</p>
          <p className="text-sm font-medium mt-2">Adjust your filters or try a different keyword.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <p className="text-[10px] font-black text-outline uppercase tracking-[0.3em] mb-8">
            {filtered.length} Position{filtered.length === 1 ? "" : "s"} tracked
          </p>
          <div className="space-y-6">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group bg-surface-container-lowest rounded-[2rem] p-8 flex gap-8 items-start hover:scale-[1.01] transition-all duration-500 shadow-editorial border-none"
              >
                {/* Company logo placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center shrink-0 shadow-sm border-none">
                  <span className="material-symbols-outlined text-outline text-3xl group-hover:text-secondary transition-colors">business</span>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-6 mb-2">
                    <div>
                      <h3 className="font-headline font-black text-2xl text-on-primary-fixed group-hover:text-secondary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-outline uppercase tracking-wider mt-1">
                        {item.company}
                        {item.location && (
                          <span className="before:content-['·'] before:mx-3 before:opacity-30">{item.location}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-black uppercase tracking-tighter rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-outline">
                    {item.stipend && item.stipend !== "Not specified" && (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">payments</span>
                        {item.stipend}
                      </span>
                    )}
                    {item.duration && (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/internships/${item.id}`}
                  className="shrink-0 self-center bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all hidden xl:block shadow-editorial"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
