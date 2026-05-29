"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Star, Code, Target, MessageSquare, Flame, Palette, Zap, Check, ChevronRight, BarChart3, Shield, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { showToast, sanitizeHtml } from "@/lib/utils";
import { getUserId } from "@/lib/auth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const SKILLS = [
  { name: "MERN Stack", score: 88, icon: Code },
  { name: "Problem Solving", score: 78, icon: Target },
  { name: "Communication", score: 65, icon: MessageSquare },
  { name: "Consistency", score: 92, icon: Flame },
];

const RECENT_BADGES = [
  { name: "First Task Complete", icon: Star, color: "text-go", slug: "first-task" },
  { name: "Debug Master", icon: Zap, color: "text-signal", slug: "debug-master" },
  { name: "Streak Warrior", icon: Flame, color: "text-caution", slug: "streak-warrior" },
];

export default function PassportPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const uid = getUserId();
    if (!uid) return;
    loadData(uid);
  }, []);

  async function loadData(uid) {
    try {
      const result = await api.get(`/auth/${uid}/passport`);
      setData(result);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="skeleton h-8 w-1/3 mb-2" />
            <div className="skeleton h-4 w-2/3 mb-6" />
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-md" />)}
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-signal" />
              <h1 className="font-display text-2xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 24, "wght" 600' }}>
                Shadow Passport
              </h1>
            </div>
            <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2">Your verified work history. Share it with employers.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-label">Simulations</div>
              <div className="stat-value text-2xl">12</div>
              <div className="stat-sub">3 in progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg. Score</div>
              <div className="stat-value text-2xl">78%</div>
              <div className="stat-sub">+5% this week</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">XP Earned</div>
              <div className="stat-value text-2xl">4,820</div>
              <div className="stat-sub">Level 4 · Junior</div>
            </div>
          </div>

          {/* Skill bars */}
          <div className="card p-6 mb-6">
            <div className="section-header">
              <div className="section-title">Skills Assessment</div>
            </div>
            <div className="space-y-4">
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <skill.icon size={14} className="text-ink-ghost dark:text-ghost" />
                    <span className="font-body text-sm text-ink-prose dark:text-prose">{skill.name}</span>
                    <span className="font-mono text-xs text-ink-ghost dark:text-ghost ml-auto">{skill.score}%</span>
                  </div>
                  <div className="h-0.5 bg-rule-light dark:bg-rule">
                    <div className={`h-full w-[${skill.score}%] ${skill.score >= 80 ? "bg-go" : skill.score >= 60 ? "bg-caution" : "bg-stop"}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent badges */}
          <div className="card p-6 mb-6">
            <div className="section-header">
              <div className="section-title">Recent Badges</div>
              <a href="/badges" className="link-warm text-xs">View all <ChevronRight size={10} className="inline" /></a>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECENT_BADGES.map((badge) => (
                <div key={badge.slug} className="card-action inline-flex items-center gap-2 px-3 py-2">
                  <badge.icon size={14} className={badge.color} />
                  <span className="font-body text-sm text-ink-prose dark:text-prose">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career timeline */}
          <div className="card p-6">
            <div className="section-header">
              <div className="section-title">Career Timeline</div>
            </div>
            <div className="space-y-4">
              {[
                { title: "MERN Stack Simulation", subtitle: "Day 3 of 10 · 78% avg", date: "Jan 2025", active: true },
                { title: "Data Analysis Simulation", subtitle: "Completed · 82% score", date: "Dec 2024", active: false },
                { title: "UI/UX Workshop", subtitle: "Completed · Certificate earned", date: "Nov 2024", active: false },
              ].map((entry, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-rule-light dark:border-rule last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${entry.active ? "bg-signal" : "bg-rule-light-2 dark:bg-rule-2"}`} />
                  <div className="flex-1">
                    <div className="font-body text-sm font-medium text-ink-prose dark:text-prose">{entry.title}</div>
                    <div className="font-body text-xs text-ink-prose-2 dark:text-prose-2 mt-0.5">{entry.subtitle}</div>
                  </div>
                  <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share button */}
          <div className="mt-8 text-center">
            <button className="btn-primary text-sm">Share your passport <ChevronRight size={14} /></button>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
