"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { clearAuth } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

function navItemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-[#00236F] px-4 py-3.5 text-white shadow-lg shadow-[#00236F]/20 font-bold transition-all"
    : "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-slate-500 transition-all hover:bg-white/60 hover:text-[#00236F]";
}

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
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col bg-[#F4F3FA] p-6 md:flex">
      {/* Logo + user card with tonal depth */}
      <div className="mb-10 px-2">
        <Logo className="h-8 w-auto max-w-[180px] mb-8" />

        <div className="flex items-center gap-4 rounded-[2rem] bg-white p-4 shadow-sm">
          <div
            className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-[#00236F] to-[#006591] flex items-center justify-center text-white text-sm font-bold select-none shadow-lg shadow-[#00236F]/20"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-tight text-[#1A1B21]">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {user?.role === "STUDENT" ? "Elite Talent • Vetted" : "Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        <div className="text-[10px] uppercase tracking-[0.25em] font-black text-[#006591] mb-3 px-4">Main Menu</div>
        
        <Link href="/dashboard" className={navItemClass(isDashHome)}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[14px]">Command Center</span>
        </Link>

        <Link href="/dashboard/feed" className={navItemClass(isFeed)}>
          <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
          <span className="text-[14px]">Discovery Feed</span>
        </Link>

        <Link href="/dashboard/browse" className={navItemClass(isBrowse)}>
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="text-[14px]">Browse All</span>
        </Link>

        <div className="mt-8 text-[10px] uppercase tracking-[0.25em] font-black text-[#006591] mb-3 px-4">Applications</div>

        <Link href="/dashboard/applications" className={navItemClass(isApplications)}>
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="text-[14px]">My Applications</span>
        </Link>

        <Link href="/dashboard/saved" className={navItemClass(isSaved)}>
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
          <span className="text-[14px]">Saved Roles</span>
        </Link>

        <div className="mt-8 text-[10px] uppercase tracking-[0.25em] font-black text-[#006591] mb-3 px-4">Career Tools</div>

        <Link href="/dashboard/resume" className={navItemClass(isResume)}>
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span className="text-[14px]">Resume Optimizer</span>
        </Link>

        <Link href="/dashboard/recommendations" className={navItemClass(isRecommend)}>
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="text-[14px]">AI Career Coach</span>
        </Link>

        <div className="mt-8 text-[10px] uppercase tracking-[0.25em] font-black text-[#006591] mb-3 px-4">Personal</div>

        <Link href="/dashboard/messages" className={navItemClass(isMessages)}>
          <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          <span className="text-[14px]">Messages</span>
        </Link>

        <Link href="/dashboard/profile" className={navItemClass(isProfile)}>
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          <span className="text-[14px]">Profile</span>
        </Link>

        <Link href="/dashboard/notifications" className={navItemClass(isNotif)}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="text-[14px]">Notifications</span>
        </Link>
      </nav>

      {/* Footer Nav */}
      <div className="mt-auto flex flex-col gap-2 pt-8">
        <Link href="/dashboard/settings" className={navItemClass(isSettings)}>
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-[14px]">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3.5 text-slate-400 transition-all hover:text-[#ba1a1a] rounded-2xl hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[14px] font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
