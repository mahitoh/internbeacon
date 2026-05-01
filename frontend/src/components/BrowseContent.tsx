"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchInternshipOffers, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import type { Internship } from "@/types";

const CATEGORIES = ["Technology", "Design & Creative", "Marketing", "Finance", "Operations"];
const LOCATIONS = ["All locations", "Remote", "San Francisco", "London", "New York", "Berlin"];

export default function BrowseContent() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All locations");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Technology"]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const offers = await fetchInternshipOffers();
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

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat = selectedCategories.length === 0 || i.tags.some(t => selectedCategories.includes(t));
      const matchesLoc =
        location === "All locations" ||
        i.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesCat && matchesLoc;
    });
  }, [internships, query, selectedCategories, location]);

  return (
    <div className="w-full">
      {/* Hero Search Section */}
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4 leading-tight font-headline">
          Discover your next <span className="text-secondary-container">career chapter.</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mb-8">
          Curated opportunities from world-class companies, designed for the next generation of talent.
        </p>

        {/* Search Bar Floating */}
        <div className="bg-surface-container-lowest p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center flex-1 px-4 w-full">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="w-full border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline py-4 font-medium outline-none"
              placeholder="Search by role, company or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
            />
          </div>
          <div className="h-8 w-[1px] bg-outline-variant/20 hidden md:block"></div>
          <div className="flex items-center px-4 w-full md:w-auto">
            <span className="material-symbols-outlined text-outline">location_on</span>
            <input
              className="w-full md:w-40 border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline py-4 font-medium outline-none"
              placeholder="City or Remote"
              value={location === "All locations" ? "" : location}
              onChange={(e) => setLocation(e.target.value || "All locations")}
              type="text"
            />
          </div>
          <button className="w-full md:w-auto bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95">
            Find Internships
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 sticky top-8 space-y-8">
          <div className="bg-surface-container-low p-6 rounded-lg space-y-8">
            <div>
              <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Sector</h3>
              <div className="space-y-3">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${selectedCategories.includes(cat) ? 'border-primary' : 'border-outline-variant group-hover:border-primary'}`}>
                      <div className={`w-2.5 h-2.5 bg-primary rounded-sm transition-opacity ${selectedCategories.includes(cat) ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`}></div>
                    </div>
                    <input
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="hidden"
                      type="checkbox"
                    />
                    <span className="text-on-surface font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Level</h3>
              <div className="grid grid-cols-1 gap-2">
                <button className="text-left px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-semibold text-sm shadow-sm border border-outline-variant/10">Undergraduate</button>
                <button className="text-left px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm">Postgraduate</button>
                <button className="text-left px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm">Fresh Graduate</button>
              </div>
            </div>

            <div>
              <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Duration</h3>
              <div className="space-y-4">
                <input className="w-full accent-primary" max="12" min="1" type="range" defaultValue="6" />
                <div className="flex justify-between text-xs font-bold text-outline uppercase">
                  <span>1 Month</span>
                  <span>12 Months</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg group aspect-[4/5] flex items-end p-6">
            <img alt="Premium support" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdx2zABCR8UzjsglDKd6nkoGPqm5zjOFxG4ZSgKBWLsYMs0VmDc-JGuKoXo6ilJ-7KGx-4XwEpCQ3BlJsnJji7xfs-J0o5O_24I7490yyaHxjmG6qXKzyxQ48kJmi2UqUCHqLcm3VZrbmR-o2XEAuo-fdY8IQS7r_woz3T64LT0J2W3nWikLwLqILNOZsLORFZTjnQRF-jG_Y7mo1tJ0fwY3upkOano8U_TeioaSPz59QCkMPvv7pbqRFK0OTlyfqLinNOwFzwoYg" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
            <div className="relative z-10">
              <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-2">Exclusive Access</p>
              <h4 className="text-white font-headline font-bold text-xl leading-tight mb-4">Get personalized career coaching.</h4>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors">Upgrade Plan</button>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <section className="lg:col-span-9">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-outline font-bold text-sm uppercase tracking-widest mb-1">Results</p>
              <h2 className="text-2xl font-bold text-primary">{filtered.length} Internships Available</h2>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-surface-container-high text-primary"><span className="material-symbols-outlined">grid_view</span></button>
              <button className="p-2 rounded-lg text-outline hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined">list</span></button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-outline">
              <span className="material-symbols-outlined animate-spin text-4xl text-secondary mb-4">progress_activity</span>
              <p className="font-medium text-sm">Loading opportunities...</p>
            </div>
          ) : error && filtered.length === 0 ? (
            <div className="p-6 bg-error-container text-on-error-container rounded-xl flex items-center gap-3 text-sm font-bold">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-outline bg-surface-container-lowest rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">search_off</span>
              <p className="text-lg font-bold text-primary">No results found</p>
              <p className="text-sm">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest p-8 rounded-lg group hover:shadow-xl hover:shadow-primary/5 transition-all border border-outline-variant/5 hover:border-secondary-container/30">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center p-2 text-xl font-bold text-primary uppercase">
                      {item.company.charAt(0)}
                    </div>
                    {item.tags.includes("Technology") && (
                      <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Vetted</span>
                    )}
                    {item.tags.includes("Design & Creative") && (
                      <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Urgent</span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary-container transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-on-surface-variant font-medium mb-6">
                    {item.company} • {item.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.duration && (
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">
                        {item.duration}
                      </span>
                    )}
                    {item.stipend && item.stipend !== "Not specified" && (
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">
                        {item.stipend}
                      </span>
                    )}
                    {!item.stipend && <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">Hybrid</span>}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center text-outline text-xs font-medium">
                      <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                      Deadline: Nov 15
                    </div>
                    <Link href={`/internships/${item.id}`} className="text-primary font-bold text-sm flex items-center group/btn hover:text-secondary-container transition-colors">
                      Details
                      <span className="material-symbols-outlined ml-1 transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <nav className="mt-16 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-on-surface-variant">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-on-surface-variant">3</button>
              <span className="text-outline px-2">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
