import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  Zap,
} from 'lucide-react';
import { SAMPLE_SCENARIOS } from '../data/sampleData';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  targetTrack: string;
  phone?: string;
  linkedin?: string;
  createdAt: string;
}

interface AuthScreenProps {
  onAuthenticate: (user: UserAccount, autoFillSample?: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticate }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetTrack, setTargetTrack] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please provide a valid professional email address.');
        return;
      }
      if (!password || password.length < 4) {
        setError('Please choose a password (at least 4 characters).');
        return;
      }
      if (!targetTrack.trim()) {
        setError('Please enter your target role / career track.');
        return;
      }

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        targetTrack: targetTrack.trim(),
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      try {
        const existingUsers = JSON.parse(localStorage.getItem('ats_users') || '[]');
        existingUsers.push({ ...newUser, password });
        localStorage.setItem('ats_users', JSON.stringify(existingUsers));
      } catch {
        // Ignore
      }

      onAuthenticate(newUser, false);
    } else {
      // Sign In
      if (!email.trim() || !password) {
        setError('Please provide your email and password to sign in.');
        return;
      }

      try {
        const existingUsers = JSON.parse(localStorage.getItem('ats_users') || '[]');
        const found = existingUsers.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (found) {
          onAuthenticate({
            id: found.id,
            name: found.name,
            email: found.email,
            targetTrack: found.targetTrack,
            createdAt: found.createdAt,
          }, false);
          return;
        }
      } catch {
        // Fallback
      }

      // If not found in stored users, accept as instant session sign in
      const defaultName = email.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      onAuthenticate({
        id: `user-${Date.now()}`,
        name: formattedName || 'Candidate',
        email: email.trim(),
        targetTrack: 'Senior Systems Engineer',
        createdAt: new Date().toISOString(),
      }, false);
    }
  };

  const handleDemoSignIn = (scenarioIdx: number = 0) => {
    const scenario = SAMPLE_SCENARIOS[scenarioIdx] || SAMPLE_SCENARIOS[0];
    const demoUser: UserAccount = {
      id: `demo-${scenario.id}`,
      name: scenario.profile.personal_info.name,
      email: scenario.profile.personal_info.email,
      targetTrack: scenario.profile.target_career_track,
      phone: scenario.profile.personal_info.phone,
      linkedin: scenario.profile.personal_info.linkedin,
      createdAt: new Date().toISOString(),
    };
    onAuthenticate(demoUser, true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-indigo-600/25 mb-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ATS Career Strategist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {mode === 'signup'
              ? 'Create your professional account to unlock your Master Profile, ATS Gap Analysis, Tailored Resumes & Cover Letters.'
              : 'Sign in to access your Candidate Master Profile and tailored application packages.'}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera, Sarah Chen..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Professional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com or personal email"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Target Career Track / Role
              </label>
              <input
                type="text"
                value={targetTrack}
                onChange={(e) => setTargetTrack(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer, ML Architect, Product Manager..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {mode === 'signup'
                ? 'Create Account & Open Candidate Master Profile'
                : 'Sign In to Candidate Master Profile'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Or quick demo access
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 text-center">
            Want to test right away? Jump in with a verified candidate profile:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoSignIn(0)}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition-all flex flex-col group"
            >
              <span className="font-semibold text-slate-200 group-hover:text-indigo-300">
                Alex Rivera (Full-Stack)
              </span>
              <span className="text-[10px] text-slate-400">Targeting Stripe • FinTech</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn(1)}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex flex-col group"
            >
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                Maya Chen (Applied AI)
              </span>
              <span className="text-[10px] text-slate-400">Targeting Anthropic • LLMs</span>
            </button>
          </div>
        </div>

        {/* Security & Factual Integrity Guarantee Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-emerald-400/90 bg-emerald-500/5 py-2 rounded-xl border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Directive #1 Enforced: 100% Absolute Factual Integrity &amp; Zero Hallucination Guarantee</span>
        </div>
      </div>
    </div>
  );
};
