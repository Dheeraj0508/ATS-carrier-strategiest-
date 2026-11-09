import React from 'react';
import { ShieldCheck, FileText, Target, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DirectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectivesModal: React.FC<DirectivesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Core Operational Directives</h2>
            <p className="text-xs text-slate-400">Our engine operates under strict career strategist guardrails</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Directive 1 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Absolute Factual Integrity</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Never fabricate or invent companies, employment dates, job titles, institutions, or educational degrees.
              The engine is strictly permitted only to restructure, rephrase, highlight, and optimize existing experiences
              from the candidate&apos;s parsed master profile.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Zero Hallucination Guarantee: All employment names, tenures, and credentials remain 100% authentic.</span>
            </div>
          </div>

          {/* Directive 2 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <FileText className="w-4 h-4 shrink-0" />
              <span>2. ATS Optimization &amp; Formatting</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ensure all generated resumes use a clean, single-column friendly structure with clear standard headings
              (<strong>Professional Summary</strong>, <strong>Technical Skills</strong>, <strong>Professional Experience</strong>, <strong>Education</strong>)
              and naturally integrate target keywords without awkward or penalty-inducing keyword stuffing.
            </p>
          </div>

          {/* Directive 3 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Target className="w-4 h-4 shrink-0" />
              <span>3. Tailored Alignment &amp; Value Hook</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Directly bridge the candidate&apos;s documented technical stack and accomplishments with the explicit pain points,
              tools, and operational requirements mentioned in the target job description. The 3-paragraph cover letter
              immediately contextualizes the candidate&apos;s actual hands-on background to the hiring team.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            Acknowledge &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
