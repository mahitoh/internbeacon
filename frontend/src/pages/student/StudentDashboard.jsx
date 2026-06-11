import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../../api/applications';
import { offersApi } from '../../api/offers';
import { messagesApi } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/dashboard/StatCard';
import OfferCard from '../../components/offers/OfferCard';
import { StatusBadge } from '../../components/ui/Badge';
import { formatRelativeTime } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = {
  active:      '#3b82f6',
  shortlisted: '#a855f7',
  interview:   '#6366f1',
  accepted:    '#84cc16',
  rejected:    '#ef4444',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const name = user?.studentProfile?.firstName || 'Student';

  const { data: appsData }    = useQuery({ queryKey: ['my-apps'],          queryFn: () => applicationsApi.my({ limit: 100 }).then(r => r.data.data) });
  const { data: recData }     = useQuery({ queryKey: ['offers-rec'],       queryFn: () => offersApi.recommended(4).then(r => r.data.data) });
  const { data: threadsData } = useQuery({ queryKey: ['message-threads'],  queryFn: () => messagesApi.threads().then(r => r.data.data) });

  const apps      = appsData || [];
  const recOffers = recData  || [];

  const threadUnreadMap = (threadsData || []).reduce((map, t) => {
    map[t.appId] = t.unreadCount;
    return map;
  }, {});

  const counts = {
    total:       apps.length,
    active:      apps.filter(a => ['submitted','under_review','final_review'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    interview:   apps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
    accepted:    apps.filter(a => ['accepted','offer_accepted'].includes(a.status)).length,
    rejected:    apps.filter(a => ['rejected','withdrawn','offer_declined'].includes(a.status)).length,
  };

  const pieData = [
    { name: 'Active',      value: counts.active,      color: STATUS_COLORS.active },
    { name: 'Shortlisted', value: counts.shortlisted,  color: STATUS_COLORS.shortlisted },
    { name: 'Interview',   value: counts.interview,    color: STATUS_COLORS.interview },
    { name: 'Accepted',    value: counts.accepted,     color: STATUS_COLORS.accepted },
    { name: 'Rejected',    value: counts.rejected,     color: STATUS_COLORS.rejected },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Hello, {name} 👋</h2>
          <p className="text-white/40 text-sm mt-0.5">Here's what's happening with your applications</p>
        </div>
        <Link to="/student/offers"
          className="flex items-center gap-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors">
          Browse Offers <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"    value={counts.total}    icon={FileText}     color="lime" />
        <StatCard label="Active"   value={counts.active}   icon={Clock}        color="blue" />
        <StatCard label="Accepted" value={counts.accepted} icon={CheckCircle2} color="lime" />
        <StatCard label="Rejected" value={counts.rejected} icon={XCircle}      color="red"  />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Applications</h3>
            <Link to="/student/applications" className="text-xs text-lime-400 hover:text-lime-300">View all →</Link>
          </div>

          {apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <FileText size={36} className="mb-3 opacity-40" />
              <p className="text-sm">No applications yet</p>
              <Link to="/student/offers" className="mt-3 text-lime-400 text-xs hover:underline">Browse internships →</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {apps.slice(0, 5).map(app => (
                <motion.div key={app.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-brand-800/30 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{app.offer?.title}</p>
                    <p className="text-white/40 text-xs">{app.offer?.company?.companyName} · {formatRelativeTime(app.appliedAt)}</p>
                    {(threadUnreadMap[app.id] ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-lime-400 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400" /> {threadUnreadMap[app.id]} new message{threadUnreadMap[app.id] > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Application breakdown */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Application Status</h3>
          {counts.total > 0 ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={isDark
                      ? { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }
                      : { background: '#ffffff', border: '1px solid #e7e4d5', borderRadius: 8, fontSize: 12, color: '#0f2d20' }
                    } />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-white/60">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 text-white/20">
              <TrendingUp size={32} />
              <p className="text-xs mt-2">Apply to see stats</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended offers */}
      {recOffers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Recommended For You</h3>
              <p className="text-xs text-white/30 mt-0.5">Matched to your programme, skills, and academic level</p>
            </div>
            <Link to="/student/offers" className="text-xs text-lime-400 hover:text-lime-300">Browse all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recOffers.map(offer => (
              <div key={offer.id} className="relative">
                <OfferCard offer={offer} dark basePath="/student/offers" companyBasePath="/student/companies" />
                {offer.matchReasons?.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {offer.matchReasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-[10px] text-lime-400/70 bg-lime-500/5 border border-lime-500/15 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                    {offer.matchScore > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        offer.matchScore >= 70 ? 'text-lime-400 bg-lime-500/8 border-lime-500/20'
                        : offer.matchScore >= 45 ? 'text-yellow-400 bg-yellow-500/8 border-yellow-500/20'
                        : 'text-white/30 bg-white/3 border-white/8'
                      }`}>
                        {offer.matchScore}% fit
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
