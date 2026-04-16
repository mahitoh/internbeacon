import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function EmployersPage() {
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="bg-on-primary-fixed py-24 px-8 overflow-hidden relative">
          <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
          <div className="max-w-screen-xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-secondary-fixed-dim text-xs font-bold tracking-[0.2em] uppercase mb-8 w-fit">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                For Employers
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-tight mb-6">
                Hire Cameroon&apos;s top student talent.
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                Stop sifting through unqualified CVs. InternBeacon surfaces the top 5% of students — pre-screened, motivated, and ready. Post a role in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary-container text-on-secondary-fixed font-bold rounded-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  Post your first role — free
                </Link>
                <Link
                  href="/employer/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Go to console
                  <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                <p className="text-4xl font-extrabold text-white">1,284</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Active applicants</p>
              </div>
              <div className="bg-secondary-container/20 border border-secondary-container/30 rounded-2xl p-6 space-y-2 mt-8">
                <p className="text-4xl font-extrabold text-secondary-fixed-dim">92%</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Placement success rate</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2 -mt-4">
                <p className="text-4xl font-extrabold text-white">48h</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Avg. first application</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                <p className="text-4xl font-extrabold text-white">120+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Partner companies</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">The process</span>
              <h2 className="text-4xl font-extrabold text-on-primary-fixed tracking-tighter">Simple. Efficient. Effective.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "edit_note",
                  step: "01",
                  title: "Post a role",
                  desc: "Describe the position, required skills, and duration. Takes under 5 minutes.",
                },
                {
                  icon: "filter_alt",
                  step: "02",
                  title: "Review matches",
                  desc: "Our AI surfaces the best-fit candidates from our vetted student pool.",
                },
                {
                  icon: "handshake",
                  step: "03",
                  title: "Hire directly",
                  desc: "Message shortlisted students and confirm placements — no middlemen.",
                },
              ].map(({ icon, step, title, desc }) => (
                <div key={step} className="relative bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 hover:-translate-y-1 transition-transform">
                  <span className="absolute top-6 right-6 text-7xl font-black text-slate-100 pointer-events-none select-none">{step}</span>
                  <div className="w-14 h-14 bg-on-primary-fixed rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-primary-fixed mb-3 font-headline">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Why InternBeacon</span>
              <h2 className="text-4xl font-extrabold text-on-primary-fixed tracking-tighter">Built for serious hiring teams.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "groups", title: "Pre-screened talent", desc: "Every student profile is verified against their university and academic record." },
                { icon: "auto_awesome", title: "AI-powered matching", desc: "Roles are automatically matched to candidates based on skills, GPA, and availability." },
                { icon: "chat", title: "Built-in messaging", desc: "Communicate with candidates directly without leaving the platform." },
                { icon: "analytics", title: "Pipeline analytics", desc: "Track application velocity, drop-off rates, and time-to-hire in one dashboard." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 flex gap-6 items-start hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary-fixed text-xl">{icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-primary-fixed mb-2">{title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section className="py-16 px-8 bg-surface border-t border-outline-variant/10">
          <div className="max-w-screen-xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-outline mb-10">Trusted by Cameroon&apos;s industry leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {["ORANGE", "ENEO", "UBA", "CIGAL", "CFAO"].map((brand) => (
                <span key={brand} className="text-2xl font-black text-on-surface-variant tracking-tighter">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-screen-xl mx-auto bg-on-primary-fixed rounded-[2.5rem] p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 architectural-grid opacity-10 pointer-events-none" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tighter">Ready to find your next intern?</h2>
              <p className="text-slate-400 mb-10">Create your employer account and post your first role in under 5 minutes.</p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-5 bg-secondary-container text-on-secondary-fixed font-bold rounded-2xl text-lg hover:scale-[1.03] transition-transform active:scale-95 shadow-xl shadow-amber-500/10"
              >
                Get started — it&apos;s free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
