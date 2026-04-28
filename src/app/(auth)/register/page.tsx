"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { userRegister } from "@/libs/authService";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!consentGiven) {
      setError("You must agree to the Privacy Policy to register.");
      return;
    }
    setIsLoading(true);

    try {
      await userRegister(name, email, telephone, password);
      // Auto-login after registration
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD600]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <div className="w-12 h-1 bg-[#FFD600] rounded-full mb-2 mx-auto" />
          <h1 className="text-[#111111] text-5xl font-black tracking-tighter uppercase italic leading-none">
            Register
          </h1>
          <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.2em]">
            Join us
          </p>
        </div>

        <form
          id="register-form"
          onSubmit={handleSubmit}
          className="bg-white p-1 md:p-10 rounded-[40px] flex flex-col gap-8"
        >
          {error && (
            <div
              id="register-error-message"
              className="text-white text-[10px] font-black uppercase tracking-widest bg-[#f87171] p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                Full Name
              </label>
              <input
                id="register-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                Telephone
              </label>
              <input
                id="register-telephone-input"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                Email
              </label>
              <input
                id="register-email-input"
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
                id="register-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                Confirm Password
              </label>
              <input
                id="register-confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[#111111] text-sm font-bold outline-none focus:border-[#FFD600] focus:bg-white transition-all duration-300 shadow-sm"
                required
              />
            </div>
          </div>
          <label
            id="register-consent-label"
            className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
              consentGiven
                ? "border-[#FFD600] bg-[#FFD600]/5"
                : "border-stone-100 bg-stone-50"
            }`}
          >
            {/* Hidden native checkbox — custom box below */}
            <input
              id="register-consent-checkbox"
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="sr-only"
            />
            {/* Custom checkbox box */}
            <div
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                consentGiven
                  ? "bg-[#FFD600] border-[#FFD600]"
                  : "bg-white border-stone-300"
              }`}
            >
              {consentGiven && (
                <svg
                  className="w-3 h-3 text-[#111111]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-500 leading-relaxed">
              I have read and agree to the{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="text-[#111111] underline underline-offset-2 hover:text-[#FFD600] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              . I consent to the collection and use of my personal data.
            </span>
          </label>

          <div className="mt-4">
            <button
              id="register-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-4 bg-[#111111] text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-[#FFD600] hover:text-[#111111] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing up..." : "Register"}
            </button>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest text-center mt-6">
              By registering, you agree to our terms and conditions.
            </p>
          </div>
        </form>

        <div className="border-t border-stone-100 pt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">
            Already have an account?
          </span>
          <Link
            id="register-login-link"
            href="/login"
            className="bg-[#FFD600] text-[#111111] text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-[#111111] hover:text-white transition-all duration-300 uppercase tracking-widest shadow-lg shadow-yellow-400/20"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="mt-20 text-stone-300 text-[8px] font-black uppercase tracking-[0.5em] select-none">
        Ratatouille Systems © 2026
      </div>
    </div>
  );
}
