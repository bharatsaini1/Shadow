"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, Code, Target, MessageSquare, Flame, Palette, Zap, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { showToast } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const BADGE_CONFIG = {
  "first-submission": { icon: Star, color: "primary", desc: "Submitted your first task" },
  "bug-slayer": { icon: Target, color: "danger", desc: "Fixed a critical bug" },
  "interview-ace": { icon: MessageSquare, color: "purple", desc: "Scored 80%+ in an interview" },
  "7-day-streak": { icon: Flame, color: "warn", desc: "Active for 7 consecutive days" },
  "code-master": { icon: Code, color: "accent", desc: "Completed 10 coding tasks" },
  "design-pro": { icon: Palette, color: "purple", desc: "Completed 5 design tasks" },
};

const ALL_BADGES = [
  { slug: "first-submission", name: "First Submission" },
  { slug: "bug-slayer", name: "Bug Slayer" },
  { slug: "interview-ace", name: "Interview Ace" },
  { slug: "7-day-streak", name: "7-Day Streak" },
  { slug: "code-master", name: "Code Master" },
  { slug: "design-pro", name: "Design Pro" },
];

export default function BadgesPage() {
  const [loading, setLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    const uid = getUserId();
    if (uid) loadBadges(uid);
  }, []);

  async function loadBadges(uid) {
    try {
      const result = await api.get(`/auth/${uid}/dashboard`);
      setEarnedBadges(result.badges || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const earnedSlugs = earnedBadges.map((b) => b.badge_slug || b.slug);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-prose flex items-center gap-2">
            <Award size={24} className="text-caution" /> Badges
          </h1>
          <p className="text-sm text-ghost mt-1">
            {earnedSlugs.length} of {ALL_BADGES.length} badges earned
          </p>
        </div>

        {/* Progress bar */}
        <div className="card p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ghost">Collection Progress</span>
            <span className="text-sm font-mono text-prose">{Math.round((earnedSlugs.length / ALL_BADGES.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-sheet-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedSlugs.length / ALL_BADGES.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-signal to-go"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="skeleton w-16 h-16 mx-auto mb-3 rounded-xl" />
                <div className="skeleton h-4 w-24 mx-auto mb-2" />
                <div className="skeleton h-3 w-32 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_BADGES.map((badge, i) => {
              const isEarned = earnedSlugs.includes(badge.slug);
              const cfg = BADGE_CONFIG[badge.slug] || { icon: Zap, color: "primary", desc: "" };

              return (
                <motion.div
                  key={badge.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card p-6 text-center transition-all ${
                    isEarned ? "hover:card-hover cursor-pointer" : "opacity-40 grayscale"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl bg-${cfg.color}/10 flex items-center justify-center mx-auto mb-3 relative`}>
                    <cfg.icon size={28} className={`text-${cfg.color}`} />
                    {!isEarned && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sheet-2 border border-rule flex items-center justify-center">
                        <Lock size={10} className="text-ghost" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-sm text-prose mb-1">{badge.name}</h4>
                  <p className="text-2xs text-ghost leading-relaxed">{cfg.desc}</p>
                  {isEarned && (
                    <span className="badge badge-success mt-2">Earned</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
