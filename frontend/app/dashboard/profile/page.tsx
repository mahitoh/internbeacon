"use client";

import Link from "next/link";
import React from "react";

export default function StudentProfile() {
  return (
    <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <section className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
              <div className="relative group mb-8">
                <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVpfRx2zuSsIp2opbpHyBImaD6RLcllyc6d7MQCm0V6xtRKGeu6R-OpZ3lw3TB-wORCxQuHSLmJ02GtjfcHz6Wx_8Wl8dsig5WwY8Jr1HXtupjuGCExtOw51pDBTTY8cn_qG5xNTXPkVz9V4q165ghuFle9qVE-swnZrkEuxDwsGY_K7fltL9WkNk_IqCTWCCOXl7dkVFdXtawm0wNiIhobN6_rlRuRSp9G28HuWCO6PRlC0WruCHztH1eAvhgO4wkm_GXh8WwXfU" alt="Student Profile"/>
                </div>
                <button className="absolute bottom-4 right-4 bg-primary-container text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter text-primary-container leading-none mb-2 font-headline">Alex Rivera</h1>
                    <p className="text-on-tertiary-container font-medium">Product Design Student</p>
                  </div>
                </div>
                <div className="pt-6 space-y-4 border-t-0 bg-surface-container-low/50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary-container">school</span>
                    <span className="text-sm font-medium">Stanford University</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary-container">account_balance</span>
                    <span className="text-sm font-medium">Department of Computer Science</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary-container">bar_chart</span>
                    <span className="text-sm font-medium">Level: Junior (Year 3)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-container text-on-primary rounded-lg p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-container mb-4 font-headline">Curator Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <p className="text-lg font-bold font-headline">Vetted Talent</p>
              </div>
              <p className="text-on-primary-container text-sm leading-relaxed">Top 5% of design students verified through our portfolio review process.</p>
            </div>
          </section>

          <section className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-surface-container-low px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Profile Information</span>
              </div>
              <button className="flex items-center gap-2 text-primary-container font-bold text-sm hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined text-lg">settings</span>
                Edit Profile
              </button>
            </div>

            <div className="bg-surface-container-low rounded-lg p-1">
              <div className="bg-surface-container-lowest rounded-[14px] p-10 shadow-sm border border-outline-variant/10">
                <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">Professional Summary</h2>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-10 max-w-2xl">
                  Passionate about the intersection of human-centered design and systemic efficiency. Currently focusing on developing accessible digital ecosystems for fintech startups while pursuing a minor in Behavioral Economics.
                </p>

                <h3 className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container mb-6 font-headline">Core Competencies</h3>
                <div className="flex flex-wrap gap-3 mb-12">
                  <span className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm border-0">Interface Design</span>
                  <span className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm border-0">User Research</span>
                  <span className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm border-0">Prototyping</span>
                  <span className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm border-0">Figma</span>
                  <span className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm border-0">SwiftUI</span>
                  <span className="px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm border-0">Tailwind CSS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-8 rounded-lg bg-surface-container-low/40 border border-transparent hover:border-outline-variant/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <span className="material-symbols-outlined text-primary-container text-[24px]">description</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-on-tertiary-container bg-surface-container-highest px-2 py-1 rounded">PDF • 2.4 MB</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1 font-headline">Curriculum Vitae</h4>
                    <p className="text-sm text-on-surface-variant mb-6">Updated Sep 2023</p>
                    <div className="flex items-center gap-4">
                      <button className="text-sm font-bold text-primary-container flex items-center gap-1.5 hover:underline">
                        View File
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                      </button>
                      <button className="text-sm font-bold text-secondary flex items-center gap-1.5 hover:underline">
                        Replace
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-outline-variant/30 rounded-lg flex flex-col items-center justify-center p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-outline text-[24px]">add</span>
                    </div>
                    <p className="font-bold text-on-surface-variant">Upload Portfolio</p>
                    <p className="text-xs text-outline mt-1">Maximum size 10MB (PDF/ZIP)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-10 border border-outline-variant/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline">Academic Achievement</h3>
                <span className="material-symbols-outlined text-outline">auto_awesome</span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="w-1 bg-secondary-container h-12 rounded-full mt-1 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-primary-container font-headline">Dean's List 2023</h5>
                    <p className="text-sm text-on-surface-variant mt-1">Top 10% Academic Standing in School of Engineering</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-1 bg-surface-container-highest h-12 rounded-full mt-1 shrink-0"></div>
                  <div>
                    <h5 className="font-bold text-primary-container font-headline">Honors Program</h5>
                    <p className="text-sm text-on-surface-variant mt-1">Interdisciplinary Design Fellowship Member</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
