"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Play, MessageSquare, FileText, BarChart2,
  ChevronLeft, Cog, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Workspace", icon: LayoutGrid },
      { href: "/simulations", label: "Simulations", icon: Play },
      { href: "/interview", label: "Interviews", icon: MessageSquare },
      { href: "/passport", label: "My Passport", icon: FileText },
      { href: "/leaderboard", label: "Leaderboard", icon: BarChart2 },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ms_sidebar_open");
    if (saved !== null) setCollapsed(saved === "false");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("ms_sidebar_open", String(!next));
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className={cn(
        "h-[52px] flex items-center border-b border-rule-light dark:border-rule shrink-0",
        collapsed ? "justify-center px-0" : "px-3 justify-between"
      )}>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-sm bg-signal/10 dark:bg-signal/15 flex items-center justify-center text-xs font-bold text-signal shrink-0">
            MS
          </span>
          {!collapsed && (
            <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose whitespace-nowrap">
              MentriQ Shadow
            </span>
          )}
        </div>
        {!collapsed && (
          <button onClick={toggleCollapse} className="btn-icon" title="Collapse sidebar">
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest px-3 mb-1 mt-2">
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex items-center w-full rounded-base cursor-pointer transition-all duration-150",
                    collapsed
                      ? "justify-center h-9 w-9 mx-auto"
                      : "h-9 px-3 gap-2.5",
                    active
                      ? "text-ink-prose dark:text-prose bg-card dark:bg-sheet-2 border-l-2 border-signal shadow-lift-light dark:shadow-lift"
                      : "text-ink-ghost dark:text-ghost hover:text-ink-prose dark:hover:text-prose-2 hover:bg-paper-2 dark:hover:bg-sheet"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={16} className="shrink-0" />
                  {!collapsed && (
                    <span className="font-body text-sm font-normal truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Section divider */}
      <div className="border-t border-rule-light dark:border-rule mx-3 my-2" />

      {/* Bottom: user + theme toggle */}
      <div className="p-2 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full av-priya flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <ThemeToggle variant="icon" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-base bg-paper dark:bg-ink border border-rule-light dark:border-rule">
            <div className="w-7 h-7 rounded-full av-priya flex items-center justify-center text-xs font-bold text-white shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink-prose dark:text-prose truncate font-body">Student</div>
              <div className="badge-plan text-2xs">FREE</div>
            </div>
            <ThemeToggle variant="icon" />
            <button className="btn-icon shrink-0" title="Settings">
              <Cog size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 52 : 260 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className={cn(
          "fixed left-0 top-0 h-full z-30 bg-paper dark:bg-ink border-r border-rule-light dark:border-rule hidden md:block overflow-hidden",
          collapsed ? "w-[52px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-scrim dark:bg-scrim backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-[260px] z-50 bg-paper dark:bg-ink border-r border-rule-light dark:border-rule md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
