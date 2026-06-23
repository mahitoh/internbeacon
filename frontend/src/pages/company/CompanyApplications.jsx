import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText, ChevronRight, Loader2, Star, XCircle,
  CheckSquare, Square, Minus, Eye, ChevronLeft, Filter, Download,
  ArrowUpDown, Calendar,
} from 'lucide-react';
import api from '../../api/axios';
import { applicationsApi } from '../../api/applications';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import SelectField from '../../components/ui/SelectField';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'all',          label: 'All',          filter: () => true },
  { key: 'new',          label: 'New',          filter: a => a.status === 'submitted' },
  { key: 'reviewing',    label: 'Reviewing',    filter: a => a.status === 'under_review' },
  { key: 'shortlisted',  label: 'Shortlisted',  filter: a => a.status === 'shortlisted' },
  { key: 'interview',    label: 'Interview',    filter: a => ['interview_scheduled', 'interview_completed'].includes(a.status) },
  { key: 'final_review', label: 'Final Review', filter: a => a.status === 'final_review' },
  { key: 'accepted',     label: 'Accepted',     filter: a => a.status === 'accepted' },
  { key: 'rejected',     label: 'Rejected',     filter: a => ['rejected', 'withdrawn'].includes(a.status) },
];

const SORT_OPTIONS = [
  { key: 'newest',        label: 'Newest First' },
  { key: 'match_high',    label: 'Highest Match' },
  { key: 'match_low',     label: 'Lowest Match' },
];

const PAGE_SIZE = 25;
const TERMINAL  = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'];

// The Match column is only shown at lg+, so match-based sorting is only offered
// there — sorting by a column you can't see is disorienting.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

const scoreStyle = (score) => {
  if (score >= 85) return { color: '#1E5B45' };
  if (score >= 70) return { color: '#B45309' };
  if (score >= 50) return { color: '#C2410C' };
  return { color: '#9A9E97' };
};

