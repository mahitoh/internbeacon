"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import Link from "next/link";

export default function CompanyProfile() {
  return (
    <div className="bg-surface text-on-surface selection:bg-secondary/30 min-h-screen flex flex-col font-body antialiased">
      <Navbar />

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <header className="relative w-full">
          <div className="h-[400px] w-full relative overflow-hidden">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbxl5mof8QuyN8FUoH2FS9AqinABx-7QfdJuFbDl5VpmpxWy2CTfw7c-MVU78JFEbNr-eDrbhx0wGmnkyoKexgFVwhr_D5vKYEuA6TtWu32_QBGySUQYZoocqCSVsNrNzIPqXwOYVGfwGvAMJheowg9DrQpfmCZ5idP81p-GXyLeMKja74ivlACoZkxF97cZZP4EVaCBW0C9kBC3Wy2596L6l_VzHpO-x93bZJMz6gXfAq_iFnnJ-Uud_TjgxVPtF-xvnPPW8rjDQ" alt="Architectural shot of an office building" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="max-w-[1440px] mx-auto px-8 relative -mt-24">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="p-2 bg-white rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] shrink-0">
                <img className="w-40 h-40 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByZt_mwmB2L3PEMY34XmJ9hhSfIuAWyDVRtiLrdYEg6Ss75_hIryU2Dna6qtZiIPsrWZ5Oq_7F_41Y4lYh7xeXfxFgV4OeSiORNvS97jamOwCXYqpRdYGD7RzL-52A1lripLc0PL3DkcEts1OM7Vj3aYWtN2ZZafJM-7rFO0FW7JOiCnJlVIuNs1wa5Qrx3GD09H--vTAnaO-vag_pUC2A-CxaHtsJ9pEJ7BKu82nbj6rtBKXodan1Q-YZ76sBOO1Lv2FkjPqKToM" alt="Company Logo" />
              </div>
              <div className="pb-4 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-headline">StellarPath Technologies</h1>
                  <span className="flex items-center justify-center bg-secondary text-primary p-1 rounded-full">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </span>
                </div>
                <p className="text-white/90 text-lg max-w-2xl font-medium">Pioneering the next generation of cloud-native infrastructure and distributed systems.</p>
              </div>
              <div className="pb-4 flex flex-wrap gap-3 shrink-0">
                <button className="bg-secondary text-primary font-bold px-8 py-4 rounded-DEFAULT hover:scale-95 transition-all duration-150">Follow Company</button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-4 rounded-DEFAULT hover:bg-white/20 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="max-w-[1440px] mx-auto px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            {/* About Us */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">The Narrative</span>
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
              </div>
              <h2 className="text-3xl font-bold font-headline mb-6 text-primary">About Us</h2>
              <div className="bg-surface-container-low p-10 rounded-lg">
                <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
                  At StellarPath, we don't just build software; we architect the digital future. Founded in 2018, our mission has been to simplify the complexities of global data distribution. We serve over 500 enterprise clients, helping them navigate the transition to decentralized computing.
                </p>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  Our team of curators and engineers work at the intersection of performance and aesthetics. We believe that tools should be as beautiful as they are powerful.
                </p>
              </div>
            </section>

            {/* Our Culture (Bento Style) */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">The Essence</span>
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
              </div>
              <h2 className="text-3xl font-bold font-headline mb-8 text-primary">Our Culture</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-primary text-white p-10 rounded-lg flex flex-col justify-between">
                  <span className="material-symbols-outlined text-secondary text-4xl mb-6">auto_awesome</span>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-headline">Innovation by Default</h3>
                    <p className="text-white/70">We allocate 20% of our week to pure exploration and research projects that challenge our existing stack.</p>
                  </div>
                </div>
                <div className="bg-surface-container-high p-8 rounded-lg border border-outline-variant/10">
                  <h3 className="text-xl font-bold mb-4 text-primary font-headline">Asynchronous</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Deep work is prioritized. We minimize meetings and maximize documentation and thoughtful communication.</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] border border-outline-variant/10">
                  <h3 className="text-xl font-bold mb-4 text-primary font-headline">Radical Inclusion</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Perspectives from every background fuel our creative engine. Diversity is our structural strength.</p>
                </div>
                <div className="md:col-span-2 bg-secondary/10 p-10 rounded-lg border border-secondary/20 flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-primary font-headline">Wellness First</h3>
                    <p className="text-on-surface-variant">Unlimited PTO, mental health stipends, and a strictly enforced 'no-pings' weekend policy.</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-6xl opacity-50 shrink-0">spa</span>
                </div>
              </div>
            </section>

            {/* Office Gallery */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">The Space</span>
                <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
              </div>
              <h2 className="text-3xl font-bold font-headline mb-8 text-primary">Office Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2 rounded-lg overflow-hidden h-[400px]">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyek1TF8WWrUd9YqBxid8BLg2wHwJV_aqsgVzSotyIpUd2PC8iQFf5KtUeYYYkEPBRRfYzDMygz6Siw382UfrZUTPjPvl6NbfJzlB44aM4W5hGBebkbtJoBRVLjivg1GL3S7U21ZTRU1kwYH_ncV1adQDSdFRotKvIIaniLWFb94_gg001HNz3H6W_pmaiHy6kFk2t8zSyMbVzpA9EiOAZJKXpnYD7v3Or9eSkSLpGK2B6MHEAMpnUAGgLixUUzTEDMpyqqrJ_7b8" alt="Office lounge" />
                </div>
                <div className="rounded-lg overflow-hidden h-[192px]">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ZYMwpRpzTbq4qeDNNEH8iSJBxm5RC2YKckW2w-Y_JK8l6m66EbpxLZ8z-30WlxYEQ0a_c5LNwqSjRgaJZU08r0nzsJNQ6fOu1HIYObsf-sl3qoE09IqkY0nqqh2F-XsmNIQbGp0TY1UUTaO0H9vn5cX_aoEIvOtnbRYqQ4Tii_V5eTzlTd_ROaRP5mZb28vgWzRmoEyHBWXXutJy8g6-wyOUQO4IZ8DswfIVoJMyuJLIkuRpsR36c0XlEfqBWqS4-vNiD3YYa5U" alt="Workstation" />
                </div>
                <div className="rounded-lg overflow-hidden h-[192px]">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM7214xHTdrFxNywcF8yseAm3MDX4JormgTJ6OaUtaaYV6g21VhAvtcAB7MPXHjuABPHdpxAMnnNEdRZcvufOGUoUuWPzMVFMc6VsPWc2vAO9q-5KUEG0GwKqgwfJJY3Va_5KAMJbOd8g05N7oHKY5VECgeHwGBDEIfx754TtYOWyv2a1BPYDe_ZAZXjRNrHyzv9fI6v3T2g89pD5WpPefHsM7ypD_focNEO2Be5-RWjxikIJlaTTBRhwpVPWm47eMOMv-z-t5hQ4" alt="Cafeteria" />
                </div>
                <div className="col-span-2 rounded-lg overflow-hidden h-[192px]">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMxJbuDf-cDMMUYrQ8DeLzM74__7VTH9OgjOv3MQlGNpN8ct1YK9BOm1-5RFNTMwNzU7w2jtcDUBlJ01_FjYD2zVjNNpSmpePjHQnxckdNEddCsc4Bq4AnQiSx2k0lfXRHjgLA16_gxomxfSRbBNET8NYE1YFWtq7DQAj5sijZjcMq60bsF1e1Ycx5TazN2nq0po75REvUGnbFVBH0i_GH8CM-SfF2kaN5vpeOx5Egr1to6dDb1VaGv-tNkc-dZ1sVZgrQtiT0dJg" alt="Collaboration room" />
                </div>
              </div>
            </section>

            {/* Active Internships */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Opportunities</span>
                  <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold font-headline mb-8 text-primary">Active Internships</h2>
              <div className="space-y-4">
                {/* Internship Card 1 */}
                <div className="group bg-white p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:translate-x-1 outline outline-1 outline-outline-variant/5">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-primary text-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Featured</span>
                      <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Remote</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary mb-1 font-headline">Frontend Engineering Intern</h4>
                    <p className="text-on-surface-variant text-sm">Design Systems & React Frameworks • 3 Months • $3.5k/mo</p>
                  </div>
                  <Link href="/offers/1" className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-DEFAULT group-hover:bg-secondary group-hover:text-primary transition-colors text-center shrink-0">
                    Apply Now
                  </Link>
                </div>

                {/* Internship Card 2 */}
                <div className="group bg-white p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:translate-x-1 outline outline-1 outline-outline-variant/5">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Hybrid</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary mb-1 font-headline">Product Design Intern</h4>
                    <p className="text-on-surface-variant text-sm">UI/UX Research & Prototyping • 6 Months • $4k/mo</p>
                  </div>
                  <Link href="/offers/2" className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-DEFAULT group-hover:bg-secondary group-hover:text-primary transition-colors text-center shrink-0">
                    Apply Now
                  </Link>
                </div>

                {/* Internship Card 3 */}
                <div className="group bg-white p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:translate-x-1 outline outline-1 outline-outline-variant/5">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Full-time</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary mb-1 font-headline">Data Science Intern</h4>
                    <p className="text-on-surface-variant text-sm">Machine Learning & Analytics • 4 Months • $3.8k/mo</p>
                  </div>
                  <Link href="/offers/3" className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-DEFAULT group-hover:bg-secondary group-hover:text-primary transition-colors text-center shrink-0">
                    Apply Now
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Quick Facts Card */}
            <div className="bg-white p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.06)] border border-outline-variant/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 border-b border-outline-variant/10 pb-4">Quick Facts</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">business</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Industry</p>
                    <p className="text-primary font-semibold">Software & Cloud Tech</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">groups</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Company Size</p>
                    <p className="text-primary font-semibold">250 - 500 Employees</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Headquarters</p>
                    <p className="text-primary font-semibold">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">language</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Website</p>
                    <a href="#" className="text-primary font-semibold hover:text-secondary transition-colors underline decoration-secondary/30 underline-offset-4">stellarpath.io</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="bg-primary text-white p-8 rounded-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 font-headline">Questions?</h3>
                <p className="text-white/70 text-sm mb-6">Connect with our lead university recruiter to learn more about our 2024 cohorts.</p>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg mb-6">
                  <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmG6fDiEJqcQQ5UWlL_y7qUGTG16jOVRllvwMs0ScjRiRR-BLuB4jfdeTCU3xb-h_E_LJT7UVwzReWMH4DP8fymeS7yZr1ezajks06OzdywoEh5NuLxmR5kIso0ei_zj83Fm6G6uJactUkhR35-MCyBDurl_Qbw_8nL9INhum8n5I343I9ZqQ6IPymkTJuat3yLpP-JcarenSISqs-5IFKbAvBCLZph4REaQcnmEChAniC6WFoRyEXuH8QPL7QZxKxYhZp48FcC3M" alt="Recruiter portrait" />
                  <div>
                    <p className="font-bold text-sm">Elena Rodriguez</p>
                    <p className="text-xs text-white/50">Lead Recruiter</p>
                  </div>
                </div>
                <button className="w-full bg-secondary text-primary font-bold py-3 rounded-DEFAULT hover:scale-95 transition-all">Message Elena</button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-9xl text-white/5">chat_bubble</span>
            </div>

            {/* Social Presence */}
            <div className="bg-surface-container-low p-8 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Follow Our Journey</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary transition-colors shadow-sm focus:outline-none">
                  <span className="material-symbols-outlined text-xl">brand_family</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary transition-colors shadow-sm focus:outline-none">
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary transition-colors shadow-sm focus:outline-none">
                  <span className="material-symbols-outlined text-xl">rss_feed</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-[1440px] mx-auto">
          <div>
            <span className="text-lg font-bold text-slate-900 block mb-6 font-headline">InternBeacon</span>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Connecting elite talent with world-class opportunities through a curated gallery of internships.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/discover" className="hover:text-amber-500 transition-colors">Discover Roles</Link></li>
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Vetted Talent</Link></li>
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Success Stories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/company/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link href="/company/careers" className="hover:text-amber-500 transition-colors">Careers</Link></li>
              <li><Link href="/company/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="px-8 py-8 max-w-[1440px] mx-auto border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2024 InternBeacon Cameroon. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-amber-500 transition-colors">Twitter</Link>
            <Link href="/" className="hover:text-amber-500 transition-colors">LinkedIn</Link>
            <Link href="/" className="hover:text-amber-500 transition-colors">Instagram</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
