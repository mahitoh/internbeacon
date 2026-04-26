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
        const [profile, studentStats, applications, recommendations] = await Promise.all([
          getStudentProfile(),
          getStudentStats(),
          getStudentApplications(),
          getStudentRecommendations(),
        ]);
        if (!mounted) return;
        setName(profile.user?.name || "Mahito");
        setProfileStrength(profile.profileStrength || 78);
        setStats(studentStats || { applications: 12, shortlisted: 4, pending: 8, saved: 24 });
        setApplicationCount(Array.isArray(applications) ? applications.length : 12);
        setRecommendationCount(Array.isArray(recommendations) ? recommendations.length : 8);
      } catch (error) {
        if (!mounted) return;
        setApiError(getUserFriendlyError(error, "Live connection offline."));
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col gap-12 lg:gap-20">
      {/* ── EDITORIAL HEADER ───────────────────────────────────────────── */}
      <header className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#006591] mb-4 block font-headline">The Architectural Beacon</span>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-[#1A1B21] font-headline leading-[0.85]">
            Command <br /> <span className="text-[#00236F]">Central.</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed">
            Welcome back, {name}. Your professional journey in Cameroon is being curated by our AI engine.
          </p>
        </div>

        <div className="bg-[#F4F3FA] p-8 rounded-[2rem] flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Profile Integrity</span>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-[#1A1B21] font-headline leading-none">{profileStrength}%</span>
              <span className="text-xs font-bold text-[#006591] mb-1">Optimized</span>
            </div>
          </div>
          <div className="w-32 h-3 bg-white rounded-full overflow-hidden relative shadow-inner">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00236F] to-[#006591] transition-all duration-1000 ease-out" 
              style={{ width: `${profileStrength}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* ── NOTIFICATION BAR ───────────────────────────────────────────── */}
      {apiError && (
        <div className="bg-[#F4F3FA] p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">offline_bolt</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1B21]">Offline Experience Enabled</p>
              <p className="text-[11px] text-slate-400 font-medium">Displaying cached professional insights.</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      )}

      {/* ── STATS GRID: ASYMMETRICAL ───────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {[
          { label: "Tracked Applications", value: stats.applications, icon: "analytics" },
          { label: "Shortlisted Roles", value: stats.shortlisted, icon: "verified", primary: true },
          { label: "Interview Pipeline", value: stats.pending, icon: "dynamic_feed" },
          { label: "Saved for Later", value: stats.saved, icon: "bookmark" },
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`p-10 rounded-[2.5rem] transition-all duration-500 group ${
              stat.primary 
              ? "bg-[#00236F] text-white shadow-xl shadow-[#00236F]/20 hover:-translate-y-2" 
              : "bg-white text-[#1A1B21] shadow-sm hover:shadow-md hover:-translate-y-1"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl mb-8 flex items-center justify-center ${stat.primary ? "bg-white/10" : "bg-[#F4F3FA]"}`}>
              <span className={`material-symbols-outlined text-[24px] ${stat.primary ? "text-white" : "text-[#00236F]"}`}>{stat.icon}</span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${stat.primary ? "text-white/60" : "text-slate-400"}`}>
              {stat.label}
            </p>
            <h3 className="text-5xl font-black font-headline leading-none">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* ── MAIN CONTENT: THE ARCHITECTURAL BEACON ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Smart Match Engine */}
        <div className="lg:col-span-8 bg-[#00236F] rounded-[3rem] p-10 lg:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#006591] rounded-full blur-[120px] opacity-30 -mr-40 -mt-40 transition-all group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#F4F3FA]/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
              <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
              Smart Match Engine
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-[1.0] font-headline">
              Curated <br /> For <span className="italic text-[#006591]">Success.</span>
            </h2>
            
            <p className="text-blue-100/70 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl font-medium">
              Our AI has analyzed 1,240 internships in Cameroon this week. You have <span className="text-white font-bold">{recommendationCount} priority matches</span> aligning with your software engineering background.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-white text-[#00236F] px-10 py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg">
                View Recommendations
              </button>
              <button className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all">
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#F4F3FA] rounded-[2.5rem] p-10">
            <h3 className="text-xl font-black text-[#1A1B21] mb-8 font-headline uppercase tracking-tight">Recent Activity</h3>
            
            <div className="space-y-6">
              {[
                { company: "Orange CM", role: "Cloud Intern", status: "In Review", color: "bg-orange-100 text-orange-600" },
                { company: "ENEO", role: "Data Analyst", status: "Interview", color: "bg-blue-100 text-blue-600" },
                { company: "MTN", role: "DevOps", status: "Pending", color: "bg-yellow-100 text-yellow-600" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-[#006591]/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F3FA] flex items-center justify-center font-bold text-[10px] text-[#00236F]">
                    {activity.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1B21] truncate">{activity.role}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{activity.company}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${activity.color}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00236F] transition-colors">
              View All Applications →
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#1A1B21] to-[#00236F] rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <span className="material-symbols-outlined text-5xl opacity-10 absolute -bottom-4 -right-4 rotate-12">school</span>
            <h4 className="text-lg font-black font-headline mb-3">Skill Assessment</h4>
            <p className="text-xs text-white/60 leading-relaxed mb-6 font-medium">
              Complete your React technical assessment to unlock Tier 1 internship opportunities.
            </p>
            <button className="text-[11px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all w-full">
              Start Test
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
