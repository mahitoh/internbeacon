"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InternshipCard from "@/components/InternshipCard";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import { FiSearch, FiFilter, FiArrowDown } from "react-icons/fi";

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredInternships = useMemo(() => {
    return MOCK_INTERNSHIPS.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="flex-grow pt-40 pb-40">
        <div className="max-w-7xl mx-auto px-10">
          {/* Header Section - Editorial Header */}
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-10">
            <div className="space-y-6 lg:w-2/3">
              <div className="text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Registry V.0.2</div>
              <h1 className="font-display font-black text-6xl lg:text-8xl tracking-tighter leading-[0.85] text-on-surface uppercase">
                THE GLOBAL <br /><span className="text-secondary">OPPORTUNITY</span> <br />INDEX.
              </h1>
            </div>
            
            <div className="lg:w-1/3 flex flex-col items-end text-right">
              <p className="text-[13px] font-medium text-on-surface/40 leading-relaxed max-w-[280px] mb-8">
                Currently tracking {MOCK_INTERNSHIPS.length} high-fidelity positions across five continents. Updated in real-time.
              </p>
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-primary">
                Scroll to explore <FiArrowDown className="animate-bounce" />
              </div>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="mb-32 relative group">
            <div className="absolute inset-0 bg-primary/5 -skew-y-1 transform group-hover:skew-y-0 transition-transform -z-10" />
            <div className="flex flex-col md:flex-row items-center gap-0 bg-surface-container shadow-ambient">
              <div className="flex-grow w-full flex items-center px-10 py-8 gap-6 md:border-r border-on-surface/5">
                <FiSearch className="text-2xl text-on-surface/30" />
                <input 
                  type="text" 
                  placeholder="SEARCH POSITIONS, COMPANIES, OR DOMAINS..."
                  className="w-full bg-transparent border-none outline-none font-display font-black text-xl tracking-tight placeholder:text-on-surface/10 text-on-surface"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="px-12 py-8 flex items-center gap-4 font-black uppercase tracking-[0.2em] text-[10px] hover:text-primary transition-colors whitespace-nowrap">
                <FiFilter />
                Refine Meta
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-on-surface/5 mb-32 border border-on-surface/5">
             {["ENGINEERING", "DESIGN", "MARKETING", "FINANCE", "LEGAL", "STRATEGY"].map(cat => (
               <button key={cat} className="bg-surface py-8 px-4 text-[9px] font-black uppercase tracking-[0.3em] text-on-surface/40 hover:text-primary hover:bg-surface-container-low transition-all">
                 {cat}
               </button>
             ))}
          </div>

          {/* Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
              {filteredInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center space-y-8">
              <h3 className="font-display font-black text-4xl tracking-tighter text-on-surface/20 uppercase">No Data Matches Queries</h3>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-primary font-black uppercase tracking-[0.2em] text-xs pb-1 border-b-2 border-primary/20 hover:border-primary transition-all"
              >
                Reset Search Index
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
