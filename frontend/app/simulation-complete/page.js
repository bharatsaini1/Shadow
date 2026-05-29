"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  Trophy, Award, Zap, CheckCircle, ArrowRight, Star,
  TrendingUp, BarChart3, Clock, Shield, Download, Sparkles,
  LayoutDashboard
} from "lucide-react";
import { api } from "@/lib/api";
import { getUrlParam, showToast, animateCountUp, sanitizeHtml } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

function DimensionBar({ label, value, maxValue = 100 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 500); }, []);
  const color = value >= 75 ? "bg-mark" : value >= 50 ? "bg-caution" : "bg-stop";
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-prose-2">{label}</span>
        <span className="text-sm font-mono text-prose font-semibold">{value}</span>
      </div>
      <div className="h-2.5 bg-sheet-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: animated ? `${(value / maxValue) * 100}%` : "0%" }} />
      </div>
    </div>
  );
}

export default function SimulationCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const scoreRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const sessionId = getUrlParam("session_id");
    if (!sessionId) { setError("No session ID"); setLoading(false); return; }
    loadReview(sessionId);
  }, []);

  async function loadReview(sessionId) {
    try {
      const result = await api.get(`/simulations/${sessionId}/review`);
      setData(result);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data && !animated) {
      setTimeout(() => {
        if (scoreRef.current) animateCountUp(scoreRef.current, Math.round(data.overall_average_score || 0));
        if (data.overall_average_score >= 75) confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        setAnimated(true);
      }, 500);
    }
  }, [data, animated]);

  const canGetCertificate = data?.overall_average_score >= 80;

  async function downloadCertificate() {
    const sessionId = getUrlParam("session_id");
    try {
      const check = await api.get(`/simulations/${sessionId}/certificate`);
      if (!check.has_certificate || !check.certificate?.id) {
        showToast("Certificate not available yet", "error");
        return;
      }
      const response = await fetch(`/api/v1/simulations/certificates/${check.certificate.id}/download`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${check.certificate.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  if (loading) return (
    <ProtectedRoute><AppLayout>
      <div className="text-center py-20"><div className="w-10 h-10 border-2 border-surface-2 border-t-primary rounded-full animate-spin mx-auto" /><p className="mt-4 text-ghost">Loading review...</p></div>
    </AppLayout></ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-3xl mx-auto py-8">
          {error ? (
            <div className="text-center py-20">
              <p className="text-stop mb-4">{error}</p>
              <button className="btn-primary" onClick={() => router.push("/dashboard")}>Back to Dashboard</button>
            </div>
          ) : data ? (
            <div className="space-y-6 animate-fade-up">
              {/* Hero section */}
              <div className="card p-8 text-center bg-gradient-to-b from-sheet to-ink-2 border-signal/20">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-20 h-20 rounded-full bg-gradient-to-br from-signal to-mark flex items-center justify-center mx-auto mb-4 shadow-float">
                  <Trophy size={36} className="text-white" />
                </motion.div>
                <h1 className="font-display text-3xl font-bold text-prose mb-2">Simulation Complete!</h1>
                <p className="text-prose-2 mb-2">{sanitizeHtml(data.career_track)} · {data.difficulty} · {data.total_days} Days</p>

                {canGetCertificate && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mark/10 border border-mark/20 text-mark text-sm mb-4">
                    <Shield size={14} /> Certificate Earned!
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="card p-8 text-center">
                <div className="w-[160px] h-[160px] rounded-full border-4 border-signal/30 flex items-center justify-center mx-auto shadow-float mb-4">
                  <div className="text-center">
                    <div ref={scoreRef} className="text-5xl font-bold font-display text-prose">0</div>
                    <div className="text-xs text-ghost">Overall Score</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-mark font-mono">
                  <Zap size={18} className="inline mr-1" /> {data.xp_earned || 0} XP Earned
                </div>
                {data.industry_readiness_score && (
                  <p className="text-sm text-ghost mt-1">Industry Readiness: {data.industry_readiness_score}%</p>
                )}
              </div>

              {/* Dimension scores */}
              <div className="card p-6">
                <h3 className="font-display font-semibold text-prose mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-signal" /> Performance Breakdown
                </h3>
                {data.dimension_averages && (
                  <>
                    <DimensionBar label="Code Quality" value={data.dimension_averages.code_quality || 0} />
                    <DimensionBar label="Communication" value={data.dimension_averages.communication || 0} />
                    <DimensionBar label="Problem Solving" value={data.dimension_averages.problem_solving || 0} />
                    <DimensionBar label="Time Management" value={data.dimension_averages.time_management || 0} />
                    <DimensionBar label="Completeness" value={data.dimension_averages.completeness || 0} />
                  </>
                )}
              </div>

              {/* Task summary */}
              <div className="card p-6">
                <h3 className="font-display font-semibold text-prose mb-4">Tasks Completed</h3>
                <div className="space-y-2">
                  {data.tasks?.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sheet-2 border border-rule/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle size={14} className={`shrink-0 ${t.overall_score >= 60 ? "text-mark" : "text-caution"}`} />
                        <span className="text-sm text-prose truncate">{sanitizeHtml(t.title)}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-mono font-semibold ${t.overall_score >= 75 ? "text-mark" : t.overall_score >= 50 ? "text-caution" : "text-stop"}`}>
                          {t.overall_score}/100
                        </span>
                        <span className="text-2xs text-ghost">+{t.xp_awarded} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              {(data.strengths?.length > 0 || data.improvements?.length > 0) && (
                <div className="card p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {data.strengths?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-mark mb-3 flex items-center gap-2">
                          <Star size={14} /> Strengths
                        </h4>
                        <ul className="space-y-1.5">
                          {data.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-prose-2">
                              <CheckCircle size={14} className="text-mark shrink-0 mt-0.5" />
                              {sanitizeHtml(s)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {data.improvements?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-caution mb-3 flex items-center gap-2">
                          <TrendingUp size={14} /> Areas to Improve
                        </h4>
                        <ul className="space-y-1.5">
                          {data.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-prose-2">
                              <ArrowRight size={14} className="text-caution shrink-0 mt-0.5" />
                              {sanitizeHtml(s)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-4 pb-8">
                <a href="/dashboard" className="btn-primary">
                  <LayoutDashboard size={14} /> Back to Dashboard
                </a>
                <a href="/simulations" className="btn-outline">
                  <Star size={14} /> Start New Simulation
                </a>
                {canGetCertificate && (
                  <button onClick={downloadCertificate} className="btn-secondary border-mark/30 text-mark hover:bg-mark/5">
                    <Download size={14} /> Download Certificate
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
