"use client";

import { useParams } from "next/navigation";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiClock, FiDollarSign, FiCalendar, FiArrowLeft, FiShare2, FiHeart, FiShield, FiGlobe } from "react-icons/fi";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function InternshipDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const internship = MOCK_INTERNSHIPS.find((i) => i.id === id);

  if (!internship) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow pt-48 pb-40">
        <div className="max-w-7xl mx-auto px-10">
          <Link 
            href="/listings" 
            className="group inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-on-surface/40 hover:text-primary transition-all mb-20"
          >
            <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" />
            Return to Index
          </Link>

          <header className="mb-32">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-end">
                <div className="lg:col-span-2 space-y-10">
                   <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                      <div className="w-20 h-20 bg-primary/5 border border-primary/10 flex items-center justify-center font-display font-black text-3xl text-primary rounded-sm">
                        {internship.company[0]}
                      </div>
                      <div className="space-y-1">
                         <div className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">{internship.company}</div>
                         <h1 className="font-display font-black text-5xl lg:text-7xl tracking-tighter leading-none uppercase">
                           {internship.title}
                         </h1>
                      </div>
                   </div>
                   
                   <p className="text-lg font-medium text-on-surface/50 leading-relaxed max-w-2xl border-l-[3px] border-on-surface/10 pl-10 py-2">
                     {internship.description}
                   </p>
                </div>
                
                <div className="flex flex-col items-end gap-10">
                   <div className="flex gap-4">
                      <button className="w-16 h-16 border border-on-surface/5 flex items-center justify-center text-xl hover:bg-surface-container transition-all">
                        <FiHeart />
                      </button>
                      <button className="w-16 h-16 border border-on-surface/5 flex items-center justify-center text-xl hover:bg-surface-container transition-all">
                        <FiShare2 />
                      </button>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/30 mb-2">Institutional Verification</div>
                      <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-[0.1em] text-xs justify-end">
                         <FiShield className="text-lg" />
                         Vetted Partner
                      </div>
                   </div>
                </div>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
             {/* Left Meta Info */}
             <aside className="lg:col-span-1 space-y-20">
                <section className="space-y-12">
                   <div className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface/40 border-b border-on-surface/5 pb-6">Core Statistics</div>
                   <div className="space-y-10">
                      {[
                        { icon: <FiDollarSign />, label: "STIPEND", value: internship.stipend },
                        { icon: <FiClock />, label: "DURATION", value: internship.duration },
                        { icon: <FiCalendar />, label: "LODGED ON", value: internship.postedAt },
                        { icon: <FiGlobe />, label: "LOCATION", value: internship.location },
                      ].map((meta, i) => (
                        <div key={i} className="flex flex-col gap-2">
                           <div className="flex items-center gap-3 text-secondary text-sm">
                              {meta.icon}
                              <span className="text-[10px] font-black uppercase tracking-widest">{meta.label}</span>
                           </div>
                           <div className="font-display font-black text-xl tracking-tight">{meta.value}</div>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="bg-surface-container-low p-10 space-y-6 border border-on-surface/5">
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/30">Candidate Type</div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Graduating Class
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-on-surface/40">
                        <span className="w-2 h-2 bg-on-surface/10 rounded-full"></span>
                        Post-Graduate
                      </div>
                   </div>
                </section>
             </aside>

             {/* Right Content */}
             <div className="lg:col-span-3 space-y-32">
                <section className="space-y-12">
                   <h2 className="font-display font-black text-4xl tracking-tighter uppercase">THE ARCHITECTURAL <br /><span className="text-secondary">CHALLENGE.</span></h2>
                   <div className="bg-surface-container-lowest p-16 border-l-8 border-secondary shadow-sm">
                      <p className="text-xl font-medium leading-[2] text-on-surface">
                        {internship.description} Our team is looking for someone who can bridge the gap between complex engineering requirements and user-centric design principles. You will be integrated into a high-performance pod working on core infrastructure.
                      </p>
                   </div>
                </section>

                <section className="space-y-16">
                   <div className="flex items-center gap-6">
                      <h2 className="font-display font-black text-3xl tracking-tight uppercase">QUALIFICATIONS</h2>
                      <div className="flex-grow h-px bg-on-surface/10"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {internship.requirements.map((req, i) => (
                        <div key={i} className="flex gap-6 p-10 bg-surface-container-low border border-on-surface/5 hover:border-primary/20 transition-all group">
                           <div className="text-primary font-black text-xs transition-transform group-hover:scale-125">0{i+1}</div>
                           <p className="text-sm font-bold leading-relaxed">{req}</p>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="space-y-16">
                   <div className="flex items-center gap-6">
                      <h2 className="font-display font-black text-3xl tracking-tight uppercase">THE STACK</h2>
                      <div className="flex-grow h-px bg-on-surface/10"></div>
                   </div>
                   <div className="flex flex-wrap gap-px bg-on-surface/10 border border-on-surface/10">
                      {internship.tags.map(tag => (
                        <div key={tag} className="bg-surface px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors cursor-default">
                           {tag}
                        </div>
                      ))}
                   </div>
                </section>

                <section className="pt-20">
                   <div className="bg-on-surface text-white p-20 flex flex-col md:flex-row justify-between items-center gap-20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                      <div className="space-y-6 relative z-10 md:w-2/3 text-center md:text-left">
                         <h3 className="font-display font-black text-5xl tracking-tighter leading-tight uppercase">READY TO JOIN THE <br /><span className="text-secondary italic">COHORT?</span></h3>
                         <p className="text-white/40 font-bold text-[11px] uppercase tracking-[0.4em]">Application Window Closes in 48 Hours.</p>
                      </div>
                      <button className="relative z-10 w-full md:w-auto bg-white text-on-surface px-16 py-8 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95">
                         Submit Dossier
                      </button>
                   </div>
                </section>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
