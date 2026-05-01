"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/authClient";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

export default function StudentFeed() {
  const user = useAuthUser();
  const displayName = user?.name || "Student";

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Network"
        title={`Your feed, ${displayName}`}
        description="Stay close to recruiters, internship providers, and opportunities moving through your ecosystem. Every card below now links somewhere useful."
        actions={
          <>
            <Link
              href="/dashboard/messages"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Open messages
            </Link>
            <Link
              href="/dashboard/browse"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Discover roles
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        <div className="space-y-6">
          <StudentPanel className="bg-slate-950 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Momentum
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Your search is active and visible this week.
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Apps sent</p>
                <p className="mt-2 text-3xl font-black text-white">12</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Response rate</p>
                <p className="mt-2 text-3xl font-black text-white">41%</p>
              </div>
            </div>
          </StudentPanel>

          <StudentPanel>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Fast actions
            </p>
            <div className="mt-5 space-y-3">
              <Link href="/dashboard/recommendations" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                Review top matches
              </Link>
              <Link href="/dashboard/resume" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                Improve resume
              </Link>
              <Link href="/dashboard/applications" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                Check your pipeline
              </Link>
            </div>
          </StudentPanel>
        </div>

        <div className="space-y-6">
          <StudentPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-950">Sarah Jenkins from Meta</p>
                <p className="mt-1 text-sm text-slate-500">University recruiter • 1 hour ago</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                Recruiter post
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Applications for the next SWE co-op cycle are open, and recruiter outreach is active
              for students with strong profile signals.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/internships/1"
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                View role
              </Link>
              <Link
                href="/dashboard/messages?company=Meta&role=Software%20Engineering%20Co-op"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Message recruiter
              </Link>
            </div>
          </StudentPanel>

          <StudentPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-950">Google Maps internship spotlight</p>
                <p className="mt-1 text-sm text-slate-500">Product role • role fit rising</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Featured
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Your profile is showing stronger alignment with product and UX-oriented internships this week.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/internships/1"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                View role
              </Link>
              <Link
                href="/internships/1/apply"
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                Apply now
              </Link>
            </div>
          </StudentPanel>

          <StudentPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-950">Stripe moved you to interview stage</p>
                <p className="mt-1 text-sm text-slate-500">Technical interview coordination</p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                Status update
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This update belongs in both your applications flow and your employer conversations.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/dashboard/applications"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Open pipeline
              </Link>
              <Link
                href="/dashboard/messages?company=Stripe&role=Software%20Engineering%20Intern"
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                Schedule via message
              </Link>
            </div>
          </StudentPanel>

          <StudentPanel className="border-rose-100 bg-rose-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-950">Deadline approaching</p>
                <p className="mt-1 text-sm text-slate-500">A saved role is closing within 24 hours</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Link
                href="/dashboard/saved"
                className="rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Open shortlist
              </Link>
              <Link
                href="/internships/2/apply"
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                Complete application
              </Link>
            </div>
          </StudentPanel>
        </div>
      </div>
    </div>
  );
}
