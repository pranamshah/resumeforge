import { ADMIN_EMAIL } from './config.js';

export const isAdmin = (user) => user?.email === ADMIN_EMAIL;

const post = async (path, body) => {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};

export const recordSignIn = async (email) => {
  try { await post('/api/record-signin', { email }); } catch (e) { console.warn('recordSignIn failed:', e.message); }
};

export const saveResumeRecord = async (user, { company, role, atsScore, flow }) => {
  try {
    await post('/api/save-resume', {
      email: user.email,
      name: user.displayName || user.email,
      company, role, atsScore, flow,
    });
  } catch (e) { console.warn('saveResumeRecord failed:', e.message); }
};

export const checkAndIncrementUsage = async (email, dailyLimit = 2) => {
  try {
    const data = await post('/api/check-usage', { email, limit: dailyLimit });
    if (!data.allowed) {
      return { allowed: false, count: data.count, resetAt: new Date(data.resetAt) };
    }
    return { allowed: true, count: data.count };
  } catch {
    return { allowed: true, count: 0 };
  }
};

export const getAdminStats = async () => {
  const res = await fetch('/api/admin-stats');
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
};
