import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle2, Clock, Plus, Eye, TrendingUp } from 'lucide-react';
import { offersApi } from '../../api/offers';
import { applicationsApi } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const name = user?.companyProfile?.companyName || 'Company';
  const tooltipStyle = isDark
    ? { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }
    : { background: '#ffffff', border: '1px solid #e7e4d5', borderRadius: 8, fontSize: 12, color: '#0f2d20' };

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

  const acceptanceRate = counts.total > 0
    ? Math.round((counts.accepted / counts.total) * 100)
    : 0;

  const chartData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const count = apps.filter(a => {
        const date = new Date(a.appliedAt);
        return date.getFullYear() === d.getFullYear() && date.getMonth() === d.getMonth();
      }).length;
      return { month: months[d.getMonth()], apps: count };
    });
  }, [apps]);

  const totalApps = counts.total || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Welcome, {name}</h2>
          <p className="text-white/40 text-sm mt-0.5">Manage your internship pipeline</p>
        </div>
        <Link to="/company/offers/post"
          className="flex items-center gap-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={16} /> Post Internship
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Active Offers"   value={offers.filter(o => o.status === 'open').length}  icon={Briefcase}     color="lime"   />
        <StatCard label="Total Apps"      value={counts.total}                                    icon={FileText}      color="blue"   />
        <StatCard label="New"             value={counts.newApps}                                  icon={Clock}         color="orange" />
        <StatCard label="Accepted"        value={counts.accepted}                                 icon={CheckCircle2}  color="lime"   />
        <StatCard label="Acceptance Rate" value={`${acceptanceRate}%`}                            icon={TrendingUp}    color="lime"   sub={counts.total > 0 ? `${counts.accepted}/${counts.total}` : 'No data'} />
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications chart */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Application Activity</h3>
            <span className="text-xs text-white/30">Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,45,32,0.45)', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,45,32,0.04)' }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,45,32,0.6)' }}
                />
                <Bar dataKey="apps" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? '#84cc16' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,45,32,0.08)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline overview */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Pipeline Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'New',         value: counts.newApps,     color: 'bg-blue-500' },
              { label: 'Reviewing',   value: counts.reviewing,   color: 'bg-yellow-500' },
              { label: 'Shortlisted', value: counts.shortlisted, color: 'bg-purple-500' },
              { label: 'Interview',   value: counts.interview,   color: 'bg-indigo-500' },
              { label: 'Accepted',    value: counts.accepted,    color: 'bg-lime-500' },
              { label: 'Rejected',    value: counts.rejected,    color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50">{item.label}</span>
                  <span className="text-xs font-semibold text-white">{item.value}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full">
                  <div className={`h-full rounded-full ${item.color}`}
                    style={{ width: totalApps > 0 ? `${(item.value / totalApps) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active offers */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Active Internship Posts</h3>
          <Link to="/company/offers" className="text-xs text-lime-400 hover:text-lime-300">View all →</Link>
        </div>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <Briefcase size={36} className="mb-3" />
            <p className="text-sm">No offers posted yet</p>
            <Link to="/company/offers/post" className="mt-3 text-lime-400 text-xs hover:underline">Post your first internship →</Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {offers.slice(0, 5).map(offer => (
              <div key={offer.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{offer.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {offer.location} · {offer.durationWeeks}w ·{' '}
                    <span className={offer.filledCount >= offer.openings ? 'text-amber-400/70' : ''}>
                      {offer.filledCount}/{offer.openings} filled
                    </span>
                  </p>
                </div>
                <StatusBadge status={offer.status} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30 flex items-center gap-1"><Eye size={11} /> {offer.viewsCount}</span>
                  <Link to={`/company/applications?offer=${offer.id}`} className="text-xs text-lime-400 hover:text-lime-300">View apps →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
