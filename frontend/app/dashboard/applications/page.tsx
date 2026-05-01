"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getStudentApplications,
  getUserFriendlyError,
  type ApplicationModel,
} from "@/lib/api";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";
import { getApplicationStageWidth, getApplicationTone } from "@/lib/student-portal";

type FilterKey = "ALL" | "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";

export default function ApplicationTracking() {
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentApplications();
        if (!mounted) return;
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load applications"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesFilter = activeFilter === "ALL" || app.status === activeFilter;
      const matchesQuery = `${app.offer.title} ${app.offer.company?.user?.name || ""} ${app.offer.location || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, applications, query]);

  const counts = useMemo(
    () => ({
      all: applications.length,
      shortlisted: applications.filter((app) => app.status === "SHORTLISTED").length,
      accepted: applications.filter((app) => app.status === "ACCEPTED").length,
      pending: applications.filter((app) => app.status === "PENDING").length,
    }),
    [applications]
  );

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Pipeline"
        title="Application tracker"
        description="Keep every opportunity in one place, watch each stage move forward, and jump directly into the pages that help you improve conversion."
        actions={
          <>
            <Link
              href="/dashboard/recommendations"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Review matches
            </Link>
            <Link
              href="/dashboard/resume"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Improve resume
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <StudentPanel>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "All", value: counts.all },
              { label: "In review", value: counts.pending },
              { label: "Interviews", value: counts.shortlisted },
              { label: "Offers", value: counts.accepted },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] bg-slate-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </StudentPanel>

        <StudentPanel className="bg-slate-950 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Conversion tip
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Tailored materials matter most before shortlist review.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Your strongest lever right now is aligning resume language and project bullets to the
            exact responsibilities in the role you want next.
          </p>
        </StudentPanel>
      </div>

      <StudentPanel className="mt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["ALL", "PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED"] as FilterKey[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter === "ALL" ? "All stages" : filter.toLowerCase()}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles or companies"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 lg:w-80"
          />
        </div>
      </StudentPanel>

      {loading ? (
        <p className="mt-6 text-sm font-medium text-slate-500">Loading your application pipeline...</p>
      ) : null}
      {error ? (
        <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {filtered.length > 0 ? (
          filtered.map((app) => {
            const tone = getApplicationTone(app.status);
            return (
              <StudentPanel key={app.id}>
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                      {(app.offer.company?.user?.name || "C").charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/internships/${app.offer.id}`}
                          className="text-xl font-black tracking-tight text-slate-950 hover:text-amber-600"
                        >
                          {app.offer.title}
                        </Link>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tone.badge}`}>
                          {tone.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        {app.offer.company?.user?.name || "Company"} • {app.offer.location || "Remote"}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        Applied on {new Date(app.createdAt).toLocaleDateString()} and last updated on{" "}
                        {new Date(app.createdAt).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>

                  <div className="w-full xl:max-w-md">
                    <div className="mb-3 flex justify-between text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      <span>Submitted</span>
                      <span>Review</span>
                      <span>Interview</span>
                      <span>Decision</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-slate-950"
                        style={{ width: getApplicationStageWidth(app.status) }}
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/internships/${app.offer.id}`}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                      >
                        View role
                      </Link>
                      <Link
                        href="/dashboard/resume"
                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                      >
                        Update resume
                      </Link>
                    </div>
                  </div>
                </div>
              </StudentPanel>
            );
          })
        ) : (
          <StudentPanel className="text-center">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              No applications match this view yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Adjust the filters, or browse fresh roles to build your pipeline.
            </p>
            <Link
              href="/dashboard/browse"
              className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Browse roles
            </Link>
          </StudentPanel>
        )}
      </div>
    </div>
  );
}
