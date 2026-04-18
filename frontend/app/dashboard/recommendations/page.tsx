"use client";

import React, { useEffect, useState } from "react";
import { getStudentRecommendations, getUserFriendlyError, mapOfferToInternship, type OfferApiModel } from "@/lib/api";

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

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Curated Matches</h2>
        <p className="text-on-primary-container font-medium">AI-driven recommendations based on your architectural portfolio and technical stack.</p>
      </section>

      {loading ? <p className="text-sm text-on-surface-variant mb-6">Loading recommendations...</p> : null}

      {/* Matches Grid - DEMO DATA INJECTED AS REQUESTED */}
      <div className="grid asymmetric-grid gap-8">
        {/* Match Card 1 */}
        <article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>bolt</span>
              98% Match
            </span>
          </div>
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-lg text-white">
              <span className="material-symbols-outlined text-3xl" data-icon="architecture">architecture</span>
            </div>
            <div>
              <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-1">Featured Boutique</p>
              <h3 className="text-xl font-bold text-primary">Senior Design Lead</h3>
              <p className="text-on-surface-variant font-medium">Studio Vertigo • Copenhagen</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Leading sustainable architecture firm seeking a visionary intern to support our 2024 Nordic Pavilion submission.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Parametric Design</span>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Rhino 3D</span>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Sustainable Materials</span>
            </div>
          </div>
          <div className="pt-6 border-t border-surface-container-low">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                <img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="close-up portrait of a recruiter" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMShuskqpa-T_tGcgThM1eSN-jXObJahoKo4StDmXOwNAptMapMvnd4MiPNicJrer-zEFLV4ALWBHEJBK7QOEY5FuiH5Yxg5-kDnn7Gv0XAYugUSzNWBTo2kOHmSskIBgHmDovuV8Rx-1SUwSZ5aas9ym8GU9gHoy97rdW3u2lWdN2B4RW8Ieu8A-McueNHm3xav5XrXjXxpb7oNKTTVRDlMThCaBM1XOEn-ymYOyJJYSo5PhmMPJPYz_zLGeazk2Yo-dkf8kYIME"/>
                <div className="pl-4 text-[11px] text-on-tertiary-container">Matched with your "Eco-Pod" project</div>
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
            </div>
          </div>
        </article>

        {/* Match Card 2 */}
        <article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="px-3 py-1.5 bg-surface-container-high text-primary text-xs font-bold rounded-full">
              92% Match
            </span>
          </div>
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-secondary-container flex items-center justify-center rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl" data-icon="urban_density">high_density</span>
            </div>
            <div>
              <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-1">Elite Opportunity</p>
              <h3 className="text-xl font-bold text-primary">Urban Systems Intern</h3>
              <p className="text-on-surface-variant font-medium">Metropoli Global • London</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Focus on transit-oriented development and data-driven urban planning for smart city initiatives.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">GIS Analysis</span>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Python</span>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Smart Transit</span>
            </div>
          </div>
          <div className="pt-6 border-t border-surface-container-low">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                <img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="professional woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JXT856hl79FXz8_8Pa3egmPVd_rp_XsFzeb2l1foKxOc0uvErHDqSBUwel-e8zBrUnAy2dOMpp3Hi_Mq69ybcOCbAtzW4i8Qo73aWaB9duxrKeRBWKYaHb9cT9g5mp5Q0n5Zhg6ASHQLXhmsCvN8zt6At5C1Omm74VACmT6Qiz11ApifRdsePVC6iQeI9O_vkKLG_kNLCk1hxzZjSuQIJGQ_wwWwHXKIQ73O7CuCtSNz4AyCByfrMkOZaO718-xn-tholKyiqT8"/>
                <div className="pl-4 text-[11px] text-on-tertiary-container">Top 5% candidate for this role</div>
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
            </div>
          </div>
        </article>

        {/* Match Card 3 */}
        <article className="bg-surface-container-lowest rounded-lg p-8 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="px-3 py-1.5 bg-surface-container-high text-primary text-xs font-bold rounded-full">
              89% Match
            </span>
          </div>
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-tertiary-container flex items-center justify-center rounded-lg text-white">
              <span className="material-symbols-outlined text-3xl" data-icon="history_edu">history_edu</span>
            </div>
            <div>
              <p className="text-on-tertiary-container text-xs font-bold tracking-widest uppercase mb-1">Cultural Sector</p>
              <h3 className="text-xl font-bold text-primary">Heritage Restorer</h3>
              <p className="text-on-surface-variant font-medium">The Archive Agency • Paris</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Bridge the gap between classical masonry and modern digital scanning in the heart of historic Paris.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Conservation</span>
              <span className="px-3 py-1 bg-surface-container-low text-on-surface text-[11px] font-semibold rounded-full border-0">Photogrammetry</span>
            </div>
          </div>
          <div className="pt-6 border-t border-surface-container-low">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                <img alt="Recruiter" className="w-8 h-8 rounded-full ring-2 ring-white" data-alt="professional workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFAa1_D1SutCKpbQL3aGv9Lt8KPrGypJcO8iOefJC2bcQvlbc2gUvXmMZQCzWAIEyhENpdBxgPG25W65NDroBf0yfl7o5PUkJFKMeKOSnEJO3a_fGmsJ0VbsCkPjlEMJghNxhnkI85mnz6nsfpirdpLO5Qc2A6Qa9ApPHw4fh4Tj5g1cqwqRqe7bTIwRcEgIfr05ZliChe4vtB8Csvft-nFb2F45FJ8KHQ6GnS2z1FlQ62FlgXyM4xv8iQe2WAwCZDlHK0l_y3SgA"/>
                <div className="pl-4 text-[11px] text-on-tertiary-container">Relevant "Modern Ruins" research</div>
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 duration-150">
                Apply Now
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Curator Insight Banner */}
      <div className="mt-12 pb-12">
        <div className="bg-primary-container rounded-lg p-10 flex flex-col md:flex-row items-center gap-10 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <span className="material-symbols-outlined text-[200px]" data-icon="stars">stars</span>
          </div>
          <div className="flex-1 z-10">
            <h4 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs mb-4">Curator Insight</h4>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Your skills in "Parametric Design" are currently trending with top firms in Scandinavia.</h2>
            <p className="text-on-primary-container max-w-lg mb-0">Our AI has detected a 40% increase in demand for these specific competencies since last quarter. Consider highlighting your Rhino projects on your dashboard.</p>
          </div>
          <div className="flex-shrink-0 z-10">
            <button className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-amber-500/20 active:scale-95">
              View Skill Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
