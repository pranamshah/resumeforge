const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const callGroq = async (apiKey, { model, system, user, jsonMode = false }) => {
  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
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
    if (res.status === 429) throw new Error('Rate limit hit. Wait 30 seconds and retry.');
    throw new Error(msg);
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

const parseJSON = (text) => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
};

export const extractResumeFromText = async (apiKey, resumeText) => {
  const text = await callGroq(apiKey, {
    model: 'llama-3.3-70b-versatile',
    jsonMode: true,
    system: `You are a precise resume data extractor. Extract ALL information from the resume text provided.
Return ONLY valid JSON. No markdown. No explanation. Use null for missing fields, [] for missing arrays.

Return this exact JSON structure:
{
  "personal": { "name":"","email":"","phone":"","linkedin":"","github":"","website":"","location":"","summary":"" },
  "experience": [{ "company":"","title":"","location":"","startDate":"","endDate":"","current":false,"bullets":[] }],
  "education": [{ "school":"","degree":"","field":"","startDate":"","endDate":"","gpa":"","achievements":[] }],
  "skills": { "languages":[],"frameworks":[],"tools":[],"databases":[],"cloud":[],"other":[] },
  "projects": [{ "name":"","description":"","techStack":[],"link":"","bullets":[] }],
  "certifications": [{ "name":"","issuer":"","year":"","link":"" }],
  "achievements": []
}`,
    user: `Extract all resume data from this text:\n\n${resumeText}`,
  });
  return parseJSON(text);
};

export const customizeResume = async (apiKey, resumeData, company, jobTitle, jobDescription) => {
  const text = await callGroq(apiKey, {
    model: 'compound-beta',
    jsonMode: false,
    system: `You are an elite resume strategist and ATS optimization expert.

TASK: Research the target company and role, then completely customize the resume.

STEP 1 — RESEARCH (search the web for all of these):
- "${company} ${jobTitle} job requirements must-have skills 2025"
- "${company} hiring culture values what they look for employees"
- "top hired ${jobTitle} at ${company} background experience"
- "${jobTitle} resume ATS keywords optimization 2025"

STEP 2 — CUSTOMIZE THE RESUME:

BULLET REWRITING RULES:
- Every bullet starts with a strong past-tense action verb: Led, Built, Reduced, Increased, Shipped, Designed, Automated, Optimized, Launched, Managed, Implemented
- Quantify every metric possible: "Reduced API latency by 45%" not "Improved performance"
- Match language from ${company}'s own job postings
- STAR format: context → action → quantified result

SKILLS OPTIMIZATION:
- Group: Languages | Frameworks | Tools | Cloud | Databases
- Put most relevant for ${jobTitle} first
- Remove skills unrelated to this role

PROFESSIONAL SUMMARY:
- 2-3 sentences max
- Mention years of exp + key domain + standout achievement
- Mirror ${company}'s tone subtly — do NOT name ${company} explicitly

ATS SCORE (0-100):
- Keyword match: 40 pts | Quantified bullets: 20 pts | Section completeness: 20 pts | Section order: 10 pts | Structure: 10 pts

RETURN ONLY THIS JSON (no markdown, no backticks, no explanation):
{
  "customized_resume": { "personal":{},"experience":[],"education":[],"skills":{},"projects":[],"certifications":[],"achievements":[] },
  "ats_score": number,
  "missing_skills": [],
  "key_changes": [],
  "top_hire_insights": {
    "typical_background": "",
    "must_have_skills": [],
    "nice_to_have_skills": [],
    "ats_keywords_found": [],
    "culture_signals": []
  },
  "section_order": ["personal","summary","skills","experience","projects","education","certifications"]
}`,
    user: `Resume Data:\n${JSON.stringify(resumeData, null, 2)}\n\nTarget Company: ${company}\nTarget Role: ${jobTitle}\nJob Description: ${jobDescription || 'Not provided. Use web search to find current JD for this role at this company.'}\n\nResearch this company and role using web search, then customize the resume. Return JSON only.`,
  });
  return parseJSON(text);
};

export const suggestSkills = async (apiKey, experienceText) => {
  const text = await callGroq(apiKey, {
    model: 'llama-3.3-70b-versatile',
    jsonMode: true,
    system: `Return ONLY a JSON object with skill suggestions based on the experience text.
Format: {"languages":[],"frameworks":[],"tools":[],"databases":[],"other":[]}
Max 5-6 items per category. Only suggest skills clearly implied by the experience.`,
    user: `Suggest skills based on this experience:\n${experienceText}`,
  });
  return parseJSON(text);
};

export const refineResume = async (apiKey, currentResume, suggestion, company, jobTitle) => {
  const text = await callGroq(apiKey, {
    model: 'llama-3.3-70b-versatile',
    jsonMode: false,
    system: `You are an expert resume writer refining a resume for a ${jobTitle} role at ${company}.
Apply ONLY the specific change the user requests. Keep all other content identical.
Return ONLY the updated resume JSON using the same structure as the input. No markdown, no backticks, no explanation.`,
    user: `Current resume:\n${JSON.stringify(currentResume, null, 2)}\n\nUser requested change: "${suggestion}"\n\nReturn updated resume JSON only.`,
  });
  return parseJSON(text);
};

export const generateSummary = async (apiKey, resumeData, targetRole = '') => {
  const text = await callGroq(apiKey, {
    model: 'llama-3.3-70b-versatile',
    jsonMode: false,
    system: `Write a professional resume summary. Return ONLY the summary text, 2-3 sentences. No quotes, no JSON, no explanation.`,
    user: `Write a summary for: ${targetRole ? `a ${targetRole} role` : 'a professional resume'}
Experience: ${resumeData.experience?.slice(0, 2).map(e => `${e.title} at ${e.company}`).join(', ')}
Top skills: ${[...(resumeData.skills?.languages || []), ...(resumeData.skills?.frameworks || [])].slice(0, 8).join(', ')}
Make it punchy, specific, achievement-focused.`,
  });
  return text.trim();
};
