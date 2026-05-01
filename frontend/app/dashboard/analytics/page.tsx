import React from "react";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-6xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Insights
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Track your application performance and profile views over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Profile Views</span>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md">+24%</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-900 font-headline">142</span>
          <span className="text-xs text-slate-500 mt-2">In the last 30 days</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Search Appearances</span>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md">+12%</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-900 font-headline">85</span>
          <span className="text-xs text-slate-500 mt-2">In the last 30 days</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">App Conversion</span>
            <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">-2%</span>
          </div>
          <span className="text-4xl font-extrabold text-slate-900 font-headline">18%</span>
          <span className="text-xs text-slate-500 mt-2">From profile view to apply</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 font-headline">Views over time</h3>
            <select className="text-xs border-none bg-slate-50 rounded-lg px-3 py-1.5 font-bold text-slate-600 outline-none cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          
          {/* Mock Chart */}
          <div className="h-64 flex items-end gap-2 px-4 border-b border-slate-100 pb-2 relative">
            <div className="absolute top-0 w-full border-t border-dashed border-slate-100 h-0"></div>
            <div className="absolute top-1/2 w-full border-t border-dashed border-slate-100 h-0"></div>
            {[40, 60, 45, 80, 50, 95, 75, 40, 55, 85, 60, 100].map((val, i) => (
              <div key={i} className="flex-1 bg-amber-500/20 hover:bg-amber-500 transition-colors rounded-t-md relative group cursor-pointer" style={{ height: `${val}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {val * 2}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h3 className="font-bold text-slate-900 font-headline mb-6">Recent Profile Viewers</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">G</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Recruiter at Google</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">S</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Engineering Manager at Stripe</p>
                <p className="text-xs text-slate-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">visibility_off</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Anonymous Employer</p>
                <p className="text-xs text-slate-500">3 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">A</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Talent Team at Airbnb</p>
                <p className="text-xs text-slate-500">Last week</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 py-2.5 rounded-xl transition-colors">
            View All Viewers
          </button>
        </div>
      </div>
    </div>
  );
}
