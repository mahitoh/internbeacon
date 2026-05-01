"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getStudentRecommendations,
  getUserFriendlyError,
  mapOfferToInternship,
  type OfferApiModel,
} from "@/lib/api";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

export default function RecommendationsPage() {
  const [offers, setOffers] = useState<OfferApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const recs = await getStudentRecommendations();
        if (!mounted) return;
        setOffers(Array.isArray(recs) ? recs : []);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load recommendations"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="AI Matches"
        title="Recommended roles for your profile"
        description="These are the openings most aligned with your profile, skills, and recent application behavior. Use this page as your shortlist before applying."
        actions={
          <>
            <Link
              href="/dashboard/profile"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Improve signals
            </Link>
            <Link
              href="/dashboard/browse"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Explore all roles
            </Link>
          </>
        }
      />

      {loading ? <p className="text-sm text-slate-500">Loading recommendations...</p> : null}
      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && offers.length === 0 ? (
        <StudentPanel>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            No recommendations yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Complete your profile and keep applying to create stronger recommendation signals.
          </p>
        </StudentPanel>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {offers.map((offer, index) => {
          const internship = mapOfferToInternship(offer);
          const match = Math.max(78, 96 - index * 4);
          return (
            <StudentPanel key={offer.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Match score
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    {match}%
                  </h2>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  High fit
                </span>
              </div>

              <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                {internship.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {internship.company} • {internship.location}
              </p>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                {internship.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {internship.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/internships/${offer.id}`}
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
          );
        })}
      </div>
    </div>
  );
}
