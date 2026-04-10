"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
}

export default function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <FiSearch size={20} />
        </div>
        <input
          type="text"
          placeholder="Search for roles, companies, or skills..."
          className="w-full pl-14 pr-32 py-5 bg-card border border-border rounded-2xl md:rounded-[2rem] text-lg focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-xl shadow-black/5"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute right-3 top-3 bottom-3 px-6 flex items-center gap-2 rounded-xl md:rounded-[1.5rem] font-bold text-sm transition-all ${
            isOpen 
              ? "bg-primary text-white" 
              : "bg-secondary/10 text-secondary hover:bg-secondary/20"
          }`}
        >
          <FiFilter />
          <span className="hidden sm:inline">Filters</span>
          {isOpen && <FiX className="ml-1" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 p-8 bg-card border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Location</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                <option>All Locations</option>
                <option>Remote</option>
                <option>San Francisco, CA</option>
                <option>New York, NY</option>
                <option>Austin, TX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Duration</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                <option>Any Duration</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Stipend Range</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                <option>Any Stipend</option>
                <option>$1000 - $2000</option>
                <option>$2000 - $3000</option>
                <option>$3000+</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-4 border-t border-border pt-6">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="px-8 py-2.5 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
