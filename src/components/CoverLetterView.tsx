import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Eye,
  Code2,
  Building2,
  Calendar,
} from 'lucide-react';
import { CoverLetter, MasterProfile } from '../types';

interface CoverLetterViewProps {
  coverLetter: CoverLetter;
  originalProfile: MasterProfile;
  companyName: string;
  targetRole: string;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  coverLetter,
  originalProfile,
  companyName,
  targetRole,
}) => {
  const [viewMode, setViewMode] = useState<'letterhead' | 'markdown'>('letterhead');
  const [copied, setCopied] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const fullLetterText = `${originalProfile.personal_info.name}
${originalProfile.personal_info.email} | ${originalProfile.personal_info.phone} | ${originalProfile.personal_info.linkedin}

${currentDate}

Hiring Manager / Recruiting Team
${companyName || 'Target Organization'}

${coverLetter.salutation || 'Dear Hiring Manager,'}

${coverLetter.paragraph1}

${coverLetter.paragraph2}

${coverLetter.paragraph3}

${coverLetter.signoff || 'Sincerely,'}
${originalProfile.personal_info.name}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    const filename = `${originalProfile.personal_info.name.replace(/\s+/g, '_')}_Cover_Letter_${(companyName || 'Target').replace(/\s+/g, '_')}.${format}`;
    const blob = new Blob([format === 'md' ? coverLetter.rawMarkdown || fullLetterText : fullLetterText], {
      type: format === 'md' ? 'text/markdown' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('letterhead')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'letterhead'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Letterhead Preview</span>
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

          <span className="text-xs text-slate-400 hidden sm:inline">
            3-Paragraph Direct-to-Company Architecture
          </span>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Letter!' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={() => handleDownload('md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.md</span>
          </button>

          <button
            onClick={() => handleDownload('txt')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.txt</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'markdown' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-5 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {coverLetter.rawMarkdown || fullLetterText}
          </pre>
        </div>
      ) : (
        /* Formatted Letterhead View */
        <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-14 shadow-2xl border border-slate-200 max-w-4xl mx-auto font-sans leading-relaxed print-document">
          {/* Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {originalProfile.personal_info.name}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {originalProfile.target_career_track}
              </p>
            </div>
            <div className="text-xs text-slate-600 sm:text-right space-y-0.5">
              <div>{originalProfile.personal_info.email}</div>
              <div>{originalProfile.personal_info.phone}</div>
              {originalProfile.personal_info.linkedin && (
                <div>{originalProfile.personal_info.linkedin}</div>
              )}
            </div>
          </div>

          {/* Date & Recipient */}
          <div className="mb-6 space-y-1 text-xs text-slate-700">
            <div className="font-medium text-slate-800 mb-3">{currentDate}</div>
            <div className="font-semibold text-slate-900">Hiring Manager / Recruiting Team</div>
            <div className="font-bold text-slate-900 text-sm">{companyName || 'Target Organization'}</div>
            <div className="text-slate-600">Re: Application for {targetRole || 'Target Role'}</div>
          </div>

          {/* Salutation */}
          <div className="text-xs font-semibold text-slate-900 mb-4">
            {coverLetter.salutation || `Dear Hiring Team at ${companyName || 'the Organization'},`}
          </div>

          {/* 3 Structural Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
            {/* Paragraph 1 */}
            <p className="relative">
              {coverLetter.paragraph1}
            </p>

            {/* Paragraph 2 */}
            <p className="relative">
              {coverLetter.paragraph2}
            </p>

            {/* Paragraph 3 */}
            <p className="relative">
              {coverLetter.paragraph3}
            </p>
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-4 text-xs text-slate-800 space-y-3">
            <div>{coverLetter.signoff || 'Sincerely,'}</div>
            <div className="font-bold text-sm text-slate-900 pt-2">
              {originalProfile.personal_info.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
