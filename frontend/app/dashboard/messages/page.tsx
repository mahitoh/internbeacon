"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";
import { studentMessages } from "@/lib/student-portal";

export default function StudentMessagesPage() {
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company");
  const roleParam = searchParams.get("role");

  const initialThreadId = useMemo(() => {
    if (!companyParam) return studentMessages[0].id;
    const match = studentMessages.find(
      (item) => item.company.toLowerCase() === companyParam.toLowerCase()
    );
    return match?.id || studentMessages[0].id;
  }, [companyParam]);

  const [activeId, setActiveId] = useState(initialThreadId);
  const activeThread =
    studentMessages.find((item) => item.id === activeId) || studentMessages[0];

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Messages"
        title="Employer conversations"
        description="Use this space to reply to recruiters, ask questions about a role, and keep interview coordination in one clear thread."
        actions={
          <>
            <Link
              href="/dashboard/applications"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Open applications
            </Link>
            <Link
              href="/dashboard/browse"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Browse roles
            </Link>
          </>
        }
      />

      {(companyParam || roleParam) ? (
        <div className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          Starting a conversation about {roleParam || "this role"}
          {companyParam ? ` with ${companyParam}` : ""}.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <StudentPanel className="p-4">
          <div className="space-y-3">
            {studentMessages.map((thread) => {
              const active = thread.id === activeId;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={`w-full rounded-[22px] px-4 py-4 text-left transition-colors ${
                    active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-black ${active ? "text-white" : "text-slate-950"}`}>
                        {thread.company}
                      </p>
                      <p className={`mt-1 text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>
                        {thread.contact}
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${active ? "text-slate-300" : "text-slate-400"}`}>
                      {thread.time}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm font-semibold ${active ? "text-slate-200" : "text-slate-600"}`}>
                    {thread.role}
                  </p>
                  <p className={`mt-2 line-clamp-2 text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>
                    {thread.preview}
                  </p>
                </button>
              );
            })}
          </div>
        </StudentPanel>

        <StudentPanel className="flex flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Active thread
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {activeThread.company}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {activeThread.contact} • {activeThread.role}
              </p>
            </div>
            <Link
              href="/dashboard/help"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              Messaging tips
            </Link>
          </div>

          <div className="flex-1 space-y-4 py-6">
            <div className="max-w-[80%] rounded-[22px] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
              Hi there, thanks for your interest in the {activeThread.role} role.
              We were impressed by your recent projects and wanted to open a conversation.
            </div>
            <div className="ml-auto max-w-[80%] rounded-[22px] bg-slate-950 px-4 py-4 text-sm leading-7 text-white">
              Thanks for reaching out. I&apos;d love to learn more about the team, timeline,
              and what you&apos;re prioritizing in this internship.
            </div>
            <div className="max-w-[80%] rounded-[22px] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
              Great. Please feel free to ask any questions here, or we can move to interview scheduling
              once you&apos;re ready.
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <textarea
              rows={5}
              placeholder={`Reply to ${activeThread.company} about ${activeThread.role}...`}
              className="w-full resize-none bg-transparent text-sm leading-7 text-slate-900 outline-none"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                >
                  Attach resume
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                >
                  Insert availability
                </button>
              </div>
              <button
                type="button"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white"
              >
                Send message
              </button>
            </div>
          </div>
        </StudentPanel>
      </div>
    </div>
  );
}
