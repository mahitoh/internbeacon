"use client";

import React, { useEffect, useState } from "react";
import { getCompanyProfile, getUserFriendlyError } from "@/lib/api";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getCompanyProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyProfile();
        if (!mounted) return;
        setProfile(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load company profile"));
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
    <div className="w-full max-w-5xl mx-auto">
      <section className="bg-surface-container-lowest rounded-lg p-8 border border-outline-variant/10">
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-tertiary-container mb-2">Employer Profile</h2>
        {loading ? <p className="text-sm text-on-surface-variant">Loading company profile...</p> : null}
        {error ? <p className="text-sm text-amber-700 font-semibold">{error}</p> : null}

        {profile ? (
          <div className="mt-6 space-y-3 text-sm">
            <p><span className="font-bold">Company:</span> {profile.user.name}</p>
            <p><span className="font-bold">Contact email:</span> {profile.user.email}</p>
            <p><span className="font-bold">Website:</span> {profile.website || "Not set"}</p>
            <p><span className="font-bold">Description:</span> {profile.description || "No description yet"}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
