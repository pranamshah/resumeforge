// Your Gmail — this account gets admin dashboard access
export const ADMIN_EMAIL = "shahpranam31@gmail.com";

// Reads from Vercel environment variable VITE_GROQ_KEY
export const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_KEY || "";

// Fallback AI — add VITE_GEMINI_KEY in Vercel env vars (free at aistudio.google.com)
export const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";
