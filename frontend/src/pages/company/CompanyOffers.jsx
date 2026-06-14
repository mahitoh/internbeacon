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
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>My Internship Posts</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>{allOffers.length} offer{allOffers.length !== 1 ? 's' : ''} posted</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
            style={{ background: '#fff', border: '1px solid #DDDBD2' }}>
            <Search size={14} style={{ color: '#9A9E97', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter offers…"
              className="bg-transparent text-sm focus:outline-none w-36"
              style={{ color: '#1B1D1A' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ color: '#9A9E97' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
                onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                <X size={13} />
              </button>
            )}
          </div>
          <Link to="/company/offers/post"
            className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl whitespace-nowrap"
            style={{ background: '#1E5B45', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
            onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
            <Plus size={16} /> Post Internship
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
          <Briefcase size={40} className="mb-3 opacity-50" />
          <p className="text-sm">No offers yet</p>
          <Link to="/company/offers/post" className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
            Post your first internship →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E7E6DF' }}>
                  {['Internship', 'Domain', 'Deadline', 'Views', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map((offer, i) => (
                  <tr key={offer.id} className="transition-colors"
                    style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F6F5F1'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>{offer.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                        {offer.location} · {offer.durationWeeks}w ·{' '}
                        <span style={{ color: offer.filledCount >= offer.openings ? '#D97706' : '#9A9E97' }}>
                          {offer.filledCount}/{offer.openings} filled
                        </span>
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: '#6B6F69' }}>{offer.domain}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs" style={{ color: '#6B6F69' }}>{formatDate(offer.deadline)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#9A9E97' }}>
                        <Eye size={11} /> {offer.viewsCount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={offer.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/company/applications?offer=${offer.id}`}
                          className="flex items-center gap-1 text-xs font-semibold"
                          style={{ color: '#1E5B45', textDecoration: 'none' }}>
                          <Users size={11} /> Apps
                        </Link>
                        <Link to={`/company/offers/${offer.id}/edit`}
                          className="flex items-center gap-1 text-xs transition-colors"
                          style={{ color: '#9A9E97', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
                          onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                          <Edit2 size={11} /> Edit
                        </Link>
                        {offer.status === 'open' && (
                          <button onClick={() => closeMutation.mutate(offer.id)}
                            className="flex items-center gap-1 text-xs transition-colors"
                            style={{ color: '#9A9E97' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#D97706'}
                            onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                            <X size={11} /> Close
                          </button>
                        )}
                        <button onClick={() => handleDelete(offer.id)}
                          className="flex items-center gap-1 text-xs transition-colors"
                          style={{ color: '#C0BFBA' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#C0BFBA'}>
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
