"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  getStudentApplications,
  getUserFriendlyError,
  type ApplicationModel,
} from "@/lib/api";
import { MOCK_APPLICATIONS } from "@/lib/data";

// ── types ─────────────────────────────────────────────────────────────────────
type Status = "ALL" | "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";

const TABS: { key: Status; label: string }[] = [
  { key: "ALL",        label: "All"         },
  { key: "PENDING",    label: "Pending"     },
  { key: "SHORTLISTED",label: "Shortlisted" },
  { key: "ACCEPTED",   label: "Accepted"    },
  { key: "REJECTED",   label: "Rejected"    },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING:     { label: "Pending",     className: "bg-blue-50 text-blue-700 border border-blue-100" },
    SHORTLISTED: { label: "Interviewing", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    ACCEPTED:    { label: "Offer",       className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    REJECTED:    { label: "Closed",      className: "bg-slate-100 text-slate-500 border border-slate-200" },
  };
  return map[status] ?? { label: status, className: "bg-slate-100 text-slate-600 border border-slate-200" };
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const BG_COLORS = [
  "bg-indigo-600", "bg-blue-600", "bg-teal-600",
  "bg-emerald-600", "bg-orange-600", "bg-rose-600", "bg-violet-600",
];
function getBgColor(name: string) {
  return BG_COLORS[name.charCodeAt(0) % BG_COLORS.length];
}

function timelineProgress(status: string) {
  const map: Record<string, number> = {
    PENDING:     1,
    SHORTLISTED: 2,
    ACCEPTED:    3,
    REJECTED:    3,
  };
  return map[status] ?? 1;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex-1 min-w-[120px]">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

// ── timeline step ─────────────────────────────────────────────────────────────
function TimelineStep({
  step, current, label, icon, rejected,
}: {
  step: number; current: number;
  label: string; icon: string; rejected?: boolean;
}) {
  const done    = current > step;
  const active  = current === step;

  return (
    <div className="flex flex-col items-center gap-1.5 relative z-10">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          done
            ? "bg-slate-900 text-white"
            : active
            ? rejected
              ? "bg-red-500 text-white"
              : "bg-amber-500 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: done ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-widest ${
          done ? "text-slate-900" : active ? (rejected ? "text-red-600" : "text-amber-600") : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ── application card ──────────────────────────────────────────────────────────
function AppCard({ app, expanded, onToggle }: {
  app: ApplicationModel;
  expanded: boolean;
  onToggle: () => void;
}) {
  const companyName = app.offer.company?.user?.name || "Company";
  const badge       = statusBadge(app.status);
  const step        = timelineProgress(app.status);
  const isRejected  = app.status === "REJECTED";
  const isAccepted  = app.status === "ACCEPTED";
  const color       = getBgColor(companyName);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        expanded ? "border-slate-300 shadow-xl" : "border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-lg"
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Logo */}
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-${color.split('-')[1]}-500/10`}>
            {initials(companyName)}
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Link
                href={`/offers/${app.offer.id}`}
                className="font-black text-lg text-slate-900 hover:text-amber-600 transition-colors leading-tight"
              >
                {app.offer.title}
              </Link>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {companyName}
              {app.offer.location && <span className="before:content-['·'] before:mx-2 text-slate-300">{app.offer.location}</span>}
              <span className="before:content-['·'] before:mx-2 text-slate-300">{timeAgo(app.createdAt)}</span>
            </p>
          </div>

          {/* Timeline - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="relative">
              <div className="absolute top-4.5 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-0">
                <div
                  className={`h-full transition-all duration-1000 ${isRejected ? "bg-red-400" : "bg-slate-900"}`}
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between z-10">
                <TimelineStep step={1} current={step} label="Applied"   icon="send"          rejected={isRejected} />
                <TimelineStep step={2} current={step} label="Review"    icon="manage_search" rejected={isRejected} />
                <TimelineStep step={3} current={step} label="Interview" icon="event"         rejected={isRejected} />
                <TimelineStep step={4} current={step} label="Outcome"   icon={isRejected ? "cancel" : (isAccepted ? "celebration" : "flag")} rejected={isRejected} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
            <Link
              href={`/offers/${app.offer.id}`}
              className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all border border-slate-100"
            >
              Details
            </Link>
            <button
              onClick={onToggle}
              className={`w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all ${expanded ? "bg-slate-50 text-slate-900" : ""}`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Timeline - Mobile/Tablet */}
        <div className="lg:hidden mt-8 px-4">
          <div className="relative">
            <div className="absolute top-4.5 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-0">
              <div
                className={`h-full transition-all duration-1000 ${isRejected ? "bg-red-400" : "bg-slate-900"}`}
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between z-10">
              <TimelineStep step={1} current={step} label="Applied"   icon="send"          rejected={isRejected} />
              <TimelineStep step={2} current={step} label="Review"    icon="manage_search" rejected={isRejected} />
              <TimelineStep step={3} current={step} label="Interview" icon="event"         rejected={isRejected} />
              <TimelineStep step={4} current={step} label="Outcome"   icon={isRejected ? "cancel" : (isAccepted ? "celebration" : "flag")} rejected={isRejected} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Milestones</p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-0.5 bg-slate-100 relative">
                    <div className="absolute top-0 -left-[3px] w-2 h-2 rounded-full bg-slate-900"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(app.createdAt)}</p>
                  </div>
                </div>
                {app.status !== "PENDING" && (
                  <div className="flex gap-4">
                    <div className="w-0.5 bg-slate-100 relative">
                      <div className={`absolute top-0 -left-[3px] w-2 h-2 rounded-full ${isRejected ? "bg-red-500" : "bg-amber-500"}`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Latest Update</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDate(app.updatedAt || app.createdAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Current Status</p>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isAccepted ? "bg-emerald-50 text-emerald-600"
                  : isRejected ? "bg-red-50 text-red-500"
                  : app.status === "SHORTLISTED" ? "bg-amber-50 text-amber-600"
                  : "bg-blue-50 text-blue-600"
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {isAccepted ? "celebration"
                    : isRejected ? "cancel"
                    : app.status === "SHORTLISTED" ? "event_available"
                    : "query_builder"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase">
                    {isAccepted ? "Offer Extended"
                    : isRejected ? "Application Closed"
                    : app.status === "SHORTLISTED" ? "Interviewing"
                    : "Under Review"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {isAccepted ? "You've received an offer! Check your email for next steps."
                    : isRejected ? "Thank you for your interest. We wish you luck in your search."
                    : app.status === "SHORTLISTED" ? "Employer has shortlisted your profile for an interview."
                    : "The recruitment team is currently reviewing your materials."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Materials</p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    Resume.pdf
                  </span>
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
              <button className="mt-4 w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Message Employer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function ApplicationTracking() {
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<Status>("ALL");
  const [search, setSearch]             = useState("");
  const [expandedId, setExpandedId]     = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStudentApplications();
        if (mounted) {
          // If real data exists, use it. Otherwise fallback to mock data.
          if (Array.isArray(data) && data.length > 0) {
            setApplications(data);
          } else {
            // Map MOCK_APPLICATIONS to ApplicationModel if necessary
            setApplications(MOCK_APPLICATIONS as unknown as ApplicationModel[]);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(getUserFriendlyError(err, "Could not load applications."));
          // Fallback to mock data even on error for preview
          setApplications(MOCK_APPLICATIONS as unknown as ApplicationModel[]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchTab    = activeTab === "ALL" || a.status === activeTab;
      const matchSearch = !search || 
        a.offer.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.offer.company?.user?.name || "").toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [applications, activeTab, search]);

  const stats = useMemo(() => ({
    total:       applications.length,
    pending:     applications.filter((a) => a.status === "PENDING").length,
    interview:   applications.filter((a) => a.status === "SHORTLISTED").length,
    accepted:    applications.filter((a) => a.status === "ACCEPTED").length,
  }), [applications]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Hero Stats */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-3 block">Application Tracker</span>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase font-headline leading-none">
              Your Career <br /><span className="text-amber-500">Pipeline.</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <StatPill label="Applied"   value={stats.total}     color="text-slate-900" />
            <StatPill label="Pending"   value={stats.pending}   color="text-blue-600" />
            <StatPill label="Interview" value={stats.interview} color="text-amber-500" />
            <StatPill label="Offers"    value={stats.accepted}  color="text-emerald-500" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-2">
          <div className="flex-grow flex items-center px-6 gap-3">
            <span className="material-symbols-outlined text-slate-300">search</span>
            <input
              type="text"
              placeholder="FILTER BY ROLE, COMPANY OR STATUS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-4 border-none focus:ring-0 text-xs font-black uppercase tracking-widest placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-50 rounded-[1.5rem] overflow-x-auto no-scrollbar">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              expanded={expandedId === app.id}
              onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
            />
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <span className="material-symbols-outlined text-6xl text-slate-100 mb-4 block">folder_off</span>
            <h3 className="text-xl font-black text-slate-900 uppercase">No Matches Found</h3>
            <p className="text-slate-400 text-sm mt-1 mb-8">Try adjusting your filters or start a new application.</p>
            <Link
              href="/dashboard/browse"
              className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Explore Opportunities
            </Link>
          </div>
        )}
      </div>

      {/* Tip Banner */}
      {!loading && applications.length > 0 && (
        <div className="mt-12 bg-indigo-600 rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-white text-3xl">lightbulb</span>
              </div>
              <div>
                <h4 className="text-white text-xl font-black uppercase tracking-tight">Optimize Your Response Rate</h4>
                <p className="text-indigo-100 text-sm mt-1">Users with complete profiles are 3x more likely to be shortlisted.</p>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="px-8 py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-xl"
            >
              Update Digital CV
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

