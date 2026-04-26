"use client";

import React, { useState } from "react";
import Link from "next/link";

const TABS = ["For You", "Trending", "New This Week", "Saved"] as const;

// Rich feed items with images and more detailed content for social-style feed
type FeedItem = {
  id: string;
  type: "opportunity" | "update" | "announcement" | "deadline";
  company: string;
  initials: string;
  color: string;
  logoUrl?: string;
  role: string;
  location: string;
  stipend: string;
  duration: string;
  match: number;
  tags: string[];
  deadline: string;
  urgency: "critical" | "high" | "medium" | "low";
  postedAt: string;
  description?: string;
  imageUrl?: string;
};

const FEED_ITEMS: FeedItem[] = [
  {
    id: "1",
    type: "opportunity",
    company: "Google",
    initials: "G",
    color: "bg-blue-600",
    role: "Product Management Intern, Summer 2024",
    location: "Mountain View, CA / Remote",
    stipend: "$7,500/mo",
    duration: "12 Weeks",
    match: 98,
    tags: ["Product", "Strategy", "Data"],
    deadline: "2 days left",
    urgency: "high",
    postedAt: "2 hours ago",
    description: "Join the Google Maps team to build the future of immersive navigation. Looking for students with a passion for UX and data-driven decisions.",
  },
  {
    id: "2",
    type: "update",
    company: "Stripe",
    initials: "ST",
    color: "bg-indigo-600",
    role: "Software Engineering Intern",
    location: "San Francisco, CA",
    stipend: "$8,000/mo",
    duration: "16 Weeks",
    match: 94,
    tags: ["Backend", "APIs", "Payments"],
    deadline: "Just now",
    urgency: "medium",
    postedAt: "Just now",
    description: "Your application has moved to the Technical Interview stage.",
  },
  {
    id: "3",
    type: "announcement",
    company: "Orange",
    initials: "OR",
    color: "bg-orange-500",
    role: "Paris Innovation Lab Expansion",
    location: "Paris, France",
    stipend: "Competitive",
    duration: "6 Months",
    match: 89,
    tags: ["AI", "Cybersecurity", "Innovation"],
    deadline: "Yesterday",
    urgency: "medium",
    postedAt: "Yesterday",
    description: "Orange is opening 50 new internship positions in AI and Cybersecurity for the upcoming Autumn cycle. Vetted candidates get early access.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    type: "deadline",
    company: "Meta",
    initials: "M",
    color: "bg-blue-700",
    role: "University Grad SWE Role",
    location: "Menlo Park, CA",
    stipend: "$9,200/mo",
    duration: "12 Weeks",
    match: 92,
    tags: ["Full Stack", "AI/ML", "Systems"],
    deadline: "24h left",
    urgency: "critical",
    postedAt: "Featured",
    description: "Final reminder: Complete your application before the deadline tonight at midnight PST.",
  },
];

const COMPANIES = [
  { name: "Orange Cameroon", sector: "Telecoms",       roles: 12, color: "bg-orange-500", initials: "OC" },
  { name: "MTN Cameroon",    sector: "Telecoms",       roles: 8,  color: "bg-yellow-500", initials: "MT" },
  { name: "ENEO",            sector: "Energy",         roles: 6,  color: "bg-blue-600",   initials: "EN" },
  { name: "UBA Bank",        sector: "Finance",        roles: 5,  color: "bg-red-600",    initials: "UB" },
  { name: "CFAO Motors",     sector: "Automotive",     roles: 4,  color: "bg-slate-700",  initials: "CF" },
  { name: "Afriland Bank",   sector: "Finance",        roles: 3,  color: "bg-green-700",  initials: "AF" },
  { name: "Bocom",           sector: "Technology",     roles: 7,  color: "bg-indigo-600", initials: "BC" },
];

