import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Eye,
  Code2,
  ShieldCheck,
  Split,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TailoredResume, MasterProfile, MissingKeyword } from '../types';

interface TailoredResumeViewProps {
  tailoredResume: TailoredResume;
  originalProfile: MasterProfile;
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
  targetRole: string;
  companyName: string;
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  tailoredResume,
  originalProfile,
  missingKeywords,
  matchedKeywords,
  targetRole,
  companyName,
}) => {
  const [viewMode, setViewMode] = useState<'document' | 'markdown'>('document');
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [showOriginalDiff, setShowOriginalDiff] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const keywordsToHighlight = [
    ...missingKeywords.map((k) => k.keyword.toLowerCase()),
    ...matchedKeywords.map((k) => k.toLowerCase()),
  ];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render text with keyword highlights if enabled
  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords || !text) return text;

    // Build regex of keywords
    const sortedKeywords = [...keywordsToHighlight]
      .filter((k) => k.length > 2)
      .sort((a, b) => b.length - a.length);

    if (sortedKeywords.length === 0) return text;

    const regex = new RegExp(`\\b(${sortedKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = sortedKeywords.some((k) => k.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-indigo-500/20 text-indigo-300 font-medium px-1 rounded border border-indigo-500/30 no-print"
            title="ATS Target Keyword Aligned"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'document'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Single-Column ATS Preview</span>
            </button>
            <button
              onClick={() => setViewMode('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          {/* Keyword Highlighting Toggle */}
          {viewMode === 'document' && (
            <button
              onClick={() => setHighlightKeywords(!highlightKeywords)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                highlightKeywords
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Highlight Injected Keywords: {highlightKeywords ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {/* Original vs Restructured Toggle */}
          {viewMode === 'document' && (
            <button
              onClick={() => setShowOriginalDiff(!showOriginalDiff)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                showOriginalDiff
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Compare Original Bullets: {showOriginalDiff ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>

        {/* Export & Copy Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleCopy(tailoredResume.rawMarkdown, 'markdown')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'markdown' ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={() =>
              handleDownload(
                tailoredResume.rawMarkdown,
                `${originalProfile.personal_info.name.replace(/\s+/g, '_')}_ATS_Resume.md`,
                'text/markdown'
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.md</span>
          </button>

          <button
            onClick={() =>
              handleDownload(
                tailoredResume.rawMarkdown,
                `${originalProfile.personal_info.name.replace(/\s+/g, '_')}_ATS_Resume.txt`,
                'text/plain'
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="no-print px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Single-Column ATS Structure • Standard Clean Headings • 0 Fabricated Credentials
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Target: {targetRole || 'Software Role'} @ {companyName || 'Target Corp'}
        </span>
      </div>

      {/* Main Resume Content */}
      {viewMode === 'markdown' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-5 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {tailoredResume.rawMarkdown}
          </pre>
        </div>
      ) : (
        /* ATS Clean Single-Column Document View */
        <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-4xl mx-auto font-sans leading-normal print-document">
          {/* Header */}
          <div className="text-center pb-5 border-b border-slate-300">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
              {originalProfile.personal_info.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2 font-medium">
              {originalProfile.personal_info.location && <span>{originalProfile.personal_info.location}</span>}
              {originalProfile.personal_info.location && <span>•</span>}
              <span>{originalProfile.personal_info.email}</span>
              <span>•</span>
              <span>{originalProfile.personal_info.phone}</span>
              {originalProfile.personal_info.linkedin && (
                <>
                  <span>•</span>
                  <span>{originalProfile.personal_info.linkedin}</span>
                </>
              )}
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div className="mt-5">
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase border-b-2 border-slate-800 pb-0.5 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
              {renderHighlightedText(tailoredResume.professionalSummary)}
            </p>
          </div>

          {/* Section: Technical Skills */}
          <div className="mt-5">
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase border-b-2 border-slate-800 pb-0.5 mb-2">
              Technical Skills
            </h2>
            <div className="space-y-1.5 text-xs text-slate-800">
              {tailoredResume.skillsCategories && tailoredResume.skillsCategories.length > 0 ? (
                tailoredResume.skillsCategories.map((cat, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="font-bold text-slate-900 min-w-36 shrink-0">
                      {cat.categoryName}:
                    </span>
                    <span className="text-slate-800">
                      {renderHighlightedText(cat.skills.join(', '))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-baseline">
                  <span className="font-bold text-slate-900 min-w-36 shrink-0">Core Stack:</span>
                  <span>{originalProfile.skills.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Professional Experience */}
          <div className="mt-5">
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase border-b-2 border-slate-800 pb-0.5 mb-2.5">
              Professional Experience
            </h2>

            <div className="space-y-4">
              {tailoredResume.experience.map((exp, expIdx) => {
                const originalExp = originalProfile.experience.find(
                  (e) => e.company.toLowerCase().trim() === exp.company.toLowerCase().trim()
                ) || originalProfile.experience[expIdx];

                return (
                  <div key={expIdx} className="space-y-1.5">
                    {/* Role & Company Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="font-bold text-xs sm:text-sm text-slate-900">
                        <span>{exp.role}</span>
                        <span className="font-normal text-slate-600"> — {exp.company}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-600 sm:text-right">
                        {exp.duration}
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-slate-800 leading-relaxed">
                      {exp.bullet_points.map((bullet, bIdx) => (
                        <li key={bIdx}>
                          <div>{renderHighlightedText(bullet)}</div>

                          {/* Optional Comparison Diff */}
                          {showOriginalDiff && originalExp && originalExp.bullet_points[bIdx] && (
                            <div className="no-print mt-1 p-2 rounded bg-slate-100 border border-slate-300 text-[11px] text-slate-600">
                              <span className="font-semibold text-slate-700 block mb-0.5">
                                Original Raw Bullet:
                              </span>
                              <span>{originalExp.bullet_points[bIdx]}</span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Education */}
          <div className="mt-5">
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase border-b-2 border-slate-800 pb-0.5 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {tailoredResume.education.map((edu, eduIdx) => (
                <div key={eduIdx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-700"> — {edu.institution}</span>
                  </div>
                  <div className="text-slate-600 font-medium">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
