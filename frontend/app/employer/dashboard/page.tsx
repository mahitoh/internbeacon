"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCompanyOffers, getUserFriendlyError, type OfferApiModel } from "@/lib/api";

export default function EmployerDashboard() {
  const [offers, setOffers] = useState<OfferApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyOffers();
        if (!mounted) return;
        setOffers(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load company offers"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const safeOffers = Array.isArray(offers) ? offers : [];
  const totalApplicants = safeOffers.reduce((sum, offer) => sum + (offer.applications?.length || 0), 0);

  return (
    <div className="w-full">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-primary-fixed mb-2 font-headline">Command Center</h2>
          <p className="text-on-surface-variant font-medium max-w-lg">Live view of your backend-powered internship postings and pipeline.</p>
        </div>
        <Link href="/employer/post" className="bg-primary-container text-white font-bold px-8 py-3 rounded-xl transition-all hover:opacity-90 inline-flex items-center gap-2 shadow-lg shadow-primary-container/10">
          <span className="material-symbols-outlined">add</span>
          Post Internship
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10">
          <p className="text-xs uppercase tracking-widest font-bold text-outline">Active Roles</p>
          <h3 className="text-4xl font-extrabold font-headline">{safeOffers.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10">
          <p className="text-xs uppercase tracking-widest font-bold text-outline">Total Applicants</p>
          <h3 className="text-4xl font-extrabold font-headline">{totalApplicants}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10">
          <p className="text-xs uppercase tracking-widest font-bold text-outline">Avg per Role</p>
          <h3 className="text-4xl font-extrabold font-headline">{safeOffers.length ? Math.round(totalApplicants / safeOffers.length) : 0}</h3>
        </div>
      </section>

      {loading ? <p className="text-sm text-on-surface-variant">Loading offers...</p> : null}
      {error ? <p className="text-sm text-amber-700 font-semibold mb-4">{error}</p> : null}

      <section className="space-y-4">
        {safeOffers.map((offer) => (
          <article key={offer.id} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-on-primary-fixed font-headline">{offer.title}</h3>
                <p className="text-sm text-on-surface-variant">{offer.location || "Remote"} • {offer.category || "General"}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container">Applicants: {offer.applications?.length || 0}</span>
                <Link href="/employer/applicants" className="text-xs font-bold text-secondary-container hover:underline">View applicants</Link>
              </div>
            </div>
          </article>
        ))}

        {!loading && !safeOffers.length ? (
          <div className="bg-surface-container-low p-8 rounded-lg">
            <p className="text-on-surface-variant">No offers posted yet.</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
