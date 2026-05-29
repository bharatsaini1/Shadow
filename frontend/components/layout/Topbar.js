"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import { logoutUser } from "@/lib/auth";

const PAGE_TITLES = {
  "/dashboard": "Workspace",
  "/simulation": "Simulation",
  "/interview": "Interview Room",
  "/evaluation": "Evaluation",
  "/passport": "Shadow Passport",
  "/leaderboard": "Leaderboard",
};

export default function Topbar({ onMenuToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const cmdRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentTitle = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname.startsWith(key)
  )?.[1] || "MentriQ Shadow";

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCmdPaletteOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (cmdPaletteOpen) {
      setTimeout(() => cmdRef.current?.focus(), 100);
    }
  }, [cmdPaletteOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCmdNavigate = useCallback((href) => {
    setCmdPaletteOpen(false);
    router.push(href);
  }, [router]);

  const cmdItems = [
    { label: "Go to Workspace", href: "/dashboard", shortcut: "G D" },
    { label: "Go to Simulations", href: "/simulations", shortcut: "G S" },
    { label: "Start Interview", href: "/interview", shortcut: "G I" },
    { label: "View Passport", href: "/passport", shortcut: "G P" },
    { label: "View Leaderboard", href: "/leaderboard", shortcut: "G L" },
  ];

  return (
    <>
      <header className="fixed top-0 right-0 left-0 md:left-[260px] h-[52px] z-20 bg-paper/92 dark:bg-ink/92 backdrop-blur-md border-b border-rule-light dark:border-rule transition-all duration-300">
        <div className="h-full flex items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onMenuToggle} className="btn-icon md:hidden">
              <Menu size={16} />
            </button>
            <span className="font-body text-sm font-medium text-ink-prose-2 dark:text-prose-2">
              {currentTitle}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-ghost dark:text-ghost pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                    e.preventDefault();
                    setCmdPaletteOpen(true);
                  }
                }}
                placeholder="Search or jump to..."
                className={cn(
                  "input pl-8 pr-8 py-1.5 text-xs transition-all duration-200",
                  searchFocused ? "w-[320px]" : "w-[240px]"
                )}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-ghost dark:text-ghost pointer-events-none">
                ⌘K
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1 border-l border-rule-light dark:border-rule pl-3">
              <NotificationDropdown />
              <ThemeToggle variant="icon" />

              {/* User avatar dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-7 h-7 rounded-full av-priya flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer"
                  title="User menu"
                >
                  S
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-2 w-48 z-50 bg-card dark:bg-sheet-2 border border-rule-light dark:border-rule rounded-md shadow-float-light dark:shadow-float overflow-hidden"
                    >
                      <button onClick={() => { router.push("/passport"); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-prose dark:text-prose hover:bg-paper-2 dark:hover:bg-sheet transition-colors font-body text-left">
                        <User size={14} /> View Passport
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-prose dark:text-prose hover:bg-paper-2 dark:hover:bg-sheet transition-colors font-body text-left">
                        <Settings size={14} /> Settings
                      </button>
                      <div className="border-t border-rule-light dark:border-rule" />
                      <button onClick={() => { logoutUser(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stop hover:bg-stop/5 transition-colors font-body text-left">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Command palette */}
      <AnimatePresence>
        {cmdPaletteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-scrim dark:bg-scrim"
              onClick={() => setCmdPaletteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 w-[480px] z-50 bg-card dark:bg-sheet-2 border border-rule-light dark:border-rule rounded-xl shadow-float-light dark:shadow-deep overflow-hidden"
            >
              <div className="p-3 border-b border-rule-light dark:border-rule">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost dark:text-ghost" />
                  <input
                    ref={cmdRef}
                    type="text"
                    placeholder="Search pages and actions..."
                    className="w-full bg-transparent border-0 text-sm text-ink-prose dark:text-prose pl-8 pr-3 py-1.5 outline-none font-body"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setCmdPaletteOpen(false);
                    }}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest px-2 py-1">
                  Quick Actions
                </div>
                {cmdItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleCmdNavigate(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-base text-sm text-ink-prose-2 dark:text-prose-2 hover:text-ink-prose dark:hover:text-prose hover:bg-paper-2 dark:hover:bg-sheet transition-colors cursor-pointer font-body"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{item.shortcut}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
