import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';

const STATUS_OPTIONS = [
  { value: '',                  label: 'All statuses' },
  { value: 'submitted',         label: 'Submitted' },
  { value: 'under_review',      label: 'Under Review' },
  { value: 'shortlisted',       label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'final_review',      label: 'Final Review' },
  { value: 'accepted',          label: 'Accepted' },
  { value: 'offer_accepted',    label: 'Offer Accepted' },
  { value: 'offer_declined',    label: 'Offer Declined' },
  { value: 'rejected',          label: 'Rejected' },
  { value: 'withdrawn',         label: 'Withdrawn' },
];

// Quick-filter tabs for the most common admin use cases
const TABS = [
  { key: '',          label: 'All' },
  { key: 'submitted', label: 'New' },
  { key: 'accepted',  label: 'Accepted' },
  { key: 'rejected',  label: 'Rejected' },
];

export default function AdminApplications() {
  const [status,  setStatus]  = useState('');
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', { status, page }],
    queryFn:  () => adminApi.listApplications({ status: status || undefined, page, limit: 20 }).then(r => r.data),
    keepPreviousData: true,
  });

  const apps = data?.data || [];
  const meta = data?.meta || { total: 0 };

  // Client-side search filter on the current page
  const filtered = search.trim()
    ? apps.filter(app => {
        const name = `${app.student_profiles?.first_name ?? ''} ${app.student_profiles?.last_name ?? ''}`.toLowerCase();
        const title = (app.internship_offers?.title ?? '').toLowerCase();
        const company = (app.internship_offers?.company_profiles?.company_name ?? '').toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || title.includes(q) || company.includes(q);
      })
    : apps;

  const handleTabChange = (s) => { setStatus(s); setPage(1); };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">{meta.total} total applications on the platform</p>
      </div>

      {/* Quick-filter tabs + status dropdown + search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick tabs */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => handleTabChange(t.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                t.key === status && !['under_review','shortlisted','interview_scheduled','interview_completed','final_review','offer_accepted','offer_declined','withdrawn'].includes(status)
                  ? 'bg-lime-500 text-white'
                  : 'text-white/40 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Full status select */}
        <select
          value={status}
          onChange={e => handleTabChange(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-500/50 appearance-none"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
          ))}
        </select>

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2">
          <Search size={13} className="text-white/30 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student, offer, company…"
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <FileText size={36} className="mb-3" />
              <p className="text-sm">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Student', 'Offer', 'Company', 'Status', 'Applied'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-medium">
                          {app.student_profiles
                            ? `${app.student_profiles.first_name} ${app.student_profiles.last_name}`
                            : '—'}
                        </p>
                        <p className="text-white/40 text-xs">{app.student_profiles?.university}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/70 text-sm">{app.internship_offers?.title ?? '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/50 text-sm">
                          {app.internship_offers?.company_profiles?.company_name ?? '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/40">{formatRelativeTime(app.applied_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {meta.total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= meta.total}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
