"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function BrowseAndDiscover() {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-secondary-container selection:text-white antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-20 min-h-screen flex-grow">
        {/* Sticky Search Bar Section */}
        <section className="sticky top-20 z-40 bg-surface py-6 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <div className="bg-surface-container-lowest rounded-DEFAULT shadow-sm flex flex-col md:flex-row items-center p-2 gap-2 border border-outline-variant/20">
              <div className="flex-grow flex items-center px-4 w-full">
                <span className="material-symbols-outlined text-outline">search</span>
                <input className="w-full border-none focus:ring-0 bg-transparent text-sm py-3 px-3 outline-none" placeholder="Search roles, skills, or keywords" type="text" />
              </div>
              <div className="hidden md:block w-[1px] h-8 bg-outline-variant/30"></div>
              <div className="flex-grow flex items-center px-4 w-full">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <input className="w-full border-none focus:ring-0 bg-transparent text-sm py-3 px-3 outline-none" placeholder="Location" type="text" />
              </div>
              <button className="w-full md:w-auto bg-secondary-container text-white px-8 py-3 rounded-DEFAULT font-bold text-sm tracking-wide hover:opacity-90 transition-all">
                Find Opportunities
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col lg:flex-row gap-12 pb-20">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-10">
            <div className="space-y-6">
              <h3 className="font-headline font-bold text-lg tracking-tight">Refine Results</h3>

              {/* Category */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Category</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded-sm border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" defaultChecked />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Software Engineering</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded-sm border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">UI/UX Design</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded-sm border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Data Science</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded-sm border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Marketing</span>
                  </label>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 text-xs font-semibold rounded-DEFAULT bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all">3 Months</button>
                  <button className="px-3 py-2 text-xs font-semibold rounded-DEFAULT bg-primary text-white transition-all">6 Months</button>
                  <button className="px-3 py-2 text-xs font-semibold rounded-DEFAULT bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all">Remote</button>
                  <button className="px-3 py-2 text-xs font-semibold rounded-DEFAULT bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-all">Hybrid</button>
                </div>
              </div>

              {/* Minimum Stipend slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Min Stipend</label>
                  <span className="text-sm font-bold text-primary">$1,200/mo</span>
                </div>
                <input className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary-container" type="range" />
                <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter mt-2">
                  <span>$0</span>
                  <span>$5,000+</span>
                </div>
              </div>

              {/* Reset Filters */}
              <button className="w-full py-4 border border-outline-variant/30 rounded-DEFAULT text-xs font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                Clear All Filters
              </button>
            </div>

            {/* Curator Selection Card */}
            <div className="p-6 bg-primary rounded-lg text-white space-y-4 relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-lg">Curated for You</h4>
                <p className="text-xs text-primary-fixed-dim leading-relaxed">Our elite curators hand-pick roles that match your portfolio geometry.</p>
                <button className="mt-4 text-xs font-bold text-secondary-container uppercase tracking-widest flex items-center gap-2 group">
                  View Vetted Only 
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl"></div>
            </div>
          </aside>

          {/* Main Results Area */}
          <section className="flex-grow space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase mb-2 block font-headline">Available Opportunities</span>
                <h2 className="font-headline font-extrabold text-3xl tracking-tight">Featured Placements</h2>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-outline">
                <span>Sort by:</span>
                <select className="border-none bg-transparent focus:ring-0 text-primary font-bold cursor-pointer pr-8 outline-none pl-0">
                  <option>Best Match</option>
                  <option>Newest</option>
                  <option>Highest Stipend</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Internship Card 1 */}
              <article className="group bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start transition-all hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/10 hover:border-outline-variant/20">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 outline outline-1 outline-outline-variant/10">
                  <img className="w-full h-full object-cover p-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEG0I-6AwMEyKAKjwJ4jCdbyk8xyHNdmTJ8-maS7IdWs2OUkbJzMaNG4V0O3fK9fVNbBxK9voChxkb9IKs61sycpuPVK0y2SR2ccQhxYee22qvCJmunRuvM7RUcmOYsslxswiVMruZKcO3rOt16uvpsG6b6GFY_PjMfitfPWZhzihMqWBiMYti2_U_9INK64z5AoOFevzUUqG0edx3qBo3vx6c9HiQMYthu1tb3qrT2k1YTs2CCYN2m6nuzYyA9nYa8TJh2eVa_9o" alt="Company Logo" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="font-headline font-bold text-xl text-primary group-hover:text-secondary transition-colors">Senior Software Engineering Intern</h3>
                      <p className="text-sm font-semibold text-outline">Lumina Systems • Remote / New York</p>
                    </div>
                    <div className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span className="text-xs font-bold tracking-tight">98% Match</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">React</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">TypeScript</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">Cloud Architecture</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      <span className="text-xs font-bold">6 Months</span>
                    </div>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">payments</span>
                      <span className="text-xs font-bold">$4,500/mo</span>
                    </div>
                    <div class="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      <span className="text-xs font-bold">2 days left</span>
                    </div>
                  </div>
                </div>
                <div className="md:self-center w-full md:w-auto">
                  <button className="bg-primary text-white w-full px-8 py-3 rounded-DEFAULT font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center">Apply Now</button>
                </div>
              </article>

              {/* Internship Card 2 */}
              <article className="group bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start transition-all hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/10 hover:border-outline-variant/20">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 outline outline-1 outline-outline-variant/10">
                  <img className="w-full h-full object-cover p-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBek_dKrVY6xu1e2hjjQj8uyTQXpJX-310mHjo8hfj-EhVl4hCYfEHw6jAdW8MJmQqwJ-xxpCw_-bqAgiMoFjYR2e-MyFXKInmDpprVgzVPsqfv1irvJ-PhusYpTMT_hkkxPFzcZuF3hqf8Fz-2nWXvTleYHjilyZP317POpClGBZuZw-Q2wv5GUQXdWurzHSU1bGysCvy2x7TQzziQDpbv8u2hC2fFDJdd1QJ-ecksJObe4biboPY6CXr0Rys29HHIQuRe8AHV3zM" alt="Company Logo" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="font-headline font-bold text-xl text-primary group-hover:text-secondary transition-colors">Product UI/UX Research Intern</h3>
                      <p className="text-sm font-semibold text-outline">Atmosphere Design • London, UK</p>
                    </div>
                    <div className="bg-primary/5 text-primary px-4 py-1.5 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary/30 rounded-full"></span>
                      <span className="text-xs font-bold tracking-tight">85% Match</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">Figma</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">User Testing</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">Prototyping</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      <span className="text-xs font-bold">3 Months</span>
                    </div>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">payments</span>
                      <span className="text-xs font-bold">$2,800/mo</span>
                    </div>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      <span className="text-xs font-bold">1 week left</span>
                    </div>
                  </div>
                </div>
                <div className="md:self-center w-full md:w-auto">
                  <button className="bg-primary text-white w-full px-8 py-3 rounded-DEFAULT font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center">Apply Now</button>
                </div>
              </article>

              {/* Internship Card 3 */}
              <article className="group bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start transition-all hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/10 hover:border-outline-variant/20">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 outline outline-1 outline-outline-variant/10">
                  <img className="w-full h-full object-cover p-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6HFDPsEhHZuWImUoDK5epDarVUnQmppUCZiSzRy0facL-3kg3OR7JYGAfMUXp8NQP1AhGbshCYZnUdnvAAeLSPN3OK4Yn-DsIG1CIW1CSYW-KQSWuIA40BPNCHmLPJKQ9DWna8ZwMBNUqoijBxSU4DU5iQunTBAe109cjdx4SthQVMdZECa66-zxchvAOs7aJ3xitVaKmoEjYbPSx7-X4JiugZ_i-3dbyeAVc_xSOjHAD2__4RhjeyG0-5kjF9-zKqFMNSlVtZZA" alt="Company Logo" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                    <div>
                      <h3 className="font-headline font-bold text-xl text-primary group-hover:text-secondary transition-colors">Data Analysis & Visualization</h3>
                      <p className="text-sm font-semibold text-outline">Quantify Financial • San Francisco, CA</p>
                    </div>
                    <div className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span className="text-xs font-bold tracking-tight">94% Match</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">Python</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">SQL</span>
                    <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">PowerBI</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      <span className="text-xs font-bold">6 Months</span>
                    </div>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">payments</span>
                      <span className="text-xs font-bold">$3,200/mo</span>
                    </div>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      <span className="text-xs font-bold">Expires Today</span>
                    </div>
                  </div>
                </div>
                <div className="md:self-center w-full md:w-auto">
                  <button className="bg-primary text-white w-full px-8 py-3 rounded-DEFAULT font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center">Apply Now</button>
                </div>
              </article>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 pt-8">
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-surface-container-low text-primary disabled:opacity-50 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-primary text-white font-bold text-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-sm transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-sm transition-colors">3</button>
              <span className="px-2 text-outline">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-surface-container-low hover:bg-surface-container-high text-primary font-bold text-sm transition-colors">12</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-DEFAULT bg-surface-container-low hover:bg-surface-container-high text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
