import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Calendar, CheckCircle2, XCircle, Clock, Briefcase, Star, Tag, AlertTriangle } from 'lucide-react';
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

export default function StudentAnalytics() {
  const [range, setRange] = useState('all');

  const { data: rawApps, isLoading } = useQuery({
    queryKey: ['my-apps'],
    queryFn:  () => applicationsApi.my().then(r => r.data.data),
  });

  const { data: insightsData } = useQuery({
    queryKey: ['student-analytics'],
    queryFn:  () => analyticsApi.student().then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const mostAppliedDomain = insightsData?.mostAppliedDomain ?? null;
  const missingSkills     = insightsData?.missingSkills     ?? [];

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
      <div className="flex flex-col items-center justify-center py-24 text-white/30">
        <BarChart2 size={40} className="mb-3" />
        <p className="text-sm font-medium">No data yet</p>
        <p className="text-xs mt-1">Apply to internships to start tracking your progress</p>
        <Link to="/student/offers" className="mt-4 text-lime-400 text-xs hover:underline">Browse internships →</Link>
      </div>
    );
  }

  const { totalApplications, shortlistRate, interviewRate, acceptanceRate, avgReviewTimeHours, statusBreakdown } = data;

  const statCards = [
    {
      label:   'Total Applications',
      value:   totalApplications,
      icon:    Briefcase,
      color:   'text-lime-400',
      bg:      'bg-lime-500/10 border-lime-500/20',
    },
    {
      label:   'Shortlist Rate',
      value:   `${shortlistRate}%`,
      icon:    Star,
      color:   'text-purple-400',
      bg:      'bg-purple-500/10 border-purple-500/20',
      sub:     'of applications advanced',
    },
    {
      label:   'Interview Rate',
      value:   `${interviewRate}%`,
      icon:    Calendar,
      color:   'text-indigo-400',
      bg:      'bg-indigo-500/10 border-indigo-500/20',
      sub:     'reached interview stage',
    },
    {
      label:   'Acceptance Rate',
      value:   `${acceptanceRate}%`,
      icon:    CheckCircle2,
      color:   'text-lime-400',
      bg:      'bg-lime-500/10 border-lime-500/20',
      sub:     'received offers',
    },
    {
      label:   'Avg. Review Time',
      value:   avgReviewTimeHours !== null ? `${avgReviewTimeHours}h` : '—',
      icon:    Clock,
      color:   'text-yellow-400',
      bg:      'bg-yellow-500/10 border-yellow-500/20',
      sub:     avgReviewTimeHours !== null ? 'median time to first action' : 'not enough data',
    },
  ];

  const breakdown = [
    { label: 'Active',       value: statusBreakdown.active,       color: 'bg-blue-500',   pct: pct(statusBreakdown.active,      totalApplications) },
    { label: 'Shortlisted',  value: statusBreakdown.shortlisted,  color: 'bg-purple-500', pct: pct(statusBreakdown.shortlisted, totalApplications) },
    { label: 'Interviewed',  value: statusBreakdown.interview,    color: 'bg-indigo-500', pct: pct(statusBreakdown.interview,   totalApplications) },
    { label: 'Accepted',     value: statusBreakdown.accepted + statusBreakdown.offerAccepted, color: 'bg-lime-500', pct: pct(statusBreakdown.accepted + statusBreakdown.offerAccepted, totalApplications) },
    { label: 'Closed',       value: statusBreakdown.rejected,     color: 'bg-red-500',    pct: pct(statusBreakdown.rejected,    totalApplications) },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-white">My Analytics</h2>
          <p className="text-white/40 text-sm mt-0.5">Track your internship search performance</p>
        </div>
        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 border border-white/5">
          {DATE_RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${r.key === range ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {apps.length === 0 && rawApps?.length > 0 && (
        <div className="p-4 bg-white/3 rounded-xl border border-white/8 text-sm text-white/40 text-center">
          No applications in the last {DATE_RANGES.find(r => r.key === range)?.label}. Try "All time".
        </div>
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border p-5 ${s.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-xs text-white/30 mt-1">{s.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-lime-400" />
          <h3 className="font-semibold text-white text-sm">Application Funnel</h3>
        </div>
        <div className="space-y-3">
          {breakdown.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-white/60">{b.label}</span>
                <span className="text-xs font-semibold text-white/40">{b.value} ({b.pct}%)</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${b.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.07 + 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Domain & Missing Skills */}
      {(mostAppliedDomain || missingSkills.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {mostAppliedDomain && (
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-indigo-400" />
                <h3 className="font-semibold text-white text-sm">Most Applied Domain</h3>
              </div>
              <p className="text-2xl font-black text-indigo-400">{mostAppliedDomain}</p>
              <p className="text-xs text-white/30 mt-1">Your most common target sector</p>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-orange-400" />
                <h3 className="font-semibold text-white text-sm">Skills to Work On</h3>
              </div>
              <p className="text-xs text-white/35 mb-3">From offers where you weren't selected</p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-xs rounded-lg bg-orange-500/8 border border-orange-500/20 text-orange-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-lime-400" />
          <h3 className="font-semibold text-white text-sm">Improvement Tips</h3>
        </div>
        <div className="space-y-3">
          {shortlistRate < 30 && (
            <Tip>Your shortlist rate is below 30% — try tailoring your cover letter more specifically to each role.</Tip>
          )}
          {interviewRate < 20 && (
            <Tip>Use the AI Match Score before applying to focus on roles where you're a strong fit.</Tip>
          )}
          {acceptanceRate === 0 && totalApplications >= 5 && (
            <Tip>You haven't received an offer yet. Consider uploading a stronger CV and let AI analyse it for improvements.</Tip>
          )}
          {avgReviewTimeHours !== null && avgReviewTimeHours > 72 && (
            <Tip>Companies are taking over 3 days to review applications. Sending a message after 48 hours can help keep your application top-of-mind.</Tip>
          )}
          {shortlistRate >= 30 && interviewRate >= 20 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-lime-500/5 border border-lime-500/15">
              <CheckCircle2 size={14} className="text-lime-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/60">Strong performance! Your applications are converting well. Keep applying to roles that match your skills.</p>
            </div>
          )}
          {shortlistRate >= 30 && interviewRate >= 20 && acceptanceRate === 0 && (
            <Tip>You're getting shortlisted and interviewed but not offers yet — work on your interview preparation and follow-up messages.</Tip>
          )}
        </div>
      </div>
    </div>
  );
}

function pct(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function Tip({ children }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
      <TrendingUp size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-white/60">{children}</p>
    </div>
  );
}
