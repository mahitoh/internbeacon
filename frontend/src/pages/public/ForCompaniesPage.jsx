import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Building2, Users, BarChart2,
  MessageSquare, Bell, Briefcase, Star, TrendingUp, Diamond
} from 'lucide-react';
import Button from '../../components/ui/Button';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Post Internship Offers',
    desc: 'Create detailed listings with requirements, stipend, duration, and location. Go live in minutes.',
  },
  {
    icon: Users,
    title: 'AI-Powered Matching',
    desc: 'Our algorithm surfaces the most relevant candidates from thousands of verified student profiles.',
  },
  {
    icon: BarChart2,
    title: 'Application Pipeline',
    desc: 'Manage every applicant in one place. Move candidates through stages with a single click.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    desc: 'Chat in real time with shortlisted candidates. No external tools needed.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Get notified when top candidates apply. Never miss a promising profile.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Insights',
    desc: 'Track views, applications, conversion rates, and time-to-hire across all your listings.',
  },
];

const STEPS = [
  { step: '01', title: 'Create Company Profile', desc: 'Register your company, add your logo and description, and get verified in under 24 hours.' },
  { step: '02', title: 'Post an Offer',           desc: 'Fill in the internship details — role, duration, requirements, and compensation — and publish.' },
  { step: '03', title: 'Review Applications',     desc: "Browse candidate profiles, read CVs, and shortlist the ones that fit your team's needs." },
  { step: '04', title: 'Hire with Confidence',    desc: 'Chat with finalists, make your offer, and onboard your new intern seamlessly.' },
];

const TESTIMONIALS = [
  {
    name: 'Carole Mvogo',
    role: 'HR Manager, MTN Cameroon',
    avatar: 'CM',
    quote: 'InternBeacon cut our intern recruitment time by 60%. The quality of candidates is consistently high and the platform is incredibly easy to use.',
  },
  {
    name: 'Paul Tchatchoua',
    role: 'Talent Lead, Afriland First Bank',
    avatar: 'PT',
    quote: 'We posted our first offer and had 40 qualified applicants within 48 hours. The AI matching really works — every recommended profile was relevant.',
  },
  {
    name: 'Diane Essomba',
    role: 'Operations Director, Orange Cameroon',
    avatar: 'DE',
    quote: "The pipeline management and messaging tools save our team hours every week. It's the only intern recruitment tool we use now.",
  },
];

const TRUSTEDBY = ['MTN Cameroon', 'Orange CM', 'Afriland First Bank', 'BICEC', 'Dangote CM', 'Total Energies CM', 'CAMTEL', 'SCDP'];

export default function ForCompaniesPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-forest-950 py-24 text-white overflow-hidden border-b border-forest-900">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#b4f05b] mb-4">
            <Building2 size={12} className="text-lime-500" /> For Companies
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Find your next intern<br />
            <span className="text-lime-500 relative inline-block">
              in days, not weeks
              <span className="absolute bottom-1.5 left-0 w-full h-1.5 bg-lime-500/30 rounded-sm"></span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Post internship offers, manage applications, and communicate with top candidates from Cameroon's leading universities — all from one powerful dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap pt-4">
            <button
              onClick={() => navigate('/register/company')}
              className="bg-lime-500 text-forest-950 font-bold px-8 py-3.5 rounded-xl hover:bg-lime-400 transition-all active:scale-95 shadow-md text-sm">
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 transition-all active:scale-95 text-sm">
              Request a Demo
            </button>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="pt-12 space-y-4">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Trusted by leading companies</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-40">
              {TRUSTEDBY.map(c => (
                <span key={c} className="text-sm font-extrabold text-white">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 border-b ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]">
              <Diamond size={10} className="fill-forest-700 text-forest-700" /> Platform Features
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-forest-950 tracking-tight leading-tight">
              Everything you need to hire<br />the best interns
            </h2>
            <p className="mt-4 text-forest-800/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              One dashboard. Zero friction. Full control over your internship recruitment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className="bg-[#f2f1ea] border border-[#e7e4d5] rounded-2xl p-8 hover:border-forest-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center mb-6 shadow-sm">
                  <f.icon size={20} className="text-lime-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-forest-950 text-base">{f.title}</h3>
                  <p className="text-forest-800/75 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sand-50 py-24 border-b ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]">How It Works</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-forest-950 tracking-tight">
              Hire your next intern<br />in 4 simple steps
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 border  shadow-sm relative flex flex-col justify-between">
                <span className="text-4xl font-black text-lime-500/20 leading-none">{s.step}</span>
                <div className="mt-4 space-y-1">
                  <h3 className="font-extrabold text-forest-950 text-sm">{s.title}</h3>
                  <p className="text-forest-800/60 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]">Company Stories</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-forest-950 tracking-tight">
              Trusted by HR teams<br />across Cameroon
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name}
                className="bg-[#f2f1ea] border border-[#e7e4d5] rounded-2xl p-8 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-forest-900 fill-forest-900" />)}
                </div>
                <p className="text-forest-800/80 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center text-lime-400 text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-extrabold text-forest-950 text-sm">{t.name}</p>
                    <p className="text-forest-800/40 text-[10px] font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-900 py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to find your<br />next great intern?
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Join 850+ Cameroonian companies already hiring on InternBeacon.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-forest-950 font-bold px-8 py-3.5 rounded-xl hover:bg-sand-100 transition-all active:scale-95 text-sm shadow-md">
              Request a Demo
            </button>
            <button
              onClick={() => navigate('/register/company')}
              className="bg-lime-500 text-forest-950 font-bold px-8 py-3.5 rounded-xl hover:bg-lime-400 transition-all active:scale-95 text-sm shadow-md">
              Create Company Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
