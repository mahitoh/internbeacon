import React from "react";

export default function HelpPage() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Support
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Help Center
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Get support, read our guides, and contact the team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-slate-400">mail</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-headline">Contact Support</h2>
          <p className="text-slate-500 text-sm mb-4">
            Our team is here to help you with any issues you encounter.
          </p>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all">
            Email Us
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl text-slate-400">menu_book</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-headline">Documentation</h2>
          <p className="text-slate-500 text-sm mb-4">
            Learn how to make the most of the InternBeacon platform.
          </p>
          <button className="bg-slate-100 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
            Read Guides
          </button>
        </div>
      </div>
    </div>
  );
}
