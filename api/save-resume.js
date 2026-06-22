import { sql, ensureTables } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, name, company, role, atsScore, flow } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    await ensureTables();
    await sql`
      INSERT INTO resumes (user_email, user_name, target_company, target_role, ats_score, flow)
      VALUES (${email}, ${name ?? email}, ${company ?? null}, ${role ?? null}, ${atsScore ?? null}, ${flow ?? null})
    `;
    await sql`UPDATE signins SET last_active_at = NOW() WHERE email = ${email}`.catch(() => {});
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
