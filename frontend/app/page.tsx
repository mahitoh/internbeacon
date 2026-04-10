"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[921px] bg-on-primary-fixed flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 architectural-grid pointer-events-none opacity-40"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px]"></div>
          <div className="relative w-full max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-secondary-fixed-dim text-xs font-bold tracking-[0.2em] uppercase mb-8 w-fit">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                Premium Talent Marketplace
              </span>
              <h1 className="text-[60px] leading-[1.05] font-extrabold tracking-tighter text-white mb-8 max-w-3xl">
                Find Your Internship.<br/>
                <span className="text-secondary-fixed-dim">Not on WhatsApp.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                Access a curated gallery of elite internships from Cameroon&apos;s top-tier companies. No noise, just professional growth.
              </p>
              {/* Search Bar */}
              <div className="bg-surface-container-lowest p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl max-w-3xl">
                <div className="flex-1 flex items-center px-4 w-full">
                  <span className="material-symbols-outlined text-outline">search</span>
                  <input className="w-full border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none p-2 bg-transparent" placeholder="Search roles, skills, or companies..." type="text"/>
                </div>
                <div className="hidden md:block w-px h-8 bg-slate-200 mx-2"></div>
                <div className="flex-1 flex items-center px-4 w-full">
                  <span className="material-symbols-outlined text-outline">location_on</span>
                  <input className="w-full border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none p-2 bg-transparent" placeholder="Location" type="text"/>
                </div>
                <Link
                  href="/browse"
                  className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-secondary-container text-on-secondary-fixed font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 text-center"
                >
                  Search roles
                </Link>
              </div>
              {/* Stats Counter */}
              <div className="mt-16 flex flex-wrap gap-12 border-t border-white/5 pt-12">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-white mb-1">500+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Students</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-white mb-1">120+</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Elite Partners</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-secondary-fixed-dim mb-1">92%</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Success Rate</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <img alt="Student working" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvNmUM-gMwQiD6TLu09QX9w2bJ9_70RJ1_k_3nwjtk3W0FZeBI3FDXfPHY4lnTOQEPBOHknllq2gMh3GwL_ZEpPoZvjsyx7wPIT_7Zjy0o7VtCxmvtXbEFYiXodOVutg8uRaVIrv4ehqXMbLWcYkjU16Zwn1-Z282dtAu_WmQQL3nnXZiv_hkyGBtk3zppzg0uFMRAPACpXI-y3uNfhEmDP4iTru6jAgcvQg-69bfrdWMhAuS2GHBhoX07niwMmSoFigxFmpZL_nw"/>
                <div className="absolute inset-0 bg-gradient-to-t from-on-primary-fixed/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-white font-medium italic">&quot;Found my dream marketing internship at Eneo through InternBeacon in just 4 days.&quot;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container"></div>
                    <span className="text-sm text-slate-300">Marie L., Marketing Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Trusted By Section */}
        <section className="py-16 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-8">
            <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-outline mb-10">Trusted by Cameroon&apos;s Industry Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-2xl font-black text-on-surface-variant tracking-tighter">ORANGE</div>
              <div className="text-2xl font-black text-on-surface-variant tracking-tighter">ENEO</div>
              <div className="text-2xl font-black text-on-surface-variant tracking-tighter">UBA</div>
              <div className="text-2xl font-black text-on-surface-variant tracking-tighter">CIGAL</div>
              <div className="text-2xl font-black text-on-surface-variant tracking-tighter">CFAO</div>
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section className="py-32 bg-surface">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">The Process</span>
                <h2 className="text-5xl font-extrabold text-on-primary-fixed leading-tight tracking-tighter">Three Steps to Elite Placement</h2>
              </div>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 text-on-primary-fixed font-bold border-b-2 border-secondary pb-1 group w-fit"
              >
                Explore full directory
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <Card className="relative overflow-hidden border-outline-variant/15 bg-surface-container-lowest shadow-none transition-all hover:-translate-y-2 hover:shadow-xl group">
                <span className="text-8xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-secondary/5 transition-colors pointer-events-none">01</span>
                <CardHeader className="relative z-10 pb-2">
                  <div className="w-16 h-16 bg-on-primary-fixed text-white flex items-center justify-center rounded-2xl mb-2">
                    <span className="material-symbols-outlined text-3xl">person_search</span>
                  </div>
                  <CardTitle className="text-2xl">Curated selection</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-slate-500 leading-relaxed">
                  No generic lists. Browse internships vetted for quality, mentorship value, and career impact.
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-outline-variant/15 bg-surface-container-lowest shadow-none transition-all hover:-translate-y-2 hover:shadow-xl group">
                <span className="text-8xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-secondary/5 transition-colors pointer-events-none">02</span>
                <CardHeader className="relative z-10 pb-2">
                  <div className="w-16 h-16 bg-on-primary-fixed text-white flex items-center justify-center rounded-2xl mb-2">
                    <span className="material-symbols-outlined text-3xl">description</span>
                  </div>
                  <CardTitle className="text-2xl">Smart application</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-slate-500 leading-relaxed">
                  Apply directly with a professional profile designed to highlight your specific academic strengths.
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-outline-variant/15 bg-surface-container-lowest shadow-none transition-all hover:-translate-y-2 hover:shadow-xl group">
                <span className="text-8xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-secondary/5 transition-colors pointer-events-none">03</span>
                <CardHeader className="relative z-10 pb-2">
                  <div className="w-16 h-16 bg-on-primary-fixed text-white flex items-center justify-center rounded-2xl mb-2">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <CardTitle className="text-2xl">Direct connection</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 text-slate-500 leading-relaxed">
                  Cut the wait. Get verified responses and schedule interviews directly through our secure console.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Feature Split Sections */}
        <section className="py-24 bg-surface-container-low overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-8 space-y-32">
            {/* Students Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-10">
                  <img alt="Students collaborating" className="rounded-xl w-full aspect-video object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6aktXmtLmkXextvimC3bGQssVT0Vgo12v7ccHzPqVVJp5YjEB6IlAyhC5e0a3C03hYOKlOOZEArmovlRd5gMlNrob-mLOOlhd5Kgt7YPB_W-8ydoAb9dDI1nsL0Ijfajrmqp4AaRTKshaUuFAsCOAbWTnLppiHmgHxzUAw2q7saI1KTC3Rae-b3FgehLuZOrD5othfNym8WA3IoHUPGGvnbzn4o3pnZ3sXo7rbZvVgbr6d6ZpIvsj2TjWmvaBmcRynDTCo3ycQtw"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl border-l-4 border-secondary">
                    <span className="block text-2xl font-extrabold text-on-primary-fixed">500+</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">New roles monthly</span>
                  </div>
                  <div className="bg-on-primary-fixed p-6 rounded-2xl">
                    <span className="block text-2xl font-extrabold text-white">Top 1%</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Vetted talent pool</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">For Future Experts</span>
                <h2 className="text-4xl font-extrabold text-on-primary-fixed mb-6 leading-tight tracking-tighter">Your career isn&apos;t a group chat message.</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">Stop searching through unorganized WhatsApp groups. InternBeacon provides a structured, professional platform to showcase your talent to elite recruiters.</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-on-primary-fixed font-semibold">
                    <span className="material-symbols-outlined text-secondary">check_circle</span> Verified Job Listings
                  </li>
                  <li className="flex items-center gap-3 text-on-primary-fixed font-semibold">
                    <span className="material-symbols-outlined text-secondary">check_circle</span> Direct HR Communication
                  </li>
                  <li className="flex items-center gap-3 text-on-primary-fixed font-semibold">
                    <span className="material-symbols-outlined text-secondary">check_circle</span> CV Optimization Tools
                  </li>
                </ul>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center px-8 py-4 bg-on-primary-fixed text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Start browsing roles
                </Link>
              </div>
            </div>
            {/* Employers Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">For Elite Partners</span>
                <h2 className="text-4xl font-extrabold text-on-primary-fixed mb-6 leading-tight tracking-tighter">The Boutique Talent Pipeline</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">Reach the top 5% of Cameroonian students. Our platform filters for academic excellence and soft skills, saving you weeks of screening time.</p>
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 p-6 bg-white rounded-2xl hover:shadow-md transition-shadow cursor-default">
                    <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-primary-fixed">dashboard</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-primary-fixed">Boutique Console</h4>
                      <p className="text-sm text-slate-500">Manage all applications in a clean, professional dashboard.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-white rounded-2xl hover:shadow-md transition-shadow cursor-default">
                    <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-primary-fixed">filter_alt</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-primary-fixed">Smart Filtering</h4>
                      <p className="text-sm text-slate-500">Automated CV screening based on your specific requirements.</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/employer/post"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-on-primary-fixed text-on-primary-fixed font-bold rounded-xl hover:bg-on-primary-fixed hover:text-white transition-all"
                >
                  List your opportunity
                </Link>
              </div>
              <div className="relative">
                <div className="bg-on-primary-fixed rounded-[2.5rem] aspect-square flex items-center justify-center p-12 overflow-hidden">
                  <div className="absolute inset-0 architectural-grid opacity-20"></div>
                  <div className="relative z-10 w-full">
                    {/* Card UI Preview */}
                    <div className="bg-white rounded-2xl p-6 shadow-2xl space-y-4 mb-6 translate-x-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-slate-50 rounded w-1/3"></div>
                        </div>
                        <div className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full">VETTED</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-50 rounded w-full"></div>
                        <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl space-y-4 -translate-x-8">
                      <div className="flex items-center gap-4 opacity-50">
                        <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-screen-xl mx-auto bg-on-primary-fixed rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter">Ready for the elite experience?</h2>
              <p className="text-xl text-slate-400 mb-12">Join the waitlist or post your first listing today. Be where the talent is.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-10 py-5 bg-secondary-container text-on-secondary-fixed font-bold rounded-2xl text-lg hover:scale-[1.03] transition-transform active:scale-95 shadow-xl shadow-amber-500/10 text-center"
                >
                  Get started now
                </Link>
                <Link
                  href="/employer/dashboard"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white/5 text-white border border-white/10 font-bold rounded-2xl text-lg hover:bg-white/10 transition-colors text-center"
                >
                  Employer console
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
