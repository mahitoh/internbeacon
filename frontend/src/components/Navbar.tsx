"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 glass shadow-lg" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
            IB
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Intern<span className="text-primary">Beacon</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/listings" className="hover:text-primary transition-colors">
            Find Internships
          </Link>
          <Link href="/companies" className="hover:text-primary transition-colors">
            For Companies
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold hover:text-primary transition-colors px-4 py-2">
            Sign In
          </button>
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-primary/20 hover:scale-105">
            Post an Internship
          </button>
        </div>
      </div>
    </nav>
  );
}
