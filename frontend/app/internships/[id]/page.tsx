"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import { getOfferById, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import type { Internship } from "@/types";

export default function InternshipDetailPage() {
  const params = useParams();
  const id = useMemo(() => params.id as string, [params.id]);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOffer = async () => {
      try {
        setLoading(true);
        setError(null);
        const offer = await getOfferById(id);
        if (!mounted) return;
        setInternship(mapOfferToInternship(offer));
      } catch (err) {
        if (!mounted) return;
        const fallback = MOCK_INTERNSHIPS.find((item) => item.id === id) || null;
        setInternship(fallback);
        setError(fallback ? null : getUserFriendlyError(err, "Could not load offer"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) loadOffer();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-40">
          <p className="text-sm font-medium text-slate-500">Loading role details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-40">
          <p className="text-lg font-bold">Internship not found.</p>
          <Link href="/dashboard/browse" className="mt-4 inline-block text-sm font-bold text-slate-900 underline">
            Return to opportunities
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const requirements = internship.requirements.length
    ? internship.requirements
    : ["Clear communication", "Relevant technical foundation", "Collaborative working style"];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.10),_transparent_18%),linear-gradient(180deg,#fbfcfe_0%,#f3f6fb_100%)] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36">
        {error ? (
          <div className="mb-6 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Live role data is unavailable, so you may be seeing fallback content.
          </div>
        ) : null}

        <Link
          href="/dashboard/browse"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to opportunities
        </Link>

        <section className="mt-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-950 text-2xl font-black text-white">
                  {internship.company.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                    {internship.company}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{internship.location}</p>
                </div>
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {internship.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 sm:text-[15px]">
                {internship.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {internship.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Snapshot
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Compensation</p>
                  <p className="mt-2 text-base font-bold text-white">{internship.stipend}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Duration</p>
                  <p className="mt-2 text-base font-bold text-white">{internship.duration}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Posted</p>
                  <p className="mt-2 text-base font-bold text-white">{internship.postedAt}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Work mode</p>
                  <p className="mt-2 text-base font-bold text-white">{internship.location}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/internships/${id}/apply`}
                  className="rounded-full bg-amber-400 px-5 py-3 text-center text-sm font-bold text-slate-950"
                >
                  Apply now
                </Link>
                <Link
                  href="/dashboard/saved"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Save for later
                </Link>
                <Link
                  href={`/dashboard/messages?company=${encodeURIComponent(internship.company)}&role=${encodeURIComponent(internship.title)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Message employer
                </Link>
                <Link
                  href="/dashboard/resume"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Tailor resume first
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              What you will do
            </p>
            <div className="mt-5 space-y-4">
              {requirements.map((item, index) => (
                <div key={item} className="rounded-[22px] bg-slate-50 px-5 py-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                    Focus {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Match advice
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                Best results come from tailoring before you submit.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Mirror the role language in your summary and highlight projects that directly
                support the skills listed here.
              </p>
            </div>

            <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)]">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Next steps
              </p>
              <div className="mt-5 space-y-3">
                <Link href="/dashboard/profile" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                  Tighten your profile headline
                </Link>
                <Link href="/dashboard/resume" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                  Tailor your resume for this role
                </Link>
                <Link href="/dashboard/applications" className="block rounded-[20px] bg-slate-50 px-4 py-4 text-sm font-bold text-slate-950">
                  Track the application after submission
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
