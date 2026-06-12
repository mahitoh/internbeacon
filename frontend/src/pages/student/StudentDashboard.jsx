import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle2, XCircle, Briefcase, ArrowRight,
  TrendingUp, Sparkles, Brain, Zap, Calendar, ChevronRight,
  BookOpen, Languages, GraduationCap, Code2, RefreshCw,
  Upload, Search, User, Lightbulb,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { applicationsApi } from '../../api/applications';
import { offersApi } from '../../api/offers';
import { messagesApi } from '../../api/messages';
import { aiApi } from '../../api/ai';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/dashboard/StatCard';
import OfferCard from '../../components/offers/OfferCard';
import { StatusBadge } from '../../components/ui/Badge';
import { formatRelativeTime } from '../../lib/utils';

const STATUS_COLORS = {
  active:      '#3b82f6',
  shortlisted: '#a855f7',
  interview:   '#6366f1',
  accepted:    '#84cc16',
  rejected:    '#ef4444',
};

/* ─── small helpers ─────────────────────────────────────── */

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between px-6 py-4 border-b border-white/5">
      <div>
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, label, cta, to }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-white/30">
      <Icon size={32} className="mb-3 opacity-40" />
      <p className="text-xs">{label}</p>
      {cta && (
        <Link to={to} className="mt-2 text-lime-400 text-xs hover:underline">{cta} →</Link>
      )}
    </div>
  );
}

/* ─── AI badge ───────────────────────────────────────────── */
function AIBadge({ label = 'AI-powered', color = 'lime' }) {
  const cls = color === 'purple'
    ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    : 'text-lime-400 bg-lime-500/10 border-lime-500/20';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      <Sparkles size={9} /> {label}
    </span>
  );
}

