import Link from "next/link";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";
import { studentFaqs } from "@/lib/student-portal";

export default function HelpPage() {
  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Support"
        title="Help center"
        description="Get unstuck fast with platform guidance, profile advice, and the fastest paths to support when something blocks your search."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentPanel className="bg-slate-950 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Contact
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">Talk to support</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Reach the team for account issues, interview problems, or application delivery bugs.
          </p>
          <a
            href="mailto:support@internbeacon.local"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950"
          >
            Email support
          </a>
        </StudentPanel>

        <StudentPanel>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            Guides
          </p>
          <div className="mt-5 space-y-4">
            {[
              { href: "/dashboard/profile", title: "Strengthen your profile" },
              { href: "/dashboard/resume", title: "Tune your resume for a role" },
              { href: "/dashboard/applications", title: "Track interviews and decisions" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-4"
              >
                <span className="text-sm font-bold text-slate-950">{item.title}</span>
                <span className="material-symbols-outlined text-[18px] text-slate-500">arrow_forward</span>
              </Link>
            ))}
          </div>
        </StudentPanel>
      </div>

      <StudentPanel className="mt-6">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
          FAQ
        </p>
        <div className="mt-5 space-y-5">
          {studentFaqs.map((faq) => (
            <div key={faq.q} className="rounded-[22px] bg-slate-50 px-5 py-5">
              <h2 className="text-sm font-bold text-slate-950">{faq.q}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </StudentPanel>
    </div>
  );
}
