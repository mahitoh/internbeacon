"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

function navItemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/90 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700"
    : "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-slate-500 transition-colors hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/55";
}

export default function Sidebar() {
  const pathname = usePathname();

  const isDashHome = pathname === "/dashboard";
  const isApplications = pathname.startsWith("/dashboard/applications");
  const isListings = pathname.startsWith("/listings");
  const isFeed = pathname.startsWith("/dashboard/feed");
  const isProfile = pathname.startsWith("/dashboard/profile");

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col gap-4 border-r border-slate-200/80 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950 md:flex">
      <div className="mb-8 px-2">
        <Logo className="h-8 w-auto max-w-[180px]" />
        <div className="mt-8 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB76bvavzEkVAGqwRTQU1uvB44JkNxIzkxkq4hlyuR1IjtmjrAzRGL_7RdFQiscYjovQ8am2M8Dq3Le77YKBDq3p_UTIKeuJXessBjv-wieUMVj8KXl6yoLFmsdSO6hh3r6wfOo0w7jvCHNuMah7Lb1opxsyutsc2M2albB6uLjYxd5AaRGJNufq2AyCr03xfJfYoeQ_UJzjZMiDA2DDCuUdJBpBLjl6jp9oOzM__lr2vnUjE88ajLGQSNA6VVGa6RnobQ_cPy6QE"
              alt="User avatar"
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              Jean-Luc
            </p>
            <p className="text-[11px] text-slate-500">Student</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        <Link
          href="/dashboard"
          className={`${navItemClass(isDashHome)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[14px] font-semibold">Dashboard</span>
        </Link>
        <Link
          href="/dashboard/feed"
          className={`${navItemClass(isFeed)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">dynamic_feed</span>
          <span className="text-[14px] font-semibold">Feed</span>
        </Link>
        <Link
          href="/dashboard/applications"
          className={`${navItemClass(isApplications)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="text-[14px] font-semibold">Applications</span>
        </Link>
        <Link
          href="/listings"
          className={`${navItemClass(isListings)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
          <span className="text-[14px] font-semibold">Saved listings</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`${navItemClass(isProfile)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[14px] font-semibold">Profile</span>
        </Link>
        <Link
          href="/browse"
          className={`${navItemClass(pathname.startsWith("/browse"))} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="text-[14px] font-semibold">Browse roles</span>
        </Link>
        <Link
          href="/login"
          className={`${navItemClass(false)} hover:translate-x-0.5 transition-transform duration-200`}
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-[14px] font-semibold">Help</span>
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <button
          type="button"
          className="rounded-2xl bg-secondary-container px-4 py-3.5 text-sm font-bold text-on-secondary-container shadow-md shadow-amber-500/20 transition-all hover:opacity-90 active:scale-95"
        >
          Upgrade plan
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[14px] font-semibold">Log out</span>
        </Link>
      </div>
    </aside>
  );
}
