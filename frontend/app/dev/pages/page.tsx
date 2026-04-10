import Link from "next/link";

const ROUTES: { path: string; label: string }[] = [
  { path: "/dev/pages", label: "This page — all routes" },
  { path: "/", label: "Home (marketing)" },
  { path: "/browse", label: "Browse internships" },
  { path: "/discover", label: "Discover" },
  { path: "/listings", label: "Listings / opportunity index" },
  { path: "/login", label: "Login" },
  { path: "/signup", label: "Sign up" },
  { path: "/dashboard", label: "Student dashboard" },
  { path: "/dashboard/feed", label: "Student feed" },
  { path: "/dashboard/applications", label: "Application tracker" },
  { path: "/dashboard/profile", label: "Student profile" },
  { path: "/employer/dashboard", label: "Employer command center" },
  { path: "/employer/applicants", label: "Manage applicants" },
  { path: "/employer/messages", label: "Employer messages" },
  { path: "/employer/post", label: "Post new offer" },
  { path: "/internships/1", label: "Internship detail (example id)" },
  { path: "/offers/1", label: "Offer detail (example id)" },
  { path: "/company/1", label: "Company profile (dynamic [id])" },
];

export default function DevPagesIndex() {
  return (
    <div className="min-h-screen bg-surface px-6 py-16 font-body text-on-surface">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
          Developer
        </p>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-primary-fixed mb-2">
          All routes
        </h1>
        <p className="text-on-surface-variant text-sm mb-10 leading-relaxed">
          Bookmark this page while building. Student console lives under{" "}
          <code className="rounded bg-surface-container-low px-1.5 py-0.5 text-xs">
            /dashboard/*
          </code>
          ; employer tools under{" "}
          <code className="rounded bg-surface-container-low px-1.5 py-0.5 text-xs">
            /employer/*
          </code>
          .
        </p>
        <ul className="divide-y divide-outline-variant/20 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          {ROUTES.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                className="flex flex-col gap-0.5 px-5 py-4 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-semibold text-on-primary-fixed">{label}</span>
                <span className="font-mono text-xs text-outline">{path}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-outline">
          <Link href="/" className="font-semibold text-secondary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
