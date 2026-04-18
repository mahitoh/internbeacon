"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getUserFriendlyError,
  getStoredUser,
  getStudentApplications,
  getStudentProfile,
  getStudentRecommendations,
  getStudentStats,
} from "@/lib/api";

export default function Dashboard() {
  const user = useMemo(() => getStoredUser(), []);
  const [name, setName] = useState(user?.name || "Student");
  const [profileStrength, setProfileStrength] = useState(0);
  const [stats, setStats] = useState({ applications: 0, shortlisted: 0, pending: 0, saved: 0 });
  const [applicationCount, setApplicationCount] = useState(0);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setApiError(null);

        const [profile, studentStats, applications, recommendations] = await Promise.all([
          getStudentProfile(),
          getStudentStats(),
          getStudentApplications(),
          getStudentRecommendations(),
        ]);

        if (!mounted) return;
        setName(profile.user?.name || user?.name || "Student");
        setProfileStrength(profile.profileStrength || 0);
        setStats(studentStats);
        setApplicationCount(applications.length);
        setRecommendationCount(recommendations.length);
      } catch (error) {
        if (!mounted) return;
        setApiError(getUserFriendlyError(error, "Failed to load dashboard data"));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user?.name]);

  return (
    <>
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-2 block font-headline">Student Console</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-background font-headline">Good morning, {name}</h1>
        </div>
        <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Profile Strength</span>
            <span className="text-xl font-black text-on-surface font-headline">{profileStrength}%</span>
          </div>
          <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-secondary-container" style={{ width: `${Math.min(Math.max(profileStrength, 0), 100)}%` }}></div>
          </div>
        </div>
      </header>

      {apiError ? (
        <p className="mb-6 text-sm font-semibold text-amber-700">Live API unavailable ({apiError}). Showing any available cached values.</p>
      ) : null}

      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Applications</p>
          <h3 className="text-3xl font-black text-on-background font-headline">{stats.applications}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-1">Shortlisted</p>
          <h3 className="text-3xl font-black text-on-background font-headline">{stats.shortlisted}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Pending</p>
          <h3 className="text-3xl font-black text-on-background font-headline">{stats.pending}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Recommendations</p>
          <h3 className="text-3xl font-black text-on-background font-headline">{recommendationCount}</h3>
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bg-primary-container relative flex min-h-[280px] items-center overflow-hidden rounded-lg p-8 lg:col-span-8 lg:min-h-[300px] lg:p-12">
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter mb-4">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Smart Match Optimization
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight font-headline">Your activity at a glance.</h2>
            <p className="text-primary-fixed-dim text-sm mb-6 leading-relaxed">
              You currently have {applicationCount} tracked applications and {recommendationCount} personalized recommendations.
            </p>
            <button className="bg-white text-primary-container px-6 py-3 rounded-lg font-bold text-sm transition-all hover:bg-slate-100">Review Insights</button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg bg-surface-container-low p-8 lg:col-span-4">
          <div>
            <h3 className="text-lg font-bold text-on-background mb-2 font-headline">Profile Completion</h3>
            <p className="text-xs text-outline leading-relaxed mb-6">Keep improving your profile to increase matching and recruiter response rates.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium">Current Strength</span>
                <span className="font-bold">{profileStrength}%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container" style={{ width: `${Math.min(Math.max(profileStrength, 0), 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
