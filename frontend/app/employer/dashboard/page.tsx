"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCompanyOffers, getUserFriendlyError, type OfferApiModel } from "@/lib/api";

export default function EmployerDashboard() {
  const [offers, setOffers] = useState<OfferApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyOffers();
        if (!mounted) return;
        setOffers(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load company offers"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const safeOffers = Array.isArray(offers) ? offers : [];
  const totalApplicants = safeOffers.reduce((sum, offer) => sum + (offer.applications?.length || 0), 0);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline mb-2">Command Center</h1>
              <p className="text-slate-500 font-medium max-w-lg">Orchestrate your global internship pipeline with surgical precision and curated insights.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-2xl transition-all hover:bg-slate-200 inline-flex items-center gap-2 border border-slate-200 shadow-sm text-sm">
                <span className="material-symbols-outlined text-xl">download</span>
                Export Report
              </button>
              <Link href="/employer/post" className="bg-slate-900 text-white font-bold px-8 py-3 rounded-2xl transition-all hover:bg-slate-800 inline-flex items-center gap-2 shadow-lg shadow-slate-900/10 text-sm">
                <span className="material-symbols-outlined text-xl">add</span>
                Post Internship
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[11px] font-black px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  12%
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Total Pipeline</p>
              <h3 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tighter">1,284</h3>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Active Roles</p>
              <h3 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tighter">{safeOffers.length}</h3>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group transition-all">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">AI Curated</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1 relative z-10">Top Matches</p>
              <h3 className="text-4xl font-extrabold font-headline text-white tracking-tighter relative z-10">84</h3>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 font-headline tracking-tight">Live Recruitment Rails</h2>
              <button className="text-slate-400 text-xs font-bold hover:text-amber-600 flex items-center gap-1 transition-colors">
                View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="space-y-4">
              {safeOffers.map((offer) => (
                <div key={offer.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-2xl">
                        {offer.category?.toLowerCase().includes("design") ? "palette" : 
                         offer.category?.toLowerCase().includes("strategy") ? "analytics" : "code"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-slate-900 text-lg tracking-tight mb-1">{offer.title}</h3>
                      <p className="text-slate-400 text-xs font-medium">Posted 3 days ago • {offer.location || "Remote"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 mr-8">
                    <div className="text-center">
                      <span className="block text-xl font-black text-slate-900">{offer.applications?.length || 0}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Applicants</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xl font-black text-slate-900">{Math.floor((offer.applications?.length || 0) * 0.2)}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Shortlisted</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-900 transition-colors">chevron_right</span>
                  </div>
                </div>
              ))}

              {!loading && !safeOffers.length && (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-400 font-medium">No active roles in recruitment rails yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-headline tracking-tight">Recruitment Velocity</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Time-to-hire trend across all departments</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-700"></div>
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">This Year</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-64 px-4">
              {[
                { day: "MON", height: "45%" },
                { day: "TUE", height: "30%" },
                { day: "WED", height: "100%", active: true },
                { day: "THU", height: "55%" },
                { day: "FRI", height: "80%" },
                { day: "SAT", height: "25%" },
                { day: "SUN", height: "70%" },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-4 w-full">
                  <div 
                    className={`w-14 rounded-full transition-all duration-500 ${bar.active ? "bg-amber-700" : "bg-slate-100 hover:bg-slate-200"}`}
                    style={{ height: bar.height }}
                  ></div>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest">{bar.day}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar - Sticky */}
        <aside className="lg:col-span-3 space-y-6 sticky top-10">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-amber-700 text-xl">verified</span>
              <h3 className="font-headline font-black text-slate-900 text-sm tracking-tight">Curated Top Matches</h3>
            </div>
            <div className="space-y-8">
              {[
                { name: "Julian Vance", school: "Stanford • CS Senior", match: "98%", tags: ["REACT", "AWS CLOUD", "UX LOGIC"], img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" },
                { name: "Sienna Rossi", school: "Parsons • Product Design", match: "95%", tags: ["FIGMA", "PROTOTYPING"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" },
                { name: "Ahmed Khalid", school: "LSE • Data Science", match: "92%", tags: ["PYTHON", "SQL", "FORECASTING"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
              ].map((match, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={match.img} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" alt={match.name} />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-700 transition-colors">{match.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{match.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black text-slate-900">{match.match}</span>
                      <span className="text-[8px] uppercase tracking-widest text-slate-300 font-bold">Match</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-black tracking-widest bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100 group-hover:border-slate-200 transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-slate-900 rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-white font-headline font-bold text-sm mb-1">Automate Screening</h4>
                <p className="text-slate-400 text-[10px] mb-4">Let our AI curators rank your next 50 applicants automatically.</p>
                <button className="w-full bg-amber-500 text-slate-900 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-colors">
                  Activate Auto-Pilot
                </button>
              </div>
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
