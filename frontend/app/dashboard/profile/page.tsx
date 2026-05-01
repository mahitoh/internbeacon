"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getStoredUser,
  getStudentProfile,
  getUserFriendlyError,
  persistAuth,
  updateStudentProfile,
} from "@/lib/api";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const SUGGESTED_SKILLS = [
  "Interface Design", "User Research", "Prototyping", "Figma", "SwiftUI",
  "Tailwind CSS", "React", "TypeScript", "Python"
];

export default function StudentProfile() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getStudentProfile>> | null>(null);
  const [name, setName]       = useState("");
  const [bio, setBio]         = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills]   = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getStudentProfile();
        if (!mounted) return;
        setProfile(data);
        setName(data.user.name || "");
        setBio(data.bio || "");
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load profile."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const showSuccess = () => {
    setSuccess(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSuccess(false), 3500);
  };

  const addSkill = (value = newSkill) => {
    const v = value.trim();
    if (!v || skills.includes(v) || skills.length >= 20) { setNewSkill(""); return; }
    setSkills((p) => [...p, v]);
    setNewSkill("");
  };

  const removeSkill = (s: string) => setSkills((p) => p.filter((x) => x !== s));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const updated = await updateStudentProfile({ name: name.trim(), bio: bio.trim(), skills });
      setProfile(updated);
      setName(updated.user.name || "");
      setBio(updated.bio || "");
      setSkills(updated.skills || []);
      
      const stored = getStoredUser();
      if (stored) {
        persistAuth({
          user: { ...stored, name: updated.user.name || stored.name },
          token: localStorage.getItem("internbeacon_token") || "",
          refreshToken: localStorage.getItem("internbeacon_refresh_token") || "",
        });
      }
      showSuccess();
    } catch (err) {
      setError(getUserFriendlyError(err, "Could not save profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-slate-500 py-16 justify-center w-full">
        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl transition-all duration-300 ${
          success ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
        <div>
          <p className="font-bold text-sm">Profile saved</p>
          <p className="text-xs text-slate-400">Your changes are live.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <section className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
            <div className="relative group mb-8">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border-0 flex items-center justify-center">
                <span className="text-6xl font-extrabold text-slate-400 select-none">
                  {name ? initials(name) : "U"}
                </span>
              </div>
              <button className="absolute bottom-4 right-4 bg-primary-container text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-extrabold tracking-tighter text-primary-container leading-none mb-2 bg-transparent border-b border-transparent focus:border-outline-variant outline-none w-full"
                    placeholder="Your Name"
                  />
                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="text-on-tertiary-container font-medium bg-transparent border-b border-transparent focus:border-outline-variant outline-none w-full"
                    placeholder="E.g. Product Design Student"
                  />
                </div>
              </div>
              
              <div className="pt-6 space-y-4 border-t-0 bg-surface-container-low/50 p-6 rounded-DEFAULT">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary-container">school</span>
                  <span className="text-sm font-medium">Stanford University</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary-container">account_balance</span>
                  <span className="text-sm font-medium">Department of Computer Science</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary-container">bar_chart</span>
                  <span className="text-sm font-medium">Level: Junior (Year 3)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-container text-on-primary rounded-lg p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-container mb-4">Curator Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <p className="text-lg font-bold">Vetted Talent</p>
            </div>
            <p className="text-on-primary-container text-sm leading-relaxed">Top 5% of students verified through our portfolio review process.</p>
          </div>
        </section>

        {/* Right Column */}
        <section className="lg:col-span-8 space-y-8">
          <form id="profile-form" onSubmit={handleSave}>
            <div className="flex justify-between items-center mb-4">
              <div className="bg-surface-container-low px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Profile Information</span>
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">{saving ? "progress_activity" : "save"}</span>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-error-container text-on-error-container rounded-lg px-4 py-3 mb-6 text-sm font-bold">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <div className="bg-surface-container-low rounded-lg p-1">
              <div className="bg-surface-container-lowest rounded-DEFAULT p-10 shadow-[0_32px_64px_-4px_rgba(25,28,30,0.04)] border border-outline-variant/10">
                <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">Professional Summary</h2>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-on-surface-variant leading-relaxed text-lg mb-10 max-w-2xl bg-transparent border-b border-outline-variant/30 focus:border-primary-container outline-none resize-none placeholder:text-outline/50 p-2"
                  placeholder="Passionate about the intersection of human-centered design and systemic efficiency..."
                />

                <h3 className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container mb-6">Core Competencies</h3>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {skills.map((s) => (
                    <span key={s} className="px-5 py-2.5 bg-surface-container-low text-primary-container rounded-full font-medium text-sm flex items-center gap-2 group">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="opacity-50 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative mb-12 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    className="w-full bg-surface-container-low border-none rounded-full px-5 py-3 text-sm text-slate-900 placeholder:text-outline focus:ring-2 focus:ring-secondary-container/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-white px-3 py-1.5 rounded-full text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-8 rounded-lg bg-surface-container-low/40 border border-transparent hover:border-outline-variant/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <span className="material-symbols-outlined text-primary-container">description</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-on-tertiary-container bg-surface-container-highest px-2 py-1 rounded">PDF • 2.4 MB</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1 font-headline">Curriculum Vitae</h4>
                    <p className="text-sm text-on-surface-variant mb-6">Updated Sep 2023</p>
                    <div className="flex items-center gap-4">
                      <button type="button" className="text-sm font-bold text-primary-container flex items-center gap-1.5 hover:underline">
                        View File <span className="material-symbols-outlined text-base">open_in_new</span>
                      </button>
                      <button type="button" className="text-sm font-bold text-secondary flex items-center gap-1.5 hover:underline">
                        Replace
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-lg flex flex-col items-center justify-center p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-outline">add</span>
                    </div>
                    <p className="font-bold text-on-surface-variant">Upload Portfolio</p>
                    <p className="text-xs text-outline mt-1">Maximum size 10MB (PDF/ZIP)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-10 mt-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline">Academic Achievement</h3>
                <span className="material-symbols-outlined text-outline">auto_awesome</span>
              </div>
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="w-1 bg-secondary-container h-12 rounded-full"></div>
                  <div>
                    <h5 className="font-bold text-primary-container">Dean's List 2023</h5>
                    <p className="text-sm text-on-surface-variant">Top 10% Academic Standing in School of Engineering</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-1 bg-surface-container-highest h-12 rounded-full"></div>
                  <div>
                    <h5 className="font-bold text-primary-container">Honors Program</h5>
                    <p className="text-sm text-on-surface-variant">Interdisciplinary Design Fellowship Member</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
