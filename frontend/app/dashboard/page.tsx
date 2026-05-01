"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getStudentApplications,
  getStudentProfile,
  getStudentRecommendations,
  getStudentStats,
  getUserFriendlyError,
} from "@/lib/api";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";
import { studentNotificationFeed, studentQuickLinks, studentSupportLinks } from "@/lib/student-portal";

export default function Dashboard() {
  const [name, setName] = useState("Student");
  const [profileStrength, setProfileStrength] = useState(84);
  const [stats, setStats] = useState({
    applications: 0,
    shortlisted: 0,
    pending: 0,
    saved: 8,
  });
  const [applicationCount, setApplicationCount] = useState(0);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setApiError(null);
        const [profile, studentStats, applications, recommendations] = await Promise.all([
          getStudentProfile(),
          getStudentStats(),
          getStudentApplications(),
          getStudentRecommendations(),
        ]);

        if (!mounted) return;
        setName(profile.user?.name || "Student");
        setProfileStrength(profile.profileStrength || 84);
        setStats(studentStats || { applications: 0, shortlisted: 0, pending: 0, saved: 8 });
        setApplicationCount(Array.isArray(applications) ? applications.length : 0);
        setRecommendationCount(Array.isArray(recommendations) ? recommendations.length : 0);
      } catch (error) {
        if (!mounted) return;
        setApiError(getUserFriendlyError(error, "Failed to load dashboard data"));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: "Applications sent",
        value: stats.applications || applicationCount || 0,
        helper: "Active search volume",
      },
      {
        label: "Interview stages",
        value: stats.shortlisted || 0,
        helper: "Employers currently engaging",
      },
      {
        label: "Pending reviews",
        value: stats.pending || 0,
        helper: "Awaiting recruiter action",
      },
      {
        label: "Fresh matches",
        value: recommendationCount || 0,
        helper: "Recommended for you today",
      },
    ],
    [applicationCount, recommendationCount, stats]
  );

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Student HQ"
        title={`Good to see you, ${name}`}
        description="This is your command center for applications, profile readiness, interview momentum, and the next best actions to take this week."
        actions={
          <>
            <Link
              href="/dashboard/browse"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Discover internships
            </Link>
            <Link
              href="/dashboard/profile"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Refine profile
            </Link>
          </>
        }
      />

      {apiError ? (
        <div className="mb-8 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
          Live data is partially unavailable right now. The dashboard is still showing any data we could safely recover.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StudentPanel key={metric.label} className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              {metric.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-4xl font-black tracking-tight text-slate-950">
                {metric.value}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{metric.helper}</p>
          </StudentPanel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <StudentPanel className="overflow-hidden border-slate-900/5 bg-[linear-gradient(135deg,#0f172a_0%,#1f2937_48%,#111827_100%)] p-0 text-white">
          <div className="grid gap-8 p-7 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Momentum score
              </span>
              <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight">
                Your profile is {profileStrength}% ready for top internship pipelines.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Strong momentum comes from a complete headline, measurable project outcomes,
                and tailored applications. Keep tightening your story before your next wave.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/resume"
                  className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950"
                >
                  Open resume lab
                </Link>
                <Link
                  href="/dashboard/applications"
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white"
                >
                  Review pipeline
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">Profile strength</p>
                <span className="text-sm font-black text-amber-300">{profileStrength}%</span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-amber-400"
                  style={{ width: `${Math.min(Math.max(profileStrength, 0), 100)}%` }}
                />
              </div>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Story clarity</span>
                  <span className="font-bold text-white">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skill alignment</span>
                  <span className="font-bold text-white">Growing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recruiter readiness</span>
                  <span className="font-bold text-white">Strong</span>
                </div>
              </div>
            </div>
          </div>
        </StudentPanel>

        <StudentPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Priority queue
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Best next moves
              </h2>
            </div>
            <Link href="/dashboard/notifications" className="text-sm font-bold text-slate-600">
              Inbox
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {studentQuickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </StudentPanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <StudentPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Activity stream
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                What needs your attention
              </h2>
            </div>
            <Link href="/dashboard/notifications" className="text-sm font-bold text-slate-600">
              See all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {studentNotificationFeed.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-slate-950">{item.title}</p>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                <Link
                  href={item.ctaHref}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900"
                >
                  {item.ctaLabel}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </StudentPanel>

        <div className="space-y-6">
          <StudentPanel>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Navigation map
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { href: "/dashboard/applications", label: "Applications", helper: "Track every stage" },
                { href: "/dashboard/recommendations", label: "Matches", helper: "Browse recommended roles" },
                { href: "/dashboard/analytics", label: "Analytics", helper: "See search traction" },
                { href: "/dashboard/settings", label: "Settings", helper: "Control alerts and privacy" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition-colors hover:bg-slate-50"
                >
                  <p className="text-sm font-bold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
                </Link>
              ))}
            </div>
          </StudentPanel>

          <StudentPanel className="bg-slate-950 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Support
            </p>
            <div className="mt-5 space-y-4">
              {studentSupportLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.copy}</p>
                </Link>
              ))}
            </div>
          </StudentPanel>
        </div>
      </div>
    </div>
  );
}
