import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Search, ChevronRight, Diamond,
} from 'lucide-react';

const COMPANIES = [
  'MTN Cameroon', 'Orange Cameroon', 'Afriland First Bank',
  'BICEC', 'Dangote Cement', 'TotalEnergies', 'Camtel', 'SCDP'
];

const UNIVERSITIES = [
  'ICT University', 'Univ. Yaoundé I', 'Univ. Yaoundé II', 'ESSEC Douala',
  'ENSP Yaoundé', 'IUT Douala', 'SUP\'TIC', 'IRIC',
  'Univ. Dschang', 'ISTDI', 'Univ. Buea', 'HTTTC Kumba',
  'Univ. Ngaoundéré', 'Univ. Maroua',
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden" style={{ backgroundColor: '#faf9f5' }}>

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative flex items-center justify-center min-h-[88vh] pt-8 pb-16 bg-grid border-b border-gray-100">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(180,240,91,0.08)' }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border"
              style={{ backgroundColor: '#f2faf6', borderColor: '#def2e8', color: '#226148' }}>
              🌱 Internship Platform for Cameroon
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
            style={{ color: '#092218' }}>
            One platform to{' '}
            <span className="relative inline-block px-1">
              <span className="relative z-10">discover</span>
              <span className="absolute bottom-1.5 left-0 w-full h-3 rounded-sm -z-10"
                style={{ backgroundColor: 'rgba(180,240,91,0.45)' }} />
            </span>
            {' '}and land internships in Cameroon
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(9,34,24,0.65)' }}>
            InternBeacon connects Cameroonian university students with top companies. Browse verified opportunities, apply in minutes, and track every step.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-2.5 shadow-sm">
              <Search size={18} className="ml-3 flex-shrink-0" style={{ color: 'rgba(9,34,24,0.3)' }} />
              <input
                placeholder="Search internship title, domain, or company..."
                className="flex-1 bg-transparent py-2 px-2 text-sm focus:outline-none"
                style={{ color: '#092218' }}
                onKeyDown={e => e.key === 'Enter' && navigate('/offers')}
              />
              <button
                onClick={() => navigate('/offers')}
                className="font-bold text-sm px-6 py-2.5 rounded-xl text-white transition-all shadow-sm"
                style={{ backgroundColor: '#092218' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#0f2d20'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#092218'}>
                Search
              </button>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/register/student')}
              className="text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center gap-2"
              style={{ backgroundColor: '#092218' }}>
              Start for Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="font-bold px-8 py-3.5 rounded-xl border border-gray-200 bg-white transition-all text-sm"
              style={{ color: '#092218' }}>
              Get a Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-8 text-xs sm:text-sm"
            style={{ color: 'rgba(9,34,24,0.4)' }}>
            Trusted by{' '}
            <span className="font-bold" style={{ color: '#092218' }}>2,400+ students</span>
            {' '}across{' '}
            <span className="font-bold" style={{ color: '#092218' }}>8 universities</span>
            {' '}in Cameroon
          </motion.p>
        </div>
      </section>

      {/* ─── PARTNERS ─────────────────────────────────── */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: 'rgba(9,34,24,0.35)' }}>
            More than 850+ partner companies
          </p>
          <div className="flex items-center justify-center gap-x-12 gap-y-6 flex-wrap">
            {COMPANIES.map(c => (
              <span key={c} className="text-sm font-extrabold tracking-tight transition-colors cursor-default"
                style={{ color: 'rgba(9,34,24,0.5)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ backgroundColor: '#f2faf6', borderColor: '#def2e8', color: '#226148' }}>
              <Diamond size={9} className="fill-current" /> Features
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]"
              style={{ color: '#092218' }}>
              Everything you need to launch<br />your career in Cameroon
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
              style={{ color: 'rgba(9,34,24,0.55)' }}>
              InternBeacon gives students and companies the tools to find, apply, and hire — faster and smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Wide card: Dynamic Dashboard */}
            <div className="lg:col-span-2 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row gap-10 items-center justify-between overflow-hidden border"
              style={{ backgroundColor: '#f2f1ea', borderColor: '#e7e4d5' }}>
              <div className="max-w-sm space-y-4">
                <h3 className="text-2xl font-black" style={{ color: '#092218' }}>Dynamic dashboard</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(9,34,24,0.65)' }}>
                  InternBeacon helps students and companies track applications in real time, delivering the visibility and data-driven insights needed to land and fill internships faster.
                </p>
                <button onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-1 text-sm font-bold transition-colors pt-2"
                  style={{ color: '#092218' }}>
                  Explore all <ChevronRight size={14} />
                </button>
              </div>

              {/* Bar chart mockup */}
              <div className="w-full md:w-80 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold" style={{ color: '#092218' }}>Analytics</span>
                  <span className="text-[10px]" style={{ color: 'rgba(9,34,24,0.4)' }}>Active Roles</span>
                </div>
                <div className="h-40 flex items-end gap-2.5 pt-4 px-2 border-b border-gray-100">
                  {[40, 65, 30, 90, 50, 70, 35].map((h, i) => (
                    <div key={i} className="w-full rounded-t-md transition-all"
                      style={{ height: `${h}%`, backgroundColor: i === 3 ? '#092218' : '#e7e4d5' }} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-semibold" style={{ color: 'rgba(9,34,24,0.4)' }}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            </div>

            {/* Smart Notifications */}
            <div className="rounded-3xl p-8 sm:p-10 flex flex-col gap-8 border"
              style={{ backgroundColor: '#f2f1ea', borderColor: '#e7e4d5' }}>
              <div className="space-y-3">
                <h3 className="text-xl font-black" style={{ color: '#092218' }}>Smart notifications</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(9,34,24,0.65)' }}>
                  Get instant alerts when companies update your application or send you a message. Never miss an opportunity.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold" style={{ color: '#092218' }}>Email notifications</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: '#f2faf6', borderColor: '#def2e8', color: '#226148' }}>Active</span>
                </div>
                {[
                  { label: 'Application viewed or reviewed', on: true },
                  { label: 'Offer deadline reminder', on: false },
                  { label: 'New message from recruiter', on: true },
                  { label: 'Weekly internship digest', on: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <span className="text-[11px] leading-tight" style={{ color: 'rgba(9,34,24,0.75)' }}>{item.label}</span>
                    <div className="w-9 h-5 rounded-full p-0.5 flex flex-shrink-0 cursor-default transition-colors"
                      style={{ backgroundColor: item.on ? '#092218' : '#e7e4d5', justifyContent: item.on ? 'flex-end' : 'flex-start' }}>
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Management */}
            <div className="rounded-3xl p-8 sm:p-10 flex flex-col gap-8 border"
              style={{ backgroundColor: '#f2f1ea', borderColor: '#e7e4d5' }}>
              <div className="space-y-3">
                <h3 className="text-xl font-black" style={{ color: '#092218' }}>Task management</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(9,34,24,0.65)' }}>
                  Track applications, receive status updates, and chat directly with recruiters — all in one timeline.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold" style={{ color: '#092218' }}>Recent Activity</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: '#f7fee7', borderColor: '#d9f99d', color: '#4d7c0f' }}>+ New</span>
                </div>
                {[
                  { name: 'Collins Nkem', text: "Application accepted — internship offer from MTN Cameroon.", status: 'Accepted', dot: '#092218' },
                  { name: 'Amina Bello', text: "Application under review by the HR team at Orange CM.", status: 'In Review', dot: '#d97706' },
                ].map((task, i) => (
                  <div key={i} className="p-3 rounded-xl space-y-1 border"
                    style={{ backgroundColor: '#faf9f5', borderColor: '#e7e4d5' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold" style={{ color: '#092218' }}>{task.name}</span>
                      <span className="text-[9px]" style={{ color: 'rgba(9,34,24,0.4)' }}>Today</span>
                    </div>
                    <p className="text-[11px] leading-tight" style={{ color: 'rgba(9,34,24,0.7)' }}>{task.text}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.dot }} />
                      <span className="text-[9px] font-bold" style={{ color: task.dot }}>{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS ─────────────────────────────── */}
      <section className="py-24 text-white relative overflow-hidden" style={{ backgroundColor: '#092218' }}>
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#b4f05b' }}>
              <Diamond size={9} className="fill-current" /> Integration
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              Students from Cameroon's<br />leading universities
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              We partner with universities across all regions — from Yaoundé and Douala to Buea, Garoua, and beyond — to connect every talented student.
            </p>
            <button onClick={() => navigate('/about')}
              className="mt-6 inline-flex items-center gap-1 text-sm font-bold transition-colors"
              style={{ color: '#b4f05b' }}>
              Learn about our partnerships <ArrowRight size={14} />
            </button>
          </div>

          {/* Universities grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {UNIVERSITIES.map((tool, i) => (
              <div key={i} className="flex items-center justify-center py-4 px-2 rounded-2xl border text-xs font-bold text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ──────────────────────────────── */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="text-8xl font-serif leading-none" style={{ color: '#092218' }}>"</div>
          <blockquote className="text-2xl sm:text-3xl font-bold leading-relaxed max-w-3xl mx-auto"
            style={{ color: '#092218' }}>
            InternBeacon cut our intern recruitment time by 60%. The quality of candidates is consistently high and the platform is incredibly easy to use.
          </blockquote>
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2"
              style={{ backgroundColor: '#f2faf6', borderColor: '#def2e8', color: '#092218' }}>
              CM
            </div>
            <div>
              <p className="font-extrabold text-base" style={{ color: '#092218' }}>Carole Mvogo</p>
              <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(9,34,24,0.4)' }}>HR Manager · MTN Cameroon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────── */}
      <section className="py-16 border-b border-gray-100" style={{ backgroundColor: '#f2f1ea' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '2024', label: 'Year Founded' },
              { value: '2,400+', label: 'Students Placed' },
              { value: '850+',  label: 'Company Partners' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#092218' }}>{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(9,34,24,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────── */}
      <section className="py-20 text-white relative overflow-hidden" style={{ backgroundColor: '#0f2d20' }}>
        <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-8 relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Discover the full scale of{' '}
              <span className="relative inline-block">
                <span className="relative z-10">InternBeacon</span>
                <span className="absolute bottom-0.5 left-0 w-full h-2.5 rounded-sm"
                  style={{ backgroundColor: '#b4f05b' }} />
              </span>
              {' '}capabilities
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center shrink-0">
            <button onClick={() => navigate('/contact')}
              className="bg-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm shadow-md"
              style={{ color: '#092218' }}>
              Get a Demo
            </button>
            <button onClick={() => navigate('/register/student')}
              className="font-bold px-8 py-3.5 rounded-xl transition-all text-sm shadow-md"
              style={{ backgroundColor: '#b4f05b', color: '#092218' }}>
              Start for Free
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
