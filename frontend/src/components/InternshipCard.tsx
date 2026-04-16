"use client";

import { Internship } from "@/types";
import Link from "next/link";

interface InternshipCardProps {
  internship: Internship;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
            {internship.company[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
              {internship.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{internship.company}</p>
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">
          Featured
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
        {internship.description}
      </p>

      <div className="grid grid-cols-2 gap-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="material-symbols-outlined text-base leading-none text-primary" aria-hidden="true">location_on</span>
          {internship.location}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="material-symbols-outlined text-base leading-none text-primary" aria-hidden="true">schedule</span>
          {internship.duration}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium text-emerald-600 dark:text-emerald-400">
          <span className="material-symbols-outlined text-base leading-none" aria-hidden="true">payments</span>
          {internship.stipend}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {internship.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-bold bg-secondary/5 text-secondary px-2.5 py-1 rounded-md border border-secondary/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/internships/${internship.id}`}
        className="block w-full text-center py-3 bg-foreground text-background font-bold text-sm rounded-xl transition-all hover:bg-primary hover:text-white"
      >
        View Details
      </Link>
    </div>
  );
}
