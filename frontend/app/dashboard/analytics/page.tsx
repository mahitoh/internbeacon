import React from "react";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-5xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Insights
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Track your application performance and profile views.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-3xl text-slate-400">insights</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-headline">Insights Coming Soon</h2>
        <p className="text-slate-500 text-sm max-w-md">
          We're gathering data to show you how your profile compares against the top candidates.
        </p>
      </div>
    </div>
  );
}
