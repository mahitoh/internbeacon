import Link from "next/link";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

export default function Page() {
  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Resume Lab"
        title="Tailor your resume before you apply"
        description="Use this workspace to align your experience with the role you want, tighten language, and make sure your strongest evidence shows up quickly."
        actions={
          <>
            <Link
              href="/dashboard/applications"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Back to applications
            </Link>
            <Link
              href="/dashboard/recommendations"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Use with matches
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <StudentPanel>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Inputs
          </p>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-950">Target job description</span>
              <textarea
                rows={8}
                className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none"
                placeholder="Paste the internship description here..."
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-950">Current resume copy</span>
              <textarea
                rows={12}
                className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none"
                placeholder="Paste your resume content here..."
              />
            </label>
            <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Generate tailored version
            </button>
          </div>
        </StudentPanel>

        <StudentPanel className="bg-slate-950 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Output
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Recommended edits
              </h2>
            </div>
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950">
              ATS 94/100
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-bold text-white">Sharpen the summary</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Lead with role-relevant strengths and name the product, engineering, or research
                context you want to contribute in.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-bold text-white">Quantify project outcomes</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Add metrics, scale, or user impact to your strongest projects so recruiters can
                assess signal fast.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-bold text-white">Mirror target language</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Reuse the exact terminology in the job description where it honestly matches your experience.
              </p>
            </div>
          </div>
        </StudentPanel>
      </div>
    </div>
  );
}
