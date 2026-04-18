"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { clearAuth, roleHomePath } from "@/lib/api";
import { useAuthUser } from "@/lib/authClient";

const NAV_ITEMS = [
  { href: "/browse", label: "Browse" },
  { href: "/discover", label: "Discover" },
  { href: "/listings", label: "Listings" },
  { href: "/employers", label: "Employers" },
] as const;

function pillClass(active: boolean) {
  const base =
    "whitespace-nowrap rounded-xl px-5 py-3 text-base font-bold tracking-tight transition-all duration-200 font-headline";
  return active
    ? `${base} bg-slate-900 text-white shadow-lg shadow-slate-900/15`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]`;
}

type NavPillsProps = {
  className?: string;
  pathname: string;
};

function NavPills({ className, pathname }: NavPillsProps) {
  return (
    <div className={className}>
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={pillClass(active)}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-6 px-4 sm:gap-8 sm:px-8">
        <div className="flex min-w-0 shrink-0 items-center">
          <Logo className="h-9 w-auto sm:h-10" />
        </div>

        {/* Desktop */}
        <NavPills pathname={pathname} className="hidden min-w-0 flex-1 items-center gap-2 md:flex lg:gap-4 ml-6" />

        {/* Mobile: scrollable pills */}
        <div className="min-w-0 flex-1 overflow-hidden md:hidden">
          <NavPills pathname={pathname} className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                href={roleHomePath(user.role)}
                className="hidden sm:inline-flex px-4 py-2.5 rounded-full text-slate-700 hover:text-slate-900 font-headline text-sm font-bold transition-all duration-300 ease-in-out hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                href={roleHomePath(user.role)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold shadow-lg"
                aria-label="Profile"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full text-slate-500 hover:text-red-600 font-headline text-sm font-bold transition-all duration-300 ease-in-out hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 rounded-full text-slate-500 hover:text-slate-900 font-headline text-base font-bold transition-all duration-300 ease-in-out hover:opacity-80 active:scale-95"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-headline text-base font-bold hover:bg-slate-800 transition-all duration-300 ease-in-out active:scale-95 inline-block shadow-lg"
              >
                <span className="hidden sm:inline">Get started</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
