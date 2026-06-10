import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';

const TITLES = {
  '/student/dashboard':    'Dashboard',
  '/student/offers':       'Browse Internships',
  // detail page title is dynamic — fallback handled by the default below
  '/student/applications': 'My Applications',
  '/student/profile':      'My Profile',
  '/student/messages':     'Messages',
  '/student/analytics':    'My Analytics',
  '/student/interviews':   'Interview Center',
  '/student/companies':    'Companies',
  '/student/saved':        'Saved Offers',
  '/company/dashboard':    'Dashboard',
  '/company/offers':       'My Internship Posts',
  '/company/offers/post':  'Post New Internship',
  '/company/applications': 'Applications',
  '/company/messages':     'Messages',
  '/company/profile':      'Company Profile',
  '/company/analytics':    'Analytics',
  '/student/notifications':'Notifications',
  '/company/notifications':'Notifications',
  '/admin/dashboard':      'Overview',
  '/admin/users':          'User Management',
  '/admin/offers':         'Offer Management',
  '/admin/applications':   'Application Overview',
};

export default function DashboardLayout({ role }) {
  const { pathname } = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const title = TITLES[pathname]
    ?? (pathname.startsWith('/student/offers/') ? 'Internship Details' : null)
    ?? (pathname.startsWith('/student/companies/') ? 'Company Profile' : null)
    ?? (pathname.startsWith('/company/messages/') ? 'Messages' : null)
    ?? (pathname.startsWith('/student/messages/') ? 'Messages' : null)
    ?? (pathname.match(/^\/company\/offers\/.+\/edit$/) ? 'Edit Internship' : null)
    ?? 'InternBeacon';

  return (
    <div className="flex bg-[#0f0f0f] min-h-screen">
      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        role={role}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          title={title}
          role={role}
          onMenuToggle={() => setMobileSidebarOpen(o => !o)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
