"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

export default function InternshipApplyPage() {
  const params = useParams();
  const id = useMemo(() => params.id as string, [params.id]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.10),_transparent_18%),linear-gradient(180deg,#fbfcfe_0%,#f3f6fb_100%)] px-5 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <StudentPageHeader
          eyebrow="Application"
          title="Apply to this internship"
          description="Review your materials, add a short message to the employer, and submit a polished application instead of a rushed one."
          actions={
            <>
              <Link
                href={`/internships/${id}`}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
              >
                Back to role
              </Link>
              <Link
                href="/dashboard/resume"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
              >
                Refine resume
              </Link>
            </>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <StudentPanel>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Submission checklist
            </p>
            <div className="mt-5 space-y-4">
              {[
                "Primary resume attached",
                "Role-specific summary reviewed",
                "Key project highlights aligned to the role",
                "Short employer note added",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-4">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-sm font-bold">Need to ask a question first?</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Message the employer before you submit if you want clarity on timing, work mode,
                or application expectations.
              </p>
              <Link
                href="/dashboard/messages"
                className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950"
              >
                Open messages
              </Link>
            </div>
          </StudentPanel>

          <StudentPanel>
            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Resume
                </label>
                <div className="mt-2 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">resume-final.pdf</p>
                  <p className="mt-1 text-sm text-slate-500">Last updated this week</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Short note to employer
                </label>
                <textarea
                  rows={7}
                  placeholder="Write a concise note about why you are a strong fit for this internship..."
                  className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Portfolio or work sample
                </label>
                <div className="mt-2 rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm font-semibold text-slate-500">
                  Upload optional work sample
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                >
                  Submit application
                </button>
                <Link
                  href="/dashboard/saved"
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
                >
                  Save and return later
                </Link>
              </div>
            </div>
          </StudentPanel>
        </div>
      </div>
    </div>
  );
}
