import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateHeuristicAnalysis } from './src/utils/atsEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { profile, jobDescription, targetRole, companyName } = req.body;

    if (!profile || !jobDescription) {
      return res.status(400).json({ error: 'Candidate profile and job description are required.' });
    }

    let geminiSuccess = false;
    let parsedResult = null;

    if (process.env.GEMINI_API_KEY) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const systemInstruction = `You are an elite AI Career Strategist and ATS Optimization Engine.
Core Operational Directives:
1. ABSOLUTE FACTUAL INTEGRITY: Never fabricate companies, employment dates, job titles, or educational degrees.
2. ATS OPTIMIZATION & FORMATTING: Use clean single-column structure with standard headings.
3. TAILORED ALIGNMENT: Directly bridge candidate stack with JD pain points.
4. COVER LETTER SPECIFICATION: 3-paragraph professional letter addressed to hiring manager.`;

          const prompt = `Perform full ATS evaluation.
PROFILE: ${JSON.stringify(profile)}
TARGET ROLE: ${targetRole || 'Target Role'}
TARGET COMPANY: ${companyName || 'Target Corp'}
JOB DESCRIPTION: ${jobDescription}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  scoreCategory: { type: Type.STRING },
                  matchSummary: { type: Type.STRING },
                  missingKeywords: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        keyword: { type: Type.STRING },
                        category: { type: Type.STRING },
                        importance: { type: Type.STRING },
                        strategicTip: { type: Type.STRING },
                      },
                      required: ['keyword', 'category', 'importance', 'strategicTip'],
                    },
                  },
                  matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skillsAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      hardSkillsMatchRate: { type: Type.INTEGER },
                      experienceMatchRate: { type: Type.INTEGER },
                      domainMatchRate: { type: Type.INTEGER },
                    },
                    required: ['hardSkillsMatchRate', 'experienceMatchRate', 'domainMatchRate'],
                  },
                  tailoredResume: {
                    type: Type.OBJECT,
                    properties: {
                      rawMarkdown: { type: Type.STRING },
                      professionalSummary: { type: Type.STRING },
                      skillsCategories: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            categoryName: { type: Type.STRING },
                            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ['categoryName', 'skills'],
                        },
                      },
                      experience: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            company: { type: Type.STRING },
                            role: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            bullet_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ['company', 'role', 'duration', 'bullet_points'],
                        },
                      },
                      education: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            degree: { type: Type.STRING },
                            institution: { type: Type.STRING },
                            year: { type: Type.STRING },
                          },
                          required: ['degree', 'institution', 'year'],
                        },
                      },
                    },
                    required: ['rawMarkdown', 'professionalSummary', 'skillsCategories', 'experience', 'education'],
                  },
                  coverLetter: {
                    type: Type.OBJECT,
                    properties: {
                      rawMarkdown: { type: Type.STRING },
                      recipient: { type: Type.STRING },
                      salutation: { type: Type.STRING },
                      paragraph1: { type: Type.STRING },
                      paragraph2: { type: Type.STRING },
                      paragraph3: { type: Type.STRING },
                      signoff: { type: Type.STRING },
                    },
                    required: ['rawMarkdown', 'recipient', 'salutation', 'paragraph1', 'paragraph2', 'paragraph3', 'signoff'],
                  },
                  factualIntegrityAudit: {
                    type: Type.OBJECT,
                    properties: {
                      isVerified: { type: Type.BOOLEAN },
                      auditStatement: { type: Type.STRING },
                      preservedCompaniesCount: { type: Type.INTEGER },
                      preservedDegreesCount: { type: Type.INTEGER },
                    },
                    required: ['isVerified', 'auditStatement', 'preservedCompaniesCount', 'preservedDegreesCount'],
                  },
                },
                required: [
                  'score',
                  'scoreCategory',
                  'matchSummary',
                  'missingKeywords',
                  'matchedKeywords',
                  'skillsAnalysis',
                  'tailoredResume',
                  'coverLetter',
                  'factualIntegrityAudit',
                ],
              },
            },
          });

          if (response.text) {
            parsedResult = JSON.parse(response.text);
            geminiSuccess = true;
            break;
          }
        } catch (apiErr: any) {
          console.warn(`Gemini API attempt ${attempt + 1}:`, apiErr.message || apiErr);
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      }
    }

    // High-fidelity fallback engine
    if (!geminiSuccess || !parsedResult) {
      parsedResult = generateHeuristicAnalysis(profile, jobDescription, targetRole, companyName);
    }

    res.json({ success: true, data: parsedResult });
  } catch (error: any) {
    console.error('ATS analysis error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while evaluating the resume against the job description.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
