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
  "React", "Node.js", "Python", "TypeScript", "Docker",
  "PostgreSQL", "Figma", "AWS", "Flutter", "Java",
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
      // sync name into localStorage so Navbar avatar updates immediately
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

  const strength = profile?.profileStrength ?? 65;

  return (
    <div className="w-full max-w-6xl">

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

      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#006591] mb-2 block">
            Professional Identity
          </span>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-[#1A1B21] font-headline leading-tight">
            Your <span className="text-[#00236F]">Profile.</span>
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-md">
            Keep your profile up to date so employers can find and match you.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            form="profile-form"
            type="submit"
            disabled={saving}
            className="shrink-0 flex items-center gap-2 bg-[#00236F] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#00236F]/80 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#00236F]/20"
          >
            <span className="material-symbols-outlined text-[18px]">{saving ? "progress_activity" : "save"}</span>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8 text-sm text-red-600">
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          {error}
        </div>
      )}

      {/* ── LOADING ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-500 py-16 justify-center">
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          Loading your profile...
        </div>
      )}

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7">

          {/* LEFT COLUMN */}
          <div className="md:col-span-4 space-y-6">
            {/* Profile Identity Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 flex flex-col items-center text-center">
              {/* Avatar with gradient ring */}
              <div className="relative mb-6 group">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#00236F] to-[#006591]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-bold text-[#00236F]">
                      {name ? initials(name) : "U"}
                    </span>
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-[#00236F] text-white p-2.5 rounded-full shadow-lg hover:bg-[#00236F]/80 transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              
              <h3 className="font-headline font-extrabold text-2xl text-[#1A1B21] mb-1">
                {name || "Your Name"}
              </h3>
              <p className="text-sm text-[#006591] font-medium">{headline || "Product Design Student"}</p>
              
              {/* Info Section */}
              <div className="w-full mt-6 pt-6 border-t border-[#F4F3FA] space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="material-symbols-outlined text-[#006591] text-[18px]">school</span>
                  <span className="text-sm font-medium">Stanford University</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="material-symbols-outlined text-[#006591] text-[18px]">account_balance</span>
                  <span className="text-sm font-medium">Computer Science</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="material-symbols-outlined text-[#006591] text-[18px]">bar_chart</span>
                  <span className="text-sm font-medium">Year 3 • Junior</span>
                </div>
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#006591]">Profile Strength</span>
                <span className="text-2xl font-black text-[#1A1B21]">{strength}%</span>
              </div>
              <div className="h-2.5 bg-[#F4F3FA] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    strength >= 80 ? "bg-emerald-500" : strength >= 60 ? "bg-[#006591]" : "bg-red-400"
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {strength < 80 ? "Add education to reach 80%" : "Great profile! Keep it updated."}
              </p>
            </div>

            {/* Curator Status Card */}
            <div className="bg-gradient-to-br from-[#1A1B21] to-[#00236F] rounded-[2rem] p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#006591] mb-3 block">Curator Status</span>
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#006591] text-[20px]">verified</span>
                  <p className="text-lg font-bold">Vetted Talent</p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">
                  Top 5% of design students verified through our portfolio review process.
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#006591]/20 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-[2rem] shadow-sm p-5">
              <p className="text-[10px] uppercase tracking-widest font-black text-[#006591] mb-4">Profile Sections</p>
              <div className="space-y-1">
                {[
                  { label: "Personal details", icon: "person", done: true },
                  { label: "Skills", icon: "token", done: skills.length > 0 },
                  { label: "Bio", icon: "auto_awesome", done: bio.length > 0 },
                  { label: "Education", icon: "school", done: false },
                  { label: "Documents", icon: "description", done: false },
                ].map(({ label, icon, done }) => (
                  <div key={label} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-[#F4F3FA] transition-colors cursor-pointer">
                    <span className={`material-symbols-outlined text-[16px] ${done ? "text-[#006591]" : "text-slate-300"}`}>
                      {done ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className={`text-sm font-medium ${done ? "text-[#1A1B21]" : "text-slate-400"}`}>{label}</span>
                    <span className="material-symbols-outlined text-slate-300 text-[14px] ml-auto">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="md:col-span-8 space-y-6">
            <form id="profile-form" onSubmit={handleSave} className="space-y-6">
              
              {/* Professional Summary Card */}
              <div className="bg-[#F4F3FA] rounded-[2.5rem] p-1.5">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                  <h2 className="font-headline font-bold text-xl text-[#1A1B21] mb-6">Professional Summary</h2>
                  
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Passionate about the intersection of human-centered design and systemic efficiency. Tell employers what drives you and what kind of opportunity you're looking for..."
                    className="w-full bg-[#F4F3FA] border-none rounded-xl px-4 py-3 text-sm text-[#1A1B21] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006591]/20 transition-all resize-none leading-relaxed mb-4"
                  />
                  <p className="text-[10px] text-slate-400 text-right font-medium">{bio.length} / 500</p>
                </div>
              </div>

              {/* Core Competencies / Skills */}
              <div className="bg-[#F4F3FA] rounded-[2.5rem] p-1.5">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline font-bold text-xl text-[#1A1B21]">Core Competencies</h2>
                    <span className="text-[11px] text-slate-400 font-medium">{skills.length} / 20</span>
                  </div>

                  {/* Current skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {skills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#00236F] text-white text-sm font-medium rounded-full hover:bg-red-500 transition-colors group"
                        >
                          {s}
                          <span className="material-symbols-outlined text-[14px] opacity-60 group-hover:opacity-100">close</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="relative mb-5">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      className="w-full bg-[#F4F3FA] border-none rounded-xl px-4 py-3 pr-24 text-sm text-[#1A1B21] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006591]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00236F] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#00236F]/80 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-[#006591] mb-3">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="px-3 py-1.5 bg-[#F4F3FA] text-slate-600 text-xs font-semibold rounded-full hover:bg-[#00236F] hover:text-white transition-all"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-[#F4F3FA] rounded-[2.5rem] p-1.5">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                  <h2 className="font-headline font-bold text-xl text-[#1A1B21] mb-6">Documents & Portfolio</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CV Card */}
                    <div className="group p-6 rounded-2xl bg-[#F4F3FA] hover:bg-[#F4F3FA]/80 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <span className="material-symbols-outlined text-[#00236F] text-xl">description</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 bg-white px-2 py-1 rounded">PDF • 2.4 MB</span>
                      </div>
                      <h4 className="font-bold text-[#1A1B21] mb-1">Curriculum Vitae</h4>
                      <p className="text-xs text-slate-500 mb-4">Updated Sep 2024</p>
                      <div className="flex items-center gap-4">
                        <button type="button" className="text-sm font-bold text-[#1A1B21] flex items-center gap-1 hover:text-[#006591] transition-colors">
                          View <span className="material-symbols-outlined text-base">open_in_new</span>
                        </button>
                        <button type="button" className="text-sm font-bold text-[#006591] hover:text-[#00236F] transition-colors">
                          Replace
                        </button>
                      </div>
                    </div>

                    {/* Upload Portfolio Card */}
                    <div className="border-2 border-dashed border-[#F4F3FA] rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-[#F4F3FA] hover:border-[#006591]/30 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-[#F4F3FA] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#006591]/10 transition-all">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[#006591]">add</span>
                      </div>
                      <p className="font-bold text-[#1A1B21]">Upload Portfolio</p>
                      <p className="text-xs text-slate-400 mt-1">PDF or ZIP (max 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Achievement */}
              <div className="bg-[#F4F3FA] rounded-[2.5rem] p-1.5">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline font-bold text-xl text-[#1A1B21]">Academic Achievement</h2>
                    <span className="material-symbols-outlined text-[#006591]">auto_awesome</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-1 bg-[#006591] h-12 rounded-full"></div>
                      <div>
                        <h5 className="font-bold text-[#1A1B21]">Dean&apos;s List 2024</h5>
                        <p className="text-sm text-slate-500">Top 10% Academic Standing in School of Engineering</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-1 bg-slate-300 h-12 rounded-full"></div>
                      <div>
                        <h5 className="font-bold text-[#1A1B21]">Honors Program</h5>
                        <p className="text-sm text-slate-500">Interdisciplinary Design Fellowship Member</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education — placeholder section */}
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-[#F4F3FA] p-8 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-3xl text-[#F4F3FA] mb-3">school</span>
                <h3 className="font-bold text-[#1A1B21] mb-1">Education</h3>
                <p className="text-sm text-slate-400 mb-4">Add your university, degree, and graduation year.</p>
                <button
                  type="button"
                  className="px-6 py-3 bg-[#F4F3FA] rounded-xl text-sm font-bold text-[#00236F] hover:bg-[#00236F]/10 transition-colors"
                >
                  + Add education
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
