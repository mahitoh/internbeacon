"use client";

import React, { useEffect, useState } from "react";
import { getStudentRecommendations, getUserFriendlyError, mapOfferToInternship, type OfferApiModel } from "@/lib/api";
import InternshipCard from "@/components/InternshipCard";

export default function RecommendationsPage() {
  const [offers, setOffers] = useState<OfferApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const recs = await getStudentRecommendations();
        if (!mounted) return;
        setOffers(recs);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load recommendations"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const internships = offers.map(mapOfferToInternship);

  return (
    <div className="w-full">
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Curated Matches</h2>
        <p className="text-on-primary-container font-medium">AI-driven recommendations powered by your backend match data.</p>
      </section>

      {loading ? <p className="text-sm text-on-surface-variant">Loading recommendations...</p> : null}
      {error ? <p className="text-sm text-amber-700 font-semibold mb-6">{error}</p> : null}

      {!loading && internships.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      ) : null}

      {!loading && !internships.length ? (
        <div className="bg-surface-container-low rounded-lg p-8">
          <p className="text-on-surface-variant">No recommendations yet. Complete your profile and apply to roles to improve matching quality.</p>
        </div>
      ) : null}
    </div>
  );
}
