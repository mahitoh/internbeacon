import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-24 pb-12 px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div>
              <span className="text-3xl font-bold tracking-tighter font-headline block mb-4">InternBeacon</span>
              <p className="text-slate-400 max-w-sm leading-relaxed">The elite bridge between Cameroon&apos;s top-tier academic talent and industry-leading companies.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest font-headline">Stay Updated</h4>
              <div className="flex gap-2">
                <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-slate-500" placeholder="Enter your email" type="email"/>
                <button className="px-6 py-3 bg-secondary-container text-on-secondary-fixed font-bold rounded-xl text-sm hover:opacity-90 transition-all">Join</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.443-4.435-9.885-9.881-9.885-5.446 0-9.884 4.438-9.887 9.886-.001 2.227.62 4.393 1.908 6.22l-1.006 3.674 3.771-.989-.186-.106z"></path></svg>
              </a>
            </div>
          </div>
          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest font-headline text-white">Platform</h4>
              <ul className="flex flex-col gap-4">
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Explore Roles</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Skill Matching</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Success Stories</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Student Hub</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest font-headline text-white">Company</h4>
              <ul className="flex flex-col gap-4">
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Post a Role</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Talent Search</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Enterprise Solutions</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest font-headline text-white">Resources</h4>
              <ul className="flex flex-col gap-4">
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">CV Builder</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Interview Guide</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Career Blog</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Help Center</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest font-headline text-white">Legal</h4>
              <ul className="flex flex-col gap-4">
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Privacy Policy</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Terms of Use</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Cookie Policy</Link></li>
                <li><Link className="text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">Safety Tips</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Cameroon First
            </span>
            <p className="text-slate-500 text-xs font-medium">© 2024 InternBeacon Cameroon. Built for the elite.</p>
          </div>
          <div className="flex items-center gap-8">
            <a className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors" href="#">FR/EN</a>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
