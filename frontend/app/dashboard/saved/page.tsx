import React from "react";
import Link from "next/link";

const SAVED_INTERNSHIPS = [
  {
    id: "1",
    company: "Google",
    initials: "G",
    color: "bg-blue-600",
    role: "Product Management Intern",
    location: "Mountain View, CA",
    stipend: "$8,500/mo",
    duration: "12 Weeks",
    tags: ["Product", "Strategy", "UX"],
    savedAgo: "2 hours ago",
    deadline: "Nov 15"
  },
  {
    id: "2",
    company: "Stripe",
    initials: "S",
    color: "bg-indigo-600",
    role: "Software Engineering Intern",
    location: "Remote",
    stipend: "$9,000/mo",
    duration: "16 Weeks",
    tags: ["React", "Go", "Payments"],
    savedAgo: "1 day ago",
    deadline: "Dec 1"
  },
  {
    id: "3",
    company: "Spotify",
    initials: "S",
    color: "bg-green-600",
    role: "Data Science Intern",
    location: "New York, NY",
    stipend: "$7,200/mo",
    duration: "10 Weeks",
    tags: ["Python", "SQL", "Machine Learning"],
    savedAgo: "3 days ago",
    deadline: "Oct 30"
  },
  {
    id: "4",
    company: "Airbnb",
    initials: "A",
    color: "bg-rose-600",
    role: "UX Design Intern",
    location: "San Francisco, CA",
    stipend: "$7,500/mo",
    duration: "12 Weeks",
    tags: ["Figma", "Research", "Prototyping"],
    savedAgo: "1 week ago",
    deadline: "Nov 5"
  }
];

export default function SavedPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Favorites
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Saved Internships
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          Opportunities you've bookmarked to review or apply for later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAVED_INTERNSHIPS.map((item) => (
          <div key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl group hover:shadow-xl hover:shadow-slate-200/60 transition-all border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm ${item.color}`}>
                {item.initials}
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors font-headline">
              {item.role}
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-4">
              {item.company} • {item.location}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6 flex-1">
              {item.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-lg border border-slate-100">
                  {t}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Deadline</span>
                <span className="text-xs font-bold text-slate-700">{item.deadline}</span>
              </div>
              <Link href={`/internships/${item.id}`} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors shadow-sm">
                Apply
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
