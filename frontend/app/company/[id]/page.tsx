"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import Link from "next/link";

export default function CompanyProfile() {
  return (
    <div className="bg-[#fcfcfd] min-h-screen flex flex-col font-body antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <header className="relative w-full">
          <div className="h-[450px] w-full relative overflow-hidden">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          <div className="max-w-[1440px] mx-auto px-10 relative -mt-32">
            <div className="flex flex-col md:flex-row items-end gap-10">
              <div className="p-3 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] shrink-0">
                <img className="w-48 h-48 object-cover rounded-[2rem]" src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80" alt="Logo" />
              </div>
              <div className="pb-6 flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white font-headline">StellarPath Technologies</h1>
                  <span className="w-10 h-10 flex items-center justify-center bg-amber-500 text-slate-900 rounded-full shadow-lg shadow-amber-500/20">
                    <span className="material-symbols-outlined text-xl font-bold">verified</span>
                  </span>
                </div>
                <p className="text-white/80 text-xl max-w-3xl font-medium leading-relaxed">Pioneering the next generation of cloud-native infrastructure and distributed systems.</p>
              </div>
              <div className="pb-8 flex flex-wrap gap-4 shrink-0">
                <button className="bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10">Follow Company</button>
                <button className="bg-white/10 backdrop-blur-xl text-white border border-white/20 w-14 h-14 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="max-w-[1440px] mx-auto px-10 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-32">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-24">
            {/* About Us */}
            <section>
              <div className="flex items-center gap-6 mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">The Narrative</span>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-4xl font-extrabold font-headline mb-8 text-slate-900 tracking-tight">About Us</h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-500 font-medium leading-[2]">
                <p>
                  At StellarPath, we don't just build software; we architect the digital future. Founded in 2018, our mission has been to simplify the complexities of global data distribution. We serve over 500 enterprise clients, helping them navigate the transition to decentralized computing.
                </p>
                <p>
                  Our team of curators and engineers work at the intersection of performance and aesthetics. We believe that tools should be as beautiful as they are powerful.
                </p>
              </div>
            </section>

            {/* Our Culture (Bento Style) */}
            <section>
              <div className="flex items-center gap-6 mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">The Essence</span>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-4xl font-extrabold font-headline mb-10 text-slate-900 tracking-tight">Our Culture</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-slate-900 p-12 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative">
                  <span className="material-symbols-outlined text-amber-500 text-5xl mb-12 relative z-10 group-hover:scale-110 transition-transform">auto_awesome</span>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-extrabold mb-4 font-headline text-white tracking-tight">Innovation by Default</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">We allocate 20% of our week to pure exploration and research projects that challenge our existing stack.</p>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all"></div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-extrabold mb-4 text-slate-900 font-headline tracking-tight">Asynchronous</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">Deep work is prioritized. We minimize meetings and maximize documentation and thoughtful communication.</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-extrabold mb-4 text-slate-900 font-headline tracking-tight">Radical Inclusion</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">Perspectives from every background fuel our creative engine. Diversity is our structural strength.</p>
                </div>
                <div className="md:col-span-2 bg-amber-50/50 p-12 rounded-[2.5rem] border border-amber-100/50 flex items-center justify-between gap-10 group">
                  <div className="flex-1">
                    <h3 className="text-3xl font-extrabold mb-4 text-slate-900 font-headline tracking-tight">Wellness First</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Unlimited PTO, mental health stipends, and a strictly enforced 'no-pings' weekend policy.</p>
                  </div>
                  <span className="material-symbols-outlined text-amber-700 text-7xl opacity-20 shrink-0 group-hover:rotate-12 transition-transform">spa</span>
                </div>
              </div>
            </section>

            {/* Active Internships */}
            <section>
              <div className="flex items-center gap-6 mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">Opportunities</span>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <h2 className="text-4xl font-extrabold font-headline mb-10 text-slate-900 tracking-tight">Active Internships</h2>
              <div className="space-y-6">
                {[
                  { title: "Frontend Engineering Intern", details: "Design Systems & React Frameworks • 3 Months • $3.5k/mo", tags: ["FEATURED", "REMOTE"] },
                  { title: "Product Design Intern", details: "UI/UX Research & Prototyping • 6 Months • $4k/mo", tags: ["HYBRID"] },
                  { title: "Data Science Intern", details: "Machine Learning & Analytics • 4 Months • $3.8k/mo", tags: ["FULL-TIME"] }
                ].map((job, i) => (
                  <div key={i} className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map(tag => (
                          <span key={tag} className={`text-[9px] font-black px-3 py-1 rounded-full tracking-widest ${tag === "FEATURED" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>{tag}</span>
                        ))}
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 mb-2 font-headline tracking-tight">{job.title}</h4>
                      <p className="text-slate-400 font-bold text-sm tracking-tight">{job.details}</p>
                    </div>
                    <Link href={`/offers/${i+1}`} className="bg-slate-50 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-all text-center shrink-0">
                      Apply Now
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10 sticky top-24 h-fit">
            {/* Quick Facts Card */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 border-b border-slate-50 pb-6">Quick Facts</h3>
              <div className="space-y-8">
                {[
                  { icon: "business", label: "Industry", val: "Software & Cloud Tech" },
                  { icon: "groups", label: "Company Size", val: "250 - 500 Employees" },
                  { icon: "location_on", label: "Headquarters", val: "San Francisco, CA" },
                  { icon: "language", label: "Website", val: "stellarpath.io", link: true },
                ].map((fact, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-xl">{fact.icon}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{fact.label}</p>
                      {fact.link ? (
                        <a href="#" className="text-slate-900 font-bold hover:text-amber-700 transition-colors underline decoration-amber-500/30 underline-offset-4">{fact.val}</a>
                      ) : (
                        <p className="text-slate-900 font-bold">{fact.val}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold mb-4 font-headline text-white tracking-tight">Questions?</h3>
                <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">Connect with our lead university recruiter to learn more about our 2024 cohorts.</p>
                <div className="flex items-center gap-5 p-5 bg-white/5 rounded-[1.5rem] mb-8 border border-white/5">
                  <img className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" alt="Recruiter" />
                  <div>
                    <p className="font-black text-white text-sm">Elena Rodriguez</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Lead Recruiter</p>
                  </div>
                </div>
                <button className="w-full bg-amber-500 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">Message Elena</button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[12rem] text-white/5 pointer-events-none group-hover:rotate-12 transition-transform">chat_bubble</span>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer is already high quality from common components or manual implementation */}
      <footer className="bg-white border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto px-10 py-24 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1">
             <span className="text-2xl font-black text-slate-900 block mb-8 font-headline tracking-tighter">InternBeacon</span>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">Connecting elite talent with world-class opportunities through a curated gallery of internships.</p>
          </div>
          {/* ... other footer links ... */}
        </div>
      </footer>
    </div>
  );
}
