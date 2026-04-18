"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { clearAuth, getStoredUser, type AuthUser } from "@/lib/api";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-white p-3.5 text-slate-900 shadow-md shadow-slate-200/40 ring-1 ring-slate-200/90"
    : "flex items-center gap-3.5 rounded-2xl p-3.5 text-slate-500 transition-colors hover:bg-slate-200/55";
}

export default function EmployerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const dash = pathname === "/employer/dashboard";
  const applicants = pathname.startsWith("/employer/applicants");
  const messages = pathname.startsWith("/employer/messages");
  const post = pathname.startsWith("/employer/post");

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col gap-4 border-r border-slate-200/80 bg-slate-50 p-6 md:flex">
      <div className="mb-6">
        <Logo className="h-8 w-auto max-w-[180px]" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-500 font-headline">
          Employer console
        </p>
      </div>
      <nav className="flex flex-grow flex-col gap-2">
        <Link href="/employer/dashboard" className={`${itemClass(dash)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="font-headline text-[14px] font-semibold">Dashboard</span>
        </Link>
        <Link href="/employer/applicants" className={`${itemClass(applicants)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">description</span>
          <span className="font-headline text-[14px] font-semibold">Applicants</span>
        </Link>
        <Link href="/employer/messages" className={`${itemClass(messages)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">chat</span>
          <span className="font-headline text-[14px] font-semibold">Messages</span>
        </Link>
        <Link href="/employer/post" className={`${itemClass(post)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span className="font-headline text-[14px] font-semibold">Post internship</span>
        </Link>
        <Link href="/employer/profile" className={`${itemClass(pathname.startsWith("/employer/profile"))} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">business</span>
          <span className="font-headline text-[14px] font-semibold">Company Profile</span>
        </Link>
        <Link href="/employer/matches" className={`${itemClass(pathname.startsWith("/employer/matches"))} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">group_add</span>
          <span className="font-headline text-[14px] font-semibold">Matches</span>
        </Link>

        <div className="my-2 border-t border-slate-200/70" />

        <a
          href="mailto:support@internbeacon.cm"
          className={`${itemClass(false)} transition-transform duration-200 hover:translate-x-0.5`}
        >
          <span className="material-symbols-outlined text-xl">help</span>
          <span className="font-headline text-[14px] font-semibold">Help & support</span>
        </a>
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-6">
        <button
          type="button"
          className="rounded-2xl bg-secondary-container py-3.5 text-sm font-bold text-on-secondary-container shadow-md shadow-amber-500/20 transition-all hover:opacity-90"
        >
          Upgrade plan
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
          <img
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSXzih-GlseitvpY_Iw7TwXeg5kkUinDiEUjpJ1cAcRajAapoA5f3pzBn1TPE_yytOAMq7x17bS-tAekrhCP3m_lzZimAu95gN1sCR547fnTrrn3zjOiuCtxWlihMRDDNmB1AHXsuR9jdYb5Fy_V0heOseqJIgWDbz5vERHlI1xQlHi9nrCTsW_aCGJCzEfkbfUhIFqmDD2sWqk4g4CjbOgh7Ulw0N1mx9mVzs9-Pmo1ptc2mYdQzvpMNIn6Lcduwex80yW6ZACFc"
            alt="Employer"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">{user?.name || "Employer Account"}</span>
            <span className="text-[10px] font-medium text-slate-500">Company</span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto text-slate-400 transition-colors hover:text-red-500"
            aria-label="Log out"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
