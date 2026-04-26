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
  const isApplications  = pathname.startsWith("/dashboard/applications");
  const isFeed          = pathname.startsWith("/dashboard/feed");
  const isProfile       = pathname.startsWith("/dashboard/profile");
  const isBrowse        = pathname.startsWith("/dashboard/browse") || pathname.startsWith("/listings");
  const isResume        = pathname.startsWith("/dashboard/resume");
  const isRecommend     = pathname.startsWith("/dashboard/recommendations");
  const isNotif         = pathname.startsWith("/dashboard/notifications");
  const isMessages      = pathname.startsWith("/dashboard/messages");
  const isSaved         = pathname.startsWith("/dashboard/saved");
  const isSettings      = pathname.startsWith("/dashboard/settings");

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const displayName = user?.name || "Student";
  const initials    = getInitials(displayName);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-slate-900 py-8 px-4 md:flex shadow-2xl">
      {/* Logo */}
      <div className="mb-10 px-4">
        <span className="text-2xl font-bold text-white tracking-tighter">InternBeacon</span>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-amber-500/20 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{initials}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">{displayName}</span>
          <span className="text-slate-400 text-xs">Elite Talent • Vetted</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {/* Active: Home */}
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isDashHome 
              ? "text-white border-r-4 border-amber-500 bg-slate-800/50" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="text-sm">Home</span>
        </Link>

        <Link 
          href="/dashboard/browse" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isBrowse 
              ? "text-white border-r-4 border-amber-500 bg-slate-800/50" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">work</span>
          <span className="text-sm">Opportunities</span>
        </Link>

        <Link 
          href="/dashboard/applications" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isApplications 
              ? "text-white border-r-4 border-amber-500 bg-slate-800/50" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          <span className="text-sm">Applications</span>
        </Link>

        <Link 
          href="/dashboard/feed" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isFeed 
              ? "text-white border-r-4 border-amber-500 bg-slate-800/50" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">group</span>
          <span className="text-sm">Network</span>
        </Link>

        <Link 
          href="/dashboard/saved" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isSaved 
              ? "text-white border-r-4 border-amber-500 bg-slate-800/50" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">book</span>
          <span className="text-sm">Resources</span>
        </Link>
      </nav>

      {/* Footer Nav */}
      <div className="mt-auto pt-6 space-y-1">
        <button className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl mb-6 text-sm hover:opacity-90 active:scale-95 transition-all">
          View Portfolio
        </button>

        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
            isSettings 
              ? "text-white bg-slate-800" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 font-medium hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm">Support</span>
        </button>
      </div>
    </aside>
  );
}
