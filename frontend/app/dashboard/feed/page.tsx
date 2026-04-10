"use client";

import React from "react";
import Link from "next/link";

export default function StudentFeed() {
  return (
    <div className="relative min-h-[60vh] font-body antialiased text-on-background selection:bg-secondary-container/30">
      <header className="sticky top-0 z-30 mb-6 flex h-16 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md font-headline text-sm font-semibold md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="relative hidden min-w-0 md:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              className="w-56 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500/20 lg:w-64"
              placeholder="Search internships..."
              type="text"
            />
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/discover" className="border-b-2 border-amber-500 pb-1 text-slate-900">
              Discover
            </Link>
            <Link href="/browse" className="text-slate-500 transition-all hover:text-amber-600">
              Browse
            </Link>
            <Link href="/dashboard" className="text-slate-500 transition-all hover:text-amber-600">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" className="text-slate-900 opacity-80 transition-all hover:text-amber-600 active:opacity-100" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link href="/dashboard/applications" className="text-slate-900 opacity-80 transition-all hover:text-amber-600" aria-label="Applications">
            <span className="material-symbols-outlined">chat_bubble</span>
          </Link>
          <Link
            href="/browse"
            className="hidden rounded-full bg-slate-900 px-5 py-2 text-white transition-all hover:bg-slate-800 md:inline-block"
          >
            Find roles
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-12">
        {/* Left Column: Profile Summary & Stats */}
        <section className="col-span-1 md:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] p-6 flex flex-col items-center text-center outline outline-1 outline-outline-variant/10">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-amber-200 mb-4">
              <img className="w-full h-full object-cover rounded-full border-4 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOl0XR_rNwKIylUYq7dyYJqx8NSyBAjUyH8pwNSaSG3rOBcYl89oifCr7ueANh9t0kHh_n0T4GqDJU9Ypi4Eu4H8HxMus0krGAI5M734PZK3TJETJ2pA7Z8C6baBBACAUP9UtiWQY4oIMvCYb8n7C0-oW0loF3J8cKud7mdk8t-RcLm7meyVFBw2Fj4n0kbg-7wiizcb8oTYUepQOpneeezekKo09if4QCcbDxL-a8EoSq-0VPYO2dvjbrsSNSMGjc4UCKx_Xp1FU" alt="Alex Sterling" />
            </div>
            <h2 className="font-headline text-xl font-extrabold text-slate-900 tracking-tight">Alex Sterling</h2>
            <p className="text-slate-500 text-sm font-medium mb-4">Stanford University • CS '25</p>

            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                <span className="block text-xl font-bold text-slate-900">12</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Apps Sent</span>
              </div>
              <div className="flex-1 bg-surface-container-low p-3 rounded-xl border border-outline-variant/5">
                <span className="block text-xl font-bold text-amber-600">85%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Interview</span>
              </div>
            </div>
          </div>

          {/* Fast Actions */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline font-bold text-lg mb-2">Resume Score</h3>
              <p className="text-slate-400 text-xs mb-4">Your profile is in the top 5% of applicants this week.</p>
              <div className="h-1.5 bg-slate-800 rounded-full w-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[95%]"></div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
        </section>

        {/* Center Column: Scrollable Feed */}
        <section className="col-span-1 md:col-span-6 space-y-6">
          {/* Google Post */}
          <article className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] overflow-hidden group outline outline-1 outline-outline-variant/5">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center p-2 border border-outline-variant/10">
                    <img className="w-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmHC2bTDYicAWOaianiwsfAMbVWb3fOgBN3S2-HKqcdg2wSlm850_B_11fqTylcAQ-odRzbU5KrphBwmSWeyhM65DYb9_FlM4vlc2Cc9B6kiX-h6xZ_HimekJKPpV7mzYn3A0y18ItHgidiK_SChhEoasRwZCXKgyNaX_9D8gIVcBVeQpxMyZ-LVZKFO8BwQeX9ZiHIOXDD1qyZQEeiPmm6KV5tFWNqOth_b2dAHYynml52tn69fbuXM6jwRJxFgQ9HMiSJP4N-vk" alt="Google" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-slate-900">Google</h3>
                    <p className="text-slate-400 text-xs">2 hours ago • New Opportunity</p>
                  </div>
                </div>
                <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest outline outline-1 outline-amber-500/20">Featured</span>
              </div>
              <h4 className="font-headline text-lg font-bold text-slate-900 mb-2 leading-snug">Product Management Intern, Summer 2024</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">Join the Google Maps team to build the future of immersive navigation. Looking for students with a passion for UX and data-driven decisions.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/offers/1" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-500 transition-all flex items-center gap-2">
                  Apply Fast Track <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </Link>
                <button className="bg-surface-container-low text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all border border-outline-variant/10">
                  Save
                </button>
              </div>
            </div>
          </article>

          {/* Stripe Status Update */}
          <article className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] p-6 border-l-4 border-amber-500 outline outline-1 outline-outline-variant/5">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center p-2 border border-indigo-100">
                <img className="w-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx0Z02q1l1wzBVJMU1G5OxPHoKFDbl50SjyXl5L_fr8MhnhQ2ny1sGXs8qSgwtMpqym53FmDrHrVsqAtsbRHPY7MeL_VZD2l4JXqvSSWhdTqClBXNhDYxaLDMXMcCK5ctU8mOGnDqOpR3ESjEskHM-tdG41GC7dIe4VTfoKEI6w4uFCQuyy6ZCGJ7N62VF5wpG1_InoGreVklkQBzNWgFMaotSHf2p0rekcTT0Gh-dmKCVAgjXxkxm0Qr8gDYZCtLnk-qOQrk6z30" alt="Stripe" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-headline font-bold text-slate-900">Application Update</h3>
                  <span className="text-slate-400 text-[10px]">Just now</span>
                </div>
                <p className="text-slate-600 text-sm">Your application for <span className="font-bold text-slate-900">Software Engineering Intern</span> at Stripe has moved to the <span className="text-amber-600 font-bold">Technical Interview</span> stage.</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <a href="#" className="text-amber-600 text-xs font-bold underline decoration-2 underline-offset-4">Schedule Interview</a>
                  <Link href="/dashboard/applications" className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">View Details</Link>
                </div>
              </div>
            </div>
          </article>

          {/* Orange Announcement */}
          <article className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] overflow-hidden outline outline-1 outline-outline-variant/5">
            <img className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-fqU4-mLTAqk-TgXfSZaVxcurTXogzR6kJSwqwHKYeit4R8wpxpMEkQ3ze6xNZwRRtdS836wRwa1PvEkOM8b8qpEDSNR3-XsA1HQnHpPnJ7Ani0umBtpYqRWk2saRjEnsFckaZkCO0RlEQl6R0i4Ws2e8wOuED9caVyferelYZ6nTMaxS_IWXKezx_p9oj3bQY2CC2CyNQevsGob_jpbqQEu2QqoKJtBu6XXzD0RdkfJ9WfPzbaVDFQMr9dYWt97LybcVkIzJxFQ" alt="Office" />
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF7900] flex items-center justify-center text-white font-bold">O</div>
                <div>
                  <h3 className="font-headline font-bold text-slate-900">Orange</h3>
                  <p className="text-slate-400 text-xs">Yesterday • Announcement</p>
                </div>
              </div>
              <h4 className="font-headline text-lg font-bold text-slate-900 mb-2">We're expanding our Paris Innovation Lab</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Orange is opening 50 new internship positions in AI and Cybersecurity for the upcoming Autumn cycle. Vetted candidates get early access.</p>
              <button className="text-slate-900 font-bold text-sm flex items-center gap-1 group hover:text-amber-600 transition-colors">
                Read more <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </article>

          {/* Deadline Reminder */}
          <article className="bg-[#fef2f2] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 outline outline-1 outline-red-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#dc2626] shrink-0">
                <span className="material-symbols-outlined">alarm</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-slate-900">Deadline Approaching</h4>
                <p className="text-slate-600 text-xs">Meta: University Grad SWE Role closes in 24h.</p>
              </div>
            </div>
            <Link href="/discover" className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all text-center border border-slate-100 shrink-0">
              Complete App
            </Link>
          </article>
        </section>

        {/* Right Column: Suggestions */}
        <section className="col-span-1 md:col-span-3 space-y-6">
          {/* Suggested Companies */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] p-6 outline outline-1 outline-outline-variant/5">
            <h3 className="font-headline font-extrabold text-slate-900 mb-6 tracking-tight">Companies to Follow</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center p-2 border border-slate-200 shrink-0">
                    <img className="w-full mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxmjZtPh8TvvQhMTWZQwF03VfpBkf3ejRhV_J5nJu91dTvmU95Faxoopt7lXZA0xvaYHn2NMVXWOIfb_KKp5sjE-1yWbJNJeETnx178F1H3EEC6QRp9koHWQo_1uDnKP-_lbGk47RfJm1_SvpddaEwvRJfDexlpo4MfVzmdZPbmYe4WapcHXF98VU7l-g1az2I1uDI_-48dZoAlkt0svw9q7_xN0I9cgjaAIrwUZfkWLIPDCfaVcjJIDl-4JG_ZhEptxLWHeIYkyQ" alt="Figma" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">Figma</h4>
                    <p className="text-[10px] text-slate-400 truncate">Design Systems</p>
                  </div>
                </div>
                <button className="text-amber-600 font-bold text-[10px] uppercase tracking-widest hover:text-amber-700 transition-colors shrink-0">Follow</button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center p-2 border border-slate-200 shrink-0">
                    <img className="w-full mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDverBckRk6BS5aGvGuT22gkxTYBrxaVrew1N628kORbiU_NK57_9l5LJr35QUFx_JriUrnE53K-4lBghpxnhPcaTcTvMDzj3UEFAcr-olRXRkRwMDvTb5fpkMTQ2Vx7i1bLX8WUp2ZJfa65s0z3t-qqxvL1LPjvztWg2e2T1Y3XXwk3FEewDU4SDQztGSu-re4D0ziQtvRWQNbDmtQu4wD9rCGLaGT8Bf5CEntFdt32yJUPzc3ARAn-I9xnCZeurwarFiDirf3-Ys" alt="Notion" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">Notion</h4>
                    <p className="text-[10px] text-slate-400 truncate">Productivity</p>
                  </div>
                </div>
                <button className="text-amber-600 font-bold text-[10px] uppercase tracking-widest hover:text-amber-700 transition-colors shrink-0">Follow</button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center p-2 border border-slate-200 shrink-0">
                    <img className="w-full mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu4dRTW8Y_5hSuIntsWVraQ4HpRF-36QL0PVhW7ni5NiI4y9eqoICnRjrmWVuvZgshzAC_4NrNQ8fg5WBMVPk_NNEyyxBH9CS538uCgkooCxuSJcMS7ZJdPeLZ-OOZZhF-U3GfRMTuJtuRQb0X2f_lG5lZ67AjZhlgkV5MELqBf1b841lOUKtPEC7zdmzBoqlq_oB_OULrxOUYMv6TG5ChZ0a-8GYlA5YHjZQHkXFOVdLk-1xYFdmCXLu3acxAF5GWMs-H7S1XcuY" alt="Revolut" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">Revolut</h4>
                    <p className="text-[10px] text-slate-400 truncate">Fintech</p>
                  </div>
                </div>
                <button className="text-amber-600 font-bold text-[10px] uppercase tracking-widest hover:text-amber-700 transition-colors shrink-0">Follow</button>
              </div>
            </div>
          </div>

          {/* Recommended Offers */}
          <div className="bg-[#fffbeb] rounded-xl p-6 relative overflow-hidden outline outline-1 outline-amber-100">
            <div className="relative z-10">
              <span className="inline-block bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded mb-4">OFFER</span>
              <h3 className="font-headline font-bold text-slate-900 leading-tight mb-2">Unlock Mock Interviews with Experts</h3>
              <p className="text-slate-600 text-xs mb-4">Get 20% off your first coaching session this month.</p>
              <button className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">Redeem Offer</button>
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-50"></div>
          </div>

        </section>
      </div>
    </div>
  );
}
