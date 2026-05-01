"use client";

import { MOCK_INTERNSHIPS } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import React from "react";

export default function BrowseAndDiscover() {
  const displayedInternships = MOCK_INTERNSHIPS.slice(0, 8); // Show first 8 for variety

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
                  {["Software Engineering", "UI/UX Design", "Data Science", "Marketing"].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded-sm border-outline-variant text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                    </label>
                  ))}
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

              {/* Reset Filters */}
              <button className="w-full py-4 border border-outline-variant/30 rounded-DEFAULT text-xs font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                Clear All Filters
              </button>
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
              {displayedInternships.map((internship, idx) => (
                <article key={internship.id} className="group bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start transition-all hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/10 hover:border-outline-variant/20">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 outline outline-1 outline-outline-variant/10 flex items-center justify-center font-bold text-2xl text-primary/20">
                    {internship.company.charAt(0)}
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="font-headline font-bold text-xl text-primary group-hover:text-secondary transition-colors">{internship.title}</h3>
                        <p className="text-sm font-semibold text-outline">{internship.company} • {internship.location}</p>
                      </div>
                      <div className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                        <span className="text-xs font-bold tracking-tight">{90 + (idx % 10)}% Match</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {internship.tags.map(tag => (
                        <span key={tag} className="bg-surface-container-low text-on-surface-variant px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">{tag}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-8 pt-2">
                      <div className="flex items-center gap-2 text-outline">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        <span className="text-xs font-bold">{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-outline">
                        <span className="material-symbols-outlined text-lg">payments</span>
                        <span className="text-xs font-bold">{internship.stipend}</span>
                      </div>
                      <div className="flex items-center gap-2 text-outline">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                        <span className="text-xs font-bold">New</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:self-center w-full md:w-auto">
                    <Link href={`/internships/${internship.id}`} className="bg-primary text-white w-full px-8 py-3 rounded-DEFAULT font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center">
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
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

      <Footer />
    </div>
  );
}
