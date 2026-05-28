"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2.5 font-['Space_Grotesk'] font-bold text-lg mb-6">
          <span className="w-8 h-8 bg-gradient-to-br from-[#5B4EFF] to-[#00D4B4] rounded flex items-center justify-center text-sm">MQ</span>
          MentriQ Shadow
        </div>
        <h2 className="text-2xl font-['Space_Grotesk'] font-bold mb-2">{isLogin ? "Welcome" : "Create Account"}</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          {isLogin ? "Sign in to continue your journey" : "Start your career simulation journey"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1C1C26] border border-white/10 rounded-xl text-[#F0F0F5] placeholder-[#8888A0] focus:outline-none focus:border-[#5B4EFF] transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1C1C26] border border-white/10 rounded-xl text-[#F0F0F5] placeholder-[#8888A0] focus:outline-none focus:border-[#5B4EFF] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 bg-[#1C1C26] border border-white/10 rounded-xl text-[#F0F0F5] placeholder-[#8888A0] focus:outline-none focus:border-[#5B4EFF] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#5B4EFF] to-[#00D4B4] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-xs text-[var(--color-text-muted)]">By signing in, you agree to our <a href="#" className="text-[var(--color-primary)] hover:text-[var(--color-accent)]">Terms of Service</a>.</p>
        </div>
      </div>
    </div>
  );
}
