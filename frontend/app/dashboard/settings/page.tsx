"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/authClient";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

const tabs = ["Profile", "Notifications", "Visibility", "Security"] as const;

export default function SettingsPage() {
  const user = useAuthUser();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");
  const [name, setName] = useState(user?.name || "Student");
  const [headline, setHeadline] = useState("Software engineering student");
  const [location, setLocation] = useState("San Francisco, CA");

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage the practical details around your student experience: visibility, alerts, account access, and the public information tied to your profile."
        actions={
          <Link
            href="/dashboard/profile"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Back to profile
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <StudentPanel className="h-fit">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-[18px] px-4 py-3 text-left text-sm font-bold transition-colors ${
                  activeTab === tab
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </StudentPanel>

        <div className="space-y-6">
          {activeTab === "Profile" ? (
            <StudentPanel>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Profile preferences
              </h2>
              <div className="mt-6 grid gap-5">
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Display name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Headline
                  </span>
                  <input
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Location
                  </span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>
            </StudentPanel>
          ) : null}

          {activeTab === "Notifications" ? (
            <StudentPanel>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Notifications</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Job alerts for new matching roles",
                  "Weekly digests with top opportunities",
                  "Immediate messages from employers",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-[20px] bg-slate-50 px-4 py-4">
                    <p className="text-sm font-bold text-slate-950">{item}</p>
                    <div className="h-7 w-12 rounded-full bg-slate-950 p-1">
                      <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </StudentPanel>
          ) : null}

          {activeTab === "Visibility" ? (
            <StudentPanel>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Visibility</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-[20px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">Profile viewing mode</p>
                  <p className="mt-1 text-sm text-slate-500">Currently visible to recruiters and partner employers.</p>
                </div>
                <div className="rounded-[20px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">Connection visibility</p>
                  <p className="mt-1 text-sm text-slate-500">Only approved platform connections can see your network.</p>
                </div>
              </div>
            </StudentPanel>
          ) : null}

          {activeTab === "Security" ? (
            <StudentPanel>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Security</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-[20px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">Email and password</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage sign-in credentials and review active sessions.
                  </p>
                </div>
                <div className="rounded-[20px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-bold text-slate-950">Two-step verification</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Add another layer of protection to your account.
                  </p>
                </div>
              </div>
            </StudentPanel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
