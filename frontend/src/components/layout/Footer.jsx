import { Link } from 'react-router-dom';
import { Compass, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

// `href: ''` = placeholder (icon shows but click is a no-op) until a real URL
// is added. GitHub points at the public repo.
const SOCIALS = [
  { Icon: Github,   href: 'https://github.com/mahitoh/internbeacon', label: 'GitHub' },
  { Icon: Linkedin, href: '', label: 'LinkedIn' },
  { Icon: Twitter,  href: '', label: 'Twitter' },
  { Icon: Youtube,  href: '', label: 'YouTube' },
];

const COLS = [
  {
    label: 'Solutions',
    links: [
      { label: 'Why InternBeacon', href: '/about' },
      { label: 'Features',         href: '/' },
      { label: 'Careers',          href: '/about' },
      { label: 'Security',         href: '/' },
    ],
  },
  {
    label: 'Platform',
    links: [
      { label: 'Find Internships', href: '/offers' },
      { label: 'For Companies',    href: '/for-companies' },
      { label: 'Pricing',          href: '/pricing' },
      { label: 'Partners',         href: '/about' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Pricing',       href: '/pricing' },
      { label: 'Contact Sales', href: '/contact' },
      { label: 'FAQ',           href: '/pricing' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#092218', color: 'white', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: '#b4f05b' }}>
                <Compass size={18} style={{ color: '#092218', strokeWidth: 2.5 }} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">InternBeacon</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Connecting Cameroonian students with top companies. The smarter way to find and fill internships.
            </p>
            <div className="space-y-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <p>E: hello@internbeacon.cm</p>
              <p>T: +237 699 000 000</p>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.label}>
              <h4 className="font-extrabold text-xs uppercase tracking-widest mb-5"
                style={{ color: 'rgba(255,255,255,0.85)' }}>
                {col.label}
              </h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseOver={e => e.currentTarget.style.color = '#b4f05b'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; Copyright 2026 InternBeacon. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href || undefined}
                {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: e => e.preventDefault() })}
                aria-label={label}
                className="transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.35)', cursor: href ? 'pointer' : 'default' }}
                onMouseOver={e => e.currentTarget.style.color = '#b4f05b'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
