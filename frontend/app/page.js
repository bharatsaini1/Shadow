"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, X, Check, ChevronRight, Menu, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const TIMELINE_STEPS = [
  {
    num: "01",
    title: "Choose your track",
    desc: "Pick from MERN, Data Analysis, UI/UX, and more. Each track is designed by industry professionals to mirror real job roles.",
  },
  {
    num: "02",
    title: "Work real tasks",
    desc: "Get assigned tasks with deadlines, team context, and client expectations. Submit your work just like you would at a real company.",
  },
  {
    num: "03",
    title: "Get reviewed and grow",
    desc: "AI-powered reviews give you detailed scores, senior-level feedback, and actionable next steps. Build your Shadow Passport with every task.",
  },
];

const CAREER_TRACKS = [
  { name: "MERN Stack Developer", status: "Live", badge: "badge-live" },
  { name: "Data Analyst", status: "Live", badge: "badge-live" },
  { name: "UI/UX Designer", status: "V2", badge: "badge-neutral" },
  { name: "Frontend Developer", status: "V2", badge: "badge-neutral" },
  { name: "Backend Developer", status: "V3", badge: "badge-neutral" },
  { name: "HR Executive", status: "V3", badge: "badge-neutral" },
];

const PLANS = [
  {
    name: "Free",
    price: { monthly: "₹0", yearly: "₹0" },
    period: "/month",
    features: ["1 active simulation", "Basic AI review", "Shadow Passport", "Community access"],
    cta: "Get started",
    ctaClass: "btn-secondary",
    popular: false,
  },
  {
    name: "Student Pro",
    price: { monthly: "₹299", yearly: "₹2,999" },
    period: "/month",
    features: ["5 active simulations", "Detailed AI review", "Priority support", "Interview practice", "Certificate of completion"],
    cta: "Start free trial",
    ctaClass: "btn-primary",
    popular: true,
  },
  {
    name: "Student Elite",
    price: { monthly: "₹599", yearly: "₹5,999" },
    period: "/month",
    features: ["Unlimited simulations", "Premium AI review", "1:1 mentor sessions", "Resume review", "Mock interviews", "Priority job referrals"],
    cta: "Get started",
    ctaClass: "btn-secondary",
    popular: false,
  },
];

