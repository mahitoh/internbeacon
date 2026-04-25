"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { clearAuth } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

function navItemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/90"
    : "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-slate-500 transition-colors hover:bg-slate-200/60";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

// Pick a consistent background colour from the user's name
function avatarColor(name: string) {
  const colours = [
    "bg-violet-600", "bg-blue-600", "bg-teal-600",
    "bg-emerald-600", "bg-amber-600", "bg-rose-600",
  ];
  const idx = name.charCodeAt(0) % colours.length;
  return colours[idx];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const isDashHome   = pathname === "/dashboard";
  const isApplications = pathname.startsWith("/dashboard/applications");
  const isFeed       = pathname.startsWith("/dashboard/feed");
  const isProfile    = pathname.startsWith("/dashboard/profile");
  const isBrowse     = pathname.startsWith("/dashboard/browse") || pathname.startsWith("/listings");
  const isResume     = pathname.startsWith("/dashboard/resume");
  const isRecommend  = pathname.startsWith("/dashboard/recommendations");
  const isNotif      = pathname.startsWith("/dashboard/notifications");

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const displayName = user?.name || "Student";
  const initials    = getInitials(displayName);
  const colour      = avatarColor(displayName);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col border-r border-slate-200/80 bg-slate-50 p-6 md:flex">
      {/* Logo + user card */}
      <div className="mb-8 px-2">
        <Logo className="h-8 w-auto max-w-[180px]" />

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
          {/* Avatar — initials, no external image */}
          <div
            className={`h-10 w-10 shrink-0 rounded-full ${colour} flex items-center justify-center text-white text-sm font-bold select-none`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight text-slate-900">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-500">
              {user?.role === "STUDENT" ? "Student" : "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        <Link href="/dashboard" className={`${navItemClass(isDashHome)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[14px] font-semibold">Dashboard</span>
        </Link>

        <Link href="/dashboard/feed" className={`${navItemClass(isFeed)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
          <span className="text-[14px] font-semibold">Feed</span>
        </Link>

        <Link href="/dashboard/applications" className={`${navItemClass(isApplications)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="text-[14px] font-semibold">Applications</span>
        </Link>

        {/* Browse — now points to /dashboard/browse to stay in shell */}
        <Link href="/dashboard/browse" className={`${navItemClass(isBrowse)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="text-[14px] font-semibold">Browse roles</span>
        </Link>

        <Link href="/dashboard/profile" className={`${navItemClass(isProfile)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[14px] font-semibold">Profile</span>
        </Link>

        <Link href="/dashboard/resume" className={`${navItemClass(isResume)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span className="text-[14px] font-semibold">Optimizer</span>
        </Link>

        <Link href="/dashboard/recommendations" className={`${navItemClass(isRecommend)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="text-[14px] font-semibold">AI Assistant</span>
        </Link>

        <Link href="/dashboard/notifications" className={`${navItemClass(isNotif)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="text-[14px] font-semibold">Notifications</span>
        </Link>

        <div className="my-2 border-t border-slate-200/70" />

        <a
          href="mailto:support@internbeacon.cm"
          className={`${navItemClass(false)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-[14px] font-semibold">Help & support</span>
        </a>
      </nav>

      {/* Logout */}
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-200/70">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 transition-colors hover:text-red-500 rounded-2xl hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[14px] font-semibold">Log out</span>
        </button>
      </div>
    </aside>
  );
}
