import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle2, XCircle, Briefcase, ArrowRight,
  TrendingUp, Brain, Calendar, ChevronRight,
  BookOpen, Languages, GraduationCap, Code2, RefreshCw,
  Upload, Search, User, Lightbulb, MapPin, Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { applicationsApi } from '../../api/applications';
import { offersApi } from '../../api/offers';
import { messagesApi } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import OfferCard from '../../components/offers/OfferCard';
import { StatusBadge } from '../../components/ui/Badge';
import { formatRelativeTime } from '../../lib/utils';

const STAGE_COLORS = {
  applied:     '#6B9FD4',
  review:      '#9B7FD4',
  interview:   '#4EC0A0',
  accepted:    '#1E5B45',
};

/* ─── small helpers ─────────────────────────────────────── */

function Card({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: '#fff', border: '1px solid #E7E6DF', ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: '1px solid #F0F0EA' }}>
      <div>
        <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>{title}</h3>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, label, cta, to }) {
  return (
    <div className="flex flex-col items-center justify-center py-10" style={{ color: '#C0BFBA' }}>
      <Icon size={28} className="mb-2.5 opacity-50" />
      <p className="text-xs">{label}</p>
      {cta && (
        <Link to={to} className="mt-2 text-xs font-semibold" style={{ color: '#1E5B45' }}>{cta} →</Link>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#1B1D1A', boxShadow: '0 4px 12px rgba(24,32,24,.08)' }}>
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5" style={{ color: '#1E5B45' }}>{payload[0].value} application{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

/* ─── Company initial avatar ─────────────────────────────── */
const COMPANY_COLORS = ['#F5C842','#4EC0A0','#6B9FD4','#D47F6B','#A07FD4','#D4B47F','#7FD4A0'];
function CompanyAvatar({ name = '' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const idx = name.charCodeAt(0) % COMPANY_COLORS.length;
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black"
      style={{ background: COMPANY_COLORS[idx], color: '#fff', letterSpacing: '0.02em' }}>
      {initials || '??'}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function StudentDashboard() {
  const { user } = useAuth();
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

  const interviews = useMemo(() =>
    apps.filter(a => ['interview_scheduled','interview_completed'].includes(a.status)).slice(0, 3),
  [apps]);

  const profileFields = [
    profile?.skills?.length > 0,
    profile?.programme,
    profile?.studyYear,
    !!profile?.city,
    profile?.languages?.length > 0,
    !!aiSummary,
  ];
  const profileComplete = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>

      {/* ── Greeting ─────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.1em] mb-1" style={{ color: '#1E5B45' }}>{greeting}</p>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#1B1D1A', letterSpacing: '-0.01em', margin: 0 }}>
            Hello, {name}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B6F69' }}>Here's your internship pipeline at a glance.</p>
        </div>
        <Link to="/student/offers"
          className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl"
          style={{ background: '#1E5B45', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
          onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
          Browse Offers <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Onboarding (empty state) ──────────────────────── */}
      {apps.length === 0 && !profile?.cvUrl && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1,  y: 0  }}
          className="grid sm:grid-cols-3 gap-3"
        >
          {[
            { step: '01', title: 'Complete your profile', desc: 'Add your university, programme, skills, and bio.', icon: User, color: '#6B9FD4', bg: '#EEF2FB', border: '#C4CFEB', cta: 'Go to profile', to: '/student/profile' },
            { step: '02', title: 'Upload your CV', desc: 'Upload a PDF so companies can review your experience.', icon: Upload, color: '#1E5B45', bg: '#EDF2EE', border: '#C4DBCE', cta: 'Upload CV', to: '/student/profile' },
            { step: '03', title: 'Browse internships', desc: 'Explore open offers and apply to positions that fit you.', icon: Search, color: '#9B7FD4', bg: '#F3EEFB', border: '#CFBDE8', cta: 'Browse offers', to: '/student/offers' },
          ].map(({ step, title, desc, icon: Icon, color, bg, border, cta, to }) => (
            <div key={step} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-[11px] font-bold" style={{ color: '#DDDBD2' }}>STEP {step}</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>{title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9A9E97' }}>{desc}</p>
              </div>
              <Link to={to}
                className="mt-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg w-fit"
                style={{ background: bg, border: `1px solid ${border}`, color, textDecoration: 'none' }}>
                {cta} <ArrowRight size={11} />
              </Link>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Applications" value={counts.total}     icon={FileText}     color="blue"  />
        <StatCard label="In Review"    value={counts.active}    icon={Clock}        color="purple"/>
        <StatCard label="Interviews"   value={counts.interview} icon={Calendar}     color="green" />
        <StatCard label="Accepted"     value={counts.accepted}  icon={CheckCircle2} color="green" />
      </div>

      {/* ── Main 2-column layout ─────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-5 min-w-0">

          {/* Application Activity chart */}
          <Card>
            <SectionHeader
              title="Application Activity"
              sub="Applications submitted per week"
              action={<span className="text-xs" style={{ color: '#C0BFBA' }}>Last 8 weeks</span>}
            />
            <div className="p-5">
              {apps.length === 0 ? (
                <EmptyState icon={TrendingUp} label="No activity yet" cta="Start applying" to="/student/offers" />
              ) : (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity} barSize={16}>
                      <CartesianGrid vertical={false} stroke="rgba(15,45,32,0.06)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9A9E97' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9A9E97' }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(30,91,69,0.04)' }} />
                      <Bar dataKey="applications" fill="#1E5B45" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Applications */}
          <Card>
            <SectionHeader
              title="Recent Applications"
              action={
                <Link to="/student/applications" className="text-xs font-semibold" style={{ color: '#1E5B45', textDecoration: 'none' }}>
                  View all →
                </Link>
              }
            />
            {apps.length === 0 ? (
              <EmptyState icon={FileText} label="No applications yet" cta="Browse internships" to="/student/offers" />
            ) : (
              <div>
                {apps.slice(0, 5).map((app, i) => (
                  <Link key={app.id} to={`/student/applications?app=${app.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 cursor-pointer"
                    style={{ borderTop: i > 0 ? '1px solid #F6F5F1' : undefined, textDecoration: 'none', display: 'flex' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <CompanyAvatar name={app.offer?.company?.companyName || ''} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#1B1D1A' }}>{app.offer?.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>
                        {app.offer?.company?.companyName} · {formatRelativeTime(app.appliedAt)}
                      </p>
                      {(threadUnreadMap[app.id] ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs mt-0.5" style={{ color: '#1E5B45' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1E5B45' }} />
                          {threadUnreadMap[app.id]} new message{threadUnreadMap[app.id] > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* CV Summary */}
          {aiSummary && (
            <Card>
              <SectionHeader
                title="CV Summary"
                sub="Extracted from your uploaded CV"
                action={
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                    <Cpu size={9} /> CV Parser
                  </span>
                }
              />
              <div className="p-5 space-y-4">
                {aiSummary.summary && (
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#6B6F69' }}>{aiSummary.summary}</p>
                )}
                {aiSummary.skills?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Code2 size={12} style={{ color: '#1E5B45' }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSummary.skills.slice(0, 10).map((s, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                          {s}
                        </span>
                      ))}
                      {aiSummary.skills.length > 10 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#F6F5F1', border: '1px solid #E7E6DF', color: '#9A9E97' }}>
                          +{aiSummary.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {aiSummary.languages?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Languages size={12} style={{ color: '#6B9FD4' }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSummary.languages.map((l, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#EEF2FB', border: '1px solid #C4CFEB', color: '#3B5FC0' }}>
                          {typeof l === 'string' ? l : `${l.language}${l.level ? ` · ${l.level}` : ''}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link to="/student/profile"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#1E5B45', textDecoration: 'none' }}>
                  <RefreshCw size={11} /> Re-analyse CV
                </Link>
              </div>
            </Card>
          )}

          {/* Recommended offers */}
          {recOffers.length === 0 && (
            <div className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                <Lightbulb size={18} style={{ color: '#1E5B45' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>No recommendations yet</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9A9E97' }}>
                  Add your skills, programme, and city to your profile so we can match you with relevant internships.
                </p>
              </div>
              <Link to="/student/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: '#1E5B45', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
                onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
                Complete my profile <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {recOffers.length > 0 && (
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Recommended For You</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>Matched to your programme, skills, and academic level</p>
                </div>
                <Link to="/student/offers" className="text-xs font-semibold mt-0.5" style={{ color: '#1E5B45', textDecoration: 'none' }}>Browse all →</Link>
              </div>

              {skillGap && (
                <Link to="/student/profile"
                  className="flex items-center gap-2.5 mb-3 px-4 py-2.5 rounded-xl group"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#DBE9E1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#EDF2EE'}>
                  <Lightbulb size={14} style={{ color: '#1E5B45', flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: '#6B6F69' }}>
                    <span className="font-bold" style={{ color: '#1E5B45' }}>{skillGap.skill}</span> is in demand —{' '}
                    <span className="font-semibold" style={{ color: '#1B1D1A' }}>{skillGap.offers} of your top offer{skillGap.offers !== 1 ? 's' : ''}</span> ask{skillGap.offers === 1 ? 's' : ''} for it
                  </p>
                  <span className="ml-auto text-xs flex-shrink-0" style={{ color: '#9A9E97' }}>Update profile →</span>
                </Link>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {recOffers.slice(0, 4).map(offer => (
                  <div key={offer.id}>
                    {offer.matchScore > 0 && (
                      <div className="flex items-center gap-2 mb-1.5 px-0.5">
                        <span className="text-xs font-black tabular-nums"
                          style={{ color: offer.matchScore >= 85 ? '#1E5B45' : offer.matchScore >= 70 ? '#B45309' : '#9A9E97' }}>
                          {offer.matchScore}% match
                        </span>
                        {offer.matchReasons?.slice(0, 1).map((r, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                    <OfferCard offer={offer} basePath="/student/offers" companyBasePath="/student/companies" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT RAIL ── */}
        <div className="space-y-4">

          {/* Profile Readiness */}
          <Card>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Profile readiness</h3>
                <span className="text-xs font-bold" style={{ color: '#1E5B45' }}>{profileComplete}%</span>
              </div>

              {/* Conic-gradient ring */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `conic-gradient(#1E5B45 ${profileComplete * 3.6}deg, #EDF2EE ${profileComplete * 3.6}deg)`,
                  }} />
                  <div className="absolute inset-2 rounded-full" style={{ background: '#fff' }} />
                  <span className="relative text-lg font-black" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#1B1D1A' }}>{profileComplete}%</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {[
                  { label: 'Skills added',    done: profileFields[0] },
                  { label: 'Programme set',   done: profileFields[1] },
                  { label: 'Study year set',  done: profileFields[2] },
                  { label: 'City set',        done: profileFields[3] },
                  { label: 'Languages added', done: profileFields[4] },
                  { label: 'CV analysed',     done: profileFields[5] },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: done ? '#1E5B45' : '#F0F0EA', border: done ? 'none' : '1.5px solid #DDDBD2' }}>
                      {done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: done ? '#1B1D1A' : '#9A9E97' }}>{label}</span>
                  </div>
                ))}
              </div>

              {profileComplete < 100 && (
                <Link to="/student/profile"
                  className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45', textDecoration: 'none' }}>
                  Complete profile <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </Card>

          {/* Upcoming Interviews — dark green card */}
          {interviews.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: '#10342A', border: '1px solid #0D2820' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: '#fff' }}>
                  {interviews.length === 1 ? 'Upcoming Interview' : 'Upcoming Interviews'}
                </h3>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#9FE870', color: '#10342A' }}>
                  {interviews.length}
                </span>
              </div>
              <div className="space-y-2">
                {interviews.map(app => (
                  <Link key={app.id} to="/student/interviews"
                    className="flex items-start gap-3 rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.07)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(159,232,112,0.15)' }}>
                      <Calendar size={14} style={{ color: '#9FE870' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: '#fff' }}>{app.offer?.title}</p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{app.offer?.company?.companyName}</p>
                      {app.interview?.date && (
                        <p className="text-[11px] mt-0.5 font-semibold" style={{ color: '#9FE870' }}>
                          {new Date(app.interview.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 2 }} />
                  </Link>
                ))}
              </div>
              <Link to="/student/interviews"
                className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(159,232,112,0.12)', color: '#9FE870', textDecoration: 'none', border: '1px solid rgba(159,232,112,0.2)' }}>
                View all interviews <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* No CV — nudge */}
          {!aiSummary && (
            <Card>
              <div className="p-5 text-center">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
                  <Brain size={20} style={{ color: '#1E5B45' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>No CV uploaded yet</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#9A9E97' }}>
                  Upload your CV so companies can review your experience and skills.
                </p>
                <Link to="/student/profile"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#1E5B45', textDecoration: 'none' }}>
                  <Brain size={12} /> Analyse My CV
                </Link>
              </div>
            </Card>
          )}

          {/* Matching algo breakdown */}
          <Card>
            <SectionHeader title="How We Match" sub="Scoring weights" />
            <div className="p-5 space-y-3">
              {[
                { label: 'Skills Match',   pct: 35, color: '#1E5B45',  icon: Code2 },
                { label: 'Programme',      pct: 30, color: '#6B9FD4',  icon: BookOpen },
                { label: 'Location',       pct: 15, color: '#4EC0A0',  icon: MapPin },
                { label: 'Academic Level', pct: 15, color: '#9B7FD4',  icon: GraduationCap },
                { label: 'Language',       pct: 5,  color: '#D4A07F',  icon: Languages },
              ].map(({ label, pct, color, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} style={{ color: '#9A9E97' }} />
                      <span className="text-xs font-medium" style={{ color: '#1B1D1A' }}>{label}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#1B1D1A' }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0EA' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Saved offers shortcut */}
          <Link to="/student/saved"
            className="flex items-center gap-3 rounded-2xl px-5 py-4"
            style={{ background: '#fff', border: '1px solid #E7E6DF', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDF2EE', border: '1px solid #C4DBCE' }}>
              <Briefcase size={16} style={{ color: '#1E5B45' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#1B1D1A' }}>Saved Offers</p>
              <p className="text-xs" style={{ color: '#9A9E97' }}>View your bookmarked internships</p>
            </div>
            <ChevronRight size={16} style={{ color: '#C0BFBA', flexShrink: 0 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
