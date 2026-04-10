"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const nav = [
  { href: "/browse", label: "Explore" },
  { href: "/employer/dashboard", label: "Companies" },
  { href: "/discover", label: "Discover" },
] as const;

function linkClass(active: boolean) {
  return active
    ? "text-slate-900 border-b-2 border-secondary-container pb-1 font-headline text-sm font-medium tracking-tight"
    : "text-slate-500 hover:text-slate-900 transition-all duration-300 ease-in-out hover:opacity-80 font-headline text-sm font-medium tracking-tight border-b-2 border-transparent pb-1";
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto gap-6">
        <div className="flex items-center gap-8 lg:gap-12 min-w-0">
          <Logo />
          <div className="hidden md:flex gap-6 lg:gap-8 flex-wrap">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={linkClass(
                  pathname === href || pathname.startsWith(`${href}/`)
                )}
              >
                {label}
              </Link>
            ))}
          </div>
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
            Post Internship
          </Link>
        </div>
      </div>
    </nav>
  );
}
