"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase, MapPin, Clock, Filter, Search, CheckCircle,
  ChevronRight, Building, GraduationCap, Code, Palette,
  BarChart3, Users, Star
} from "lucide-react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const DOMAIN_OPTIONS = [
  { value: "", label: "All Domains", icon: Briefcase },
  { value: "tech", label: "Technology", icon: Code },
  { value: "design", label: "Design", icon: Palette },
  { value: "data", label: "Data", icon: BarChart3 },
  { value: "hr", label: "HR & Operations", icon: Users },
];

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Any Level" },
  { value: "easy", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "hard", label: "Advanced" },
];

function VacancyCard({ vacancy, onApply }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:card-hover transition-all"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-signal/10 flex items-center justify-center">
              <Briefcase size={20} className="text-signal" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-prose text-sm">{vacancy.name}</h4>
              <p className="text-xs text-ghost flex items-center gap-1">
                <Building size={12} /> {vacancy.company}
              </p>
            </div>
          </div>
          <span className={`badge ${vacancy.difficulty_level === "hard" ? "badge-hard" : vacancy.difficulty_level === "intermediate" ? "badge-medium" : "badge-easy"}`}>
            {vacancy.difficulty_level}
          </span>
        </div>

        <p className="text-sm text-prose-2 mb-3 line-clamp-2">{vacancy.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge badge-active">{vacancy.domain}</span>
          {vacancy.salary_range && (
            <span className="badge badge-success">{vacancy.salary_range}</span>
          )}
        </div>

        {vacancy.requirements && (
          <div className="text-xs text-ghost mb-4">
            <strong className="text-prose-2">Requirements:</strong> {vacancy.requirements}
          </div>
        )}

        <div className="flex items-center gap-2">
          {vacancy.has_applied ? (
            <button
              disabled
              className="btn-ghost text-sm py-2 flex-1 text-go cursor-not-allowed"
            >
              <CheckCircle size={14} /> Applied
            </button>
          ) : (
            <button
              onClick={() => onApply(vacancy)}
              className="btn-primary text-sm py-2 flex-1"
            >
              Apply Now <ChevronRight size={14} />
            </button>
          )}
          <span className="text-2xs text-ghost font-mono">Full-time · Remote</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function VacanciesPage() {
  const [loading, setLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);
  const [domainFilter, setDomainFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadVacancies();
  }, [domainFilter, difficultyFilter, searchQuery]);

  async function loadVacancies() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (domainFilter) params.set("domain", domainFilter);
      if (difficultyFilter) params.set("difficulty", difficultyFilter);
      if (searchQuery) params.set("search", searchQuery);
      const qs = params.toString();
      const result = await api.get(`/simulations/vacancies${qs ? `?${qs}` : ""}`);
      setVacancies(result);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function openApply(vacancy) {
    setSelectedVacancy(vacancy);
    setCoverNote("");
    setShowApplyModal(true);
  }

  async function handleApply() {
    if (!selectedVacancy) return;
    setApplying(true);
    try {
      await api.post("/simulations/vacancies/apply", {
        career_track_id: selectedVacancy.id,
        cover_note: coverNote,
      });
      showToast("Application submitted!", "success");
      setShowApplyModal(false);
      setSelectedVacancy(null);
      loadVacancies();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setApplying(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-prose flex items-center gap-2">
            <Briefcase size={24} className="text-signal" /> Vacancies
          </h1>
          <p className="text-sm text-ghost mt-1">Browse open positions and start your simulation.</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-ghost">
              <Filter size={14} /> Filters:
            </div>

            {/* Domain filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDomainFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    domainFilter === opt.value
                      ? "bg-signal text-white"
                      : "bg-sheet-2 text-ghost hover:text-prose border border-rule"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Difficulty filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input text-xs py-1.5 w-auto min-w-[130px]"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input text-xs py-1.5 pl-8"
              />
            </div>
          </div>
        </div>

        {/* Vacancy grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="skeleton h-5 w-40 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : vacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} onApply={openApply} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <Briefcase size={40} className="text-ghost mx-auto mb-4" />
            <h3 className="font-display font-semibold text-prose mb-2">No vacancies found</h3>
            <p className="text-ghost text-sm mb-4">Try adjusting your filters.</p>
            <button
              onClick={() => { setDomainFilter(""); setDifficultyFilter(""); setSearchQuery(""); }}
              className="btn-outline text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Apply Modal */}
        {showApplyModal && selectedVacancy && (
          <div className="fixed inset-0 bg-scrim backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowApplyModal(false)}>
            <div className="card max-w-md w-full shadow-float animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-prose">Apply for Position</h3>
                <button onClick={() => setShowApplyModal(false)} className="text-ghost hover:text-prose text-xl leading-none p-1">&times;</button>
              </div>
              <div className="mb-4">
                <h4 className="font-display font-semibold text-prose">{selectedVacancy.name}</h4>
                <p className="text-sm text-ghost">{selectedVacancy.company}</p>
              </div>
              <label className="block text-sm text-prose-2 mb-1.5">Cover Note (optional)</label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Why are you interested in this position?"
                className="input min-h-[120px] resize-y mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowApplyModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={handleApply} disabled={applying} className="btn-primary flex-1">
                  {applying ? "Applying..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
