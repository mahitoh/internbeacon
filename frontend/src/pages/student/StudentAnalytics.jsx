import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Calendar, CheckCircle2, Clock, Briefcase, Star, Tag, AlertTriangle } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { analyticsApi } from '../../api/analytics';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

const DATE_RANGES = [
  { key: '30d', label: '30 days', days: 30  },
  { key: '90d', label: '3 months', days: 90  },
  { key: 'all', label: 'All time', days: null },
];

function calcStats(apps) {
  const total        = apps.length;
  const shortlisted  = apps.filter(a => ['shortlisted','interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length;
  const interviewed  = apps.filter(a => ['interview_scheduled','interview_completed','final_review','accepted','offer_accepted'].includes(a.status)).length;
  const accepted     = apps.filter(a => ['accepted','offer_accepted'].includes(a.status)).length;
  const shortlistRate  = total > 0 ? Math.round((shortlisted  / total) * 100) : 0;
  const interviewRate  = total > 0 ? Math.round((interviewed  / total) * 100) : 0;
  const acceptanceRate = total > 0 ? Math.round((accepted     / total) * 100) : 0;
  const statusBreakdown = {
    active:        apps.filter(a => ['submitted','under_review','final_review'].includes(a.status)).length,
    shortlisted:   apps.filter(a => a.status === 'shortlisted').length,
    interview:     apps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
    accepted:      apps.filter(a => a.status === 'accepted').length,
    offerAccepted: apps.filter(a => a.status === 'offer_accepted').length,
    rejected:      apps.filter(a => ['rejected','withdrawn','offer_declined'].includes(a.status)).length,
  };
  return { totalApplications: total, shortlistRate, interviewRate, acceptanceRate, avgReviewTimeHours: null, statusBreakdown };
}

function pct(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

// Light-theme card for stats
function StatCard({ label, value, sub, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl p-5 h-full" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-3xl font-black" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#1B1D1A' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>{sub}</p>}
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
      <TrendingUp size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
      <p className="text-sm" style={{ color: '#6B6F69' }}>{children}</p>
    </div>
  );
}

export default function StudentAnalytics() {
  const [range, setRange] = useState('all');

  const { data: rawApps, isLoading } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my({ limit: 100 }).then(r => r.data.data),
  });

  const { data: insightsData } = useQuery({
    queryKey: ['student-analytics'],
    queryFn:  () => analyticsApi.student().then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const mostAppliedDomain = insightsData?.mostAppliedDomain  ?? null;
  const missingSkills     = insightsData?.missingSkills      ?? [];
  const avgReviewHours    = insightsData?.avgReviewTimeHours ?? null;

  const apps = useMemo(() => {
    if (!rawApps) return [];
    const selectedRange = DATE_RANGES.find(r => r.key === range);
    if (!selectedRange?.days) return rawApps;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selectedRange.days);
    return rawApps.filter(a => a.appliedAt && new Date(a.appliedAt) >= cutoff);
  }, [rawApps, range]);

  const data = useMemo(() => calcStats(apps), [apps]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  if (!rawApps?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
        style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#C0BFBA' }}>
        <BarChart2 size={40} className="mb-3 opacity-50" />
        <p className="text-sm font-medium">No data yet</p>
        <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>Apply to internships to start tracking your progress</p>
        <Link to="/student/offers" className="mt-4 text-xs font-semibold" style={{ color: '#1E5B45' }}>
          Browse internships →
        </Link>
      </div>
    );
  }

  const { totalApplications, shortlistRate, interviewRate, acceptanceRate, statusBreakdown } = data;

  const statCards = [
    { label: 'Total Applications', value: totalApplications, icon: Briefcase,    iconBg: '#EDF2EE', iconColor: '#1E5B45' },
    { label: 'Shortlist Rate',     value: `${shortlistRate}%`,  icon: Star,      iconBg: '#F3EEFB', iconColor: '#7C4EC0', sub: 'of applications advanced' },
    { label: 'Interview Rate',     value: `${interviewRate}%`,  icon: Calendar,  iconBg: '#EEF2FF', iconColor: '#4338CA', sub: 'reached interview stage' },
    { label: 'Acceptance Rate',    value: `${acceptanceRate}%`, icon: CheckCircle2, iconBg: '#EDF2EE', iconColor: '#1E5B45', sub: 'received offers' },
    { label: 'Avg. Review Time',   value: avgReviewHours !== null ? `${avgReviewHours}h` : '—', icon: Clock, iconBg: '#FFFBEB', iconColor: '#D97706', sub: avgReviewHours !== null ? 'median time to first action' : 'not enough data' },
  ];

  const breakdown = [
    { label: 'Active',      value: statusBreakdown.active,       color: '#3B82F6', pct: pct(statusBreakdown.active,      totalApplications) },
    { label: 'Shortlisted', value: statusBreakdown.shortlisted,  color: '#A855F7', pct: pct(statusBreakdown.shortlisted, totalApplications) },
    { label: 'Interviewed', value: statusBreakdown.interview,    color: '#6366F1', pct: pct(statusBreakdown.interview,   totalApplications) },
    { label: 'Accepted',    value: statusBreakdown.accepted + statusBreakdown.offerAccepted, color: '#1E5B45', pct: pct(statusBreakdown.accepted + statusBreakdown.offerAccepted, totalApplications) },
    { label: 'Closed',      value: statusBreakdown.rejected,     color: '#EF4444', pct: pct(statusBreakdown.rejected,    totalApplications) },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>My Analytics</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Track your internship search performance</p>
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

      {apps.length === 0 && rawApps?.length > 0 && (
        <div className="p-4 rounded-xl text-sm text-center"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
          No applications in the last {DATE_RANGES.find(r => r.key === range)?.label}. Try "All time".
        </div>
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} className="h-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Funnel + Tips */}
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* Funnel */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Application Funnel</h3>
          </div>
          <div className="space-y-3">
            {breakdown.map((b, i) => (
              <motion.div key={b.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: '#6B6F69' }}>{b.label}</span>
                  <span className="text-xs font-semibold" style={{ color: '#9A9E97' }}>{b.value} ({b.pct}%)</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: b.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.07 + 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Improvement Tips</h3>
          </div>
          <div className="space-y-3">
            {shortlistRate < 30 && (
              <Tip>Your shortlist rate is below 30% — try tailoring your cover letter more specifically to each role.</Tip>
            )}
            {interviewRate < 20 && (
              <Tip>Check the match score before applying — focus on roles where you score 70% or higher for better results.</Tip>
            )}
            {acceptanceRate === 0 && totalApplications >= 5 && (
              <Tip>You haven't received an offer yet. Make sure your profile has your city, programme, and skills filled in — these directly affect your match score.</Tip>
            )}
            {avgReviewHours !== null && avgReviewHours > 72 && (
              <Tip>Companies are taking over 3 days to review applications. Sending a message after 48 hours can help keep your application top-of-mind.</Tip>
            )}
            {shortlistRate >= 30 && interviewRate >= 20 && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#1E5B45' }} />
                <p className="text-sm" style={{ color: '#1B1D1A' }}>Strong performance! Your applications are converting well. Keep applying to roles that match your skills.</p>
              </div>
            )}
            {shortlistRate >= 30 && interviewRate >= 20 && acceptanceRate === 0 && (
              <Tip>You're getting shortlisted and interviewed but not offers yet — work on your interview preparation and follow-up messages.</Tip>
            )}
            {shortlistRate >= 30 && interviewRate >= 20 && acceptanceRate > 0 && shortlistRate < 60 && missingSkills.length === 0 && (
              <p className="text-sm text-center py-2" style={{ color: '#9A9E97' }}>No specific tips right now — keep up the good work!</p>
            )}
          </div>
        </div>
      </div>

      {/* Domain & Missing Skills */}
      {(mostAppliedDomain || missingSkills.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-5">
          {mostAppliedDomain && (
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} style={{ color: '#6366F1' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Most Applied Domain</h3>
              </div>
              <p className="text-2xl font-black" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#4338CA' }}>
                {mostAppliedDomain}
              </p>
              <p className="text-xs mt-1" style={{ color: '#9A9E97' }}>Your most common target sector</p>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: '#D97706' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Skills to Work On</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: '#9A9E97' }}>From offers where you weren't selected</p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-xs rounded-lg"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
