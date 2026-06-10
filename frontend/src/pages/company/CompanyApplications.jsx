import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, ChevronRight, Sparkles, Loader2, Star, XCircle, CheckSquare, Square, Minus } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { aiApi } from '../../api/ai';
import { StatusBadge } from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'all',               label: 'All',          filter: () => true },
  { key: 'new',               label: 'New',          filter: a => a.status === 'submitted' },
  { key: 'reviewing',         label: 'Reviewing',    filter: a => a.status === 'under_review' },
  { key: 'shortlisted',       label: 'Shortlisted',  filter: a => a.status === 'shortlisted' },
  { key: 'interview',         label: 'Interview',    filter: a => ['interview_scheduled', 'interview_completed'].includes(a.status) },
  { key: 'final_review',      label: 'Final Review', filter: a => a.status === 'final_review' },
  { key: 'accepted',          label: 'Accepted',     filter: a => a.status === 'accepted' },
  { key: 'rejected',          label: 'Rejected',     filter: a => ['rejected', 'withdrawn'].includes(a.status) },
];

export default function CompanyApplications() {
  const [tab,          setTab]          = useState('all');
  const [rankOfferId,  setRankOfferId]  = useState('');
  const [rankings,     setRankings]     = useState(null);
  const [ranking,      setRanking]      = useState(false);
  const [selectedIds,  setSelectedIds]  = useState([]);
  const [bulkLoading,  setBulkLoading]  = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll().then(r => r.data.data),
  });

  const apps      = data || [];
  const activeTab = TABS.find(t => t.key === tab);
  const filtered  = apps.filter(activeTab.filter);

  // Unique offers for the rank dropdown
  const offerOptions = [...new Map(apps.map(a => [a.offerId, { id: a.offerId, title: a.offer?.title }])).values()];

  const handleRank = async () => {
    if (!rankOfferId) { toast.error('Select an offer first'); return; }
    setRanking(true);
    setRankings(null);
    try {
      const r = await aiApi.rankApplicants(rankOfferId);
      setRankings(r.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI ranking failed');
    } finally { setRanking(false); }
  };

  const rankMap = rankings ? Object.fromEntries(rankings.map(r => [r.appId, r])) : {};

  const bulkSelectableIds = filtered.filter(a => !['accepted','offer_accepted','offer_declined','rejected','withdrawn'].includes(a.status)).map(a => a.id);
  const allSelected = bulkSelectableIds.length > 0 && bulkSelectableIds.every(id => selectedIds.includes(id));
  const someSelected = !allSelected && selectedIds.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !bulkSelectableIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...bulkSelectableIds])]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkAction = async (status) => {
    if (!selectedIds.length) return;
    const label = status === 'shortlisted' ? 'shortlist' : 'reject';
    if (!window.confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selectedIds.length} application${selectedIds.length !== 1 ? 's' : ''}?`)) return;
    setBulkLoading(status);
    try {
      await Promise.all(selectedIds.map(id => applicationsApi.updateStatus(id, { status })));
      qc.invalidateQueries({ queryKey: ['company-apps'] });
      setSelectedIds([]);
      toast.success(`${selectedIds.length} application${selectedIds.length !== 1 ? 's' : ''} ${status === 'shortlisted' ? 'shortlisted' : 'rejected'}`);
    } catch {
      toast.error('Some updates failed — please try again');
    } finally { setBulkLoading(''); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white">Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      {/* AI Ranking bar */}
      {offerOptions.length > 0 && (
        <div className="p-4 bg-violet-500/5 border border-violet-500/15 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">AI Applicant Ranking</p>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                Unlike keyword search, AI reads each candidate's full profile — programme, skills, cover letter, and experience — and scores their fit 0–100 against the offer requirements. Strengths and gaps are identified and candidates are ranked best to worst.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={rankOfferId} onChange={e => { setRankOfferId(e.target.value); setRankings(null); }}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50 appearance-none">
              <option value="" className="bg-[#1a1a1a]">Select an offer…</option>
              {offerOptions.map(o => <option key={o.id} value={o.id} className="bg-[#1a1a1a]">{o.title}</option>)}
            </select>
            <button onClick={handleRank} disabled={ranking || !rankOfferId}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 text-sm font-semibold transition-all disabled:opacity-40 flex-shrink-0">
              {ranking ? <><Loader2 size={13} className="animate-spin" /> Ranking…</> : <><Sparkles size={13} /> Rank</>}
            </button>
          </div>
          {rankings && (
            <p className="text-xs text-violet-400/70">
              Ranked {rankings.length} candidate{rankings.length !== 1 ? 's' : ''} — scores shown in the table below.
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelectedIds([]); }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${t.key === tab ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'}`}>
            {t.label} <span className="opacity-60">({apps.filter(t.filter).length})</span>
          </button>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-lime-500/10 border border-lime-500/25 rounded-xl">
          <p className="text-sm text-white/70 font-medium">
            <span className="text-lime-400 font-bold">{selectedIds.length}</span> selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('shortlisted')}
              disabled={!!bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all disabled:opacity-40">
              {bulkLoading === 'shortlisted' ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} />}
              Shortlist all
            </button>
            <button
              onClick={() => handleBulkAction('rejected')}
              disabled={!!bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all disabled:opacity-40">
              {bulkLoading === 'rejected' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
              Reject all
            </button>
            <button onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 hover:text-white transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <FileText size={36} className="mb-3" />
              <p className="text-sm">No {tab === 'all' ? '' : activeTab.label.toLowerCase() + ' '}applications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pl-4 pr-2 py-3 w-8">
                    <button onClick={toggleSelectAll} className="text-white/30 hover:text-white transition-colors">
                      {allSelected ? <CheckSquare size={15} className="text-lime-400" /> : someSelected ? <Minus size={15} className="text-lime-400" /> : <Square size={15} />}
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Candidate</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide hidden sm:table-cell">Applied For</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide hidden md:table-cell">Applied</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Status</th>
                  {rankings && <th className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide hidden lg:table-cell">AI Fit</th>}
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(app => {
                  const name = [app.student?.firstName, app.student?.lastName].filter(Boolean).join(' ') || 'Candidate';
                  const isTerminal = ['accepted','offer_accepted','offer_declined','rejected','withdrawn'].includes(app.status);
                  const isChecked  = selectedIds.includes(app.id);
                  return (
                    <tr key={app.id} className={`hover:bg-white/2 transition-colors ${isChecked ? 'bg-lime-500/5' : ''}`}>
                      <td className="pl-4 pr-2 py-4 w-8">
                        {!isTerminal && (
                          <button onClick={() => toggleSelect(app.id)} className="text-white/30 hover:text-white transition-colors">
                            {isChecked ? <CheckSquare size={15} className="text-lime-400" /> : <Square size={15} />}
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} size="sm" />
                          <div>
                            <p className="text-white text-sm font-medium">{name}</p>
                            <p className="text-white/40 text-xs hidden sm:block">{app.student?.university} · {app.student?.programme}</p>
                            <p className="text-white/40 text-xs sm:hidden">{app.offer?.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-white text-sm">{app.offer?.title}</p>
                        <p className="text-white/40 text-xs">{app.offer?.location}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-white/40">{formatRelativeTime(app.appliedAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      {rankings && (
                        <td className="px-5 py-4 max-w-[180px] hidden lg:table-cell">
                          {rankMap[app.id] ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-black ${rankMap[app.id].score >= 70 ? 'text-lime-400' : rankMap[app.id].score >= 45 ? 'text-yellow-400' : 'text-red-400'}`}>
                                  {rankMap[app.id].score}%
                                </span>
                                <span className="text-xs text-white/30">{rankMap[app.id].verdict}</span>
                              </div>
                              {rankMap[app.id].reason && (
                                <p className="text-[10px] text-white/30 leading-tight mt-0.5 line-clamp-2">{rankMap[app.id].reason}</p>
                              )}
                            </div>
                          ) : <span className="text-white/20 text-xs">—</span>}
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <Link to={`/company/applications/${app.id}`}
                          className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 transition-colors">
                          Review <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
