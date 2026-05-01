"use client";

import { Internship } from "@/types";
import NextLink from "next/link";

interface InternshipCardProps {
  internship: Internship;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <div className="group relative bg-surface-container-lowest rounded-[2rem] p-8 transition-all duration-500 hover:scale-[1.02] shadow-editorial border-none">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary font-black text-2xl group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm">
            {internship.company[0]}
          </div>
          <div>
            <h3 className="font-black text-xl text-on-primary-fixed group-hover:text-secondary transition-colors leading-tight font-headline">
              {internship.title}
            </h3>
            <p className="text-xs text-outline font-black uppercase tracking-widest mt-1">{internship.company}</p>
          </div>
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.2em] bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full border border-secondary-container/10">
          Core Position
        </div>
      </div>

      <p className="text-sm text-outline font-medium line-clamp-2 mb-8 leading-relaxed">
        {internship.description}
      </p>

      <div className="grid grid-cols-2 gap-y-4 mb-8">
        <div className="flex items-center gap-3 text-xs text-outline font-bold">
          <span className="material-symbols-outlined text-lg leading-none text-secondary" aria-hidden="true">location_on</span>
          {internship.location}
        </div>
        <div className="flex items-center gap-3 text-xs text-outline font-bold">
          <span className="material-symbols-outlined text-lg leading-none text-secondary" aria-hidden="true">schedule</span>
          {internship.duration}
        </div>
        <div className="flex items-center gap-3 text-xs font-black text-secondary uppercase tracking-tighter">
          <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">payments</span>
          {internship.stipend}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {internship.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-black uppercase tracking-tighter bg-surface-container text-on-surface-variant px-3 py-1 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      <NextLink
        href={`/internships/${internship.id}`}
        className="block w-full text-center py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-secondary hover:shadow-editorial active:scale-95 shadow-editorial"
      >
        Access Index
      </NextLink>
    </div>

  );
}
