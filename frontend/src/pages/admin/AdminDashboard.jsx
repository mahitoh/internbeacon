import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Briefcase, FileText, Send, TrendingUp, UserCheck, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

function MetricCard({ label, value, icon: Icon, iconBg, iconColor, sub, to }) {
  const inner = (
    <div className="rounded-2xl p-5 flex items-center gap-4 h-full transition-colors"
      style={{ background: '#fff', border: '1px solid #E7E6DF' }}
      onMouseEnter={to ? e => e.currentTarget.style.borderColor = '#C4DBCE' : undefined}
      onMouseLeave={to ? e => e.currentTarget.style.borderColor = '#E7E6DF' : undefined}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{label}</p>
        <p className="text-2xl font-black mt-0.5" style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: '#1B1D1A' }}>{value ?? '—'}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: to ? '#1E5B45' : '#9A9E97' }}>{sub}</p>}
      </div>
    </div>
  );
  return to ? <Link to={to} className="block" style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border text-xs shadow-lg" style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#1B1D1A' }}>
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

export default function AdminDashboard() {
  const [broadcastTitle,   setBroadcastTitle]   = useState('');
  const [broadcastBody,    setBroadcastBody]    = useState('');
  const [broadcastRole,    setBroadcastRole]    = useState('');
  const [sending,          setSending]          = useState(false);
  const [confirmBroadcast, setConfirmBroadcast] = useState(false);
  const [trendDays,        setTrendDays]        = useState(30);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminApi.stats().then(r => r.data.data),
  });

  const { data: trendData } = useQuery({
    queryKey: ['admin-trends', trendDays],
    queryFn:  () => adminApi.trends(trendDays).then(r => r.data.data),
  });

  const sendBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastBody.trim()) { toast.error('Title and body are required'); return; }
    if (!confirmBroadcast) { setConfirmBroadcast(true); return; }
    setSending(true);
    setConfirmBroadcast(false);
    try {
      const res = await adminApi.broadcast({ title: broadcastTitle.trim(), body: broadcastBody.trim(), role: broadcastRole || undefined });
      toast.success(res.data.message);
      setBroadcastTitle(''); setBroadcastBody(''); setBroadcastRole('');
    } catch { toast.error('Failed to send broadcast'); }
    finally { setSending(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const s = stats;
  const tickEvery = trendDays <= 7 ? 1 : trendDays <= 30 ? 5 : 10;
  const chartData = (trendData || []).map((d, i) => ({ ...d, label: i % tickEvery === 0 ? shortDate(d.date) : '' }));

  const metrics = [
    { label: 'Total Users',        value: s?.users?.total,              icon: Users,        iconBg: '#EDF2EE', iconColor: '#1E5B45' },
    { label: 'Students',           value: s?.users?.students,           icon: UserCheck,    iconBg: '#DBEAFE', iconColor: '#1E40AF' },
    { label: 'Companies',          value: s?.users?.companies,          icon: Building2,    iconBg: '#EDE9FE', iconColor: '#5B21B6' },
    { label: 'Verified Companies', value: s?.users?.verifiedCompanies,  icon: ShieldCheck,  iconBg: '#EDF2EE', iconColor: '#1E5B45', sub: s?.users?.companies > 0 ? `${s?.users?.companies - (s?.users?.verifiedCompanies ?? 0)} pending →` : undefined, to: '/admin/users?role=company' },
    { label: 'Open Offers',        value: s?.offers?.open,              icon: Briefcase,    iconBg: '#FFFBEB', iconColor: '#D97706', sub: `${s?.offers?.total ?? 0} total` },
    { label: 'Applications',       value: s?.applications?.total,       icon: FileText,     iconBg: '#EEF2FF', iconColor: '#4338CA', sub: `${s?.applications?.pending ?? 0} new` },
    { label: 'Accepted',           value: s?.applications?.accepted,    icon: CheckCircle2, iconBg: '#EDF2EE', iconColor: '#1E5B45', sub: `${s?.applications?.rejected ?? 0} rejected` },
  ];

  const inputStyle = {
    background: '#F6F5F1', border: '1px solid #DDDBD2', borderRadius: '12px',
    padding: '10px 12px', fontSize: '14px', color: '#1B1D1A', width: '100%', outline: 'none',
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div>
        <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Admin Overview</h2>
        <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>Platform-wide statistics and controls</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(m => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Platform Activity</h3>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#EFEEE8' }}>
            {PERIODS.map(o => {
              const isActive = trendDays === o.days;
              return (
                <button key={o.days} onClick={() => setTrendDays(o.days)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={isActive
                    ? { background: '#1E5B45', color: '#fff' }
                    : { color: '#6B6F69' }}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-5 px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded-full" style={{ background: '#1E5B45' }} />
            <span className="text-xs" style={{ color: '#9A9E97' }}>Signups</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded-full" style={{ background: '#A855F7' }} />
            <span className="text-xs" style={{ color: '#9A9E97' }}>Applications</span>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          {chartData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#1E5B45" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#1E5B45" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#A855F7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,45,32,0.05)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#9A9E97', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#9A9E97', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(15,45,32,0.06)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="signups"      name="Signups"      stroke="#1E5B45" strokeWidth={2} fill="url(#gSignups)" dot={false} activeDot={{ r: 4, fill: '#1E5B45' }} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#A855F7" strokeWidth={2} fill="url(#gApps)"    dot={false} activeDot={{ r: 4, fill: '#A855F7' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-sm" style={{ color: '#C0BFBA' }}>No data for this period</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent signups */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #E7E6DF' }}>
            <Users size={14} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Recent Signups</h3>
          </div>
          <div>
            {(s?.recentUsers || []).length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm" style={{ color: '#C0BFBA' }}>No users yet</div>
            ) : (s?.recentUsers || []).map((u, i) => {
              const displayName = u.role === 'company'
                ? (u.company_profiles?.company_name ?? 'Unnamed Company')
                : u.student_profiles
                  ? `${u.student_profiles.first_name ?? ''} ${u.student_profiles.last_name ?? ''}`.trim() || 'Unnamed Student'
                  : 'New User';
              const initial = displayName[0]?.toUpperCase() ?? '?';
              const roleStyle = u.role === 'student'
                ? { bg: '#DBEAFE', text: '#1E40AF' }
                : u.role === 'company'
                  ? { bg: '#EDE9FE', text: '#5B21B6' }
                  : { bg: '#EDF2EE', text: '#1E5B45' };
              return (
                <Link key={u.id} to={`/admin/users?search=${encodeURIComponent(u.email || displayName)}`}
                  className="px-5 py-3 flex items-center justify-between gap-3 transition-colors"
                  style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: roleStyle.bg, color: roleStyle.text }}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#1B1D1A' }}>{displayName}</p>
                      <p className="text-xs" style={{ color: '#9A9E97' }}>{formatRelativeTime(u.created_at)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0"
                    style={{ background: roleStyle.bg, color: roleStyle.text }}>
                    {u.role}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Broadcast */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #E7E6DF' }}>
            <Send size={14} style={{ color: '#1E5B45' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Broadcast Notification</h3>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#6B6F69' }}>Target audience</label>
              <select value={broadcastRole} onChange={e => setBroadcastRole(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1E5B45'}
                onBlur={e => e.target.style.borderColor = '#DDDBD2'}>
                <option value="">All users</option>
                <option value="student">Students only</option>
                <option value="company">Companies only</option>
              </select>
            </div>
            <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)}
              placeholder="Notification title…" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
            <textarea rows={3} value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)}
              placeholder="Message body…"
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1E5B45'}
              onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
            {confirmBroadcast && (
              <div className="rounded-xl p-3 text-xs" style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
                <p className="font-semibold mb-1">Are you sure?</p>
                <p>This will notify <strong>{broadcastRole || 'all users'}</strong> on the platform. This cannot be undone.</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={sendBroadcast} disabled={sending}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                    style={{ background: '#D97706' }}>
                    {sending ? 'Sending…' : 'Yes, send it'}
                  </button>
                  <button onClick={() => setConfirmBroadcast(false)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: '#fff', border: '1px solid #FDE68A', color: '#92400E' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {!confirmBroadcast && (
              <button onClick={sendBroadcast} disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                style={{ background: '#1E5B45' }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#10342A'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
                <Send size={14} /> Send Broadcast
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
