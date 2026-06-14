import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import Spinner from '../../components/ui/Spinner';

const PIE_GROUPS = [
  { key: 'New',         statuses: ['submitted'],                                                  color: '#F97316' },
  { key: 'Reviewing',   statuses: ['under_review', 'final_review'],                               color: '#3B82F6' },
  { key: 'Shortlisted', statuses: ['shortlisted'],                                                color: '#A855F7' },
  { key: 'Interview',   statuses: ['interview_scheduled', 'interview_completed'],                 color: '#6366F1' },
  { key: 'Accepted',    statuses: ['accepted', 'offer_accepted'],                                 color: '#1E5B45' },
  { key: 'Rejected',    statuses: ['rejected', 'withdrawn', 'offer_declined'],                   color: '#EF4444' },
];

const DATE_RANGES = [
  { key: '30d', label: '30 days',  days: 30   },
  { key: '90d', label: '3 months', days: 90   },
  { key: 'all', label: 'All time', days: null  },
];

const tooltipStyle = { background: '#fff', border: '1px solid #E7E6DF', borderRadius: 8, fontSize: 12, color: '#1B1D1A', boxShadow: '0 4px 12px rgba(24,32,24,.08)' };

function Stat({ label, value, highlight }) {
  return (
    <div className="rounded-2xl p-5" style={{
      background: highlight ? '#FFFBEB' : '#fff',
      border: `1px solid ${highlight ? '#FDE68A' : '#E7E6DF'}`,
    }}>
      <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: highlight ? '#D97706' : '#9A9E97' }}>{label}</p>
      <p className="text-3xl font-black mt-1" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: highlight ? '#D97706' : '#1B1D1A' }}>{value}</p>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="h-44 flex items-center justify-center text-sm" style={{ color: '#C0BFBA' }}>{message}</div>
  );
}

export default function CompanyAnalytics() {
  const [range, setRange] = useState('all');

  const { data: offersData, isLoading: offersLoading } = useQuery({
    queryKey: ['my-offers'],
    queryFn:  () => offersApi.myOffers({ limit: 200 }).then(r => r.data.data || []),
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll({ limit: 500 }).then(r => r.data.data || []),
  });

  const offers  = offersData || [];
  const allApps = appsData   || [];

  const apps = useMemo(() => {
    const selectedRange = DATE_RANGES.find(r => r.key === range);
    if (!selectedRange?.days) return allApps;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selectedRange.days);
    return allApps.filter(a => a.appliedAt && new Date(a.appliedAt) >= cutoff);
  }, [allApps, range]);

  const stats = useMemo(() => {
    const total       = apps.length;
    const accepted    = apps.filter(a => ['accepted', 'offer_accepted'].includes(a.status)).length;
    const open        = offers.filter(o => o.status === 'open').length;
    const awaitReview = apps.filter(a => a.status === 'submitted').length;
    const acceptRate  = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, accepted, open, awaitReview, acceptRate };
  }, [apps, offers]);

  const appsByMonth = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ month: d.toLocaleString('default', { month: 'short' }), key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, apps: 0 });
    }
    apps.forEach(a => { const key = a.appliedAt?.slice(0, 7); const bucket = months.find(m => m.key === key); if (bucket) bucket.apps++; });
    return months;
  }, [apps]);

  const statusPie = useMemo(() =>
    PIE_GROUPS.map(g => ({ name: g.key, value: apps.filter(a => g.statuses.includes(a.status)).length, color: g.color })).filter(d => d.value > 0),
  [apps]);

  const topOffers = useMemo(() => {
    const map = {};
    apps.forEach(a => { const key = a.offerId; if (!map[key]) map[key] = { title: a.offer?.title || 'Unknown', count: 0 }; map[key].count++; });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [apps]);

  const interviewConvRate = useMemo(() => {
    const interviewed    = apps.filter(a => ['interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length;
    const shortlistedPlus = apps.filter(a => ['shortlisted','interview_scheduled','interview_completed','final_review','accepted','offer_accepted','rejected'].includes(a.status)).length;
    return shortlistedPlus > 0 ? Math.round((interviewed / shortlistedPlus) * 100) : 0;
  }, [apps]);

  if (offersLoading || appsLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Recruitment Analytics</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Track your internship hiring performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#EFEEE8' }}>
          {DATE_RANGES.map(r => {
            const isActive = r.key === range;
            return (
              <button key={r.key} onClick={() => setRange(r.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={isActive
                  ? { background: '#fff', color: '#1B1D1A', boxShadow: '0 1px 3px rgba(24,32,24,.08)', border: '1px solid #E7E6DF' }
                  : { color: '#6B6F69' }}>
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total Applications" value={stats.total} />
        <Stat label="Open Positions"     value={stats.open} />
        <Stat label="Acceptance Rate"    value={`${stats.acceptRate}%`} />
        <Stat label="Awaiting Review"    value={stats.awaitReview} highlight={stats.awaitReview > 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Applications Over Time</h3>
            <span className="text-xs" style={{ color: '#C0BFBA' }}>Last 6 months</span>
          </div>
          {apps.length === 0 ? <EmptyChart message="No applications yet" /> : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appsByMonth} barSize={28}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9A9E97', fontSize: 11 }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(30,91,69,0.04)' }} contentStyle={tooltipStyle} formatter={v => [v, 'Applications']} />
                  <Bar dataKey="apps" fill="#1E5B45" radius={[6, 6, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: '#1B1D1A' }}>Pipeline Breakdown</h3>
          {statusPie.length === 0 ? <EmptyChart message="No data yet" /> : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {statusPie.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs" style={{ color: '#6B6F69' }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#1B1D1A' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid sm:grid-cols-2 gap-5">
        {topOffers.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#1B1D1A' }}>Most Applied Positions</h3>
            <div className="space-y-3">
              {topOffers.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: '#C0BFBA' }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm truncate" style={{ color: '#1B1D1A' }}>{o.title}</span>
                      <span className="text-xs ml-2 flex-shrink-0" style={{ color: '#9A9E97' }}>{o.count} app{o.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((o.count / (topOffers[0]?.count || 1)) * 100)}%`, background: '#1E5B45' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: '#1B1D1A' }}>Hiring Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied',        value: apps.length,                                                                                                                            color: '#3B82F6' },
              { label: 'Shortlisted',    value: apps.filter(a => ['shortlisted','interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length, color: '#A855F7' },
              { label: 'Interviewed',    value: apps.filter(a => ['interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length,             color: '#6366F1' },
              { label: 'Offer Extended', value: apps.filter(a => ['accepted','offer_accepted','offer_declined'].includes(a.status)).length,                                             color: '#1E5B45' },
              { label: 'Offer Accepted', value: apps.filter(a => a.status === 'offer_accepted').length,                                                                                 color: '#10342A' },
            ].map(item => {
              const pct = apps.length > 0 ? Math.round((item.value / apps.length) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#6B6F69' }}>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: '#9A9E97' }}>{pct}%</span>
                      <span className="text-xs font-semibold w-6 text-right" style={{ color: '#1B1D1A' }}>{item.value}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                </div>
              );
            })}
            {apps.length > 0 && (
              <p className="text-xs pt-1" style={{ color: '#9A9E97' }}>
                Interview-to-offer conversion: <span className="font-semibold" style={{ color: '#6B6F69' }}>{interviewConvRate}%</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
