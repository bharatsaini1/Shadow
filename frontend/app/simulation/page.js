"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Monitor, Clock, ChevronRight, Check, X, FileText, Copy, RotateCcw, Settings, Loader2, Bot } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const SAMPLE_TASKS = [
  {
    id: 1,
    title: "Fix the JWT refresh token vulnerability",
    type: "CODE",
    difficulty: "hard",
    description: "The current JWT implementation does not invalidate refresh tokens after use. Implement proper refresh token rotation with a blacklist mechanism.",
    clientNote: "The client flagged this in the standup. Priority alpha — fix before EOD.",
    timer: "01:47:22",
    status: "pending",
  },
  {
    id: 2,
    title: "Implement rate limiting on all API routes",
    type: "CODE",
    difficulty: "medium",
    description: "Add rate limiting middleware to prevent API abuse. Use a sliding window algorithm. Set different limits for authenticated vs unauthenticated routes.",
    clientNote: null,
    timer: "03:22:15",
    status: "submitted",
  },
  {
    id: 3,
    title: "Write unit tests for auth middleware",
    type: "CODE",
    difficulty: "easy",
    description: "Achieve at least 80% code coverage on the auth middleware. Include tests for token validation, role-based access control, and error handling.",
    clientNote: null,
    timer: "05:00:00",
    status: "pending",
  },
];

const TEAM_MEMBERS = [
  { name: "Priya", role: "Team Lead", initial: "P", color: "av-priya", online: true },
  { name: "Karan", role: "Backend Dev", initial: "K", color: "av-karan", online: true },
  { name: "Sneha", role: "QA Engineer", initial: "S", color: "av-sneha", online: false },
  { name: "Mehta", role: "Product Manager", initial: "M", color: "av-mehta", online: true },
];

const INITIAL_CHAT = [
  { from: "system", text: "Welcome to Day 3. Here's a quick update before you start:" },
  { from: "Priya", text: "Team, the client has flagged a security issue with our JWT implementation. I'm assigning this to you @Student — fix needs to go in today.", person: "P", color: "av-priya" },
  { from: "Karan", text: "I've left some notes in the PR. Happy to pair if needed.", person: "K", color: "av-karan" },
];

