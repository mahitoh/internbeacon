"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import EmployerSidebar from "@/components/EmployerSidebar";
import Logo from "@/components/Logo";

const MOBILE_LINKS = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: "/employer/applicants", label: "Applicants" },
  { href: "/employer/messages", label: "Messages" },
  { href: "/employer/post", label: "Post role" },
  { href: "/browse", label: "Browse" },
] as const;

function mobilePill(active: boolean) {
  const base =
    "shrink-0 rounded-xl px-3 py-2 text-[12px] font-semibold tracking-tight transition-all duration-200 font-headline sm:px-3.5 sm:text-[13px]";
  return active
    ? `${base} bg-[#0f172a] text-white shadow-md shadow-slate-900/25`
    : `${base} bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/90 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]`;
}

/**
 * Shared chrome for all /employer/* routes. No global footer so full-height tools (messages, applicants) stay usable.
 */
export function EmployerAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb] font-body text-on-surface antialiased selection:bg-secondary-container/30">
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md md:hidden">
        <div className="flex min-h-[3.75rem] flex-col gap-2 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <Logo className="h-8 w-auto max-w-[160px] shrink-0" />
            <Link
              href="/"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm font-headline"
            >
              Exit
            </Link>
          </div>
          <nav
            className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Employer navigation"
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
        </div>
      </header>
      <EmployerSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:ml-72">
        <main className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-6 py-6 min-w-0 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
