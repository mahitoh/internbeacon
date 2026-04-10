"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { href: "/browse", label: "Explore" },
  { href: "/discover", label: "Discover" },
  { href: "/listings", label: "Listings" },
  { href: "/employer/dashboard", label: "Employers" },
] as const;

function pillClass(active: boolean) {
  const base =
    "whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 font-headline";
  return active
    ? `${base} bg-slate-900 text-white shadow-md shadow-slate-900/15`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]`;
}

export default function Navbar() {
  const pathname = usePathname();

  const NavPills = ({ className }: { className?: string }) => (
    <div className={className}>
      {NAV_ITEMS.map(({ href, label }) => {
        const active =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={pillClass(active)}>
            {label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-[3.75rem] max-w-screen-2xl items-center gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center">
          <Logo className="h-7 w-auto sm:h-8" />
        </div>

        {/* Desktop: centered-style cluster after logo */}
        <NavPills className="hidden min-w-0 flex-1 items-center gap-1.5 md:flex lg:gap-2" />

        {/* Mobile: scrollable pills */}
        <div className="min-w-0 flex-1 overflow-hidden md:hidden">
          <NavPills className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-full text-slate-500 hover:text-slate-900 font-headline text-sm font-medium transition-all duration-300 ease-in-out hover:opacity-80 active:scale-95"
          >
            Login
          </Link>
          <Link
            href="/employer/post"
            className="px-5 py-2.5 bg-primary-container text-white rounded-full font-headline text-sm font-semibold hover:opacity-90 transition-all duration-300 ease-in-out active:scale-95 inline-block"
          >
            <span className="hidden sm:inline">Post internship</span>
            <span className="sm:hidden">Post</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
