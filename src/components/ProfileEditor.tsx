import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Code2,
  Sliders,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { MasterProfile, ExperienceItem, EducationItem } from '../types';

interface ProfileEditorProps {
  profile: MasterProfile;
  onChange: (updated: MasterProfile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Keep JSON string synced with profile object
  useEffect(() => {
    try {
      setJsonText(JSON.stringify(profile, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  }, [profile]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed.personal_info &&
        Array.isArray(parsed.skills) &&
        Array.isArray(parsed.experience) &&
        Array.isArray(parsed.education)
      ) {
        setJsonError(null);
        onChange(parsed);
      } else {
        setJsonError('JSON must match schema: personal_info, skills, experience, education');
      }
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setJsonError(null);
      onChange(parsed);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  // Field change handlers
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...profile,
      personal_info: {
        ...profile.personal_info,
        [field]: value,
      },
    });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (trimmed.includes(',')) {
      const split = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      const unique = Array.from(new Set([...profile.skills, ...split]));
      onChange({ ...profile, skills: unique });
    } else if (!profile.skills.includes(trimmed)) {
      onChange({ ...profile, skills: [...profile.skills, trimmed] });
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Experience handlers
  const updateExperience = (index: number, updatedItem: ExperienceItem) => {
    const updated = [...profile.experience];
    updated[index] = updatedItem;
    onChange({ ...profile, experience: updated });
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      company: 'New Tech Corp',
      role: 'Senior Software Engineer',
      duration: '2022 - Present',
      bullet_points: [
        'Spearheaded key architecture improvements reducing latency and optimizing reliability.',
        'Collaborated across cross-functional product teams to deliver scalable features on time.',
      ],
    };
    onChange({ ...profile, experience: [newItem, ...profile.experience] });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    });
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, text: string) => {
    const exp = profile.experience[expIndex];
    const updatedBullets = [...exp.bullet_points];
    updatedBullets[bulletIndex] = text;
    updateExperience(expIndex, { ...exp, bullet_points: updatedBullets });
  };

  const addBulletPoint = (expIndex: number) => {
    const exp = profile.experience[expIndex];
    updateExperience(expIndex, {
      ...exp,
      bullet_points: [...exp.bullet_points, 'Engineered high-performance module delivering measurable business impact.'],
    });
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    const exp = profile.experience[expIndex];
    updateExperience(expIndex, {
      ...exp,
      bullet_points: exp.bullet_points.filter((_, i) => i !== bulletIndex),
    });
  };

  // Education handlers
  const updateEducation = (index: number, updatedItem: EducationItem) => {
    const updated = [...profile.education];
    updated[index] = updatedItem;
    onChange({ ...profile, education: updated });
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      year: '2020',
    };
    onChange({ ...profile, education: [...profile.education, newItem] });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col h-full">
      {/* Header with visual / json toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">1. Candidate Master Profile</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Parsed source of truth — companies, dates &amp; degrees are permanently locked for 100% factual integrity.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Form Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {activeTab === 'json' ? (
          /* JSON Mode */
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Edit or paste your candidate master profile JSON:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFormatJson}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Format JSON
                </button>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{jsonError}</span>
              </div>
            )}

            <div className="relative flex-1 min-h-[480px]">
              <textarea
                value={jsonText}
                onChange={handleJsonChange}
                rows={22}
                className="w-full h-full font-mono text-xs bg-slate-950 text-indigo-200/90 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none leading-relaxed resize-none"
                placeholder="Paste candidate master profile JSON here..."
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          /* Visual Form Mode */
          <div className="space-y-6">
            {/* Personal Details */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Personal Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.personal_info.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.personal_info.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profile.personal_info.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="+1 (555) 0192"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={profile.personal_info.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">Target Career Track / Focus</label>
                <input
                  type="text"
                  value={profile.target_career_track}
                  onChange={(e) => onChange({ ...profile, target_career_track: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Senior Distributed Systems & Cloud Architect"
                />
              </div>
            </div>

            {/* Skills Array */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Master Skills Inventory ({profile.skills.length})
                </span>
                <span className="text-[11px] text-slate-500">Comma-separated bulk add supported</span>
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Add skill (e.g. GraphQL, Kafka, Kubernetes)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                {profile.skills.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:border-slate-600 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-rose-400 transition-colors ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Work Experience ({profile.experience.length})
                </span>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3">
                {profile.experience.map((exp, expIdx) => (
                  <div
                    key={expIdx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 text-xs">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(expIdx, { ...exp, company: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-medium outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Role / Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(expIdx, { ...exp, role: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Duration</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => updateExperience(expIdx, { ...exp, duration: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {profile.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(expIdx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded hover:bg-slate-800"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Experience Accomplishment Bullets</span>
                        <button
                          type="button"
                          onClick={() => addBulletPoint(expIdx)}
                          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {exp.bullet_points.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-slate-500 text-xs mt-2">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateBulletPoint(expIdx, bIdx, e.target.value)}
                              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                            />
                            {exp.bullet_points.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(expIdx, bIdx)}
                                className="text-slate-600 hover:text-rose-400 p-1 mt-1 transition-colors"
                                title="Remove bullet"
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Education ({profile.education.length})
                </span>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-2">
                {profile.education.map((edu, eduIdx) => (
                  <div
                    key={eduIdx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                      <div>
                        <label className="text-[10px] text-slate-400 block">Degree / Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(eduIdx, { ...edu, degree: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(eduIdx, { ...edu, institution: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => updateEducation(eduIdx, { ...edu, year: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    {profile.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(eduIdx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete education"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
