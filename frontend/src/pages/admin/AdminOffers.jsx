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
    const next = offer.status === 'open' ? 'closed' : 'open';
    statusMutation.mutate({ id: offer.id, status: next });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Offers</h2>
          <p className="text-white/40 text-sm mt-0.5">{meta.total} total internship posts</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 w-fit">
        {STATUSES.map(s => (
          <button key={s || 'all'} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all
              ${s === status ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <Briefcase size={36} className="mb-3" />
              <p className="text-sm">No offers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/5">
                  {['Title', 'Company', 'Domain', 'Views', 'Status', 'Posted', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {offers.map(o => (
                  <tr key={o.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium">{o.title}</p>
                      <p className="text-white/30 text-xs">{o.location}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white/70 text-sm">{o.company_profiles?.company_name}</p>
                      <p className="text-white/30 text-xs">{o.company_profiles?.city}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-white/50">{o.domain}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Eye size={11} /> {o.views_count}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-white/40">{formatDate(o.created_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(o)}
                          title={o.status === 'open' ? 'Close offer' : 'Open offer'}
                          className={`p-1.5 rounded-lg transition-colors ${o.status === 'open' ? 'text-orange-400 hover:bg-orange-500/10' : 'text-lime-400 hover:bg-lime-500/10'}`}>
                          {o.status === 'open' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        </button>
                        <button
                          onClick={() => { if (window.confirm('Delete this offer?')) deleteMutation.mutate(o.id); }}
                          title="Delete offer"
                          className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