function NavLink({ href, children, className }) {
  return (
    <a href={href} className={`font-body text-sm text-ink-prose-2 dark:text-prose-2 hover:text-ink-prose dark:hover:text-prose transition-colors no-underline ${className || ""}`}>
      {children}
    </a>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [billing, setBilling] = useState("monthly");
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-ink text-ink-prose dark:text-prose">
      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-[52px] z-50 bg-paper/90 dark:bg-ink/90 backdrop-blur-md border-b border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-sm bg-signal/10 dark:bg-signal/15 flex items-center justify-center text-xs font-bold text-signal shrink-0">MS</span>
            <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose">MentriQ Shadow</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#tracks">Tracks</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <ThemeToggle variant="segmented" />
            <button onClick={() => router.push("/login")} className="btn-ghost text-sm">Sign In</button>
            <button onClick={() => router.push("/login")} className="btn-primary text-sm">Get started</button>
          </div>

          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="btn-icon md:hidden">
            <Menu size={16} />
          </button>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden bg-paper dark:bg-ink border-b border-rule-light dark:border-rule px-6 py-4 flex flex-col gap-3">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#tracks">Tracks</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <ThemeToggle variant="segmented" />
            <button onClick={() => router.push("/login")} className="btn-ghost text-sm text-left">Sign In</button>
            <button onClick={() => router.push("/login")} className="btn-primary text-sm">Get started</button>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="min-h-screen pt-[52px] graph-bg">
        <div className="max-w-[1200px] mx-auto px-6 h-[calc(100vh-52px)] grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-xs text-ink-ghost dark:text-ghost mb-6">
              v1.0 — MERN Stack Track Now Live
            </p>
            <h1 className="font-display text-[64px] md:text-[76px] leading-none tracking-tight text-ink-prose dark:text-prose"
                style={{ fontVariationSettings: '"opsz" 72, "wght" 700' }}>
              Get the job.
              <br />
              Do it <span className="italic">first</span>.
            </h1>
            <p className="font-body text-[17px] text-ink-prose-2 dark:text-prose-2 mt-6 max-w-[440px] leading-relaxed">
              MentriQ Shadow puts you inside a real company. Complete AI-assigned tasks, get reviewed, practice interviews — before your first job.
            </p>
            <div className="flex items-center gap-4 mt-10">
              <button onClick={() => router.push("/login")} className="btn-primary">
                Apply for free simulation <ArrowRight size={14} />
              </button>
              <a href="#how-it-works" className="link-warm font-body text-sm">See how it works</a>
            </div>
            <p className="font-mono text-xs text-ink-ghost dark:text-ghost mt-6">
              2,400 students · 14 career tracks · avg. score 71/100
            </p>
          </div>

          <div className="col-span-12 md:col-span-5 hidden md:block">
            <div className="card shadow-float-light dark:shadow-float">
              <div className="bg-paper-2 dark:bg-sheet-2 border-b border-rule-light dark:border-rule px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs text-ink-ghost dark:text-ghost">task_019 · MERN · Day 3</span>
                <span className="badge-hard">HARD</span>
              </div>
              <div className="px-4 py-4 space-y-3">
                <h3 className="font-body text-base font-semibold text-ink-prose dark:text-prose">Fix the JWT refresh token vulnerability</h3>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-stop" />
                  <span className="timer-danger">01:47:22 remaining</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full av-priya flex items-center justify-center text-2xs font-bold text-white">P</span>
                  <span className="font-body text-xs text-ink-prose-2 dark:text-prose-2">Priya · Team Lead</span>
                </div>
                <div className="border-l-2 border-rule-light dark:border-rule pl-3 font-body text-sm text-ink-ghost dark:text-ghost italic">
                  &ldquo;The client flagged this in the standup. Priority alpha — fix before EOD.&rdquo;
                </div>
              </div>
              <div className="bg-paper-2 dark:bg-sheet-2 border-t border-rule-light dark:border-rule px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs text-ink-ghost dark:text-ghost">40% reviewed</span>
                <div className="w-20 h-px bg-rule-light dark:bg-rule">
                  <div className="h-full w-[40%] bg-go" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARADOX SECTION ──────────────────────────── */}
      <section ref={addSectionRef} className="animate-section py-24 border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto">
            <div className="col-span-12 md:col-span-3">
              <div className="font-display text-7xl text-ink-dim dark:text-dim" style={{ fontVariationSettings: '"opsz" 72, "wght" 400' }}>
                95%
              </div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-display text-4xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 36, "wght" 600' }}>
                of freshers get rejected before they get a chance.
              </h2>
              <p className="font-body text-base text-ink-prose-2 dark:text-prose-2 mt-4 max-w-xl leading-relaxed">
                Companies want experienced hires. Freshers need experience to get hired. MentriQ Shadow is the bridge — a full simulation of the real work environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTRAST SECTION ─────────────────────────── */}
      <section ref={addSectionRef} className="animate-section py-24 border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="card max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule-light dark:divide-rule">
            <div className="p-6 md:p-8">
              <div className="section-title text-ink-ghost dark:text-ghost mb-4">The old way</div>
              <div className="space-y-3">
                {["Watch lecture → take quiz", "Get certificate of completion", "Apply with 0 experience", "Get auto-rejected"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <X size={14} className="text-stop shrink-0" />
                    <span className="font-body text-sm text-ink-ghost dark:text-ghost line-through">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="section-title text-go mb-4">MentriQ Shadow</div>
              <div className="space-y-3">
                {["Work a real task → get AI-reviewed", "Earn a verifiable Shadow Passport", "Apply with documented performance data", "Get noticed"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-go shrink-0" />
                    <span className="font-body text-sm text-ink-prose dark:text-prose">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" ref={addSectionRef} className="animate-section py-24 border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl text-ink-prose dark:text-prose mb-12" style={{ fontVariationSettings: '"opsz" 36, "wght" 600' }}>
              Three steps. Real work.
            </h2>
            <div className="border-l-2 border-rule-light dark:border-rule pl-8 space-y-10">
              {TIMELINE_STEPS.map((step) => (
                <div key={step.num} className="relative">
                  <div className="absolute -left-[37px] top-1 w-2 h-2 bg-signal rounded-full" />
                  <div className="font-mono text-xs text-ink-ghost dark:text-ghost mb-1">{step.num} —</div>
                  <h3 className="font-body text-base font-semibold text-ink-prose dark:text-prose mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CAREER TRACKS ────────────────────────────── */}
      <section id="tracks" ref={addSectionRef} className="animate-section py-24 border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl text-ink-prose dark:text-prose mb-8" style={{ fontVariationSettings: '"opsz" 36, "wght" 600' }}>
              Career tracks
            </h2>
            <div className="border border-rule-light dark:border-rule rounded-md overflow-hidden">
              {CAREER_TRACKS.map((track) => (
                <div key={track.name} className="flex items-center justify-between px-5 py-3.5 border-b border-rule-light dark:border-rule last:border-0">
                  <div>
                    <div className="font-body text-sm font-medium text-ink-prose dark:text-prose">{track.name}</div>
                  </div>
                  <span className={track.badge}>{track.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="pricing" ref={addSectionRef} className="animate-section py-24 border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-4xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 36, "wght" 600' }}>
                Simple pricing
              </h2>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button onClick={() => setBilling("monthly")} className={`px-3 py-1.5 rounded-sm transition-colors ${billing === "monthly" ? "bg-card dark:bg-sheet-2 text-ink-prose dark:text-prose shadow-lift-light dark:shadow-lift" : "text-ink-ghost dark:text-ghost"}`}>
                  Monthly
                </button>
                <button onClick={() => setBilling("yearly")} className={`px-3 py-1.5 rounded-sm transition-colors ${billing === "yearly" ? "bg-card dark:bg-sheet-2 text-ink-prose dark:text-prose shadow-lift-light dark:shadow-lift" : "text-ink-ghost dark:text-ghost"}`}>
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`card p-6 ${plan.popular ? "md:py-8 relative border-signal/30" : ""}`}>
                  {plan.popular && <div className="h-0.5 bg-signal -mx-6 -mt-6 mb-4 rounded-t-md" />}
                  {plan.popular && <span className="badge-active mb-3">Popular</span>}
                  <h3 className="font-body text-base font-semibold text-ink-prose dark:text-prose mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-display text-4xl text-ink-prose dark:text-prose" style={{ fontVariationSettings: '"opsz" 36, "wght" 600' }}>
                      {plan.price[billing]}
                    </span>
                    <span className="font-body text-sm text-ink-ghost dark:text-ghost">{plan.period}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Check size={14} className="text-go shrink-0" />
                        <span className="font-body text-sm text-ink-prose-2 dark:text-prose-2">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push("/login")} className={`${plan.ctaClass} w-full text-sm`}>
                    {plan.cta} <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="card p-6 mt-6 flex items-center justify-between">
              <div>
                <div className="font-body text-sm font-semibold text-ink-prose dark:text-prose">College License</div>
                <div className="font-body text-sm text-ink-ghost dark:text-ghost mt-1">For institutions and training programs</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-ink-prose dark:text-prose">Custom pricing</span>
                <a href="#" className="link-warm font-body text-sm">Contact us <ChevronRight size={12} className="inline" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="bg-paper-2 dark:bg-sheet border-t border-rule-light dark:border-rule">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded-sm bg-signal/10 dark:bg-signal/15 flex items-center justify-center text-2xs font-bold text-signal">MS</span>
                <span className="font-body text-sm font-semibold text-ink-prose dark:text-prose">MentriQ Shadow</span>
              </div>
              <p className="font-body text-xs text-ink-ghost dark:text-ghost leading-relaxed">Experience the job before getting the job.</p>
            </div>
            <div>
              <div className="font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest mb-3">Product</div>
              <div className="space-y-2">
                <NavLink href="#how-it-works">How it works</NavLink>
                <NavLink href="#tracks">Tracks</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
              </div>
            </div>
            <div>
              <div className="font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest mb-3">Company</div>
              <div className="space-y-2">
                <NavLink href="#">About</NavLink>
                <NavLink href="#">Blog</NavLink>
                <NavLink href="#">Careers</NavLink>
              </div>
            </div>
            <div>
              <div className="font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest mb-3">Support</div>
              <div className="space-y-2">
                <NavLink href="#">Help Center</NavLink>
                <NavLink href="#">Documentation</NavLink>
                <NavLink href="#">Contact</NavLink>
              </div>
            </div>
          </div>
          <div className="border-t border-rule-light dark:border-rule pt-6 flex flex-col md:flex-row justify-between gap-2">
            <span className="font-mono text-xs text-ink-ghost dark:text-ghost">© 2025 MentriQ Shadow</span>
            <span className="font-mono text-xs text-ink-ghost dark:text-ghost">Built for India&apos;s next generation of developers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
