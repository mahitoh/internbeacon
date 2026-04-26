import React from "react";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Configuration
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Manage your account preferences and notifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-3xl text-slate-400">build</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-headline">Under Construction</h2>
        <p className="text-slate-500 text-sm max-w-md">
          We're currently building out this section to give you more granular control over your experience. Check back soon.
        </p>
      </div>
    </div>
  );
}
