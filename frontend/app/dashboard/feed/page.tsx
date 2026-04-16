"use client";

import React from "react";
import Link from "next/link";

export default function StudentFeed() {
  return (
    <div className="w-full max-w-7xl">
      <header className="mb-10">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-2 block font-headline">Discover</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-background font-headline mb-2">Your Feed</h1>
        <p className="text-on-surface-variant max-w-xl">Curated internships, company updates, and opportunities matched to your profile.</p>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-10 border-b border-outline-variant/20 overflow-x-auto">
        {["For You", "Trending", "New This Week", "Saved"].map((tab, i) => (
          <button
            key={tab}
            className={`shrink-0 px-4 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
              i === 0
                ? "border-secondary text-on-primary-fixed"
                : "border-transparent text-on-surface-variant hover:text-on-primary-fixed"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-6">
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
              className="group bg-surface-container-lowest rounded-2xl p-6 flex gap-5 items-start border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline-variant/10 flex items-center justify-center p-2">
                <img className="w-full h-full object-contain" src={item.logo} alt={item.company} />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-primary-fixed group-hover:text-secondary transition-colors">{item.role}</h3>
                    <p className="text-sm font-medium text-outline">{item.company} · {item.location}</p>
                  </div>
                  <span className="shrink-0 bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full text-xs font-black border border-secondary-container/10">
                    {item.match} match
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 mb-4">{item.tag}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-outline">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">payments</span>
                    {item.stipend}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    {item.duration}
                  </span>
                  <span className={`flex items-center gap-1.5 ${item.deadlineColor}`}>
                    <span className="material-symbols-outlined text-base">schedule</span>
                    {item.deadline}
                  </span>
                </div>
              </div>
              <Link
                href={`/internships/${item.id}`}
                className="shrink-0 self-center bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all hidden md:block"
              >
                Apply
              </Link>
            </article>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="font-bold text-on-primary-fixed mb-4 font-headline">Top companies hiring</h4>
            <div className="space-y-4">
              {["Orange Cameroon", "ENEO", "UBA Bank", "CFAO Motors"].map((co) => (
                <div key={co} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-surface-container-low rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">business</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-on-primary-fixed">{co}</p>
                    <p className="text-xs text-outline">2–4 open roles</p>
                  </div>
                  <Link href="/browse" className="text-secondary text-xs font-bold hover:underline">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-on-primary-fixed rounded-2xl p-6 text-white">
            <h4 className="font-bold mb-2 font-headline">Complete your profile</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              A complete profile gets 3× more views from employers.
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-4">
              <div className="h-full bg-secondary-container rounded-full w-[72%]" />
            </div>
            <Link
              href="/dashboard/profile"
              className="block text-center py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold"
            >
              Complete profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
