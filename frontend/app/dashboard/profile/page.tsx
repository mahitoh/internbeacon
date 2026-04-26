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

      {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
            Account
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
            Your Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-md">
            Keep your profile up to date so employers can find and match you.
          </p>
        </div>
        <button
          form="profile-form"
          type="submit"
          disabled={saving}
          className="shrink-0 flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">{saving ? "progress_activity" : "save"}</span>
          {saving ? "Saving..." : "Save changes"}
        </button>
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

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="md:col-span-4 space-y-5">

            {/* Identity card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-2xl mb-5 shadow-lg shadow-slate-900/20 select-none">
                {name ? initials(name) : "U"}
              </div>
              <h3 className="font-bold text-xl text-slate-900 font-headline mb-0.5">
                {name || "Your Name"}
              </h3>
              <p className="text-xs text-slate-400 mb-1">{headline || "Software Engineering Student"}</p>
              <p className="text-xs text-slate-400 mb-6">{profile?.user.email || ""}</p>

              <div className="w-full border-t border-slate-50 pt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">hotel_class</span>
                    Profile strength
                  </span>
                  <span className="font-black text-slate-900">{strength}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      strength >= 80 ? "bg-emerald-500" : strength >= 60 ? "bg-amber-500" : "bg-red-400"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-left">
                  {strength < 80 ? "Add education to reach 80%" : "Great profile! Keep it updated."}
                </p>
              </div>
            </div>

            {/* Status card */}
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-[50px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Actively looking</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-5">
                  Your profile is visible to employers targeting your skill set.
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-xs font-bold text-white transition-colors">
                  Manage visibility
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">Profile sections</p>
              <div className="space-y-1">
                {[
                  { label: "Personal details", icon: "person",        done: true  },
                  { label: "Skills",           icon: "token",         done: skills.length > 0 },
                  { label: "Bio",              icon: "auto_awesome",  done: bio.length > 0    },
                  { label: "Education",        icon: "school",        done: false },
                  { label: "Documents",        icon: "description",   done: false },
                ].map(({ label, icon, done }) => (
                  <div key={label} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className={`material-symbols-outlined text-[16px] ${done ? "text-emerald-500" : "text-slate-300"}`}>
                      {done ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className={`text-sm font-medium ${done ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                    <span className="material-symbols-outlined text-slate-300 text-[14px] ml-auto">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: FORM ────────────────────────────────────────── */}
          <div className="md:col-span-8 space-y-5">
            <form id="profile-form" onSubmit={handleSave} className="space-y-5">

              {/* Personal details */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">person</span>
                  </div>
                  <h3 className="font-bold text-slate-900 font-headline">Personal details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.user.email || ""}
                      disabled
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                      Professional headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Final-year Software Engineering student at ICT University"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">token</span>
                    </div>
                    <h3 className="font-bold text-slate-900 font-headline">Skills</h3>
                  </div>
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-red-500 transition-colors group"
                      >
                        {s}
                        <span className="material-symbols-outlined text-[11px] opacity-60 group-hover:opacity-100">close</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 pr-20 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
                  >
                    Add
                  </button>
                </div>

                {/* Suggestions */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2.5">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">auto_awesome</span>
                  </div>
                  <h3 className="font-bold text-slate-900 font-headline">Bio</h3>
                </div>

                <textarea
                  rows={5}
                  maxLength={500}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell employers what drives you, what you're working on, and what kind of opportunity you're looking for..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all resize-none leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">{bio.length} / 500</p>
              </div>

              {/* Education — placeholder section */}
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-7 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-3xl text-slate-200 mb-3">school</span>
                <h3 className="font-bold text-slate-700 mb-1">Education</h3>
                <p className="text-sm text-slate-400 mb-4">Add your university, degree, and graduation year.</p>
                <button
                  type="button"
                  className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
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
