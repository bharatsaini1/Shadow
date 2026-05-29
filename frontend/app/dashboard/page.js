"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, MessageSquare, FileText, Clock, Check, X, ChevronRight, Trophy, Star, Zap, BarChart2 } from "lucide-react";
import { api } from "@/lib/api";
import { showToast, sanitizeHtml, cn } from "@/lib/utils";
import { getUserId } from "@/lib/auth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const DIMENSIONS = ["code_quality", "communication", "problem_solving", "time_management", "completeness"];

function TaskRow({ task, index }) {
  const statusIcon = {
    pending: <div className="w-4 h-4 border-2 border-rule-light dark:border-rule-2 rounded-full shrink-0 mt-0.5" />,
    submitted: <div className="w-4 h-4 bg-go text-white rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={10} /></div>,
    overdue: <div className="w-4 h-4 bg-stop text-white rounded-full flex items-center justify-center shrink-0 mt-0.5"><X size={10} /></div>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3 py-3 border-b border-rule-light dark:border-rule last:border-0"
    >
      {statusIcon[task.status] || statusIcon.pending}
      <div className="flex-1 min-w-0">
        <div className="font-body text-sm font-medium text-ink-prose dark:text-prose truncate">{sanitizeHtml(task.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="task-type">CODE</span>
          <span className="badge-hard">HARD</span>
          <span className="timer-danger text-xs">01:47:22</span>
        </div>
      </div>
      <button className="btn-ghost text-xs shrink-0">Open</button>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const uid = getUserId();
    if (!uid) return;
    loadData(uid);
  }, []);

  async function loadData(uid) {
    try {
      const result = await api.get(`/auth/${uid}/dashboard`);
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
          <div className="grid grid-cols-12 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${i < 4 ? "col-span-4" : "col-span-8"} card p-4`}>
                <div className="skeleton h-4 w-1/3 mb-3" />
                <div className="skeleton h-3 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Greeting */}
        <div className="flex items-start justify-between mb-6 col-span-12">
          <div>
            <h1 className="font-display text-2xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 24, "wght" 600' }}>
              Good morning, Student.
            </h1>
            <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 mt-1">
              You have 3 tasks pending and 1 interview scheduled today.
            </p>
          </div>
          <span className="font-mono text-xs text-ink-ghost dark:text-ghost hidden sm:block">{today}</span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Active Simulation Card */}
          <div className="col-span-12 lg:col-span-8">
            <div className="card p-0">
              <div className="bg-paper-2 dark:bg-sheet-2 border-b border-rule-light dark:border-rule px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="badge-active">ACTIVE</span>
                  <span className="font-body text-sm font-medium text-ink-prose dark:text-prose ml-1">MERN Stack Developer</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-ink-ghost dark:text-ghost">Day 3 of 10</span>
                  <button className="btn-primary text-xs py-1.5 px-3">Continue <ChevronRight size={12} /></button>
                </div>
              </div>

              <div className="h-0.5 bg-rule-light dark:bg-rule">
                <div className="h-full w-[30%] bg-signal" />
              </div>

              <div className="px-5 py-4">
                <div className="section-header mb-3">
                  <div className="section-title">Today&apos;s tasks</div>
                  <span className="font-mono text-xs text-ink-ghost dark:text-ghost">3 tasks · 1 submitted</span>
                </div>
                <div className="divide-y divide-rule-light dark:divide-rule">
                  <TaskRow task={{ title: "Fix the JWT refresh token vulnerability", status: "pending" }} index={0} />
                  <TaskRow task={{ title: "Implement rate limiting on all API routes", status: "submitted" }} index={1} />
                  <TaskRow task={{ title: "Write unit tests for auth middleware", status: "pending" }} index={2} />
                </div>
              </div>

              <div className="bg-paper-2 dark:bg-sheet-2 border-t border-rule-light dark:border-rule px-5 py-3">
                <div className="section-title mb-2">Recent team messages</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full av-priya flex items-center justify-center text-2xs font-bold text-white shrink-0">P</span>
                    <div>
                      <span className="font-mono text-xs text-ink-ghost dark:text-ghost">Priya · 9:12 AM</span>
                      <p className="font-body text-xs text-ink-prose-2 dark:text-prose-2 mt-0.5">The client approved the API refactor. Nice work.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full av-karan flex items-center justify-center text-2xs font-bold text-white shrink-0">K</span>
                    <div>
                      <span className="font-mono text-xs text-ink-ghost dark:text-ghost">Karan · 8:45 AM</span>
                      <p className="font-body text-xs text-ink-prose-2 dark:text-prose-2 mt-0.5">PR for the auth middleware is up for review.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="stat-card">
              <div className="stat-label">Career level</div>
              <div className="stat-value">4</div>
              <div className="font-body text-sm text-ink-prose-2 dark:text-prose-2">Junior Developer</div>
              <div className="mt-2">
                <div className="flex justify-between font-mono text-xs text-ink-ghost dark:text-ghost mb-1">
                  <span>4,820 / 5,000 XP</span>
                </div>
                <div className="h-0.5 bg-rule-light dark:bg-rule">
                  <div className="h-full w-[96%] bg-signal" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Interview performance</div>
              <div className="stat-value">77%</div>
              <div className="font-body text-sm text-ink-ghost dark:text-ghost">Last: Technical · 82%</div>
              <a href="/interview" className="link-warm text-xs mt-2 inline-block">Practice interview <ChevronRight size={10} className="inline" /></a>
            </div>

            <div className="card p-4">
              <div className="section-title mb-3">Quick actions</div>
              <div className="space-y-2">
                <button className="btn-secondary w-full justify-start text-xs"><Play size={14} /> Start new simulation</button>
                <button className="btn-secondary w-full justify-start text-xs"><MessageSquare size={14} /> Begin interview</button>
                <button className="btn-secondary w-full justify-start text-xs"><FileText size={14} /> View my passport</button>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Current streak</div>
              <div className="stat-value">7 <span className="font-body text-sm text-ink-prose-2 dark:text-prose-2 font-normal">days</span></div>
              <div className="font-body text-xs text-ink-ghost dark:text-ghost mt-1">3 more days to unlock &ldquo;Streak Warrior&rdquo;</div>
            </div>

            {/* Leaderboard Widget */}
            <div className="card p-4">
              <div className="section-title mb-3">MERN Weekly Rank</div>
              <div className="space-y-0">
                {[
                  { rank: "#1", name: "Ananya", xp: "4,820" },
                  { rank: "#2", name: "Rahul", xp: "4,210" },
                  { rank: "#3", name: "Priya", xp: "3,950" },
                  { rank: "#4", name: "Student", xp: "3,720", isMe: true },
                  { rank: "#5", name: "Vikram", xp: "3,100" },
                ].map((entry, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 py-2 border-b border-rule-light dark:border-rule last:border-0",
                      entry.isMe && "bg-paper-2 dark:bg-sheet-2 rounded-base px-1 -mx-1"
                    )}
                  >
                    <span className={`font-mono text-xs w-4 ${i < 3 ? "text-caution" : "text-ink-ghost dark:text-ghost"}`}>{entry.rank}</span>
                    <div className="w-5 h-5 rounded-full bg-paper-2 dark:bg-sheet-2 flex items-center justify-center text-2xs font-bold text-ink-prose-2 dark:text-prose-2">
                      {entry.name[0]}
                    </div>
                    <span className="font-body text-sm flex-1 text-ink-prose dark:text-prose">
                      {entry.name}
                      {entry.isMe && <span className="badge-neutral ml-2 text-2xs">You</span>}
                    </span>
                    <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{entry.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="col-span-12 mt-2">
            <div className="section-header">
              <div className="section-title">Recent achievements</div>
              <a href="/badges" className="link-warm text-xs">View all <ChevronRight size={10} className="inline" /></a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { name: "First Task Complete", icon: Star, color: "text-go", date: "2d ago" },
                { name: "Streak Warrior", icon: Zap, color: "text-caution", date: "5d ago" },
                { name: "Debug Master", icon: Trophy, color: "text-signal", date: "1w ago" },
              ].map((badge, i) => (
                <div key={i} className="card-action inline-flex items-center gap-2 px-3 py-2 shrink-0">
                  <badge.icon size={14} className={badge.color} />
                  <span className="font-body text-sm text-ink-prose dark:text-prose whitespace-nowrap">{badge.name}</span>
                  <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{badge.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
