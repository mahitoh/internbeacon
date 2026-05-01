import Link from "next/link";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";
import { studentNotificationFeed } from "@/lib/student-portal";

export default function Page() {
  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Inbox"
        title="Activity and recruiter updates"
        description="Everything that needs your attention lives here: application movement, new opportunities, profile gains, and time-sensitive reminders."
        actions={
          <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
            Mark all as read
          </button>
        }
      />

      <div className="space-y-5">
        {studentNotificationFeed.map((item) => (
          <StudentPanel key={item.title}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    New
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.time}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
              </div>
              <Link
                href={item.ctaHref}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
              >
                {item.ctaLabel}
              </Link>
            </div>
          </StudentPanel>
        ))}

        <StudentPanel className="bg-slate-950 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Stay organized
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Use notifications with your applications page, not instead of it.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Notifications tell you what changed. Applications tells you what stage each role is in
            and what action to take next.
          </p>
        </StudentPanel>
      </div>
    </div>
  );
}
