import { motion } from 'framer-motion';
import { CheckCircle2, Users, Briefcase, Globe2, Heart, Diamond } from 'lucide-react';

const TEAM = [
  { name: 'Alexis Kamga', role: 'CEO & Co-founder', avatar: 'AK' },
  { name: 'Solange Biyong', role: 'CTO & Co-founder', avatar: 'SB' },
  { name: 'Eric Ndum', role: 'Head of Partnerships', avatar: 'EN' },
  { name: 'Fatima Mbarga', role: 'Product Designer', avatar: 'FM' },
];

const VALUES = [
  { icon: Globe2, title: 'Local Impact', desc: 'Built for Cameroon, by Cameroonians. We understand the unique needs of students and companies in our market.' },
  { icon: Users, title: 'Student First', desc: 'Our platform is free for students. Every decision we make prioritizes the success of young Cameroonian talent.' },
  { icon: Heart, title: 'Inclusive Growth', desc: 'We partner with universities across all regions — not just Yaoundé and Douala — to reach every talented student.' },
  { icon: Briefcase, title: 'Trusted Quality', desc: 'Every company is verified. Every listing is reviewed. No spam, no ghost postings.' },
];

export default function AboutPage() {
  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-forest-950 py-24 text-center text-white overflow-hidden border-b border-forest-900">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#b4f05b] mb-4">
              <Diamond size={8} className="fill-lime-500 text-lime-500" /> About Us
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            Bridging the gap between<br />
            <span className="text-lime-500 relative inline-block">
              students & industry
              <span className="absolute bottom-1 left-0 w-full h-1 bg-lime-500/30 rounded-sm"></span>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            InternBeacon was founded in 2024 with a simple mission: make internship hunting in Cameroon as easy as it is in the world's most developed economies.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-24 border-b ">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]">Our Mission</span>
            <h2 className="text-3xl font-black text-forest-950 leading-tight">
              Powering the next generation of Cameroonian professionals
            </h2>
            <p className="text-forest-800/70 text-sm leading-relaxed">
              Every year, thousands of brilliant Cameroonian university students graduate without ever having had a meaningful internship experience. Not because they lack talent — but because the system makes it too hard to find opportunities.
            </p>
            <p className="text-forest-800/70 text-sm leading-relaxed">
              We built InternBeacon to fix that. A single platform where students can discover verified internships, apply directly, and communicate with recruiters in real time.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {['Founded 2024 in Yaoundé', '850+ partner companies', '8 partner universities', '2,400+ placements made'].map(p => (
                <li key={p} className="flex items-center gap-3 text-sm text-forest-950 font-semibold">
                  <CheckCircle2 size={16} className="text-lime-600 flex-shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <div key={v.title} className="bg-[#f2f1ea] border border-[#e7e4d5] rounded-2xl p-6 border  flex flex-col justify-between">
                <v.icon size={22} className="text-forest-900 mb-4" />
                <div>
                  <h3 className="font-black text-forest-950 text-base">{v.title}</h3>
                  <p className="text-forest-800/60 text-xs mt-2 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-sand-50 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2faf6] border border-[#def2e8] text-[10px] font-bold uppercase tracking-widest text-[#226148]">The Team</span>
            <h2 className="text-3xl font-black text-forest-950">Built by Cameroonians, for Cameroonians</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map(m => (
              <div key={m.name} className="space-y-3 text-center">
                <div className="w-20 h-20 rounded-2xl bg-forest-900 flex items-center justify-center text-lime-400 font-extrabold text-xl mx-auto shadow-md">
                  {m.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-forest-950 text-sm">{m.name}</p>
                  <p className="text-forest-800/40 text-xs font-semibold mt-0.5">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
