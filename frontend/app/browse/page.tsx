"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import Link from "next/link";

export default function BrowseInternships() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 w-full flex-grow">
        {/* Hero Search Section */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4 leading-tight font-headline">
            Discover your next <span className="text-secondary-container">career chapter.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mb-8">
            Curated opportunities from world-class companies, designed for the next generation of talent.
          </p>

          {/* Search Bar Floating */}
          <div className="bg-surface-container-lowest p-2 rounded-2xl shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center flex-1 px-4 w-full">
              <span className="material-symbols-outlined text-outline">search</span>
              <input 
                className="w-full border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline py-4 font-medium outline-none px-4" 
                placeholder="Search by role, company or keyword..." 
                type="text" 
              />
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/20 hidden md:block"></div>
            <div className="flex items-center px-4 w-full md:w-auto">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <input 
                className="w-full md:w-40 border-none focus:ring-0 bg-transparent text-on-surface placeholder:text-outline py-4 font-medium outline-none px-4" 
                placeholder="City or Remote" 
                type="text" 
              />
            </div>
            <button className="w-full md:w-auto bg-secondary-container text-on-primary px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98]">
              Find Internships
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 sticky top-32 space-y-8">
            <div className="bg-surface-container-low p-6 rounded-lg space-y-8">
              <div>
                <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Sector</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm absolute inset-auto opacity-0 peer-checked:opacity-100"></div>
                      <input className="peer absolute opacity-0 w-full h-full cursor-pointer" type="checkbox" defaultChecked />
                    </div>
                    <span className="text-on-surface font-medium">Technology</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm absolute inset-auto opacity-0 peer-checked:opacity-100"></div>
                      <input className="peer absolute opacity-0 w-full h-full cursor-pointer" type="checkbox" />
                    </div>
                    <span className="text-on-surface font-medium">Design & Creative</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm absolute inset-auto opacity-0 peer-checked:opacity-100"></div>
                      <input className="peer absolute opacity-0 w-full h-full cursor-pointer" type="checkbox" />
                    </div>
                    <span className="text-on-surface font-medium">Marketing</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Level</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button className="text-left px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-semibold text-sm">Undergraduate</button>
                  <button className="text-left px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm">Postgraduate</button>
                  <button className="text-left px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm">Fresh Graduate</button>
                </div>
              </div>

              <div>
                <h3 className="font-headline font-bold text-primary text-sm uppercase tracking-widest mb-6">Duration</h3>
                <div className="space-y-4">
                  <input className="w-full accent-primary" max="12" min="1" type="range" defaultValue="6" />
                  <div className="flex justify-between text-xs font-bold text-outline uppercase">
                    <span>1 Month</span>
                    <span>12 Months</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg group aspect-[4/5] flex items-end p-6">
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdx2zABCR8UzjsglDKd6nkoGPqm5zjOFxG4ZSgKBWLsYMs0VmDc-JGuKoXo6ilJ-7KGx-4XwEpCQ3BlJsnJji7xfs-J0o5O_24I7490yyaHxjmG6qXKzyxQ48kJmi2UqUCHqLcm3VZrbmR-o2XEAuo-fdY8IQS7r_woz3T64LT0J2W3nWikLwLqILNOZsLORFZTjnQRF-jG_Y7mo1tJ0fwY3upkOano8U_TeioaSPz59QCkMPvv7pbqRFK0OTlyfqLinNOwFzwoYg" 
                alt="Premium support"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
              <div className="relative z-10 w-full">
                <p className="text-secondary-container font-bold text-xs uppercase tracking-widest mb-2 font-headline">Exclusive Access</p>
                <h4 className="text-white font-headline font-bold text-xl leading-tight mb-4">Get personalized career coaching.</h4>
                <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-surface-container-lowest transition-colors">Upgrade Plan</button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <section className="lg:col-span-9">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-outline font-bold text-sm uppercase tracking-widest mb-1 font-headline">Results</p>
                <h2 className="text-2xl font-bold text-primary font-headline">124 Internships Available</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button className="p-2 rounded-lg text-outline hover:bg-surface-container-high transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">list</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg group hover:shadow-xl hover:shadow-primary/5 transition-all outline outline-1 outline-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center p-2 outline outline-1 outline-outline-variant/10">
                    <img className="w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5z0ED0iLuQJuwtL2jzguXFBUxIuyRHLhown1f4DoFW9Z4ZQ0Y0vmQoCeXkOjDEv45tY5EwYJfh4oX-MRwY4cc4krBcj5dn27qlTW9s6G8hS8buN3UY3l1JfbV_xDHME7ggSM7wazEwqaX3-pG05sDBzuAQ0DUX2n7PBOgLrtNkeqheFQocjTfwm6xBD6nZpplWoeB7Tk6XRlYOQlvQKwgHZyqFewFRbwo0nistOKaKONLDiRSH1GV_mo7a2IaWGg_qx-WDyWjac" alt="Stripe" />
                  </div>
                  <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Vetted</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary-container transition-colors font-headline">Product Design Intern</h3>
                <p className="text-on-surface-variant font-medium mb-6">Stripe • San Francisco / Remote</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">6 Months</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">$4500/mo</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center text-outline text-xs font-medium">
                    <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                    Deadline: Oct 15
                  </div>
                  <Link href="/internships/1" className="text-primary font-bold text-sm flex items-center group/btn">
                    Details
                    <span className="material-symbols-outlined ml-1 transition-transform group-hover/btn:translate-x-1 text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg group hover:shadow-xl hover:shadow-primary/5 transition-all outline outline-1 outline-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center p-2 outline outline-1 outline-outline-variant/10">
                    <img className="w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAknq6QEzb7LbgHkJdHl4LcBCCiCLrQ1RTBrfOjkM3xbfniGWSGShIkqVbTuAw6vSYkzvd3IztG9ywoV8afdxh26MZf8UcnYKxsSlNwGemRFp8SxCqTSVhjAZ1MK-DgvgerF6_X7wOG4zyQxx9QfprQ8WLUDST4YDpb3H9kpY2VQ3ZCPWOndeYn0pGP8-UlVJ2bu6vF42KqEAQei2vva2kbt9eiG-8xdaDDi7taQLVVO6Bbr6rvQOzDK_iIBFM2tSP09KkBah4geq0" alt="Airbnb" />
                  </div>
                  <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Urgent</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary-container transition-colors font-headline">Frontend Engineering</h3>
                <p className="text-on-surface-variant font-medium mb-6">Airbnb • London, UK</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">3 Months</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">Relocation</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center text-outline text-xs font-medium">
                    <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                    Deadline: Sep 30
                  </div>
                  <Link href="/internships/2" className="text-primary font-bold text-sm flex items-center group/btn">
                    Details
                    <span className="material-symbols-outlined ml-1 transition-transform group-hover/btn:translate-x-1 text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg group hover:shadow-xl hover:shadow-primary/5 transition-all outline outline-1 outline-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center p-2 outline outline-1 outline-outline-variant/10">
                    <img className="w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMBGkKZimjmzY98VdQyusnEzFt825Io5gWKAGLnVpW9zh5CJJNjd52Vj_N01gb57LQBk3V08QvIhDXXYiuQRxM8ymy-tOKbBfqSnEoBsUI3ZqADQ3e5_55WPnSinx7YEq5BdW3CK0qSb8TQ9azt5_9hMAlVandoLdugBxYaHzZDFbyENHMz36EQUBpqe1OAZ_WxhRL9cz7cq8lTKMUlDTbBwlb3v-phlLXQ2a4GNrf572HvodhGtWb55ailxMKlvlghnJwM34vAaw" alt="Notion" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary-container transition-colors font-headline">Marketing Strategy</h3>
                <p className="text-on-surface-variant font-medium mb-6">Notion • New York City</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">6 Months</span>
                  <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-full outline outline-1 outline-outline-variant/20">Hybrid</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center text-outline text-xs font-medium">
                    <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                    Deadline: Nov 05
                  </div>
                  <Link href="/internships/3" className="text-primary font-bold text-sm flex items-center group/btn">
                    Details
                    <span className="material-symbols-outlined ml-1 transition-transform group-hover/btn:translate-x-1 text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg group hover:shadow-xl hover:shadow-primary/5 transition-all border border-secondary-container/50 bg-secondary-container/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm outline outline-1 outline-outline-variant/10">
                    <img className="w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkR-9TWmQFko3Wgu3tJS-JkK6UHoYRvR_F6h36BoziCM297ij98-tePA23b7PeoJ0GUP6XB0EN0q5KUYCmmNaRsPaNi8a_xlTe3OmE-K_5T9xwy-ujOhu95KHnwjViAlSCMTHPsl7QdRLKqp9_Z6JO9n_jRaBBJLKMlAhXObr3s9IwmG0OJY86C01nSU1nnCrcnTkuYI1Qsh_sB9FWYEZR39zalJVts7oAdB7luUXppfe_QXkZYCuULMOzzSHQB5Vdhsb_q40u8QI" alt="Tesla" />
                  </div>
                  <span className="bg-secondary-container text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Curated</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary-container transition-colors font-headline">Autopilot Systems Intern</h3>
                <p className="text-on-surface-variant font-medium mb-6">Tesla • Palo Alto, CA</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-white shadow-sm text-on-surface-variant text-xs font-semibold rounded-full border border-secondary-container/20">12 Months</span>
                  <span className="px-3 py-1 bg-white shadow-sm text-on-surface-variant text-xs font-semibold rounded-full border border-secondary-container/20">Equity</span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-secondary-container/20">
                  <div className="flex items-center text-outline text-xs font-medium">
                    <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                    Deadline: Dec 01
                  </div>
                  <Link href="/internships/4" className="text-secondary-container font-bold text-sm flex items-center group/btn">
                    Details
                    <span className="material-symbols-outlined ml-1 transition-transform group-hover/btn:translate-x-1 text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <nav className="mt-16 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-on-surface-variant">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-on-surface-variant">3</button>
              <span className="text-outline px-2">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-on-surface-variant">12</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
