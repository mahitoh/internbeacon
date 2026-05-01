"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import NextLink from "next/link";
import Footer from "@/components/Footer";

export default function OfferDetails() {
  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow w-full">
        {/* Role Hero Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center p-2 outline outline-1 outline-outline-variant/10">
              <img className="w-full h-full object-contain p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJ5wJI0XTJ3o_AiAw8-rWaZ3tXE4v9m5awqiFIZoEWC7CR9zMmYZk0Ned5FHDSuewJ1-8oSkWegHo_o-K67j5sakpJsDyqH9-i1kbRXbnjaBKOCQXDVKFJIXPjg81BLkIja9W64qvN_icyFHAy0d_zBImphLoPvc0ZzKpeWGOsrqTrUhknKlcj73-WmF6gYGCTkE8z8pJqeyhwoBI98qeXGhAIIgXOu3WuHWCWl49wl8PKAzfjqXBXZCGJR0K2dQIxZyvyGPP2Zs" alt="Company Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-label uppercase tracking-widest text-secondary font-bold text-xs mb-1">Stellar Systems</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-sm">location_on</span>
                <span className="text-sm font-medium text-on-surface-variant">San Francisco, CA (Hybrid)</span>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-primary-container leading-[0.95] mb-8 max-w-4xl font-headline">
            Product Design & <br />Strategy Intern
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="bg-primary-container text-white px-5 py-2 rounded-full text-sm font-medium">Design & Creative</span>
            <span className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full text-sm font-medium">6 Months</span>
            <span className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-full text-sm font-medium">Junior Level</span>
            <span className="bg-[#ffddb8] text-[#2a1700] px-5 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm border border-[#ffddb8]/50">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              Paid Opportunity
            </span>
          </div>
        </header>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-8">
            {/* Image Section */}
            <div className="w-full h-[400px] rounded-lg overflow-hidden mb-16 grayscale hover:grayscale-0 transition-all duration-700">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqB9AcSUBYr7qMkF-MOYBgaOd77jjFptvf_p0nSZDd9b5gMdJq_l0-7LLvbnmZRQC93VhHPEn1WKgRnbhG6oiMYmbcKl3GgH406w74r5qxXbymvFqoPdOeQiicsqBH_9njtCy3HKA15d2TCINC3teoQ6HqxAK__rt5wPUjY2I06PKHj8vBGk5VAgDgiiF7V2A6-TpA1IziGhe6YqO2Wjz9wM26gNuvlLfc_mwA1pQBmgrBVtuO4FztXXiT9mTR9sWYsR_JRtOUtUM" alt="Office Environment" />
            </div>

            {/* Description */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary-container font-headline">About the Role</h2>
              <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant">
                <p>We are seeking a curious and driven Product Design Intern to join our elite strategy team. In this role, you will not just be pushing pixels; you will be an integral part of the architectural process that defines how users interact with complex data systems. You will work directly under our Lead Curator of Experience to build the future of decentralised talent platforms.</p>
                <p>Our "Architectural Curator" philosophy drives everything we do. We value asymmetry, white space, and the bold use of typography over traditional cluttered UI patterns. This internship is designed for individuals who view design as a structural science rather than just aesthetic decoration.</p>
              </div>
            </section>

            {/* Requirements */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-primary-container font-headline">Requirements</h2>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary mt-1 shrink-0">check_circle</span>
                  <span className="text-lg text-on-surface-variant">Strong mastery of Figma, including advanced auto-layout and component architectures.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary mt-1 shrink-0">check_circle</span>
                  <span className="text-lg text-on-surface-variant">A portfolio that demonstrates a clear understanding of typography scales and structural hierarchy.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary mt-1 shrink-0">check_circle</span>
                  <span className="text-lg text-on-surface-variant">Currently pursuing or recently graduated with a degree in Design, HCI, or Architecture.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-secondary mt-1 shrink-0">check_circle</span>
                  <span className="text-lg text-on-surface-variant">Ability to articulate design decisions through the lens of user psychology and business impact.</span>
                </li>
              </ul>
            </section>

            {/* Key Tasks - Bento Style */}
            <section>
              <h2 className="text-3xl font-bold mb-8 text-primary-container font-headline">What you'll lead</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-8 rounded-lg shadow-sm border border-outline-variant/10 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4">architecture</span>
                  <h3 className="font-bold text-xl mb-2 font-headline">Design Systems</h3>
                  <p className="text-on-surface-variant">Contributing to our 'Curator' design library, ensuring every component meets our elite standards of spacing and geometry.</p>
                </div>
                <div className="bg-surface-container-highest p-8 rounded-lg shadow-sm border border-outline-variant/20 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4">analytics</span>
                  <h3 className="font-bold text-xl mb-2 font-headline">User Research</h3>
                  <p className="text-on-surface-variant">Synthesizing raw data from our pilot users into actionable architectural blueprints for our engineering team.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Apply Card */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/20">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-outline-variant block mb-2">Deadline</span>
                  <p className="text-lg font-semibold text-primary-container">October 24, 2023</p>
                </div>
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-outline-variant block mb-2">Starting</span>
                  <p className="text-lg font-semibold text-primary-container">January 15, 2024</p>
                </div>
                <button className="w-full bg-secondary-container text-[#fff] py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-secondary-container/20 active:scale-95 mb-4">
                  Apply Now
                </button>
                <button className="w-full bg-surface-container-high text-primary-container py-5 rounded-full font-bold text-lg hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">bookmark</span>
                  Save for Later
                </button>
              </div>

              {/* Company Info */}
              <div className="bg-primary-container text-white p-8 rounded-lg overflow-hidden relative shadow-lg shadow-primary-container/20 border border-primary-container/50">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 font-headline">Stellar Systems</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">A boutique design agency focusing on high-end fintech solutions and digital gallery experiences.</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">language</span>
                      <a href="#" className="text-sm font-medium hover:text-secondary">stellar-systems.io</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">group</span>
                      <span className="text-sm font-medium">50-100 Employees</span>
                    </div>
                  </div>
                </div>
                {/* Background Pattern Deco */}
                <div className="absolute -right-12 -bottom-12 opacity-10">
                  <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                </div>
              </div>

              {/* Curator Chip */}
              <div className="bg-primary-container/5 text-secondary flex items-center gap-3 px-6 py-4 rounded-lg outline outline-1 outline-secondary/20">
                <span className="material-symbols-outlined">verified</span>
                <span className="text-sm font-bold uppercase tracking-wider">Vetted by InternBeacon</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Offers Section */}
        <section className="mt-32 pt-24 border-t border-surface-container-high">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
            <div>
              <span className="font-label uppercase tracking-widest text-outline-variant font-bold text-xs mb-2 block">Curated Matches</span>
              <h2 className="text-4xl font-extrabold text-primary-container tracking-tighter font-headline">Similar Opportunities</h2>
            </div>
            <a href="#" className="text-primary-container font-bold border-b-2 border-primary-container pb-1 hover:text-secondary hover:border-secondary transition-all w-fit">View All Positions</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Similar Card 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-lg group cursor-pointer hover:shadow-xl hover:shadow-primary-container/5 transition-all outline outline-1 outline-outline-variant/10 hover:outline-primary-container/20">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low mb-6 flex items-center justify-center p-2 outline outline-1 outline-outline-variant/20">
                <img className="w-full h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYDdfsWwcHkMbIdTQD9TpgIcKKzTW4eKEtAHO84ugVKfNdtzdQ8LlDjfA6W8zvS4_8uvVVxiBoonofzUkwcXZlAWiJFGo8dhcf7uDDt43qpJLTAdv37m_2S7Jh745ClLigX5SX3DxorytYwMjfB7jqa8LEsk84hy5CZpOrsxnaEQwQp8mUT0fdJnKARp0wRYkU448KOHpUbBeb9ONJLbQWwhaQJxkcHdYzpoGDitwMILDL5wnkeTyWvORXECGxZ1hNf1zjQiuyso0" alt="Logo" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Quantum Labs</span>
              <h4 className="text-xl font-bold text-primary-container mb-4 group-hover:text-secondary transition-colors leading-tight font-headline">Visual Identity Intern</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">Remote</span>
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">Design</span>
              </div>
            </div>

            {/* Similar Card 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-lg group cursor-pointer hover:shadow-xl hover:shadow-primary-container/5 transition-all outline outline-1 outline-outline-variant/10 hover:outline-primary-container/20">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low mb-6 flex items-center justify-center p-2 outline outline-1 outline-outline-variant/20">
                <img className="w-full h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCufaETVIjL7h7WdjdsfYX0VnyNRihxPyCMSpk6OG-9ro5Abkrzi1QkcjFfpL_sCUNJqRRh2fI7Awv19991P51EdluhsqWUDUKasLPOC9495GfbUzUXKYhUZD1OWaIgg6l_eXCutwlrJTsh3gtz9kft3azE5lULd3tKH3Cv-yU1nfvjN4BsmbwjyYQhxMZAlELCTyanW_TO-wVpexOB4I3ByAryHxDH5AtCxSQi0XAtuqWD95wxo8GZNRRgPxK5-QRyZ1HC3wCPcGs" alt="Logo" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Axiom Studio</span>
              <h4 className="text-xl font-bold text-primary-container mb-4 group-hover:text-secondary transition-colors leading-tight font-headline">UX Architect Trainee</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">New York</span>
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">UX Research</span>
              </div>
            </div>

            {/* Similar Card 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-lg group cursor-pointer hover:shadow-xl hover:shadow-primary-container/5 transition-all outline outline-1 outline-outline-variant/10 hover:outline-primary-container/20">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low mb-6 flex items-center justify-center p-2 outline outline-1 outline-outline-variant/20">
                <img className="w-full h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoHu2c8s0LSyWBsSkcgqpEbr6Sybr8M3smGBYNPSQvBc3MJguYae5LPB1hW_Exp3L5biOdgbFHaj5tJ7v5ipyeh7Mj-8gXIPeAQkusBwmVobgbEvoLJfxOvnfLLG_gUGHSHW4II9vP_yeJt314sdM5B5yuOlZEd74KPlHAJ2QFpqlMDGoINfWMErbAEC5kV-yApigwg75EIKqimY0KZwuMJJgW279RHwslSdOgoDUgUfLQ_zFAQQ0xlGWXtQX_MDtVn15t5xFRabo" alt="Logo" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block">Frame Corp</span>
              <h4 className="text-xl font-bold text-primary-container mb-4 group-hover:text-secondary transition-colors leading-tight font-headline">Interaction Designer</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">Hybrid</span>
                <span className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-medium shadow-sm">Product</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-surface-container-low py-16 mt-auto border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-primary-container font-headline">InternBeacon</span>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-on-surface-variant">
            <NextLink href="/" className="hover:text-primary-container transition-colors">Privacy Policy</NextLink>
            <NextLink href="/" className="hover:text-primary-container transition-colors">Terms of Service</NextLink>
            <NextLink href="/" className="hover:text-primary-container transition-colors">Cookie Settings</NextLink>
          </div>
          <p className="text-xs text-outline font-medium">© 2023 InternBeacon. Part of the Curator Network.</p>
        </div>
      </footer>
    </div>
  );
}
