"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { login } from "@/lib/auth";
import { showToast } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-ink flex items-start justify-center pt-24 pb-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Page top */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2.5 no-underline">
            <span className="w-6 h-6 rounded-sm bg-signal/10 dark:bg-signal/15 flex items-center justify-center text-xs font-bold text-signal">MS</span>
            <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose">MentriQ Shadow</span>
          </a>
          <p className="font-mono text-xs text-ink-ghost dark:text-ghost mt-3">Step 1 of 1 — Sign in to your workspace</p>
          <div className="mt-4 flex justify-center">
            <ThemeToggle variant="segmented" />
          </div>
        </div>

        {/* Form card */}
        <div className={`card p-8 ${shake ? "animate-shake" : ""}`}>
          <h1 className="font-display text-3xl text-ink-prose dark:text-prose mb-1" style={{ fontVariationSettings: '"opsz" 30, "wght" 700' }}>
            Welcome back.
          </h1>
          <p className="font-body text-sm text-ink-ghost dark:text-ghost mb-6">Your team is waiting.</p>

          {error && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-stop/5 border border-stop/20">
              <AlertCircle size={12} className="text-stop shrink-0" />
              <span className="font-mono text-xs text-stop">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-ink-ghost dark:text-ghost uppercase tracking-wider block mb-1.5">email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${error ? "input-error" : ""}`}
                placeholder="you@college.edu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-ink-ghost dark:text-ghost uppercase tracking-wider">password</label>
                <a href="#" className="link-warm text-xs">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input pr-9 ${error ? "input-error" : ""}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-icon absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full text-sm">
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={14} /></>
              )}
            </button>

            <div className="divider-label">
              <span>or</span>
            </div>

            <button className="btn-secondary w-full text-sm">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Below card */}
        <p className="font-body text-sm text-ink-ghost dark:text-ghost text-center mt-6">
          No account?{' '}
          <a href="/register" className="link-warm">Start your simulation <ChevronRight size={12} className="inline" /></a>
        </p>
      </motion.div>
    </div>
  );
}
