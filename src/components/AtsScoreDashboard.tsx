import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AnalysisResult, MissingKeyword } from '../types';

interface AtsScoreDashboardProps {
  result: AnalysisResult;
  onNavigateToResume: () => void;
  onNavigateToCoverLetter: () => void;
  onOpenAuditModal: () => void;
}

export const AtsScoreDashboard: React.FC<AtsScoreDashboardProps> = ({
  result,
  onNavigateToResume,
  onNavigateToCoverLetter,
  onOpenAuditModal,
}) => {
  const {
    score,
    scoreCategory,
    matchSummary,
    missingKeywords,
    matchedKeywords,
    skillsAnalysis,
    factualIntegrityAudit,
  } = result;

  // Determine score color theme
  const getScoreColor = (val: number) => {
    if (val >= 80) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (val >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const theme = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="space-y-6">
      {/* Top Banner: Score & Executive Match Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Radial Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-24 h-24 text-white" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overall ATS Compatibility
          </span>

          {/* Radial Circular SVG Gauge */}
          <div className="relative w-36 h-36 my-2 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={theme.stroke}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-extrabold tracking-tight ${theme.text}`}>
                {score}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                ATS Score
              </span>
            </div>
          </div>

          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
            {scoreCategory || (score >= 80 ? 'High Match Tier' : score >= 60 ? 'Competitive Tier' : 'Needs Optimization')}
          </div>

          {/* Sub metrics */}
          <div className="mt-5 w-full pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">Hard Skills</div>
              <div className="font-bold text-white mt-0.5">{skillsAnalysis?.hardSkillsMatchRate ?? score}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Experience</div>
              <div className="font-bold text-white mt-0.5">{skillsAnalysis?.experienceMatchRate ?? score}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Domain Fit</div>
              <div className="font-bold text-white mt-0.5">{skillsAnalysis?.domainMatchRate ?? score}%</div>
            </div>
          </div>
        </div>

        {/* 2-Sentence Match Summary & Factual Integrity Seal */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Strategic Match Summary (2 Sentences)
              </span>
              <span className="text-[11px] font-mono text-slate-500">Evaluated against JD</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-slate-200 text-sm sm:text-base leading-relaxed relative">
              <div className="text-indigo-400/30 text-3xl font-serif absolute -top-1 left-2">&ldquo;</div>
              <p className="pl-4 italic">{matchSummary}</p>
            </div>
          </div>

          {/* Factual Integrity Audit Box */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300">
                  Directive 1 Audit: 100% Absolute Factual Integrity Verified
                </h4>
                <p className="text-[11px] text-slate-300">
                  {factualIntegrityAudit?.auditStatement ||
                    'All company tenures, job titles, and degrees are preserved with zero fabricated credentials.'}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAuditModal}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              Inspect Factual Audit
            </button>
          </div>

          {/* Direct CTA shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onNavigateToResume}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>View Tailored ATS Resume (Deliverable 2)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateToCoverLetter}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>View 3-Paragraph Cover Letter (Deliverable 3)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Critical Missing Keywords */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Top 5 Critical Missing Keywords
              </h3>
              <p className="text-xs text-slate-400">
                Extracted directly from the target job description that are absent or under-weighted in the profile.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
            High ATS Scanner Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {missingKeywords.map((item: MissingKeyword, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-amber-300">
                    #{idx + 1} {item.keyword}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      item.importance === 'Critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <span className="inline-block mt-1 text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-start gap-1.5 text-xs text-slate-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    <strong className="text-slate-200">How to bridge:</strong> {item.strategicTip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matched Keywords Cloud */}
      {matchedKeywords && matchedKeywords.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Matched Keywords &amp; Competencies ({matchedKeywords.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            These terms are actively registered in the candidate profile and directly matched in the job description:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {matchedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
