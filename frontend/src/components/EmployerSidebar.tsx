import React from 'react';
import Link from 'next/link';

export default function EmployerSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full p-6 flex-col gap-4 bg-slate-50 border-r-0 w-72 z-40 hidden md:flex">
      <div className="mb-8">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">Boutique Console</h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Elite Talent View</p>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {/* Dashboard Active */}
        <Link href="/employer/dashboard" className="bg-white text-slate-900 rounded-xl shadow-sm p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="font-headline text-[13px] font-semibold">Dashboard</span>
        </Link>
        <Link href="/employer/applicants" className="text-slate-500 hover:bg-slate-200/50 rounded-xl p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">description</span>
          <span className="font-headline text-[13px] font-semibold">Applications</span>
        </Link>
        <Link href="#" className="text-slate-500 hover:bg-slate-200/50 rounded-xl p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">bookmark</span>
          <span className="font-headline text-[13px] font-semibold">Saved</span>
        </Link>
        <Link href="#" className="text-slate-500 hover:bg-slate-200/50 rounded-xl p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">insights</span>
          <span className="font-headline text-[13px] font-semibold">Analytics</span>
        </Link>
        <Link href="#" className="text-slate-500 hover:bg-slate-200/50 rounded-xl p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="font-headline text-[13px] font-semibold">Settings</span>
        </Link>
        <Link href="#" className="text-slate-500 hover:bg-slate-200/50 rounded-xl p-3 flex items-center gap-3 transition-transform duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-xl">help</span>
          <span className="font-headline text-[13px] font-semibold">Help</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 flex flex-col gap-4">
        <button className="bg-secondary-container text-on-secondary-container font-bold py-3 rounded-xl shadow-sm hover:opacity-90 transition-all text-sm">
          Upgrade Plan
        </button>
        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
          <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSXzih-GlseitvpY_Iw7TwXeg5kkUinDiEUjpJ1cAcRajAapoA5f3pzBn1TPE_yytOAMq7x17bS-tAekrhCP3m_lzZimAu95gN1sCR547fnTrrn3zjOiuCtxWlihMRDDNmB1AHXsuR9jdYb5Fy_V0heOseqJIgWDbz5vERHlI1xQlHi9nrCTsW_aCGJCzEfkbfUhIFqmDD2sWqk4g4CjbOgh7Ulw0N1mx9mVzs9-Pmo1ptc2mYdQzvpMNIn6Lcduwex80yW6ZACFc" alt="Employer"/>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Marcus Sterling</span>
            <span className="text-[10px] text-slate-500 font-medium">Sr. Talent Lead</span>
          </div>
          <Link href="/" className="ml-auto text-slate-400 hover:text-error transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
