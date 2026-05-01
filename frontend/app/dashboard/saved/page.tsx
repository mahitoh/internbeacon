import Link from "next/link";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

const savedInternships = [
  {
    id: "1",
    company: "Google",
    initials: "G",
    role: "Product Management Intern",
    location: "Mountain View, CA",
    stipend: "$8,500/mo",
    duration: "12 Weeks",
    tags: ["Product", "Strategy", "UX"],
    savedAgo: "2 hours ago",
    deadline: "Nov 15",
    fit: "High fit",
  },
  {
    id: "2",
    company: "Stripe",
    initials: "S",
    role: "Software Engineering Intern",
    location: "Remote",
    stipend: "$9,000/mo",
    duration: "16 Weeks",
    tags: ["React", "Go", "Payments"],
    savedAgo: "1 day ago",
    deadline: "Dec 1",
    fit: "Fast-moving",
  },
  {
    id: "3",
    company: "Spotify",
    initials: "S",
    role: "Data Science Intern",
    location: "New York, NY",
    stipend: "$7,200/mo",
    duration: "10 Weeks",
    tags: ["Python", "SQL", "Machine Learning"],
    savedAgo: "3 days ago",
    deadline: "Oct 30",
    fit: "Good match",
  },
];

export default function SavedPage() {
  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Saved"
        title="Your shortlist"
        description="These are the opportunities worth coming back to. Review deadlines, compare fit, and move the strongest ones into your active application pipeline."
        actions={
          <>
            <Link
              href="/dashboard/browse"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Browse more roles
            </Link>
            <Link
              href="/dashboard/applications"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Open applications
            </Link>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudentPanel>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Saved roles", value: "12", helper: "Ready to review" },
              { label: "Closing soon", value: "3", helper: "Deadlines within 7 days" },
              { label: "Best fit", value: "5", helper: "Strong profile alignment" },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
              </div>
            ))}
          </div>
        </StudentPanel>

        <StudentPanel className="bg-slate-950 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Shortlist strategy
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Save less, act faster on the top three.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The shortlist works best when you quickly move high-fit roles into tailored
            applications instead of keeping too many maybes around.
          </p>
        </StudentPanel>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {savedInternships.map((item) => (
          <StudentPanel key={item.id} className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                {item.initials}
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                {item.fit}
              </span>
            </div>

            <h2 className="mt-6 text-xl font-black tracking-tight text-slate-950">{item.role}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {item.company} • {item.location}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Deadline
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950">{item.deadline}</p>
              </div>
              <div className="rounded-[18px] bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Compensation
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950">{item.stipend}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Saved {item.savedAgo} • {item.duration}
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href={`/internships/${item.id}`}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                View role
              </Link>
              <Link
                href="/dashboard/resume"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Tailor resume
              </Link>
            </div>
          </StudentPanel>
        ))}
      </div>
    </div>
  );
}
