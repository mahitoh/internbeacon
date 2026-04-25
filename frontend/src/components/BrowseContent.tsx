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
      <header className="mb-10">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-2 block font-headline">
          Explore
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-background font-headline mb-2">
          Browse Internships
        </h1>
        <p className="text-on-surface-variant max-w-xl">
          Curated opportunities from companies actively hiring in Cameroon and beyond.
        </p>
      </header>

      {/* Search bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 mb-8 shadow-sm">
        <div className="flex items-center flex-1 px-4 gap-3">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-outline py-3"
            placeholder="Role, company or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hidden md:block w-px bg-outline-variant/20 my-2" />
        <select
          className="bg-transparent outline-none text-sm font-medium text-on-surface-variant py-3 px-4 cursor-pointer"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button className="bg-on-primary-fixed text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98]">
          Search
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              category === cat
                ? "bg-on-primary-fixed text-white border-on-primary-fixed"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:border-outline-variant/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-on-surface-variant py-12 justify-center">
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          Loading opportunities...
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-error flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error} — showing cached listings.
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">search_off</span>
          <p className="font-semibold">No internships match your search.</p>
          <p className="text-sm mt-1">Try different keywords or clear filters.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <p className="text-xs font-bold text-outline uppercase tracking-widest mb-6">
            {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"} found
          </p>
          <div className="space-y-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 flex gap-5 items-start hover:border-outline-variant/30 hover:shadow-md transition-all"
              >
                {/* Company logo placeholder */}
                <div className="w-14 h-14 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">business</span>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h3 className="font-headline font-bold text-lg text-on-primary-fixed group-hover:text-secondary transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-outline mt-0.5">
                        {item.company}
                        {item.location && (
                          <span className="before:content-['·'] before:mx-2">{item.location}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 mb-4">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-surface-container text-on-surface-variant text-[11px] font-bold rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-outline">
                    {item.stipend && item.stipend !== "Not specified" && (
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">payments</span>
                        {item.stipend}
                      </span>
                    )}
                    {item.duration && (
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/internships/${item.id}`}
                  className="shrink-0 self-center bg-on-primary-fixed text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all hidden md:block"
                >
                  View
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
