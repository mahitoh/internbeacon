import Link from "next/link";

type Area = "student" | "employer";

export function AppShellFooter({ area }: { area: Area }) {
  return (
    <footer className="mt-auto border-t border-outline-variant/20 bg-surface-container-low/60">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} InternBeacon
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-on-surface-variant">
          <Link href="/" className="hover:text-on-primary-fixed transition-colors">
            Home
          </Link>
          <Link href="/browse" className="hover:text-on-primary-fixed transition-colors">
            Browse
          </Link>
          <Link href="/dev/pages" className="hover:text-on-primary-fixed transition-colors">
            All pages
          </Link>
          {area === "student" ? (
            <>
              <Link href="/dashboard/profile" className="hover:text-on-primary-fixed transition-colors">
                Profile
              </Link>
              <Link href="/dashboard/applications" className="hover:text-on-primary-fixed transition-colors">
                Applications
              </Link>
            </>
          ) : (
            <>
              <Link href="/employer/dashboard" className="hover:text-on-primary-fixed transition-colors">
                Dashboard
              </Link>
              <Link href="/employer/post" className="hover:text-on-primary-fixed transition-colors">
                Post role
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
