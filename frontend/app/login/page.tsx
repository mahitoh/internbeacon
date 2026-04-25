"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStoredUser, getUserFriendlyError, loginUser, persistAuth, roleHomePath } from "@/lib/api";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [role, setRole]         = useState<"STUDENT" | "COMPANY">("STUDENT");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) router.replace(roleHomePath(user.role));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Please enter your email and password."); return; }
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data.user.role !== role) {
        setError(`This account is a ${data.user.role.toLowerCase()} account. Switch the tab above to continue.`);
        return;
      }
      persistAuth(data);
      router.push(roleHomePath(data.user.role));
    } catch (err) {
      setError(getUserFriendlyError(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body antialiased bg-[#F7F8FA] text-slate-900">

      {/* ── Left panel — branding ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative bg-[#0F172A] flex-col p-14 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative z-10 mb-auto">
          <div className="[&_img]:brightness-0 [&_img]:invert">
            <Logo className="h-9 w-auto" />
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 mt-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-400 mb-6">
            Student Internship Platform
          </p>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Your career<br />starts here.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-12">
            AI-powered internship matching built for Cameroon's best students and the companies that want to hire them.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-black text-white">1,200+</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">Students</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">120+</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">Companies</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-amber-400">94%</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">Placement rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Mobile logo */}
        <div className="flex justify-between items-center mb-10 lg:mb-0">
          <div className="lg:hidden">
            <Logo className="h-8 w-auto" />
          </div>
          <p className="text-sm text-slate-500 ml-auto">
            No account?{" "}
            <Link href="/signup" className="font-bold text-slate-900 hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Form container */}
        <div className="w-full max-w-[420px] mx-auto lg:my-auto">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-headline">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">Sign in to your InternBeacon account.</p>
          </div>

          {/* Role tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-8">
            {(["STUDENT", "COMPANY"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(null); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  role === r
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r === "STUDENT" ? "Student" : "Company"}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPw ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5 shrink-0">error</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-700 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-slate-900 hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-10 lg:mt-0">
          © {new Date().getFullYear()} InternBeacon Cameroon. All rights reserved.
        </p>
      </div>
    </div>
  );
}
