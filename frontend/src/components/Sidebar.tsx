"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { clearAuth } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

function navItemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/90 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700"
    : "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-slate-500 transition-colors hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/55";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const isDashHome = pathname === "/dashboard";
  const isApplications = pathname.startsWith("/dashboard/applications");
  const isFeed = pathname.startsWith("/dashboard/feed");
  const isProfile = pathname.startsWith("/dashboard/profile");
  const isBrowse = pathname.startsWith("/browse") || pathname.startsWith("/listings") || pathname.startsWith("/discover");

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

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
              {user?.name || "Student"}
            </p>
            <p className="text-[11px] text-slate-500">{user?.role === "STUDENT" ? "Student" : "User"}</p>
          </div>
        </div>
      </div>

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
        <Link href="/listings" className={`${navItemClass(isBrowse)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">search</span>
          <span className="text-[14px] font-semibold">Browse roles</span>
        </Link>
        <Link href="/dashboard/profile" className={`${navItemClass(isProfile)} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[14px] font-semibold">Profile</span>
        </Link>
        <Link href="/dashboard/resume" className={`${navItemClass(pathname.startsWith("/dashboard/resume"))} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span className="text-[14px] font-semibold">Optimizer</span>
        </Link>
        <Link href="/dashboard/recommendations" className={`${navItemClass(pathname.startsWith("/dashboard/recommendations"))} hover:translate-x-0.5 transition-transform duration-200`}>
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span className="text-[14px] font-semibold">AI Assistant</span>
        </Link>
        <Link href="/dashboard/notifications" className={`${navItemClass(pathname.startsWith("/dashboard/notifications"))} hover:translate-x-0.5 transition-transform duration-200`}>
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
