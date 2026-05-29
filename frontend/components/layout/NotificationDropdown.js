"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, FileText, RefreshCw, Trophy, Target, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { api } from "@/lib/api";
import { timeAgo, sanitizeHtml } from "@/lib/utils";

const ICON_MAP = {
  task_assigned: FileText,
  task_evaluated: CheckCircle,
  revision_requested: RefreshCw,
  simulation_completed: Trophy,
  interview_ready: Target,
  badge_earned: Star,
  deadline_reminder: Clock,
  certificate_earned: Trophy,
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    pollRef.current = setInterval(loadNotifications, 30000);
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/simulations/notifications?limit=10");
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch {}
  }

  async function markRead(id) {
    try {
      await api.post(`/simulations/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  }

  async function markAllRead() {
    try {
      await api.post("/simulations/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  }

  const IconComp = (type) => ICON_MAP[type] || Bell;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative btn-icon" title="Notifications">
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-stop text-white text-2xs font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] bg-card dark:bg-sheet-2 border border-rule-light dark:border-rule rounded-xl shadow-float-light dark:shadow-float z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule-light dark:border-rule">
              <h3 className="font-body text-sm font-semibold text-ink-prose dark:text-prose">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="link-warm text-2xs flex items-center gap-1">
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={24} className="text-ink-ghost dark:text-ghost mx-auto mb-2" />
                  <p className="font-body text-xs text-ink-ghost dark:text-ghost">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = IconComp(n.notification_type) || Bell;
                  return (
                    <a
                      key={n.id}
                      href={n.link || "#"}
                      onClick={(e) => { if (!n.is_read) markRead(n.id); if (!n.link) e.preventDefault(); }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-rule-light/50 dark:border-rule/50 hover:bg-paper-2/60 dark:hover:bg-sheet-2/60 transition-colors no-underline group ${
                        !n.is_read ? "bg-signal-ghost border-l-2 border-l-signal" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        n.is_read ? "bg-paper-2 dark:bg-sheet-2 text-ink-ghost dark:text-ghost" : "bg-signal/10 text-signal"
                      }`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-body text-xs leading-snug ${n.is_read ? "text-ink-prose-2 dark:text-prose-2" : "text-ink-prose dark:text-prose font-medium"}`}>
                          {sanitizeHtml(n.title)}
                        </p>
                        {n.message && (
                          <p className="font-mono text-2xs text-ink-ghost dark:text-ghost mt-0.5 line-clamp-2">{sanitizeHtml(n.message)}</p>
                        )}
                        <p className="font-mono text-2xs text-ink-ghost dark:text-ghost mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
