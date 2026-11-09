import React from 'react';
import { Target, Building2, Briefcase, Sparkles, FileSearch, Trash2, Clipboard } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  onChangeJobDescription: (jd: string) => void;
  targetRole: string;
  onChangeTargetRole: (role: string) => void;
  companyName: string;
  onChangeCompanyName: (company: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  onChangeJobDescription,
  targetRole,
  onChangeTargetRole,
  companyName,
  onChangeCompanyName,
  onAnalyze,
  isLoading,
}) => {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const charCount = jobDescription.length;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChangeJobDescription(text);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Target className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">2. Target Job Description</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste the raw job posting. The engine evaluates semantic overlap and extracts missing keywords.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {wordCount} words • {charCount} chars
          </span>
        </div>
      </div>

      {/* Target Meta Inputs */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Target Job Title / Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => onChangeTargetRole(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="e.g. Staff Distributed Systems Engineer"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Target Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onChangeCompanyName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            placeholder="e.g. Stripe, Anthropic, Datadog..."
          />
        </div>
      </div>

      {/* Main Textarea */}
      <div className="mt-4 flex-1 flex flex-col relative min-h-[360px]">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Job Description Text (Requirements, Responsibilities, Tech Stack):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3 h-3" />
              <span>Paste</span>
            </button>
            {jobDescription && (
              <button
                type="button"
                onClick={() => onChangeJobDescription('')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Clear job description"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => onChangeJobDescription(e.target.value)}
          rows={14}
          className="flex-1 w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none font-sans"
          placeholder="Paste full job posting here (e.g. responsibilities, minimum qualifications, preferred qualifications, tech requirements)..."
        />

        {/* Action Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading || !jobDescription.trim()}
            className="w-full group relative overflow-hidden py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Running ATS Optimization Engine (Objective Gap Analysis)...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
                <span>Execute ATS Analysis &amp; Generate Tailored Package</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-500">
            <span>✓ ATS Compatibility Score (0-100%)</span>
            <span>•</span>
            <span>✓ Top 5 Missing Keywords</span>
            <span>•</span>
            <span>✓ Tailored Resume</span>
            <span>•</span>
            <span>✓ Targeted Cover Letter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
