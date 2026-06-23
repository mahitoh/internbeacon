import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'About',            href: '/about' },
    { label: 'Find Internships', href: '/offers' },
    { label: 'For Companies',    href: '/for-companies' },
    { label: 'Pricing',          href: '/pricing' },
  ];

  const dashboardHref =
    user?.role === 'student'
      ? '/student/dashboard'
      : user?.role === 'company'
      ? '/company/dashboard'
      : null;

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50 border-b shadow-sm"
      style={{ backgroundColor: 'rgba(250,249,245,0.92)', borderColor: 'rgba(231,228,213,0.5)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: '#b4f05b' }}>
              <Compass size={18} style={{ color: '#092218', strokeWidth: 2.5 }} />
            </div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: '#092218' }}>
              InternBeacon
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#f2f1ea] text-[#092218]'
                      : 'text-[rgba(9,34,24,0.65)] hover:text-[#092218] hover:bg-[#f2f1ea]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate(dashboardHref)}
                className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all shadow-sm active:scale-95"
                style={{ backgroundColor: '#092218' }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold transition-colors px-3 py-2"
                  style={{ color: 'rgba(9,34,24,0.65)' }}
                  onMouseOver={e => e.currentTarget.style.color = '#092218'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(9,34,24,0.65)'}
                >
                  Log in
                </Link>
                <button
                  onClick={() => navigate('/register/student')}
                  className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all shadow-sm active:scale-95"
                  style={{ backgroundColor: '#092218' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#0f2d20'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#092218'}
                >
                  Start Free
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(9,34,24,0.7)' }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t" style={{ backgroundColor: '#faf9f5', borderColor: '#e7e4d5' }}>
          <div className="px-6 py-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: 'rgba(9,34,24,0.7)' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f2f1ea'; e.currentTarget.style.color = '#092218'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(9,34,24,0.7)'; }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: '#e7e4d5' }}>
              {user ? (
                <button
                  className="w-full text-sm font-bold py-3 rounded-lg text-white text-center"
                  style={{ backgroundColor: '#092218' }}
                  onClick={() => { navigate(dashboardHref); setOpen(false); }}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block text-center py-2 text-sm font-semibold"
                    style={{ color: 'rgba(9,34,24,0.65)' }}
                  >
                    Log in
                  </Link>
                  <button
                    onClick={() => { navigate('/register/student'); setOpen(false); }}
                    className="w-full text-sm font-bold py-3 rounded-lg text-white text-center"
                    style={{ backgroundColor: '#092218' }}
                  >
                    Start Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
