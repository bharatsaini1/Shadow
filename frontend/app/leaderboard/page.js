"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { getUserId } from "@/lib/auth";
import { showToast, sanitizeHtml } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm text-ghost font-mono">#{rank}</span>;
}

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const uid = getUserId();
    setUserId(uid);
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

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-prose flex items-center gap-2">
            <Trophy size={24} className="text-caution" /> Leaderboard
          </h1>
          <p className="text-sm text-ghost mt-1">See how you rank among other students.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="skeleton w-8 h-8 rounded-full" />
                <div className="skeleton h-4 flex-1" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Current user position */}
            {data?.leaderboard?.length > 0 && (
              <div className="card p-4 mb-6 border-signal/30 bg-signal-ghost">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-signal to-mark flex items-center justify-center text-sm font-bold text-white">
                    {data.leaderboard.find((e) => e.id === userId)?.name?.[0] || "Y"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-prose">
                      {data.leaderboard.find((e) => e.id === userId)?.name || "You"}
                      <span className="badge badge-active ml-2">You</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-prose font-mono">
                      {data.leaderboard.find((e) => e.id === userId)?.xp || 0} XP
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full leaderboard */}
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="text-left px-4 py-3 text-2xs text-ghost font-medium uppercase tracking-wider">Rank</th>
                    <th className="text-left px-4 py-3 text-2xs text-ghost font-medium uppercase tracking-wider">Student</th>
                    <th className="text-left px-4 py-3 text-2xs text-ghost font-medium uppercase tracking-wider">Level</th>
                    <th className="text-left px-4 py-3 text-2xs text-ghost font-medium uppercase tracking-wider">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.leaderboard?.length > 0 ? (
                    data.leaderboard.map((entry, i) => {
                      const isCurrentUser = entry.id === userId;
                      return (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`border-b border-rule last:border-0 transition-colors ${
                            isCurrentUser ? "bg-signal-ghost border-l-2 border-l-signal" : "hover:bg-sheet"
                          }`}
                        >
                          <td className="px-4 py-3"><RankBadge rank={i + 1} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-sheet-2 flex items-center justify-center text-2xs font-bold text-prose-2">
                                {sanitizeHtml(entry.name || "A")[0]}
                              </div>
                              <span className="text-sm text-prose">{sanitizeHtml(entry.name || "Anonymous")}</span>
                              {isCurrentUser && <span className="badge badge-active">You</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-ghost">Level {entry.level || entry.career_level || 1}</td>
                          <td className="px-4 py-3 text-sm text-ghost font-mono">{entry.xp || entry.xp_total || 0}</td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-ghost p-12">No leaderboard data yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
