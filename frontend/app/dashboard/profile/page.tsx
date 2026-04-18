"use client";

import React, { useEffect, useState } from "react";
import { getStudentProfile, getUserFriendlyError, updateStudentProfile } from "@/lib/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getStudentProfile>> | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
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
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value) return;
    if (skills.includes(value)) {
      setNewSkill("");
      return;
    }
    if (skills.length >= 20) {
      setError("You can add up to 20 skills.");
      return;
    }
    setError(null);
    setSkills((prev) => [...prev, value]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(getUserFriendlyError(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-xs text-on-primary-container font-medium uppercase tracking-widest mb-4">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-on-surface">Candidate Profile</span>
          </nav>
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-tertiary-container">Candidate Profile</h1>
          <p className="text-outline max-w-md font-medium">Manage your details and keep your profile up to date for better matching.</p>
        </div>
      </div>

      {loading ? <p className="text-sm text-on-surface-variant font-medium">Loading profile...</p> : null}
      {error ? <p className="text-sm text-error font-bold mb-8 flex items-center gap-2"><span className="material-symbols-outlined">error</span> {error}</p> : null}
      {success ? <p className="text-sm text-emerald-700 font-bold mb-8 flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> {success}</p> : null}

      {!loading && (
        <div className="grid grid-cols-12 gap-8 mb-20">
          <div className="col-span-12 md:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-primary-container text-white flex items-center justify-center font-extrabold text-5xl font-headline mb-6">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <h3 className="font-bold font-headline text-2xl text-tertiary-container">{name || "Candidate"}</h3>
              <p className="text-sm text-outline mb-6">{profile?.user.email}</p>
              <div className="w-full h-px bg-surface-container mb-6"></div>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-on-surface-variant">Profile Strength</span>
                  <span className="font-extrabold text-secondary">{profile?.profileStrength || 0}%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full transition-all duration-500" style={{ width: `${profile?.profileStrength || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 bg-surface-container-low rounded-lg p-1.5 shadow-sm">
            <div className="bg-surface-container-lowest h-full rounded-[0.65rem] p-10">
              <form className="space-y-10" onSubmit={handleSave}>
                <section>
                  <h3 className="font-bold font-headline text-lg text-primary mb-6">Personal details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Full name</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Contact Email</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm text-on-surface-variant font-medium"
                        type="email"
                        value={profile?.user.email || ""}
                        disabled
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold font-headline text-lg text-primary mb-6">Technical skills</h3>
                  <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/30">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {skills.length > 0 ? skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="px-4 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold border border-outline-variant/20 flex items-center gap-2 hover:bg-error hover:text-white transition-colors"
                        >
                          {skill}
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      )) : <p className="text-xs text-outline">No skills added yet.</p>}
                    </div>

                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-surface-container-lowest border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                        type="text"
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <button type="button" onClick={addSkill} className="bg-surface-container-high text-on-surface px-4 rounded-lg text-sm font-bold">
                        Add
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold font-headline text-lg text-primary mb-6">Bio</h3>
                  <textarea
                    className="w-full bg-surface-container-low border-none rounded-lg p-5 text-sm focus:ring-2 focus:ring-primary-container transition-all leading-relaxed"
                    rows={6}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <p className="text-[10px] text-outline text-right mt-2 font-medium tracking-wide">{bio.length} / 500 characters</p>
                </section>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-secondary-container text-on-secondary-fixed px-8 py-3 rounded-lg font-bold text-sm hover:scale-[0.98] transition-transform flex items-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  {saving ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
