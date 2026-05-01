"use client";

import React, { useState } from "react";
import { useAuthUser } from "@/lib/authClient";

const PROJECTS = [
  {
    id: 1,
    title: "EcoTrack Mobile App",
    description: "A sustainable living tracker built with React Native and Node.js.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    tags: ["React Native", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "Fintech Dashboard",
    description: "Real-time analytics platform for cryptocurrency trading.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    tags: ["TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: 3,
    title: "AI Health Assistant",
    description: "Machine learning model for predicting health risks based on lifestyle data.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    tags: ["Python", "TensorFlow", "FastAPI"],
  },
];

const SUGGESTIONS = [
  { icon: "description", text: "Add a clear professional headline to stand out." },
  { icon: "code", text: "Highlight your top 3 technical skills in your bio." },
  { icon: "link", text: "Link your GitHub to showcase your coding style." },
  { icon: "photo_camera", text: "Upload a high-resolution profile photo." },
];

export default function DigitalCVPage() {
  const user = useAuthUser();
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  return (
    <div className="w-full relative min-h-screen pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-16 shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
          alt="Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        <div className="absolute bottom-8 left-8 flex items-end gap-6 text-white">
          <div className="relative group/avatar">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white overflow-hidden shadow-2xl bg-slate-800">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"}
                alt={user?.name || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>

          <div className="mb-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-headline">
              {user?.name || "Alex Sterling"}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium mt-1">
              Software Engineering @ Stanford University
            </p>
            <div className="flex gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">school</span> Class of 2026
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span> Palo Alto, CA
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsOptimizerOpen(true)}
          className="absolute top-8 right-8 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border border-white/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px] animate-pulse">auto_awesome</span>
          AI Optimizer
        </button>
      </section>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Portfolio */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 font-headline">
                Project Portfolio
              </h2>
              <button className="text-amber-600 font-bold text-sm hover:underline flex items-center gap-1">
                Add Project <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.map((project) => (
                <div key={project.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Achievements */}
          <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <h2 className="text-2xl font-black tracking-tight mb-8 font-headline relative">
              Academic Background
            </h2>
            <div className="space-y-8 relative">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-500">school</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Stanford University</h4>
                  <p className="text-slate-400 font-medium">B.S. in Computer Science • 3.92 GPA</p>
                  <p className="text-xs text-slate-500 mt-2">Relevant Coursework: Algorithms, Database Systems, AI, HCI</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-500">military_tech</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Dean's List 2024</h4>
                  <p className="text-slate-400 font-medium">Top 5% of class for academic excellence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
              Professional Bio
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Passionate software engineer focused on building intuitive user experiences and scalable backend architectures. Currently exploring the intersection of AI and productivity tools.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Core Skills
            </h3>
            <div className="space-y-6">
              {[
                { name: "Frontend", level: 90, skills: "React, Next.js, Tailwind" },
                { name: "Backend", level: 75, skills: "Node.js, Python, PostgreSQL" },
                { name: "Design", level: 60, skills: "Figma, UI/UX Principles" },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-900">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{skill.skills}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- AI OPTIMIZER PANEL --- */}
      {isOptimizerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOptimizerOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white/70 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.1)] border-l border-white/40 p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 font-headline">
                AI Optimizer
              </h2>
              <button 
                onClick={() => setIsOptimizerOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Profile Strength Gauge */}
            <div className="flex flex-col items-center mb-16">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-100"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - 0.68)}
                    strokeLinecap="round"
                    className="text-amber-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">68%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strength</span>
                </div>
              </div>
              <p className="mt-6 text-sm font-bold text-slate-500 text-center">
                Your profile is <span className="text-amber-600">Strong</span>. Completing the remaining tasks will put you in the top 5%.
              </p>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Actionable Suggestions
              </h3>
              <div className="space-y-4">
                {SUGGESTIONS.map((s, i) => (
                  <div key={i} className="group p-4 rounded-2xl bg-white/50 border border-white hover:border-amber-200 hover:bg-white hover:shadow-lg transition-all duration-300 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-snug">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-12 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl active:scale-95">
              Apply All Optimizations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
