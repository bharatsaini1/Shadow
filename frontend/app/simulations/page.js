"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Monitor, Plus, ChevronRight, Clock, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { showToast, formatDate } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

function SimulationCard({ sim, type = "active" }) {
  const router = useRouter();
  const progress = ((sim.current_day || 1) / (sim.total_days || 10)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:card-hover transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-signal-ghost flex items-center justify-center">
              <Monitor size={16} className="text-signal" />
            </div>
            <h4 className="font-display font-semibold text-prose text-sm">{sim.career_track || "Simulation"}</h4>
          </div>
          {type === "active" ? (
            <span className="badge badge-active">Day {sim.current_day || 1}/{sim.total_days || 10}</span>
          ) : (
            <span className="badge badge-success">Score: {sim.industry_readiness_score || "—"}</span>
          )}
        </div>

        {type === "active" && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-ghost mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-sheet-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-signal to-mark"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-ghost mb-3">
          <span className="flex items-center gap-1"><Zap size={12} /> {sim.xp_earned || 0} XP</span>
          {sim.completed_at && <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(sim.completed_at)}</span>}
        </div>

        {type === "active" ? (
          <button
            className="btn-primary w-full py-2 text-sm"
            onClick={() => router.push(`/simulation?session_id=${sim.id}`)}
          >
            Continue <ChevronRight size={14} />
          </button>
        ) : (
          <button
            className="btn-outline w-full py-2 text-sm"
            onClick={() => router.push(`/simulation?session_id=${sim.id}`)}
          >
            Review
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function SimulationsPage() {
  const [loading, setLoading] = useState(true);
  const [activeSims, setActiveSims] = useState([]);
  const [completedSims, setCompletedSims] = useState([]);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [tracks, setTracks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const uid = getUserId();
    if (uid) loadData(uid);
    loadTracks();
  }, []);

  async function loadData(uid) {
    try {
      const result = await api.get(`/auth/${uid}/dashboard`);
      setActiveSims(result.active_simulations || []);
      setCompletedSims(result.completed_simulations || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadTracks() {
    try {
      const result = await api.get("/simulations/career-tracks");
      setTracks(result);
    } catch (_) {}
  }

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  async function startSimulation(trackId, difficulty) {
    try {
      const result = await api.post("/simulations/start", {
        career_track_id: trackId,
        difficulty: difficulty || "intermediate",
      });
      showToast("Simulation started!", "success");
      setShowTrackModal(false);
      setSelectedTrack(null);
      setSelectedDifficulty(null);
      router.push(`/simulation?session_id=${result.session_id || result.id}`);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout onNewSimulation={() => setShowTrackModal(true)}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-prose flex items-center gap-2">
              <Monitor size={24} className="text-signal" /> Simulations
            </h1>
            <p className="text-sm text-ghost mt-1">Your career simulation sessions.</p>
          </div>
          <button onClick={() => setShowTrackModal(true)} className="btn-primary text-sm">
            <Plus size={14} /> New Simulation
          </button>
        </div>

        {/* Active */}
        <h3 className="font-display font-bold text-lg text-prose mb-4">Active</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="card p-5"><div className="skeleton h-5 w-32 mb-3" /><div className="skeleton h-2 w-full rounded-full" /></div>
            ))
          ) : activeSims.length > 0 ? (
            activeSims.map((sim) => <SimulationCard key={sim.id} sim={sim} type="active" />)
          ) : (
            <div className="col-span-full text-center py-12 card">
              <Monitor size={32} className="text-ghost mx-auto mb-3" />
              <p className="text-ghost mb-4">No active simulations.</p>
              <button onClick={() => setShowTrackModal(true)} className="btn-primary text-sm">Start One</button>
            </div>
          )}
        </div>

        {/* Completed */}
        <h3 className="font-display font-bold text-lg text-prose mb-4">Completed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="card p-5"><div className="skeleton h-5 w-32" /></div>
          ) : completedSims.length > 0 ? (
            completedSims.map((sim) => <SimulationCard key={sim.id} sim={sim} type="completed" />)
          ) : (
            <div className="col-span-full text-center py-8 text-ghost text-sm">No completed simulations yet.</div>
          )}
        </div>

        {/* Track / Difficulty Selection Modal */}
        {showTrackModal && (
          <div className="fixed inset-0 bg-scrim backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTrackModal(false)}>
            <div className="card max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-float animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-prose">
                  {selectedTrack ? "Choose Difficulty" : "Choose a Career Track"}
                </h3>
                <button onClick={() => { setShowTrackModal(false); setSelectedTrack(null); }} className="text-ghost hover:text-prose text-xl leading-none p-1">&times;</button>
              </div>

              {!selectedTrack ? (
                <div className="space-y-2">
                  {tracks.length > 0 ? tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => setSelectedTrack(track)}
                      className="w-full text-left p-4 rounded-lg bg-sheet-2 border border-rule transition-all hover:border-signal/30 hover:shadow-float group"
                    >
                      <h4 className="font-display font-semibold text-prose mb-1 group-hover:text-signal transition-colors">{track.name}</h4>
                      <p className="text-sm text-ghost mb-2">{track.description || ""}</p>
                      <span className="badge badge-active">{track.difficulty_level || "beginner"}</span>
                    </button>
                  )) : (
                    <div className="text-center py-8 text-ghost">Loading tracks...</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-ghost mb-4">
                    Set the difficulty for <strong className="text-prose">{selectedTrack.name}</strong> simulation:
                  </p>
                  {[
                    {
                      key: "beginner",
                      label: "Beginner",
                      desc: "Guided tasks with clear instructions. Perfect for first-timers.",
                      badge: "badge-easy",
                    },
                    {
                      key: "intermediate",
                      label: "Intermediate",
                      desc: "Moderate complexity. Expect real-world challenges.",
                      badge: "badge-medium",
                    },
                    {
                      key: "advanced",
                      label: "Advanced",
                      desc: "Hard deadlines, complex requirements. For experienced simmers.",
                      badge: "badge-hard",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => startSimulation(selectedTrack.id, opt.key)}
                      className="w-full text-left p-4 rounded-lg bg-sheet-2 border border-rule transition-all hover:border-signal/30 hover:shadow-float group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display font-semibold text-prose group-hover:text-signal transition-colors">{opt.label}</h4>
                        <span className={`badge ${opt.badge}`}>{opt.key}</span>
                      </div>
                      <p className="text-sm text-ghost">{opt.desc}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedTrack(null)}
                    className="btn-ghost w-full mt-2 text-sm"
                  >
                    ← Back to tracks
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
