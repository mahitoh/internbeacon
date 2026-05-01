"use client";

import React, { useEffect, useState } from "react";
import { getStudentRecommendations, getUserFriendlyError, mapOfferToInternship, type OfferApiModel } from "@/lib/api";
import Link from "next/link";

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
        // We'll keep the load logic, but show demo data below as requested
        const recs = await getStudentRecommendations();
        if (!mounted) return;
        setOffers(Array.isArray(recs) ? recs : []);
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

  return (
    <div className="w-full">
      <section className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Curated Matches</h2>
        <p className="text-on-primary-container font-medium">AI-driven recommendations based on your student profile and applications.</p>
      </section>

      {loading ? <p className="text-sm text-on-surface-variant mb-6">Loading recommendations...</p> : null}
      {error ? <p className="text-sm text-error mb-6">{error}</p> : null}

      {!loading && offers.length === 0 ? (
        <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8">
          <h3 className="font-bold text-lg mb-2">No recommendations yet</h3>
          <p className="text-sm text-on-surface-variant">Complete your profile and apply to more roles to improve matching.</p>
        </div>
      ) : null}

      <div className="grid gap-6">
        {offers.map((offer) => {
          const internship = mapOfferToInternship(offer);
          return (
            <article key={offer.id} className="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">{internship.title}</h3>
                  <p className="text-on-surface-variant">{internship.company} • {internship.location}</p>
                  <p className="text-sm text-on-surface mt-3 line-clamp-2">{internship.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {internship.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-surface-container-low rounded-full text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/offers/${offer.id}`} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold w-fit">
                  View Role
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
