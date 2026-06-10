import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notificationsApi } from '../../api/notifications';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../context/ThemeContext';
import { formatRelativeTime } from '../../lib/utils';

export default function DashboardTopbar({ title, role, onMenuToggle }) {
  const { user } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
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
    <header className="h-16 bg-[#0f0f0f] border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-white font-semibold text-base md:text-lg leading-tight">{title}</h1>
          <p className="text-white/30 text-xs hidden sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search… (Enter)"
            className="w-52 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-lime-500/50 transition-colors"
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={notifOpen ? () => setNotifOpen(false) : openNotifs}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors relative">
            <Bell size={16} />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-11 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Notifications</span>
                <Link
                  to={`/${role}/notifications`}
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-lime-400 hover:text-lime-300 transition-colors"
                >
                  View all →
                </Link>
              </div>
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-white/30 text-sm">No new notifications</p>
                ) : notifs.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer">
                    <p className="text-sm text-white font-medium">{n.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{n.body}</p>
                    <p className="text-xs text-white/25 mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Post Offer (company mobile) */}
        {role === 'company' && (
          <button
            onClick={() => navigate('/company/offers/post')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-lg transition-colors">
            + Post Internship
          </button>
        )}

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            : <div className="w-full h-full bg-lime-500/20 flex items-center justify-center text-lime-400 text-xs font-bold">
                {(user?.email?.[0] || '?').toUpperCase()}
              </div>
          }
        </div>
      </div>
    </header>
  );
}
