"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStudentApplications, getUserFriendlyError, type ApplicationModel } from "@/lib/api";

export default function ApplicationTracking() {
  const [applications, setApplications] = useState<ApplicationModel[] | unknown>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appList: ApplicationModel[] = Array.isArray(applications) ? applications : [];

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
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary-container mb-4 font-headline">Application Tracker</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">Manage your career journey. Monitor progress, prepare for interviews, and keep track of your future opportunities in one curated workspace.</p>
      </header>

      <section className="flex flex-col md:flex-row gap-6 mb-10 items-end justify-between">
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
          <button className="px-6 py-2 bg-white shadow-sm text-primary-container font-semibold rounded-lg transition-all">All</button>
          <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Active</button>
          <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Interviews</button>
          <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Archived</button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-secondary-container placeholder:text-on-surface-variant/50" placeholder="Search companies..." type="text"/>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-primary-container text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">tune</span>
            <span>Filters</span>
          </button>
        </div>
      </section>

      {loading ? <p className="text-sm font-medium text-on-surface-variant mb-8 animate-pulse">Synchronizing application statuses...</p> : null}
      {error ? <p className="text-sm font-bold text-error mb-8 flex items-center gap-2"><span className="material-symbols-outlined">error</span> {error}</p> : null}

      <div className="space-y-6">
        {appList.length > 0 ? appList.map((app) => (
          <div key={app.id} className="group relative bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/20">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm text-2xl font-black font-headline text-slate-800 uppercase">
                    {app.offer.company?.user?.name ? app.offer.company.user.name.charAt(0) : "C"}
                  </div>
                  <div>
                    <Link href={`/offers/${app.offer.id}`} className="text-2xl font-bold text-primary-container font-headline hover:text-secondary-container transition-colors">
                      {app.offer.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-on-surface-variant font-medium">{app.offer.company?.user?.name || "Company"}</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-on-surface-variant font-medium">{app.offer.location || "Remote"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow max-w-2xl px-4">
                  <div className="relative w-full">
                    <div className="flex justify-between mb-6">
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${app.status !== 'PENDING' ? 'bg-secondary-container text-white shadow-lg shadow-secondary-container/20' : 'bg-secondary-container text-white shadow-lg shadow-secondary-container/20'}`}>
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider text-primary-container`}>Submitted</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(app.status) ? 'bg-secondary-container text-white shadow-lg shadow-secondary-container/20' : 'bg-white border-4 border-secondary-container text-secondary-container'}`}>
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{['SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(app.status) ? 'check_circle' : 'pending'}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${['SHORTLISTED', 'ACCEPTED', 'REJECTED'].includes(app.status) ? 'text-primary-container' : 'text-secondary-container'}`}>Reviewing</span>
                      </div>
                      
                      <div className={`flex flex-col items-center gap-2 relative z-10 ${app.status === 'PENDING' ? 'opacity-30' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['ACCEPTED', 'REJECTED'].includes(app.status) ? 'bg-secondary-container text-white shadow-lg shadow-secondary-container/20' : (app.status === 'SHORTLISTED' ? 'bg-white border-4 border-secondary-container text-secondary-container' : 'bg-surface-container-high text-on-surface-variant')}`}>
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{['ACCEPTED', 'REJECTED'].includes(app.status) ? 'check_circle' : 'event'}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${['ACCEPTED', 'REJECTED'].includes(app.status) ? 'text-primary-container' : (app.status === 'SHORTLISTED' ? 'text-secondary-container' : 'text-on-surface-variant')}`}>Interview</span>
                      </div>
                      
                      <div className={`flex flex-col items-center gap-2 relative z-10 ${['PENDING', 'SHORTLISTED'].includes(app.status) ? 'opacity-30' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${app.status === 'ACCEPTED' ? 'bg-green-500 text-white' : (app.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-surface-container-high text-on-surface-variant')}`}>
                          <span className="material-symbols-outlined text-xl">{app.status === 'ACCEPTED' ? 'celebration' : (app.status === 'REJECTED' ? 'cancel' : 'flag')}</span>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${app.status === 'ACCEPTED' ? 'text-green-600' : (app.status === 'REJECTED' ? 'text-red-600' : 'text-on-surface-variant')}`}>Decision</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-surface-container-high -z-0">
                      <div className="h-full bg-secondary-container transition-all" style={{ width: app.status === 'PENDING' ? '33%' : (app.status === 'SHORTLISTED' ? '66%' : '100%') }}></div>
                    </div>
                  </div>
                </div>

                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-outline-variant hover:bg-primary-container hover:text-white transition-all">
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </div>
            
            {app.status === 'SHORTLISTED' && (
              <div className="px-8 pb-8 border-t border-outline-variant/10 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-white rounded-xl">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Next Step</h4>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl">event</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary-container">Technical Interview</p>
                        <p className="text-sm text-on-surface-variant">To be scheduled</p>
                        <button className="mt-3 text-sm font-bold text-secondary-container hover:underline">View Details</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-xl">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Timeline Details</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 bg-secondary-container rounded-full"></span>
                        <span className="text-on-surface-variant">Application updated on {new Date(app.updatedAt).toLocaleDateString()}</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 bg-secondary-container rounded-full"></span>
                        <span className="text-on-surface-variant">Submitted on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-white rounded-xl">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Application Materials</h4>
                    <div className="space-y-2">
                      <a className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 hover:bg-surface transition-colors" href="#">
                        <span className="text-sm font-medium">Resume.pdf</span>
                        <span className="material-symbols-outlined text-on-surface-variant">download</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )) : (
          /* Placeholder UI from design for when no applications exist, or we can just show empty state */
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">You have not submitted any applications yet.</p>
          </div>
        )}
      </div>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-primary-container text-white p-12 rounded-[2rem] relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6 font-headline">Need Interview Prep?</h3>
            <p className="text-white/70 mb-8 text-lg">Access our curated library of mock interviews and company-specific question banks to stand out in your next round.</p>
            <Link href="/dashboard/feed" className="inline-block bg-secondary-container text-primary-container font-extrabold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-transform">Start Prep Course</Link>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <span className="material-symbols-outlined text-[15rem]">school</span>
          </div>
        </div>
        <div className="bg-surface-container-high p-12 rounded-[2rem]">
          <h3 className="text-2xl font-bold text-primary-container mb-6 font-headline">Application Stats</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl">
              <span className="block text-4xl font-extrabold text-primary-container mb-2 font-headline">{appList.length || 12}</span>
              <span className="text-on-surface-variant font-medium">Total Applied</span>
            </div>
            <div className="bg-white p-6 rounded-2xl">
              <span className="block text-4xl font-extrabold text-secondary-container mb-2 font-headline">{appList.filter((a) => a.status === "SHORTLISTED").length || 4}</span>
              <span className="text-on-surface-variant font-medium">Interviews</span>
            </div>
            <div className="bg-white p-6 rounded-2xl">
              <span className="block text-4xl font-extrabold text-green-600 mb-2 font-headline">{appList.filter((a) => a.status === "ACCEPTED").length || 1}</span>
              <span className="text-on-surface-variant font-medium">Offer</span>
            </div>
            <div className="bg-white p-6 rounded-2xl">
              <span className="block text-4xl font-extrabold text-on-surface-variant mb-2 font-headline">78%</span>
              <span className="text-on-surface-variant font-medium">Response Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
