"use client";

import React, { useEffect, useState } from "react";
import { getStudentProfile } from "@/lib/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getStudentProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentProfile();
        if (!mounted) return;
        setProfile(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Could not load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tighter text-primary-container leading-none mb-2 font-headline">Student Profile</h1>
        {loading ? <p className="text-sm text-on-surface-variant">Loading profile...</p> : null}
        {error ? <p className="text-sm text-amber-700 font-semibold">{error}</p> : null}

        {profile ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm"><span className="font-bold">Name:</span> {profile.user.name}</p>
            <p className="text-sm"><span className="font-bold">Email:</span> {profile.user.email}</p>
            <p className="text-sm"><span className="font-bold">Bio:</span> {profile.bio || "No bio yet"}</p>
            <p className="text-sm"><span className="font-bold">Skills:</span> {profile.skills.length ? profile.skills.join(", ") : "No skills yet"}</p>
            <p className="text-sm"><span className="font-bold">Profile strength:</span> {profile.profileStrength}%</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
