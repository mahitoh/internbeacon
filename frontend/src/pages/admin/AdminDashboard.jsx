import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Briefcase, FileText, MessageSquare, CheckCircle2, Clock, Send, Radio } from 'lucide-react';
import { adminApi } from '../../api/admin';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

function StatBlock({ label, value, sub, color = 'lime' }) {
  const colors = { lime: 'text-lime-400', blue: 'text-blue-400', orange: 'text-orange-400', red: 'text-red-400', purple: 'text-purple-400' };
  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-5">
      <p className="text-white/40 text-xs uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-black mt-1 ${colors[color]}`}>{value ?? '—'}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody,  setBroadcastBody]  = useState('');
  const [broadcastRole,  setBroadcastRole]  = useState('');
  const [sending, setSending] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminApi.stats().then(r => r.data.data),
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Admin Overview</h2>
        <p className="text-white/40 text-sm mt-0.5">Platform-wide statistics and controls</p>
      </div>

      {/* Users */}
      <div>
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Users</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock label="Total Users"  value={s?.users?.total}     color="lime" />
          <StatBlock label="Students"     value={s?.users?.students}  color="blue" />
          <StatBlock label="Companies"    value={s?.users?.companies} color="purple" />
          <StatBlock label="Admins"       value={s?.users?.admins}    color="orange" />
        </div>
      </div>

      {/* Offers */}
      <div>
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Offers</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock label="Total Offers" value={s?.offers?.total}  color="lime" />
          <StatBlock label="Open"         value={s?.offers?.open}   color="lime" sub="accepting applications" />
          <StatBlock label="Closed"       value={s?.offers?.closed} color="orange" />
          <StatBlock label="Draft"        value={s?.offers?.draft}  color="blue" />
        </div>
      </div>

      {/* Applications */}
      <div>
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Applications</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatBlock label="Total"      value={s?.applications?.total}     color="lime" />
          <StatBlock label="New"        value={s?.applications?.pending}   color="orange" />
          <StatBlock label="Reviewing"  value={s?.applications?.reviewing} color="blue" />
          <StatBlock label="Accepted"   value={s?.applications?.accepted}  color="lime" />
          <StatBlock label="Rejected"   value={s?.applications?.rejected}  color="red" />
        </div>
      </div>

      {/* Messages */}
      <div>
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Engagement</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock label="Total Messages" value={s?.messages} color="purple" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent signups */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Users size={14} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Recent Signups</h3>
          </div>
          <div className="divide-y divide-white/5">
            {(s?.recentUsers || []).map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-white/70 font-mono truncate">{u.id.slice(0, 12)}…</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                    ${u.role === 'student' ? 'bg-blue-500/10 text-blue-400' :
                      u.role === 'company' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-lime-500/10 text-lime-400'}`}>
                    {u.role}
                  </span>
                  <span className="text-xs text-white/30">{formatRelativeTime(u.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcast */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-lime-400" />
            <h3 className="font-semibold text-white text-sm">Broadcast Notification</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50">Target audience</label>
              <select value={broadcastRole} onChange={e => setBroadcastRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none">
                <option value="" className="bg-[#1a1a1a]">All users</option>
                <option value="student" className="bg-[#1a1a1a]">Students only</option>
                <option value="company" className="bg-[#1a1a1a]">Companies only</option>
              </select>
            </div>
            <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)}
              placeholder="Notification title…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50" />
            <textarea rows={3} value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)}
              placeholder="Message body…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 resize-none" />
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
