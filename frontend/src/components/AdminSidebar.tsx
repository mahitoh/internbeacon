"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-3.5 rounded-2xl bg-white p-3.5 text-slate-900 shadow-md shadow-slate-200/40 ring-1 ring-slate-200/90"
    : "flex items-center gap-3.5 rounded-2xl p-3.5 text-slate-500 transition-colors hover:bg-slate-200/55";
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const dash = pathname === "/admin/dashboard";
  const users = pathname.startsWith("/admin/users");

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col gap-4 border-r border-slate-200/80 bg-slate-50 p-6 md:flex">
      <div className="mb-6">
        <Logo className="h-8 w-auto max-w-[180px]" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-500 font-headline">
          Admin console
        </p>
      </div>
      <nav className="flex flex-grow flex-col gap-2">
        <Link href="/admin/dashboard" className={`${itemClass(dash)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          <span className="font-headline text-[14px] font-semibold">Overview</span>
        </Link>
        <Link href="/admin/users" className={`${itemClass(users)} transition-transform duration-200 hover:translate-x-0.5`}>
          <span className="material-symbols-outlined text-xl">manage_accounts</span>
          <span className="font-headline text-[14px] font-semibold">User Management</span>
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
            <span className="text-xs font-bold text-slate-900">Marcus Sterling</span>
            <span className="text-[10px] font-medium text-slate-500">Sr. Talent Lead</span>
          </div>
          <button
            onClick={() => { window.location.href = "/"; }}
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
