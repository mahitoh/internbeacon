"use client";

import React, { useEffect, useState } from "react";
import {
  getStudentProfile,
  getUserFriendlyError,
  updateStudentProfile,
  persistAuth,
  getStoredUser,
} from "@/lib/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getStudentProfile>> | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStudentProfile();
        if (!mounted) return;
        setProfile(data);
        setName(data.user.name || "");
        setBio(data.bio || "");
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load profile"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3500);
    return () => clearTimeout(t);
  }, [success]);

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value) return;
    if (skills.includes(value)) { setNewSkill(""); return; }
    if (skills.length >= 20) { setError("You can add up to 20 skills."); return; }
    setError(null);
    setSkills((prev) => [...prev, value]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const updated = await updateStudentProfile({
        name: name.trim(),
        bio: bio.trim(),
        skills,
      });
      setProfile(updated);
      setName(updated.user.name || "");
      setBio(updated.bio || "");
      setSkills(updated.skills || []);

      // ── KEY FIX: sync updated name back into localStorage so Navbar reflects it ──
      const stored = getStoredUser();
      if (stored) {
        persistAuth({
          user: { ...stored, name: updated.user.name || stored.name },
          token: localStorage.getItem("internbeacon_token") || "",
          refreshToken: localStorage.getItem("internbeacon_refresh_token") || "",
        });
      }

      setSuccess(true);
    } catch (err) {
      setError(getUserFriendlyError(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Success toast */}
      {success && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-on-primary-fixed text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <div>
            <p className="font-bold text-sm">Profile updated</p>
            <p className="text-xs text-slate-400">Your changes have been saved.</p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-2 block font-headline">
              Account
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-primary-fixed font-headline mb-1">
              Your Profile
            </h1>
            <p className="text-on-surface-variant max-w-md text-sm">
              Manage your personal info, skills, and bio that employers will see.
            </p>
          </div>
          <button
            form="student-profile-form"
            type="submit"
            disabled={saving}
            className="shrink-0 flex items-center gap-2 bg-on-primary-fixed text-white px-7 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-sm text-on-surface-variant py-12 justify-center">
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            Loading your profile...
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-2 mb-8 bg-red-50 px-4 py-3 rounded-xl">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </p>
        )}

        {!loading && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left column */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              {/* Avatar card */}
              <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
                <div className="w-24 h-24 rounded-full bg-on-primary-fixed flex items-center justify-center text-white font-extrabold text-3xl font-headline mb-5 shadow-lg">
                  {name ? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join("") : "U"}
                </div>
                <h3 className="font-bold font-headline text-xl text-on-primary-fixed mb-1">
                  {name || "Your Name"}
                </h3>
                <p className="text-xs text-outline mb-6">Software Engineering Student</p>

                <div className="w-full">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-amber-500">hotel_class</span>
                      Profile strength
                    </span>
                    <span className="font-extrabold text-secondary">{profile?.profileStrength || 65}%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-container h-full transition-all duration-700"
                      style={{ width: `${profile?.profileStrength || 65}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-outline text-left mt-2">
                    Add your education to reach 80%
                  </p>
                </div>
              </div>

              {/* Status card */}
              <div className="bg-on-primary-fixed rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="font-bold text-sm font-headline">Actively looking</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                  Your profile is visible to employers targeting your skill set.
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-2.5 rounded-xl text-xs font-bold">
                  Manage visibility
                </button>
              </div>
            </div>

            {/* Right column — form */}
            <div className="col-span-12 md:col-span-8">
              <form id="student-profile-form" className="space-y-8" onSubmit={handleSave}>

                {/* Personal details */}
                <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                    </div>
                    <h3 className="font-bold font-headline text-on-primary-fixed">Personal details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2">
                        Full name
                      </label>
                      <input
                        className="w-full bg-surface-container-low rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-on-primary-fixed/20 transition-all"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2">
                        Email
                      </label>
                      <input
                        className="w-full bg-surface-container-low rounded-xl px-4 py-3.5 text-sm outline-none text-on-surface-variant cursor-not-allowed opacity-70"
                        type="email"
                        value={profile?.user.email || ""}
                        disabled
                      />
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">token</span>
                    </div>
                    <h3 className="font-bold font-headline text-on-primary-fixed">Skills</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5 min-h-[2rem]">
                    {skills.length === 0 && (
                      <p className="text-xs text-outline">No skills yet — add one below.</p>
                    )}
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container text-on-surface-variant text-xs font-bold rounded-full border border-outline-variant/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors group"
                      >
                        {skill}
                        <span className="material-symbols-outlined text-[11px] opacity-50 group-hover:opacity-100">close</span>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low rounded-xl px-4 py-3.5 pr-20 text-sm outline-none focus:ring-2 focus:ring-on-primary-fixed/20 transition-all placeholder:text-outline"
                      type="text"
                      placeholder="Add a skill (e.g. React, Python, Figma) and press Enter"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-on-primary-fixed text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </section>

                {/* Bio */}
                <section className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">auto_awesome</span>
                    </div>
                    <h3 className="font-bold font-headline text-on-primary-fixed">Bio</h3>
                  </div>

                  <textarea
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-on-primary-fixed/20 transition-all leading-relaxed resize-none placeholder:text-outline"
                    placeholder="Tell employers what drives you and what you're looking for..."
                    rows={5}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <p className="text-[10px] text-outline text-right mt-1.5">{bio.length} / 500</p>
                </section>

              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
