"use client";

import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { getStoredUser, getUserFriendlyError, persistAuth, registerUser, roleHomePath } from "@/lib/api";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { score: 1, label: "Weak",   color: "bg-red-400" },
    { score: 2, label: "Fair",   color: "bg-amber-400" },
    { score: 3, label: "Good",   color: "bg-blue-400" },
    { score: 4, label: "Strong", color: "bg-emerald-500" },
  ];
  return levels[score - 1] ?? { score: 0, label: "", color: "" };
}

export default function Signup() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [role, setRole]         = useState<"STUDENT" | "COMPANY">("STUDENT");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const pwStrength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    const user = getStoredUser();
    if (user) router.replace(roleHomePath(user.role));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!email)       { setError("Please enter your email address."); return; }
    if (!password)    { setError("Please enter a password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      setLoading(true);
      const data = await registerUser({ name: name.trim(), email, password, role });
      persistAuth(data);
      router.push(roleHomePath(data.user.role));
    } catch (err) {
      setError(getUserFriendlyError(err, "Signup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body antialiased bg-[#F7F8FA] text-slate-900">

      {/* ── Left panel — branding ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative bg-[#0F172A] flex-col p-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 mb-auto">
          <div className="[&_img]:brightness-0 [&_img]:invert">
            <Logo className="h-9 w-auto" />
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-400 mb-6">
            Join InternBeacon
          </p>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Find your<br />first opportunity.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-12">
            Create your profile, let AI match you to the right roles, and apply in minutes — not days.
          </p>

          {/* Steps */}
          <div className="space-y-5">
            {[
              { icon: "person_add",    text: "Create your profile in under 2 minutes" },
              { icon: "auto_awesome",  text: "AI matches you to relevant internships"  },
              { icon: "send",          text: "Apply directly — no middlemen"           },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-400 text-[18px]">{icon}</span>
                </div>
                <p className="text-slate-400 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-10 lg:mb-0">
          <div className="lg:hidden">
            <Logo className="h-8 w-auto" />
          </div>
          <p className="text-sm text-slate-500 ml-auto">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-[420px] mx-auto lg:my-auto">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-headline">
              Create your account
            </h1>
            <p className="text-slate-500 text-sm">
              {role === "STUDENT"
                ? "Start discovering internships matched to your skills."
                : "Post roles and connect with top ICT talent."}
            </p>
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
                {r === "STUDENT" ? "I'm a student" : "I'm a company"}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="name">
                {role === "STUDENT" ? "Full name" : "Company name"}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  {role === "STUDENT" ? "person" : "business"}
                </span>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder={role === "STUDENT" ? "e.g. Richcal Ankiambom" : "e.g. Orange Cameroon"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="pt-1">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          s <= pwStrength.score ? pwStrength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {pwStrength.label && (
                    <p className="text-[11px] font-semibold text-slate-500">
                      Strength:{" "}
                      <span className={
                        pwStrength.score <= 1 ? "text-red-500" :
                        pwStrength.score === 2 ? "text-amber-500" :
                        pwStrength.score === 3 ? "text-blue-500" : "text-emerald-600"
                      }>
                        {pwStrength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}
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
                  Creating account...
                </>
              ) : (
                `Create ${role === "STUDENT" ? "student" : "company"} account`
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and{" "}
              <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
            </p>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-10 lg:mt-0">
          © {new Date().getFullYear()} InternBeacon Cameroon. All rights reserved.
        </p>
      </div>
    </div>
  );
}
