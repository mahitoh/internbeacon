import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const STATUSES = ['', 'open', 'closed', 'draft'];

export default function AdminOffers() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-offers', { status, page }],
    queryFn:  () => adminApi.listOffers({ status: status || undefined, page, limit: 20 }).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  const offers = data?.data || [];
  const meta   = data?.meta || { total: 0 };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => adminApi.setOfferStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-offers'] }); toast.success('Offer status updated'); },
    onError:   () => toast.error('Failed to update offer'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteOffer(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-offers'] }); toast.success('Offer deleted'); },
    onError:   () => toast.error('Failed to delete offer'),
  });

  const toggleStatus = (offer) => {
    statusMutation.mutate({ id: offer.id, status: offer.status === 'open' ? 'closed' : 'open' });
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Offers</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>{meta.total} total internship posts</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: '#EFEEE8' }}>
        {STATUSES.map(s => {
          const isActive = s === status;
          return (
            <button key={s || 'all'} onClick={() => { setStatus(s); setPage(1); }}
              className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
              style={isActive
                ? { background: '#1E5B45', color: '#fff' }
                : { color: '#6B6F69' }}>
              {s || 'All'}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C0BFBA' }}>
              <Briefcase size={36} className="mb-3 opacity-50" />
              <p className="text-sm">No offers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E7E6DF' }}>
                    {['Title', 'Company', 'Domain', 'Views', 'Status', 'Posted', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o, i) => (
                    <tr key={o.id} className="transition-colors"
                      style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>{o.title}</p>
                        <p className="text-xs" style={{ color: '#9A9E97' }}>{o.location}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm" style={{ color: '#6B6F69' }}>{o.company_profiles?.company_name}</p>
                        <p className="text-xs" style={{ color: '#9A9E97' }}>{o.company_profiles?.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs" style={{ color: '#6B6F69' }}>{o.domain}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#9A9E97' }}>
                          <Eye size={11} /> {o.views_count}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs" style={{ color: '#9A9E97' }}>{formatDate(o.created_at)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleStatus(o)} title={o.status === 'open' ? 'Close offer' : 'Open offer'}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: o.status === 'open' ? '#D97706' : '#1E5B45' }}
                            onMouseEnter={e => { e.currentTarget.style.background = o.status === 'open' ? '#FFFBEB' : '#EDF2EE'; }}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {o.status === 'open' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          </button>
                          <button onClick={() => { if (window.confirm('Delete this offer?')) deleteMutation.mutate(o.id); }}
                            title="Delete offer"
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#C0BFBA' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C0BFBA'; }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
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
