import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Briefcase, FileText, Send, TrendingUp, ShieldCheck, UserCheck, Building2, CheckCircle2, Clock } from 'lucide-react';
import { adminApi } from '../../api/admin';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

/* ── Stat card ──────────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon, color = 'lime', sub }) {
  const palettes = {
    lime:   { icon: 'text-lime-400',   bg: 'bg-lime-400/10'   },
    blue:   { icon: 'text-blue-400',   bg: 'bg-blue-400/10'   },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-400/10' },
    orange: { icon: 'text-orange-400', bg: 'bg-orange-400/10' },
    red:    { icon: 'text-red-400',    bg: 'bg-red-400/10'    },
    indigo: { icon: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  };
  const p = palettes[color] || palettes.lime;
  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${p.bg}`}>
        <Icon size={20} className={p.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-white/30 text-[11px] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Chart tooltip ──────────────────────────────────────── */
function ChartTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-lg border text-xs shadow-lg ${
      isDark ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-[#d4cfbc] text-[#0f2d20]'
    }`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

const PERIODS = [
  { label: '7d',  days: 7  },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
];

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody,  setBroadcastBody]  = useState('');
  const [broadcastRole,  setBroadcastRole]  = useState('');
  const [sending,        setSending]        = useState(false);
  const [trendDays,      setTrendDays]      = useState(30);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminApi.stats().then(r => r.data.data),
  });

  const { data: trendData } = useQuery({
    queryKey: ['admin-trends', trendDays],
    queryFn:  () => adminApi.trends(trendDays).then(r => r.data.data),
  });

  const sendBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      toast.error('Title and body are required');
      return;
    }
    setSending(true);
    try {
      const res = await adminApi.broadcast({
        title: broadcastTitle.trim(),
        body:  broadcastBody.trim(),
        role:  broadcastRole || undefined,
      });
      toast.success(res.data.message);
      setBroadcastTitle('');
      setBroadcastBody('');
      setBroadcastRole('');
    } catch {
      toast.error('Failed to send broadcast');
    } finally { setSending(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const s = stats;

  const tickEvery = trendDays <= 7 ? 1 : trendDays <= 30 ? 5 : 10;
  const chartData = (trendData || []).map((d, i) => ({
    ...d,
    label: i % tickEvery === 0 ? shortDate(d.date) : '',
  }));

  const axisColor  = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,45,32,0.30)';
  const gridColor  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,45,32,0.05)';

  return (
    <div className="space-y-5">

      {/* ── Header ───────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-black text-white">Admin Overview</h2>
        <p className="text-white/40 text-sm mt-0.5">Platform-wide statistics and controls</p>
      </div>

      {/* ── 6 key metrics ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard label="Total Users"    value={s?.users?.total}              icon={Users}        color="lime"   />
        <MetricCard label="Students"       value={s?.users?.students}           icon={UserCheck}    color="blue"   />
        <MetricCard label="Companies"      value={s?.users?.companies}          icon={Building2}    color="purple" />
        <MetricCard label="Open Offers"    value={s?.offers?.open}              icon={Briefcase}    color="orange" sub={`${s?.offers?.total ?? 0} total`} />
        <MetricCard label="Applications"   value={s?.applications?.total}       icon={FileText}     color="indigo" sub={`${s?.applications?.pending ?? 0} new`} />
        <MetricCard label="Accepted"       value={s?.applications?.accepted}    icon={CheckCircle2} color="lime"   sub={`${s?.applications?.rejected ?? 0} rejected`} />
      </div>

      {/* ── Trend chart ──────────────────────────────────── */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Platform Activity</h3>
          </div>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {PERIODS.map(o => (
              <button key={o.days} onClick={() => setTrendDays(o.days)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  trendDays === o.days ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'
                }`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom legend */}
        <div className="flex items-center gap-5 px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-lime-400 rounded-full" />
            <span className="text-xs text-white/40">Signups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-400 rounded-full" />
            <span className="text-xs text-white/40">Applications</span>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          {chartData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#84cc16" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#84cc16" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip isDark={isDark} />} cursor={{ stroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,45,32,0.06)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="signups"      name="Signups"      stroke="#84cc16" strokeWidth={2} fill="url(#gSignups)" dot={false} activeDot={{ r: 4, fill: '#84cc16' }} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#a855f7" strokeWidth={2} fill="url(#gApps)"    dot={false} activeDot={{ r: 4, fill: '#a855f7' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-white/20">
              <p className="text-sm">No data for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: Recent signups + Broadcast ────────── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Recent signups */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <Users size={14} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Recent Signups</h3>
          </div>
          <div className="divide-y divide-white/5">
            {(s?.recentUsers || []).length === 0 ? (
              <div className="flex items-center justify-center py-10 text-white/20">
                <p className="text-xs">No users yet</p>
              </div>
            ) : (s?.recentUsers || []).map(u => {
              const displayName =
                u.role === 'company'
                  ? (u.company_profiles?.company_name ?? 'Unnamed Company')
                  : u.student_profiles
                    ? `${u.student_profiles.first_name ?? ''} ${u.student_profiles.last_name ?? ''}`.trim() || 'Unnamed Student'
                    : 'New User';
              const initial = displayName[0]?.toUpperCase() ?? '?';
              return (
                <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      u.role === 'student' ? 'bg-blue-500/15 text-blue-400'
                      : u.role === 'company' ? 'bg-purple-500/15 text-purple-400'
                      : 'bg-lime-500/15 text-lime-400'
                    }`}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{displayName}</p>
                      <p className="text-xs text-white/30">{formatRelativeTime(u.created_at)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0 ${
                    u.role === 'student'  ? 'bg-blue-500/10 text-blue-400'
                    : u.role === 'company' ? 'bg-purple-500/10 text-purple-400'
                    : 'bg-lime-500/10 text-lime-400'
                  }`}>
                    {u.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Broadcast notification */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <Send size={14} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Broadcast Notification</h3>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Target audience</label>
              <select value={broadcastRole} onChange={e => setBroadcastRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50">
                <option value="" className="bg-[#1a1a1a]">All users</option>
                <option value="student" className="bg-[#1a1a1a]">Students only</option>
                <option value="company" className="bg-[#1a1a1a]">Companies only</option>
              </select>
            </div>
            <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)}
              placeholder="Notification title…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50" />
            <textarea rows={3} value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)}
              placeholder="Message body…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none" />
            <button onClick={sendBroadcast} disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
              <Send size={14} /> {sending ? 'Sending…' : 'Send Broadcast'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
