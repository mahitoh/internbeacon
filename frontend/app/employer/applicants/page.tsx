"use client";

import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { getCompanyApplicants, getUserFriendlyError, updateApplicationStatus, type ApplicantModel } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED"] as const;

export default function ManageApplicants() {
  const [applicants, setApplicants] = useState<ApplicantModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyApplicants();
        if (!mounted) return;
        setApplicants(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load applicants"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onStatusChange = async (id: string, status: ApplicantModel["status"]) => {
    try {
      await updateApplicationStatus(id, status);
      setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(getUserFriendlyError(err, "Failed to update status"));
    }
  };

  const safeApplicants = Array.isArray(applicants) ? applicants : [];

  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <NextLink href="/employer/dashboard" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
            <span className="material-symbols-outlined">arrow_back</span>
          </NextLink>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-headline">Product Design Intern 2024</h1>
              <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-slate-200">Active Listing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-slate-900 transition-colors">search</span>
                <input 
                  type="text" 
                  placeholder="Search applicants..." 
                  className="bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none w-64 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <NextLink href="/employer/post" className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl transition-all hover:bg-slate-800 inline-flex items-center gap-2 shadow-lg shadow-slate-900/10 text-sm">
          <span className="material-symbols-outlined text-xl">add</span>
          Post Internship
        </NextLink>
      </header>

      {/* Stats Summary Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2">Total Applicants</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-extrabold font-headline text-slate-900">{safeApplicants.length}</h3>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">+9</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 mb-2">
            <span className="material-symbols-outlined text-lg">description</span>
          </div>
          <p className="text-[8px] uppercase tracking-widest font-black text-slate-400 mb-1">All Applications</p>
          <h3 className="text-2xl font-extrabold font-headline text-white">{safeApplicants.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
            <span className="material-symbols-outlined text-lg">hourglass_empty</span>
          </div>
          <p className="text-[8px] uppercase tracking-widest font-black text-slate-400 mb-1">Pending Review</p>
          <h3 className="text-2xl font-extrabold font-headline text-slate-900">{safeApplicants.filter(a => a.status === "PENDING").length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
          </div>
          <p className="text-[8px] uppercase tracking-widest font-black text-slate-400 mb-1">Shortlisted</p>
          <h3 className="text-2xl font-extrabold font-headline text-slate-900">{safeApplicants.filter(a => a.status === "SHORTLISTED").length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 mb-2">
            <span className="material-symbols-outlined text-lg">cancel</span>
          </div>
          <p className="text-[8px] uppercase tracking-widest font-black text-slate-400 mb-1">Rejected</p>
          <h3 className="text-2xl font-extrabold font-headline text-slate-900">{safeApplicants.filter(a => a.status === "REJECTED").length}</h3>
        </div>
      </section>

      {/* Applicant List Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 font-headline tracking-tight">Applicant Queue</h2>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>

        {error && <div className="mx-10 mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                <th className="px-10 py-6 font-black">Student Name</th>
                <th className="px-6 py-6 font-black">University</th>
                <th className="px-6 py-6 font-black text-center">Academic Level</th>
                <th className="px-6 py-6 font-black">Documents</th>
                <th className="px-6 py-6 font-black">Status</th>
                <th className="px-10 py-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {safeApplicants.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                        <img src={`https://i.pravatar.cc/100?u=${app.student.id}`} alt={app.student.user.name} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{app.student.user.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold">Applied 2h ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-500">University of Toronto</td>
                  <td className="px-6 py-6 text-center">
                    <span className="bg-slate-50 text-slate-400 text-[8px] font-black px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">Masters, CS</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-slate-700 hover:text-amber-700 cursor-pointer group/doc">
                      <span className="material-symbols-outlined text-amber-700 text-sm">description</span>
                      <span className="text-[10px] font-black uppercase tracking-widest border-b border-transparent group-hover/doc:border-amber-700 transition-all">Resume_2024.pdf</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative inline-block">
                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value as ApplicantModel["status"])}
                        className={`appearance-none text-[9px] font-black uppercase tracking-widest rounded-full px-4 py-1.5 pr-8 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-900 ${
                          app.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          app.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                          app.status === "SHORTLISTED" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-slate-50 text-slate-500 border-slate-200"
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-50">expand_more</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm ml-auto">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !safeApplicants.length && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-slate-200">person_search</span>
                      <p className="text-slate-400 font-medium">No applicants found in the queue yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Showing {safeApplicants.length} of {safeApplicants.length} applicants</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Previous</button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-slate-900 text-white text-[10px] font-black">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-[10px] font-black text-slate-400 transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-[10px] font-black text-slate-400 transition-colors">3</button>
              <span className="text-slate-200">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-[10px] font-black text-slate-400 transition-colors">12</button>
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:opacity-70 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
