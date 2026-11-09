/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Target,
  Award,
  Sparkles,
  Layers,
  Mail,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileCode,
  Lock,
  Unlock,
  UserCheck,
} from 'lucide-react';
import { MasterProfile, AnalysisResult, SavedAnalysisRecord } from './types';
import { SAMPLE_SCENARIOS, SampleScenario } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { AuthScreen, UserAccount } from './components/AuthScreen';
import { ProfileEditor } from './components/ProfileEditor';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { AtsScoreDashboard } from './components/AtsScoreDashboard';
import { TailoredResumeView } from './components/TailoredResumeView';
import { CoverLetterView } from './components/CoverLetterView';
import { DirectivesModal } from './components/DirectivesModal';
import { FactualAuditModal } from './components/FactualAuditModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { generateHeuristicAnalysis } from './utils/atsEngine';

export default function App() {
  const defaultScenario = SAMPLE_SCENARIOS[0];

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // Core profile & job description state
  const [profile, setProfile] = useState<MasterProfile>(defaultScenario.profile);
  const [jobDescription, setJobDescription] = useState<string>(defaultScenario.jobDescription);
  const [targetRole, setTargetRole] = useState<string>(defaultScenario.targetRole);
  const [companyName, setCompanyName] = useState<string>(defaultScenario.companyName);

  const [activeTab, setActiveTab] = useState<'editor' | 'score' | 'resume' | 'coverletter'>('editor');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // Modals & Drawers
  const [showDirectives, setShowDirectives] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [history, setHistory] = useState<SavedAnalysisRecord[]>([]);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ats_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      }
      const savedHistory = localStorage.getItem('ats_engine_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Ignore
    } finally {
      setAuthInitialized(true);
    }
  }, []);

  const handleAuthenticate = (user: UserAccount, autoFillSample: boolean = false) => {
    setCurrentUser(user);
    setShowWelcomeBanner(true);
    try {
      localStorage.setItem('ats_current_user', JSON.stringify(user));
    } catch {
      // Ignore
    }

    if (!autoFillSample) {
      // Update profile with user's registered name, email & target career track
      setProfile((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          name: user.name,
          email: user.email,
          phone: user.phone || prev.personal_info.phone,
          linkedin: user.linkedin || prev.personal_info.linkedin,
        },
        target_career_track: user.targetTrack || prev.target_career_track,
      }));
      setTargetRole(user.targetTrack || 'Senior Engineer');
    }

    // Always land the user on the Candidate Master Profile first!
    setActiveTab('editor');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setResult(null);
    setActiveTab('editor');
    try {
      localStorage.removeItem('ats_current_user');
    } catch {
      // Ignore
    }
  };

  const saveToHistory = (newResult: AnalysisResult) => {
    const record: SavedAnalysisRecord = {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      candidateName: profile.personal_info.name || currentUser?.name || 'Candidate',
      targetRole: targetRole || 'Target Role',
      companyName: companyName || 'Target Corp',
      score: newResult.score,
      profile,
      jobDescription,
      result: newResult,
    };

    const updated = [record, ...history.slice(0, 9)];
    setHistory(updated);
    try {
      localStorage.setItem('ats_engine_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ats_engine_history');
    } catch {
      // Ignore
    }
  };

  const handleSelectScenario = (scenario: SampleScenario) => {
    setProfile(scenario.profile);
    setJobDescription(scenario.jobDescription);
    setTargetRole(scenario.targetRole);
    setCompanyName(scenario.companyName);
    setError(null);
  };

  const handleSelectHistoryRecord = (record: SavedAnalysisRecord) => {
    setProfile(record.profile);
    setJobDescription(record.jobDescription);
    setTargetRole(record.targetRole);
    setCompanyName(record.companyName);
    setResult(record.result);
    setActiveTab('score');
  };

  // Run ATS analysis
  const executeAnalysis = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a target job description to evaluate.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let analysisData = null;

      try {
        const res = await fetch('/api/optimize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile,
            jobDescription,
            targetRole,
            companyName,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.data) {
            analysisData = data.data;
          }
        }
      } catch (networkErr) {
        console.warn('Backend optimize endpoint unreachable, utilizing client-side ATS engine:', networkErr);
      }

      // If backend was unreachable or returned non-ok, compute using client heuristic engine
      if (!analysisData) {
        analysisData = generateHeuristicAnalysis(profile, jobDescription, targetRole, companyName);
      }

      setResult(analysisData);
      saveToHistory(analysisData);
      // Once analyzed, show the full ATS analysis dashboard with direct unlock to resume & cover letter
      setActiveTab('score');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while evaluating the application.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not yet logged in / account not created, present Account Creation / Login Gate
  if (authInitialized && !currentUser) {
    return <AuthScreen onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSelectScenario={handleSelectScenario}
        onOpenDirectives={() => setShowDirectives(true)}
        onToggleHistory={() => setShowHistoryDrawer(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* User Welcome & Landing Notification */}
        {showWelcomeBanner && currentUser && (
          <div className="no-print p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Welcome, {currentUser.name}! You are on your Candidate Master Profile.</span>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold">
                    Step 1 Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review and customize your Master Profile and target Job Description. Once evaluated, your ATS Score, Tailored Resume, and Cover Letter options will fully unlock.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="text-xs text-slate-500 hover:text-slate-300 font-medium self-end sm:self-center"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Deliverables Navigation Tabs */}
        <div className="no-print flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
            {/* Tab: Editor / Input */}
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>1. Candidate Master Profile</span>
            </button>

            {/* Tab: Deliverable 1 - ATS Score & Gap Analysis */}
            <button
              onClick={() => {
                if (result) setActiveTab('score');
              }}
              disabled={!result}
              title={result ? 'View ATS Score & Missing Keywords Analysis' : 'Analyze your profile to unlock ATS Score'}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                !result
                  ? 'opacity-50 cursor-not-allowed text-slate-500'
                  : activeTab === 'score'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {result ? <Award className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5" />}
              <span>
                2. ATS Score &amp; Gap Analysis {result ? `(${result.score}%)` : ''}
              </span>
            </button>

            {/* Tab: Deliverable 2 - Tailored Resume */}
            <button
              onClick={() => {
                if (result) setActiveTab('resume');
              }}
              disabled={!result}
              title={result ? 'View and export tailored ATS resume' : 'Analyze your profile to unlock Resume Creation'}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                !result
                  ? 'opacity-50 cursor-not-allowed text-slate-500'
                  : activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {result ? <Layers className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5" />}
              <span>3. Tailored Resume Creation</span>
            </button>

            {/* Tab: Deliverable 3 - Targeted Cover Letter */}
            <button
              onClick={() => {
                if (result) setActiveTab('coverletter');
              }}
              disabled={!result}
              title={result ? 'View and export tailored cover letter' : 'Analyze your profile to unlock Cover Letter Creation'}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all ${
                !result
                  ? 'opacity-50 cursor-not-allowed text-slate-500'
                  : activeTab === 'coverletter'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {result ? <Mail className="w-3.5 h-3.5 text-indigo-400" /> : <Lock className="w-3.5 h-3.5" />}
              <span>4. Cover Letter Creation</span>
            </button>
          </div>

          {/* Quick Action / Status Callout */}
          <div className="flex items-center gap-3">
            {!result && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Lock className="w-3 h-3" />
                <span>Resume &amp; Cover Letter unlocked after ATS analysis</span>
              </span>
            )}
            {activeTab !== 'editor' && (
              <button
                onClick={() => setActiveTab('editor')}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Edit Profile or Change Job Description</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1 Content: Candidate Master Profile & Target Job Description */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Candidate Master Profile Panel */}
            <div className="lg:col-span-6 h-full">
              <ProfileEditor profile={profile} onChange={setProfile} />
            </div>

            {/* Target Job Description Panel */}
            <div className="lg:col-span-6 h-full">
              <JobDescriptionInput
                jobDescription={jobDescription}
                onChangeJobDescription={setJobDescription}
                targetRole={targetRole}
                onChangeTargetRole={setTargetRole}
                companyName={companyName}
                onChangeCompanyName={setCompanyName}
                onAnalyze={executeAnalysis}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Tab 2 Content: Deliverable 1 - ATS Score & Gap Analysis */}
        {activeTab === 'score' && result && (
          <AtsScoreDashboard
            result={result}
            onNavigateToResume={() => setActiveTab('resume')}
            onNavigateToCoverLetter={() => setActiveTab('coverletter')}
            onOpenAuditModal={() => setShowAuditModal(true)}
          />
        )}

        {/* Tab 3 Content: Deliverable 2 - Tailored Resume */}
        {activeTab === 'resume' && result && (
          <TailoredResumeView
            tailoredResume={result.tailoredResume}
            originalProfile={profile}
            missingKeywords={result.missingKeywords}
            matchedKeywords={result.matchedKeywords}
            targetRole={targetRole}
            companyName={companyName}
          />
        )}

        {/* Tab 4 Content: Deliverable 3 - Targeted Cover Letter */}
        {activeTab === 'coverletter' && result && (
          <CoverLetterView
            coverLetter={result.coverLetter}
            originalProfile={profile}
            companyName={companyName}
            targetRole={targetRole}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <DirectivesModal isOpen={showDirectives} onClose={() => setShowDirectives(false)} />

      {result && (
        <FactualAuditModal
          isOpen={showAuditModal}
          onClose={() => setShowAuditModal(false)}
          profile={profile}
          result={result}
        />
      )}

      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        records={history}
        onSelectRecord={handleSelectHistoryRecord}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
