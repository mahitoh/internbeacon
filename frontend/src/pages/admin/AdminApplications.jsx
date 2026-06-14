import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';

const STATUS_OPTIONS = [
  { value: '',                    label: 'All statuses' },
  { value: 'submitted',           label: 'Submitted' },
  { value: 'under_review',        label: 'Under Review' },
  { value: 'shortlisted',         label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interview_completed', label: 'Interview Completed' },
  { value: 'final_review',        label: 'Final Review' },
  { value: 'accepted',            label: 'Accepted' },
  { value: 'offer_accepted',      label: 'Offer Accepted' },
  { value: 'offer_declined',      label: 'Offer Declined' },
  { value: 'rejected',            label: 'Rejected' },
  { value: 'withdrawn',           label: 'Withdrawn' },
];

const TABS = [
  { key: '',          label: 'All' },
  { key: 'submitted', label: 'New' },
  { key: 'accepted',  label: 'Accepted' },
  { key: 'rejected',  label: 'Rejected' },
];

export default function AdminApplications() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', { status, page }],
    queryFn:  () => adminApi.listApplications({ status: status || undefined, page, limit: 20 }).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  const apps = data?.data || [];
  const meta = data?.meta || { total: 0 };

  const filtered = search.trim()
    ? apps.filter(app => {
        const name    = `${app.student_profiles?.first_name ?? ''} ${app.student_profiles?.last_name ?? ''}`.toLowerCase();
        const title   = (app.internship_offers?.title ?? '').toLowerCase();
        const company = (app.internship_offers?.company_profiles?.company_name ?? '').toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || title.includes(q) || company.includes(q);
      })
    : apps;

  const handleTabChange = (s) => { setStatus(s); setPage(1); };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Applications</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>{meta.total} total applications on the platform</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Quick tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#EFEEE8' }}>
          {TABS.map(t => {
            const isActive = t.key === status && !['under_review','shortlisted','interview_scheduled','interview_completed','final_review','offer_accepted','offer_declined','withdrawn'].includes(status);
            return (
              <button key={t.key} onClick={() => handleTabChange(t.key)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={isActive ? { background: '#1E5B45', color: '#fff' } : { color: '#6B6F69' }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Status select */}
        <select value={status} onChange={e => handleTabChange(e.target.value)}
          className="rounded-xl px-3 py-2 text-xs focus:outline-none appearance-none transition-colors"
          style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#6B6F69' }}
          onFocus={e => e.target.style.borderColor = '#1E5B45'}
          onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-xl px-3 py-2"
          style={{ background: '#fff', border: '1px solid #DDDBD2' }}>
          <Search size={13} style={{ color: '#9A9E97', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student, offer, company…"
            className="flex-1 bg-transparent text-xs focus:outline-none"
            style={{ color: '#1B1D1A' }} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C0BFBA' }}>
              <FileText size={36} className="mb-3 opacity-50" />
              <p className="text-sm">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E7E6DF' }}>
                    {['Student', 'Offer', 'Company', 'Status', 'Applied'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app, i) => (
                    <tr key={app.id} className="transition-colors"
                      style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>
                          {app.student_profiles ? `${app.student_profiles.first_name} ${app.student_profiles.last_name}` : '—'}
                        </p>
                        <p className="text-xs" style={{ color: '#9A9E97' }}>{app.student_profiles?.university}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm" style={{ color: '#6B6F69' }}>{app.internship_offers?.title ?? '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm" style={{ color: '#9A9E97' }}>{app.internship_offers?.company_profiles?.company_name ?? '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs" style={{ color: '#9A9E97' }}>{formatRelativeTime(app.applied_at)}</span>
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
          <p className="text-xs" style={{ color: '#9A9E97' }}>
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}>
              Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= meta.total}
              className="px-3 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
