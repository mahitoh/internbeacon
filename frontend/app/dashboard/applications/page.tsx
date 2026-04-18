"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getStoredUser, getStudentApplications, getUserFriendlyError, type ApplicationModel } from "@/lib/api";

export default function ApplicationTracking() {
  const user = useMemo(() => getStoredUser(), []);
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentApplications();
        if (!mounted) return;
        setApplications(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load applications"));
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
    <div className="w-full max-w-7xl">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary-container mb-4 font-headline">Application Tracker</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">Monitor your real application progress from your InternBeacon backend.</p>
      </header>

      <section className="mb-8 p-6 bg-surface-container-low rounded-xl">
        <p className="text-sm font-semibold text-on-surface-variant">
          Signed in as {user?.name || "Student"}. Total tracked applications: <span className="text-primary-container font-bold">{applications.length}</span>
        </p>
        {loading ? <p className="text-sm mt-2 text-on-surface-variant">Loading applications...</p> : null}
        {error ? <p className="text-sm mt-2 text-amber-700 font-semibold">{error}</p> : null}
      </section>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary-container font-headline">{app.offer.title}</h3>
                <p className="text-sm text-on-surface-variant">{app.offer.company?.user?.name || "Company"} • {app.offer.location || "Remote"}</p>
                <p className="text-xs text-on-surface-variant mt-2">Applied: {new Date(app.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container">Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-primary-fixed">{app.status}</span>
                <Link href={`/internships/${app.offer.id}`} className="text-xs font-bold text-secondary-container hover:underline">Open role</Link>
              </div>
            </div>
          </div>
        ))}

        {!loading && !applications.length ? (
          <div className="bg-surface-container-low p-8 rounded-xl text-center">
            <p className="text-on-surface-variant">No applications found yet.</p>
            <Link href="/listings" className="text-secondary-container font-bold hover:underline">Browse opportunities</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