export default function SimulationPage() {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState(null);
  const [editorTab, setEditorTab] = useState("code");
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [code, setCode] = useState("// Your solution here\n\n");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "You", text: chatInput, person: "S", color: "av-priya" }]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChatMessages((prev) => [...prev, { from: "Priya", text: "Good point. Let me check the auth flow and get back to you.", person: "P", color: "av-priya" }]);
    }, 1500);
  };

  const taskStatusIcon = (status) => {
    if (status === "submitted") return <div className="w-4 h-4 bg-go text-white rounded-full flex items-center justify-center shrink-0"><Check size={10} /></div>;
    return <div className="w-4 h-4 border-2 border-rule-light dark:border-rule-2 rounded-full shrink-0" />;
  };

  const diffClass = (difficulty) => {
    if (difficulty === "hard") return "badge-hard";
    if (difficulty === "medium") return "badge-medium";
    return "badge-easy";
  };

  return (
    <div className="h-screen flex flex-col bg-paper dark:bg-ink overflow-hidden">
      {/* Session topbar */}
      <header className="h-11 border-b border-rule-light dark:border-rule bg-paper dark:bg-ink flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="btn-icon"><ArrowLeft size={14} /></button>
          <span className="font-body text-sm font-medium text-ink-ghost dark:text-ghost">MERN Stack Developer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className={`w-4 h-[3px] rounded-sm ${i < 2 ? "bg-rule-light-2 dark:bg-rule-2" : i === 2 ? "bg-signal" : "bg-rule-light dark:bg-rule"}`} />
            ))}
          </div>
          <span className="font-mono text-xs text-go">+80 XP today</span>
          <ThemeToggle variant="icon" />
          <button className="btn-icon"><Settings size={14} /></button>
        </div>
      </header>

      {/* Main 3-column area */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Team Chat (276px) */}
        <aside className="w-[276px] border-r border-rule-light dark:border-rule bg-paper dark:bg-ink flex flex-col shrink-0 hidden md:flex">
          <div className="h-10 border-b border-rule-light dark:border-rule px-3 flex items-center justify-between shrink-0">
            <span className="font-body text-xs font-semibold text-ink-ghost dark:text-ghost">Team</span>
            <div className="flex items-center -space-x-1.5">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.name} className="relative">
                  <div className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-2xs font-bold text-white`}>{m.initial}</div>
                  {m.online && <div className="dot-online absolute -bottom-0.5 -right-0.5 border border-paper dark:border-ink" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i}>
                {msg.from !== "system" && msg.from !== "You" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-4 h-4 rounded-full ${msg.color} flex items-center justify-center text-2xs font-bold text-white`}>{msg.person}</div>
                    <span className="font-mono text-2xs text-ink-ghost dark:text-ghost">{msg.from} · Team Lead</span>
                  </div>
                )}
                <div className={cn(
                  "font-body text-sm px-3 py-2 rounded-md",
                  msg.from === "You"
                    ? "bg-signal text-white ml-6"
                    : msg.from === "system"
                    ? "text-ink-ghost dark:text-ghost italic text-xs px-1"
                    : "bg-paper-2 dark:bg-sheet-2 text-ink-prose dark:text-prose"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full av-priya flex items-center justify-center text-2xs font-bold text-white">P</div>
                <div className="bg-paper-2 dark:bg-sheet-2 px-3 py-2 rounded-md flex items-center gap-1">
                  <span className="w-1 h-1 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-1" />
                  <span className="w-1 h-1 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-2" />
                  <span className="w-1 h-1 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-3" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="shrink-0 border-t border-rule-light dark:border-rule px-3 py-2">
            <div className="relative">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder="Message team..."
                rows={2}
                className="input text-sm resize-none pr-8 py-1.5"
              />
              <button onClick={sendChatMessage} className="btn-icon absolute right-1 bottom-1.5"><Send size={14} /></button>
            </div>
            <p className="font-mono text-2xs text-ink-dim dark:text-dim mt-1">Team replies in v2</p>
          </div>
        </aside>

        {/* CENTER: Task Board (flex-1) */}
        <main className="flex-1 border-r border-rule-light dark:border-rule bg-paper dark:bg-ink flex flex-col overflow-hidden">
          <div className="h-10 border-b border-rule-light dark:border-rule px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-body text-xs font-semibold text-ink-ghost dark:text-ghost">Today&apos;s Tasks</span>
              <span className="font-mono text-xs text-ink-ghost dark:text-ghost">3 tasks · 2 pending</span>
            </div>
            <span className="font-mono text-xs text-go animate-xp-rise">+80 XP</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-rule-light dark:divide-rule">
            {SAMPLE_TASKS.map((task) => (
              <div
                key={task.id}
                className="px-4 py-4 hover:bg-paper-2 dark:hover:bg-sheet-2 transition-colors cursor-pointer"
                onClick={() => setActiveTask(task)}
              >
                <div className="flex items-start gap-3">
                  {taskStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose">{task.title}</span>
                      <span className={diffClass(task.difficulty)}>{task.difficulty.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="task-type">{task.type}</span>
                      <span className="font-mono text-xs text-ink-ghost dark:text-ghost">task_{task.id.toString().padStart(3, "0")}</span>
                      <span className="timer-danger text-xs">{task.timer}</span>
                    </div>
                    <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 mt-1.5 line-clamp-2">{task.description}</p>
                    {task.clientNote && (
                      <div className="border-l-2 border-rule-light dark:border-rule pl-3 mt-2 font-mono text-xs text-ink-ghost dark:text-ghost italic">
                        {task.clientNote}
                      </div>
                    )}
                  </div>
                  <button className="btn-ghost text-xs shrink-0" onClick={(e) => { e.stopPropagation(); setActiveTask(task); }}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT: Code Editor (316px) */}
        <aside className="w-[316px] bg-paper dark:bg-ink flex flex-col shrink-0 hidden lg:flex">
          <div className="h-10 border-b border-rule-light dark:border-rule px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button onClick={() => setEditorTab("code")} className={cn("px-2 py-1 rounded-sm text-xs font-body transition-colors", editorTab === "code" ? "bg-paper-2 dark:bg-sheet-2 text-ink-prose dark:text-prose" : "text-ink-ghost dark:text-ghost")}>Code</button>
              <button onClick={() => setEditorTab("notes")} className={cn("px-2 py-1 rounded-sm text-xs font-body transition-colors", editorTab === "notes" ? "bg-paper-2 dark:bg-sheet-2 text-ink-prose dark:text-prose" : "text-ink-ghost dark:text-ghost")}>Notes</button>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono text-2xs text-ink-ghost dark:text-ghost">javascript</span>
              <button className="btn-icon"><Copy size={12} /></button>
              <button className="btn-icon"><RotateCcw size={12} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {editorTab === "code" ? (
              <MonacoEditor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 8 },
                }}
              />
            ) : (
              <textarea
                className="w-full h-full bg-paper dark:bg-ink text-ink-prose dark:text-prose font-mono text-sm p-3 resize-none border-0 outline-none"
                placeholder="Your notes here..."
              />
            )}
          </div>

          <div className="h-7 border-t border-rule-light dark:border-rule px-3 flex items-center justify-between shrink-0">
            <span className="font-mono text-2xs text-ink-ghost dark:text-ghost">javascript · {code.split("\n").length} lines</span>
            <span className="font-mono text-2xs text-ink-ghost dark:text-ghost">Autosaved 2s ago</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
