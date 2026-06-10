import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Eye, Users, Edit2, X, Briefcase, Trash2, Search } from 'lucide-react';
import { offersApi } from '../../api/offers';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function CompanyOffers() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const { data, isLoading } = useQuery({
    queryKey: ['my-offers'],
    queryFn:  () => offersApi.myOffers({ limit: 100 }).then(r => r.data.data),
  });

  const closeMutation = useMutation({
    mutationFn: (id) => offersApi.close(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-offers'] }); toast.success('Offer closed'); },
    onError:   () => toast.error('Failed to close offer'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => offersApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-offers'] }); toast.success('Offer deleted'); },
    onError:   () => toast.error('Failed to delete offer'),
  });

  const handleDelete = (id) => {
    if (!window.confirm('Permanently delete this offer? This cannot be undone.')) return;
    deleteMutation.mutate(id);
  };

  const allOffers = data || [];
  const offers = search
    ? allOffers.filter(o =>
        o.title?.toLowerCase().includes(search.toLowerCase()) ||
        o.domain?.toLowerCase().includes(search.toLowerCase()) ||
        o.location?.toLowerCase().includes(search.toLowerCase())
      )
    : allOffers;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">My Internship Posts</h2>
          <p className="text-white/40 text-sm mt-0.5">{allOffers.length} offer{allOffers.length !== 1 ? 's' : ''} posted</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 focus-within:border-lime-500/50 transition-colors">
            <Search size={14} className="text-white/30 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter offers…"
              className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-36"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-white/20 hover:text-white transition-colors">
                <X size={13} />
              </button>
            )}
          </div>
          <Link to="/company/offers/post"
            className="flex items-center gap-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
            <Plus size={16} /> Post Internship
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#1a1a1a] rounded-2xl border border-white/5 text-white/30">
          <Briefcase size={40} className="mb-3" />
          <p className="text-sm">No offers yet</p>
          <Link to="/company/offers/post" className="mt-3 text-lime-400 text-xs hover:underline">Post your first internship →</Link>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Internship', 'Domain', 'Deadline', 'Views', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {offers.map(offer => (
                <tr key={offer.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-medium">{offer.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{offer.location} · {offer.durationWeeks}w · {offer.openings} opening{offer.openings !== 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white/50">{offer.domain}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-white/50">{formatDate(offer.deadline)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs text-white/40"><Eye size={11} /> {offer.viewsCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={offer.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link to="/company/applications"
                        className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300">
                        <Users size={11} /> Apps
                      </Link>
                      <Link to={`/company/offers/${offer.id}/edit`}
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                        <Edit2 size={11} /> Edit
                      </Link>
                      {offer.status === 'open' && (
                        <button onClick={() => closeMutation.mutate(offer.id)}
                          className="flex items-center gap-1 text-xs text-white/30 hover:text-orange-400 transition-colors">
                          <X size={11} /> Close
                        </button>
                      )}
                      <button onClick={() => handleDelete(offer.id)}
                        className="flex items-center gap-1 text-xs text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 size={11} /> Delete
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
  );
}
