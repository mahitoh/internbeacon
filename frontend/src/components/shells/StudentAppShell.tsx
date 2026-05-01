"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Logo from "@/components/Logo";
import Sidebar from "@/components/Sidebar";
import { AppShellFooter } from "@/components/shells/AppShellFooter";
import { clearAuth, getAuthToken, roleHomePath } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

const MOBILE_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/applications", label: "Apps" },
  { href: "/dashboard/recommendations", label: "Matches" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

function mobilePill(active: boolean) {
  const base =
    "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-all";
  return active
    ? `${base} bg-slate-950 text-white shadow-sm`
    : `${base} bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50`;
}

export function StudentAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  useEffect(() => {
    const token = getAuthToken();
    if (!user || !token) {
      router.replace("/login");
      return;
    }
    if (user.role !== "STUDENT") {
      router.replace(roleHomePath(user.role));
    }
  }, [router, user]);

  return (
    <div className="flex min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_25%),linear-gradient(180deg,#fcfcfd_0%,#f6f7fb_56%,#eef2f7_100%)] font-body text-on-surface antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur md:hidden">
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Logo className="h-8 w-auto max-w-[170px]" />
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/profile"
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
              >
                {user?.name?.charAt(0).toUpperCase() || "M"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAuth();
                  window.location.href = "/login";
                }}
                className="rounded-full border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"
              >
                Logout
              </button>
            </div>
          </div>
          <nav
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Student navigation"
          >
            {MOBILE_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className={mobilePill(active)}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <Sidebar />

      <div className="flex min-h-screen w-full flex-1 flex-col md:ml-72">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-1 flex-col">
          <main className="flex-1 px-5 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
          <AppShellFooter area="student" />
        </div>
      </div>
    </div>
  );
}
