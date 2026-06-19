import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
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
  { key: 'all',         label: 'All',         filter: () => true },
  { key: 'active',      label: 'Active',      filter: a => ACTIVE_STATUSES.includes(a.status) },
  { key: 'shortlisted', label: 'Shortlisted', filter: a => a.status === 'shortlisted' },
  { key: 'interview',   label: 'Interview',   filter: a => INTERVIEW_STATUSES.includes(a.status) },
  { key: 'accepted',    label: 'Accepted',    filter: a => ['accepted', 'offer_accepted'].includes(a.status) },
  { key: 'rejected',    label: 'Rejected',    filter: a => ['rejected', 'withdrawn', 'offer_declined'].includes(a.status) },
];

// Company avatar colour palette
const AVATAR_COLORS = [
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#D1FAE5', text: '#065F46' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EDE9FE', text: '#4C1D95' },
  { bg: '#FEE2E2', text: '#991B1B' },
  { bg: '#E0F2FE', text: '#075985' },
];

export default function StudentApplications() {
  const [tab,         setTab]         = useState('all');
  const [expanded,    setExpanded]    = useState(null);
  const [withdrawing, setWithdrawing] = useState(null);
  const [responding,  setResponding]  = useState(null);
  const [confirm,     setConfirm]     = useState(null); // { type: 'withdraw'|'offer', appId, response? }
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('app'); // deep-link target from the dashboard
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
    map[t.appId] = t.unreadCount; return map;
  }, {});

  const handleOfferResponse = (appId, response, e) => {
    e.stopPropagation();
    setConfirm({ type: 'offer', appId, response });
  };

  const handleWithdraw = (appId, e) => {
    e.stopPropagation();
    setConfirm({ type: 'withdraw', appId });
  };

  const executeConfirm = async () => {
    if (!confirm) return;
    const { type, appId, response } = confirm;
    setConfirm(null);
    if (type === 'offer') {
      setResponding(`${appId}:${response}`);
      try {
        await applicationsApi.respondToOffer(appId, response);
        qc.invalidateQueries({ queryKey: ['my-apps'] });
        toast.success(response === 'offer_accepted' ? 'Offer accepted! Congratulations!' : 'Offer declined');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to respond');
      } finally { setResponding(null); }
    } else {
      setWithdrawing(appId);
      try {
        await applicationsApi.withdraw(appId);
        qc.invalidateQueries({ queryKey: ['my-apps'] });
        toast.success('Application withdrawn');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to withdraw');
      } finally { setWithdrawing(null); }
    }
  };

  const apps      = data || [];
  const activeTab = TABS.find(t => t.key === tab);
  const filtered  = apps.filter(activeTab.filter);

  useEffect(() => {
    if (!apps.length) return;
    // Arriving via /student/applications?app=<id> from the dashboard: open that one.
    if (focusId && apps.some(a => a.id === focusId)) { setExpanded(focusId); return; }
    if (expanded !== null) return;
    const first = apps.find(a => !TERMINAL_STATUSES.includes(a.status)) ?? apps[0];
    if (first) setExpanded(first.id);
  }, [apps, focusId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>My Applications</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
          {apps.length} application{apps.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl flex-wrap"
        style={{ background: '#EFEEE8' }}>
        {TABS.map(t => {
          const count = apps.filter(t.filter).length;
          const isActive = t.key === tab;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={isActive
                ? { background: '#fff', color: '#1B1D1A', boxShadow: '0 1px 3px rgba(24,32,24,.08)', border: '1px solid #E7E6DF' }
                : { color: '#6B6F69' }}>
              {t.label} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
          <FileText size={40} className="mb-3 opacity-50" />
          <p className="text-sm">{tab === 'all' ? 'No applications yet' : `No ${activeTab.label.toLowerCase()} applications`}</p>
          {tab === 'all' && (
            <Link to="/student/offers" className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
              Browse internships →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => {
            const isExpanded  = expanded === app.id;
            const canWithdraw = !TERMINAL_STATUSES.includes(app.status);
            const companyName = app.offer?.company?.companyName || '';
            const initial     = companyName[0]?.toUpperCase() ?? '?';
            const avatarColor = AVATAR_COLORS[(initial.charCodeAt(0) || 0) % AVATAR_COLORS.length];

            return (
              <motion.div key={app.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden transition-all"
                style={{ background: '#fff', border: '1px solid #E7E6DF' }}>

                {/* Main row */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer select-none"
                  onClick={() => setExpanded(isExpanded ? null : app.id)}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-black"
                    style={{ background: avatarColor.bg, color: avatarColor.text }}>
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base leading-snug" style={{ color: '#1B1D1A' }}>{app.offer?.title}</h3>
                        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
                          {companyName}
                          {app.offer?.location ? ` · ${app.offer.location}` : ''}
                          {app.offer?.durationWeeks ? ` · ${app.offer.durationWeeks}w` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={app.status} />
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          style={{ color: '#C0BFBA' }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                      <span className="text-xs" style={{ color: '#9A9E97' }}>Applied {formatRelativeTime(app.appliedAt)}</span>
                      {app.status === 'interview_scheduled' && app.interview?.date && (() => {
                        const interviewDate = new Date(app.interview.date);
                        const daysUntil = Math.ceil((interviewDate - Date.now()) / 86400000);
                        let label, chipStyle;
                        if (daysUntil < 0)       { label = 'Interview passed';    chipStyle = { background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#9A9E97' }; }
                        else if (daysUntil === 0) { label = 'Interview today!';   chipStyle = { background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }; }
                        else if (daysUntil === 1) { label = 'Interview tomorrow'; chipStyle = { background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }; }
                        else if (daysUntil <= 7)  { label = `Interview in ${daysUntil} days`; chipStyle = { background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3' }; }
                        else                      { label = `Interview ${formatDate(app.interview.date)}`; chipStyle = { background: '#EEF2FF', border: '1px solid #E0E7FF', color: '#4338CA' }; }
                        return (
                          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md" style={chipStyle}>
                            <Calendar size={10} />{label}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Offer response CTA */}
                    {app.status === 'accepted' && (
                      <div className="flex items-center gap-2 mt-3" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={!!responding}
                          onClick={(e) => handleOfferResponse(app.id, 'offer_accepted', e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                          style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                          <CheckCircle2 size={12} />
                          {responding === `${app.id}:offer_accepted` ? 'Accepting…' : 'Accept Offer'}
                        </button>
                        <button
                          disabled={!!responding}
                          onClick={(e) => handleOfferResponse(app.id, 'offer_declined', e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                          style={{ background: '#FDEEED', border: '1px solid #F0BDBA', color: '#C0463E' }}>
                          <XCircle size={12} />
                          {responding === `${app.id}:offer_declined` ? 'Declining…' : 'Decline Offer'}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <Link to={`/student/messages/${app.id}`} onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                        style={{ color: '#6B6F69' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1E5B45'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6B6F69'}>
                        <MessageSquare size={13} />
                        Chat
                        {(threadUnreadMap[app.id] ?? 0) > 0 && (
                          <span className="text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: '#1E5B45' }}>{threadUnreadMap[app.id]}</span>
                        )}
                      </Link>
                      <Link to={`/student/offers/${app.offer?.id}`} onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: '#9A9E97' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                        View offer <ChevronRight size={11} />
                      </Link>
                      {canWithdraw && (
                        <button onClick={(e) => handleWithdraw(app.id, e)} disabled={withdrawing === app.id}
                          className="flex items-center gap-1 text-xs transition-colors ml-auto"
                          style={{ color: '#C0BFBA' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#C0463E'}
                          onMouseLeave={e => e.currentTarget.style.color = '#C0BFBA'}>
                          <Trash2 size={12} />
                          {withdrawing === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded timeline */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div key="timeline"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid #F0F0EA' }}>
                        {['interview_scheduled', 'interview_completed'].includes(app.status) && app.interview?.date && (
                          <div className="mb-4 p-4 rounded-xl"
                            style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={13} style={{ color: '#4338CA' }} />
                              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3730A3' }}>
                                {app.status === 'interview_completed' ? 'Interview — Completed' : 'Interview Details'}
                              </p>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p style={{ color: '#1B1D1A' }}>
                                <span style={{ color: '#6B6F69' }}>When: </span>
                                {new Date(app.interview.date).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
                              </p>
                              {app.interview.type && (
                                <p style={{ color: '#1B1D1A' }}>
                                  <span style={{ color: '#6B6F69' }}>Format: </span>
                                  {TYPE_LABELS[app.interview.type] ?? app.interview.type}
                                </p>
                              )}
                              {app.interview.location && (
                                <p style={{ color: '#1B1D1A' }}>
                                  <span style={{ color: '#6B6F69' }}>Location: </span>{app.interview.location}
                                </p>
                              )}
                              {app.interview.link && (
                                <a href={app.interview.link} target="_blank" rel="noopener noreferrer"
                                  className="hover:underline break-all text-sm" style={{ color: '#4338CA' }}>
                                  {app.interview.link}
                                </a>
                              )}
                              {app.interview.notes && (
                                <p className="italic mt-1 text-xs" style={{ color: '#6B6F69' }}>"{app.interview.notes}"</p>
                              )}
                            </div>
                          </div>
                        )}
                        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9A9E97' }}>
                          Application Timeline
                        </p>
                        <ApplicationTimeline
                          applicationId={app.id}
                          currentStatus={app.status}
                          interview={app.interview}
                        />
                        {app.companyNote && (
                          <div className="mt-4 p-3 rounded-xl" style={{ background: '#F6F5F1', border: '1px solid #E7E6DF' }}>
                            <p className="text-xs mb-1 font-semibold" style={{ color: '#9A9E97' }}>Note from company</p>
                            <p className="text-sm" style={{ color: '#1B1D1A' }}>{app.companyNote}</p>
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

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: '#fff', border: '1px solid #E7E6DF', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            {confirm.type === 'withdraw' ? (
              <>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                  <Trash2 size={18} style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Withdraw application?</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B6F69' }}>
                    The record will be kept but marked as withdrawn. You won't be able to re-apply.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={executeConfirm}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#DC2626' }}>
                    Yes, withdraw
                  </button>
                  <button onClick={() => setConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#F6F5F1', color: '#6B6F69' }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: confirm.response === 'offer_accepted' ? '#EDF2EE' : '#FEE2E2', border: `1px solid ${confirm.response === 'offer_accepted' ? '#C4DBCE' : '#FCA5A5'}` }}>
                  {confirm.response === 'offer_accepted'
                    ? <CheckCircle2 size={18} style={{ color: '#1E5B45' }} />
                    : <XCircle     size={18} style={{ color: '#DC2626' }} />}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>
                    {confirm.response === 'offer_accepted' ? 'Accept this offer?' : 'Decline this offer?'}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B6F69' }}>
                    {confirm.response === 'offer_accepted'
                      ? 'Congratulations! This action confirms you are taking the internship.'
                      : 'You are declining this internship offer. This cannot be undone.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={executeConfirm}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: confirm.response === 'offer_accepted' ? '#1E5B45' : '#DC2626' }}>
                    {confirm.response === 'offer_accepted' ? 'Yes, accept' : 'Yes, decline'}
                  </button>
                  <button onClick={() => setConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#F6F5F1', color: '#6B6F69' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
