"use client";

import Link from 'next/link';
import React from 'react';

export default function PostNewOffer() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-8 py-12">
      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-16 mb-16">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Step 01: Role Details</span>
          <div className="h-1 w-48 bg-amber-700 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-3 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 02</span>
          <div className="h-1 w-48 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-3 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 03</span>
          <div className="h-1 w-48 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mb-16">
          <div className="p-16 md:p-24">
            <header className="mb-16">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 font-headline mb-6">Define the opportunity.</h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                Provide the foundational details of your internship. Clarity attracts the highest caliber of emerging talent.
              </p>
            </header>

            <form className="space-y-12">
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Internship Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Product Design Intern" 
                    className="bg-slate-50 border-none rounded-2xl p-6 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Department</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border-none rounded-2xl p-6 text-slate-900 font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-slate-900 transition-all text-sm">
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Product</option>
                        <option>Marketing</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Location</label>
                    <input 
                      type="text" 
                      placeholder="Remote, New York, etc." 
                      className="bg-slate-50 border-none rounded-2xl p-6 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-3xl p-8 border-l-4 border-amber-500 flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                    <span className="material-symbols-outlined font-bold">info</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-2">Curation Tip</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      High-performance teams often offer flexible hours. Specify if this is a "Core Hours" or "Flexible Sync" role.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Duration</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 group focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                      <input 
                        type="number" 
                        placeholder="3" 
                        className="bg-transparent border-none p-6 text-slate-900 font-bold focus:ring-0 w-20 text-sm"
                      />
                      <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Months</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Stipend (Monthly)</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 group focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                      <span className="text-slate-400 font-bold mr-2">$</span>
                      <input 
                        type="text" 
                        placeholder="2,500" 
                        className="bg-transparent border-none p-6 text-slate-900 font-bold focus:ring-0 flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-50">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Save as Draft</button>
                <button className="w-full md:w-auto bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] px-12 py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                  Continue to Requirements
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Optimization Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1522071823991-b59fea12f42a?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover" 
              alt="Team optimization" 
            />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Premium Partner
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-headline tracking-tight mb-4">Your listing is optimized for elite discovery.</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              By using InternBeacon, your role is automatically formatted for our Curated Gallery, where vetted talent from top-tier institutions browse for their next career-defining move.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