const SUGGESTED_CONNECTIONS = [
  { name: "Sarah Chen", role: "PM @ Google", avatar: "SC" },
  { name: "Alex Rivera", role: "Engineer @ Stripe", avatar: "AR" },
  { name: "Jordan Park", role: "Designer @ Figma", avatar: "JP" },
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

  const renderFeedItem = (item: FeedItem) => {
    // Render deadline reminder card
    if (item.type === "deadline") {
      return (
        <article key={item.id} className="bg-red-50 rounded-2xl p-6 flex items-center justify-between border border-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <span className="material-symbols-outlined">alarm</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-slate-900 text-lg">Deadline Approaching</h4>
              <p className="text-slate-600 text-sm">{item.company}: {item.role} closes in {item.deadline}.</p>
            </div>
          </div>
          <Link
            href={`/internships/${item.id}`}
            className="bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all shrink-0"
          >
            Complete App
          </Link>
        </article>
      );
    }

    // Render status update card
    if (item.type === "update") {
      return (
        <article key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 border-l-4 border-l-amber-500">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {item.initials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-headline font-bold text-slate-900">Application Update</h3>
                <span className="text-slate-400 text-[10px]">{item.postedAt}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your application for <span className="font-bold text-slate-900">{item.role}</span> at {item.company} has moved to the <span className="text-amber-600 font-bold">Technical Interview</span> stage.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Link href={`/dashboard/applications`} className="text-amber-600 text-xs font-bold underline decoration-2 underline-offset-4">
                  Schedule Interview
                </Link>
                <Link href={`/internships/${item.id}`} className="text-slate-400 text-xs font-bold hover:text-slate-600">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </article>
      );
    }

    // Render announcement with image
    if (item.type === "announcement" && item.imageUrl) {
      return (
        <article key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={item.imageUrl} 
              alt={item.company} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-slate-700">
              Announcement
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white font-bold text-sm`}>
                {item.initials}
              </div>
              <div>
                <h3 className="font-headline font-bold text-slate-900">{item.company}</h3>
                <p className="text-slate-400 text-xs">{item.postedAt}</p>
              </div>
            </div>
            <h4 className="font-headline text-lg font-bold text-slate-900 mb-2">{item.role}</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.description}</p>
            <button className="text-slate-900 font-bold text-sm flex items-center gap-1 group/btn">
              Read more <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </article>
      );
    }

    // Default opportunity card
    return (
      <article key={item.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:shadow-slate-200/60 transition-all">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
            {item.initials}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                  {item.role}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.company} · {item.location}
                </p>
              </div>
              <span className={`shrink-0 text-[11px] font-black px-2.5 py-1 rounded-lg border ${matchColor(item.match)}`}>
                {item.match}% match
              </span>
            </div>

            {item.description && (
              <p className="text-slate-600 text-sm mt-3 mb-4 leading-relaxed">{item.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
              {item.tags.map((t) => (
                <span key={t} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-[11px] font-semibold rounded-lg border border-slate-100">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-50">
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
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition-all flex items-center gap-1"
                >
                  Apply <span className="material-symbols-outlined text-sm">bolt</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="w-full max-w-[1400px] flex flex-col h-full">
      {/* Editorial Header */}
      <div className="mb-8 flex-shrink-0">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#006591] mb-2 block">
          The Curator&apos;s Feed
        </span>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-[#1A1B21] font-headline">
          Discovery <span className="text-[#00236F]">Feed.</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2 max-w-md">
          AI-curated opportunities from Cameroon&apos;s leading companies and global tech giants.
        </p>
      </div>

      {/* Editorial Tabs */}
      <div className="flex gap-2 mb-8 flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-2.5 text-sm font-semibold transition-all rounded-full ${
              activeTab === tab
                ? "bg-[#00236F] text-white shadow-lg shadow-[#00236F]/20"
                : "bg-white text-slate-500 hover:text-[#00236F] hover:bg-[#F4F3FA]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* LEFT: Feed */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-1 space-y-4 pb-4">
          {FEED_ITEMS.map((item) => renderFeedItem(item))}

          {/* Load more */}
          <button className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">
            Load more opportunities
          </button>
        </div>

        {/* ── RIGHT: Companies — sticky, own scroll ────────────────────────── */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-0 max-h-[calc(100vh-12rem)] overflow-y-auto">

          {/* Companies hiring */}
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F3FA]">
              <h4 className="font-bold text-sm text-[#1A1B21]">Hiring in Cameroon</h4>
              <Link href="/dashboard/browse" className="text-[11px] font-bold text-[#006591] hover:text-[#00236F]">
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#F4F3FA]">
              {COMPANIES.map((co) => (
                <div key={co.name} className="flex items-center gap-3 px-6 py-4 hover:bg-[#F4F3FA]/50 transition-colors group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl ${co.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                    {co.initials}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-[#1A1B21] truncate group-hover:text-[#00236F] transition-colors">
                      {co.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {co.sector} · {co.roles} open {co.roles === 1 ? "role" : "roles"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#006591] transition-colors text-[16px]">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[#F4F3FA]">
              <Link
                href="/dashboard/browse"
                className="block text-center text-xs font-bold text-slate-600 hover:text-[#00236F] py-2.5 bg-[#F4F3FA] hover:bg-[#00236F]/5 rounded-xl transition-colors"
              >
                Browse all companies
              </Link>
            </div>
          </div>

          {/* AI match card */}
          <div className="bg-gradient-to-br from-[#1A1B21] to-[#00236F] rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#006591]/30 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#006591] text-[20px]">auto_awesome</span>
              </div>
              <h4 className="font-bold text-white text-base mb-2 font-headline">AI Curator Active</h4>
              <p className="text-white/60 text-xs leading-relaxed mb-5">
                Your profile matches 47 opportunities in Cameroon. Complete your skills assessment to unlock Tier 1 roles.
              </p>
              <Link
                href="/dashboard/profile"
                className="block text-center bg-[#006591] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#006591]/80 transition-all"
              >
                Complete Assessment
              </Link>
            </div>
          </div>

          {/* People to Follow */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm">
            <h4 className="font-headline font-bold text-sm text-[#1A1B21] mb-4">People to Follow</h4>
            <div className="space-y-4">
              {SUGGESTED_CONNECTIONS.map((person) => (
                <div key={person.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F4F3FA] rounded-xl flex items-center justify-center text-xs font-bold text-[#00236F]">
                      {person.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1B21]">{person.name}</h4>
                      <p className="text-[10px] text-slate-400">{person.role}</p>
                    </div>
                  </div>
                  <button className="text-[#006591] font-bold text-[10px] uppercase tracking-widest hover:text-[#00236F] transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Offer Card */}
          <div className="bg-[#F4F3FA] rounded-[2rem] p-6 relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-[#00236F] text-white text-[10px] font-black px-2 py-0.5 rounded mb-3">PREMIUM</span>
              <h4 className="font-headline font-bold text-[#1A1B21] leading-tight mb-2">Career Coaching</h4>
              <p className="text-slate-500 text-xs mb-4">Book 1:1 sessions with industry experts from top Cameroon companies.</p>
              <button className="w-full bg-[#00236F] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#00236F]/80 transition-all">
                Explore Coaches
              </button>
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#006591]/20 rounded-full blur-2xl"></div>
          </div>

          {/* Footer Links */}
          <div className="px-2 flex flex-wrap gap-x-4 gap-y-2 opacity-50">
            <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#00236F]">Privacy</Link>
            <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#00236F]">Terms</Link>
            <Link href="#" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-[#00236F]">Help</Link>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 Beacon</span>
          </div>

        </aside>
      </div>
    </div>
  );
}
