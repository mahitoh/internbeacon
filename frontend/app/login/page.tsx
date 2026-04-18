"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStoredUser, getUserFriendlyError, loginUser, persistAuth, roleHomePath } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "COMPANY">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace(roleHomePath(user.role));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data.user.role !== role) {
        setError(`This account is registered as ${data.user.role.toLowerCase()}. Please switch role to continue.`);
        return;
      }
      persistAuth(data);
      setSuccess(`Signed in successfully as ${data.user.name}. Redirecting...`);
      router.push(roleHomePath(data.user.role));
    } catch (err) {
      setError(getUserFriendlyError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary-container/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-on-tertiary-container/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-primary-fixed mb-4 font-headline">
              Welcome back.
            </h1>
            <p className="text-on-surface-variant max-w-xs mx-auto">
              Curating the next generation of professional excellence.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/20 rounded-lg p-8 md:p-12 shadow-2xl shadow-on-surface/5">
            <div className="flex p-1 bg-surface-container-low rounded-full mb-10">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${
                  role === "STUDENT"
                    ? "bg-surface-container-lowest text-on-primary-fixed shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("COMPANY")}
                className={`flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 ${
                  role === "COMPANY"
                    ? "bg-surface-container-lowest text-on-primary-fixed shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Company
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-4" htmlFor="email">Corporate Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-on-primary-fixed focus:ring-1 focus:ring-on-primary-fixed transition-all placeholder:text-outline-variant"
                    id="email"
                    placeholder="name@domain.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Secure Password</label>
                  <a className="text-xs font-semibold text-secondary-container hover:underline" href="#">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-14 pr-6 text-on-surface focus:outline-none focus:border-on-primary-fixed focus:ring-1 focus:ring-on-primary-fixed transition-all placeholder:text-outline-variant"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-red-600 font-semibold">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-700 font-semibold">{success}</p> : null}

              <button
                className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-full font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-secondary-container/20 mt-4 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In to InternBeacon"}
              </button>
            </form>
          </div>

          <p className="text-center mt-10 text-on-surface-variant font-medium">
            New to the gallery? <Link className="text-on-primary-fixed font-bold hover:underline" href="/signup">Join InternBeacon</Link>
          </p>
        </div>
      </main>

      <footer className="py-8 px-6 text-center text-xs text-outline font-medium tracking-wide">
        <p>© 2024 InternBeacon. All rights reserved. Built for the elite, by the elite.</p>
      </footer>
    </div>
  );
}
