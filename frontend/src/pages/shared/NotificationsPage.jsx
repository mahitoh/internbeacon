import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, ExternalLink, Inbox, Filter } from 'lucide-react';
import { notificationsApi } from '../../api/notifications';
import { formatRelativeTime } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const TYPE_ICON = {
  application:  { label: 'Application', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  message:      { label: 'Message',     color: 'bg-lime-500/15 text-lime-400 border-lime-500/20' },
  offer:        { label: 'Offer',       color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  status:       { label: 'Status',      color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
  system:       { label: 'System',      color: 'bg-white/5 text-white/40 border-white/10' },
};

function typeMeta(type) {
  return TYPE_ICON[type] ?? TYPE_ICON.system;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [removing, setRemoving] = useState(null);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn:  () => notificationsApi
      .list({ limit: 50, ...(filter === 'unread' ? { unread: 'true' } : {}) })
      .then(r => r.data.data || []),
  });

  const notifs = data || [];
  const unreadCount = notifs.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleMarkRead = async (n) => {
    if (n.isRead) return;
    try {
      await notificationsApi.markRead(n.id);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    } catch {}
  };

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    setRemoving(id);
    try {
      await notificationsApi.remove(id);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      toast.error('Could not remove notification');
    } finally {
      setRemoving(null);
    }
  };

  const handleClick = (n) => {
    handleMarkRead(n);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Notifications</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-xl p-1 w-fit">
        {[
          { key: 'all',    label: 'All' },
          { key: 'unread', label: 'Unread' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === t.key ? 'bg-lime-500 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {t.label}
            {t.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-lime-400/20 text-lime-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/20">
          <Inbox size={40} className="mb-3" />
          <p className="text-sm">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const meta = typeMeta(n.type);
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  n.link ? 'cursor-pointer' : 'cursor-default'
                } ${
                  n.isRead
                    ? 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
                    : 'bg-[#1a1a1a] border-lime-500/15 hover:border-lime-500/25'
                }`}
              >
                {/* Unread dot */}
                {!n.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-lime-400 flex-shrink-0" />
                )}

                {/* Type badge */}
                <span className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${meta.color}`}>
                  {meta.label}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className={`text-sm font-semibold leading-snug ${n.isRead ? 'text-white/70' : 'text-white'}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{n.body}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/25">{formatRelativeTime(n.createdAt)}</span>
                    {n.link && (
                      <span className="flex items-center gap-1 text-xs text-lime-400/70 group-hover:text-lime-400 transition-colors">
                        <ExternalLink size={10} /> View
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => handleRemove(n.id, e)}
                  disabled={removing === n.id}
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all disabled:opacity-30"
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
