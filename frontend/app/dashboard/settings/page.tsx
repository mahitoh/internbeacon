"use client";

import React, { useState } from "react";
import { useAuthUser } from "@/lib/authClient";

export default function SettingsPage() {
  const user = useAuthUser();
  const [name, setName] = useState(user?.name || "Alex Sterling");
  const [headline, setHeadline] = useState("Software Engineering Student");
  const [location, setLocation] = useState("San Francisco, CA");
  
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-secondary mb-1.5 block">
          Configuration
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Settings
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {["Profile", "Account preferences", "Sign in & security", "Visibility", "Notifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-8">
          {activeTab === "Profile" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Banner Area */}
              <div className="h-48 bg-slate-200 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80" 
                  alt="Profile Banner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Change Banner
                  </button>
                </div>
              </div>

              <div className="px-8 pb-8 relative">
                {/* Profile Picture Area */}
                <div className="absolute -top-16 left-8 group">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-md">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOl0XR_rNwKIylUYq7dyYJqx8NSyBAjUyH8pwNSaSG3rOBcYl89oifCr7ueANh9t0kHh_n0T4GqDJU9Ypi4Eu4H8HxMus0krGAI5M734PZK3TJETJ2pA7Z8C6baBBACAUP9UtiWQY4oIMvCYb8n7C0-oW0loF3J8cKud7mdk8t-RcLm7meyVFBw2Fj4n0kbg-7wiizcb8oTYUepQOpneeezekKo09if4QCcbDxL-a8EoSq-0VPYO2dvjbrsSNSMGjc4UCKx_Xp1FU" 
                      alt="Profile Picture" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                    </div>
                  </div>
                </div>

                <div className="mt-20">
                  <form className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                          Headline
                        </label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="button" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors shadow-sm">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "Profile" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl text-slate-400">build</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 font-headline">{activeTab} coming soon</h2>
              <p className="text-slate-500 text-sm max-w-md">
                We're currently building out this section to give you more granular control over your experience. Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
