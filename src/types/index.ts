export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  bullet_points: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface MasterProfile {
  personal_info: PersonalInfo;
  target_career_track: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface MissingKeyword {
  keyword: string;
  category: string;
  importance: 'Critical' | 'High' | 'Medium' | string;
  strategicTip: string;
}

export interface SkillsCategory {
  categoryName: string;
  skills: string[];
}

export interface TailoredResume {
  rawMarkdown: string;
  professionalSummary: string;
  skillsCategories: SkillsCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface CoverLetter {
  rawMarkdown: string;
  recipient: string;
  salutation: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  signoff: string;
}

export interface FactualIntegrityAudit {
  isVerified: boolean;
  auditStatement: string;
  preservedCompaniesCount: number;
  preservedDegreesCount: number;
}

export interface SkillsAnalysis {
  hardSkillsMatchRate: number;
  experienceMatchRate: number;
  domainMatchRate: number;
}

export interface AnalysisResult {
  score: number;
  scoreCategory: string;
  matchSummary: string;
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
  skillsAnalysis: SkillsAnalysis;
  tailoredResume: TailoredResume;
  coverLetter: CoverLetter;
  factualIntegrityAudit: FactualIntegrityAudit;
}

export interface SavedAnalysisRecord {
  id: string;
  timestamp: string;
  candidateName: string;
  targetRole: string;
  companyName: string;
  score: number;
  profile: MasterProfile;
  jobDescription: string;
  result: AnalysisResult;
}
