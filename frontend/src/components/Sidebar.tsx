"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const isDashHome      = pathname === "/dashboard";
  const isFeed          = pathname.startsWith("/dashboard/feed");
  const isBrowse        = pathname.startsWith("/dashboard/browse") || pathname.startsWith("/listings");
  const isApplications  = pathname.startsWith("/dashboard/applications");
  const isSaved         = pathname.startsWith("/dashboard/saved");
  const isAnalytics     = pathname.startsWith("/dashboard/analytics");
  const isSettings      = pathname.startsWith("/dashboard/settings");
  const isHelp          = pathname.startsWith("/dashboard/help");

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const displayName = user?.name || "Jean-Luc";
  const initials    = getInitials(displayName);

  return (
    <aside className="fixed left-0 top-0 h-full p-6 flex flex-col gap-4 bg-slate-50 dark:bg-slate-950 w-72 border-r-0 z-40 hidden md:flex">
      <div className="mb-8 px-2">
        <span className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">InternBeacon</span>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600">
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-tight">{displayName}</p>
            <p className="text-[11px] text-slate-500">Elite Talent View</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isDashHome 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isDashHome ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span className="text-[13px] font-semibold">Dashboard</span>
        </Link>
        
        <Link 
          href="/dashboard/feed" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isFeed 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFeed ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          <span className="text-[13px] font-semibold">Network</span>
        </Link>

        <Link 
          href="/dashboard/browse" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isBrowse 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isBrowse ? "'FILL' 1" : "'FILL' 0" }}>work</span>
          <span className="text-[13px] font-semibold">Opportunities</span>
        </Link>

        <Link 
          href="/dashboard/applications" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isApplications 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isApplications ? "'FILL' 1" : "'FILL' 0" }}>description</span>
          <span className="text-[13px] font-semibold">Applications</span>
        </Link>

        <Link 
          href="/dashboard/saved" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isSaved 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
          <span className="text-[13px] font-semibold">Saved</span>
        </Link>

        <Link 
          href="/dashboard/analytics" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isAnalytics 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isAnalytics ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
          <span className="text-[13px] font-semibold">Analytics</span>
        </Link>

        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isSettings 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSettings ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
          <span className="text-[13px] font-semibold">Profile / CV</span>
        </Link>
        
        <Link 
          href="/dashboard/help" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 group ${
            isHelp 
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm" 
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isHelp ? "'FILL' 1" : "'FILL' 0" }}>help</span>
          <span className="text-[13px] font-semibold">Help</span>
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <button className="bg-secondary-container text-on-secondary-container py-3 px-4 rounded-xl text-[13px] font-bold transition-all hover:opacity-90 active:scale-95">
          Upgrade Plan
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 transition-colors w-full group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
          <span className="text-[13px] font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
