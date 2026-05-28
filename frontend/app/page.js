"use client";

import { useEffect } from "react";

const tracks = [
  { name: "MERN Stack Developer", desc: "Full-stack development with MongoDB, Express, React, Node.js", badge: "10 days", color: "info" },
  { name: "Frontend Developer", desc: "Modern frontend with React, TypeScript, and CSS architecture", badge: "10 days", color: "info" },
  { name: "UI/UX Designer", desc: "Design systems, user research, prototyping, and handoff", badge: "10 days", color: "info" },
  { name: "Data Analyst", desc: "SQL, Python, visualization, and business intelligence", badge: "10 days", color: "info" },
  { name: "Backend Developer", desc: "API design, databases, authentication, and system architecture", badge: "Coming Soon", color: "warning" },
  { name: "HR Executive", desc: "Recruitment, employee relations, performance management", badge: "Coming Soon", color: "warning" },
];

const plans = [
  { name: "Free", price: "₹0", features: ["1 simulation (7 days)", "Basic AI feedback", "No certificate", "Community access"] },
  { name: "Student Pro", price: "₹299", features: ["Unlimited simulations", "5 AI interviews/month", "Shadow Passport", "PDF performance report", "Priority support"], featured: true },
  { name: "Student Elite", price: "₹599", features: ["Everything in Pro", "Unlimited AI interviews", "Code sandbox environment", "Peer collaboration", "Career coaching calls"] },
];

const testimonials = [
  { text: "\"MentriQ Shadow gave me the confidence to walk into my first job. The AI feedback felt like having a senior developer review my code.\"", name: "Ananya S.", role: "MERN Stack Developer", initial: "A" },
  { text: "\"I used my Shadow Passport in interviews and recruiters were genuinely impressed. It's like having a portfolio of real work experience.\"", name: "Rahul K.", role: "Data Analyst", initial: "R" },
];

function FadeInSection({ children }) {
  const ref = useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("opacity-100", e.isIntersecting)),
      { threshold: 0.1 }
    );
    const el = document.getElementById("fade-" + Math.random());
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="opacity-0 translate-y-5 transition-all duration-700">{children}</div>;
}

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F5]">
      <nav className="flex items-center justify-between px-10 py-4 sticky top-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2.5 font-['Space_Grotesk'] font-bold text-lg">
          <span className="w-8 h-8 bg-gradient-to-br from-[#5B4EFF] to-[#00D4B4] rounded flex items-center justify-center text-sm">MQ</span>
          MentriQ Shadow
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-[#8888A0] text-sm font-medium hover:text-[#F0F0F5] transition-colors">How It Works</a>
          <a href="#tracks" className="text-[#8888A0] text-sm font-medium hover:text-[#F0F0F5] transition-colors">Tracks</a>
          <a href="#pricing" className="text-[#8888A0] text-sm font-medium hover:text-[#F0F0F5] transition-colors">Pricing</a>
          <a href="#testimonials" className="text-[#8888A0] text-sm font-medium hover:text-[#F0F0F5] transition-colors">Testimonials</a>
        </div>
        <a href="/login" className="btn btn-primary">Get Started</a>
      </nav>

      <section className="text-center px-10 pt-32 pb-20 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-['Space_Grotesk'] font-bold mb-6 bg-gradient-to-r from-[#F0F0F5] to-[#5B4EFF] bg-clip-text text-transparent leading-tight">
          Experience the Job Before Getting the Job.
        </h1>
        <p className="text-lg text-[#8888A0] mb-10 max-w-2xl mx-auto">
          AI-powered career simulations that let you work real tasks, get expert feedback, and build a verifiable track record — before you ever apply.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/login" className="btn btn-primary btn-lg">Start Your Free Simulation</a>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">See How It Works</a>
        </div>
      </section>

      <section id="how-it-works" className="px-10 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold mb-4">How It Works</h2>
          <p className="text-[#8888A0]">Three simple steps to get real work experience from day one.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "1", title: "Choose Your Track", desc: "Pick from real career paths — MERN Stack, UI/UX Design, Data Analysis, and more." },
            { num: "2", title: "Work Real Tasks", desc: "Get assigned actual workplace tasks with AI-generated context, deadlines, and team interactions." },
            { num: "3", title: "Get Reviewed & Level Up", desc: "Receive detailed AI feedback, earn XP and badges, and build your Shadow Passport." },
          ].map((s, i) => (
            <div key={i} className="fade-in bg-[#13131A] border border-white/5 rounded-xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#5B4EFF] flex items-center justify-center mx-auto mb-4 font-bold text-xl">{s.num}</div>
              <h4 className="font-['Space_Grotesk'] font-bold text-xl mb-3">{s.title}</h4>
              <p className="text-[#8888A0] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tracks" className="px-10 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold mb-4">Career Tracks</h2>
          <p className="text-[#8888A0]">Choose from a growing library of industry-aligned career simulations.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {tracks.map((t, i) => (
            <div key={i} className="fade-in bg-[#13131A] border border-white/5 rounded-xl p-6">
              <h4 className="font-['Space_Grotesk'] font-bold text-lg mb-2">{t.name}</h4>
              <p className="text-[#8888A0] text-sm mb-4">{t.desc}</p>
              <span className={`badge badge-${t.color}`}>{t.badge}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="px-10 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold mb-4">Simple Pricing</h2>
          <p className="text-[#8888A0]">Start free. Upgrade when you&apos;re ready to go further.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div key={i} className={`fade-in bg-[#13131A] border ${p.featured ? "border-[#5B4EFF] shadow-[0_0_20px_rgba(91,78,255,0.3)]" : "border-white/5"} rounded-2xl p-8 flex flex-col gap-4`}>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl">{p.name}</h3>
              <div className="text-4xl font-['Space_Grotesk'] font-bold">{p.price}<span className="text-lg text-[#8888A0] font-normal">/month</span></div>
              <ul className="flex flex-col gap-3 flex-1">
                {p.features.map((f, j) => <li key={j} className="text-sm text-[#8888A0] pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#00D4B4]">{f}</li>)}
              </ul>
              <a href="/login" className={`btn ${p.featured ? "btn-primary" : "btn-secondary"} mt-auto`}>Get Started</a>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="px-10 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-['Space_Grotesk'] font-bold mb-4">What Students Say</h2>
          <p className="text-[#8888A0]">Hear from students who transformed their career readiness.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="fade-in bg-[#13131A] border border-white/5 rounded-xl p-6">
              <p className="italic text-[#8888A0] mb-4 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5B4EFF] flex items-center justify-center font-semibold text-sm">{t.initial}</div>
                <div>
                  <strong className="text-sm">{t.name}</strong>
                  <span className="block text-xs text-[#8888A0]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 border-t border-white/5">
        <div className="flex gap-6 justify-center mb-4">
          <a href="#how-it-works" className="text-[#8888A0] text-sm hover:text-[#F0F0F5] transition-colors">How It Works</a>
          <a href="#tracks" className="text-[#8888A0] text-sm hover:text-[#F0F0F5] transition-colors">Tracks</a>
          <a href="#pricing" className="text-[#8888A0] text-sm hover:text-[#F0F0F5] transition-colors">Pricing</a>
          <a href="#testimonials" className="text-[#8888A0] text-sm hover:text-[#F0F0F5] transition-colors">Testimonials</a>
        </div>
        <p className="text-[#8888A0] text-xs">&copy; 2025 MentriQ Shadow. All rights reserved.</p>
      </footer>
    </div>
  );
}
