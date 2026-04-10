import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 font-headline">
            InternBeacon
          </Link>
          <div className="hidden md:flex gap-8">
            <Link className="text-slate-900 border-b-2 border-secondary-container pb-1 font-headline text-sm font-medium tracking-tight" href="/listings">
              Explore
            </Link>
            <Link className="text-slate-500 hover:text-slate-900 transition-all duration-300 ease-in-out hover:opacity-80 font-headline text-sm font-medium tracking-tight" href="/employer/dashboard">
              Companies
            </Link>
            <Link className="text-slate-500 hover:text-slate-900 transition-all duration-300 ease-in-out hover:opacity-80 font-headline text-sm font-medium tracking-tight" href="/dashboard">
              Resources
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-full text-slate-500 hover:text-slate-900 font-headline text-sm font-medium transition-all duration-300 ease-in-out hover:opacity-80 active:scale-95">
            Login
          </Link>
          <Link href="/employer/post" className="px-6 py-2.5 bg-primary-container text-white rounded-full font-headline text-sm font-semibold hover:opacity-90 transition-all duration-300 ease-in-out active:scale-95 inline-block">
            Post Internship
          </Link>
        </div>
      </div>
    </nav>
  );
}
