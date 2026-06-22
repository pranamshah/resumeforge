import { sql } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    await sql`
      INSERT INTO signins (email, first_seen, last_active_at, sign_in_count)
      VALUES (${email}, NOW(), NOW(), 1)
      ON CONFLICT (email) DO UPDATE SET
        last_active_at = NOW(),
        sign_in_count = signins.sign_in_count + 1
    `;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
