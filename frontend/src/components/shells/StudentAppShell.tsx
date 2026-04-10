"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Logo from "@/components/Logo";
import { AppShellFooter } from "@/components/shells/AppShellFooter";

const MOBILE_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/feed", label: "Feed" },
  { href: "/dashboard/applications", label: "Apps" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/browse", label: "Browse" },
] as const;

/**
 * Shared chrome for all /dashboard/* routes: same sidebar width (w-72), canvas bg, padding, footer.
 */
export function StudentAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-body text-on-surface antialiased selection:bg-secondary-container/30">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex h-14 items-center gap-3 px-3">
          <Logo className="h-7 w-auto max-w-[140px] shrink-0" />
          <nav
            className="flex flex-1 items-center gap-3 overflow-x-auto py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600"
            aria-label="Student navigation"
          >
            {MOBILE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-slate-800 active:bg-secondary-container/30"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <Sidebar />
      <div className="flex min-h-screen w-full flex-1 flex-col md:ml-72">
        <div className="flex min-h-screen flex-1 flex-col min-w-0">
          <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8 lg:px-10 lg:py-10 min-w-0">
            {children}
          </div>
          <AppShellFooter area="student" />
        </div>
      </div>
    </div>
  );
}
