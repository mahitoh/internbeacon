"use client";

import React from "react";
import Link from "next/link";

export default function StudentFeed() {
  return (
    <div className="w-full max-w-7xl">
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-secondary mb-3 block font-headline">Intelligence</span>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-on-background font-headline leading-[0.9] mb-4">Your Feed</h1>
        <p className="text-on-surface-variant max-w-xl text-base font-medium leading-relaxed">Curated internships, company updates, and opportunities matched specifically to your academic profile.</p>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-8 mb-12 border-b border-outline-variant/10 overflow-x-auto no-scrollbar">
        {["For You", "Trending", "New This Week", "Saved"].map((tab, i) => (
          <button
            key={tab}
            className={`shrink-0 pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${
              i === 0
                ? "border-secondary text-on-primary-fixed"
                : "border-transparent text-outline hover:text-on-primary-fixed hover:border-outline-variant/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main feed */}
        <div className="lg:col-span-8 space-y-8">
          {[
            {
              company: "Lumina Systems",
              logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEG0I-6AwMEyKAKjwJ4jCdbyk8xyHNdmTJ8-maS7IdWs2OUkbJzMaNG4V0O3fK9fVNbBxK9voChxkb9IKs61sycpuPVK0y2SR2ccQhxYee22qvCJmunRuvM7RUcmOYsslxswiVMruZKcO3rOt16uvpsG6b6GFY_PjMfitfPWZhzihMqWBiMYti2_U_9INK64z5AoOFevzUUqG0edx3qBo3vx6c9HiQMYthu1tb3qrT2k1YTs2CCYN2m6nuzYyA9nYa8TJh2eVa_9o",
              role: "Senior Software Engineering Intern",
              location: "Remote / New York",
              stipend: "$4,500/mo",
              duration: "6 Months",
              match: "98%",
              tag: "React · TypeScript · Cloud",
              deadline: "2 days left",
              deadlineColor: "text-red-500",
              id: "1",
            },
            {
              company: "Atmosphere Design",
              logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBek_dKrVY6xu1e2hjjQj8uyTQXpJX-310mHjo8hfj-EhVl4hCYfEHw6jAdW8MJmQqwJ-xxpCw_-bqAgiMoFjYR2e-MyFXKInmDpprVgzVPsqfv1irvJ-PhusYpTMT_hkkxPFzcZuF3hqf8Fz-2nWXvTleYHjilyZP317POpClGBZuZw-Q2wv5GUQXdWurzHSU1bGysCvy2x7TQzziQDpbv8u2hC2fFDJdd1QJ-ecksJObe4biboPY6CXr0Rys29HHIQuRe8AHV3zM",
              role: "Product UI/UX Research Intern",
              location: "London, UK",
              stipend: "$2,800/mo",
              duration: "3 Months",
              match: "85%",
              tag: "Figma · User Testing · Prototyping",
              deadline: "1 week left",
              deadlineColor: "text-amber-500",
              id: "2",
            },
            {
              company: "Quantify Financial",
              logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6HFDPsEhHZuWImUoDK5epDarVUnQmppUCZiSzRy0facL-3kg3OR7JYGAfMUXp8NQP1AhGbshCYZnUdnvAAeLSPN3OK4Yn-DsIG1CSYW-KQSWuIA40BPNCHmLPJKQ9DWna8ZwMBNUqoijBxSU4DU5iQunTBAe109cjdx4SthQVMdZECa66-zxchvAOs7aJ3xitVaKmoEjYbPSx7-X4JiugZ_i-3dbyeAVc_xSOjHAD2__4RhjeyG0-5kjF9-zKqFMNSlVtZZA",
              role: "Data Analysis & Visualization",
              location: "San Francisco, CA",
              stipend: "$3,200/mo",
              duration: "6 Months",
              match: "94%",
              tag: "Python · SQL · PowerBI",
              deadline: "Expires today",
              deadlineColor: "text-red-600",
              id: "3",
            },
          ].map((item) => (
            <article
              key={item.id}
              className="group bg-surface-container-lowest rounded-[2rem] p-8 flex gap-8 items-start border-none shadow-editorial hover:scale-[1.01] transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container-low flex-shrink-0 border-none flex items-center justify-center p-3 shadow-sm">
                <img className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" src={item.logo} alt={item.company} />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-6 mb-2">
                  <div>
                    <h3 className="font-headline font-black text-2xl text-on-primary-fixed group-hover:text-secondary transition-colors leading-tight">{item.role}</h3>
                    <p className="text-sm font-bold text-outline uppercase tracking-wider">{item.company} <span className="mx-2 text-outline/30">·</span> {item.location}</p>
                  </div>
                  <span className="shrink-0 bg-secondary-container/10 text-secondary-container px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary-container/10">
                    {item.match} match
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {item.tag.split(" · ").map(t => (
                    <span key={t} className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-black uppercase tracking-tighter rounded-lg">{t}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-outline">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">payments</span>
                    {item.stipend}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    {item.duration}
                  </span>
                  <span className={`flex items-center gap-2 ${item.deadlineColor}`}>
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    {item.deadline}
                  </span>
                </div>
              </div>
              <Link
                href={`/internships/${item.id}`}
                className="shrink-0 self-center bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all hidden xl:block shadow-editorial"
              >
                Apply
              </Link>
            </article>
          ))}
        </div>

        {/* Right sidebar - Sticky */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-8 space-y-8">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 border-none shadow-editorial">
              <h4 className="font-black text-on-primary-fixed mb-6 font-headline uppercase tracking-tight text-xl">Top recruiters</h4>
              <div className="space-y-6">
                {["Orange Cameroon", "ENEO", "UBA Bank", "CFAO Motors"].map((co) => (
                  <div key={co} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">business</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-black text-on-primary-fixed group-hover:text-secondary transition-colors">{co}</p>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-widest">2–4 open roles</p>
                    </div>
                    <Link href="/browse" className="bg-surface-container-low p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-on-primary-fixed rounded-[2rem] p-10 text-white shadow-editorial relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 -mr-16 -mt-16 rounded-full blur-3xl"></div>
              <h4 className="font-black mb-4 font-headline text-2xl leading-tight">Complete <br />your profile</h4>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed font-medium">
                A complete profile gets 3× more views from top-tier employers.
              </p>
              <div className="w-full h-2 bg-white/10 rounded-full mb-8">
                <div className="h-full bg-secondary-container rounded-full w-[72%] transition-all duration-1000 shadow-[0_0_20px_rgba(254,166,25,0.4)]" />
              </div>
              <Link
                href="/dashboard/profile"
                className="block text-center py-4 bg-white text-on-primary-fixed hover:bg-secondary hover:text-white transition-all rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Boost Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
