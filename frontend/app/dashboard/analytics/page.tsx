import Link from "next/link";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

const chart = [36, 52, 48, 64, 70, 58, 82, 75, 88, 67, 92, 79];

export default function AnalyticsPage() {
  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Insights"
        title="Search and application analytics"
        description="Read how employers are discovering you, where your profile is converting well, and which pages you should improve next."
        actions={
          <>
            <Link
              href="/dashboard/profile"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Improve profile
            </Link>
            <Link
              href="/dashboard/applications"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              View pipeline
            </Link>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Profile views", value: "142", helper: "+24% month over month" },
          { label: "Search appearances", value: "85", helper: "Recruiter search visibility" },
          { label: "Apply conversion", value: "18%", helper: "From profile view to application" },
          { label: "Response rate", value: "41%", helper: "Replies from submitted roles" },
        ].map((item) => (
          <StudentPanel key={item.label} className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
          </StudentPanel>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StudentPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Trend
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Visibility over the last 12 weeks
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Momentum up
            </span>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3">
            {chart.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-[18px] bg-gradient-to-t from-slate-950 via-slate-800 to-amber-400"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  W{index + 1}
                </span>
              </div>
            ))}
          </div>
        </StudentPanel>

        <div className="space-y-6">
          <StudentPanel>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Who is viewing
            </p>
            <div className="mt-5 space-y-4">
              {[
                "Recruiter at Google",
                "Engineering manager at Stripe",
                "Anonymous employer",
                "Talent team at Airbnb",
              ].map((item) => (
                <div key={item} className="rounded-[20px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">Viewed your profile in the past 7 days.</p>
                </div>
              ))}
            </div>
          </StudentPanel>

          <StudentPanel className="bg-slate-950 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Recommendation
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Add sharper project outcomes to increase recruiter response.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Profiles with measurable impact statements are outperforming generic summaries
              across the same job families.
            </p>
          </StudentPanel>
        </div>
      </div>
    </div>
  );
}
