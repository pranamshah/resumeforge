import { sql, ensureTables } from './_db.js';

export default async function handler(req, res) {
  try {
    await ensureTables();
    const [signinRows, resumeRows] = await Promise.all([
      sql`SELECT email, first_seen, last_active_at, sign_in_count FROM signins ORDER BY last_active_at DESC`,
      sql`SELECT user_email, user_name, target_company, target_role, ats_score, flow, created_at FROM resumes ORDER BY created_at DESC LIMIT 100`,
    ]);

    const resumeCountByEmail = {};
    const lastActiveByEmail = {};
    for (const r of resumeRows) {
      resumeCountByEmail[r.user_email] = (resumeCountByEmail[r.user_email] || 0) + 1;
      if (!lastActiveByEmail[r.user_email]) lastActiveByEmail[r.user_email] = r.created_at;
    }

    const recentResumes = resumeRows.slice(0, 20).map(r => ({
      userEmail: r.user_email,
      userName: r.user_name,
      targetCompany: r.target_company,
      targetRole: r.target_role,
      atsScore: r.ats_score,
      flow: r.flow,
      createdAt: r.created_at,
    }));

    const emailSet = new Set([...signinRows.map(s => s.email), ...Object.keys(resumeCountByEmail)]);
    const topUsers = [...emailSet].map(email => {
      const signin = signinRows.find(s => s.email === email);
      return {
        email,
        resumeCount: resumeCountByEmail[email] || 0,
        lastActiveAt: lastActiveByEmail[email] || signin?.last_active_at || signin?.first_seen || null,
        firstSeen: signin?.first_seen || null,
        signInCount: signin?.sign_in_count || 1,
      };
    }).sort((a, b) => b.resumeCount - a.resumeCount);

    res.json({
      stats: { totalUsers: emailSet.size, totalResumes: resumeRows.length },
      recentResumes,
      topUsers,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
