"use client";

import Link from "next/link";
import EmployerSidebar from "@/components/EmployerSidebar";
import Logo from "@/components/Logo";

const MOBILE_LINKS = [
  { href: "/employer/dashboard", label: "Dash" },
  { href: "/employer/applicants", label: "Applicants" },
  { href: "/employer/messages", label: "Inbox" },
  { href: "/employer/post", label: "Post" },
  { href: "/browse", label: "Browse" },
] as const;

/**
 * Shared chrome for all /employer/* routes. No global footer so full-height tools (messages, applicants) stay usable.
 */
export function EmployerAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] font-body text-on-surface antialiased selection:bg-secondary-container/30">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex h-14 items-center gap-3 px-3">
          <Logo className="h-7 w-auto max-w-[140px] shrink-0" />
          <nav
            className="flex flex-1 items-center gap-2 overflow-x-auto py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600"
            aria-label="Employer navigation"
          >
            {MOBILE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1.5 text-slate-800 active:bg-secondary-container/30"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <EmployerSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-72">
        <main className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-6 py-6 lg:px-10 lg:py-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
