import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle2, Clock, Plus, Eye, TrendingUp } from 'lucide-react';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs"
      style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#1B1D1A', boxShadow: '0 4px 12px rgba(24,32,24,.08)' }}>
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5" style={{ color: '#1E5B45' }}>{payload[0].value} application{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

export default function CompanyDashboard() {
  const { user } = useAuth();
  const name = user?.companyProfile?.companyName || 'Company';

  const { data: offersData } = useQuery({
    queryKey: ['my-offers'],
    queryFn:  () => offersApi.myOffers({ limit: 100 }).then(r => r.data.data),
  });

  const { data: appsData } = useQuery({
    queryKey: ['company-apps'],
    queryFn:  () => applicationsApi.companyAll({ limit: 500 }).then(r => r.data.data),
  });

  const offers = offersData || [];
  const apps   = appsData  || [];

  const counts = {
    total:       apps.length,
    newApps:     apps.filter(a => a.status === 'submitted').length,
    reviewing:   apps.filter(a => ['under_review', 'final_review'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    interview:   apps.filter(a => ['interview_scheduled', 'interview_completed'].includes(a.status)).length,
    accepted:    apps.filter(a => ['accepted', 'offer_accepted'].includes(a.status)).length,
    rejected:    apps.filter(a => ['rejected', 'withdrawn', 'offer_declined'].includes(a.status)).length,
  };

  const acceptanceRate = counts.total > 0 ? Math.round((counts.accepted / counts.total) * 100) : 0;

  const chartData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const count = apps.filter(a => {
        const date = new Date(a.appliedAt);
        return date.getFullYear() === d.getFullYear() && date.getMonth() === d.getMonth();
      }).length;
      return { month: months[d.getMonth()], apps: count, isCurrent: i === 5 };
    });
  }, [apps]);

  const totalApps = counts.total || 1;

  const pipeline = [
    { label: 'New',         value: counts.newApps,     color: '#3B82F6' },
    { label: 'Reviewing',   value: counts.reviewing,   color: '#EAB308' },
    { label: 'Shortlisted', value: counts.shortlisted, color: '#A855F7' },
    { label: 'Interview',   value: counts.interview,   color: '#6366F1' },
    { label: 'Accepted',    value: counts.accepted,    color: '#1E5B45' },
    { label: 'Rejected',    value: counts.rejected,    color: '#EF4444' },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Welcome, {name}</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Manage your internship pipeline</p>
        </div>
        <Link to="/company/offers/post"
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl"
          style={{ background: '#1E5B45', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
          onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
          <Plus size={16} /> Post Internship
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Active Offers"   value={offers.filter(o => o.status === 'open').length}  icon={Briefcase}    color="green"  />
        <StatCard label="Total Apps"      value={counts.total}                                    icon={FileText}     color="blue"   />
        <StatCard label="New"             value={counts.newApps}                                  icon={Clock}        color="orange" />
        <StatCard label="Accepted"        value={counts.accepted}                                 icon={CheckCircle2} color="green"  />
        <StatCard label="Acceptance Rate" value={`${acceptanceRate}%`}                            icon={TrendingUp}   color="green"  sub={counts.total > 0 ? `${counts.accepted}/${counts.total}` : 'No data'} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Activity chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Application Activity</h3>
            <span className="text-xs" style={{ color: '#C0BFBA' }}>Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9A9E97', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(30,91,69,0.04)' }} />
                <Bar dataKey="apps" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.isCurrent ? '#1E5B45' : '#E7E6DF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: '#1B1D1A' }}>Pipeline Overview</h3>
          <div className="space-y-3">
            {pipeline.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: '#6B6F69' }}>{item.label}</span>
                  <span className="text-xs font-semibold" style={{ color: '#1B1D1A' }}>{item.value}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: totalApps > 0 ? `${(item.value / totalApps) * 100}%` : '0%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active offers table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E7E6DF' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Active Internship Posts</h3>
          <Link to="/company/offers" className="text-xs font-semibold" style={{ color: '#1E5B45', textDecoration: 'none' }}>View all →</Link>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C0BFBA' }}>
            <Briefcase size={36} className="mb-3 opacity-50" />
            <p className="text-sm">No offers posted yet</p>
            <Link to="/company/offers/post" className="mt-3 text-xs font-semibold" style={{ color: '#1E5B45' }}>
              Post your first internship →
            </Link>
          </div>
        ) : (
          <div>
            {offers.slice(0, 5).map((offer, i) => (
              <div key={offer.id} className="flex items-center gap-4 px-6 py-4 transition-colors"
                style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F6F5F1'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>{offer.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                    {offer.location} · {offer.durationWeeks}w ·{' '}
                    <span style={{ color: offer.filledCount >= offer.openings ? '#D97706' : '#9A9E97' }}>
                      {offer.filledCount}/{offer.openings} filled
                    </span>
                  </p>
                </div>
                <StatusBadge status={offer.status} />
                <div className="flex items-center gap-3">
                  <span className="text-xs flex items-center gap-1" style={{ color: '#9A9E97' }}>
                    <Eye size={11} /> {offer.viewsCount}
                  </span>
                  {(() => {
                    const offerApps = apps.filter(a => a.offerId === offer.id);
                    const newCount  = offerApps.filter(a => a.status === 'submitted').length;
                    return (
                      <Link to={`/company/applications?offer=${offer.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#1E5B45', textDecoration: 'none' }}>
                        {offerApps.length} applicant{offerApps.length !== 1 ? 's' : ''}
                        {newCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#1E5B45', color: '#fff' }}>
                            {newCount} new
                          </span>
                        )}
                        →
                      </Link>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
