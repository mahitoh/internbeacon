import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, Trash2, ExternalLink, Inbox } from 'lucide-react';
import { notificationsApi } from '../../api/notifications';
import { formatRelativeTime } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const TYPE_META = {
  // Keys must match the `type` strings the backend actually emits.
  new_application: { label: 'Application', bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  new_message:     { label: 'Message',     bg: '#EDF2EE', text: '#1E5B45', border: '#C4DBCE' },
  status_update:   { label: 'Status',      bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
  note_update:     { label: 'Note',        bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  offer_closed:    { label: 'Offer',       bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  offer:           { label: 'Offer',       bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  system:          { label: 'System',      bg: '#F6F5F1', text: '#6B6F69', border: '#E7E6DF' },
  // Legacy/back-compat aliases
  application:     { label: 'Application', bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  message:         { label: 'Message',     bg: '#EDF2EE', text: '#1E5B45', border: '#C4DBCE' },
  status:          { label: 'Status',      bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
};

function typeMeta(type) {
  return TYPE_META[type] ?? TYPE_META.system;
}

export default function NotificationsPage() {
  const [filter,   setFilter]   = useState('all');
  const [removing, setRemoving] = useState(null);
  const qc       = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn:  () => notificationsApi
      .list({ limit: 50, ...(filter === 'unread' ? { unread: 'true' } : {}) })
      .then(r => r.data.data || []),
  });

  const notifs      = data || [];
  const unreadCount = notifs.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    } catch { toast.error('Failed to mark all as read'); }
  };

  const handleMarkRead = async (n) => {
    if (n.isRead) return;
    try { await notificationsApi.markRead(n.id); qc.invalidateQueries({ queryKey: ['notifications'] }); } catch {}
  };

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    setRemoving(id);
    try {
      await notificationsApi.remove(id);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    } catch { toast.error('Could not remove notification'); }
    finally { setRemoving(null); }
  };

  const handleClick = (n) => {
    handleMarkRead(n);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="max-w-2xl space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Notifications</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E5B45'; e.currentTarget.style.color = '#1E5B45'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDDBD2'; e.currentTarget.style.color = '#6B6F69'; }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: '#EFEEE8' }}>
        {[{ key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' }].map(t => {
          const isActive = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
              style={isActive ? { background: '#1E5B45', color: '#fff' } : { color: '#6B6F69' }}>
              {t.label}
              {t.key === 'unread' && unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={isActive ? { background: 'rgba(255,255,255,0.2)', color: '#fff' } : { background: '#EDF2EE', color: '#1E5B45' }}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24" style={{ color: '#C0BFBA' }}>
          <Inbox size={40} className="mb-3 opacity-50" />
          <p className="text-sm">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const meta = typeMeta(n.type);
            const isUnread = !n.isRead;
            return (
              <div key={n.id} onClick={() => handleClick(n)}
                className="group relative flex items-start gap-4 p-4 rounded-2xl transition-all"
                style={{
                  background: isUnread ? '#FAFDF9' : '#fff',
                  border: `1px solid ${isUnread ? '#C4DBCE' : '#E7E6DF'}`,
                  cursor: n.link ? 'pointer' : 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isUnread ? '#1E5B45' : '#DDDBD2'}
                onMouseLeave={e => e.currentTarget.style.borderColor = isUnread ? '#C4DBCE' : '#E7E6DF'}>

                {/* Unread dot */}
                {isUnread && (
                  <span className="absolute top-4 right-10 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#1E5B45' }} />
                )}

                {/* Type badge */}
                <span className="mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                  style={{ background: meta.bg, color: meta.text, border: `1px solid ${meta.border}` }}>
                  {meta.label}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-sm font-semibold leading-snug"
                    style={{ color: isUnread ? '#1B1D1A' : '#6B6F69' }}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9A9E97' }}>{n.body}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs" style={{ color: '#C0BFBA' }}>{formatRelativeTime(n.createdAt)}</span>
                    {n.link && (
                      <span className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: '#9A9E97' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1E5B45'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}>
                        <ExternalLink size={10} /> View
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button onClick={(e) => handleRemove(n.id, e)} disabled={removing === n.id}
                  title="Remove"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-30 p-1 rounded-lg"
                  style={{ color: '#C0BFBA' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEE2E2'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#C0BFBA'; e.currentTarget.style.background = 'transparent'; }}>
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
