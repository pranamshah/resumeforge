import { sql, ensureTables } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, limit: dailyLimit = 2 } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  const today = new Date().toISOString().split('T')[0];
  const docId = `${email}_${today}`;
  try {
    await ensureTables();
    const rows = await sql`SELECT count, first_use FROM daily_usage WHERE id = ${docId}`;
    if (rows.length > 0) {
      const { count, first_use } = rows[0];
      if (count >= dailyLimit) {
        const resetAt = new Date(new Date(first_use).getTime() + 24 * 60 * 60 * 1000);
        return res.json({ allowed: false, count, resetAt: resetAt.toISOString() });
      }
      await sql`UPDATE daily_usage SET count = count + 1, last_use = NOW() WHERE id = ${docId}`;
      return res.json({ allowed: true, count: count + 1 });
    }
    await sql`INSERT INTO daily_usage (id, email, date, count, first_use, last_use) VALUES (${docId}, ${email}, ${today}, 1, NOW(), NOW())`;
    return res.json({ allowed: true, count: 1 });
  } catch {
    return res.json({ allowed: true, count: 0 });
  }
}
