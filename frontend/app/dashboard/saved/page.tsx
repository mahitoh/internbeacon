import React from "react";
import Link from "next/link";

export default function SavedPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Favorites
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Saved Internships
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Opportunities you've bookmarked to review or apply for later.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-slate-300">bookmark_border</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3 font-headline">No saved opportunities yet</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8">
          When you find an internship you're interested in, click the save icon to keep it here for easy access.
        </p>
        <Link 
          href="/dashboard/browse" 
          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all shadow-md shadow-slate-900/10"
        >
          Explore Internships
        </Link>
      </div>
    </div>
  );
}
