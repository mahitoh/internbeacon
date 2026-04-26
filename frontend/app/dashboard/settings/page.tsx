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
        <div className="w-full md:w-64 shrink-0 space-y-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              {/* Banner Area */}
              <div className="h-48 bg-slate-200 relative group shrink-0">
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

              <div className="px-8 pb-8">
                {/* Profile Picture Area - Bulletproof Layout */}
                <div className="relative flex justify-start -mt-16 mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOl0XR_rNwKIylUYq7dyYJqx8NSyBAjUyH8pwNSaSG3rOBcYl89oifCr7ueANh9t0kHh_n0T4GqDJU9Ypi4Eu4H8HxMus0krGAI5M734PZK3TJETJ2pA7Z8C6baBBACAUP9UtiWQY4oIMvCYb8n7C0-oW0loF3J8cKud7mdk8t-RcLm7meyVFBw2Fj4n0kbg-7wiizcb8oTYUepQOpneeezekKo09if4QCcbDxL-a8EoSq-0VPYO2dvjbrsSNSMGjc4UCKx_Xp1FU" 
                        alt="Profile Picture" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-full border-4 border-transparent">
                      <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
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
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
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
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
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
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="button" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors shadow-sm">
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "Account preferences" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-headline">Account preferences</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Display</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Language</p>
                        <p className="text-xs text-slate-500">English (US)</p>
                      </div>
                      <button className="text-secondary font-bold text-sm hover:underline">Change</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Content language</p>
                        <p className="text-xs text-slate-500">Select languages for translation</p>
                      </div>
                      <button className="text-secondary font-bold text-sm hover:underline">Change</button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Account Management</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Hibernate account</p>
                        <p className="text-xs text-slate-500">Temporarily deactivate your profile</p>
                      </div>
                      <button className="text-slate-600 font-bold text-sm hover:underline">Hibernate</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                      <div>
                        <p className="font-bold text-red-900 text-sm">Close account</p>
                        <p className="text-xs text-red-500">Permanently delete your data</p>
                      </div>
                      <button className="text-red-600 font-bold text-sm hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Sign in & security" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-headline">Sign in & security</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Account Access</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Email addresses</p>
                        <p className="text-xs text-slate-500">alex.sterling@example.com</p>
                      </div>
                      <button className="text-secondary font-bold text-sm hover:underline">Change</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Change password</p>
                        <p className="text-xs text-slate-500">Last updated 3 months ago</p>
                      </div>
                      <button className="text-secondary font-bold text-sm hover:underline">Update</button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Advanced Security</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Two-step verification</p>
                        <p className="text-xs text-slate-500">Protect your account with an extra step</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Off</span>
                        <button className="text-secondary font-bold text-sm hover:underline">Turn on</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Where you're signed in</p>
                        <p className="text-xs text-slate-500">1 active session on Mac OS</p>
                      </div>
                      <button className="text-secondary font-bold text-sm hover:underline">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Visibility" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-headline">Visibility</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <p className="font-bold text-slate-900 text-sm">Profile viewing options</p>
                    <p className="text-xs text-slate-500 mt-1">Choose whether you're visible or viewing in private mode.</p>
                  </div>
                  <select className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10">
                    <option>Full Profile</option>
                    <option>Private Mode</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <p className="font-bold text-slate-900 text-sm">Edit your public profile</p>
                    <p className="text-xs text-slate-500 mt-1">Choose how your profile appears to non-logged-in members via search engines.</p>
                  </div>
                  <button className="text-secondary font-bold text-sm hover:underline whitespace-nowrap">Edit Custom URL</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <p className="font-bold text-slate-900 text-sm">Who can see your connections</p>
                    <p className="text-xs text-slate-500 mt-1">Control who can see your network.</p>
                  </div>
                  <select className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10">
                    <option>Your connections</option>
                    <option>Only you</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-headline">Notifications</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-slate-500 text-lg">work</span>
                      <p className="font-bold text-slate-900 text-sm">Job alerts</p>
                    </div>
                    <p className="text-xs text-slate-500">Get notified when new roles match your preferences.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-slate-500 text-lg">mail</span>
                      <p className="font-bold text-slate-900 text-sm">Email digests</p>
                    </div>
                    <p className="text-xs text-slate-500">Weekly summaries of top opportunities and network updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-slate-500 text-lg">chat</span>
                      <p className="font-bold text-slate-900 text-sm">Messages</p>
                    </div>
                    <p className="text-xs text-slate-500">Push notifications for direct messages from employers.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