/* ─── weekly chart tooltip ───────────────────────────────── */
function ChartTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-lg border text-xs ${
      isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-[#d4cfbc] text-[#0f2d20]'
    }`}>
      <p className="font-semibold">{label}</p>
      <p className="text-lime-400 mt-0.5">{payload[0].value} application{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const name       = user?.studentProfile?.firstName || 'Student';
  const aiSummary  = user?.studentProfile?.aiSummary;
  const profile    = user?.studentProfile;

  const { data: appsData }    = useQuery({ queryKey: ['my-apps'],         queryFn: () => applicationsApi.my({ limit: 100 }).then(r => r.data.data) });
  const { data: recData }     = useQuery({ queryKey: ['offers-rec'],      queryFn: () => offersApi.recommended(6).then(r => r.data.data) });
  const { data: threadsData } = useQuery({ queryKey: ['message-threads'], queryFn: () => messagesApi.threads().then(r => r.data.data) });

  const apps      = appsData  || [];
  const recOffers = recData   || [];

  const threadUnreadMap = useMemo(() => (threadsData || []).reduce((m, t) => {
    m[t.appId] = t.unreadCount; return m;
  }, {}), [threadsData]);

  // Skill gap: the missing skill that blocks the most recommended offers.
  // Aggregated from the per-offer match breakdowns — no extra API call.
  const skillGap = useMemo(() => {
    const counts = {};
    for (const offer of recOffers) {
      for (const skill of offer.matchBreakdown?.skills?.missing || []) {
        const key = skill.trim();
        if (key) counts[key] = (counts[key] || 0) + 1;
      }
    }
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return ranked.length ? { skill: ranked[0][0], offers: ranked[0][1] } : null;
  }, [recOffers]);

  const counts = useMemo(() => ({
    total:       apps.length,
    active:      apps.filter(a => ['submitted','under_review','final_review'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    interview:   apps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).length,
    accepted:    apps.filter(a => ['accepted','offer_accepted'].includes(a.status)).length,
    rejected:    apps.filter(a => ['rejected','withdrawn','offer_declined'].includes(a.status)).length,
  }), [apps]);

  const pieData = useMemo(() => [
    { name: 'Active',      value: counts.active,      color: STATUS_COLORS.active },
    { name: 'Shortlisted', value: counts.shortlisted,  color: STATUS_COLORS.shortlisted },
    { name: 'Interview',   value: counts.interview,    color: STATUS_COLORS.interview },
    { name: 'Accepted',    value: counts.accepted,     color: STATUS_COLORS.accepted },
    { name: 'Rejected',    value: counts.rejected,     color: STATUS_COLORS.rejected },
  ].filter(d => d.value > 0), [counts]);

  /* last 8 weeks of application activity */
  const weeklyActivity = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const start = new Date(now);
      start.setDate(now.getDate() - (7 - i) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      const label = start.toLocaleDateString('en', { month: 'short', day: 'numeric' });
      const count = apps.filter(a => {
        const d = new Date(a.appliedAt);
        return d >= start && d < end;
      }).length;
      return { week: label, applications: count };
    });
  }, [apps]);

  /* upcoming interviews */
  const interviews = useMemo(() =>
    apps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).slice(0, 4),
  [apps]);

  /* profile completeness for AI prompt */
  const profileFields = [
    profile?.skills?.length > 0,
    profile?.programme,
    profile?.studyYear,
    profile?.languages?.length > 0,
    !!aiSummary,
  ];
  const profileComplete = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const axisColor   = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,45,32,0.30)';
  const gridColor   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,45,32,0.06)';
  const tooltipStyle = isDark
    ? { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }
    : { background: '#ffffff', border: '1px solid #d4cfbc', borderRadius: 8, fontSize: 12, color: '#0f2d20' };

  return (
    <div className="space-y-5">

      {/* ── Greeting ─────────────────────────────────────── */}
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

      {/* ── Onboarding cards (shown only when no activity yet) ── */}
      {apps.length === 0 && !profile?.cvUrl && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1,  y: 0  }}
          className="grid sm:grid-cols-3 gap-3"
        >
          {[
            {
              step: '01',
              title: 'Complete your profile',
              desc: 'Add your university, programme, skills, and bio so companies can evaluate you.',
              icon: User,
              color: 'blue',
              cta: 'Go to profile',
              to: '/student/profile',
            },
            {
              step: '02',
              title: 'Upload your CV',
              desc: 'Upload a PDF CV and let AI extract your skills and experience automatically.',
              icon: Upload,
              color: 'lime',
              cta: 'Upload CV',
              to: '/student/profile',
            },
            {
              step: '03',
              title: 'Browse internships',
              desc: 'Explore open internship offers and apply to positions that match your goals.',
              icon: Search,
              color: 'purple',
              cta: 'Browse offers',
              to: '/student/offers',
            },
          ].map(({ step, title, desc, icon: Icon, color, cta, to }) => {
            const palette = {
              blue:   { bg: 'bg-blue-400/10',   icon: 'text-blue-400',   btn: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'   },
              lime:   { bg: 'bg-lime-400/10',   icon: 'text-lime-400',   btn: 'bg-lime-500/10 border-lime-500/20 text-lime-400 hover:bg-lime-500/20'   },
              purple: { bg: 'bg-purple-400/10', icon: 'text-purple-400', btn: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' },
            }[color];
            return (
              <div key={step} className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${palette.bg}`}>
                    <Icon size={18} className={palette.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-white/15 tabular-nums">STEP {step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{desc}</p>
                </div>
                <Link to={to}
                  className={`mt-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all w-fit ${palette.btn}`}>
                  {cta} <ArrowRight size={11} />
                </Link>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* ── Stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total"       value={counts.total}       icon={FileText}     color="lime" />
        <StatCard label="Active"      value={counts.active}      icon={Clock}        color="blue" />
        <StatCard label="Accepted"    value={counts.accepted}    icon={CheckCircle2} color="lime" />
        <StatCard label="Rejected"    value={counts.rejected}    icon={XCircle}      color="red"  />
      </div>

      {/* ── Row 2: Activity chart + Interviews ───────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Weekly activity bar chart */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader
            title="Application Activity"
            sub="Applications submitted per week"
            action={<span className="text-xs text-white/30">Last 8 weeks</span>}
          />
          <div className="p-5">
            {apps.length === 0 ? (
              <EmptyState icon={TrendingUp} label="No activity yet" cta="Start applying" to="/student/offers" />
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} barSize={18}>
                    <CartesianGrid vertical={false} stroke={gridColor} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
                    <Tooltip content={<ChartTooltip isDark={isDark} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,45,32,0.04)' }} />
                    <Bar dataKey="applications" fill="#84cc16" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader
            title="Interviews"
            sub="Scheduled & completed"
            action={
              counts.interview > 0
                ? <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">{counts.interview}</span>
                : null
            }
          />
          {interviews.length === 0 ? (
            <EmptyState icon={Calendar} label="No interviews yet" />
          ) : (
            <div className="divide-y divide-white/5">
              {interviews.map(app => (
                <Link key={app.id} to={`/student/applications/${app.id}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={14} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{app.offer?.title}</p>
                    <p className="text-white/40 text-[11px] truncate">{app.offer?.company?.companyName}</p>
                    <StatusBadge status={app.status} className="mt-1 scale-90 origin-left" />
                  </div>
                  <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Recent apps + Status pie ──────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent applications */}
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader
            title="Recent Applications"
            action={<Link to="/student/applications" className="text-xs text-lime-400 hover:text-lime-300">View all →</Link>}
          />
          {apps.length === 0 ? (
            <EmptyState icon={FileText} label="No applications yet" cta="Browse internships" to="/student/offers" />
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
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                        {threadUnreadMap[app.id]} new message{threadUnreadMap[app.id] > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Application status pie */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader title="Status Breakdown" />
          <div className="p-5">
            {counts.total > 0 ? (
              <>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={64} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-3">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-xs text-white/60">{d.name}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState icon={TrendingUp} label="Apply to see stats" />
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4: AI Analysis ───────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* CV AI Analysis */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader
            title="CV AI Analysis"
            sub="Extracted from your uploaded CV"
            action={<AIBadge label="AI-powered" color="lime" />}
          />
          <div className="p-5">
            {aiSummary ? (
              <div className="space-y-4">
                {/* Summary */}
                {aiSummary.summary && (
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{aiSummary.summary}</p>
                )}

                {/* Skills */}
                {aiSummary.skills?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Code2 size={12} className="text-lime-400" />
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Skills detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSummary.skills.slice(0, 10).map((s, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400">
                          {s}
                        </span>
                      ))}
                      {aiSummary.skills.length > 10 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                          +{aiSummary.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {aiSummary.languages?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Languages size={12} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSummary.languages.map((l, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {typeof l === 'string' ? l : `${l.language}${l.level ? ` · ${l.level}` : ''}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {aiSummary.education?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <GraduationCap size={12} className="text-purple-400" />
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Education</span>
                    </div>
                    <p className="text-xs text-white/50">{aiSummary.education[0]?.institution || aiSummary.education[0]}</p>
                  </div>
                )}

                <Link to="/student/profile"
                  className="inline-flex items-center gap-1.5 text-xs text-lime-400 hover:text-lime-300 mt-1">
                  <RefreshCw size={11} /> Re-analyse CV
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-lime-500/10 flex items-center justify-center mb-3">
                  <Brain size={22} className="text-lime-400" />
                </div>
                <p className="text-sm font-semibold text-white">No CV analysis yet</p>
                <p className="text-xs text-white/40 mt-1 max-w-xs">
                  Upload your CV and let AI extract your skills, languages, and experience automatically.
                </p>
                <Link to="/student/profile"
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-xs font-semibold rounded-xl transition-colors">
                  <Sparkles size={12} /> Analyse My CV
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* How recommendations work */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <SectionHeader
            title="How We Recommend"
            sub="Matching algorithm breakdown"
            action={<AIBadge label="Algorithmic + AI" color="purple" />}
          />
          <div className="p-5 space-y-4">

            {/* Weight factors */}
            <div className="space-y-3">
              {[
                { label: 'Skills Match',        pct: 45, color: 'bg-lime-400',    icon: Code2,        desc: 'Share of the required skills you already have' },
                { label: 'Domain & Programme',  pct: 25, color: 'bg-blue-400',    icon: BookOpen,     desc: 'How well your study field aligns with the offer domain' },
                { label: 'Academic Level',      pct: 15, color: 'bg-purple-400',  icon: GraduationCap,desc: 'Year of study vs. the internship level requirement' },
                { label: 'Language',            pct: 15, color: 'bg-orange-400',  icon: Languages,    desc: 'Language compatibility with the offer requirements' },
              ].map(({ label, pct, color, icon: Icon, desc }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon size={12} className="text-white/40" />
                      <span className="text-xs text-white/70 font-medium">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>

            {/* AI fallback note */}
            <div className="rounded-xl border border-white/5 bg-white/3 p-3">
              <div className="flex items-start gap-2">
                <Zap size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white/70">AI + Fallback</p>
                  <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                    When Gemini AI is available, scoring uses natural language understanding for deeper context.
                    The algorithmic formula above is always used as a reliable fallback.
                  </p>
                </div>
              </div>
            </div>

            {/* Top match preview */}
            {recOffers.length > 0 && recOffers[0].matchScore > 0 && (
              <div className="rounded-xl border border-lime-500/20 bg-lime-500/5 p-3">
                <p className="text-[10px] text-lime-400/70 font-semibold uppercase tracking-wide mb-1">Your top match</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white truncate pr-2">{recOffers[0].title}</p>
                  <span className="text-sm font-black text-lime-400 flex-shrink-0">{recOffers[0].matchScore}%</span>
                </div>
                <p className="text-[11px] text-white/40 mt-0.5">{recOffers[0].company?.companyName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 5: Recommended offers ─────────────────────── */}
      {recOffers.length > 0 && (
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Recommended For You</h3>
              <p className="text-xs text-white/30 mt-0.5">Matched to your programme, skills, and academic level</p>
            </div>
            <Link to="/student/offers" className="text-xs text-lime-400 hover:text-lime-300 mt-1">Browse all →</Link>
          </div>

          {/* Skill-gap nudge — turns matching into career guidance */}
          {skillGap && (
            <Link to="/student/profile"
              className="flex items-center gap-2.5 mb-4 px-4 py-2.5 rounded-xl bg-lime-500/8 border border-lime-500/20 hover:bg-lime-500/15 transition-colors group">
              <Lightbulb size={14} className="text-lime-400 flex-shrink-0" />
              <p className="text-xs text-white/60">
                Add <span className="font-bold text-lime-400">{skillGap.skill}</span> to your profile to improve
                your match on <span className="font-semibold text-white/80">{skillGap.offers} recommended offer{skillGap.offers !== 1 ? 's' : ''}</span>
              </p>
              <span className="ml-auto text-[10px] text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">Update profile →</span>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {recOffers.slice(0, 4).map(offer => (
              <div key={offer.id} className="relative">
                <OfferCard offer={offer} dark basePath="/student/offers" companyBasePath="/student/companies" />
                {(offer.matchReasons?.length > 0 || offer.matchScore > 0) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {offer.matchReasons?.slice(0, 2).map((r, i) => (
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
