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
      <div className="lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Company Banner */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm relative">
            {/* Cover Area */}
            <div className="h-[140px] bg-gradient-to-r from-slate-900 to-slate-800 relative">
              <button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-colors border border-white/20 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit Banner
              </button>
            </div>
            
            {/* Info Row */}
            <div className="p-6 pt-0 flex flex-col md:flex-row gap-6 relative">
              {/* Logo Square */}
              <div className="w-24 h-24 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center -mt-12 relative z-10 shrink-0 overflow-hidden">
                <span className="text-3xl font-black text-slate-300">LOGO</span>
              </div>
              
              <div className="flex-1 pt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-extrabold text-on-primary-fixed tracking-tight font-headline">Acme Corp</h1>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-green-200">Hiring</span>
                  </div>
                  <p className="text-sm text-outline font-medium">San Francisco, CA • Software Development</p>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex gap-2">
                    <div className="bg-surface-container-low px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface border border-outline-variant/10">
                      <span className="text-primary mr-1">{safeOffers.length}</span> Active Roles
                    </div>
                    <div className="bg-surface-container-low px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface border border-outline-variant/10">
                      <span className="text-primary mr-1">{totalApplicants}</span> Total Apps
                    </div>
                    <div className="bg-surface-container-low px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface border border-outline-variant/10 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.8 Rating
                    </div>
                  </div>
                  <Link href="/employer/post" className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:bg-primary/90 inline-flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Post Role
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Stats Row */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Total Pipeline</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-headline">{totalApplicants}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Open Roles</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-headline">{safeOffers.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Top Matches</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-headline">24</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Time to Hire</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-headline">14d</h3>
            </div>
          </section>

          {/* Live Recruitment Rails */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-extrabold text-on-primary-fixed font-headline">Live Recruitment Rails</h2>
              <p className="text-xs text-outline font-medium">Your active job postings and their current applicant status.</p>
            </div>
            
            {loading ? <p className="text-sm text-on-surface-variant">Loading offers...</p> : null}
            {error ? <p className="text-sm text-amber-700 font-semibold mb-4">{error}</p> : null}

            <section className="space-y-4">
              {safeOffers.map((offer) => (
                <article key={offer.id} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-on-primary-fixed font-headline">{offer.title}</h3>
                      <p className="text-sm text-on-surface-variant">{offer.location || "Remote"} • {offer.category || "General"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container bg-surface-container-low px-3 py-1 rounded-full">Applicants: {offer.applications?.length || 0}</span>
                      <Link href="/employer/applicants" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                        View <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}

              {!loading && !safeOffers.length ? (
                <div className="bg-surface-container-low p-8 rounded-lg text-center border border-dashed border-outline-variant/20">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">work_off</span>
                  <p className="text-on-surface-variant font-medium">No active roles posted yet.</p>
                  <Link href="/employer/post" className="text-primary text-sm font-bold mt-2 inline-block">Post your first role</Link>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          {/* Profile Strength */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 font-headline mb-4">Profile Strength</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">Intermediate</span>
                <span className="text-xs font-bold text-primary">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4 rounded-full"></div>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                Add company logo
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                Complete about section
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                <span className="material-symbols-outlined text-[16px] text-slate-300">radio_button_unchecked</span>
                Verify company email
              </li>
            </ul>
          </div>

          {/* Top Matches */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 font-headline">Top Matches</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Live</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" alt="Candidate" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">David Chen</h4>
                  <p className="text-[11px] text-slate-500 truncate">CS Junior @ MIT • Match: 98%</p>
                </div>
                <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" alt="Candidate" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">Sarah Jenkins</h4>
                  <p className="text-[11px] text-slate-500 truncate">UX Design @ RISD • Match: 95%</p>
                </div>
                <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBORfeEWxzeCq7HhNWfa406cfY_masDRvjQY4IEkrWwx-o8AjIs-kNb02Zpl1o2RaLMykzo3IyaVkuv-LdaPbryRhmnjEO2YOB2NzEU90Pt8qr8QY3Mstzf1Tq5qL7ilk6Ox6E4NfO-_R9J-P-NHFEHEvI5hDMerKlAYdkk95LA5hNWTxHe3XUdoTT5dM8C84eV-Sgn6-YLuTENaVuRKVY6JxootTK9UQAaUHKanJsEa1OmTzu9SeL7YYXWtu94LRY4bNJSFNeoF5I" alt="Candidate" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">Alex Rivera</h4>
                  <p className="text-[11px] text-slate-500 truncate">Full-stack @ Stanford • Match: 92%</p>
                </div>
                <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
            </div>
            <Link href="/employer/applicants" className="block w-full text-center text-xs font-bold text-slate-500 hover:text-slate-900 mt-4 py-2 bg-slate-50 rounded-lg transition-colors">View All Matches</Link>
          </div>

          {/* AI Auto-Pilot CTA */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-400">auto_awesome</span>
                <h3 className="font-headline font-bold">AI Auto-Pilot</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">Let our AI automatically source, vet, and shortlist candidates from the intern pool while you sleep.</p>
              <button className="w-full bg-white text-slate-900 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm">
                Enable Auto-Pilot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
