"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Logo from "@/components/Logo";
import { AppShellFooter } from "@/components/shells/AppShellFooter";
import { clearAuth, getAuthToken, roleHomePath } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

const MOBILE_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/feed", label: "Feed" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/browse", label: "Browse" },
] as const;

function mobilePill(active: boolean) {
  const base =
    "shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-semibold tracking-tight transition-all duration-200";
  return active
    ? `${base} bg-slate-900 text-white shadow-md shadow-slate-900/20`
    : `${base} bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/90 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]`;
}

/**
 * Shared chrome for all /dashboard/* routes: same sidebar width (w-72), canvas bg, padding, footer.
 */
export function StudentAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  useEffect(() => {
    const stored = user;
    const token = getAuthToken();
    if (!stored || !token) {
      router.replace("/login");
      return;
    }
    if (stored.role !== "STUDENT") {
      router.replace(roleHomePath(stored.role));
      return;
    }
  }, [router, user]);

  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-body text-on-surface antialiased selection:bg-secondary-container/30">
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md md:hidden">
        <div className="flex min-h-[3.75rem] flex-col gap-2 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <Logo className="h-8 w-auto max-w-[160px] shrink-0" />
            <Link
              href="/dashboard/profile"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm font-headline"
            >
              {user?.name?.charAt(0).toUpperCase() || "Me"}
            </Link>
          </div>
          <nav
            className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Student navigation"
          >
            {MOBILE_LINKS.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className={mobilePill(active)}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => {
              clearAuth();
              window.location.href = "/login";
            }}
            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 shadow-sm font-headline"
          >
            Logout
          </button>
        </div>
      </header>
      <Sidebar />
      <div className="flex min-h-screen w-full flex-1 flex-col md:ml-72">
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="mx-auto min-h-0 w-full max-w-[1600px] flex-1 px-6 py-8 min-w-0 lg:px-10 lg:py-10">
            {children}
          </div>
          <AppShellFooter area="student" />
        </div>
      </div>
    </div>
  );
}
