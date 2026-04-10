"use client";

import { useParams } from "next/navigation";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMapPin, FiClock, FiDollarSign, FiCalendar, FiArrowLeft, FiShare2, FiHeart } from "react-icons/fi";
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
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          <Link 
            href="/listings" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <FiArrowLeft />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-bold text-3xl">
                      {internship.company[0]}
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        {internship.title}
                      </h1>
                      <div className="flex items-center gap-3 text-muted-foreground font-medium">
                        <span className="text-foreground font-bold">{internship.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FiMapPin className="text-primary" />
                          {internship.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-4 bg-secondary/5 border border-secondary/10 rounded-2xl text-secondary hover:bg-secondary/10 transition-colors">
                      <FiHeart size={20} />
                    </button>
                    <button className="p-4 bg-secondary/5 border border-secondary/10 rounded-2xl text-secondary hover:bg-secondary/10 transition-colors">
                      <FiShare2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-background rounded-[2rem] border border-border">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stipend</p>
                    <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                      <FiDollarSign />
                      {internship.stipend}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration</p>
                    <div className="flex items-center gap-2 font-bold">
                      <FiClock />
                      {internship.duration}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Posted On</p>
                    <div className="flex items-center gap-2 font-bold">
                      <FiCalendar />
                      {internship.postedAt}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</p>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Full-time
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-8 px-4">
                <section>
                  <h2 className="text-2xl font-bold mb-6">About the Role</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {internship.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <ul className="space-y-4">
                    {internship.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-4 text-muted-foreground">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {internship.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-6 py-2 bg-card border border-border rounded-full text-sm font-bold shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar / CTA Container */}
            <div className="space-y-8">
              <div className="sticky top-32 bg-foreground text-background rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-white">Apply for this role</h3>
                  <p className="text-background/70 mb-10 leading-relaxed font-medium">
                    Submit your application within the next 48 hours to be considered for the first round of interviews.
                  </p>
                  
                  <button className="w-full py-5 bg-primary text-white font-bold rounded-[1.5rem] hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] mb-6">
                    Apply Now
                  </button>
                  
                  <div className="space-y-4 pt-6 border-t border-white/10 text-sm font-medium">
                    <p className="flex justify-between items-center text-background/60">
                      <span>Applications</span>
                      <span className="text-white">128 applicants</span>
                    </p>
                    <p className="flex justify-between items-center text-background/60">
                      <span>Closing date</span>
                      <span className="text-white">Apr 30, 2024</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-[2.5rem] p-8 text-center space-y-4">
                <p className="text-sm font-bold">Need help with your application?</p>
                <div className="flex justify-center -space-x-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-card" />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-card">
                    +12
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join our mentorship program to get your resume reviewed by experts.
                </p>
                <button className="text-primary font-bold text-sm hover:underline">
                  Join Mentorship
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
