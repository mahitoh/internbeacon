"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React from "react";

export default function Signup() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body antialiased">
      <Navbar />

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary-container/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-on-tertiary-container/10 blur-[120px] rounded-full"></div>
        </div>

        {/* Auth Card Container */}
        <div className="w-full max-w-lg">
          {/* Brand Anchor Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-primary-fixed mb-4 font-headline">
              Create an account.
            </h1>
            <p className="text-on-surface-variant max-w-xs mx-auto">
              Curating the next generation of professional excellence.
            </p>
          </div>

          {/* The Gallery Card */}
          <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/20 rounded-lg p-8 md:p-12 shadow-2xl shadow-on-surface/5">
            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-surface-container-low rounded-full mb-10">
              <button className="flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 bg-surface-container-lowest text-on-primary-fixed shadow-sm">
                Student
              </button>
              <button className="flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 text-on-surface-variant hover:text-on-surface">
                Company
              </button>
            </div>

            {/* Auth Form */}
            <form className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-on-primary-fixed focus:ring-1 focus:ring-on-primary-fixed transition-all placeholder:text-outline-variant" id="name" placeholder="John Doe" type="text" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4" htmlFor="email">Corporate Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-on-primary-fixed focus:ring-1 focus:ring-on-primary-fixed transition-all placeholder:text-outline-variant" id="email" placeholder="name@domain.com" type="email" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Secure Password</label>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-on-primary-fixed focus:ring-1 focus:ring-on-primary-fixed transition-all placeholder:text-outline-variant" id="password" placeholder="••••••••" type="password" />
                </div>
              </div>

              {/* Primary Action */}
              <button className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-full font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-secondary-container/20 mt-4" type="submit">
                Create Account
              </button>
            </form>

            {/* Social Authentication */}
            <div className="mt-10">
              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-outline-variant">Or continue with</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-full hover:bg-surface-container-low transition-colors">
                  <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDaRHwvzLCFnDwi-6OfKq1va4pdn6gPNhslWspko-pFVtlis6_dnq6tPFRvbW56AzhlKUHJoub1jeEGaMw9qV-BShBk14rmNvm-HDXWVp96Zxu7P_ymIOS3S5fojr_Ik4ljqK8yPoZtA7Xuf7ILI0nQSB8JrBUrN2MuJV5w0ikC5QmO84Gqkq7oP3IhjCW_i3scTN64JceeIx-6aQAnEr451Jymw6r6mnUv66vLuPMOXZOLBJNkyy7_l1YRDmT2YGR_-0SYsq9lck" />
                  <span className="text-sm font-semibold text-on-primary-fixed">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/20 rounded-full hover:bg-surface-container-low transition-colors">
                  <img alt="LinkedIn" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkFpJq--1XV0mkxAv9hw0_CPn60had2saBMmuz8gyzAJfJRURsAlwOJosNPW8_GlmobXnjMWcJvdRo437AeYD2act23HPVDtBpg7wybJS8Zriia8XDnujrVemp7SAFFcW1W0FBwvHSAoKjB5fX0agDa691b3vov1tU974_1xJhbVERCyyhsk6mNBNdGA6C4n4SHsBYYzmxjJsert1YjTaBKvgmZwo8muUAEbmzTIMkzV7W8a95XOd2Q9mds-_kyhnGZ1JKR9m5wVc" />
                  <span className="text-sm font-semibold text-on-primary-fixed">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center mt-10 text-on-surface-variant font-medium">
            Already have an account? <Link className="text-on-primary-fixed font-bold hover:underline" href="/login">Login</Link>
          </p>
        </div>
      </main>

      {/* Side Content / Decorative Visual (Editorial Feel) */}
      <div className="hidden lg:block fixed bottom-12 right-12 w-72">
        <div className="bg-primary-container p-6 rounded-lg text-white shadow-2xl">
          <span className="material-symbols-outlined text-secondary-container text-4xl mb-4 font-variation-settings: 'FILL' 1;">verified</span>
          <h3 className="text-xl font-bold mb-2 font-headline">Curated for Quality</h3>
          <p className="text-sm text-on-tertiary-container leading-relaxed">
            Every company and student profile is hand-vetted to ensure the highest standard of professional synergy.
          </p>
        </div>
      </div>

      {/* Responsive Disclaimer */}
      <footer className="py-8 px-6 text-center text-xs text-outline font-medium tracking-wide">
        <p>© 2024 InternBeacon. All rights reserved. Built for the elite, by the elite.</p>
      </footer>
    </div>
  );
}
