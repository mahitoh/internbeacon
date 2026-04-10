"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InternshipCard from "@/components/InternshipCard";
import SearchFilter from "@/components/SearchFilter";
import { MOCK_INTERNSHIPS } from "@/lib/data";
import { FiTrendingUp, FiBriefcase, FiMap } from "react-icons/fi";

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
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
              Explorer <span className="text-primary">Opportunities</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover {MOCK_INTERNSHIPS.length} premium internships curated just for you.
            </p>
          </div>

          {/* Search & Filter */}
          <SearchFilter 
            onSearch={setSearchQuery} 
            onFilterChange={() => {}} 
          />

          {/* Stats/Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-semibold hover:border-primary transition-colors">
              <FiTrendingUp className="text-primary" />
              Trending
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-semibold hover:border-primary transition-colors">
              <FiBriefcase className="text-primary" />
              Product Management
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-semibold hover:border-primary transition-colors">
              <FiMap className="text-primary" />
              Remote Jobs
            </button>
          </div>

          {/* Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="text-primary text-3xl opacity-20" />
              </div>
              <h3 className="text-xl font-bold mb-2">No internships found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}

          {/* Pagination Mockup */}
          {filteredInternships.length > 0 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button disabled className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground opacity-50 cursor-not-allowed">
                1
              </button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                3
              </button>
              <span className="text-muted-foreground">...</span>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                12
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
