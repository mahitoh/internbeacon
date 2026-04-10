"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InternshipCard from "@/components/InternshipCard";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import Link from "next/link";
import { FiArrowRight, FiSearch, FiZap, FiTarget, FiStar } from "react-icons/fi";

export default function Home() {
  const featuredInternships = MOCK_INTERNSHIPS.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl opacity-50" />
          
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold mb-8 animate-bounce">
              <FiZap className="fill-current" />
              <span>Matching 10k+ Students Every Month</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Launch Your Career with <br />
              <span className="text-gradient">Premier Internships</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground mb-12 leading-relaxed">
              Find and apply to unique opportunities from top-tier tech companies, creative agencies, and innovative startups worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link 
                href="/listings"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary-dark hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Browse Opportunities
                <FiArrowRight />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
                <FiSearch />
                Search by Industry
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
              {["Google", "Metta", "Amazon", "Netflix", "Apple"].map((company) => (
                <span key={company} className="text-2xl font-black tracking-tighter">{company}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose InternBeacon?</h2>
              <p className="text-muted-foreground">We provide the tools you need to find the perfect start.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <FiTarget />, title: "Precision Matching", desc: "Our AI matches your skills with the most relevant internship roles." },
                { icon: <FiStar />, title: "Quality Vetted", desc: "Every company and post is manually reviewed to ensure a premium experience." },
                { icon: <FiZap />, title: "Quick Apply", desc: "One-click application with your synchronized InternBeacon profile." }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Opportunities */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
                <p className="text-muted-foreground">Hand-picked internships for high-potential candidates.</p>
              </div>
              <Link href="/listings" className="text-primary font-bold flex items-center gap-2 hover:underline">
                View all internships <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="relative rounded-[2.5rem] bg-foreground text-background p-12 lg:p-20 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
              
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl lg:text-5xl font-bold mb-8">Ready to jumpstart your career?</h2>
                <p className="text-background/70 text-lg mb-12">Join thousands of students who have already found their dream internships through our platform.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all">
                    Create Student Profile
                  </button>
                  <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
