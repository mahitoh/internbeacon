"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";
import { studentNavGroups } from "@/lib/student-portal";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const displayName = user?.name || "Student";
  const initials = getInitials(displayName);

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,#fff_0%,#f8fafc_58%,#f3f4f6_100%)] px-6 py-7 md:flex">
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-sm">
        <p className="text-xl font-black tracking-tight text-slate-950">InternBeacon</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          Student workspace
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">Career momentum dashboard</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
        {studentNavGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                      active
                        ? "bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.7)]"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3">
        <Link
          href="/dashboard/browse"
          className="flex items-center justify-between rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-[0_20px_45px_-25px_rgba(245,158,11,0.8)] transition-transform hover:-translate-y-0.5"
        >
          Discover new roles
          <span className="material-symbols-outlined text-[18px]">north_east</span>
        </Link>
        <button
          onClick={() => {
            clearAuth();
            router.push("/login");
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Log out
        </button>
      </div>
    </aside>
  );
}
