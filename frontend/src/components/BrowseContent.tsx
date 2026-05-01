"use client";

import React, { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { getOffers, getUserFriendlyError, mapOfferToInternship } from "@/lib/api";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import type { Internship } from "@/types";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPanel } from "@/components/student/StudentPanel";

const categories = ["Technology", "Design & Creative", "Marketing", "Finance", "Operations"];

export default function BrowseContent() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Technology"]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const offers = await getOffers();
        if (!mounted) return;
        const mapped = offers.map(mapOfferToInternship);
        setInternships(mapped.length ? mapped : MOCK_INTERNSHIPS);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err));
        setInternships(MOCK_INTERNSHIPS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const filtered = useMemo(() => {
    return internships.filter((internship) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        internship.title.toLowerCase().includes(q) ||
        internship.company.toLowerCase().includes(q) ||
        internship.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategories.length === 0 ||
        internship.tags.some((tag) => selectedCategories.includes(tag));

      const matchesLocation =
        !location || internship.location.toLowerCase().includes(location.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [internships, location, query, selectedCategories]);

  return (
    <div className="w-full">
      <StudentPageHeader
        eyebrow="Discover"
        title="Find internships that fit your direction"
        description="Search live roles, filter by signal, and move quickly from discovery into role review, resume tailoring, and application tracking."
        actions={
          <NextLink
            href="/dashboard/saved"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
          >
            Open saved roles
          </NextLink>
        }
      />

      <StudentPanel>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr_0.8fr]">
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none"
            placeholder="Search by role, company, or skill"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none"
            placeholder="Location or Remote"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          <button className="rounded-full bg-slate-950 px-5 py-4 text-sm font-bold text-white">
            Search roles
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </StudentPanel>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <StudentPanel key={index} className="animate-pulse">
              <div className="h-6 w-24 rounded bg-slate-100" />
              <div className="mt-5 h-7 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
              <div className="mt-6 h-20 rounded bg-slate-100" />
            </StudentPanel>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((item, index) => (
            <StudentPanel key={item.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                  {item.company.charAt(0)}
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  {index % 3 === 0 ? "New" : "Recommended"}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-black tracking-tight text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {item.company} • {item.location}
              </p>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Compensation
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{item.stipend}</p>
                </div>
                <NextLink
                  href={`/internships/${item.id}`}
                  className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
                >
                  View role
                </NextLink>
              </div>
            </StudentPanel>
          ))
        ) : (
          <StudentPanel className="md:col-span-2 xl:col-span-3 text-center">
            <h2 className="text-xl font-black tracking-tight text-slate-950">No matching roles right now</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try fewer filters or a broader keyword to widen the result set.
            </p>
          </StudentPanel>
        )}
      </div>

      {error ? (
        <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          Showing fallback opportunities because live listings were unavailable: {error}
        </div>
      ) : null}
    </div>
  );
}
