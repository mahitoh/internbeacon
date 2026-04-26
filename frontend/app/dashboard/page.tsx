"use client";

import React, { useEffect, useState } from "react";
import {
  getUserFriendlyError,
  getStudentApplications,
  getStudentProfile,
  getStudentRecommendations,
  getStudentStats,
} from "@/lib/api";

export default function Dashboard() {
  const [name, setName] = useState("Student");
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
        setName(profile.user?.name || "Student");
        setProfileStrength(profile.profileStrength || 0);
        setStats(studentStats || { applications: 0, shortlisted: 0, pending: 0, saved: 0 });
        setApplicationCount(Array.isArray(applications) ? applications.length : 0);
        setRecommendationCount(Array.isArray(recommendations) ? recommendations.length : 0);
      } catch (error) {
        if (!mounted) return;
        setApiError(getUserFriendlyError(error, "Failed to load dashboard data"));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <header className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-secondary mb-3 block font-headline">Student Console v2.0</span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-on-background font-headline leading-[0.9]">
            Good morning, <br /><span className="text-secondary">{name}</span>
          </h1>
        </div>
        <div className="bg-surface-container-low p-6 rounded-3xl flex items-center gap-8 shadow-editorial">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest font-black text-outline mb-1">Profile Strength</span>
            <span className="text-3xl font-black text-on-surface font-headline leading-none">{profileStrength}%</span>
          </div>
          <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-secondary-container transition-all duration-1000" style={{ width: `${Math.min(Math.max(profileStrength, 0), 100)}%` }}></div>
          </div>
        </div>
      </header>

      {apiError ? (
        <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-2xl text-xs font-bold flex items-center gap-3">
          <span className="material-symbols-outlined text-lg">error</span>
          Live API unavailable ({apiError}). Showing any available cached values.
        </div>
      ) : null}

      <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        {[
          { label: "Applications", value: stats.applications, color: "text-outline" },
          { label: "Shortlisted", value: stats.shortlisted, color: "text-secondary" },
          { label: "Pending", value: stats.pending, color: "text-outline" },
          { label: "Recommendations", value: recommendationCount, color: "text-outline" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-8 rounded-3xl shadow-editorial group hover:bg-on-primary-fixed transition-all duration-500">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-white/60 transition-colors ${stat.color}`}>{stat.label}</p>
            <h3 className="text-4xl font-black text-on-background font-headline group-hover:text-white transition-colors">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bg-primary-container relative flex min-h-[340px] items-center overflow-hidden rounded-[2rem] p-8 lg:col-span-8 lg:min-h-[400px] lg:p-16">
          <div className="absolute inset-0 opacity-10 architectural-grid"></div>
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Smart Match Engine
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1] font-headline">Your activity <br />at a glance.</h2>
            <p className="text-primary-fixed-dim text-base mb-8 leading-relaxed font-medium">
              You currently have {applicationCount} tracked applications and {recommendationCount} personalized recommendations waiting for you.
            </p>
            <button className="bg-white text-primary-container px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-editorial">Review Insights</button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[2rem] bg-surface-container-low p-10 lg:col-span-4 border-none shadow-editorial">
          <div>
            <h3 className="text-xl font-black text-on-background mb-3 font-headline uppercase tracking-tight">Navigation</h3>
            <p className="text-xs text-outline leading-relaxed mb-8 font-medium">Quickly jump to important sections of your dashboard.</p>
            
            <div className="space-y-3">
              {[
                { label: "My Profile", icon: "person", href: "/dashboard/profile" },
                { label: "Browse Offers", icon: "explore", href: "/dashboard/browse" },
                { label: "Applications", icon: "description", href: "/dashboard/applications" },
                { label: "Settings", icon: "settings", href: "/dashboard/settings" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest hover:bg-secondary hover:text-white transition-all group shadow-sm">
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  <span className="text-sm font-bold tracking-tight">{link.label}</span>
                  <span className="material-symbols-outlined ml-auto text-lg opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
