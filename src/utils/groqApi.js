import { DEFAULT_GEMINI_KEY } from '../config.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${DEFAULT_GEMINI_KEY}`;

// Strip nulls/empty arrays/empty strings to shrink JSON payload
const compressResume = (data, maxChars = 2500) => {
  const strip = (v) => {
    if (v === null || v === '' || v === false || v === undefined) return undefined;
    if (Array.isArray(v)) {
      const a = v.map(strip).filter(x => x !== undefined);
      return a.length ? a : undefined;
    }
    if (v && typeof v === 'object') {
      const o = Object.fromEntries(
        Object.entries(v).map(([k, val]) => [k, strip(val)]).filter(([, val]) => val !== undefined)
      );
      return Object.keys(o).length ? o : undefined;
    }
    return v;
  };
  return JSON.stringify(strip(data) ?? data).slice(0, maxChars);
};

// ── Groq ─────────────────────────────────────────────────────────────────────
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
    if (res.status === 401) throw new Error('Invalid Groq API key. Check your key.');
    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (res.status === 413) throw new Error('TOO_LARGE');
    throw new Error(err.error?.message || `Groq error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

// ── Gemini fallback ───────────────────────────────────────────────────────────
const callGemini = async ({ system, user }) => {
  if (!DEFAULT_GEMINI_KEY) throw new Error('No Gemini key — add VITE_GEMINI_KEY in Vercel env vars.');

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
    throw new Error(err.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
};

// ── Smart caller: Groq → lighter model → Gemini ───────────────────────────────
const callAI = async (apiKey, params) => {
  try {
    return await callGroq(apiKey, params);
  } catch (err) {
    const retriable = err.message === 'RATE_LIMIT' || err.message === 'TOO_LARGE';
    if (!retriable) throw err;

    // compound-beta → llama-3.3-70b-versatile first
    if (params.model === 'compound-beta') {
      try {
        return await callGroq(apiKey, { ...params, model: 'llama-3.3-70b-versatile' });
      } catch (e2) {
        if (e2.message !== 'RATE_LIMIT' && e2.message !== 'TOO_LARGE') throw e2;
      }
    }

    // Any model → Gemini
    if (DEFAULT_GEMINI_KEY) return await callGemini(params);

    throw new Error('Request too large or rate limited. Wait 30s and retry — or add a free Gemini backup key (VITE_GEMINI_KEY) in Vercel env vars.');
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
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: true,
    maxTokens: 2000,
    system: `Extract resume data. Return ONLY valid JSON, no markdown.
Schema: {"personal":{"name":"","email":"","phone":"","linkedin":"","github":"","website":"","location":"","summary":""},"experience":[{"company":"","title":"","location":"","startDate":"","endDate":"","current":false,"bullets":[]}],"education":[{"school":"","degree":"","field":"","endDate":"","gpa":""}],"skills":{"languages":[],"frameworks":[],"tools":[],"databases":[],"cloud":[],"other":[]},"projects":[{"name":"","description":"","techStack":[],"link":"","bullets":[]}],"certifications":[{"name":"","issuer":"","year":""}],"achievements":[]}`,
    user: `Extract from this resume text:\n\n${resumeText.slice(0, 4000)}`,
  });
  return parseJSON(text);
};

export const customizeResume = async (apiKey, resumeData, company, jobTitle, jobDescription) => {
  const resumeCompressed = compressResume(resumeData, 2000);
  const jd = (jobDescription || '').slice(0, 800);

  const text = await callAI(apiKey, {
    model: 'compound-beta',
    jsonMode: false,
    maxTokens: 3000,
    system: `Elite resume strategist. Search: "${company} ${jobTitle} requirements 2025" and "${company} culture values hiring".
Rewrite every bullet with: action verb + quantified result. Mirror ${company} language. Reorder skills for this role. Write a 2-3 sentence summary.
ATS score 0-100 (keywords 40pts, quantified bullets 20pts, completeness 20pts, section order 10pts, structure 10pts).
Return ONLY JSON: {"customized_resume":{"personal":{},"experience":[],"education":[],"skills":{},"projects":[],"certifications":[],"achievements":[]},"ats_score":0,"missing_skills":[],"key_changes":[],"top_hire_insights":{"typical_background":"","must_have_skills":[],"ats_keywords_found":[],"culture_signals":[]},"section_order":["personal","summary","skills","experience","projects","education","certifications"]}`,
    user: `Company: ${company} | Role: ${jobTitle}${jd ? `\nJD: ${jd}` : ''}\nResume: ${resumeCompressed}`,
  });
  return parseJSON(text);
};

export const refineResume = async (apiKey, currentResume, suggestion, company, jobTitle) => {
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: false,
    maxTokens: 2000,
    system: `Resume writer for ${jobTitle} at ${company}. Apply ONLY the requested change. Keep all other content identical. Return ONLY updated JSON, no markdown.`,
    user: `Resume: ${compressResume(currentResume, 2000)}\nChange: "${suggestion}"\nReturn updated JSON only.`,
  });
  return parseJSON(text);
};

export const suggestSkills = async (apiKey, experienceText) => {
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: true,
    maxTokens: 300,
    system: `Return JSON only: {"languages":[],"frameworks":[],"tools":[],"databases":[],"other":[]} Max 5 per category.`,
    user: `Skills for: ${experienceText.slice(0, 600)}`,
  });
  return parseJSON(text);
};

export const generateSummary = async (apiKey, resumeData, targetRole = '') => {
  const exp = resumeData.experience?.slice(0, 2).map(e => `${e.title} at ${e.company}`).join(', ') || '';
  const skills = [...(resumeData.skills?.languages || []), ...(resumeData.skills?.frameworks || [])].slice(0, 6).join(', ');
  const text = await callAI(apiKey, {
    model: 'llama-3.1-8b-instant',
    jsonMode: false,
    maxTokens: 150,
    system: `Write a 2-3 sentence professional summary. Return ONLY the text, no quotes.`,
    user: `Role: ${targetRole || 'professional'} | Experience: ${exp} | Skills: ${skills}`,
  });
  return text.trim();
};
