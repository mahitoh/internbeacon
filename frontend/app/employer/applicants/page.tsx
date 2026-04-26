"use client";

import React, { useEffect, useState } from "react";
import { getCompanyApplicants, getUserFriendlyError, updateApplicationStatus, type ApplicantModel } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED"] as const;

export default function ManageApplicants() {
  const [applicants, setApplicants] = useState<ApplicantModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyApplicants();
        if (!mounted) return;
        setApplicants(data);
      } catch (err) {
        if (!mounted) return;
        setError(getUserFriendlyError(err, "Could not load applicants"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onStatusChange = async (id: string, status: ApplicantModel["status"]) => {
    try {
      await updateApplicationStatus(id, status);
      setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(getUserFriendlyError(err, "Failed to update status"));
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-on-primary-fixed font-headline">Applicant Queue</h2>
        <p className="text-on-surface-variant">Backend-connected applicants with live status updates.</p>
      </header>

      {loading ? <p className="text-sm text-on-surface-variant">Loading applicants...</p> : null}
      {error ? <p className="text-sm text-amber-700 font-semibold mb-4">{error}</p> : null}

      <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-on-tertiary-container border-b border-surface-container-low">
                <th className="px-8 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Offer</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {(Array.isArray(applicants) ? applicants : []).map((app) => (
                <tr key={app.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-semibold text-on-primary-fixed">{app.student.user.name}</td>
                  <td className="px-6 py-5 text-sm text-on-surface">{app.student.user.email}</td>
                  <td className="px-6 py-5 text-sm text-on-surface">{app.offer.title}</td>
                  <td className="px-6 py-5">
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value as ApplicantModel["status"])}
                      className="bg-surface-container border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-container cursor-pointer transition-shadow"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !(Array.isArray(applicants) ? applicants : []).length ? (
        <div className="bg-surface-container-low p-8 rounded-lg mt-6">
          <p className="text-on-surface-variant">No applicants found.</p>
        </div>
      ) : null}
    </div>
  );
}
