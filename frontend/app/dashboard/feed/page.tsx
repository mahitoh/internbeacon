"use client";

import React, { useState } from "react";
import Link from "next/link";

const TABS = ["For You", "Trending", "New This Week", "Saved"] as const;

const FEED_ITEMS = [
  {
    id: "1",
    company: "Lumina Systems",
    initials: "LS",
    color: "bg-violet-600",
    role: "Senior Software Engineering Intern",
    location: "Remote / New York",
    stipend: "$4,500/mo",
    duration: "6 Months",
    match: 98,
    tags: ["React", "TypeScript", "Cloud"],
    deadline: "2 days left",
    urgency: "high",
  },
  {
    id: "2",
    company: "Atmosphere Design",
    initials: "AD",
    color: "bg-rose-600",
    role: "Product UI/UX Research Intern",
    location: "London, UK",
    stipend: "$2,800/mo",
    duration: "3 Months",
    match: 85,
    tags: ["Figma", "User Testing", "Prototyping"],
    deadline: "1 week left",
    urgency: "medium",
  },
  {
    id: "3",
    company: "Quantify Financial",
    initials: "QF",
    color: "bg-teal-600",
    role: "Data Analysis & Visualization Intern",
    location: "San Francisco, CA",
    stipend: "$3,200/mo",
    duration: "6 Months",
    match: 94,
    tags: ["Python", "SQL", "PowerBI"],
    deadline: "Expires today",
    urgency: "critical",
  },
  {
    id: "4",
    company: "Orange Cameroon",
    initials: "OC",
    color: "bg-amber-600",
    role: "Network Engineering Intern",
    location: "Yaoundé, Cameroon",
    stipend: "Negotiable",
    duration: "3 Months",
    match: 78,
    tags: ["Networking", "Linux", "Cisco"],
    deadline: "3 weeks left",
    urgency: "low",
  },
];

const COMPANIES = [
  { name: "Orange Cameroon", sector: "Telecoms", roles: 4, color: "bg-amber-500", initials: "OC" },
  { name: "ENEO Cameroon",   sector: "Energy",   roles: 2, color: "bg-yellow-600", initials: "EN" },
  { name: "UBA Bank",        sector: "Finance",  roles: 3, color: "bg-red-600",    initials: "UB" },
  { name: "CFAO Motors",     sector: "Auto",     roles: 2, color: "bg-blue-600",   initials: "CF" },
  { name: "MTN Cameroon",    sector: "Telecoms", roles: 5, color: "bg-yellow-500", initials: "MT" },
  { name: "Afriland Bank",   sector: "Finance",  roles: 1, color: "bg-green-700",  initials: "AF" },
  { name: "Bocom",           sector: "Tech",     roles: 3, color: "bg-indigo-600", initials: "BC" },
];

const urgencyStyle: Record<string, string> = {
  critical: "text-red-500",
  high:     "text-orange-500",
  medium:   "text-amber-500",
  low:      "text-slate-400",
};

const matchColor = (m: number) =>
  m >= 90 ? "bg-emerald-50 text-emerald-700 border-emerald-100"
  : m >= 75 ? "bg-blue-50 text-blue-700 border-blue-100"
  : "bg-slate-50 text-slate-600 border-slate-200";

