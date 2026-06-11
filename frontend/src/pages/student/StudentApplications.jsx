import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Briefcase, ChevronRight, ChevronDown, Trash2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { messagesApi } from '../../api/messages';
import { StatusBadge } from '../../components/ui/Badge';
import ApplicationTimeline from '../../components/ui/ApplicationTimeline';
import Spinner from '../../components/ui/Spinner';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const TYPE_LABELS = {
  in_person:   'In Person',
  google_meet: 'Google Meet',
  zoom:        'Zoom',
  teams:       'Microsoft Teams',
  phone:       'Phone Call',
};

const ACTIVE_STATUSES    = ['submitted', 'under_review', 'final_review'];
const INTERVIEW_STATUSES = ['interview_scheduled', 'interview_completed'];
const TERMINAL_STATUSES  = ['accepted', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'];

const TABS = [
  { key: 'all',         label: 'All',        filter: () => true },
  { key: 'active',      label: 'Active',     filter: a => ACTIVE_STATUSES.includes(a.status) },
  { key: 'shortlisted', label: 'Shortlisted',filter: a => a.status === 'shortlisted' },
  { key: 'interview',   label: 'Interview',  filter: a => INTERVIEW_STATUSES.includes(a.status) },
  { key: 'accepted',    label: 'Accepted',   filter: a => ['accepted', 'offer_accepted'].includes(a.status) },
  { key: 'rejected',    label: 'Rejected',   filter: a => ['rejected', 'withdrawn', 'offer_declined'].includes(a.status) },
];

export default function StudentApplications() {
  const [tab,          setTab]          = useState('all');
  const [expanded,     setExpanded]     = useState(null);
  const [withdrawing,  setWithdrawing]  = useState(null);
  const [responding,   setResponding]   = useState(null); // appId:response
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my({ limit: 100 }).then(r => r.data.data),
  });

  const { data: threadsData } = useQuery({
    queryKey: ['message-threads'],
    queryFn:  () => messagesApi.threads().then(r => r.data.data),
  });

  const threadUnreadMap = (threadsData || []).reduce((map, t) => {
    map[t.appId] = t.unreadCount;
    return map;
  }, {});

  const handleOfferResponse = async (appId, response, e) => {
    e.stopPropagation();
    const label = response === 'offer_accepted' ? 'accept' : 'decline';
    if (!window.confirm(`Are you sure you want to ${label} this offer?`)) return;
    setResponding(`${appId}:${response}`);
    try {
      await applicationsApi.respondToOffer(appId, response);
      qc.invalidateQueries({ queryKey: ['my-apps'] });
      toast.success(response === 'offer_accepted' ? 'Offer accepted! Congratulations!' : 'Offer declined');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond to offer');
    } finally { setResponding(null); }
  };

  const handleWithdraw = async (appId, e) => {
    e.stopPropagation();
    if (!window.confirm('Withdraw this application? The record will be kept but marked as withdrawn.')) return;
    setWithdrawing(appId);
    try {
      await applicationsApi.withdraw(appId);
      qc.invalidateQueries({ queryKey: ['my-apps'] });
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    } finally { setWithdrawing(null); }
  };

  const apps     = data || [];
  const activeTab = TABS.find(t => t.key === tab);
  const filtered  = apps.filter(activeTab.filter);

  // Auto-expand the most recent non-terminal application on first load
  useEffect(() => {
    if (expanded !== null || !apps.length) return;
    const first = apps.find(a => !TERMINAL_STATUSES.includes(a.status)) ?? apps[0];
    if (first) setExpanded(first.id);
  }, [apps]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabCount = (t) => apps.filter(t.filter).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">My Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">{apps.length} application{apps.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 flex-wrap">
        {TABS.map(t => {
          const count = tabCount(t);
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${t.key === tab ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'}`}>
              {t.label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <FileText size={40} className="mb-3" />
          <p className="text-sm">{tab === 'all' ? 'No applications yet' : `No ${activeTab.label.toLowerCase()} applications`}</p>
          {tab === 'all' && <Link to="/student/offers" className="mt-3 text-lime-400 text-xs hover:underline">Browse internships →</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => {
            const isExpanded  = expanded === app.id;
            const canWithdraw = !TERMINAL_STATUSES.includes(app.status);

            return (
              <motion.div key={app.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-white/10 transition-all overflow-hidden">

                {/* Main row */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer select-none"
                  onClick={() => setExpanded(isExpanded ? null : app.id)}>
                  <div className="w-11 h-11 rounded-xl bg-brand-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase size={20} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-semibold text-base leading-snug">{app.offer?.title}</h3>
                        <p className="text-white/50 text-sm mt-0.5">
                          {app.offer?.company?.companyName}
                          {app.offer?.location ? ` · ${app.offer.location}` : ''}
                          {app.offer?.durationWeeks ? ` · ${app.offer.durationWeeks}w` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={app.status} />
                        <ChevronDown size={14} className={`text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                      <span className="text-xs text-white/30">Applied {formatRelativeTime(app.appliedAt)}</span>
                      {app.status === 'interview_scheduled' && app.interview?.date && (() => {
                        const interviewDate = new Date(app.interview.date);
                        const daysUntil = Math.ceil((interviewDate - Date.now()) / 86400000);
                        let label, chipCls;
                        if (daysUntil < 0) {
                          label = 'Interview passed';
                          chipCls = 'text-white/30 bg-white/5 border-white/10';
                        } else if (daysUntil === 0) {
                          label = 'Interview today!';
                          chipCls = 'text-lime-300 bg-lime-500/15 border-lime-500/30';
                        } else if (daysUntil === 1) {
                          label = 'Interview tomorrow';
                          chipCls = 'text-amber-300 bg-amber-500/12 border-amber-500/25';
                        } else if (daysUntil <= 7) {
                          label = `Interview in ${daysUntil} days`;
                          chipCls = 'text-indigo-300 bg-indigo-500/12 border-indigo-500/25';
                        } else {
                          label = `Interview ${formatDate(app.interview.date)}`;
                          chipCls = 'text-indigo-400/70 bg-indigo-500/8 border-indigo-500/15';
                        }
                        return (
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${chipCls}`}>
                            <Calendar size={10} />
                            {label}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Offer response CTA — only shown when accepted */}
                    {app.status === 'accepted' && (
                      <div className="flex items-center gap-2 mt-3" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={!!responding}
                          onClick={(e) => handleOfferResponse(app.id, 'offer_accepted', e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/30 text-lime-300 text-xs font-semibold transition-all disabled:opacity-40">
                          <CheckCircle2 size={12} />
                          {responding === `${app.id}:offer_accepted` ? 'Accepting…' : 'Accept Offer'}
                        </button>
                        <button
                          disabled={!!responding}
                          onClick={(e) => handleOfferResponse(app.id, 'offer_declined', e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all disabled:opacity-40">
                          <XCircle size={12} />
                          {responding === `${app.id}:offer_declined` ? 'Declining…' : 'Decline Offer'}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <Link
                        to={`/student/messages/${app.id}`}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-lime-400 transition-colors">
                        <MessageSquare size={13} />
                        Chat
                        {(threadUnreadMap[app.id] ?? 0) > 0 && (
                          <span className="bg-lime-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{threadUnreadMap[app.id]}</span>
                        )}
                      </Link>
                      <Link
                        to={`/student/offers/${app.offer?.id}`}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors">
                        View offer <ChevronRight size={11} />
                      </Link>
                      {canWithdraw && (
                        <button
                          onClick={(e) => handleWithdraw(app.id, e)}
                          disabled={withdrawing === app.id}
                          className="flex items-center gap-1 text-xs text-white/20 hover:text-red-400 transition-colors ml-auto">
                          <Trash2 size={12} />
                          {withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="timeline"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 border-t border-white/5">
                        {['interview_scheduled', 'interview_completed'].includes(app.status) && app.interview?.date && (
                          <div className="mb-4 p-4 bg-indigo-500/8 border border-indigo-500/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={13} className="text-indigo-400" />
                              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                                {app.status === 'interview_completed' ? 'Interview — Completed' : 'Interview Details'}
                              </p>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-white/70">
                                <span className="text-white/30">When: </span>
                                {new Date(app.interview.date).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                              </p>
                              {app.interview.type && (
                                <p className="text-white/70">
                                  <span className="text-white/30">Format: </span>
                                  {TYPE_LABELS[app.interview.type] ?? app.interview.type}
                                </p>
                              )}
                              {app.interview.location && (
                                <p className="text-white/70">
                                  <span className="text-white/30">Location: </span>{app.interview.location}
                                </p>
                              )}
                              {app.interview.link && (
                                <p>
                                  <a href={app.interview.link} target="_blank" rel="noopener noreferrer"
                                    className="text-indigo-400 hover:underline break-all text-sm">
                                    {app.interview.link}
                                  </a>
                                </p>
                              )}
                              {app.interview.notes && (
                                <p className="text-white/50 italic mt-1 text-xs">"{app.interview.notes}"</p>
                              )}
                            </div>
                          </div>
                        )}
                        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Application Timeline</p>
                        <ApplicationTimeline
                          applicationId={app.id}
                          currentStatus={app.status}
                          interview={app.interview}
                        />
                        {app.companyNote && (
                          <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/8">
                            <p className="text-xs text-white/30 mb-1">Note from company</p>
                            <p className="text-sm text-white/60">{app.companyNote}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
