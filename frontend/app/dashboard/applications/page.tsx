"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ApplicationTracking() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow w-full">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary-container mb-4 font-headline">Application Tracker</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">Manage your career journey. Monitor progress, prepare for interviews, and keep track of your future opportunities in one curated workspace.</p>
        </header>

        <section className="flex flex-col md:flex-row gap-6 mb-10 items-end justify-between">
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
            <button className="px-6 py-2 bg-white shadow-sm text-primary-container font-semibold rounded-lg transition-all">All</button>
            <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Active</button>
            <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Interviews</button>
            <button className="px-6 py-2 text-on-surface-variant hover:bg-white/50 font-medium rounded-lg transition-all">Archived</button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input type="text" placeholder="Search companies..." className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-secondary-container placeholder:text-on-surface-variant/50 outline-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-primary-container text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-xl">tune</span>
              <span>Filters</span>
            </button>
          </div>
        </section>

        <div className="space-y-6">
          {/* Card 1 */}
          <div className="group relative bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/20">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm shrink-0">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS-IoDa-W44-rBhlh7oegq4hUBzVue0yEjP3mhhi8CGuDKi3rag-4nm8kodAdCQGHKmm-mfV0bgqeOvdPJfzAAvmSEXcHBoY2zCo4dB9_nbxpRGZ6WGe6v37LEkHP3bQ4BneoZlRngS9C1ZHs7dSJi_0L-tnGkz59SZFT0dvT0dNpKjwUCk2vxrZo6Xk9J6ijKpWqZ2TViNbQTJ0x1dW3hvwmA0AOnqKi-1fKczcPxe3xOO5GlBsHsORMX7qKxONkIGIFynh8Wl74" alt="Stripe" className="w-full h-auto" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-container font-headline">Frontend Engineering Intern</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-on-surface-variant font-medium">Stripe</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-on-surface-variant font-medium">Dublin, Ireland (Hybrid)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow max-w-2xl px-4 hidden md:block">
                  <div className="relative w-full">
                    <div className="flex justify-between mb-6">
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center shadow-lg shadow-secondary-container/20">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Submitted</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center shadow-lg shadow-secondary-container/20">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Reviewing</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white border-4 border-secondary-container text-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">pending</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-container">Interview</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10 opacity-30">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">flag</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Decision</span>
                      </div>
                    </div>
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-surface-container-high -z-0">
                      <div className="h-full bg-secondary-container" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-outline-variant hover:bg-primary-container hover:text-white transition-all shrink-0">
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            <div className="px-8 pb-8 border-t border-outline-variant/10 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Next Step</h4>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">event</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary-container">Technical Interview</p>
                      <p className="text-sm text-on-surface-variant">Tomorrow, Oct 24 • 14:00 GMT</p>
                      <button className="mt-3 text-sm font-bold text-secondary-container hover:underline">Launch Zoom</button>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-xl">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Timeline Details</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-secondary-container rounded-full"></span>
                      <span className="text-on-surface-variant">Interview invitation received on Oct 20</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 bg-secondary-container rounded-full"></span>
                      <span className="text-on-surface-variant">Application moved to review on Oct 18</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-white rounded-xl">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Application Materials</h4>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 hover:bg-surface transition-colors">
                      <span className="text-sm font-medium">Main_Resume_2024.pdf</span>
                      <span className="material-symbols-outlined text-on-surface-variant">download</span>
                    </a>
                    <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 hover:bg-surface transition-colors">
                      <span className="text-sm font-medium">Stripe_Cover_Letter.pdf</span>
                      <span className="material-symbols-outlined text-on-surface-variant">download</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-xl shadow-sm hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/20">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Airbnb&background=FF5A5F&color=fff" alt="Airbnb" className="w-full h-auto rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-container font-headline">UX Design Apprentice</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-on-surface-variant font-medium">Airbnb</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-on-surface-variant font-medium">San Francisco, USA (Remote)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow max-w-2xl px-4 hidden md:block">
                  <div className="relative w-full">
                    <div className="flex justify-between mb-6">
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Submitted</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white border-4 border-secondary-container text-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">pending</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-container">Reviewing</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10 opacity-30">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">event</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Interview</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10 opacity-30">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">flag</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Decision</span>
                      </div>
                    </div>
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-surface-container-high -z-0">
                      <div className="h-full bg-secondary-container" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-outline-variant hover:bg-primary-container hover:text-white transition-all shrink-0">
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-xl shadow-sm hover:shadow-xl hover:shadow-on-surface/5 border border-transparent hover:border-outline-variant/20">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-sm shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Spotify&background=1DB954&color=fff" alt="Spotify" className="w-full h-auto rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-container font-headline">Backend Infrastructure Intern</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-on-surface-variant font-medium">Spotify</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-on-surface-variant font-medium">Stockholm, Sweden (On-site)</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow max-w-2xl px-4 hidden md:block">
                  <div className="relative w-full">
                    <div className="flex justify-between mb-6">
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Submitted</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Reviewing</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Interview</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white border-4 border-secondary-container text-secondary-container flex items-center justify-center animate-pulse">
                          <span className="material-symbols-outlined text-xl">celebration</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-container">Decision</span>
                      </div>
                    </div>
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-surface-container-high -z-0">
                      <div className="h-full bg-secondary-container" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-outline-variant hover:bg-primary-container hover:text-white transition-all shrink-0">
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-primary-container text-white p-12 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6 font-headline">Need Interview Prep?</h3>
              <p className="text-white/70 mb-8 text-lg">Access our curated library of mock interviews and company-specific question banks to stand out in your next round.</p>
              <button className="bg-secondary-container text-primary-container font-extrabold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-transform">Start Prep Course</button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
              <span className="material-symbols-outlined text-[15rem]">school</span>
            </div>
          </div>

          <div className="bg-surface-container-high p-12 rounded-[2rem]">
            <h3 className="text-2xl font-bold text-primary-container mb-6 font-headline">Application Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                <span className="block text-4xl font-extrabold text-primary-container mb-2 font-headline">12</span>
                <span className="text-on-surface-variant font-medium">Total Applied</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                <span className="block text-4xl font-extrabold text-secondary-container mb-2 font-headline">4</span>
                <span className="text-on-surface-variant font-medium">Interviews</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                <span className="block text-4xl font-extrabold text-green-600 mb-2 font-headline">1</span>
                <span className="text-on-surface-variant font-medium">Offer</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                <span className="block text-4xl font-extrabold text-on-surface-variant mb-2 font-headline">78%</span>
                <span className="text-on-surface-variant font-medium">Response Rate</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary-container text-white py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter mb-4 font-headline">InternBeacon</h2>
            <p className="text-white/50 max-w-xs">Building the bridge between ambitious students and the world's most innovative companies.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold mb-4 font-headline">Platform</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/" className="hover:text-amber-500">Find Work</Link></li>
                <li><Link href="/" className="hover:text-amber-500">Mentorship</Link></li>
                <li><Link href="/" className="hover:text-amber-500">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-headline">Company</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/" className="hover:text-amber-500">About Us</Link></li>
                <li><Link href="/" className="hover:text-amber-500">Careers</Link></li>
                <li><Link href="/" className="hover:text-amber-500">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-headline">Social</h4>
              <ul className="space-y-2 text-white/50">
                <li><a href="#" className="hover:text-amber-500">LinkedIn</a></li>
                <li><a href="#" className="hover:text-amber-500">Twitter</a></li>
                <li><a href="#" className="hover:text-amber-500">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-white/30 text-sm">
          <span className="font-headline">© 2024 InternBeacon. All rights reserved.</span>
          <div className="flex gap-6 mt-4 md:mt-0 font-headline">
            <Link href="/" className="hover:text-white">Privacy Policy</Link>
            <Link href="/" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
