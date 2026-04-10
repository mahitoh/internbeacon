"use client";

import Link from 'next/link';
import React from 'react';

export default function PostNewOffer() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
          {/* Progress Rail */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-secondary-container">Step 01: Role Details</span>
              <span className="text-xs font-bold tracking-widest uppercase text-outline">Step 02</span>
              <span className="text-xs font-bold tracking-widest uppercase text-outline">Step 03</span>
            </div>
            <div className="h-[2px] w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary-container w-1/3 transition-all duration-500"></div>
            </div>
          </div>

          {/* Content Canvas */}
          <div className="bg-surface-container-lowest p-10 md:p-16 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)]">
            {/* Editorial Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary mb-4 font-headline">
                Define the opportunity.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
                Provide the foundational details of your internship. Clarity attracts the highest caliber of emerging talent.
              </p>
            </div>

            {/* Multi-step Form (Step 1 Active) */}
            <form className="space-y-10">
              {/* Section: Basic Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Internship Title</label>
                    <input className="bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-DEFAULT p-4 text-primary transition-all placeholder:text-outline-variant" placeholder="e.g. Product Design Intern" type="text" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Department</label>
                      <select className="bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-DEFAULT p-4 text-primary transition-all appearance-none cursor-pointer">
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Marketing</option>
                        <option>Product</option>
                        <option>Sales</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Location</label>
                      <input className="bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-DEFAULT p-4 text-primary transition-all placeholder:text-outline-variant" placeholder="Remote, New York, etc." type="text" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Description</label>
                    <textarea className="bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-DEFAULT p-4 text-primary transition-all placeholder:text-outline-variant min-h-[120px]" placeholder="Brief context about this role..." />
                </div>
              </div>

              {/* Section: Engagement Model */}
              <div className="p-8 bg-surface-container-low rounded-lg border-l-4 border-secondary-container">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary-container mt-1">info</span>
                  <div>
                    <h3 className="font-bold text-primary mb-1 font-headline">Curation Tip</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      High-performance teams often offer flexible hours. Specify if this is a "Core Hours" or "Flexible Sync" role.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Duration</label>
                  <div className="flex items-center bg-surface-container-low rounded-DEFAULT px-4">
                    <input className="bg-transparent border-none focus:ring-0 w-16 p-4 text-primary outline-none" placeholder="3" type="number" />
                    <span className="text-on-surface-variant font-medium">Months</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-primary/60 ml-1">Stipend (Monthly)</label>
                  <div className="flex items-center bg-surface-container-low rounded-DEFAULT px-4">
                    <span className="text-on-surface-variant font-medium">$</span>
                    <input className="bg-transparent border-none focus:ring-0 flex-1 p-4 text-primary outline-none" placeholder="2,500" type="text" />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/10">
                <button className="text-on-surface-variant font-semibold hover:text-primary transition-colors order-2 md:order-1" type="button">
                  Save as Draft
                </button>
                <div className="flex items-center gap-4 w-full md:w-auto order-1 md:order-2">
                  <button className="flex-1 md:flex-none px-10 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2" type="button">
                    Continue to Requirements
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Contextual Card (Asymmetric Layout) */}
          <div className="mt-12 flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
            <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-oIBuzr3tuVrcozPt44tMF-CxZqQhWCaB1xbg1etuk1x7aBrJL-bJomrCWNS2lWYaDO3hfPAdmSByY14K5fbPlyw5UiCbdcxbji3IcJ_f_BpxqJfdatqC7kLLLnZ5r8ALs8n22-mtQH7U_9mQ6a3JNkEzUemARryQMeVdtBJcLvfharpDJCd4FXKgKti8egWsBtw-ik7MXCRquuqeMVnTj_zhNWu-_cyU2QhYqkwJkzq7T5xiiwehnvp297Cxe3ZZVlv7_z3xdZE" alt="Team"/>
              <div className="absolute inset-0 bg-primary/20 backdrop-grayscale-[0.5]"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary text-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Premium Partner
              </div>
              <h4 className="text-2xl font-bold text-primary tracking-tight font-headline">Your listing is optimized for elite discovery.</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                By using InternBeacon, your role is automatically formatted for our Curated Gallery, where vetted talent from top-tier institutions browse for their next career-defining move.
              </p>
            </div>
          </div>
    </div>
  );
}