export default function StudentFeed() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("For You");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    /* Outer wrapper — fills the shell's content area, no scroll on this div */
    <div className="w-full max-w-[1400px] flex flex-col h-full">

      {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
      <div className="mb-6 flex-shrink-0">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Discover
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Your Feed
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          AI-curated internships matched to your profile and recent activity.
        </p>
      </div>

      {/* ── TABS ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-slate-100 mb-6 flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── THREE COLUMN LAYOUT ───────────────────────────────────────────── */}
      {/*
        KEY: the parent is flex, children use overflow-y-auto so ONLY
        the middle column scrolls independently. Right and left columns
        are sticky within the viewport.
      */}
      <div className="flex gap-6 flex-1 min-h-0">

        {/* ── LEFT: Quick stats (hidden on smaller screens) ───────────────── */}
        <aside className="hidden xl:flex w-[220px] shrink-0 flex-col gap-4 self-start sticky top-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Your stats</p>
            <div className="space-y-4">
              {[
                { icon: "send",        label: "Applied",   value: "3" },
                { icon: "bookmark",    label: "Saved",     value: saved.size.toString() },
                { icon: "visibility",  label: "Profile views", value: "12" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <span className="material-symbols-outlined text-[16px]">{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Profile</p>
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Strength</span>
                <span className="font-black text-slate-900">65%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[65%] transition-all" />
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="block text-center text-xs font-bold text-slate-600 hover:text-slate-900 py-2 bg-slate-50 rounded-xl transition-colors"
            >
              Complete profile →
            </Link>
          </div>
        </aside>

        {/* ── MIDDLE: Feed cards — scrollable ─────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-4">
          {FEED_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/60 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {item.initials}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-amber-600 transition-colors leading-snug truncate">
                        {item.role}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.company}
                        <span className="before:content-['·'] before:mx-1.5">{item.location}</span>
                      </p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-black px-2.5 py-1 rounded-lg border ${matchColor(item.match)}`}>
                      {item.match}% match
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                    {item.tags.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-[11px] font-semibold rounded-lg border border-slate-100">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">payments</span>
                        {item.stipend}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                        {item.duration}
                      </span>
                      <span className={`flex items-center gap-1 font-bold ${urgencyStyle[item.urgency]}`}>
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {item.deadline}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSave(item.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                          saved.has(item.id)
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-700"
                        }`}
                        aria-label="Save"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {saved.has(item.id) ? "bookmark" : "bookmark_border"}
                        </span>
                      </button>
                      <Link
                        href={`/internships/${item.id}`}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all"
                      >
                        Apply now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Load more */}
          <button className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">
            Load more opportunities
          </button>
        </div>

        {/* ── RIGHT: Companies — sticky, own scroll ────────────────────────── */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-0 max-h-[calc(100vh-12rem)] overflow-y-auto">

          {/* Companies hiring */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <h4 className="font-bold text-sm text-slate-900">Top hiring now</h4>
              <Link href="/dashboard/browse" className="text-[11px] font-bold text-amber-600 hover:text-amber-700">
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-50">
              {COMPANIES.map((co) => (
                <div key={co.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className={`w-9 h-9 rounded-xl ${co.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                    {co.initials}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                      {co.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {co.sector} · {co.roles} open {co.roles === 1 ? "role" : "roles"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 transition-colors text-[16px]">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-slate-50">
              <Link
                href="/dashboard/browse"
                className="block text-center text-xs font-bold text-slate-600 hover:text-slate-900 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Browse all companies
              </Link>
            </div>
          </div>

          {/* AI match card */}
          <div className="bg-[#0F172A] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-[50px]" />
            <div className="relative z-10">
              <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-amber-400 text-[18px]">auto_awesome</span>
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5 font-headline">AI is working for you</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Your profile has been matched against 124 active roles. Update your skills to improve your matches.
              </p>
              <Link
                href="/dashboard/profile"
                className="block text-center bg-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition-all"
              >
                Update profile
              </Link>
            </div>
          </div>

          {/* Deadline alert */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-red-500 text-[18px]">alarm</span>
              <h4 className="font-bold text-sm text-red-700">Deadlines approaching</h4>
            </div>
            <div className="space-y-2.5">
              {FEED_ITEMS.filter((i) => i.urgency === "critical" || i.urgency === "high").map((i) => (
                <div key={i.id} className="flex items-center justify-between">
                  <p className="text-xs text-red-600 font-medium truncate max-w-[140px]">{i.role}</p>
                  <span className="text-[10px] font-bold text-red-500 shrink-0">{i.deadline}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
