import React from 'react';
import {
  ShieldCheck,
  History,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleData';
import { UserAccount } from './AuthScreen';

interface NavbarProps {
  currentUser: UserAccount | null;
  onSignOut: () => void;
  onSelectScenario: (scenario: SampleScenario) => void;
  onOpenDirectives: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSignOut,
  onSelectScenario,
  onOpenDirectives,
  onToggleHistory,
  historyCount,
}) => {
  const [scenarioDropdown, setScenarioDropdown] = React.useState(false);
  const [userDropdown, setUserDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                ATS Career Strategist
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO ENGINE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              ATS Optimization • Keyword Gap Analysis • 100% Factual Integrity
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Scenario Preset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setScenarioDropdown(!scenarioDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
              title="Load Pre-Built Candidate & Target Job Scenarios"
            >
              <span className="text-slate-400 hidden sm:inline">Load Scenario:</span>
              <span className="font-semibold text-indigo-400">Benchmarks</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {scenarioDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setScenarioDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Select Benchmark Scenario
                  </div>
                  {SAMPLE_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        onSelectScenario(scenario);
                        setScenarioDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200 group-hover:text-indigo-300">
                          {scenario.name.split('—')[0].trim()}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-indigo-950 group-hover:text-indigo-300">
                          {scenario.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">
                        Targeting {scenario.targetRole} @ {scenario.companyName}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Operational Directives Button */}
          <button
            onClick={onOpenDirectives}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition-colors"
            title="View the 3 Core Operational Directives"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directives</span>
          </button>

          {/* Saved History Drawer Toggle */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors"
            title="View Previous Analysis Runs"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-20 animate-in fade-in zoom-in-95 duration-150 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <div className="font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5 truncate">{currentUser.targetTrack}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-300 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch User</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
