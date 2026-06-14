import { Search, Bell, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notificationsApi } from '../../api/notifications';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { formatRelativeTime } from '../../lib/utils';

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
    };
    socket.on('new_notification', handler);
    return () => socket.off('new_notification', handler);
  }, [socket]);

  const openNotifs = async () => {
    setNotifOpen(true);
    try {
      const r = await notificationsApi.list({ limit: 8 });
      setNotifs(r.data.data || []);
      await notificationsApi.markAllRead();
      setNotifCount(0);
      qc.invalidateQueries({ queryKey: ['notif-unread-sidebar'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    } catch {}
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
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #F0F0EA' }}>
                  <span className="font-semibold text-sm" style={{ color: '#1B1D1A' }}>Notifications</span>
                  <Link
                    to={`/${role}/notifications`}
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold"
                    style={{ color: '#1E5B45', textDecoration: 'none' }}
                  >
                    View all →
                  </Link>
                </div>
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm" style={{ color: '#9A9E97' }}>No new notifications</p>
                ) : notifs.map(n => (
                  <div key={n.id} className="px-4 py-3 cursor-pointer"
                    style={{ borderBottom: '1px solid #F6F5F1' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B6F69' }}>{n.body}</p>
                    <p className="text-xs mt-1" style={{ color: '#A4A89F' }}>{formatRelativeTime(n.createdAt)}</p>
                  </div>
                ))}
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
