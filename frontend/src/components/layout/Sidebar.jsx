import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass, LayoutDashboard, Briefcase, FileText, MessageSquare,
  Bookmark, User, BarChart2, Plus, ChevronLeft, ChevronRight, LogOut, Users, ShieldCheck, Bell, Calendar, Building2,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { notificationsApi } from '../../api/notifications';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const STUDENT_NAV = [
  { label: 'Dashboard',       href: '/student/dashboard',      icon: LayoutDashboard },
  { label: 'Browse Offers',   href: '/student/offers',         icon: Briefcase },
  { label: 'Companies',       href: '/student/companies',      icon: Building2 },
  { label: 'Applications',    href: '/student/applications',   icon: FileText },
  { label: 'Interviews',      href: '/student/interviews',     icon: Calendar },
  { label: 'Messages',        href: '/student/messages',       icon: MessageSquare },
  { label: 'Analytics',       href: '/student/analytics',      icon: BarChart2 },
  { label: 'Saved Offers',    href: '/student/saved',          icon: Bookmark },
  { label: 'My Profile',      href: '/student/profile',        icon: User },
  { label: 'Notifications',   href: '/student/notifications',  icon: Bell, notifBadge: true },
];

const COMPANY_NAV = [
  { label: 'Dashboard',       href: '/company/dashboard',      icon: LayoutDashboard },
  { label: 'My Offers',       href: '/company/offers',         icon: Briefcase },
  { label: 'Applications',    href: '/company/applications',   icon: FileText },
  { label: 'Messages',        href: '/company/messages',       icon: MessageSquare },
  { label: 'Analytics',       href: '/company/analytics',      icon: BarChart2 },
  { label: 'Company Profile', href: '/company/profile',        icon: User },
  { label: 'Notifications',   href: '/company/notifications',  icon: Bell, notifBadge: true },
];

const ADMIN_NAV = [
  { label: 'Overview',      href: '/admin/dashboard',     icon: LayoutDashboard },
  { label: 'Users',         href: '/admin/users',          icon: Users },
  { label: 'Offers',        href: '/admin/offers',         icon: Briefcase },
  { label: 'Applications',  href: '/admin/applications',   icon: FileText },
];

export default function Sidebar({ role, mobileOpen = false, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === 'student' ? STUDENT_NAV : role === 'company' ? COMPANY_NAV : ADMIN_NAV;

  const { data: unreadData } = useQuery({
    queryKey: ['notif-unread-sidebar'],
    queryFn:  () => notificationsApi.unreadCount().then(r => r.data.data.unreadCount ?? 0),
    refetchInterval: 60_000,
    enabled: role === 'student' || role === 'company',
  });
  const unreadCount = unreadData ?? 0;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const displayName = role === 'student'
    ? `${user?.studentProfile?.firstName || ''} ${user?.studentProfile?.lastName || ''}`.trim() || user?.email
    : role === 'company'
    ? user?.companyProfile?.companyName || user?.email
    : user?.email;

  const avatarSrc = role === 'student'
    ? user?.studentProfile?.avatarUrl || user?.avatarUrl
    : role === 'company'
    ? user?.companyProfile?.logoUrl || user?.avatarUrl
    : user?.avatarUrl;

  return (
    <aside className={cn(
      'flex flex-col bg-white border-r border-[#E7E6DF] transition-all duration-300 h-screen',
      'fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 lg:z-auto',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center border-b border-[#E7E6DF] h-16', collapsed ? 'justify-center px-2' : 'px-5 gap-2.5')}>
        <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: '#1E5B45' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <polygon points="16 8 11 11 8 16 13 13 16 8" fill="#9FE870" stroke="#9FE870" />
          </svg>
        </div>
        {!collapsed && <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#1B1D1A' }}>InternBeacon</span>}
      </div>

      {/* Admin badge */}
      {role === 'admin' && !collapsed && (
        <div className="px-4 pt-4">
          <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold"
            style={{ background: '#EDF2EE', borderColor: '#C4DBCE', color: '#1E5B45' }}>
            <ShieldCheck size={14} /> Admin Panel
          </div>
        </div>
      )}

      {/* Post Offer CTA (company only) */}
      {role === 'company' && !collapsed && (
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate('/company/offers/post')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
            style={{ background: '#1E5B45' }}
            onMouseEnter={e => e.currentTarget.style.background = '#10342A'}
            onMouseLeave={e => e.currentTarget.style.background = '#1E5B45'}>
            <Plus size={16} />
            Post Internship
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5 dashboard-scroll">
        {nav.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={handleNavClick}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              collapsed ? 'justify-center' : '',
              isActive
                ? 'bg-[#EDF2EE] text-[#1E5B45]'
                : 'text-[#6B6F69] hover:text-[#1B1D1A] hover:bg-[#F0F0EA]'
            )}
            title={collapsed ? item.label : undefined}
          >
            <div className="relative flex-shrink-0">
              <item.icon size={18} />
              {item.notifBadge && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-[#1E5B45] rounded-full text-white text-[9px] flex items-center justify-center font-bold px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="flex-1">{item.label}</span>
            )}
            {!collapsed && item.notifBadge && unreadCount > 0 && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: '#EDF2EE', color: '#1E5B45' }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{ background: '#fff', border: '1px solid #E7E6DF', color: '#9A9E97' }}
        onMouseEnter={e => e.currentTarget.style.color = '#1B1D1A'}
        onMouseLeave={e => e.currentTarget.style.color = '#9A9E97'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User section */}
      <div className="border-t border-[#E7E6DF] p-3">
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
          <Avatar name={displayName} src={avatarSrc} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#1B1D1A' }}>{displayName}</p>
              <p className="text-xs capitalize" style={{ color: '#9A9E97' }}>{role}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="transition-colors" style={{ color: '#C0BFBA' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#C0BFBA'}
              title="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
        {collapsed && (
          <button onClick={handleLogout} className="mt-2 w-full flex justify-center transition-colors" style={{ color: '#C0BFBA' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#C0BFBA'}
            title="Logout">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
