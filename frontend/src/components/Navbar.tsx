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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthUser();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  const dashHome = roleHomePath(user?.role);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-6 px-4 sm:gap-8 sm:px-8">
        {/* Logo */}
        <div className="flex min-w-0 shrink-0 items-center">
          <Logo className="h-9 w-auto sm:h-10" />
        </div>

        {/* Nav pills — only show marketing links when NOT logged in */}
        {!user && (
          <>
            {/* Desktop */}
            <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex lg:gap-4 ml-6">
              {NAV_ITEMS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link key={href} href={href} className={pillClass(active)}>
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile scrollable pills */}
            <div className="min-w-0 flex-1 overflow-hidden md:hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {NAV_ITEMS.map(({ href, label }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link key={href} href={href} className={pillClass(active)}>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* When logged in — spacer so avatar stays right */}
        {user && <div className="flex-1" />}

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {/* Go to dashboard pill */}
              <Link
                href={dashHome}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                Dashboard
              </Link>

              {/* Avatar — initials only, no name text beside it */}
              <Link
                href={
                  user.role === "COMPANY"
                    ? "/employer/profile"
                    : user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/dashboard/profile"
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-700 transition-colors"
                aria-label={`${user.name} profile`}
                title={user.name}
              >
                {getInitials(user.name)}
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
                title="Log out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
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
