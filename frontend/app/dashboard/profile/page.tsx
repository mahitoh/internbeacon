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
    <>
      {success ? (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-4 bg-primary-container text-white px-6 py-4 rounded-xl shadow-2xl">
          <span className="material-symbols-outlined text-secondary-container">check_circle</span>
          <div>
            <p className="font-bold text-sm">Profile Updated</p>
            <p className="text-xs text-on-primary-container">Your changes have been saved to your portfolio.</p>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-5xl">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-xs text-on-primary-container font-medium uppercase tracking-widest mb-4">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-on-surface">Candidate Profile</span>
            </nav>
            <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-tertiary-container">Candidate Profile</h1>
            <p className="text-outline max-w-md font-medium">Manage your personal brand, highlight your technical arsenal, and connect with top-tier curators.</p>
          </div>
          <button form="student-profile-form" type="submit" disabled={saving} className="bg-secondary-container text-on-secondary-fixed px-8 py-3 rounded-lg font-bold text-sm hover:scale-[0.98] transition-transform flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-lg">save</span>
            {saving ? "Saving..." : "Update Portfolio"}
          </button>
        </div>

        {loading ? <p className="text-sm text-on-surface-variant font-medium">Authenticating identity and loading portfolio...</p> : null}
        {error ? <p className="text-sm text-error font-bold mb-8 flex items-center gap-2"><span className="material-symbols-outlined">error</span> {error}</p> : null}

        {!loading && (
          <div className="grid grid-cols-12 gap-8 mb-20">
            <div className="col-span-12 md:col-span-4 space-y-8">
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/20 flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-primary-container text-white flex items-center justify-center font-extrabold text-5xl font-headline">
                     {name ? name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="absolute inset-0 bg-primary-container/80 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                  </div>
                </div>
                <h3 className="font-bold font-headline text-2xl text-tertiary-container">{name || "Candidate"}</h3>
                <p className="text-sm text-outline mb-6">Software Engineering Intern</p>
                
                <div className="w-full h-px bg-surface-container mb-6"></div>
                
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-amber-500">hotel_class</span>
                      Profile Strength
                    </span>
                    <span className="font-extrabold text-secondary">{profile?.profileStrength || 65}%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary-container h-full transition-all duration-1000 ease-out" style={{ width: `${profile?.profileStrength || 65}%` }}></div>
                  </div>
                  <p className="text-[10px] text-outline text-left">Add your education history to reach 80%</p>
                </div>
              </div>

              <div className="bg-primary-container p-8 rounded-lg text-white shadow-lg shadow-primary-container/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <h4 className="font-bold font-headline text-lg">Actively Looking</h4>
                </div>
                <p className="text-xs text-on-primary-container leading-relaxed mb-6">Your profile is visible to standard and premium employers targeting your specific skill sets.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-2.5 rounded-lg text-xs font-bold font-headline">Manage Visibility</button>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 bg-surface-container-low rounded-lg p-1.5 shadow-sm">
              <div className="bg-surface-container-lowest h-full rounded-[0.65rem] p-10">
                <form id="student-profile-form" className="space-y-12" onSubmit={handleSave}>
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg text-primary">person</span>
                      </span>
                      <h3 className="font-bold font-headline text-lg text-primary">Personal details</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Full legal name</label>
                        <input className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Contact Email</label>
                        <input className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all text-on-surface-variant font-medium" type="email" value={profile?.user.email || ""} disabled />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-2 ml-1">Professional Headline</label>
                        <input className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-container transition-all" type="text" placeholder="e.g. CS Student @ Stanford | Driven by Full-Stack Systems..." defaultValue="Computer Science Major | Aspiring Systems Engineer" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg text-primary">token</span>
                      </span>
                      <h3 className="font-bold font-headline text-lg text-primary">Technical Arsenal</h3>
                    </div>
                    
                    <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/30">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {skills.length > 0 ? (
                          skills.map((skill, i) => (
                            <button key={skill + i} type="button" onClick={() => removeSkill(skill)} className="px-4 py-2 bg-surface-container-lowest text-primary rounded-full text-xs font-bold shadow-sm border border-outline-variant/20 flex items-center gap-2 group cursor-pointer hover:bg-error hover:text-white transition-colors">
                              {skill}
                              <span className="material-symbols-outlined text-[12px] opacity-50 group-hover:opacity-100">close</span>
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-outline">No skills added yet. Add your first skill below.</p>
                        )}
                      </div>
                      
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">add</span>
                        <input
                          className="w-full bg-surface-container-lowest border-none rounded-lg p-4 pl-12 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                          type="text"
                          placeholder="Type a skill and hit Enter to add... (e.g. Docker, Figma, Python...)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
                      </span>
                      <h3 className="font-bold font-headline text-lg text-primary">Candidate Manifesto & Bio</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <textarea
                        className="w-full bg-surface-container-low border-none rounded-lg p-5 text-sm focus:ring-2 focus:ring-primary-container transition-all leading-relaxed"
                        placeholder="Tell your story. What drives you? What are you looking to achieve in your career?"
                        rows={6}
                        maxLength={500}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                      <p className="text-[10px] text-outline text-right mt-2 font-medium tracking-wide">{bio.length} / 500 characters</p>
                    </div>
                  </section>
                  
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
