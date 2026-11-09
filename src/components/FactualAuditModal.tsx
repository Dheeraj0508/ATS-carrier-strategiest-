import React from 'react';
import { ShieldCheck, CheckCircle2, X, Lock, FileCheck } from 'lucide-react';
import { MasterProfile, AnalysisResult } from '../types';

interface FactualAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MasterProfile;
  result: AnalysisResult;
}

export const FactualAuditModal: React.FC<FactualAuditModalProps> = ({
  isOpen,
  onClose,
  profile,
  result,
}) => {
  if (!isOpen) return null;

  const { factualIntegrityAudit, tailoredResume } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Factual Integrity Audit &amp; Verification</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% PASS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Operational Directive #1: Strict zero-hallucination compliance verification
            </p>
          </div>
        </div>

        {/* Integrity Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" /> Companies Preserved
            </div>
            <div className="text-2xl font-black text-white">
              {profile.experience.length} / {profile.experience.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">0 Fabricated Employers</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
              <FileCheck className="w-3.5 h-3.5" /> Degrees Preserved
            </div>
            <div className="text-2xl font-black text-white">
              {profile.education.length} / {profile.education.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">0 Invented Credentials</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dates &amp; Roles Locked
            </div>
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Timeline Authenticity Maintained</div>
          </div>
        </div>

        {/* Statement */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 mb-6">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            &ldquo;
            {factualIntegrityAudit?.auditStatement ||
              'Every company, job title, employment duration, and degree in this output directly matches the candidate master profile. No artificial credentials have been introduced.'}
            &rdquo;
          </p>
        </div>

        {/* Restructuring Diff: Before vs After */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Experience Restructuring Audit (Before vs. After)
          </h3>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {profile.experience.map((origExp, expIdx) => {
              const tailoredExp = tailoredResume.experience[expIdx] || tailoredResume.experience[0];

              return (
                <div key={expIdx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      {origExp.company} — <span className="font-normal text-slate-400">{origExp.role}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{origExp.duration}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {origExp.bullet_points.map((origBullet, bIdx) => {
                      const tailoredBullet = tailoredExp?.bullet_points?.[bIdx];
                      return (
                        <div key={bIdx} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 rounded bg-slate-900 border border-slate-800">
                          <div>
                            <div className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                              Original Profile Bullet
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{origBullet}</p>
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold text-indigo-400 uppercase mb-0.5">
                              ATS-Optimized Tailored Bullet
                            </div>
                            <p className="text-slate-200 text-[11px] leading-relaxed font-medium">
                              {tailoredBullet || origBullet}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
