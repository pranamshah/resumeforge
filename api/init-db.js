import { sql } from './_db.js';

export default async function handler(req, res) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS signins (
        email TEXT PRIMARY KEY,
        first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        sign_in_count INTEGER NOT NULL DEFAULT 1
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL,
        user_name TEXT,
        target_company TEXT,
        target_role TEXT,
        ats_score INTEGER,
        flow TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS daily_usage (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        date TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        first_use TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_use TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    res.json({ ok: true, message: 'Tables created' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
