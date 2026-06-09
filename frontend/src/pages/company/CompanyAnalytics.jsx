import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import Spinner from '../../components/ui/Spinner';

// Grouped for display — each entry maps to one or more real statuses
const PIE_GROUPS = [
  { key: 'New',         statuses: ['submitted'],                                          color: '#f97316' },
  { key: 'Reviewing',   statuses: ['under_review', 'final_review'],                       color: '#3b82f6' },
  { key: 'Shortlisted', statuses: ['shortlisted'],                                        color: '#a855f7' },
  { key: 'Interview',   statuses: ['interview_scheduled', 'interview_completed'],         color: '#6366f1' },
  { key: 'Accepted',    statuses: ['accepted', 'offer_accepted'],                         color: '#84cc16' },
  { key: 'Rejected',    statuses: ['rejected', 'withdrawn', 'offer_declined'],            color: '#ef4444' },
];

export default function CompanyAnalytics() {
  const { data: offersData, isLoading: offersLoading } = useQuery({
    queryKey: ['my-offers'],
    queryFn:  () => offersApi.myOffers({ limit: 200 }).then(r => r.data.data || []),
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll({ limit: 500 }).then(r => r.data.data || []),
  });

  const offers = offersData || [];
  const apps   = appsData   || [];

  const stats = useMemo(() => {
    const total        = apps.length;
    const accepted     = apps.filter(a => ['accepted', 'offer_accepted'].includes(a.status)).length;
    const open         = offers.filter(o => o.status === 'open').length;
    const awaitReview  = apps.filter(a => a.status === 'submitted').length;
    const acceptRate   = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, accepted, open, awaitReview, acceptRate };
  }, [apps, offers]);

  // Applications grouped by month (last 6 months)
  const appsByMonth = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        apps:  0,
      });
    }
    apps.forEach(a => {
      const key    = a.appliedAt?.slice(0, 7);
      const bucket = months.find(m => m.key === key);
      if (bucket) bucket.apps++;
    });
    return months;
  }, [apps]);

  // Status breakdown pie — grouped into meaningful stages
  const statusPie = useMemo(() => {
    return PIE_GROUPS
      .map(g => ({
        name:  g.key,
        value: apps.filter(a => g.statuses.includes(a.status)).length,
        color: g.color,
      }))
      .filter(d => d.value > 0);
  }, [apps]);

  // Top offers by applications
  const topOffers = useMemo(() => {
    const map = {};
    apps.forEach(a => {
      const key = a.offerId;
      if (!map[key]) map[key] = { title: a.offer?.title || 'Unknown', count: 0 };
      map[key].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [apps]);

  // Interview conversion: interview / (shortlisted + interview + beyond)
  const interviewConvRate = useMemo(() => {
    const interviewed = apps.filter(a =>
      ['interview_scheduled', 'interview_completed', 'final_review', 'accepted', 'offer_accepted'].includes(a.status)
    ).length;
    const shortlistedPlus = apps.filter(a =>
      ['shortlisted', 'interview_scheduled', 'interview_completed', 'final_review', 'accepted', 'offer_accepted', 'rejected'].includes(a.status)
    ).length;
    return shortlistedPlus > 0 ? Math.round((interviewed / shortlistedPlus) * 100) : 0;
  }, [apps]);

  if (offersLoading || appsLoading) {
    return <div className="flex justify-center py-20"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Recruitment Analytics</h2>
        <p className="text-white/40 text-sm mt-0.5">Track your internship hiring performance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total Applications"  value={stats.total} />
        <Stat label="Open Positions"      value={stats.open} />
        <Stat label="Acceptance Rate"     value={`${stats.acceptRate}%`} />
        <Stat label="Awaiting Review"     value={stats.awaitReview} highlight={stats.awaitReview > 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications over time */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Applications Over Time</h3>
            <span className="text-xs text-white/30">Last 6 months</span>
          </div>
          {apps.length === 0 ? (
            <EmptyChart message="No applications yet" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appsByMonth} barSize={28}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v, 'Applications']}
                  />
                  <Bar dataKey="apps" fill="#84cc16" radius={[6, 6, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Pipeline Breakdown</h3>
          {statusPie.length === 0 ? (
            <EmptyChart message="No data yet" />
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {statusPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-white/50">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Top offers */}
        {topOffers.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white mb-4">Most Applied Positions</h3>
            <div className="space-y-3">
              {topOffers.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-white/20 w-4 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/80 truncate">{o.title}</span>
                      <span className="text-xs text-white/40 ml-2 flex-shrink-0">{o.count} app{o.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-lime-500 rounded-full transition-all"
                        style={{ width: `${Math.round((o.count / (topOffers[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Funnel metrics */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Hiring Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied',        value: apps.length,                                                                                                           color: 'bg-blue-500' },
              { label: 'Shortlisted',    value: apps.filter(a => ['shortlisted','interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length, color: 'bg-purple-500' },
              { label: 'Interviewed',    value: apps.filter(a => ['interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length, color: 'bg-indigo-500' },
              { label: 'Offer Extended', value: apps.filter(a => ['accepted','offer_accepted','offer_declined'].includes(a.status)).length,                            color: 'bg-lime-500' },
              { label: 'Offer Accepted', value: apps.filter(a => a.status === 'offer_accepted').length,                                                                color: 'bg-lime-400' },
            ].map(item => {
              const pct = apps.length > 0 ? Math.round((item.value / apps.length) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/50">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">{pct}%</span>
                      <span className="text-xs font-semibold text-white w-6 text-right">{item.value}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {apps.length > 0 && (
              <p className="text-xs text-white/20 pt-1">Interview-to-offer conversion: <span className="text-white/40 font-semibold">{interviewConvRate}%</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'bg-orange-500/5 border-orange-500/20' : 'bg-[#1a1a1a] border-white/5'}`}>
      <p className={`text-xs uppercase tracking-wide ${highlight ? 'text-orange-400/70' : 'text-white/40'}`}>{label}</p>
      <p className={`text-3xl font-black mt-1 ${highlight ? 'text-orange-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="h-44 flex items-center justify-center text-white/20 text-sm">{message}</div>
  );
}
