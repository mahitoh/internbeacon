"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getOffers, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import type { Internship } from "@/types";

// ── static filter options ──────────────────────────────────────────────────────
const SECTORS = ["Technology", "Design & Creative", "Marketing", "Finance", "Operations", "Engineering"];
const LEVELS  = ["Undergraduate", "Postgraduate", "Fresh Graduate"];
const LOCS    = ["All locations", "Remote", "Yaoundé", "Douala", "Bafoussam", "International"];

// ── tiny helpers ───────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const BG_PALETTE = [
  "bg-violet-600", "bg-blue-600", "bg-teal-600",
  "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-indigo-600",
];
function companyColor(name: string) {
  return BG_PALETTE[name.charCodeAt(0) % BG_PALETTE.length];
}

type Badge = { label: string; className: string };
function cardBadge(index: number): Badge | null {
  if (index % 7 === 0) return { label: "Urgent",  className: "bg-red-50 text-red-600 border border-red-100" };
  if (index % 5 === 0) return { label: "Hot",     className: "bg-amber-50 text-amber-600 border border-amber-100" };
  if (index % 4 === 0) return { label: "New",     className: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
  if (index % 3 === 0) return { label: "Vetted",  className: "bg-blue-50 text-blue-600 border border-blue-100" };
  return null;
}

export default function BrowseInternships() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [loading, setLoading]         = useState(true);
  const [apiError, setApiError]       = useState<string | null>(null);

  // filter state
  const [query, setQuery]         = useState("");
  const [location, setLocation]   = useState("All locations");
  const [sectors, setSectors]     = useState<string[]>([]);
  const [level, setLevel]         = useState("");
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const offers = await getOffers();
        if (!mounted) return;
        const mapped = offers.map(mapOfferToInternship);
        setInternships(mapped.length ? mapped : MOCK_INTERNSHIPS);
      } catch (err) {
        if (!mounted) return;
        setApiError(getUserFriendlyError(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleSector = (s: string) =>
    setSectors((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return internships.filter((i) => {
      const matchQ   = !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q));
      const matchLoc = location === "All locations" || i.location.toLowerCase().includes(location.toLowerCase());
      const matchSec = sectors.length === 0 || i.tags.some((t) => sectors.includes(t));
      return matchQ && matchLoc && matchSec;
    });
  }, [internships, query, location, sectors]);

  const clearFilters = () => { setQuery(""); setLocation("All locations"); setSectors([]); setLevel(""); };
  const hasFilters = query || location !== "All locations" || sectors.length > 0 || level;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body antialiased text-on-surface">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] pt-36 pb-20 px-6 overflow-hidden">
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* glow blobs */}
        <div className="absolute top-0 right-[20%] w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[10%] w-72 h-72 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-secondary-container mb-5">
            Internship Registry — Cameroon & Beyond
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-6 font-headline max-w-3xl">
            Find your next{" "}
            <span className="text-secondary-container">career chapter.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed">
            Curated internship opportunities from vetted companies, matched to your skills and ambitions.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl shadow-2xl shadow-black/30">
            <div className="flex items-center flex-1 px-4 gap-3">
              <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">search</span>
              <input
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 py-3 text-slate-900"
                placeholder="Role, company or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px bg-slate-100 my-2" />
            <div className="flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">location_on</span>
              <select
                className="bg-transparent outline-none text-sm font-medium text-slate-600 py-3 cursor-pointer"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {LOCS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button
              onClick={() => {}}
              className="bg-secondary-container text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
            >
              Search
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: `${internships.length}+`, label: "Open roles" },
              { value: "120+", label: "Partner companies" },
              { value: "94%",  label: "Placement rate" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* ── SIDEBAR FILTERS ─────────────────────────────────────────────── */}
        <aside className="lg:col-span-3 sticky top-28 space-y-5">
          {/* Filter card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">tune</span>
                Filters
              </h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="p-6 space-y-7">
              {/* Sector */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Sector</p>
                <div className="space-y-2.5">
                  {SECTORS.map((s) => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleSector(s)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          sectors.includes(s)
                            ? "bg-slate-900 border-slate-900"
                            : "border-slate-300 group-hover:border-slate-500"
                        }`}
                      >
                        {sectors.includes(s) && (
                          <span className="material-symbols-outlined text-white text-[11px] leading-none">check</span>
                        )}
                      </div>
                      <span
                        onClick={() => toggleSector(s)}
                        className={`text-sm font-medium transition-colors ${
                          sectors.includes(s) ? "text-slate-900 font-semibold" : "text-slate-600 group-hover:text-slate-800"
                        }`}
                      >
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-50" />

              {/* Level */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Level</p>
                <div className="flex flex-col gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(level === l ? "" : l)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        level === l
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-50" />

              {/* Duration */}
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Duration</p>
                <input
                  className="w-full accent-slate-900 cursor-pointer"
                  type="range"
                  min="1" max="12" defaultValue="12"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-2">
                  <span>1 month</span>
                  <span>12 months</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-[#0F172A] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-secondary-container/10 border border-secondary-container/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-secondary-container text-[20px]">auto_awesome</span>
              </div>
              <h4 className="font-bold text-white text-sm mb-2 font-headline">AI-powered matching</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                Let our AI find roles that match your exact skill profile. Sign up for personalised recommendations.
              </p>
              <Link
                href="/signup"
                className="block text-center bg-secondary-container text-white py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
              >
                Get matched for free
              </Link>
            </div>
          </div>
        </aside>

        {/* ── RESULTS ─────────────────────────────────────────────────────── */}
        <section className="lg:col-span-9">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-7">
            <div>
              {loading ? (
                <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
              ) : (
                <p className="text-sm font-semibold text-slate-600">
                  <span className="font-black text-slate-900 text-lg">{filtered.length}</span>
                  {" "}{filtered.length === 1 ? "internship" : "internships"} found
                  {hasFilters && <span className="text-slate-400 text-xs ml-2">· filtered</span>}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-400 hover:text-slate-700 border border-slate-200"}`}
                aria-label="Grid view"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-400 hover:text-slate-700 border border-slate-200"}`}
                aria-label="List view"
              >
                <span className="material-symbols-outlined text-[18px]">list</span>
              </button>
            </div>
          </div>

          {/* API error banner */}
          {apiError && !loading && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
              <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
              Showing sample listings — {apiError}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-4"}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-slate-100 rounded-full" />
                    <div className="h-6 w-20 bg-slate-100 rounded-full" />
                  </div>
                  <div className="h-8 bg-slate-100 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
              <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">search_off</span>
              <h3 className="font-bold text-slate-900 text-lg mb-2">No results found</h3>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your search or clearing your filters.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {!loading && filtered.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((item, idx) => {
                const badge = cardBadge(idx);
                const color = companyColor(item.company);
                return (
                  <article
                    key={item.id}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/60 transition-all flex flex-col"
                  >
                    {/* Card top */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {initials(item.company)}
                      </div>
                      {badge && (
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Title + company */}
                    <h3 className="font-headline font-bold text-[17px] text-slate-900 mb-1 leading-snug group-hover:text-secondary-container transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">
                      {item.company}
                      {item.location && (
                        <span className="before:content-['·'] before:mx-1.5 text-slate-400">{item.location}</span>
                      )}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[11px] font-semibold rounded-lg border border-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400 mb-6">
                      {item.stipend && item.stipend !== "Not specified" && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">payments</span>
                          {item.stipend}
                        </span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        Posted recently
                      </p>
                      <Link
                        href={`/internships/${item.id}`}
                        className="flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-secondary-container transition-colors group/btn"
                      >
                        View details
                        <span className="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-x-0.5">arrow_forward</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* List view */}
          {!loading && filtered.length > 0 && viewMode === "list" && (
            <div className="space-y-3">
              {filtered.map((item, idx) => {
                const badge = cardBadge(idx);
                const color = companyColor(item.company);
                return (
                  <article
                    key={item.id}
                    className="group bg-white rounded-2xl border border-slate-100 px-6 py-5 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/50 transition-all flex items-center gap-5"
                  >
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {initials(item.company)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-secondary-container transition-colors truncate">
                          {item.title}
                        </h3>
                        {badge && (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 ${badge.className}`}>
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-2">
                        {item.company}
                        {item.location && <span className="before:content-['·'] before:mx-1.5 text-slate-400">{item.location}</span>}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[11px] font-semibold rounded border border-slate-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-3">
                      {item.stipend && item.stipend !== "Not specified" && (
                        <p className="text-xs font-bold text-slate-700">{item.stipend}</p>
                      )}
                      <Link
                        href={`/internships/${item.id}`}
                        className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <nav className="mt-12 flex items-center justify-center gap-2">
              {[
                { icon: "chevron_left", label: "Prev" },
              ].map(({ icon, label }) => (
                <button key={label} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all">
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </button>
              ))}
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    n === 1 ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-slate-400 px-1 text-sm">…</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-sm font-bold transition-all">
                12
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