export default function CompanyApplications() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const [tab,           setTab]          = useState('all');
  const [offerFilter,   setOfferFilter]  = useState(() => searchParams.get('offer') || '');
  const [sort,          setSort]         = useState('newest');
  const isDesktop = useIsDesktop();
  const sortOptions = isDesktop ? SORT_OPTIONS : SORT_OPTIONS.filter(o => !o.key.startsWith('match'));
  useEffect(() => {
    if (!isDesktop && sort.startsWith('match')) { setSort('newest'); setPage(1); }
  }, [isDesktop, sort]);
  const [page,          setPage]         = useState(1);
  const [rankMap,       setRankMap]      = useState({});
  const [rankingOffer,  setRankingOffer] = useState('');
  const [selectedIds,   setSelectedIds]  = useState([]);
  const [bulkLoading,   setBulkLoading]  = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll({ limit: 500 }).then(r => r.data.data),
  });

  const apps         = data || [];
  const offerOptions = [...new Map(apps.map(a => [a.offerId, { id: a.offerId, title: a.offer?.title }])).values()];

  // Auto-rank: specific offer if filter set, otherwise all offers in parallel
  useEffect(() => {
    if (!offerOptions.length) return;

    if (offerFilter) {
      // Single-offer mode — rank only the selected offer
      if (offerFilter === rankingOffer) return;
      setRankingOffer(offerFilter);
      api.get(`/ai/rank-applicants/${offerFilter}`)
        .then(r => {
          const map = {};
          for (const item of (r.data.data || [])) map[item.appId] = item;
          setRankMap(prev => ({ ...prev, ...map }));
        })
        .catch(() => {});
    } else {
      // All-offers mode — rank every offer in parallel (bounded by company offer count)
      if (rankingOffer === '__all__') return;
      setRankingOffer('__all__');
      Promise.allSettled(
        offerOptions.map(o => api.get(`/ai/rank-applicants/${o.id}`))
      ).then(results => {
        const merged = {};
        for (const r of results) {
          if (r.status === 'fulfilled') {
            for (const item of (r.value.data.data || [])) merged[item.appId] = item;
          }
        }
        setRankMap(prev => ({ ...prev, ...merged }));
      });
    }
  }, [offerFilter, offerOptions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const offerFiltered = offerFilter ? apps.filter(a => a.offerId === offerFilter) : apps;
  const activeTab     = TABS.find(t => t.key === tab);
  let tabFiltered     = offerFiltered.filter(activeTab.filter);

  // Apply sort
  if (sort === 'match_high') {
    tabFiltered = [...tabFiltered].sort((a, b) => (rankMap[b.id]?.score ?? -1) - (rankMap[a.id]?.score ?? -1));
  } else if (sort === 'match_low') {
    tabFiltered = [...tabFiltered].sort((a, b) => (rankMap[a.id]?.score ?? 101) - (rankMap[b.id]?.score ?? 101));
  }

  const totalPages = Math.ceil(tabFiltered.length / PAGE_SIZE);
  const pageStart  = (page - 1) * PAGE_SIZE;
  const pageItems  = tabFiltered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleTabChange   = (key) => { setTab(key); setPage(1); setSelectedIds([]); };
  const handleOfferFilter = (val) => { setOfferFilter(val); setPage(1); setSelectedIds([]); };

  const bulkSelectableIds = pageItems.filter(a => !TERMINAL.includes(a.status)).map(a => a.id);
  const allSelected  = bulkSelectableIds.length > 0 && bulkSelectableIds.every(id => selectedIds.includes(id));
  const someSelected = !allSelected && selectedIds.some(id => bulkSelectableIds.includes(id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(prev => prev.filter(id => !bulkSelectableIds.includes(id)));
    else             setSelectedIds(prev => [...new Set([...prev, ...bulkSelectableIds])]);
  };
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkAction = async (status) => {
    if (!selectedIds.length) return;
    const labels = { under_review: 'move to review', shortlisted: 'shortlist', rejected: 'reject' };
    const label  = labels[status] || status;
    if (!window.confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selectedIds.length} application${selectedIds.length !== 1 ? 's' : ''}?`)) return;
    setBulkLoading(status);
    try {
      await Promise.all(selectedIds.map(id => applicationsApi.updateStatus(id, { status })));
      qc.invalidateQueries({ queryKey: ['company-apps'] });
      setSelectedIds([]);
      toast.success(`${selectedIds.length} application${selectedIds.length !== 1 ? 's' : ''} updated`);
    } catch { toast.error('Some updates failed — please try again'); }
    finally { setBulkLoading(''); }
  };

  const downloadCsv = () => {
    const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = ['Name', 'University', 'Programme', 'Study Year', 'Offer', 'Location', 'Applied Date', 'Status', 'Match Score'];
    const rows = [header, ...tabFiltered.map(a => {
      const name = [a.student?.firstName, a.student?.lastName].filter(Boolean).join(' ') || 'Unknown';
      return [name, a.student?.university || '', a.student?.programme || '', a.student?.studyYear || '',
        a.offer?.title || '', a.offer?.location || '',
        a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-GB') : '',
        a.status, rankMap[a.id]?.score ?? ''];
    })];
    const csv  = rows.map(r => r.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Applications</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
            {apps.length} total · {offerFilter ? `filtered to "${offerOptions.find(o => o.id === offerFilter)?.title}"` : 'all offers'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Offer filter */}
          {offerOptions.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter size={14} style={{ color: '#9A9E97', flexShrink: 0 }} />
              <SelectField bare value={offerFilter} onChange={e => handleOfferFilter(e.target.value)}
                className="rounded-xl px-3 pr-8 py-1.5 text-sm appearance-none focus:outline-none"
                style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#6B6F69', maxWidth: 220 }}
                onFocus={e => e.target.style.borderColor = '#1E5B45'}
                onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                <option value="">All offers</option>
                {offerOptions.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
              </SelectField>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} style={{ color: '#9A9E97', flexShrink: 0 }} />
            <SelectField bare value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="rounded-xl px-3 pr-8 py-1.5 text-sm appearance-none focus:outline-none"
              style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
              {sortOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </SelectField>
          </div>

          {tabFiltered.length > 0 && (
            <button onClick={downloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E5B45'; e.currentTarget.style.color = '#1E5B45'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDDBD2'; e.currentTarget.style.color = '#6B6F69'; }}>
              <Download size={12} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap" style={{ background: '#EFEEE8' }}>
        {TABS.map(t => {
          const count    = offerFiltered.filter(t.filter).length;
          const isActive = t.key === tab;
          return (
            <button key={t.key} onClick={() => handleTabChange(t.key)}
              className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={isActive ? { background: '#1E5B45', color: '#fff' } : { color: '#6B6F69' }}>
              {t.label} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl flex-wrap gap-y-2"
          style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
          <p className="text-sm font-medium" style={{ color: '#6B6F69' }}>
            <span className="font-bold" style={{ color: '#1E5B45' }}>{selectedIds.length}</span> selected
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => handleBulkAction('under_review')} disabled={!!bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706' }}>
              {bulkLoading === 'under_review' ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
              Move to Review
            </button>
            <button onClick={() => handleBulkAction('shortlisted')} disabled={!!bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
              style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', color: '#6D28D9' }}>
              {bulkLoading === 'shortlisted' ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} />}
              Shortlist
            </button>
            <button onClick={() => handleBulkAction('rejected')} disabled={!!bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
              style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626' }}>
              {bulkLoading === 'rejected' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
              Reject
            </button>
            <button onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ border: '1px solid #DDDBD2', color: '#9A9E97' }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          {tabFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C0BFBA' }}>
              <FileText size={36} className="mb-3 opacity-50" />
              <p className="text-sm">No {tab === 'all' ? '' : activeTab.label.toLowerCase() + ' '}applications</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E7E6DF' }}>
                      <th className="pl-4 pr-2 py-3 w-8">
                        <button onClick={toggleSelectAll} className="transition-colors"
                          style={{ color: allSelected || someSelected ? '#1E5B45' : '#C0BFBA' }}>
                          {allSelected ? <CheckSquare size={15} /> : someSelected ? <Minus size={15} /> : <Square size={15} />}
                        </button>
                      </th>
                      {['Candidate', 'Applied For', 'Applied', 'Match', 'Status', ''].map((h, i) => (
                        <th key={i}
                          className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide
                            ${h === 'Applied For' ? 'hidden sm:table-cell' : ''}
                            ${h === 'Applied'     ? 'hidden md:table-cell' : ''}
                            ${h === 'Match'       ? 'hidden lg:table-cell' : ''}`}
                          style={{ color: '#9A9E97' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((app, i) => {
                      const name      = [app.student?.firstName, app.student?.lastName].filter(Boolean).join(' ') || 'Candidate';
                      const isTerminal = TERMINAL.includes(app.status);
                      const isChecked  = selectedIds.includes(app.id);
                      const rank       = rankMap[app.id];
                      return (
                        <tr key={app.id} className="transition-colors cursor-pointer"
                          onClick={() => navigate(`/company/applications/${app.id}`, { state: { queue: tabFiltered.map(a => a.id) } })}
                          style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none', background: isChecked ? '#F5FAF7' : 'transparent' }}
                          onMouseEnter={e => { if (!isChecked) e.currentTarget.style.background = '#FAFAF7'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = isChecked ? '#F5FAF7' : 'transparent'; }}>
                          <td className="pl-4 pr-2 py-4 w-8">
                            {!isTerminal && (
                              <button onClick={(e) => { e.stopPropagation(); toggleSelect(app.id); }} className="transition-colors"
                                style={{ color: isChecked ? '#1E5B45' : '#C0BFBA' }}>
                                {isChecked ? <CheckSquare size={15} /> : <Square size={15} />}
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={name} src={app.student?.avatarUrl} size="sm" />
                              <div>
                                <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>{name}</p>
                                <p className="text-xs hidden sm:block" style={{ color: '#9A9E97' }}>
                                  {app.student?.university} · {app.student?.programme}
                                </p>
                                <p className="text-xs sm:hidden" style={{ color: '#9A9E97' }}>{app.offer?.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <p className="text-sm" style={{ color: '#6B6F69' }}>{app.offer?.title}</p>
                            <p className="text-xs" style={{ color: '#9A9E97' }}>{app.offer?.location}</p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <span className="text-xs" style={{ color: '#9A9E97' }}>{formatRelativeTime(app.appliedAt)}</span>
                            {app.interview?.date && (
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} style={{ color: '#4338CA', flexShrink: 0 }} />
                                <span className="text-[10px]" style={{ color: '#4338CA' }}>
                                  {new Date(app.interview.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            {rank ? (
                              <div className="space-y-0.5">
                                <span className="text-sm font-black tabular-nums" style={scoreStyle(rank.score)}>
                                  {rank.score}%
                                </span>
                                <p className="text-[10px]" style={{ color: '#C0BFBA' }}>{rank.verdict}</p>
                              </div>
                            ) : (
                              <span className="text-xs" style={{ color: '#DDDBD2' }}>—</span>
                            )}
                          </td>
                          <td className="px-5 py-4"><StatusBadge status={app.status} /></td>
                          <td className="px-5 py-4">
                            <Link to={`/company/applications/${app.id}`}
                              state={{ queue: tabFiltered.map(a => a.id) }}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs font-medium transition-colors"
                              style={{ color: '#1E5B45' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#10342A'}
                              onMouseLeave={e => e.currentTarget.style.color = '#1E5B45'}>
                              Review <ChevronRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #E7E6DF' }}>
                  <p className="text-xs" style={{ color: '#9A9E97' }}>
                    Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, tabFiltered.length)} of {tabFiltered.length}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-1.5 rounded-lg disabled:opacity-30"
                      style={{ border: '1px solid #DDDBD2', color: '#6B6F69' }}>
                      <ChevronLeft size={13} />
                    </button>
                    <span className="text-xs px-2" style={{ color: '#9A9E97' }}>{page} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="p-1.5 rounded-lg disabled:opacity-30"
                      style={{ border: '1px solid #DDDBD2', color: '#6B6F69' }}>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
