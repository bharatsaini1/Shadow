"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Loader2, ChevronRight, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const SAMPLE_QUESTIONS = [
  { q: "Tell me about a challenging technical problem you've solved recently. How did you approach it?", dimension: "problem_solving" },
  { q: "How would you implement authentication in a MERN stack application? Walk me through your approach.", dimension: "technical" },
  { q: "Describe a situation where you had to work with a difficult team member. How did you handle it?", dimension: "communication" },
];

const DIMENSION_LABELS = {
  technical: "Technical",
  communication: "Communication",
  problem_solving: "Problem Solving",
};

export default function InterviewPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [dimensions, setDimensions] = useState({ technical: 72, communication: 65, problem_solving: 80 });
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const [countUp, setCountUp] = useState(0);

  useEffect(() => {
    if (started && !ended) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [started, ended]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmtTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    setStarted(true);
    setMessages([{
      from: "ai",
      text: "Hi! I'm Meera, and I'll be conducting your technical interview today. Let's jump right in.",
      name: "Meera · AI Interviewer",
    }, {
      from: "ai",
      text: SAMPLE_QUESTIONS[0].q,
      name: "Meera · AI Interviewer",
    }]);
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const nextIdx = questionIndex + 1;
      if (nextIdx < SAMPLE_QUESTIONS.length) {
        setQuestionIndex(nextIdx);
        setMessages((prev) => [...prev, {
          from: "ai",
          text: SAMPLE_QUESTIONS[nextIdx].q,
          name: "Meera · AI Interviewer",
        }]);
      } else {
        endInterview();
      }
    }, 2000);
  };

  const endInterview = () => {
    setEnded(true);
    const finalScore = 78;
    setScore(finalScore);

    let current = 0;
    const step = Math.ceil(finalScore / 30);
    const interval = setInterval(() => {
      current += 1;
      setCountUp(current);
      if (current >= finalScore) {
        clearInterval(interval);
        setCountUp(finalScore);
      }
    }, 40);
  };

  return (
    <div className="h-screen flex flex-col bg-paper dark:bg-ink overflow-hidden">
      {/* Header */}
      <header className="h-[52px] border-b border-rule-light dark:border-rule bg-paper/95 dark:bg-ink/95 shrink-0 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button disabled={started && !ended} className="btn-icon" onClick={() => router.push("/dashboard")}><ArrowLeft size={16} /></button>
          <span className="badge-interview">TECHNICAL</span>
          <span className="font-body text-sm text-ink-ghost dark:text-ghost hidden sm:inline">MERN Stack Developer</span>
        </div>
        <div className="flex items-center gap-4">
          {started && !ended && (
            <>
              <span className="font-display text-xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 20, "wght" 600' }}>
                {fmtTimer(timer)}
              </span>
              <span className="font-mono text-xs text-ink-ghost dark:text-ghost hidden sm:inline">Question {questionIndex + 1} of {SAMPLE_QUESTIONS.length}</span>
            </>
          )}
          <ThemeToggle variant="icon" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 md:px-6 overflow-hidden">
        {!started ? (
          /* Pre-interview */
          <div className="flex-1 flex items-center justify-center">
            <div className="card max-w-sm mx-auto p-8 text-center">
              <div className="w-10 h-10 rounded-full av-meera flex items-center justify-center text-sm font-bold text-white mx-auto mb-4">
                M
              </div>
              <h2 className="font-display text-base font-semibold text-ink-prose dark:text-prose mb-2">Your interviewer is ready.</h2>
              <p className="font-mono text-xs text-ink-ghost dark:text-ghost mb-1">Technical Interview · 8–12 questions · ~20 minutes</p>
              <p className="font-body text-sm text-ink-ghost dark:text-ghost mb-6">Take a breath. Answer clearly. Think out loud.</p>
              <button onClick={startInterview} className="btn-primary w-full text-sm">Begin Interview <ChevronRight size={14} /></button>
            </div>
          </div>
        ) : ended ? (
          /* Score reveal */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="font-display text-[120px] leading-none text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 120, "wght" 600' }}>
                {countUp}
              </div>
              <p className="font-body text-lg text-ink-prose-2 dark:text-prose-2 mt-2">/ 100</p>
              <p className="font-mono text-sm text-go mt-3 animate-xp-rise">+120 XP</p>
              <div className="card p-6 mt-8 text-left">
                <div className="section-title mb-4">Performance Breakdown</div>
                <div className="space-y-3">
                  {Object.entries(dimensions).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-body text-xs text-ink-prose-2 dark:text-prose-2">{DIMENSION_LABELS[key]}</span>
                        <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{val}%</span>
                      </div>
                      <div className="h-0.5 bg-rule-light dark:bg-rule">
                        <div className={`h-full w-[${val}%] ${val >= 80 ? "bg-go" : val >= 60 ? "bg-caution" : "bg-stop"}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card mt-4 p-4">
                  <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 leading-relaxed">
                    Strong technical knowledge with good problem-solving approach. Consider structuring your answers more clearly — use the STAR method for behavioral questions.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-center">
                <button onClick={() => router.push("/dashboard")} className="btn-secondary text-sm">Back to dashboard</button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat area */
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.from === "user" ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[65%] ${msg.from === "user" ? "" : ""}`}>
                  {msg.from === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full av-meera flex items-center justify-center text-2xs font-bold text-white">M</div>
                      <span className="font-mono text-xs text-ink-ghost dark:text-ghost">{msg.name}</span>
                    </div>
                  )}
                  <div className={msg.from === "user"
                    ? "bg-signal text-white px-4 py-3 rounded-md font-body text-sm"
                    : "bg-card dark:bg-sheet border border-rule-light dark:border-rule px-4 py-3 rounded-md font-body text-sm text-ink-prose dark:text-prose"
                  }>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full av-meera flex items-center justify-center text-2xs font-bold text-white">M</div>
                <div className="bg-card dark:bg-sheet border border-rule-light dark:border-rule px-4 py-3 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-1" />
                  <span className="w-1.5 h-1.5 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-2" />
                  <span className="w-1.5 h-1.5 bg-ink-ghost dark:bg-ghost rounded-full animate-dot-3" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      {started && !ended && (
        <div className="border-t border-rule-light dark:border-rule bg-paper dark:bg-ink px-4 md:px-6 py-3 shrink-0">
          <div className="max-w-2xl mx-auto flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your answer... (Ctrl+Enter to send)"
              rows={1}
              className="input resize-none min-h-[44px] max-h-[120px] font-body text-sm py-2.5"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-icon h-[44px] w-[44px] shrink-0">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
