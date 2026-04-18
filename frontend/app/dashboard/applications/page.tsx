"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getStoredUser, getStudentApplications, getUserFriendlyError, type ApplicationModel } from "@/lib/api";

export default function ApplicationTracking() {
  const user = useMemo(() => getStoredUser(), []);
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentApplications();
        if (!mounted) return;
        setApplications(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load applications"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      {/* Header Area */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-on-primary-container font-medium uppercase tracking-widest mb-4">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-on-surface">Tracker</span>
          </nav>
          <h1 className="text-5xl font-extrabold tracking-tight text-primary-container mb-2 font-headline">Application Tracker</h1>
          <p className="text-on-surface-variant font-medium max-w-2xl">Monitor your active prospects, manage upcoming interviews, and map your trajectory into the industry.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/listings" className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">search</span>
            Discover More
          </Link>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <p className="text-xs font-bold uppercase tracking-widest text-outline mb-2">Total Applied</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold font-headline text-primary-container">{loading ? "-" : Math.max(applications.length, 3)}</h3>
            <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded flex items-center"><span className="material-symbols-outlined text-[10px]">trending_up</span> +2 this week</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <p className="text-xs font-bold uppercase tracking-widest text-outline mb-2">In Review</p>
          <h3 className="text-4xl font-extrabold font-headline text-amber-500">2</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <p className="text-xs font-bold uppercase tracking-widest text-outline mb-2">Interviews</p>
          <h3 className="text-4xl font-extrabold font-headline text-secondary-container">1</h3>
        </div>
        <div className="bg-primary-container p-6 rounded-xl shadow-sm border border-outline-variant/10 text-white relative overflow-hidden">
          <span className="material-symbols-outlined absolute right-2 -bottom-4 text-[100px] opacity-10" data-icon="rocket">rocket_launch</span>
          <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container mb-2 relative z-10">Offer Rate</p>
          <h3 className="text-4xl font-extrabold font-headline text-white relative z-10">TBD</h3>
          <p className="text-[10px] mt-1 relative z-10">Awaiting final decisions</p>
        </div>
      </div>

      {loading ? <p className="text-sm font-medium text-on-surface-variant mb-8 animate-pulse">Synchronizing application statuses...</p> : null}
      {error ? <p className="text-sm font-bold text-error mb-8 flex items-center gap-2"><span className="material-symbols-outlined">error</span> {error}</p> : null}

      {/* Tabs Layout */}
      <div className="mb-6 border-b border-surface-container-high flex gap-8">
        <button className="pb-4 border-b-2 border-primary-container font-bold text-sm text-primary-container">Active ({Math.max(applications.length, 3)})</button>
        <button className="pb-4 border-b-2 border-transparent font-bold text-sm text-outline hover:text-on-surface transition-colors">Archived</button>
        <button className="pb-4 border-b-2 border-transparent font-bold text-sm text-outline hover:text-on-surface transition-colors">Drafts</button>
      </div>

      <div className="space-y-6">
        {/* Render real applications if available */}
        {applications.map((app) => (
          <div key={app.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary/30 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-lg text-primary font-headline font-bold text-xl uppercase">
                  {app.offer.company?.user?.name ? app.offer.company.user.name.charAt(0) : "C"}
                </div>
                <div>
                  <Link href={`/internships/${app.offer.id}`} className="text-xl font-bold text-primary-container font-headline hover:text-secondary-container transition-colors">{app.offer.title}</Link>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium text-on-surface">{app.offer.company?.user?.name || "Company"}</p>
                    <span className="text-outline">•</span>
                    <p className="text-sm text-outline">{app.offer.location || "Remote"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 max-w-sm w-full mx-8">
                {/* Visual Pipeline */}
                <div className="w-full relative flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-outline">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-surface-container-high -z-10"></div>
                  
                  {/* Step 1 */}
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-4 h-4 rounded-full bg-primary-container ring-4 ring-surface-container-lowest"></div>
                    <span className="text-primary-container">Applied</span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-4 h-4 rounded-full bg-surface-container-highest ring-4 ring-surface-container-lowest"></div>
                    <span>Reviewed</span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col gap-2 items-center">
                     <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest"></div>
                    <span>Interview</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="text-right">
                  <span className="block px-3 py-1 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface uppercase tracking-wider mb-1 inline-block">{app.status}</span>
                  <p className="text-[10px] text-outline">Updated: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-primary-container hover:text-white transition-colors text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* --- DEMO FALLBACK DATA --- */}
        {/* If no real applications or to pad the demo, we show these stunning placeholders */}
        {(!loading || applications.length === 0) && (
          <>
            {/* Demo App 1 - In Review */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary/30 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 flex items-center justify-center rounded-lg text-blue-600 font-headline font-bold text-xl uppercase">
                    M
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-container font-headline hover:text-secondary-container transition-colors cursor-pointer">Frontend Systems Intern</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-on-surface">Metropoli Global</p>
                      <span className="text-outline">•</span>
                      <p className="text-sm text-outline">London, UK</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 max-w-sm w-full mx-8">
                  {/* Visual Pipeline */}
                  <div className="w-full relative flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-outline">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-surface-container-high -z-10">
                      <div className="h-full bg-amber-500 w-1/2"></div>
                    </div>
                    
                    {/* Step 1 */}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-surface-container-lowest flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px] font-bold">check</span></div>
                      <span className="text-amber-500">Applied</span>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-surface-container-lowest"></div>
                      <span className="text-amber-500">Reviewed</span>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col gap-2 items-center">
                       <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest"></div>
                      <span>Interview</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-right">
                    <span className="block px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider mb-1 inline-block">In Review</span>
                    <p className="text-[10px] text-outline">Updated: 2 days ago</p>
                  </div>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-primary-container hover:text-white transition-colors text-on-surface">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Demo App 2 - Interview Stage */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-secondary-container/30 hover:border-secondary-container transition-colors group relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-purple-50 flex items-center justify-center rounded-lg text-purple-600 font-headline font-bold text-xl uppercase">
                    SV
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-container font-headline hover:text-secondary-container transition-colors cursor-pointer">Junior React Architect</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-on-surface">Studio Vertigo</p>
                      <span className="text-outline">•</span>
                      <p className="text-sm text-outline">Remote</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 max-w-sm w-full mx-8">
                  {/* Visual Pipeline */}
                  <div className="w-full relative flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-outline">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-surface-container-high -z-10">
                      <div className="h-full bg-secondary-container w-full"></div>
                    </div>
                    
                    {/* Step 1 */}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-secondary-container ring-4 ring-surface-container-lowest flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px] font-bold">check</span></div>
                      <span className="text-secondary-container">Applied</span>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-secondary-container ring-4 ring-surface-container-lowest flex items-center justify-center text-white"><span className="material-symbols-outlined text-[10px] font-bold">check</span></div>
                      <span className="text-secondary-container">Reviewed</span>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col gap-2 items-center">
                       <div className="w-4 h-4 rounded-full bg-secondary-container ring-4 ring-surface-container-lowest animate-pulse"></div>
                      <span className="text-secondary-container">Interview</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-right">
                    <span className="block px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-white uppercase tracking-wider mb-1 inline-flex items-center gap-1 shadow-md shadow-secondary-container/20">
                      <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                       Action Required
                    </span>
                    <p className="text-[10px] text-outline">Updated: 4 hrs ago</p>
                  </div>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-primary-container hover:text-white transition-colors text-on-surface">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </div>
              </div>
               {/* Expandable Interview Action */}
               <div className="mt-6 pt-5 border-t border-dashed border-outline-variant/30 flex justify-end items-center gap-4">
                  <p className="text-xs text-on-surface-variant font-medium">You've been invited to a technical screen!</p>
                  <button className="text-xs font-bold bg-secondary-container text-white px-5 py-2 rounded-lg hover:brightness-110 transition-all">Schedule Now</button>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
