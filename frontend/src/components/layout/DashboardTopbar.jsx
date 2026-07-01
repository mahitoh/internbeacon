import { Search, Bell, Menu, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notificationsApi } from '../../api/notifications';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { formatRelativeTime } from '../../lib/utils';
import { playTone } from '../../lib/sounds';

const NOTIF_ICONS = {
  new_message:     '💬',
  new_application: '📬',
  status_update:   '📋',
  note_update:     '📝',
  offer_closed:    '⏰',
  offer:           '✨',
  system:          '🔔',
};

function showNotifToast(n, navigate) {
  const icon = NOTIF_ICONS[n.type] || '🔔';
  toast.custom(t => (
    <div
      onClick={() => { if (n.link) navigate(n.link); toast.dismiss(t.id); }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        background: '#fff',
        border: '1.5px solid #C4DBCE',
        borderRadius: '14px',
        padding: '12px 14px',
        maxWidth: '310px',
        boxShadow: '0 6px 24px rgba(30,91,69,.13)',
        cursor: n.link ? 'pointer' : 'default',
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
      <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1B1D1A', lineHeight: 1.3 }}>
          {n.title}
        </p>
        {n.body && (
          <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#6B6F69', lineHeight: 1.45,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {n.body}
          </p>
        )}
      </div>
      <button
        onClick={e => { e.stopPropagation(); toast.dismiss(t.id); }}
        style={{ background: 'none', border: 'none', color: '#C0BFBA', cursor: 'pointer',
          padding: '0 0 0 4px', fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '-1px' }}>
        ×
      </button>
    </div>
  ));
}

export default function DashboardTopbar({ title, role, onMenuToggle }) {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [notifCount, setNotifCount]       = useState(0);
  const [notifOpen,  setNotifOpen]        = useState(false);
  const [notifs,     setNotifs]           = useState([]);
  const [search,     setSearch]           = useState('');

  useEffect(() => {
    notificationsApi.unreadCount().then(r => setNotifCount(r.data.data.unreadCount ?? 0)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (n) => {
      setNotifCount(c => c + 1);
      setNotifs(prev => [n, ...prev].slice(0, 8));
      playTone(n.type === 'new_message' ? 'message' : 'notification');
      showNotifToast(n, navigate);

      // Invalidate cached data so visible pages update without a manual refresh.
      // Each notification type maps to the queries it makes stale.
      if (role === 'student') {
        if (['status_update', 'note_update'].includes(n.type)) {
          qc.invalidateQueries({ queryKey: ['my-apps'] });
        }
        if (n.type === 'new_message') {
          qc.invalidateQueries({ queryKey: ['message-threads-student'] });
        }
        if (n.type === 'offer') {
          qc.invalidateQueries({ queryKey: ['offers-rec'] });
        }
      } else if (role === 'company') {
        if (n.type === 'new_application') {
          qc.invalidateQueries({ queryKey: ['company-apps'] });
          qc.invalidateQueries({ queryKey: ['my-offers'] });
        }
        if (n.type === 'status_update') {
          // student accepted/declined offer
          qc.invalidateQueries({ queryKey: ['company-apps'] });
        }
        if (n.type === 'new_message') {
          qc.invalidateQueries({ queryKey: ['message-threads'] });
        }
      }
    };
    socket.on('new_notification', handler);
    return () => socket.off('new_notification', handler);
  }, [socket, navigate, role, qc]);

  // Opening the panel should NOT mark everything read — a glance must not
  // destroy unread state. We only fetch; reads happen on click-through or via
  // the explicit "Mark all read" action.
  const openNotifs = async () => {
    setNotifOpen(true);
    try {
      const r = await notificationsApi.list({ limit: 8 });
      setNotifs(r.data.data || []);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setNotifCount(0);
      qc.invalidateQueries({ queryKey: ['notif-unread-sidebar'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    } catch {}
  };

  const handleNotifClick = async (n) => {
    if (!n.isRead) {
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
      setNotifCount(c => Math.max(0, c - 1));
      try {
        await notificationsApi.markRead(n.id);
        qc.invalidateQueries({ queryKey: ['notif-unread-sidebar'] });
        qc.invalidateQueries({ queryKey: ['notifications'] });
      } catch {}
    }
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  };

  const SEARCH_ROUTES = {
    student: '/student/offers',
    company: '/company/offers',
    admin:   '/admin/users',
  };

  const handleSearch = (e) => {
    if (e.key !== 'Enter') return;
    const q = search.trim();
    const base = SEARCH_ROUTES[role] || '/offers';
    navigate(q ? `${base}?search=${encodeURIComponent(q)}` : base);
    setSearch('');
  };

  const today = new Date().toLocaleDateString('en-CM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6"
      style={{ background: 'rgba(246,245,241,0.92)', borderBottom: '1px solid #E7E6DF', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: '#EFEEE8', color: '#6B6F69' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-semibold text-base leading-tight" style={{ color: '#1B1D1A' }}>{title}</h1>
          <p className="text-xs hidden sm:block" style={{ color: '#9A9E97' }}>{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A4A89F' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search… (Enter)"
            className="w-52 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none"
            style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
            onFocus={e => e.target.style.borderColor = '#1E5B45'}
            onBlur={e => e.target.style.borderColor = '#DDDBD2'}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={notifOpen ? () => setNotifOpen(false) : openNotifs}
            className="w-9 h-9 rounded-lg flex items-center justify-center relative"
            style={{ background: '#EFEEE8', color: '#6B6F69' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E7E6DF'; e.currentTarget.style.color = '#1B1D1A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#EFEEE8'; e.currentTarget.style.color = '#6B6F69'; }}>
            <Bell size={16} />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-11 w-80 rounded-xl z-50 overflow-hidden"
                style={{ background: '#fff', border: '1px solid #E7E6DF', boxShadow: '0 8px 32px rgba(24,32,24,.10)' }}>
                <div className="px-4 py-3 flex items-center justify-between gap-2" style={{ borderBottom: '1px solid #F0F0EA' }}>
                  <span className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Notifications</span>
                  <div className="flex items-center gap-3">
                    {notifs.some(n => !n.isRead) && (
                      <button onClick={markAllRead}
                        className="flex items-center gap-1 text-xs font-semibold"
                        style={{ color: '#6B6F69', background: 'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1E5B45'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6B6F69'}>
                        <CheckCheck size={12} /> Mark all read
                      </button>
                    )}
                    <Link
                      to={`/${role}/notifications`}
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold"
                      style={{ color: '#1E5B45', textDecoration: 'none' }}
                    >
                      View all →
                    </Link>
                  </div>
                </div>
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm" style={{ color: '#9A9E97' }}>No new notifications</p>
                ) : notifs.map(n => {
                  const isUnread = !n.isRead;
                  return (
                    <div key={n.id} onClick={() => handleNotifClick(n)}
                      className="px-4 py-3 cursor-pointer flex items-start gap-2.5"
                      style={{ borderBottom: '1px solid #F6F5F1', background: isUnread ? '#FAFDF9' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = isUnread ? '#F2F8F0' : '#FAFAF7'}
                      onMouseLeave={e => e.currentTarget.style.background = isUnread ? '#FAFDF9' : 'transparent'}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: isUnread ? '#1E5B45' : 'transparent' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: isUnread ? '#1B1D1A' : '#6B6F69' }}>{n.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6B6F69' }}>{n.body}</p>
                        <p className="text-xs mt-1" style={{ color: '#A4A89F' }}>{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Post Offer (company) */}
        {role === 'company' && (
          <button
            onClick={() => navigate('/company/offers/post')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg"
            style={{ background: '#1E5B45' }}
            onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
            onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
            + Post Internship
          </button>
        )}
      </div>
    </header>
  );
}
