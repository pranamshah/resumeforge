import { DEFAULT_GEMINI_KEY } from '../config.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${DEFAULT_GEMINI_KEY}`;

// ── Groq call ────────────────────────────────────────────────────────────────
const callGroq = async (apiKey, { model, system, user, jsonMode = false, maxTokens = 2048 }) => {
  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
    max_tokens: maxTokens,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error?.message || `Groq API Error: ${res.status}`;
    if (res.status === 401) throw new Error('Invalid Groq API key. Check your key.');
    if (res.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(msg);
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

// ── Gemini fallback ───────────────────────────────────────────────────────────
const callGemini = async ({ system, user }) => {
  if (!DEFAULT_GEMINI_KEY) throw new Error('No Gemini key configured');

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 3000 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
};

// ── Smart caller: Groq → fallback model → Gemini ─────────────────────────────
const callAI = async (apiKey, params) => {
  try {
    return await callGroq(apiKey, params);
  } catch (err) {
    if (err.message !== 'RATE_LIMIT') throw err;

    // If using compound-beta, retry with cheaper model first
    if (params.model === 'compound-beta') {
      try {
        console.warn('compound-beta rate limited, trying llama-3.3-70b-versatile');
        return await callGroq(apiKey, { ...params, model: 'llama-3.3-70b-versatile' });
      } catch (err2) {
        if (err2.message !== 'RATE_LIMIT') throw err2;
      }
    }

    // Try Gemini if key is set
    if (DEFAULT_GEMINI_KEY) {
      console.warn('Groq rate limited, falling back to Gemini');
      return await callGemini(params);
    }

    throw new Error('Rate limit hit. Wait 30 seconds and retry, or add a Gemini backup key in settings.');
  }
};

// ── JSON parser ───────────────────────────────────────────────────────────────
const parseJSON = (text) => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
};

// ── Public API ────────────────────────────────────────────────────────────────

export const extractResumeFromText = async (apiKey, resumeText) => {
  // Use fast small model — extraction is straightforward, doesn't need 70B
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: true,
    maxTokens: 2000,
    system: `Extract ALL resume data. Return ONLY valid JSON, no markdown.
{
  "personal": {"name":"","email":"","phone":"","linkedin":"","github":"","website":"","location":"","summary":""},
  "experience": [{"company":"","title":"","location":"","startDate":"","endDate":"","current":false,"bullets":[]}],
  "education": [{"school":"","degree":"","field":"","startDate":"","endDate":"","gpa":"","achievements":[]}],
  "skills": {"languages":[],"frameworks":[],"tools":[],"databases":[],"cloud":[],"other":[]},
  "projects": [{"name":"","description":"","techStack":[],"link":"","bullets":[]}],
  "certifications": [{"name":"","issuer":"","year":"","link":""}],
  "achievements": []
}
Use null for missing fields, [] for missing arrays.`,
    user: `Extract resume data:\n\n${resumeText.slice(0, 6000)}`,
  });
  return parseJSON(text);
};

export const customizeResume = async (apiKey, resumeData, company, jobTitle, jobDescription) => {
  const text = await callAI(apiKey, {
    model: 'compound-beta',
    jsonMode: false,
    maxTokens: 3000,
    system: `You are an elite resume strategist. Research ${company} and customize the resume for a ${jobTitle} role.

SEARCH FOR: "${company} ${jobTitle} requirements 2025" + "${company} culture hiring values"

REWRITE RULES:
- Every bullet: strong action verb + quantified result (e.g. "Reduced latency 45% by optimizing queries")
- Match ${company}'s language and culture signals from your research
- Summary: 2-3 sentences, achievement-focused, mirrors ${company}'s tone
- Skills: reorder to put most relevant for this role first

ATS SCORE 0-100: keyword match (40pts) + quantified bullets (20pts) + completeness (20pts) + section order (10pts) + structure (10pts)

Return ONLY this JSON (no markdown):
{"customized_resume":{"personal":{},"experience":[],"education":[],"skills":{},"projects":[],"certifications":[],"achievements":[]},"ats_score":0,"missing_skills":[],"key_changes":[],"top_hire_insights":{"typical_background":"","must_have_skills":[],"ats_keywords_found":[],"culture_signals":[]},"section_order":["personal","summary","skills","experience","projects","education","certifications"]}`,
    user: `Resume:\n${JSON.stringify(resumeData, null, 1).slice(0, 4000)}\n\nCompany: ${company}\nRole: ${jobTitle}\nJD: ${(jobDescription || 'Search for current JD online').slice(0, 1000)}`,
  });
  return parseJSON(text);
};

export const refineResume = async (apiKey, currentResume, suggestion, company, jobTitle) => {
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: false,
    maxTokens: 2000,
    system: `Expert resume writer. Apply ONLY the requested change to this ${jobTitle} resume for ${company}. Keep everything else identical. Return ONLY updated JSON, no markdown.`,
    user: `Resume:\n${JSON.stringify(currentResume, null, 1).slice(0, 4000)}\n\nChange: "${suggestion}"\n\nReturn updated JSON only.`,
  });
  return parseJSON(text);
};

export const suggestSkills = async (apiKey, experienceText) => {
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: true,
    maxTokens: 400,
    system: `Return JSON skill suggestions only: {"languages":[],"frameworks":[],"tools":[],"databases":[],"other":[]} Max 5 items per category.`,
    user: `Suggest skills for: ${experienceText.slice(0, 800)}`,
  });
  return parseJSON(text);
};

export const generateSummary = async (apiKey, resumeData, targetRole = '') => {
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: false,
    maxTokens: 200,
    system: `Write a 2-3 sentence professional resume summary. Return ONLY the summary text, no quotes.`,
    user: `Role: ${targetRole || 'professional'}\nExperience: ${resumeData.experience?.slice(0, 2).map(e => `${e.title} at ${e.company}`).join(', ')}\nSkills: ${[...(resumeData.skills?.languages || []), ...(resumeData.skills?.frameworks || [])].slice(0, 8).join(', ')}`,
  });
  return text.trim();
};
