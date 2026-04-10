import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full p-6 flex flex-col gap-4 bg-slate-50 dark:bg-slate-950 w-72 border-r-0 z-40">
      <div className="mb-8 px-2">
        <span className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tighter font-headline">InternBeacon</span>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB76bvavzEkVAGqwRTQU1uvB44JkNxIzkxkq4hlyuR1IjtmjrAzRGL_7RdFQiscYjovQ8am2M8Dq3Le77YKBDq3p_UTIKeuJXessBjv-wieUMVj8KXl6yoLFmsdSO6hh3r6wfOo0w7jvCHNuMah7Lb1opxsyutsc2M2albB6uLjYxd5AaRGJNufq2AyCr03xfJfYoeQ_UJzjZMiDA2DDCuUdJBpBLjl6jp9oOzM__lr2vnUjE88ajLGQSNA6VVGa6RnobQ_cPy6QE" alt="User avatar"/>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-tight">Jean-Luc</p>
            <p className="text-[11px] text-slate-500">Elite Talent View</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-xl shadow-sm hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-[13px] font-semibold">Dashboard</span>
        </Link>
        <Link href="/dashboard/applications" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span className="text-[13px] font-semibold">Applications</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
          <span className="text-[13px] font-semibold">Saved</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">insights</span>
          <span className="text-[13px] font-semibold">Analytics</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-[13px] font-semibold">Settings</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl hover:translate-x-1 transition-transform duration-200 group">
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-[13px] font-semibold">Help</span>
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <button className="bg-secondary-container text-on-secondary-container py-3 px-4 rounded-xl text-[13px] font-bold transition-all hover:opacity-90 active:scale-95">
          Upgrade Plan
        </button>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-[13px] font-semibold">Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
