"use client";

import EmployerSidebar from "@/components/EmployerSidebar";
import React from "react";
import Image from "next/image";

export default function Messages() {
  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex flex-col md:flex-row antialiased font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* SideNavBar */}
      <EmployerSidebar />

      {/* Main Content Canvas (Two Panel Chat Layout) */}
      <main className="flex-1 flex flex-col h-screen relative bg-surface overflow-hidden">
        {/* Mobile Header (Contextual) */}
        <header className="md:hidden flex items-center justify-between px-6 h-20 bg-white/80 backdrop-blur-xl z-40">
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 font-headline">InternBeacon</h1>
          <span className="material-symbols-outlined text-primary">menu</span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Panel 1: Conversation List */}
          <section className="w-full md:w-80 lg:w-[400px] flex flex-col border-r-0 bg-surface-container-low z-20">
            <div className="p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-primary mb-6 font-headline">Messages</h2>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all shadow-sm outline-none placeholder:text-outline-variant" placeholder="Search conversations..." type="text" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10 custom-scrollbar">
              {/* Active Chat Item */}
              <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 flex gap-4 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcEKUzOiadTW2EI8weyU2rw8ODJTyMtLu2Juj8Bf0Vc99m3MZY9Qu4F_0h7nXG2OP4wai7fDKrqCrKW5EFj7JXPORzesdKflC0kqwLqkhJhnaR2tXz0_Do4NynIiPtZ7v20UCI4kCzvi43xCV93CJuSaheb33_1R7rtRKWV6Qx7eoCFypfgZN_3vrN96uiXTnT9a0bJv36PDLg3ZFOv1Lyio1HEoRcsH4__EmxgNYbG-HfthF4791AgRrVwnmbJMTDBYnBilNRIkg" alt="Portrait" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#855300] rounded-full border-2 border-surface-container-lowest"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-primary truncate font-headline">Alex Rivera</h3>
                    <span className="text-[10px] font-semibold text-outline">12:45 PM</span>
                  </div>
                  <p className="text-xs text-primary font-medium truncate">That sounds perfect! I've attached the updated portfolio...</p>
                </div>
              </div>

              {/* Inactive Chat Items */}
              <div className="p-4 hover:bg-surface-container-high rounded-xl transition-colors flex gap-4 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0skbt_jlvfQw0vvj4N2z0pj37ks0KEgCmzr6UcLZeH1rymNduJWABfEQW3VuP7Dy-6q17ulOVh3a_aEgZnf691WLUyZWLBQHvjH_Lb7EL5sREm4gHB-CjOtbq47kVlrORWJBBFoY9IwJKmYLShVrqaD5GSAzROAcLvl_fFfFriE6XvTPtTUdqRr7VUf4a1X3hxxd6-0NzNZp9olCTpPJuzwYrKRwyiYrrldkD2qGieMi7-ggSVXqUYsuamlgM4y1prgu-FFxnkaM" alt="Portrait" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-primary truncate font-headline">Sarah Jenkins</h3>
                    <span className="text-[10px] font-medium text-outline">Yesterday</span>
                  </div>
                  <p className="text-xs text-outline truncate">Regarding the UX Designer internship opening for Summer...</p>
                </div>
              </div>

              <div className="p-4 hover:bg-surface-container-high rounded-xl transition-colors flex gap-4 cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">GM</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-primary truncate font-headline">Google Recruiting</h3>
                    <span className="text-[10px] font-medium text-outline">Oct 24</span>
                  </div>
                  <p className="text-xs text-outline truncate">We'd love to schedule a follow-up interview next Tuesday.</p>
                </div>
                <div className="bg-[#855300] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full mt-1 shrink-0">2</div>
              </div>

              <div className="p-4 hover:bg-surface-container-high rounded-xl transition-colors flex gap-4 cursor-pointer opacity-70">
                <div className="relative flex-shrink-0">
                  <img className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPN8pHH2LIRwXdpqzEq9vDsPrIo4QEbYzE0I5uhHGRUnDO8-jnbOsC762FOJoh-QC-0T_LRcPTMkSr3wxnBPZTyhcOrqfL3rYH-KUCkvVof1_9kxKHedZ3prnn2v_3F0_l0IzKHosemdLg5lqsjxmGoNPrJ6Rjo4EXPTEIZueyqI1VOUFa7AJAYna0E-b2pzR2ywm4Y24jEpt8m0LoiQEMCSFR4skEMWmlQ1EVGXlDsZxHIGT28d05y-XIQIiFwJbE8xy72r9fZCc" alt="Portrait" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-primary truncate font-headline">David Park</h3>
                    <span className="text-[10px] font-medium text-outline">Oct 20</span>
                  </div>
                  <p className="text-xs text-outline truncate">Thank you for the opportunity!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Panel 2: Active Thread */}
          <section className="hidden md:flex flex-1 flex-col bg-surface-container-lowest border-l border-outline-variant/10">
            {/* Thread Header */}
            <header className="h-24 px-8 flex flex-shrink-0 items-center justify-between border-b border-surface-container-low shadow-sm z-10 bg-white">
              <div className="flex items-center gap-4">
                <img className="h-10 w-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBORfeEWxzeCq7HhNWfa406cfY_masDRvjQY4IEkrWwx-o8AjIs-kNb02Zpl1o2RaLMykzo3IyaVkuv-LdaPbryRhmnjEO2YOB2NzEU90Pt8qr8QY3Mstzf1Tq5qL7ilk6Ox6E4NfO-_R9J-P-NHFEHEvI5hDMerKlAYdkk95LA5hNWTxHe3XUdoTT5dM8C84eV-Sgn6-YLuTENaVuRKVY6JxootTK9UQAaUHKanJsEa1OmTzu9SeL7YYXWtu94LRY4bNJSFNeoF5I" alt="Candidate" />
                <div>
                  <h2 className="text-lg font-extrabold text-primary leading-none mb-1 font-headline">Alex Rivera</h2>
                  <div className="flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-[#855300]"></span>
                    <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Candidate • UI Design Intern</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">call</span>
                </button>
                <button className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">video_call</span>
                </button>
                <button className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
                <button className="ml-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all">
                  View Profile
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 bg-surface/30">
              <div className="flex justify-center">
                <span className="text-[11px] font-bold text-outline-variant bg-surface-container-low px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">October 25, 2023</span>
              </div>

              {/* Received Message */}
              <div className="flex gap-4 max-w-[80%]">
                <img className="h-8 w-8 rounded-full object-cover mt-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARUgxR2MIdLE8RM9dXEnKOodxahRznxQFb6ZSrYqLGEEGrzvRnp7yrTR2lIqLIEXfmeMshEBjkASShK3b2Rq9dD_siRtQDSww8NDeX5oe3c3xNEqonzSXxc1g5KRyrEejQCZvwwlPvLJtXLB5-ai9eq0PIbi2KjDtXV28z9uTiYnMPVR1GjWPR6zZdVSxqxv7J3I6nZD6CpUTKkuKmafsAdELhHyvXQpxOq9oQVdBUw4YIVS4qNV6xEiC6xdUUPkvuK2TcyIuuC3E" alt="Avatar" />
                <div className="space-y-2">
                  <div className="bg-surface-container text-on-surface p-4 rounded-2xl rounded-bl-none shadow-sm">
                    <p className="text-sm leading-relaxed">Hi Marcus! Thank you for following up. I'm very excited about the potential internship opportunity at InternBeacon. I've had a chance to look over the project brief you sent earlier.</p>
                  </div>
                  <span className="text-[10px] font-medium text-outline ml-1">11:02 AM</span>
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex flex-row-reverse gap-4 max-w-[80%] ml-auto text-right">
                <div className="space-y-2">
                  <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-xl shadow-primary/10">
                    <p className="text-sm leading-relaxed">Glad to hear that, Alex. Your portfolio really stood out to the team, especially the architectural UI work. Would you be available for a brief technical call this Thursday?</p>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] font-medium text-outline mr-1">11:15 AM</span>
                    <span className="material-symbols-outlined text-[14px] text-secondary">done_all</span>
                  </div>
                </div>
              </div>

              {/* Received Message with Attachment */}
              <div className="flex gap-4 max-w-[80%]">
                <img className="h-8 w-8 rounded-full object-cover mt-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-u2V4N5X0VujbnLs1jx6B0stS7N7WtL8duiZX_AzcTAeNdBQonHb7qzz4sPcpSHTo24a1Qme_Hm3p2tCv-1nySzi8kABlQfSeAm_ID0pPKa0LPSubqDtOT6tzXJdE5Dja6EcHlWhP26WBEx5HRKHu-0Xuu6pabAk8YjQ7PXRY8QOlKbc80xPZoua7nxnUOg3qcCFbtItMr_wefb36ontmQGc2NcpJglMW2SR12S9Bz4Tz3cMh2xTdfrqyrvv4InftxD6oGc53QBs" alt="Avatar" />
                <div className="space-y-3">
                  <div className="bg-surface-container text-on-surface p-4 rounded-2xl rounded-bl-none shadow-sm">
                    <p className="text-sm leading-relaxed">Absolutely, Thursday afternoon works perfectly for me. In the meantime, I've prepared a more detailed case study of my latest design system project. Looking forward to it!</p>
                  </div>
                  {/* Attachment Card */}
                  <div className="bg-white border border-outline-variant/30 rounded-xl p-3 flex items-center gap-3 w-72 shadow-sm hover:border-outline-variant/50 transition-colors cursor-pointer">
                    <div className="h-10 w-10 bg-[#ffdad6] text-[#ba1a1a] rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-primary truncate">Alex_Rivera_UI_Case_Study.pdf</p>
                      <p className="text-[10px] text-outline">4.2 MB • PDF Document</p>
                    </div>
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                  </div>
                  <span className="text-[10px] font-medium text-outline ml-1 mt-1 block">12:45 PM</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-outline-variant/10 z-10 flex-shrink-0">
              <div className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-2xl p-2 flex items-end gap-2 group focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                <button className="p-3 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <textarea className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none outline-none placeholder:text-outline-variant min-h-[44px]" placeholder="Type a message to Alex..." rows={1}></textarea>
                <div className="flex gap-1 pb-1 pr-1">
                  <button className="p-2 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">mood</span>
                  </button>
                  <button className="bg-[#855300] text-white h-10 w-10 flex items-center justify-center rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Empty State for Small Screens (Handled via mobile-first) */}
          <section className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-outline-variant">forum</span>
            </div>
            <h3 className="text-xl font-extrabold text-primary mb-2 font-headline">Your Conversations</h3>
            <p className="text-sm text-outline max-w-xs mb-8">Select a candidate or company from the list to start messaging.</p>
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold w-full shadow-xl shadow-primary/20">
              New Message
            </button>
          </section>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden h-20 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-around px-4 border-t border-surface-container-low relative z-10 shrink-0">
          <a className="flex flex-col items-center gap-1 text-outline" href="#">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-primary" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Messages</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-outline" href="#">
            <span className="material-symbols-outlined">search</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Explore</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-outline" href="#">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </a>
        </nav>
      </main>
    </div>
  );
}
