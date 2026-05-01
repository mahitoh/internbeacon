"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getStoredUser,
  getStudentProfile,
  getUserFriendlyError,
  persistAuth,
  updateStudentProfile,
} from "@/lib/api";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

const suggestedSkills = [
  "React",
  "TypeScript",
  "Product thinking",
  "Data storytelling",
  "User research",
  "Figma",
];

export default function StudentProfile() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getStudentProfile>> | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setHeadline("Student building practical, high-signal internship applications");
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load profile."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const showSuccess = () => {
    setSuccess(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setSuccess(false), 3000);
  };

  const addSkill = (value = newSkill) => {
    const normalized = value.trim();
    if (!normalized || skills.includes(normalized) || skills.length >= 20) {
      setNewSkill("");
      return;
    }
    setSkills((current) => [...current, normalized]);
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setSkills((current) => current.filter((item) => item !== skill));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
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
      <div className="flex items-center gap-3 py-16 text-sm text-slate-500">
        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`fixed right-6 top-6 z-50 rounded-[22px] bg-slate-950 px-4 py-3 text-white shadow-xl transition-all ${
          success ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-sm font-bold">Profile saved</p>
        <p className="text-xs text-slate-400">Your latest edits are now live.</p>
      </div>

      <StudentPageHeader
        eyebrow="Personal brand"
        title="Profile studio"
        description="Shape the story employers see first. Keep your headline, skills, and summary aligned with the roles you want to unlock."
        actions={
          <>
            <Link
              href="/dashboard/settings"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Open settings
            </Link>
            <Link
              href="/dashboard/resume"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Resume lab
            </Link>
          </>
        }
      />

      <form onSubmit={handleSave} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <StudentPanel className="bg-[linear-gradient(160deg,#0f172a_0%,#111827_100%)] text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/10 text-2xl font-black">
                {name ? initials(name) : "S"}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Student identity
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight">{name || "Your name"}</p>
                <p className="mt-1 text-sm text-slate-300">{headline || "Add a sharp headline"}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Profile strength</span>
                <span className="text-sm font-black text-amber-300">
                  {profile?.profileStrength || 84}%
                </span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-amber-400"
                  style={{ width: `${profile?.profileStrength || 84}%` }}
                />
              </div>
            </div>
          </StudentPanel>

          <StudentPanel>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Suggested focus
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[22px] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-950">Tell one clear career story</p>
                <p className="mt-1 text-sm text-slate-500">
                  Make your headline and summary point toward the same role family.
                </p>
              </div>
              <div className="rounded-[22px] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-950">Use specific skill language</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add the exact tools or domains employers will search for.
                </p>
              </div>
            </div>
          </StudentPanel>
        </div>

        <div className="space-y-6">
          <StudentPanel>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Core profile
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Employer-facing details
                </h2>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>

            {error ? (
              <div className="mt-5 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Headline
                </span>
                <input
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="mt-2 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  placeholder="Product-minded software engineering student"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Summary
              </span>
              <textarea
                rows={6}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none"
                placeholder="Describe the work you enjoy, the value you create, and the kind of internships you want next."
              />
            </label>
          </StudentPanel>

          <StudentPanel>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Skills
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Searchable strengths
                </h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">{skills.length}/20</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={newSkill}
                onChange={(event) => setNewSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => addSkill()}
                className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950"
              >
                Add skill
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </StudentPanel>

          <StudentPanel>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Resume assets
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Materials employers expect
                </h2>
              </div>
              <Link
                href="/dashboard/resume"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Open resume lab
              </Link>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-950">Primary resume</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Keep one polished version ready for tailoring.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Ready
                  </span>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
                  >
                    Replace
                  </button>
                </div>
              </div>

              <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-bold text-slate-950">Portfolio or work sample</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add case studies, project decks, or a portfolio file when relevant.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950"
                >
                  Upload asset
                </button>
              </div>
            </div>
          </StudentPanel>
        </div>
      </form>
    </div>
  );
}
