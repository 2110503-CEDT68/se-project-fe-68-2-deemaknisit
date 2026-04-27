"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD600]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center sm:text-left">
           <div className="w-12 h-1 bg-[#FFD600] rounded-full mb-2 hidden sm:block" />
           <h1 className="text-[#111111] text-5xl font-black tracking-tighter uppercase italic leading-none text-center">Login</h1>
           <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.2em] text-center">Enter your details</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div id="login-error-message" className="text-white text-[10px] font-black uppercase tracking-widest bg-[#f87171] p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
              Email
            </label>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
              Password
            </label>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
              required
            />
          </div>

          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full py-5 px-4 bg-[#111111] text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#FFD600] hover:text-[#111111] transition-all duration-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="pt-10 border-t border-stone-100 flex flex-col sm:flex-row justify-center items-center gap-4">
          <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Need an account?</span>
          <Link id="login-register-link" href="/register" className="bg-[#FFD600] text-[#111111] text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-[#111111] hover:text-white transition-all duration-300 uppercase tracking-widest shadow-lg shadow-yellow-400/20">
            Register
          </Link>
        </div>
      </div>
      
      <div className="mt-20 text-stone-300 text-[8px] font-black uppercase tracking-[0.5em] select-none">
        Ratatouille Systems © 2026
      </div>
    </div>
  );
}
