import React from 'react';
import Link from 'next/link';

export default function EmployerDashboard() {
  return (
    <div className="w-full">
        {/* Header Section */}
        <header className="mb-10 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-on-primary-fixed mb-2 font-headline">Command Center</h2>
            <p className="text-sm sm:text-base text-on-surface-variant font-medium max-w-lg">Orchestrate your global internship pipeline with surgical precision and curated insights.</p>
          </div>
          <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="bg-surface-container-high text-on-surface font-semibold px-5 sm:px-6 py-3 rounded-xl transition-all hover:bg-surface-container-highest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">file_download</span>
              Export Report
            </button>
            <Link href="/employer/post" className="bg-primary-container text-white font-bold px-6 sm:px-8 py-3 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-primary-container/10">
              <span className="material-symbols-outlined">add</span>
              Post Internship
            </Link>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Pipeline */}
          <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10 min-w-0">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                12%
              </span>
            </div>
            <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Total Pipeline</p>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-on-primary-fixed tracking-tighter font-headline">1,284</h3>
          </div>

          {/* Active Roles */}
          <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10 min-w-0">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-2xl">work</span>
              </div>
              <button className="text-on-primary-fixed/40 hover:text-on-primary-fixed transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-widest mb-1">Active Roles</p>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-on-primary-fixed tracking-tighter font-headline">12</h3>
          </div>

          {/* Top Matches */}
          <div className="bg-primary-container p-6 sm:p-7 rounded-lg shadow-xl border border-white/5 relative overflow-hidden min-w-0">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase">AI Curated</span>
              </div>
              <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">Top Matches</p>
              <h3 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter font-headline">84</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary-container opacity-10 rounded-full blur-3xl"></div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Postings List (Main Section) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-xl font-bold text-on-primary-fixed font-headline">Live Recruitment Rails</h4>
              <button className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Posting Card 1 */}
              <div className="group bg-surface-container-lowest p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-outline-variant/20 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 min-w-0">
                <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-on-primary-fixed">code</span>
                </div>
                <div className="flex-grow min-w-0 w-full">
                  <h5 className="font-bold text-on-primary-fixed text-base sm:text-lg mb-1 group-hover:text-secondary transition-colors break-words">Frontend Engineering Intern</h5>
                  <p className="text-sm text-on-surface-variant break-words">Posted 3 days ago • London (Hybrid)</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center shrink-0 w-full lg:w-auto">
                  <div>
                    <p className="text-2xl font-extrabold text-on-primary-fixed font-headline">42</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Applicants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-secondary font-headline">12</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Shortlisted</p>
                  </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-primary-fixed transition-all lg:ml-2 self-end lg:self-auto">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* Posting Card 2 */}
              <div className="group bg-surface-container-lowest p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-outline-variant/20 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 min-w-0">
                <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-on-primary-fixed">palette</span>
                </div>
                <div className="flex-grow min-w-0 w-full">
                  <h5 className="font-bold text-on-primary-fixed text-base sm:text-lg mb-1 group-hover:text-secondary transition-colors break-words">Product Design Associate</h5>
                  <p className="text-sm text-on-surface-variant break-words">Posted 5 days ago • Remote</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center shrink-0 w-full lg:w-auto">
                  <div>
                    <p className="text-2xl font-extrabold text-on-primary-fixed font-headline">18</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Applicants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-secondary font-headline">6</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Shortlisted</p>
                  </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-primary-fixed transition-all lg:ml-2 self-end lg:self-auto">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* Posting Card 3 */}
              <div className="group bg-surface-container-lowest p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-transparent hover:border-outline-variant/20 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 min-w-0">
                <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-on-primary-fixed">analytics</span>
                </div>
                <div className="flex-grow min-w-0 w-full">
                  <h5 className="font-bold text-on-primary-fixed text-base sm:text-lg mb-1 group-hover:text-secondary transition-colors break-words">Data Strategy Analyst</h5>
                  <p className="text-sm text-on-surface-variant break-words">Posted 1 week ago • Berlin (On-site)</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center shrink-0 w-full lg:w-auto">
                  <div>
                    <p className="text-2xl font-extrabold text-on-primary-fixed font-headline">112</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Applicants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-secondary font-headline">24</p>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Shortlisted</p>
                  </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-primary-fixed transition-all lg:ml-2 self-end lg:self-auto">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Recruitment Velocity Chart Area */}
            <div className="mt-12 bg-surface-container-lowest p-5 sm:p-7 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] min-w-0">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-bold text-on-primary-fixed font-headline">Recruitment Velocity</h4>
                  <p className="text-sm text-on-surface-variant">Time-to-hire trend across all departments</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">This Year</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                  <div className="w-full border-t border-outline-variant/10"></div>
                  <div className="w-full border-t border-outline-variant/10"></div>
                  <div className="w-full border-t border-outline-variant/10"></div>
                  <div className="w-full border-t border-outline-variant/10"></div>
                </div>
                {/* Mock Bars */}
                <div className="flex-grow flex items-end justify-between px-2 h-full pb-8 z-10 w-full gap-2">
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[66%] transition-all hover:bg-secondary"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[50%] transition-all hover:bg-secondary"></div>
                  <div className="flex-1 bg-secondary rounded-t-lg h-[90%] shadow-lg shadow-secondary/20"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[45%] transition-all hover:bg-secondary"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[70%] transition-all hover:bg-secondary"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[30%] transition-all hover:bg-secondary"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t-lg h-[80%] transition-all hover:bg-secondary"></div>
                </div>
              </div>
              <div className="flex justify-between px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-4">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </section>

          {/* Top Matches Sidebar */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-5 sm:p-6 rounded-lg sticky top-8 min-w-0">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <h4 className="text-lg font-bold text-on-primary-fixed font-headline">Curated Top Matches</h4>
              </div>

              <div className="space-y-4">
                {/* Match 1 */}
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 group cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-3">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzLK4NjxdkY_1YYbVGg24fMr8N0htayBMPXvXJzRxShurLil7iST7aRp_jwzy4tpt54OGjiccyg3PCq26pj6hWqLgsZMPf88NjrpE61iHONfr7UOoKX3zWq_EBMjMcUUZR3FGUJoNyTf44p5s0EbFdLRhYCWGNOBaPPzab1HcssUgeHi8UzgMCuoI3KKTNzsY7iw3JGdeuY3NQID1l-_SWaBX08Kw5fhniF7KntMQ9WM8OHstKT9cXJQhL3CiGETd2UAziNygw7wQ" alt="Student" />
                    <div>
                      <h6 className="text-sm font-bold text-on-primary-fixed">Julian Vance</h6>
                      <p className="text-[11px] text-on-surface-variant">Stanford • CS Senior</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-black text-secondary font-headline">98%</p>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase">Match</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">React</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">AWS Cloud</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">UX Logic</span>
                  </div>
                </div>

                {/* Match 2 */}
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 group cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-3">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaJbWICNJdl3uZBZJMG_cAGiCRcE42UzLOQ6tYbKdse7YSwyxk3dEXQJFAaUOS2JDC_4PpYXG7X6_b_Qd2ZPJEU50v6dUGRmrRduVIPgx7F0-a2-0LNcqVXNhRvowGx56z1uWFkLnTSMxow0f-A3tkLtVpKpR2TiRi0xogc4vehykdXDjc4QNKG9OCJxr32IeIRrjC-cn6bQ0PLReraHCZSaYAR1YbIh7FxCUi4scWKTaa_S-oy6ddpEPbdvueGeJgMEQ59tOU88U" alt="Student" />
                    <div>
                      <h6 className="text-sm font-bold text-on-primary-fixed">Sienna Rossi</h6>
                      <p className="text-[11px] text-on-surface-variant">Parsons • Product Design</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-black text-secondary font-headline">95%</p>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase">Match</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">Figma</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">Prototyping</span>
                  </div>
                </div>

                {/* Match 3 */}
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 group cursor-pointer transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-3">
                    <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyb4clTVeXRXyKGbnyBX-cT4DZVfSYibjrDnpCcD313_rNYsWxtkOqdgixILJ3hE7lxy2LUoASf7exmW79_eodmJJdN2RvcT5F3gcp23UXHYd5Tx_rgO8v8gXVjYQrTuiuseXEV4Xt-DZg7ZBUsqWN2r18aG2b2mlrHJPLhW5hyp_e-26FoEajTwH5NqC123tTjAmtnnnDITVnte4m1IKbR9qTsGedV-G34Zw4xmR0oI_DbtS8mJ87GHPAREVplGxyK0V0HR5QKeo" alt="Student" />
                    <div>
                      <h6 className="text-sm font-bold text-on-primary-fixed">Ahmed Khalid</h6>
                      <p className="text-[11px] text-on-surface-variant">LSE • Data Science</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-black text-secondary font-headline">92%</p>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase">Match</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">Python</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">SQL</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-surface-container-low text-on-primary-fixed rounded-md uppercase">Forecasting</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-outline-variant/20">
                <div className="p-6 bg-primary-container rounded-xl text-center">
                  <h5 className="text-white font-bold mb-2">Automate Screening</h5>
                  <p className="text-white/60 text-xs mb-4">Let our AI curators rank your next 50 applicants automatically.</p>
                  <button className="w-full py-2 bg-secondary text-on-secondary-container rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                    Activate Auto-Pilot
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

    </div>
  );
}
