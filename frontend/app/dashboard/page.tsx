import React from "react";

export default function Dashboard() {
  return (
    <>
        {/* Header Section */}
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-2 block font-headline">Student Console</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-background font-headline">Good morning, Jean-Luc</h1>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Profile Strength</span>
              <span className="text-xl font-black text-on-surface font-headline">92%</span>
            </div>
            <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden relative">
              <div className="absolute left-0 top-0 h-full bg-secondary-container w-[92%]"></div>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Applications</p>
            <h3 className="text-3xl font-black text-on-background font-headline">12</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-1">Shortlisted</p>
            <h3 className="text-3xl font-black text-on-background font-headline">2</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Pending</p>
            <h3 className="text-3xl font-black text-on-background font-headline">5</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-outline mb-1">Saved</p>
            <h3 className="text-3xl font-black text-on-background font-headline">8</h3>
          </div>
        </div>

        {/* Featured Insight & Hero Section */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="bg-primary-container relative flex min-h-[280px] items-center overflow-hidden rounded-lg p-8 lg:col-span-8 lg:min-h-[300px] lg:p-12">
            <div className="absolute inset-0 opacity-40">
              <img className="w-full h-full object-cover" data-alt="modern tech office meeting room with blurred people and warm sunlight filtering through architectural windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJEUkizAH8r1bsso910CYma7qCpq9EfYbAMJt5gSoS2Ia7TVZ9uyrWIfaU4oAYV0IeYepjCnHN43fqfePvqK7sMEHnfOumLeky1w9aEX7MkKGc8H5-Jtbj7d94AY2isNbcH7QQtuXAdyTNPD-atXgcJX94IRcNjc9QDQPDahZRBhPsAyaSLILee6cpJS9Pia7VJgDG8jRFv8h03F33jQTm60ZinIRm-uX2ALsImSook4v2RqbSqxtZpceR_fA0O3N88_Q5AZqAHXM" alt="Office meeting room"/>
            </div>
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter mb-4">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Smart Match Optimization
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight font-headline">Unlock your 94% affinity matching.</h2>
              <p className="text-primary-fixed-dim text-sm mb-6 leading-relaxed">Our AI has analyzed 1,200 data points to find roles that perfectly align with your aesthetic and skill set.</p>
              <button className="bg-white text-primary-container px-6 py-3 rounded-lg font-bold text-sm transition-all hover:bg-slate-100">Review Insights</button>
            </div>
          </div>
          {/* Profile Chip Column */}
          <div className="flex flex-col justify-between rounded-lg bg-surface-container-low p-8 lg:col-span-4">
            <div>
              <h3 className="text-lg font-bold text-on-background mb-2 font-headline">Architectural Portfolio</h3>
              <p className="text-xs text-outline leading-relaxed mb-6">Your visual narrative is outperforming 85% of other elite candidates.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Visual Design</span>
                  <span className="font-bold">98%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container w-[98%]"></div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-on-surface-variant font-medium">Strategic Logic</span>
                  <span className="font-bold">82%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container w-[82%]"></div>
                </div>
              </div>
            </div>
            <button className="text-secondary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
              Edit Profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* AI Recommendations Grid */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight font-headline">Recommended for your Aesthetic</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] hover:shadow-lg transition-all duration-300">
              <div className="h-40 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="minimalist architectural office interior with large windows and clean white desks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ybPU5cN2zRqgB3dyCl15_H69Cm05oHjq-_ikyhCKt0OnZ1bYp0bZ5zlClawyTJCmUQGpY4Gk-jXhIGlppNilg6GVQCEaVrDAXhqEA9mi9DgsuTd9rIiNXubFvkeCYqV5hfN-hRTM4fPM_wx3aklDqO9cPeMZUIYfaV6ozxfvAy65lk0ZlrSUEtYul64w6e-vLM1_ZckF0uAI4A-cNeKwD_eb0tnI4EBnMrZebGt2TlD12YEy4aydy-xz5coEfcwJSyIN9nifIGA" alt="Architecture & Design Office"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black">98% MATCH</div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mb-2 font-headline">Architecture &amp; Design</p>
                <h4 className="text-lg font-bold text-on-background mb-1 font-headline">Junior Creative Strategist</h4>
                <p className="text-sm text-outline mb-6">Maison Curated | London</p>
                <div className="flex justify-between items-center pt-4 border-t border-surface-container-low">
                  <span className="text-[13px] font-semibold">$3,200 / mo</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-800">Apply</button>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] hover:shadow-lg transition-all duration-300">
              <div className="h-40 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="top view of a sleek modern laptop on a wooden desk with a coffee mug and notebook" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzpydUTMAoglUBW-KkLeF4Y2KyOpY8QqKmvcrZFV7OtIUOKs0fpBmsbsbJg3cur-Voa0gSJLyEYHPCYFKGNgceWL21zO3mxBVo87GCnx9uBCj6Rl83YewAOkwn4eB8K8SV13KhgLd3vWLQl9bQtOsYQizMp1Y_FF0mE_lwp9C3RqfKDj4cVNmOiZOpOGj0mbfH5g1iabVgvsEMjYVQ4CjifYSlHHJZXcSS_n5TB_7Ei1uOSWEC4G8SEFXrUiOX_qd2y0nys1ARmaM" alt="Digital Product Office"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black">94% MATCH</div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mb-2 font-headline">Digital Product</p>
                <h4 className="text-lg font-bold text-on-background mb-1 font-headline">UX/UI Design Intern</h4>
                <p className="text-sm text-outline mb-6">Prisma Studio | Berlin</p>
                <div className="flex justify-between items-center pt-4 border-t border-surface-container-low">
                  <span className="text-[13px] font-semibold">$2,800 / mo</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-800">Apply</button>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="group bg-surface-container-lowest rounded-lg overflow-hidden shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] hover:shadow-lg transition-all duration-300">
              <div className="h-40 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="boutique retail store interior with aesthetic shelving and high-end fashion items" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRNJE2XB0gKsAuEfGSYSihDD8UflM5YQq9UqC5IEOyLL75pgUuC0fX-CpFV8zRChydInVT9wJVPWvrOMuQuiUgD6eLWvRdz6gpsbl4JCuBtk39dxMrGvS-S1Xz5Nms3bi6aAkRoYkgeuyRXNF6qOeEF8MfWimQsoDz-En3Xo9DckGlleA6I0zyO9vvjnpGJUfJrMAmGiQCoTQU4LHUDenCKw-cxfnhNI7d2o2_h0fDE1nM2rrl9I1rAsg8IsfK9PaPJh77lPVmcjI" alt="Boutique Office"/>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black">89% MATCH</div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.15em] mb-2 font-headline">Editorial</p>
                <h4 className="text-lg font-bold text-on-background mb-1 font-headline">Visual Content Curator</h4>
                <p className="text-sm text-outline mb-6">Vogue Elite | Paris</p>
                <div className="flex justify-between items-center pt-4 border-t border-surface-container-low">
                  <span className="text-[13px] font-semibold">$4,000 / mo</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-800">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
