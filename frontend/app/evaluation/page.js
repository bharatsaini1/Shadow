"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Code, CheckSquare, ChevronRight, Terminal, Check, ArrowRight, Share2, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const DIMS = [
  { key: "code_quality", label: "Code Quality", score: 82 },
  { key: "communication", label: "Communication", score: 65 },
  { key: "problem_solving", label: "Problem Solving", score: 78 },
  { key: "time_management", label: "Time Management", score: 90 },
  { key: "completeness", label: "Completeness", score: 75 },
];

const CHIPS = [
  { icon: Clock, label: "Submitted 12 min before deadline" },
  { icon: Code, label: "task_019 · MERN" },
  { icon: CheckSquare, label: "3 revisions" },
];

const STRENGTHS = [
  "Clean, well-documented code with proper error handling",
  "Good understanding of JWT token lifecycle",
  "Efficient implementation of token rotation",
];

const IMPROVEMENTS = [
  "Could add more comprehensive test coverage for edge cases",
  "Consider adding rate limiting as an additional security layer",
];

export default function EvaluationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(78);
  const [countUp, setCountUp] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      let current = 0;
      const step = Math.ceil(score / 30);
      const interval = setInterval(() => {
        current += 1;
        setCountUp(current);
        if (current >= score) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [loading, score]);

  const barColor = (val) => {
    if (val >= 80) return "bg-go";
    if (val >= 60) return "bg-caution";
    return "bg-stop";
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-ink-ghost dark:text-ghost" />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto pb-16">
            {/* Section 1: Score Hero */}
            <div className="text-center pt-12">
              <p className="font-mono text-xs text-ink-ghost dark:text-ghost mb-8">
                task_019 · MERN · submitted 12 min before deadline
              </p>
              <div className="font-display text-[120px] leading-none text-ink-prose dark:text-prose tracking-tight" style={{ fontVariationSettings: '"opsz" 120, "wght" 600' }}>
                {countUp}
              </div>
              <p className="font-body text-lg text-ink-prose-2 dark:text-prose-2 mt-2">/ 100</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="badge-done text-sm">EXCELLENT</span>
                <span className="font-mono text-sm text-go animate-xp-rise">+120 XP</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                {CHIPS.map((chip, i) => (
                  <div key={i} className="card inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-ink-ghost dark:text-ghost">
                    <chip.icon size={12} />
                    {chip.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 mt-12"
            >
              <div className="section-header">
                <div className="section-title">Score Breakdown</div>
                <span className="badge-neutral">AI-reviewed</span>
              </div>
              <div className="space-y-4">
                {DIMS.map((dim, i) => (
                  <motion.div
                    key={dim.key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-body text-sm w-36 text-ink-prose-2 dark:text-prose-2 shrink-0">{dim.label}</span>
                      <div className="flex-1 h-px bg-rule-light dark:bg-rule">
                        <div className={`h-full ${barColor(dim.score)}`} style={{ width: `${dim.score}%` }} />
                      </div>
                      <span className="font-mono text-sm w-8 text-right text-ink-ghost dark:text-ghost">{dim.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Section 3: AI Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6 mt-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={14} className="text-ink-ghost dark:text-ghost" />
                <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose">AI Review</span>
                <span className="badge-neutral ml-auto">LLaMA 3.3-70B</span>
              </div>

              <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 leading-relaxed mb-6">
                The submission demonstrates a solid understanding of JWT refresh token mechanics. The implementation correctly invalidates used refresh tokens via a Redis-backed blacklist, which is a production-grade approach. The code is clean and well-structured, though additional test coverage and rate limiting would make this truly production-ready.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-mono text-xs text-go uppercase tracking-wider mb-2">What worked</p>
                  <div className="space-y-1.5">
                    {STRENGTHS.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={12} className="text-go mt-0.5 shrink-0" />
                        <span className="font-body text-sm text-ink-prose-2 dark:text-prose-2">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-caution uppercase tracking-wider mb-2">Where to improve</p>
                  <div className="space-y-1.5">
                    {IMPROVEMENTS.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight size={12} className="text-caution mt-0.5 shrink-0" />
                        <span className="font-body text-sm text-ink-prose-2 dark:text-prose-2">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-rule-light dark:border-rule pl-4 mt-6 font-body text-sm italic text-ink-ghost dark:text-ghost">
                &ldquo;Good work overall. The blacklist approach is solid. For next time, I&apos;d like to see a more comprehensive test suite — aim for 90% coverage on auth-related code. Also consider adding a rate limiter as a defense-in-depth measure.&rdquo;
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-sm"><Share2 size={14} /> Share results</button>
              </div>
              <button onClick={() => router.push("/dashboard")} className="btn-primary text-sm">Back to dashboard <ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
